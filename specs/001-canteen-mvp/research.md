# Technical Research & Architectural Decisions: DISPLAY Canteen MVP

**Feature**: `001-canteen-mvp`
**Date**: 2026-11-04
**Status**: Completed

## 1. Cloud Database & Persistence Architecture

### Decision
Use **Supabase PostgreSQL** as the centralized Single Source of Truth, accessed from FastAPI via **SQLAlchemy 2.0 ORM** with **Alembic** for schema migrations.

### Rationale
- Canteen Persons-in-Charge (PICs) rotate between shifts, operating the system on different laptops.
- A cloud-hosted database eliminates data fragmentation across rotating machines and ensures all orders, payment records, and menu configurations persist without manual dumps.
- Supabase provides a managed, production-grade PostgreSQL instance on the free tier with SSL encryption.
- SQLAlchemy 2.0 offers asynchronous/synchronous query typing and robust transaction boundaries, while Alembic enables versioned, repeatable database migrations.

### Alternatives Considered
- **Local PostgreSQL container inside Docker**: Rejected because order and shift data would be locked inside the specific PIC's machine. Handing over to another PIC on a different laptop would lose active order continuity.
- **SQLite local database file**: Rejected due to concurrency constraints during simultaneous multi-guest orders and the same machine-locality limitation.

---

## 2. File & Receipt Storage Strategy

### Decision
Use **Supabase Storage Bucket** (`payment-proofs`) for storing customer QRIS transfer screenshots, with an automatic local filesystem fallback (`/uploads`) when running in offline/local mock mode.

### Rationale
- Uploaded receipt screenshots must be instantly viewable by the on-duty PIC on their admin dashboard, regardless of whether the customer uploaded via cellular mobile data and the admin is on the canteen Wi-Fi.
- Supabase Storage integrates seamlessly with the Supabase project credentials and provides secure public/signed URLs for image preview.
- The local `/uploads` fallback ensures developers can write and test upload routines without requiring live cloud credentials during initial development.

### Alternatives Considered
- **Base64 encoded binary strings in PostgreSQL**: Rejected because large images rapidly bloat database storage, exhaust connection bandwidth, and degrade query response times.
- **Local filesystem-only storage**: Rejected because images saved to PIC A's laptop would return 404 when PIC B accesses the dashboard from another machine.

---

## 3. Queue-Based Dynamic Wait Time Algorithm

### Decision
Implement a deterministic queue-based estimation algorithm triggered when an order transitions to `PROCESSING`:
$$\text{estimated\_ready\_at} = \text{now}() + \sum_{o \in Q_{\text{active}}} \text{prep\_time}(o) + \text{prep\_time}(o_{\text{current}})$$
Where each menu item has a baseline preparation duration (e.g., beverages = 3 mins, snacks = 5 mins, main dishes = 10 mins).

### Rationale
- Provides an automated, realistic wait time calculation without requiring manual time inputs from the busy cashier.
- Accurately accounts for kitchen backlog: during rush hours with 5 orders in preparation, new orders automatically reflect the accumulated wait.
- Fully transparent and testable without complex machine learning or external timing services.

### Alternatives Considered
- **Static hardcoded wait times (e.g., fixed 15 mins)**: Rejected because it misleads customers during busy rushes and causes unnecessary waiting during slow periods.
- **Manual cashier time input**: Rejected because it increases cashier workload and cognitive friction during peak operational hours.

---

## 4. WhatsApp Notification Mechanism

### Decision
Use semi-automated WhatsApp deep links via standard URI format:
`https://wa.me/{sanitized_phone}?text={encoded_message}`
Triggered directly via a "Kabari User" action button on the administrative order card.

### Rationale
- Zero cost, zero setup hurdles, and zero vendor lock-in.
- Complies with WhatsApp Terms of Service without requiring official Meta Business verification, message template pre-approvals, or monthly API fees.
- When the cashier marks an order as `READY`, clicking the button immediately launches WhatsApp Web or the WhatsApp desktop client with the customer's phone number and the exact pickup template pre-filled:
  > *"Halo [Nama], pesanan DISPLAY Canteen kamu ([Order-ID]) sudah SIAP diambil di stan kantin. Silakan tunjukkan pesan ini ke kasir. Terima kasih!"*

