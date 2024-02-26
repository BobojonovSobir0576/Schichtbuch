from fastapi import APIRouter

from .items.items import item_router

router = APIRouter()

router.include_router(router=item_router, tags=['Items'], prefix='/items')
