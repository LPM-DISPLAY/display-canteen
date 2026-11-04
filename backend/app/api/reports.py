import csv
import io
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from fastapi.responses import Response
from sqlalchemy import func
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.models.order import Order, OrderItem
from backend.app.services.time_util import format_datetime_wib

router = APIRouter()

def verify_admin(
    x_admin_secret: Optional[str] = Header(None),
    secret: Optional[str] = Query(None)
):
    key = x_admin_secret or secret
    if not key or key != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Admin Secret Key")
    return True

@router.get("/dashboard")
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    total_orders = db.query(Order).count()
    completed_orders = db.query(Order).filter(Order.status == "COMPLETED").count()
    pending_orders = db.query(Order).filter(
        Order.status.in_(["PENDING_PAYMENT", "VERIFYING_PAYMENT", "PROCESSING"])
    ).count()

    total_revenue = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status == "COMPLETED")
        .scalar()
        or 0
    )

    cash_revenue = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status == "COMPLETED", Order.payment_method == "CASH")
        .scalar()
        or 0
    )

    qris_revenue = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status == "COMPLETED", Order.payment_method == "QRIS")
        .scalar()
        or 0
    )

    return {
        "total_revenue": int(total_revenue),
        "total_orders": total_orders,
        "completed_orders": completed_orders,
        "pending_orders": pending_orders,
        "payment_breakdown": {
            "cash": int(cash_revenue),
            "qris": int(qris_revenue)
        }
    }

@router.get("/export")
def export_sales_csv(
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Header Row
    writer.writerow([
        "Order Number",
        "Waktu Pemesanan",
        "Nama Pelanggan",
        "WhatsApp",
        "Metode Pembayaran",
        "Status",
        "Detail Roti & Rasa",
        "Total (IDR)"
    ])

    for o in orders:
        items_desc = "; ".join(
            f"{i.quantity}x {i.item_name} [{i.selected_flavors or 'Original'}]" for i in o.items
        )
        writer.writerow([
            o.order_number,
            format_datetime_wib(o.created_at, include_seconds=True),
            o.guest_name,
            f"'{o.guest_wa}", # prepend quote to preserve phone string in Excel
            o.payment_method,
            o.status,
            items_desc,
            o.total_amount
        ])

    csv_data = output.getvalue()
    filename = f"rekap-penjualan-display-canteen-{func.now()}.csv"

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=rekap-penjualan-canteen.csv"
        }
    )
