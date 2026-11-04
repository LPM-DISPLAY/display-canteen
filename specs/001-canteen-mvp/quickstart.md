# Quickstart Validation Guide: DISPLAY Canteen MVP

**Feature**: `001-canteen-mvp`
**Date**: 2026-11-04

This document outlines the step-by-step validation scenarios to verify end-to-end functionality across all 5 development phases.

---

## 1. Prerequisites & Environment Setup

### Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Ensure valid Supabase credentials (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`) or run with local upload fallback enabled.
3. Configure `ADMIN_SECRET_KEY` in `.env`.

### Starting Services

#### Option A: Local Development (Separate Terminals)
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

#### Option B: Portable Docker Environment
```bash
docker compose up --build
```

---

## 2. End-to-End Verification Scenarios

### Scenario 1: Guest Menu Browsing & Cart Management
- **Action**: Open `http://localhost:5173` on mobile or desktop browser.
- **Expected Outcome**:
  - The catalog displays food and beverage items loaded from `/api/menus`.
  - Selecting items increments cart count and displays the floating bottom summary bar with subtotal.
  - Tapping category filters ("Makanan", "Minuman") filters the list instantly without page reload.

### Scenario 2: Guest Cash Checkout & Order Creation
- **Action**: In the cart summary, tap "Lanjut ke Pembayaran" (`/checkout`). Fill in:
  - Name: "Ahmad Rizky"
  - WhatsApp: "081234567890"
  - Payment Method: "Cash"
  - Tap "Pesan Sekarang".
- **Expected Outcome**:
  - Checkout registers order via `POST /api/orders/checkout`.
  - Browser automatically redirects to `/orders/:id`.
  - Order status displays badge `PENDING_PAYMENT` with instructions to settle cash at the counter.
  - Reloading the page retains the active order state from `localStorage`.

### Scenario 3: QRIS Payment & Receipt Upload
- **Action**: Place an order selecting "QRIS".
- **Expected Outcome**:
  - The static QRIS QR code is displayed with exact payment total.
  - Customer uploads an image file via the file upload button.
  - Image is sent to `POST /api/orders/:id/upload-proof`.
  - Status transitions immediately from `PENDING_PAYMENT` to `VERIFYING_PAYMENT`.

### Scenario 4: Admin Kanban Verification & Status Progression
- **Action**: Open `http://localhost:5173/admin` with header/secret configured.
- **Expected Outcome**:
  - The Kanban board displays columns corresponding to the 6 canonical states:
    `PENDING_PAYMENT`, `VERIFYING_PAYMENT`, `PROCESSING`, `READY`, `COMPLETED`, `CANCELLED`.
  - The newly placed QRIS order appears in the `VERIFYING_PAYMENT` column.
  - Clicking the receipt thumbnail opens the image preview modal.
  - Clicking "Konfirmasi Pembayaran" moves the order to `PROCESSING`.
  - On the customer tracking screen (`/orders/:id`), the status automatically updates to `PROCESSING` with the dynamic estimated completion time.

### Scenario 5: Food Ready & WhatsApp Notification Trigger
- **Action**: In the admin dashboard, move the order from `PROCESSING` to `READY`.
- **Expected Outcome**:
  - The order card moves to the `READY` column.
  - The "Kabari User" button becomes active.
  - Clicking "Kabari User" opens a new browser tab with URL:
    `https://wa.me/6281234567890?text=Halo%20Ahmad%20Rizky...`
  - WhatsApp Web opens with the pre-filled pickup notification.

### Scenario 6: Shift Completion & Sales CSV Export
- **Action**: Mark the order as `COMPLETED`. Navigate to `http://localhost:5173/admin/reports`.
- **Expected Outcome**:
  - Total Revenue and Order Count metrics include the completed order.
  - Clicking "Ekspor CSV" sends a request to `/api/reports/export`.
  - A `.csv` file is immediately downloaded to the PIC's computer containing all transaction columns.