### Alternatives Considered
- **Official WhatsApp Cloud API / Twilio**: Rejected due to high overhead, mandatory Facebook Business verification, and per-conversation fees unnecessary for an MVP organization canteen.
- **Unofficial WhatsApp Puppeteer/Baileys Web Scraping Bots**: Rejected due to extreme fragility, high maintenance overhead, and frequent account bans by WhatsApp.

---

## 5. Client State & Zero-Auth Architecture

### Decision
- **Guest Flow**: Zero authentication. The guest customer enters `guest_name` and `guest_wa` at checkout. The active `order_id` is stored in the browser's `localStorage`. Live tracking and status polling read this ID so page reloads or accidental browser closures never lose the order.
- **Admin Flow**: Single environment-based shared secret (`ADMIN_SECRET_KEY`) validated via an `X-Admin-Secret` header or HTTP Basic Auth.

### Rationale
- Canteen patrons order while standing or sitting at tables; mandatory registration or email verification causes immediate drop-off and friction.
- Canteen PIC shifts rotate frequently; complex multi-user RBAC is unnecessary overhead for an MVP where PICs share the on-duty canteen laptop.

### Alternatives Considered
- **Guest JWT / Account Registration**: Rejected as it violates Principle III (Frictionless Zero-Auth Guest Ordering).
- **Public unauthenticated admin endpoints**: Rejected as it would allow arbitrary users to manipulate prices or approve orders.

---

## 6. Frontend Component Architecture & Stitch Fidelity

### Decision
Use **React 18 (TypeScript) + Vite** with pure **Tailwind CSS**, strictly referencing the HTML/CSS structure and design tokens from Google Stitch prototypes (`docs/stitch-designs/`):
- `screen-1-menu-mobile.html` → Guest Menu Catalog & Cart Drawer
- `screen-2-payment-mobile.html` → Guest Checkout & QRIS Upload
- `screen-3-status-mobile.html` → Guest Live Order Tracking & Stepper
- `screen-4-admin-kanban-desktop.html` → Admin Order Kanban Board & Verification Modal
- `screen-5-sales-recap-desktop.html` → Admin Sales Dashboard & CSV Export

Icons will use Google Material Symbols Outlined (`<span className="material-symbols-outlined">...</span>`).

### Rationale
- Directly matches `DESIGN.md` design tokens (Light Mode only: `#F8FAFC` canvas, `#FFFFFF` cards, `#0057B8` primary, `#FF6B00` secondary, `#10B981` success).
- Zero third-party UI component libraries (e.g., MUI, Chakra) prevents styling divergence and keeps the client bundle ultra-lightweight.

### Alternatives Considered
- **Shadcn UI / Tailwind UI**: Rejected in favor of direct extraction from Google Stitch prototypes to guarantee 100% design fidelity.

---

## 7. Infrastructure, Containerization & Ingress

### Decision
Containerize via `docker-compose.yml` comprising 3 lightweight services:
1. `backend`: FastAPI Python server (port 8000).
2. `frontend`: Vite React build served via Nginx (port 80/3000).
3. `cloudflared`: Official Cloudflare Tunnel client connecting local port to permanent public hostname.

### Rationale
- Guarantees portable execution: any division member running macOS, Windows, or Linux can clone the repository, run `docker compose up --build`, and immediately serve the canteen.
- Cloudflare Tunnel uses a persistent token (`TUNNEL_TOKEN`) tied to a permanent domain. Physical QR codes printed on canteen tables point to this fixed domain, remaining valid regardless of which PIC's laptop is running the container.

### Alternatives Considered
- **ngrok / localtunnel**: Rejected because free tiers generate randomized ephemeral URLs on each restart, breaking printed physical QR codes.
