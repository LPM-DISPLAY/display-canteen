# Implementation Plan: DISPLAY Canteen MVP

**Branch**: `001-canteen-mvp` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-canteen-mvp/spec.md`

## Summary

Build the MVP for DISPLAY Canteen: a lightweight, friction-free web ordering platform enabling canteen customers to browse menus, build a cart, and place orders via physical QR code scans without creating an account or logging in. Customers settle payment via Cash or QRIS image upload, and track preparation status in real-time with queue-based estimated completion countdowns. Rotating division PICs manage orders through an administrative Kanban dashboard, preview and verify transfer receipts, trigger one-click WhatsApp ready notifications via `wa.me`, and export daily sales summaries as CSV files. Centralized persistence uses Supabase Cloud (PostgreSQL and Object Storage), while compute runs portably on any PIC's laptop via Docker Compose orchestrated with Cloudflare Tunnel.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript / Node.js 20+ (Frontend)

**Primary Dependencies**:
- Backend: FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic v2, Alembic, Supabase-py / httpx, python-multipart
- Frontend: React 18, Vite, Tailwind CSS, Lucide / Google Material Symbols Outlined

**Storage**:
- PostgreSQL (Supabase Cloud Free Tier) as centralized Single Source of Truth
- Supabase Storage Bucket (`payment-proofs`) for QRIS proof images (with local `/uploads` fallback)

**Testing**: Pytest & httpx (Backend API / Contract tests), Vitest / React Testing Library (Frontend)

**Target Platform**: Portable Docker Compose host on macOS / Linux / Windows, public access via Cloudflare Tunnel (`cloudflared`)

**Project Type**: Full-stack web application (FastAPI backend + Vite React frontend)

**Performance Goals**:
- Page load and catalog hydration under 1.5s
- Status polling refresh rate 5s with < 100ms response time
- Proof image upload and storage transfer completed in < 3s

**Constraints**:
- Strict Light Mode Only (`#F8FAFC` canvas, `#FFFFFF` cards, `#0057B8` primary, `#FF6B00` secondary)
- 1:1 visual fidelity with Google Stitch HTML prototypes in `docs/stitch-designs/`
- Zero guest authentication; admin authorization via simple shared secret

**Scale/Scope**: Organization canteen with ~50-200 orders per shift, 10-30 concurrent patrons, single PIC laptop host

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Alignment | Status |
|---|---|---|---|
| **I. Centralized Cloud Persistence** | Cloud Supabase PostgreSQL & Storage; no machine-local shift state | Cloud DB & Storage selected; rotating PICs maintain full continuity | **PASS** |
| **II. Strict Design-System Fidelity** | Pure Tailwind CSS matching `DESIGN.md` & Stitch HTML; 6 status badges | Extracted directly from `docs/stitch-designs/`; no heavy 3rd-party UI libraries | **PASS** |
| **III. Frictionless Zero-Auth** | No login wall for guests; `guest_name` + `guest_wa` in `localStorage` | Client state schema preserves order; lightweight admin token | **PASS** |
| **IV. Portable Host Runtime** | Docker Compose + Cloudflare Tunnel for permanent table QR code domain | `docker-compose.yml` with `backend`, `frontend`, `cloudflared` | **PASS** |
| **V. Pragmatic Automation** | Semi-auto `wa.me` links; queue calculation on `PROCESSING`; CSV export | Deep link templates, deterministic queue estimation algorithm, CSV generator | **PASS** |
| **VI. Incremental Phase Delivery** | Strict sequential 5-phase delivery with verification gates | Plan structured explicitly across the 5 canonical phases | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/001-canteen-mvp/
├── plan.md              # Implementation Plan
├── research.md          # Phase 0 Architectural Decisions & Research
├── data-model.md        # Phase 1 Data Model & Status State Machine
├── quickstart.md        # Phase 1 End-to-End Verification Guide
├── contracts/           # Phase 1 API & UI Contracts
│   ├── openapi.yaml     # REST API OpenAPI 3.1 specification
│   └── ui-contracts.md  # UI routes, tokens, and Stitch component mapping
└── tasks.md             # Phase 2 Work Breakdown (/speckit-tasks output)
```

### Source Code (repository root)

```text
display-canteen/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── menus.py         # Menu CRUD endpoints
│   │   │   ├── orders.py        # Checkout, status polling, proof upload, Kanban triage
│   │   │   └── reports.py       # Dashboard metrics & CSV export
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic Settings & environment parsing
│   │   │   ├── database.py      # SQLAlchemy session & engine
│   │   │   └── storage.py       # Supabase Storage client with local fallback
│   │   ├── models/
│   │   │   ├── menu.py          # SQLAlchemy Menu model
│   │   │   └── order.py         # SQLAlchemy Order & OrderItem models
│   │   ├── schemas/
│   │   │   ├── menu.py          # Pydantic Menu schemas
│   │   │   ├── order.py         # Pydantic Order & Checkout schemas
│   │   │   └── report.py        # Pydantic Report & Metric schemas
│   │   ├── services/
│   │   │   ├── queue_calc.py    # Dynamic wait time algorithm
│   │   │   └── notification.py  # WhatsApp wa.me template generator
│   │   └── main.py              # FastAPI application entrypoint & CORS
│   ├── alembic/                 # Database migrations
│   │   ├── env.py
│   │   └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Header, StatusBadge, Button, Modal
│   │   │   ├── guest/           # MenuCard, CartDrawer, QRISViewer, ProofUpload, StatusStepper
│   │   │   └── admin/           # KanbanColumn, OrderCard, ProofModal, MetricsCard
│   │   ├── context/
│   │   │   └── CartContext.tsx  # In-memory cart state
│   │   ├── pages/
│   │   │   ├── MenuPage.tsx     # Guest catalog (screen-1)
│   │   │   ├── CheckoutPage.tsx # Guest payment & QRIS upload (screen-2)
│   │   │   ├── StatusPage.tsx   # Guest live order tracking (screen-3)
│   │   │   ├── AdminKanban.tsx  # PIC order management (screen-4)
│   │   │   └── AdminReports.tsx # PIC sales dashboard & CSV export (screen-5)
│   │   ├── services/
│   │   │   └── api.ts           # Axios / fetch client for backend endpoints
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces mirroring data-model
│   │   ├── App.tsx              # Router configuration
│   │   ├── main.tsx             # Entrypoint
│   │   └── index.css            # Tailwind directives & Material Symbols
│   ├── index.html
│   ├── tailwind.config.js       # Tokens from DESIGN.md
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docs/
│   └── stitch-designs/          # Single Source of Truth HTML & PNG prototypes
├── .env.example
├── .gitignore
├── docker-compose.yml
├── DESIGN.md
├── PRD.md
└── AGENTS.md
```

**Structure Decision**: Web application layout with dedicated `/backend` and `/frontend` directories, containerized via root `docker-compose.yml` with `cloudflared`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitutional violations. All architectural choices strictly conform to the 6 core principles.*
