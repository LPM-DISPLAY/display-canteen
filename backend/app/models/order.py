import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    guest_name = Column(String(100), nullable=False)
    guest_wa = Column(String(25), nullable=False)
    payment_method = Column(String(20), nullable=False) # 'CASH' or 'QRIS'
    payment_proof_url = Column(String(255), nullable=True)
    status = Column(String(30), nullable=False, default="PENDING_PAYMENT", index=True)
    total_amount = Column(Integer, nullable=False, default=0)
    estimated_ready_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    order_id = Column(Uuid, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    menu_id = Column(Uuid, ForeignKey("menus.id", ondelete="RESTRICT"), nullable=False)
    item_name = Column(String(100), nullable=False)
    selected_flavors = Column(String(255), nullable=False, default="") # e.g. "Cokelat, Keju"
    item_price = Column(Integer, nullable=False, default=0)
    quantity = Column(Integer, nullable=False, default=1)
    subtotal = Column(Integer, nullable=False, default=0)
    notes = Column(String(255), nullable=True)

    order = relationship("Order", back_populates="items")
    menu = relationship("Menu")
