from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from backend.app.models.order import Order

def calculate_estimated_ready_time(db: Session, order: Order) -> datetime:
    """
    Calculates dynamic estimated ready time based on active queue:
    estimated_ready_at = now + sum(prep times of orders currently in PROCESSING) + current order prep time
    Default baseline prep time = 5 minutes per order item.
    """
    now = datetime.now(timezone.utc)
    
    # Active orders currently PROCESSING ahead of this order
    active_orders = (
        db.query(Order)
        .filter(Order.status == "PROCESSING", Order.id != order.id)
        .all()
    )

    # Calculate queue backlog in minutes
    backlog_minutes = 0
    for queued_order in active_orders:
        item_count = sum(item.quantity for item in queued_order.items) if queued_order.items else 1
        backlog_minutes += max(3, item_count * 4)

    # Current order preparation duration
    current_items_count = sum(item.quantity for item in order.items) if order.items else 1
    current_prep_minutes = max(4, current_items_count * 5)

    total_wait_minutes = min(backlog_minutes + current_prep_minutes, 60) # cap at 60 mins
    return now + timedelta(minutes=total_wait_minutes)
