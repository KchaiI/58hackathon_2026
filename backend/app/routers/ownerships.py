from fastapi import APIRouter, HTTPException, Query
from typing import cast, Any
from app.database import supabase
from app.schemas import OwnershipCreate
from postgrest.exceptions import APIError
from typing import cast
from app.models import ListingRow

router = APIRouter()

@router.get("/")
def get_ownerships(email: str = Query(...)) -> list[Any]:
    res = supabase.from_("ownerships") \
        .select("*, listings(id, title, crop, image_url, harvest_date, created_at, producers(name, location))") \
        .eq("owner_email", email) \
        .order("created_at", desc=True) \
        .execute()
    return res.data or []

@router.post("/", status_code=201)
def create_ownership(body: OwnershipCreate):
    try:
        listing = supabase.from_("listings") \
        .select("available_slots") \
        .eq("id", str(body.listing_id)) \
        .maybe_single() \
        .execute()
    except APIError:
        raise HTTPException(status_code=422, detail="不正なIDです")
    
    if listing is None:
        raise HTTPException(status_code=404, detail="枠が見つかりません")

    data = cast(ListingRow, listing.data)

    if not isinstance(data, dict):
        raise HTTPException(status_code=404, detail="枠が見つかりません")
    
    if data["available_slots"] <= 0:
        raise HTTPException(status_code=409, detail="この枠は満員です")

    supabase.from_("ownerships").insert({
        "listing_id": str(body.listing_id),
        "owner_name": body.owner_name,
        "owner_email": body.owner_email,
        "slots": 1,
    }).execute()

    supabase.from_("listings").update({
        "available_slots": data["available_slots"] - 1
    }).eq("id", body.listing_id).execute()

    return {"success": True}
