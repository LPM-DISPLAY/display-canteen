---
description: "Task list for DISPLAY Canteen MVP implementation"
---

# Tasks: DISPLAY Canteen MVP

**Input**: Design documents from `/specs/001-canteen-mvp/`
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/openapi.yaml](contracts/openapi.yaml), [contracts/ui-contracts.md](contracts/ui-contracts.md), [quickstart.md](quickstart.md)

## Format: `- [x] [ID] [P?] [Story?] Description with exact file path`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story identifier (`[US1]`, `[US2]`, `[US3]`, `[US4]`, `[US5]`)
- Exact file paths are provided for every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency management, and styling foundation

- [x] T001 Initialize backend requirements and environment configuration in `backend/requirements.txt`
- [x] T002 [P] Initialize frontend project configuration with Vite, React, and TypeScript in `frontend/package.json`
- [x] T003 [P] Configure Tailwind CSS design tokens, topping bounce animations, and Google Material Symbols Outlined in `frontend/tailwind.config.js` and `frontend/src/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: Foundational tasks establish the database, storage layer, models, API utilities, and reusable design components.

- [x] T004 Setup database connection and session management in `backend/app/core/database.py` and `backend/app/core/config.py`
- [x] T005 [P] Setup Supabase Storage client and local filesystem `/uploads` fallback in `backend/app/core/storage.py`
- [x] T006 [P] Create SQLAlchemy models for Menu, Order, and OrderItem (with selected flavors) in `backend/app/models/menu.py` and `backend/app/models/order.py`
- [x] T007 Configure Alembic migration environment and initial schema migration in `backend/alembic/env.py`
- [x] T008 [P] Define core TypeScript types mirroring the data model and status state machine in `frontend/src/types/index.ts`
- [x] T009 [P] Create HTTP API client utility with error handling in `frontend/src/services/api.ts`
- [x] T010 [P] Implement reusable StatusBadge component supporting the 6 canonical statuses in `frontend/src/components/common/StatusBadge.tsx`
- [x] T011 [P] Implement common app Header component matching Design System in `frontend/src/components/common/Header.tsx`
- [x] T012 Setup FastAPI main app with CORS, health check, and error handlers in `backend/app/main.py`

**Checkpoint**: Foundation ready - backend can connect to Supabase, frontend has design tokens and HTTP clients configured.

---

## Phase 3: User Story 1 - Interactive Roti Bakar Customizer & Cash Checkout (Priority: P1) 🎯 MVP

**Goal**: Enable canteen guests to customize their Roti Bakar visually with 6 flavors (Cokelat, Keju, Strawberry, Blueberry, Tiramisu, Green Tea) with bounce animations, add to cart, and checkout with Name + WhatsApp for Cash payment without login.

**Independent Test**: Open catalog at `http://localhost:5173`, choose flavors (e.g. Cokelat + Keju) on the toast canvas, verify bounce animation, proceed to checkout, enter "Budi" and "081234567890", select Cash, and verify order is created with `PENDING_PAYMENT` status displaying the chosen flavors.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create Pydantic schemas for Menu items and Checkout request/response supporting flavor lists in `backend/app/schemas/menu.py` and `backend/app/schemas/order.py`
- [x] T014 [US1] Implement Menu catalog list endpoint `GET /api/menus` in `backend/app/api/menus.py`
- [x] T015 [US1] Implement guest checkout endpoint `POST /api/orders/checkout` with Cash support and selected flavors in `backend/app/api/orders.py`
- [x] T016 [P] [US1] Implement CartContext for guest item selection, flavors, and subtotal calculations in `frontend/src/context/CartContext.tsx`
- [x] T017 [P] [US1] Build RotiCustomizer central toast canvas and ToppingLayer with bounce animation in `frontend/src/components/guest/RotiCustomizer.tsx` and `frontend/src/components/guest/ToppingLayer.tsx`
- [x] T018 [P] [US1] Build FlavorSelector pill component for the 6 flavor variants in `frontend/src/components/guest/FlavorSelector.tsx`
- [x] T019 [US1] Build CartDrawer and floating mobile order bar in `frontend/src/components/guest/CartDrawer.tsx`
- [x] T020 [US1] Implement interactive Roti Bakar ordering page combining canvas, flavor selector, and drawer in `frontend/src/pages/MenuPage.tsx`
- [x] T021 [US1] Implement guest checkout form capturing name, WhatsApp number, and Cash option in `frontend/src/pages/CheckoutPage.tsx`
- [x] T022 [US1] Wire guest routing and local storage order persistence in `frontend/src/App.tsx`

