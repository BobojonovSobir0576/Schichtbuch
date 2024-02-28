from datetime import datetime

from sqlalchemy.dialects.mysql import JSON

from .database import Base, BaseDB2
from sqlalchemy import TIMESTAMP, Column, String, Enum, Text, Integer, ForeignKey

class Items(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)
    date = Column(TIMESTAMP(timezone=True), default=None)
    ma = Column(String(4), nullable=False)
    machine = Column(JSON, nullable=True)
    status = Column(String, nullable=False, default='info')
    operation_order_number = Column(Integer, nullable=True)
    image = Column(Text, nullable=True)


class Notes(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True)
    item_id = Column(Integer, ForeignKey("items.id", ondelete='CASCADE'))
    note = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)


class Baufrn(BaseDB2):
    __tablename__ = 'baufrn'

    id = Column(Integer, primary_key=True)
    partname = Column(Text, nullable=False)
    partnr = Column(Text, nullable=False)
    baufrn = Column(Text, nullable=False)
    pos = Column(Text, nullable=False)