from typing import TypedDict
from uuid import UUID

class ProducerRow(TypedDict):
    id: UUID
    name: str
    location: str | None
    description: str | None
    image_url: str | None
    created_at: str | None

class ListingRow(TypedDict):
    id: UUID
    producer_id: str | None
    title: str
    description: str | None
    crop: str
    price: int
    total_slots: int
    available_slots: int
    image_url: str | None
    harvest_date: str | None
    created_at: str | None

class ListingWithProducerRow(ListingRow):
    producers: ProducerRow | None

class OwnershipRow(TypedDict):
    id: UUID
    listing_id: str | None
    owner_name: str
    owner_email: str
    slots: int
    created_at: str | None