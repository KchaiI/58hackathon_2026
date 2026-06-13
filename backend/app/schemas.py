from uuid import UUID
from pydantic import BaseModel

class ProducerInfo(BaseModel):
    name: str
    location: str | None = None
    description: str | None = None

class ListingResponse(BaseModel):
    id: str
    title: str
    crop: str
    description: str | None = None
    price: int
    total_slots: int
    available_slots: int
    image_url: str | None = None
    harvest_date: str | None = None
    producers: ProducerInfo | None = None

class ListingCreate(BaseModel):
    user_id: UUID
    producerName: str
    location: str | None = None
    title: str
    crop: str
    description: str | None = None
    price: int
    totalSlots: int
    harvestDate: str | None = None
    imageUrl: str | None = None

class OwnershipCreate(BaseModel):
    listing_id: UUID
    user_id: UUID