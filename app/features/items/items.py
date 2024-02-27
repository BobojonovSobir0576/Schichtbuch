from datetime import datetime
import os
from typing import Optional

from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy import text
from sqlalchemy.orm import Session

from configs import models
from configs.database import get_db
from . import schemas
from .schemas import GetItemsParams
import pandas as pd
from io import BytesIO

item_router = APIRouter()

def read_excel_file(id_number):
    baufnr = int(str(id_number)[:6])
    pos = int(str(id_number)[-3:])
    file_path = r'C:\Users\admin\Desktop\523\Schichtbuch\app\testdata\Testdata.xlsx'
    df = pd.read_excel(file_path)
    found_rows = []
    for index, row in df.iterrows():
        if int(row['Baufnr']) == baufnr and int(row['Pos']) == pos:
            found_rows.append({'Partnumber': row['Partnumber'], 'Partname': row['Partname']})
    return found_rows if found_rows else None



@item_router.get('/', status_code=status.HTTP_200_OK)
async def get_items(params: GetItemsParams = Depends(GetItemsParams),
                    db: Session = Depends(get_db)):
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
        result = read_excel_file(i.operation_order_number)
        item = {'id': i.id, 'date': i.date, 'ma': i.ma, 'machine': i.machine, 'partnr': result[0]['Partnumber'] if result else '', 'partname':  result[0]['Partname'] if result else '', 'notes': notes, 'image': i.image,
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
                      db: Session = Depends(get_db)):
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
