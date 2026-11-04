from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class MenuBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    price: int = Field(ge=0, default=6000)
    category: str = Field(default="Roti Bakar", max_length=50)
    image_url: Optional[str] = None
    prep_time_minutes: int = Field(ge=1, default=5)
    is_available: bool = Field(default=True)

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = Field(default=None, ge=0)
    category: Optional[str] = None
    image_url: Optional[str] = None
    prep_time_minutes: Optional[int] = Field(default=None, ge=1)
    is_available: Optional[bool] = None

class MenuItemResponse(MenuBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