**Checkpoint**: User Story 1 (MVP) is fully functional and can take custom Roti Bakar cash orders independently.

---

## Phase 4: User Story 2 - QRIS Payment & Transfer Proof Upload (Priority: P2)

**Goal**: Allow guests to scan a static QRIS code and upload payment transfer screenshots, moving order to `VERIFYING_PAYMENT`.

**Independent Test**: Complete checkout with "QRIS", view static QR code, upload an image receipt, and verify order status advances to `VERIFYING_PAYMENT` in Supabase and storage.

### Implementation for User Story 2

- [x] T023 [US2] Implement QRIS receipt upload endpoint `POST /api/orders/{id}/upload-proof` in `backend/app/api/orders.py`
- [x] T024 [P] [US2] Build static QRIS QR code display component matching `screen-2-payment-mobile.html` in `frontend/src/components/guest/QRISViewer.tsx`
- [x] T025 [P] [US2] Build receipt image file upload and preview component with error validation in `frontend/src/components/guest/ProofUpload.tsx`
- [x] T026 [US2] Integrate QRIS upload flow and status transition to `VERIFYING_PAYMENT` in `frontend/src/pages/CheckoutPage.tsx`

**Checkpoint**: Cashless payments can now be accepted and receipt proofs uploaded.

---

## Phase 5: User Story 3 - Live Order Status Tracking & Queue Wait Estimation (Priority: P3)

**Goal**: Provide customers with real-time order tracking and dynamic estimated ready times as orders move through preparation.

**Independent Test**: Navigate to `/orders/:id`, verify status stepper reflects current state with flavor breakdown, and verify countdown timer appears when order enters `PROCESSING`.

### Implementation for User Story 3

- [x] T027 [P] [US3] Implement dynamic queue wait time estimation algorithm in `backend/app/services/queue_calc.py`
- [x] T028 [US3] Implement single order detail lookup endpoint `GET /api/orders/{id}` with queue wait time and flavors in `backend/app/api/orders.py`
- [x] T029 [P] [US3] Build StatusStepper component tracking the 6 order states matching `screen-3-status-mobile.html` in `frontend/src/components/guest/StatusStepper.tsx`
- [x] T030 [US3] Implement guest live order tracking page with automatic 5s status polling in `frontend/src/pages/StatusPage.tsx`

**Checkpoint**: Customers can independently monitor order progress and expected wait times.

---

## Phase 6: User Story 4 - Admin Order Lifecycle & WhatsApp Notification (Priority: P4)

**Goal**: Provide canteen PICs with an order Kanban board displaying custom flavor combinations, receipt modal verification, status advancement, and one-click WhatsApp ready notifications.

**Independent Test**: Open `/admin`, verify uploaded QRIS proof in modal, advance status to `PROCESSING` and `READY`, click "Kabari User", and verify `wa.me` URL triggers correctly with custom flavor order summary.

### Implementation for User Story 4

- [x] T031 [P] [US4] Implement WhatsApp `wa.me` deep link template generator in `backend/app/services/notification.py`
- [x] T032 [US4] Implement admin order list endpoint `GET /api/orders` with status filtering in `backend/app/api/orders.py`
- [x] T033 [US4] Implement order status transition endpoint `PUT /api/orders/{id}/status` with queue trigger on `PROCESSING` in `backend/app/api/orders.py`
- [x] T034 [P] [US4] Build ProofModal for full-resolution transfer receipt inspection in `frontend/src/components/admin/ProofModal.tsx`
- [x] T035 [P] [US4] Build OrderCard displaying flavor badges with quick status progression buttons and "Kabari User" link in `frontend/src/components/admin/OrderCard.tsx`
- [x] T036 [US4] Build KanbanColumn and board layout matching `screen-4-admin-kanban-desktop.html` in `frontend/src/components/admin/KanbanColumn.tsx`
- [x] T037 [US4] Implement Admin Kanban dashboard page with secret authorization in `frontend/src/pages/AdminKanban.tsx`

