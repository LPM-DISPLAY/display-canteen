# Research & Technical Decisions: Visual Realism, Order Management & Public Queue Display

**Feature**: `002-visual-and-queue`  
**Date**: 2026-11-05  

## 1. Realistic Sliced Toast & Topping Rendering Engine

### Problem & Feedback
The MVP toast representation was overly stylized and lacked the appearance of authentic Indonesian street-style toasted sliced bread (*roti tawar bakar*). Feedback in Issue #3 requested:
1. Real sliced bread look (crust edges, butter toasted browning).
2. Chocolate rendered as chocolate rice/sprinkles (*meses*).
3. Cheese rendered as curly shredded cheddar (*parutan keju*).
4. Jams rendered as rich glossy fruit/ganache spreads.
5. Split 50:50 layout when two jams are selected.
6. Jams as base spread with sprinkle/shred layered on top when mixed.

### Technical Decision: Pure SVG + CSS Layering
- **Decision**: Avoid heavyweight external bitmap images that blur on high-DPI screens or cause asset loading delays. Build a modular layered SVG rendering component in `RotiCustomizer.tsx` and `ToppingLayer.tsx`:
  - **Base Toast Layer**: Sliced bread profile (subtle rounded corners, bread crust outer border in warm golden-brown `#78350F`, toasted grill marks, and glistening butter gradient).
  - **Spread Layer**: SVG path with `clipPath` for left (50%) and right (50%) halves when two jams are active. Rich color gradients with radial gloss highlights simulating jam spread texture.
  - **Chocolate Meses Layer**: SVG pattern/paths composed of dark cocoa cylindrical sprinkles (`#3E1F07` with specular highlights) scattered realistically.
  - **Shredded Cheddar Layer**: SVG strands with varying rotation, bezier curves, and golden-yellow shades (`#F59E0B`, `#FCD34D`, `#D97706`) providing depth and abundance.
  - **Bounce Animation**: Kept as `animate-topping-bounce` with a 350ms ease-out spring effect when topping is toggled.

---

## 2. Mobile Viewport & High-Visibility Shopping Cart

### Problem & Feedback
Feedback reported *"UX keranjang kurang kelihatan"* and *"rasio layar"* issues on mobile screens where content caused excessive scrolling and the cart button was easily missed.

### Technical Decision: Single-Screen Fit + Dual Cart Indicators
- **Header Cart Badge**: Replace the deleted "Meja Stand" badge with an active Shopping Cart button containing an amber/blue counter pill showing total items. Tapping it opens the Cart Drawer.
- **Fixed High-Contrast Bottom Bar**: Sticky bottom bar in Primary Brand Blue (`#0057B8`) with strong text contrast (`#FFFFFF`), showing item count, total price (e.g. `Rp 12.000`), and a direct "Checkout" action button. Uses `pb-safe` (iOS safe area bottom inset) so it never clips on iPhone gesture bars.
- **Compact Layout**:
  - Bread canvas container constrained to a responsive `h-44 sm:h-52`.
  - 6-flavor selector arranged in a tight `grid-cols-3 gap-2`.
  - Elimination of the redundant promotional banner.
  - Result: entire customizer and action buttons fit within `< 700px` height (standard mobile viewport).

---

## 3. Public Order Queue Display Screen (`/queue`)

### Problem & Feedback
Food court customers and waiting canteen patrons want to see which orders are being prepared and which are ready without constantly checking their personal phones or interrupting kitchen staff.

### Technical Decision: Public Standalone Display Route
- **Route**: `/queue` (Public, no login required).
- **Layout**: Full-screen high-contrast landscape/portrait view optimized for wall TV screens, tablets, or customer mobile phones.
- **Columns**:
  1. **Sedang Disiapkan (`PROCESSING`)**: Large badge cards showing `ORD-XXX` and guest first name, with animated preparation spinner.
  2. **Siap Diambil (`READY`)**: Prominent glowing green cards with pulsing indicators showing ready order numbers.
- **Polling Strategy**: Lightweight polling every 8 seconds via `api.getPublicQueue()`. If offline, subtle reconnecting indicator appears without crashing the page.

---

## 4. Customer Order History Drawer & Self-Service Cancellation

### Problem & Feedback
Customers had no way to view past orders or cancel an accidental order while it is still pending payment.

### Technical Decision: Drawer + Guarded Backend Cancellation
- **Frontend**: "Pesanan Saya" drawer accessible from Header. Reads `display_canteen_guest.recent_orders` array from `localStorage`, queries order statuses, and displays them sorted by latest.
- **Cancellation**:
  - User can tap "Batalkan Pesanan" only if `status === 'PENDING_PAYMENT'`.
  - Backend `POST /api/orders/{id}/cancel` verifies that `order.status == 'PENDING_PAYMENT'`. If already `PROCESSING` or higher, raises HTTP 400.
  - If successful, sets status to `CANCELLED` and logs timestamp.

---

## 5. Admin Operations: Search, Filter & Sound Chime

### Problem & Feedback
During lunch rushes, on-duty PICs can miss new orders, and searching through orders across columns was cumbersome.

### Technical Decision: In-Memory Filtering & Web Audio Synthesizer
- **Search & Filter**: Real-time reactive search by guest name or order number across Kanban columns. Quick pills for `Semua`, `QRIS`, and `Tunai`.
- **Audio Notification**:
  - To eliminate dependency on external `.mp3` files that could fail to load or get blocked by CORS, use the browser's built-in `AudioContext` to synthesize a pleasant two-tone chime (800Hz -> 1000Hz sine waves) when a new order ID appears in the polling payload.
  - Add an "Aktifkan Suara" toggle button in the Admin header to unlock browser audio autoplay policies seamlessly.

---

## 6. Asia/Jakarta (WIB / UTC+7) Timezone Standardization

### Problem & Feedback
UTC timestamps caused discrepancies in order display and shift sales CSV exports.

### Technical Decision: Explicit WIB Formatting
- **Backend**:
  - In `reports.py` (CSV export) and `orders.py`: Explicitly format timestamps using `ZoneInfo("Asia/Jakarta")` (e.g., `YYYY-MM-DD HH:mm:ss WIB`).
- **Frontend**:
  - Utility function `formatWIB(dateString)` converting ISO UTC strings to Jakarta time with explicit `WIB` suffix (e.g. `12:45 WIB`).
