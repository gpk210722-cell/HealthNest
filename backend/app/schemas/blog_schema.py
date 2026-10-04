from datetime import datetime

from pydantic import BaseModel


class BlogCreate(BaseModel):
    title: str
    category: str
    content: str


class BlogResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True