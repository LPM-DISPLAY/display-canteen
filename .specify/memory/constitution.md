<!--
Sync Impact Report:
- Version change: Uninitialized Template -> 1.0.0
- Initial ratification of DISPLAY Canteen Constitution.
- Added Core Principles:
  1. I. Centralized Cloud Persistence (Single Source of Truth)
  2. II. Strict Design-System Fidelity (Design-Token & Stitch-First UI)
  3. III. Frictionless Zero-Auth Guest Ordering
  4. IV. Portable Host Runtime with Fixed Public Ingress
  5. V. Pragmatic Operational Automation
  6. VI. Incremental Phase-Gated Delivery ("Vibe Code")
- Added Section: Technical Stack & Architectural Constraints
- Added Section: Development Workflow & Quality Gates
- Added Governance: Supremacy, amendment procedure, semver rules, and compliance requirements.
- Deferred TODOs: None.
-->

# DISPLAY Canteen Constitution

## Core Principles

### I. Centralized Cloud Persistence (Single Source of Truth)
All operational data—including menu catalogs, guest orders, sales transaction histories, and QRIS payment proof images—MUST be stored centrally in cloud-managed infrastructure (Supabase PostgreSQL and Supabase Storage Bucket). Local database containers or transient filesystem storage MUST NOT be used for operational shift data. Because canteen Persons-in-Charge (PICs) rotate hardware between shifts, centralized persistence guarantees continuity and zero data loss across host machine handoffs.

### II. Strict Design-System Fidelity (Design-Token & Stitch-First UI)
Frontend implementation MUST maintain 1:1 visual fidelity with `DESIGN.md` design tokens and the Google Stitch prototypes located in `docs/stitch-designs/*.html`. Styling MUST be constructed exclusively with pure Tailwind CSS and Google Material Symbols Outlined; heavy external UI component suites (e.g., Chakra, MUI, AntD) are strictly prohibited. The UI MUST strictly enforce Light Mode Only (`#F8FAFC` canvas, `#FFFFFF` cards, Primary `#0057B8`, Secondary `#FF6B00`, Emerald Green `#10B981`, Dark Slate `#0F172A`). Order tracking MUST conform precisely to the 6 canonical semantic status badges: `PENDING_PAYMENT`, `VERIFYING_PAYMENT`, `PROCESSING`, `READY`, `COMPLETED`, and `CANCELLED`.

### III. Frictionless Zero-Auth Guest Ordering
The customer ordering journey MUST NOT impose registration, login credentials, or account creation barriers. Customer identity MUST rely solely on guest-provided `guest_name` and `guest_wa` (WhatsApp phone number), tracked on the client via local browser storage / session state. Administrative security for the MVP MUST remain lightweight, using environment-configured pre-shared credentials or Basic Authentication to prevent operational friction during shift transitions.

### IV. Portable Host Runtime with Fixed Public Ingress
The compute layer MUST remain fully portable and runnable on any division member's laptop via Docker Compose orchestration (`backend`, `frontend`, and `cloudflared`). Ingress routing MUST rely on Cloudflare Tunnel (`TUNNEL_TOKEN`) pointing to a fixed, permanent domain/subdomain. Physical QR codes printed on canteen tables and counters MUST remain valid indefinitely regardless of which PIC's machine is actively hosting the services.

### V. Pragmatic Operational Automation
Operational workflows MUST prioritize simple, reliable automations that reduce PIC cognitive load without requiring costly or fragile enterprise integrations:
- Customer pickup notifications MUST use semi-automated `wa.me` deep-link URL templates for one-click admin triggering.
- Queue-based estimated preparation time MUST be computed automatically upon order transition to `PROCESSING`.
- Sales recap metrics MUST provide immediate, one-click CSV export (`/api/reports/export`) to facilitate shift-end handover to team communications and cloud storage.

### VI. Incremental Phase-Gated Delivery ("Vibe Code")
Development and refactoring MUST proceed sequentially across the 5 defined development phases:
1. Phase 1: Foundation (Database & Backend Structure)
2. Phase 2: Core Business Logic (Order Flow Backend)
3. Phase 3: Reporting & Analytics API (Backend)
4. Phase 4: Frontend User App (Mobile Guest Flow)
5. Phase 5: Frontend Admin Dashboard & Dockerization
Work on a subsequent phase MUST NOT begin until the preceding phase is functional, verified, and adhering to architectural constraints.

## Technical Stack & Architectural Constraints

- **Backend Runtime & Framework**: Python 3 with FastAPI, structured asynchronously.
- **Data Layer & ORM**: PostgreSQL hosted on Supabase, accessed via SQLAlchemy ORM; schema changes managed with Alembic migrations.
- **Object Storage**: Supabase Storage Bucket for QRIS payment proof uploads, with a graceful local `/uploads` fallback strictly for offline development.
- **Frontend Stack**: React (TypeScript) initialized via Vite, styled with Tailwind CSS utility classes mirroring `DESIGN.md`.
- **Iconography**: Google Material Symbols Outlined (`<span className="material-symbols-outlined">...</span>`).
- **Containerization**: `docker-compose.yml` defining `backend`, `frontend`, and `cloudflared` services.
- **Configuration Management**: Single centralized root `.env` managing `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, and `TUNNEL_TOKEN`.

## Development Workflow & Quality Gates

- **Verification Before Phase Advancement**: Every feature, schema adjustment, or endpoint MUST be validated locally prior to advancing to dependent tasks.
- **Design Token Audits**: Any new UI component MUST be cross-referenced against the HTML prototypes in `docs/stitch-designs/` to ensure font sizes, hex color classes, and paddings match design specifications.
- **Data Integrity Gates**: Migrations MUST be committed and tested against clean database states without relying on residual local data.
- **Full-Stack Smoke Tests**: Full integration runs MUST be verified with `docker compose up --build` to ensure container networking and tunnel configurations remain healthy.

## Governance

This Constitution acts as the supreme technical and design authority for the DISPLAY Canteen project, superseding informal guidelines or transient PR conventions.

1. **Amendment Procedure**: Amendments to principles, architectural choices, or design constraints require formal documentation, explicit justification, and mutual agreement among division maintainers.
2. **Versioning Policy**: The constitution strictly adheres to semantic versioning (`MAJOR.MINOR.PATCH`):
   - **MAJOR**: Incompatible principle changes, architectural pivots, or removals of core tenets.
   - **MINOR**: Addition of new principles, sections, or substantive governance rules.
   - **PATCH**: Non-semantic clarifications, typographical corrections, or wording improvements.
3. **Compliance Reviews**: All feature specifications (`spec.md`), technical plans (`plan.md`), task definitions (`tasks.md`), and code submissions MUST explicitly demonstrate compliance with this Constitution before merge.

**Version**: 1.0.0 | **Ratified**: 2026-11-04 | **Last Amended**: 2026-11-04
