import urllib.parse
from backend.app.models.order import Order

def format_whatsapp_number(raw_phone: str) -> str:
    """
    Sanitizes Indonesian phone numbers:
    0812... -> 62812...
    +62812... -> 62812...
    Removes spaces, hyphens, and parentheses.
    """
    cleaned = "".join(ch for ch in raw_phone if ch.isdigit())
    if cleaned.startswith("0"):
        cleaned = "62" + cleaned[1:]
    elif cleaned.startswith("8"):
        cleaned = "62" + cleaned
    return cleaned

def generate_wa_notify_url(order: Order) -> str:
    """
    Generates direct wa.me link for the PIC cashier to notify customer that food is ready.
    """
    phone = format_whatsapp_number(order.guest_wa)
    
    # Format flavor summary
    items_summary = []
    for item in order.items:
        flavor_text = f" ({item.selected_flavors})" if item.selected_flavors else ""
        items_summary.append(f"{item.quantity}x {item.item_name}{flavor_text}")
    
    order_items_text = ", ".join(items_summary) if items_summary else "Roti Bakar"

    message = (
        f"Halo kak *{order.guest_name}*! 👋\n\n"
        f"Pesanan DISPLAY Canteen kamu (*{order.order_number}*):\n"
        f"🍞 {order_items_text}\n\n"
        f"🎉 *SUDAH SIAP DIAMBIL* di stan kantin!\n"
        f"Silakan tunjukkan pesan ini ke kasir. Selamat menikmati! 😋"
    )

    encoded_text = urllib.parse.quote(message)
    return f"https://wa.me/{phone}?text={encoded_text}"
