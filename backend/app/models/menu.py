import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, Uuid
from backend.app.core.database import Base

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False, default=0)
    category = Column(String(50), nullable=False, default="Roti Bakar")
    image_url = Column(String(255), nullable=True)
    prep_time_minutes = Column(Integer, nullable=False, default=5)
    is_available = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
