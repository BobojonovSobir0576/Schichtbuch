from datetime import datetime
import os
from typing import Optional

from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy import text
from sqlalchemy.orm import Session

from configs import models
from configs.database import get_db, get_db2
from . import schemas
from .schemas import GetItemsParams, BaufrnSchema
import pandas as pd
from io import BytesIO


item_router = APIRouter()


def get_part_number_name(id_number : int, db: Session):
    baufnr = int(str(id_number)[:6])
    pos = int(str(id_number)[-3:])
    filter_data = db.query(models.Baufrn).filter_by(
        baufrn=baufnr,
        pos=pos
    ).first()

    if filter_data:
        return filter_data.partname, filter_data.partnr
    else:
        return '', ''


@item_router.get('/', status_code=status.HTTP_200_OK)
async def get_items(params: GetItemsParams = Depends(GetItemsParams),
                    db: Session = Depends(get_db),
                    db2: Session = Depends(get_db2)):
    skip = (params.page - 1) * params.limit
    query = db.query(models.Items)
    print(query)
    if params.from_date:
        query = query.filter(models.Items.date >= params.from_date)

    if params.to_date:
        query = query.filter(models.Items.date <= params.to_date)

    if params.status:
        print(1)
        query = query.filter(models.Items.status == params.status)

    if params.ma:
        query = query.filter(models.Items.ma == params.ma)

    if params.machine:
        query = query.filter(models.Items.machine.contains([params.machine]))

    if params.sortBy:
        query = query.order_by(text(f'{params.sortBy} {params.sortOrder}'))

    if params.operation_order_number:
        query = query.filter(models.Items.operation_order_number == params.operation_order_number)


    items = query.limit(params.limit).offset(skip).all()

    data = []
    for i in items:
        notes = db.query(models.Notes.note, models.Notes.created_at).filter(models.Notes.item_id == i.id).all()

        notes = [{'note': j[0], 'created_at': j[1]} for j in notes]
        partname, partnr = get_part_number_name(i.operation_order_number, db2)

        item = {'id': i.id, 'date': i.date, 'ma': i.ma, 'machine': i.machine, 'partnr': partnr, 'partname': partname, 'notes': notes, 'image': i.image,
                'status': i.status}
        data.append(item)

    all_items = len(query.all())
    return {'status': status.HTTP_200_OK, 'results': len(items), "length": all_items, 'items': data}


@item_router.get('/ma', status_code=status.HTTP_200_OK)
async def get_items_ma(db: Session = Depends(get_db)):
    ma = db.query(models.Items.ma).distinct().all()

    ma = [i['ma'] for i in ma]

    return {'status': status.HTTP_200_OK, 'ma': ma}


@item_router.post('/', status_code=status.HTTP_201_CREATED)
async def create_item(payload: schemas.ItemBaseSchema = Depends(schemas.ItemBaseSchema.as_form),
                      file: Optional[UploadFile] = File(None),
                      db: Session = Depends(get_db),
                      db2: Session = Depends(get_db2)):
    date = datetime.now().strftime('%Y/%m')
    dirs = f'assets/files/{date}'

    os.makedirs(dirs, exist_ok=True)
    data = payload.dict()
    print(data)
    if file:
        content = file.file.read()

        with open(f'{dirs}/{file.filename}', 'wb') as out_file:
            out_file.write(content)

        data['image'] = f'{dirs}/{file.filename}'

    notes = data.pop('notes')

    new_item = models.Items(**data)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    # static_baufrn_data = models.Baufrn(
    #     partname="Static Part Name",
    #     partnr="StaticPartNr123",
    #     baufrn="803385",
    #     pos="1"
    # )
    # db2.add(static_baufrn_data)
    # db2.commit()
    # db2.refresh(static_baufrn_data)

    note_data = [models.Notes(item_id=new_item.id, note=i) for i in notes]
    db.bulk_save_objects(note_data)
    db.commit()
    db.refresh(new_item)
    return await get_item(item_id=new_item.id, db=db)


@item_router.patch('/{item_id}', status_code=status.HTTP_200_OK)
async def update_item(item_id: int, payload: schemas.UpdateItemSchema = Depends(schemas.UpdateItemSchema.as_form),
                      db: Session = Depends(get_db)):
    note_data = [models.Notes(item_id=item_id, note=i) for i in payload.notes]
    db.bulk_save_objects(note_data)

    db.commit()
    return await get_item(item_id=item_id, db=db)


@item_router.get('/{item_id}', status_code=status.HTTP_200_OK)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Items).filter(
        models.Items.id == item_id).first()
    notes = db.query(models.Notes.note, models.Notes.created_at).filter(models.Notes.item_id == item_id).all()

    notes = [{'note': i[0], 'created_at': i[1]} for i in notes]

    item = {'id': item.id, 'ma': item.ma, 'machine': item.machine, 'notes': notes, 'image': item.image,
            'status': item.status}

    return {'status': status.HTTP_200_OK, 'item': item}


@item_router.delete('/{item_id}', status_code=status.HTTP_200_OK)
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    db.query(models.Items).filter(models.Items.id == item_id).delete()
    return {'status': status.HTTP_200_OK, 'message': f'Item deleted!'}
