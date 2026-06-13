from typing import TypedDict
from uuid import UUID

class ProducerRow(TypedDict):
    user_id: UUID
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
    user_id: str | None
    listing_id: str | None
    slots: int
    created_at: str | None

class ProfileRow(TypedDict):
    id: UUID
    name: str
    email: str
    address: str | None