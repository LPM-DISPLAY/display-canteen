# Implementation Plan: Visual Realism, Order Management & Public Queue Display

**Branch**: `002-visual-and-queue` | **Date**: 2026-11-05 | **Spec**: [specs/002-visual-and-queue/spec.md](spec.md)

**Input**: Feature specification from `/specs/002-visual-and-queue/spec.md` resolving all items from GitHub Issue #3.

---

## Summary

This feature modernizes DISPLAY Canteen by elevating the Roti Bakar Customizer into a realistic sliced bread canvas with authentic toppings (chocolate meses, shredded cheddar, and half-and-half jam spreads), supports 0-topping ordering, introduces a TV-ready Public Queue Display (`/queue`), provides a Customer Order History drawer ("Pesanan Saya") with self-service cancellation for pending orders, improves mobile screen fit and cart visibility, equips the admin dashboard with search, filters, and audio chimes, and enforces standardized WIB (UTC+7) time formatting throughout.

---

## Technical Context

**Language/Version**: Python 3.11/3.14 (Backend), TypeScript 5.5 (Frontend)  
**Primary Dependencies**: FastAPI, SQLAlchemy 2.0, Pydantic v2, React 18, Vite, Tailwind CSS  
**Storage**: Supabase Cloud PostgreSQL, localStorage (client session)  
**Testing**: `pytest` (backend unit & validation tests), `tsc -b && vite build` (frontend type & bundle verification)  
**Target Platform**: Mobile Web browsers (iOS Safari, Android Chrome), Desktop/Laptop Admin browsers, Wall-mounted TV displays / Tablets  
**Project Type**: Full-stack web application with REST API and client-side rendering  
**Constraints**: Single-screen fit on mobile viewports (>= 375px wide), pure Tailwind CSS (Light Mode only `#F8FAFC`), zero external UI component libraries, lightweight synthesized Web Audio for chimes.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Centralized Cloud Persistence**: PASS. All order transitions and queue queries operate on Supabase PostgreSQL.
- **Principle II: Strict Design-System Fidelity**: PASS. Retains `#F8FAFC` background, `#FFFFFF` cards, `#0057B8` primary, `#FF6B00` secondary, `#10B981` emerald. Pure Tailwind CSS without heavy UI suites.
- **Principle III: Frictionless Zero-Auth Guest Ordering**: PASS. No login required. History tracked via client `localStorage`.
- **Principle IV: Portable Host Runtime with Fixed Public Ingress**: PASS. Compatible with existing Docker Compose & Cloudflare Tunnel.
- **Principle V: Pragmatic Operational Automation**: PASS. Polling queue, synthesized audio chime without audio file dependencies, instant CSV export in WIB.
- **Principle VI: Incremental Delivery**: PASS. Follows phased execution with automated testing.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-visual-and-queue/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Architectural research & decisions
├── data-model.md        # Data models & entity transitions
├── contracts/
│   ├── openapi.yaml     # Public queue & cancellation endpoints
│   └── ui-contracts.md  # Screen mapping & component contracts
├── quickstart.md        # Verification flows
└── tasks.md             # Breakdown of tasks (generated via /speckit-tasks)
```

### Source Code Changes

```text
backend/
├── app/
│   ├── api/
│   │   ├── orders.py    # [MODIFY] Add /api/orders/queue and /api/orders/{id}/cancel
│   │   └── reports.py   # [MODIFY] Format CSV export timestamps in WIB
│   ├── schemas/
│   │   └── order.py     # [MODIFY] Allow 0 toppings (default empty), add PublicQueueResponse
│   └── services/
│       └── time_util.py # [NEW] Timezone formatting helper for Asia/Jakarta (WIB)
└── tests/
    └── test_api.py      # [MODIFY] Add tests for 0 toppings, cancellation, and public queue

frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Header.tsx          # [MODIFY] Remove 'Meja Stand' & 'Hangat', add Cart & History triggers
│   │   ├── guest/
│   │   │   ├── RotiCustomizer.tsx  # [MODIFY] Realistic sliced bread SVG canvas with butter gloss
│   │   │   ├── ToppingLayer.tsx    # [MODIFY] Meses sprinkles, shredded cheddar, jam spreads, 50:50 split
│   │   │   ├── FlavorSelector.tsx  # [MODIFY] Compact layout for single-screen fit
│   │   │   ├── CartDrawer.tsx      # [MODIFY] Mobile drawer improvements
│   │   │   ├── CartBottomBar.tsx   # [NEW] Sticky high-contrast bottom bar with safe-area padding
│   │   │   └── OrdersDrawer.tsx    # [NEW] Customer order history drawer ("Pesanan Saya")
│   │   └── admin/
│   │       └── SearchFilterBar.tsx # [NEW] Admin search, payment filter, and audio alert toggle
│   ├── pages/
│   │   ├── MenuPage.tsx            # [MODIFY] Single-screen fit, 0-topping default, banner removal
│   │   ├── StatusPage.tsx          # [MODIFY] Self-service order cancel button for PENDING_PAYMENT
│   │   ├── AdminKanban.tsx         # [MODIFY] Integrate SearchFilterBar & synthesized audio chime
│   │   └── PublicQueuePage.tsx     # [NEW] Full-screen TV/Mobile display for PROCESSING & READY orders
│   ├── services/
│   │   ├── api.ts                  # [MODIFY] Add getPublicQueue and cancelOrder API methods
│   │   └── audio.ts                # [NEW] Web Audio API two-tone chime synthesizer
│   ├── types/
│   │   └── index.ts                # [MODIFY] Add PublicQueueItem and queue types
│   └── App.tsx                     # [MODIFY] Add /queue route
```

---

## Phase Execution Strategy

### Phase 1: Core Backend & Data Logic
1. Create timezone utility helper in `backend/app/services/time_util.py`.
2. Update `backend/app/schemas/order.py` to allow 0 toppings (defaults to "Original") and add public queue schema.
3. Update `backend/app/api/orders.py`:
   - Implement `GET /api/orders/queue` returning orders in `PROCESSING` and `READY`.
   - Implement `POST /api/orders/{id}/cancel` allowing guest cancellation only if status is `PENDING_PAYMENT`.
4. Update `backend/app/api/reports.py` to output CSV timestamps in Asia/Jakarta (WIB).
5. Add unit tests in `backend/tests/test_api.py` covering queue endpoint, cancellation rules, and 0-topping orders.

### Phase 2: Visual Realism & Ordering UI
1. Revamp `RotiCustomizer.tsx` and `ToppingLayer.tsx`:
   - Realistic sliced toast SVG with crust, toasted marks, butter glaze.
   - Realistic chocolate sprinkles (*meses*).
   - Realistic curly shredded cheddar cheese.
   - Rich glossy jam spreads (Strawberry, Blueberry, Tiramisu, Green Tea).
   - 50:50 split layout (`clipPath`) when two jams are selected.
   - Base jam layer with sprinkles/shreds layered on top when mixed.
2. Update `FlavorSelector.tsx` for a compact, single-screen fit layout.
3. Update `MenuPage.tsx`:
   - Initial topping state empty `[]`.
   - Support adding "Roti Bakar Original" with 0 toppings for Rp 6.000.
   - Remove redundant promotional banners.
   - Integrate `CartBottomBar.tsx` sticky at the bottom.
4. Update `Header.tsx`:
   - Remove "Meja Stand" badge and "Hangat" in subtitle.
   - Add "Pesanan Saya" (order history) and Cart trigger icons.

### Phase 3: Customer History & Order Cancellation
1. Build `OrdersDrawer.tsx` displaying active and previous orders from `localStorage`.
2. Update `StatusPage.tsx`:
   - Add "Batalkan Pesanan" button enabled only during `PENDING_PAYMENT`.
   - Connect to `api.cancelOrder(orderId)`.
   - Format order timestamps with `WIB` suffix.

### Phase 4: Public Queue Display Screen (`/queue`)
1. Create `PublicQueuePage.tsx`:
   - High-contrast, large-typography two-column board: "Sedang Disiapkan" (`PROCESSING`) and "Siap Diambil" (`READY`).
   - Live clock in WIB.
   - 8-second auto-polling with silent error recovery.
2. Register `/queue` route in `App.tsx`.

### Phase 5: Admin Enhancements & Audio Alerts
1. Create `audio.ts` utilizing browser `AudioContext` to generate a two-tone notification chime.
2. Build `SearchFilterBar.tsx` with search input, Cash/QRIS toggle, and Audio toggle button.
3. Update `AdminKanban.tsx` to filter cards reactively and trigger audio chime upon new order arrival.

---

## Verification & Validation Plan

### Automated Tests
- Run backend pytest:
  ```bash
  PYTHONPATH=. backend/venv/bin/pytest backend/tests/test_api.py
  ```
- Run frontend type check and production bundle build:
  ```bash
  npm --prefix frontend run build
  ```

### Manual Verification Checklist
1. **Toast Graphics**: Sliced bread appearance, chocolate sprinkles, shredded cheddar, jam spread, 50:50 jam split.
2. **0-Topping Order**: Add plain toast to cart with 0 toppings -> total Rp 6.000, checkout succeeds.
3. **Screen Ratio**: Page fits vertically on mobile (375px/390px) without scrolling.
4. **Header & Copy**: No "Meja Stand", no "Hangat", no "Fresh Toasted", no promotional banner.
5. **Customer History**: "Pesanan Saya" drawer opens, lists orders, lets user cancel while `PENDING_PAYMENT`.
6. **Public Queue**: `/queue` displays orders accurately and updates within 10 seconds of admin changes.
7. **Admin Suite**: Search by customer name, filter by Cash/QRIS, test audio chime.
8. **Timezone**: All timestamps display with `WIB`.
