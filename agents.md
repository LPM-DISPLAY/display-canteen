# Agent Instructions & Development Guidelines (DISPLAY Canteen)

This document serves as the primary guideline for any AI agent or developer contributing to the **DISPLAY Canteen** project. Read this carefully before writing code.

## 1. Project Context
DISPLAY Canteen is an MVP web application for an organization's canteen. Customers order food via a physical QR code link on tables/counter without logging in, tracked by Name & WhatsApp, with automated queue-based estimated ready times.
The system is operated by rotating division members (PICs). Therefore, the architecture uses a **centralized Cloud Database & Storage (Supabase)** while running the compute layer portably via **Docker Compose + Cloudflare Tunnel** on whichever PIC's laptop is active.

Reference:
- `PRD.md`: Exact product and business requirements.
- `DESIGN.md`: Single Source of Truth for visual design tokens, UI components, and Stitch design specifications.
- `docs/stitch-designs/`: HTML and PNG prototypes generated via Google Stitch.

## 2. Tech Stack & Architecture
- **Backend Architecture (`/backend`)**:
  - Framework: FastAPI (Python).
  - ORM: SQLAlchemy with PostgreSQL (Supabase Cloud).
  - Migrations: Alembic.
  - File Uploads: Supabase Storage Bucket (with local `/uploads` fallback for offline development).
- **Frontend Architecture (`/frontend`)**:
  - Framework: React (TypeScript) + Vite.
  - Styling: Pure Tailwind CSS (Strictly matching `DESIGN.md` and Stitch HTML in `docs/stitch-designs/`).
  - Theme: **Light Mode Only** (`#F8FAFC` canvas, `#FFFFFF` cards).
  - Colors: Primary Blue (`#0057B8`), Secondary Orange (`#FF6B00`), Emerald Green (`#10B981`), Dark Slate (`#0F172A`).
  - Icons: Google Material Symbols Outlined (`<span className="material-symbols-outlined">...</span>`).
- **Infrastructure & Deployment (`/docker-compose.yml`)**:
  - Services: `backend`, `frontend`, and `cloudflared` (Cloudflare Tunnel).
  - Environment Configuration: Centralized in `.env` (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, `TUNNEL_TOKEN`).

## 3. Core Development Rules
1. **Incremental Development ("Vibe Code")**: Follow the 5 Development Phases strictly. Complete one phase, verify it works, then move to the next.
2. **Centralized Data (Single Source of Truth)**: Do not rely on local PostgreSQL instances inside individual laptops for production shifts. Connect to the shared Supabase PostgreSQL and Supabase Storage so that when the PIC rotates laptops, all menus, orders, sales history, and QRIS proofs remain seamless.
3. **Strict UI Design Consistency (`DESIGN.md` & Stitch HTML)**:
   - When building frontend components, agents **must** inspect the corresponding HTML prototype in `docs/stitch-designs/*.html`.
   - Extract Tailwind classes directly for 1:1 visual fidelity with the Stitch designs.
   - Do not install heavy third-party UI libraries (Chakra, MUI, AntD).
   - Adhere strictly to the **6 Semantic Status Badges** defined in `DESIGN.md` (`PENDING_PAYMENT`, `VERIFYING_PAYMENT`, `PROCESSING`, `READY`, `COMPLETED`, `CANCELLED`).
4. **Permanent Public URL via Cloudflare Tunnel**: Physical QR codes printed on tables point to a fixed domain/subdomain managed by Cloudflare Tunnel. The `cloudflared` service in Docker connects this domain to whichever laptop is running the container.
5. **No Auth (MVP)**: Do not implement complex JWT authentication for the user app. The system relies entirely on `guest_name` and `guest_wa` coupled with local browser state/session. Admin panel auth can be a simple hardcoded password or Basic Auth for the MVP.
6. **WhatsApp Notification**: Do not integrate heavy official API providers. Use the semi-auto `wa.me` URL generation technique for the admin to click and notify customers.
7. **Sales Recap Export**: The admin dashboard must provide an instant "Export CSV" feature so the on-duty PIC can download the sales recap at the end of their shift and send it to the team's WhatsApp group / Drive.

## 4. Development Roadmap (The 5 Phases)

**Phase 1: Foundation (Database & Backend Structure)**
- Setup FastAPI, CORS, PostgreSQL connection (Supabase/SQLAlchemy).
- Create Models (`Menu`, `Order`, `OrderItem`).
- Create Menu CRUD endpoints.
- Setup Supabase Storage / local file upload utility.

**Phase 2: Core Business Logic (Order Flow Backend)**
- Create Checkout POST endpoint.
- Create QRIS upload endpoint (`/api/orders/{id}/upload-proof`).
- Create Admin order management endpoints (GET list, PUT status).
- Implement Queue-based Estimated Time calculation (Triggered on `PROCESSING` status).

**Phase 3: Reporting & Analytics API (Backend)**
- Create Dashboard metrics endpoint (`/api/reports/dashboard`).
- Create CSV export endpoint (`/api/reports/export`).

**Phase 4: Frontend User App (Reference: `screen-1`, `screen-2`, `screen-3` in `docs/stitch-designs/`)**
- Setup Vite + Tailwind CSS (Configure theme colors from `DESIGN.md`, import Material Symbols).
- Build Menu Catalog with Cart state (Reference: `docs/stitch-designs/screen-1-menu-mobile.html`).
- Build Checkout form (Name, WA) & Payment page with QRIS upload (Reference: `docs/stitch-designs/screen-2-payment-mobile.html`).
- Build Live Status Polling Page & Queue Stepper (Reference: `docs/stitch-designs/screen-3-status-mobile.html`).

**Phase 5: Frontend Admin Dashboard & Dockerization (Reference: `screen-4`, `screen-5` in `docs/stitch-designs/`)**
- Build Admin Layout & Menu Manager.
- Build Order Kanban Dashboard with QRIS Verification UI & `wa.me` button (Reference: `docs/stitch-designs/screen-4-admin-kanban-desktop.html`).
- Build Sales Report Dashboard & "Export CSV" button (Reference: `docs/stitch-designs/screen-5-sales-recap-desktop.html`).
- Create `docker-compose.yml`, Dockerfiles, and `.env.example` (with `cloudflared` tunnel setup).

## 5. Instructions for Agents
- When tasked with "continue development", identify which phase is currently incomplete by inspecting the codebase.
- Always read `PRD.md` and `DESIGN.md` before making architectural or UI changes.
- Always use `display-canteen` as your working directory.
- For backend development: run `uvicorn main:app --reload` inside `/backend` (with venv activated).
- For frontend development: run `npm run dev` inside `/frontend`.
- For full-stack test: run `docker compose up --build`.
- After finishing a task, check off the list or document what has been completed.
