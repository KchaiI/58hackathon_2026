from fastapi import APIRouter, HTTPException, Query
from typing import cast, Any
from app.database import supabase
from app.schemas import ListingResponse
from typing import cast
from app.models import ListingWithProducerRow
from uuid import UUID

router = APIRouter()

@router.get("/")
def get_listings(producer_id: str | None = Query(default=None)) -> list[Any]:
    if producer_id:
        res = supabase.from_("listings") \
            .select("*, ownerships(user_id, profiles(name, email))") \
            .eq("producer_id", producer_id) \
            .order("created_at", desc=True) \
            .execute()
    else:
        res = supabase.from_("listings") \
            .select("*, producers(name, location)") \
            .gt("available_slots", 0) \
            .order("created_at", desc=True) \
            .execute()
        
    return res.data or []

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
