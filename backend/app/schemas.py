from pydantic import BaseModel


class ListingResponse(BaseModel):
    id: str
    title: str
    crop: str
    price: int
    available_slots: int
    total_slots: int
    producers: ProducerInfo | None