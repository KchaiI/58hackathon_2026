from fastapi import APIRouter
from . import listings, ownerships, producers

router = APIRouter(prefix="/v1")

router.include_router(listings.router, prefix="/listings")
router.include_router(ownerships.router, prefix="/ownerships")
router.include_router(producers.router, prefix="/producers")
