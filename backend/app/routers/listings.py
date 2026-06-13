from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.schemas import ListingResponse
from typing import cast
from app.models import ListingWithProducerRow
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[ListingResponse])
def get_listings():
    res = supabase.from_("listings") \
        .select("*, producers(name, location)") \
        .gt("available_slots", 0) \
        .order("created_at", desc=True) \
        .execute()
    
    data = cast(list[ListingWithProducerRow], res.data)

    return data

@router.get("/{id}", response_model=ListingResponse)
def get_listing(id: UUID):
    res = supabase.from_("listings") \
        .select("*, producers(name, location, description)") \
        .eq("id", str(id)) \
        .maybe_single() \
        .execute()

    if res is None:
        raise HTTPException(status_code=404, detail="Not found")
    
    data = cast(ListingWithProducerRow, res.data)

    return data
