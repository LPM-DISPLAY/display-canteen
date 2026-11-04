from uuid import UUID
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class OrderItemRequest(BaseModel):
    menu_id: UUID
    quantity: int = Field(default=1, ge=1)
    flavors: List[str] = Field(default_factory=list, max_length=2, description="Selected flavors (maksimal 2): Cokelat, Keju, etc.")
    notes: Optional[str] = None

class CheckoutRequest(BaseModel):
    guest_name: str = Field(..., min_length=2, max_length=100)
    guest_wa: str = Field(..., min_length=8, max_length=25)
    payment_method: str = Field(..., pattern="^(CASH|QRIS)$")
    items: List[OrderItemRequest] = Field(..., min_length=1)

class OrderItemResponse(BaseModel):
    id: UUID
    menu_id: UUID
    item_name: str
    selected_flavors: str
    item_price: int
    quantity: int
    subtotal: int
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    guest_name: str
    guest_wa: str
    payment_method: str
    payment_proof_url: Optional[str] = None
    status: str
    total_amount: int
    estimated_ready_at: Optional[datetime] = None
    created_at: datetime
    items: List[OrderItemResponse]
    wa_notify_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(PENDING_PAYMENT|VERIFYING_PAYMENT|PROCESSING|READY|COMPLETED|CANCELLED)$")
