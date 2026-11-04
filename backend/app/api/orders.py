import random
from uuid import UUID
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.core.storage import storage_client
from backend.app.models.menu import Menu
from backend.app.models.order import Order, OrderItem
from backend.app.schemas.order import (
    CheckoutRequest,
    OrderResponse,
    OrderStatusUpdate,
)
from backend.app.services.queue_calc import calculate_estimated_ready_time
from backend.app.services.notification import generate_wa_notify_url, format_whatsapp_number

router = APIRouter()

def verify_admin(x_admin_secret: Optional[str] = Header(None)):
    if not x_admin_secret or x_admin_secret != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Admin Secret Key")
    return True

def generate_order_number(db: Session) -> str:
    # Generate sequential or daily order number
    count = db.query(Order).count() + 1
    return f"ORD-{count:03d}"

def enrich_order_response(order: Order) -> dict:
    order_dict = {
        "id": order.id,
        "order_number": order.order_number,
        "guest_name": order.guest_name,
        "guest_wa": order.guest_wa,
        "payment_method": order.payment_method,
        "payment_proof_url": order.payment_proof_url,
        "status": order.status,
        "total_amount": order.total_amount,
        "estimated_ready_at": order.estimated_ready_at,
        "created_at": order.created_at,
        "items": [
            {
                "id": item.id,
                "menu_id": item.menu_id,
                "item_name": item.item_name,
                "selected_flavors": item.selected_flavors,
                "item_price": item.item_price,
                "quantity": item.quantity,
                "subtotal": item.subtotal,
                "notes": item.notes,
            }
            for item in order.items
        ],
        "wa_notify_url": generate_wa_notify_url(order) if order.status in ["READY", "PROCESSING"] else None,
    }
    return order_dict

@router.post("/checkout", response_model=OrderResponse, status_code=201)
def checkout(payload: CheckoutRequest, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Keranjang pesanan tidak boleh kosong")

    order_num = generate_order_number(db)
    sanitized_wa = format_whatsapp_number(payload.guest_wa)

    order = Order(
        order_number=order_num,
        guest_name=payload.guest_name.strip(),
        guest_wa=sanitized_wa,
        payment_method=payload.payment_method,
        status="PENDING_PAYMENT",
        total_amount=0
    )
    db.add(order)
    db.flush()

    total_amount = 0
    for item_req in payload.items:
        menu = db.query(Menu).filter(Menu.id == item_req.menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail=f"Menu dengan id {item_req.menu_id} tidak ditemukan")

        # Validate maximum 2 toppings per roti bakar
        if len(item_req.flavors) > 2:
            raise HTTPException(
                status_code=400,
                detail=f"Maksimal 2 jenis rasa topping per roti bakar ({len(item_req.flavors)} dipilih)"
            )

        # Flat price per roti regardless of number of toppings
        item_price = menu.price

        subtotal = item_price * item_req.quantity
        total_amount += subtotal

        flavor_str = ", ".join(item_req.flavors) if item_req.flavors else ""

        order_item = OrderItem(
            order_id=order.id,
            menu_id=menu.id,
            item_name=menu.name,
            selected_flavors=flavor_str,
            item_price=item_price,
            quantity=item_req.quantity,
            subtotal=subtotal,
            notes=item_req.notes
        )
        db.add(order_item)

    order.total_amount = total_amount
    db.commit()
    db.refresh(order)

    return enrich_order_response(order)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: UUID, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    return enrich_order_response(order)

@router.post("/{order_id}/upload-proof", response_model=OrderResponse)
async def upload_proof(
    order_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")

    # Read bytes and validate
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File bukti pembayaran kosong")

    # Upload via StorageClient
    image_url = storage_client.upload_file(
        file_bytes=file_bytes,
        filename=file.filename or "proof.jpg",
        content_type=file.content_type or "image/jpeg"
    )

    order.payment_proof_url = image_url
    order.status = "VERIFYING_PAYMENT"
    db.commit()
    db.refresh(order)

    return enrich_order_response(order)

@router.get("", response_model=List[OrderResponse])
def get_orders(
    status: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc()).limit(limit).all()
    return [enrich_order_response(o) for o in orders]

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: UUID,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")

    new_status = payload.status
    order.status = new_status

    # Automated trigger: Calculate queue estimated ready time when transitioning to PROCESSING
    if new_status == "PROCESSING":
        order.estimated_ready_at = calculate_estimated_ready_time(db, order)

    db.commit()
    db.refresh(order)
    return enrich_order_response(order)
