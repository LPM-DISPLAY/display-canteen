---
name: DISPLAY Canteen - Modern Canteen Commerce
stitch_project_id: "10927491898818491861"
stitch_design_system_id: "assets/79471b31710e4335b40d1d8681ac290e"
theme_mode: LIGHT_ONLY
colors:
  surface: '#faf8ff'
  surface-canvas: '#f8fafc'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#424752'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#727784'
  outline-variant: '#c2c6d4'
  surface-tint: '#0d5bbc'
  primary: '#00408b'
  on-primary: '#ffffff'
  primary-container: '#0057b8'
  on-primary-container: '#bfd2ff'
  inverse-primary: '#adc7ff'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#004e33'
  on-tertiary: '#ffffff'
  tertiary-container: '#006846'
  on-tertiary-container: '#5debaf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  background: '#f8fafc'
  on-background: '#0f172a'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

# DESIGN.md — DISPLAY Canteen Design System & UI Guidelines

Dokumen ini adalah **Single Source of Truth (SSOT)** untuk desain antarmuka **DISPLAY Canteen**.
Dokumen menggunakan format hibrida yang kompatibel penuh dengan **Google Stitch MCP** (`upload_design_md` / `assets/79471b31710e4335b40d1d8681ac290e`) sekaligus menjadi pedoman teknis bagi **AI Agent** saat mengonversi prototipe HTML ke **React + Tailwind CSS**.

---

## 1. Brand & Style

Sistem desain ini dirancang untuk pemesanan makanan kantin organisasi yang cepat, fungsional, dan menggugah selera, diekstraksi langsung dari identitas visual `assets/logo display.png`.

- **Mode Tema**: **Light Mode Only** (`#F8FAFC` base canvas dan `#FFFFFF` card surface). Dilarang menambahkan variasi dark mode agar kontras dan keterbacaan tetap tinggi di lingkungan kantin yang terang.
- **Efficient & Decisive**: Alur pemesanan tanpa login yang memangkas antrean kasir.
- **Warm & Appetizing**: Perpaduan warna biru profesional dengan aksen oranye hangat yang menonjolkan tombol tambah keranjang dan status memasak aktif.

---

## 2. Core Color Palette & Brand Tokens

| Token | Hex | Tailwind Equivalent | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Primary (Display Blue)** | `#0057B8` | `bg-[#0057B8]` / `text-[#0057B8]` | Navigasi utama, tab aktif, tombol Checkout utama, nomor pesanan, verifikasi kasir |
| **Primary Dark** | `#00408B` | `hover:bg-[#00408B]` | State hover/active pada tombol Primary Blue |
| **Secondary (Display Orange)** | `#FF6B00` | `bg-[#FF6B00]` / `text-[#FF6B00]` | Tombol `+ Tambah` menu, CTA konfirmasi pembayaran, indikator status `PROCESSING` |
| **Tertiary (Fresh Emerald)** | `#10B981` | `bg-emerald-500` / `text-emerald-600` | Badge ketersediaan (`Tersedia`), status pesanan `READY`, tombol kirim WhatsApp (`wa.me`) |
| **Neutral Dark Slate** | `#0F172A` | `text-slate-900` | Judul menu, nominal harga Rupiah (`Rp`), nomor antrean |
| **Surface Canvas** | `#F8FAFC` | `bg-[#F8FAFC]` / `bg-slate-50` | Latar belakang utama halaman mobile & desktop |
| **Card Surface** | `#FFFFFF` | `bg-white border-slate-200` | Kartu menu, kartu Kanban pesanan, modal, dan tabel rekap |

---

## 3. Semantic Order Status Badges (Standar 6 Status Pesanan)

Baik di **Halaman Live Status Pelanggan (Mobile)** maupun **Dashboard Kanban Kasir (Desktop)**, keenam status pesanan wajib menggunakan kombinasi warna dan gaya badge berikut:

| Status Enum (`Order.status`) | Label UI (ID) | Tailwind Classes (Badge / Pill) | Indikator / Ikon (`material-symbols-outlined`) |
| :--- | :--- | :--- | :--- |
| `PENDING_PAYMENT` | **Menunggu Pembayaran** | `bg-amber-50 text-amber-700 border border-amber-200` | `payments` / `schedule` |
| `VERIFYING_PAYMENT` | **Verifikasi Pembayaran (QRIS)** | `bg-blue-50 text-[#0057B8] border border-blue-200` | `receipt_long` / `fact_check` |
| `PROCESSING` | **Sedang Dimasak** | `bg-orange-50 text-[#FF6B00] border border-orange-200` | `skillet` / `outdoor_grill` + `animate-pulse` dot |
| `READY` | **Siap Diambil** | `bg-emerald-50 text-emerald-700 border border-emerald-200` | `check_circle` / `notifications_active` |
| `COMPLETED` | **Selesai** | `bg-slate-100 text-slate-600 border border-slate-200` | `task_alt` |
| `CANCELLED` | **Dibatalkan** | `bg-red-50 text-red-700 border border-red-200` | `cancel` |

