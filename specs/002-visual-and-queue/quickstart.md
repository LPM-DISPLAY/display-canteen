# Quickstart Guide: Feature 002

**Feature**: `002-visual-and-queue`  
**Date**: 2026-11-05  

## Running Locally

### 1. Backend (FastAPI)
```bash
# From repository root
source backend/venv/bin/activate
uvicorn backend.app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Public Queue API: `http://localhost:8000/api/orders/queue`

### 2. Frontend (Vite + React)
```bash
# In frontend directory
cd frontend
npm run dev
```
- Customer Ordering & Customizer: `http://localhost:5173/`
- Public TV Queue Display: `http://localhost:5173/queue`
- Admin Operations Kanban: `http://localhost:5173/admin`

---

## Verification Flows

### Test Flow 1: Realistic Sliced Toast & 0-Topping Ordering
1. Open `http://localhost:5173/`.
2. Verify bread looks like sliced toast with brown crust, with zero toppings selected.
3. Click "Tambah ke Keranjang" directly -> item adds as "Roti Bakar Original" for Rp 6.000.
4. Select "Cokelat" -> observe realistic chocolate sprinkles (*meses*).
5. Select "Keju" -> observe shredded cheddar cheese layered over chocolate.
6. Select "Strawberry" + "Blueberry" -> observe 50:50 half-and-half jam split.

### Test Flow 2: High-Visibility Cart & Single-Screen Mobile Viewport
1. Set mobile emulation (iPhone 14 / 390x844).
2. Verify entire stage and bottom cart bar fit cleanly without scrolling.
3. Add item -> observe header cart badge and bottom blue bar update instantaneously.

### Test Flow 3: Public Queue Board & Sound Notification
1. Open `http://localhost:5173/queue` in a second browser window.
2. In admin (`http://localhost:5173/admin`), toggle "Aktifkan Audio".
3. Move a test order to `PROCESSING` -> observe it appears under "Sedang Disiapkan" on `/queue`.
4. Move the order to `READY` -> observe it moves to "Siap Diambil" on `/queue`.
5. Submit a new order from customer window -> observe audio chime on admin screen.

### Test Flow 4: Customer Order History & Self-Cancellation
1. In customer window, click "Pesanan Saya" in the header -> list of recent orders displays.
2. Open an order with status `PENDING_PAYMENT`.
3. Click "Batalkan Pesanan" -> status transitions immediately to `CANCELLED`.
