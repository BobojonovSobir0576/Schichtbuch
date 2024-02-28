from datetime import datetime, date
from typing import List, Optional
from fastapi import Form
from pydantic import BaseModel, Field, constr


class BaufrnSchema(BaseModel):
    id: int
    partname: str
    partnr: str
    baufrn: str
    pos: str

    class Config:
        orm_mode = True


class ItemBaseSchema(BaseModel):
    id: Optional[int] = None
    date: Optional[datetime] = None
    ma: Optional[str] = Field(None, max_length=4)
    machine: List[str] = []
    operation_order_number: Optional[int] = Field(default=None)
    notes: List[str] = []
    status: str
    image: Optional[str] = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

    @classmethod
    def as_form(
        cls,
        date: Optional[str] = Form(None),
        ma: Optional[str] = Form(None),
        machine: List[str] = Form([]),
        operation_order_number: Optional[int] = Form(None),
        status: str = Form(...),
        notes: List[str] = Form([])
    ):
        return cls(date=date, ma=ma, machine=machine, operation_order_number=operation_order_number, status=status, notes=notes)


class UpdateItemSchema(BaseModel):
    notes: list = List[str]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

    @classmethod
    def as_form(cls, notes: list = Form(...)):
        return cls(notes=notes)


class GetItemsParams:
    def __init__(self, limit: int = 10, page: int = 1, from_date: date = None, to_date: date = None,
                 status: str = '', ma: str = '', machine: str = '', operation_order_number : int = "",
                 sortBy: constr(regex=r'^(ma|status|date|machine)$') = 'id',
                 sortOrder: constr(regex=r'^(asc|desc)$') = 'desc'):
        self.limit = limit
        self.page = page
        self.from_date = from_date
        self.to_date = to_date
        self.status = status
        self.ma = ma
        self.operation_order_number = operation_order_number
        self.machine = machine
        self.sortBy = sortBy
        self.sortOrder = sortOrder