**Checkpoint**: Admin PIC can triage incoming orders, verify receipts, and notify customers.

---

## Phase 7: User Story 5 - Menu Catalog Management & Shift Sales CSV Export (Priority: P5)

**Goal**: Allow PICs to edit menu items/flavor availability and export shift sales metrics as downloadable CSV spreadsheets.

**Independent Test**: Modify flavor availability in admin, view sales revenue summary, click "Ekspor CSV", and verify downloaded `.csv` file format includes flavor data.

### Implementation for User Story 5

- [x] T038 [P] [US5] Implement admin Menu CRUD endpoints (POST, PUT, DELETE) in `backend/app/api/menus.py`
- [x] T039 [P] [US5] Implement sales metrics aggregation endpoint `GET /api/reports/dashboard` in `backend/app/api/reports.py`
- [x] T040 [US5] Implement shift sales CSV generator and download endpoint `GET /api/reports/export` in `backend/app/api/reports.py`
- [x] T041 [P] [US5] Build MetricsCard component for revenue and order volume in `frontend/src/components/admin/MetricsCard.tsx`
- [x] T042 [US5] Build Admin menu management modal and stock toggle in `frontend/src/components/admin/MenuManagerModal.tsx`
- [x] T043 [US5] Implement Admin Sales Recap dashboard with instant CSV download matching `screen-5-sales-recap-desktop.html` in `frontend/src/pages/AdminReports.tsx`

**Checkpoint**: End-of-shift administrative handoff and sales reporting complete.

---

## Phase 8: Polish, Containerization & Deployment Verification

**Purpose**: Multi-service Dockerization, Cloudflare Tunnel ingress, and end-to-end smoke testing

- [x] T044 [P] Create backend multi-stage production container configuration in `backend/Dockerfile`
- [x] T045 [P] Create frontend Nginx production container configuration in `frontend/Dockerfile` and `frontend/nginx.conf`
- [x] T046 Create multi-service orchestration with Cloudflare Tunnel in `docker-compose.yml`
- [x] T047 Execute quickstart end-to-end smoke verification per `specs/001-canteen-mvp/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)**: Can start immediately.
2. **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all user stories**.
3. **User Stories (Phases 3 to 7)**:
   - US1 (P1): Depends on Phase 2. Delivers working MVP with Roti Bakar Customizer.
   - US2 (P2): Depends on US1 (checkout flow).
   - US3 (P3): Depends on US1 (order creation).
   - US4 (P4): Depends on US1 & US2 (orders to triage).
   - US5 (P5): Depends on US4 (completed orders to recap).
4. **Polish & Containerization (Phase 8)**: Depends on all user stories completed.

---

## Parallel Opportunities

```bash
# Setup Phase (Parallel):
Task T002: "frontend/package.json"
Task T003: "frontend/tailwind.config.js" & "frontend/src/index.css"

# Foundational Phase (Parallel):
Task T005: "backend/app/core/storage.py"
Task T006: "backend/app/models/menu.py" & "backend/app/models/order.py"
Task T008: "frontend/src/types/index.ts"
Task T009: "frontend/src/services/api.ts"
Task T010: "frontend/src/components/common/StatusBadge.tsx"
Task T011: "frontend/src/components/common/Header.tsx"

# User Story 1 (Parallel):
Task T013: "backend/app/schemas/menu.py" & "backend/app/schemas/order.py"
Task T016: "frontend/src/context/CartContext.tsx"
Task T017: "frontend/src/components/guest/RotiCustomizer.tsx" & "ToppingLayer.tsx"
Task T018: "frontend/src/components/guest/FlavorSelector.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup: T001–T003)
2. Complete Phase 2 (Foundational: T004–T012)
3. Complete Phase 3 (User Story 1: T013–T022)
4. **STOP and VALIDATE**: Verify interactive Roti Bakar customizer with bounce animations and cash checkout.

### Incremental Feature Expansion
1. Add QRIS Payments (Phase 4: T023–T026)
2. Add Live Queue Tracking (Phase 5: T027–T030)
3. Add Admin Kanban & WhatsApp (Phase 6: T031–T037)
4. Add Sales Reporting & CSV Export (Phase 7: T038–T043)
5. Dockerize & Smoke Test (Phase 8: T044–T047)
