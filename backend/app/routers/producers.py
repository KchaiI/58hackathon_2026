from fastapi import APIRouter, HTTPException
from typing import cast
from app.database import supabase
from app.schemas import ListingCreate
from app.models import ProducerRow, ListingRow

router = APIRouter()

@router.post("/", status_code=201)
def create_producer_and_listing(body: ListingCreate):
    producer_res = supabase.from_("producers").insert({
        "name": body.producerName,
        "location": body.location,
    }).select().execute()

    if not producer_res.data:
        raise HTTPException(status_code=500, detail="生産者の登録に失敗しました")

    producer = cast(ProducerRow, producer_res.data[0])

    listing_res = supabase.from_("listings").insert({
        "producer_id": str(producer["id"]),
        "title": body.title,
        "crop": body.crop,
        "description": body.description,
        "price": body.price,
        "total_slots": body.totalSlots,
        "available_slots": body.totalSlots,
        "harvest_date": body.harvestDate,
        "image_url": body.imageUrl,
    }).select().execute()

    if not listing_res.data:
        raise HTTPException(status_code=500, detail="出品の登録に失敗しました")

    return cast(ListingRow, listing_res.data[0])