---

## 4. Typography & Iconography

- **Font Utama**: `Inter` (Google Fonts) untuk seluruh teks judul, body, dan angka.
- **Format Angka & Rupiah**: Gunakan `tabular-nums` (`font-variant-numeric: tabular-nums`) pada semua harga (`Rp 18.000`), total keranjang, countdown timer, dan tabel laporan agar digit angka sejajar vertikal.
- **Sistem Ikon**: Menggunakan **Google Material Symbols Outlined** (`<span className="material-symbols-outlined">...</span>`) sesuai prototipe HTML Google Stitch. Pastikan stylesheet Material Symbols dimuat di `frontend/index.html`.

---

## 5. Layout, Elevation & Shapes

- **Customer App (Mobile-First)**: Dirancang untuk viewport smartphone (`max-w-md mx-auto min-h-screen bg-[#F8FAFC]`), dengan *sticky top header* dan *sticky bottom cart / action bar*. Target sentuh minimal `44px × 44px`.
- **Admin Dashboard (Desktop-First)**: Dirancang untuk layar kasir/laptop (`min-w-[1024px] max-w-[1440px] mx-auto bg-[#F8FAFC]`) dengan layout Kanban 4 kolom dan tabel analitik berdensitas tinggi.
- **Elevation**: Gunakan **1px solid border** (`border-slate-200`) dengan micro-shadow (`shadow-sm`). Untuk *Sticky Bottom Cart Bar*, gunakan `shadow-[0_4px_16px_-2px_rgba(0,87,184,0.08)]`.
- **Corner Radius**: Buttons/Inputs `rounded-lg` (`8px`), Cards `rounded-xl` (`12px-16px`), Category Pills & Status Badges `rounded-full`.

---

## 6. Component & Screen Reference Mapping (Stitch 1:1 Fidelity)

Agent **wajib** menggunakan pendekatan **Pure Tailwind CSS (1:1 extraction)** dari file prototipe Google Stitch yang tersimpan di direktori `docs/stitch-designs/`. Jangan memasang UI component library berat (seperti Material UI, AntD, atau Chakra) yang dapat merusak keselarasan visual.

| Layar / Fitur | Target Route React | File Referensi HTML Stitch | File Referensi Visual (PNG) |
| :--- | :--- | :--- | :--- |
| **1. Customer Menu Catalog & Cart** | `/` | `docs/stitch-designs/screen-1-menu-mobile.html` | `docs/stitch-designs/screen-1-menu-mobile.png` |
| **2. Checkout & Payment (Cash / QRIS Upload)** | `/checkout` & `/payment/:id` | `docs/stitch-designs/screen-2-payment-mobile.html` | `docs/stitch-designs/screen-2-payment-mobile.png` |
| **3. Live Order Status & Queue Tracker** | `/status/:id` | `docs/stitch-designs/screen-3-status-mobile.html` | `docs/stitch-designs/screen-3-status-mobile.png` |
| **4. Admin Order Kanban Dashboard** | `/admin` (atau `/admin/orders`) | `docs/stitch-designs/screen-4-admin-kanban-desktop.html` | `docs/stitch-designs/screen-4-admin-kanban-desktop.png` |
| **5. Admin Sales Recap & CSV Export** | `/admin/reports` | `docs/stitch-designs/screen-5-sales-recap-desktop.html` | `docs/stitch-designs/screen-5-sales-recap-desktop.png` |

---

## 7. Rules for AI Agents & Google Stitch Workflow

1. **Saat Mengonversi ke React (`/frontend`)**:
   - Baca file HTML di `docs/stitch-designs/` yang sesuai sebelum membuat halaman/komponen React.
   - Pertahankan struktur class Tailwind, palet warna `#0057B8` & `#FF6B00`, serta ikon Material Symbols dari HTML tersebut.
   - Pecah menjadi komponen modular yang bersih (misal: `MenuCard.tsx`, `FloatingCartBar.tsx`, `OrderStepper.tsx`, `KanbanColumn.tsx`, `QrisProofModal.tsx`).
2. **Saat Men-generate / Mengedit Layar Baru di Google Stitch (`StitchMCP`)**:
   - Selalu gunakan `projectId: "10927491898818491861"` dan `designSystem: "assets/79471b31710e4335b40d1d8681ac290e"`.
   - Jika ada pembaruan pada `DESIGN.md` ini, sinkronkan ke Stitch menggunakan tool `StitchMCP:upload_design_md`.
