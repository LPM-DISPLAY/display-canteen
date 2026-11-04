# Product Requirements Document (PRD): DISPLAY Canteen

## 1. Project Overview
**DISPLAY Canteen** adalah aplikasi pemesanan makanan kantin berbasis web yang dirancang untuk anggota organisasi/tamu. Untuk versi saat ini, DISPLAY Canteen berfokus secara eksklusif menjual **Roti Bakar** dengan kustomisasi rasa interaktif (Cokelat, Keju, Strawberry, Blueberry, Tiramisu, dan Green Tea). Tujuannya adalah mempermudah proses pemesanan melalui *scan* QR code tanpa memerlukan registrasi (login). Sistem akan melacak pesanan menggunakan Nama dan Nomor WhatsApp, memberikan estimasi waktu selesai antrean, serta menyediakan antarmuka kasir (admin) untuk manajemen pesanan dan rekapitulasi penjualan.

## 2. Target Pengguna
1. **Pelanggan (User)**: Orang yang datang ke kantin, memindai QR code di meja/stan, dan mengkustomisasi roti bakar favorit mereka secara visual lewat smartphone.
2. **Admin/Kasir**: Anggota divisi yang bertugas piket jaga kantin (PIC bisa berganti-ganti tiap hari/shift).

## 3. Fitur Utama (Core Features)

### 3.1. Fitur Pelanggan (Frontend User)
- **Interactive Roti Bakar Customizer**: Tampilan visual kanvas Roti Bakar di tengah layar. Pelanggan dapat memilih varian rasa (Cokelat, Keju, Strawberry, Blueberry, Tiramisu, Green Tea) dengan animasi *bounce* interaktif saat rasa ditambahkan ke atas roti.
- **Keranjang Belanja**: Menambahkan kombinasi roti bakar dan mengatur jumlah pesanan.
- **Checkout Tanpa Login**: Memasukkan "Nama" dan "Nomor WhatsApp" sebagai identitas pesanan.
- **Pemilihan Pembayaran**:
  - **Cash**: Menampilkan instruksi untuk membayar di kasir.
  - **QRIS**: Menampilkan gambar QR Code statis dan menyediakan form untuk *Upload* gambar bukti transfer.
- **Live Status & Estimasi Waktu**: Halaman *polling* yang menampilkan status pesanan secara *real-time* dan waktu estimasi makanan siap (muncul otomatis saat pesanan mulai diproses).

### 3.2. Fitur Admin (Frontend Dashboard)
- **Manajemen Menu**: Menambah, mengubah, atau menonaktifkan menu.
- **Dashboard Pesanan (Kanban/List)**:
  - Melihat pesanan baru masuk (Menunggu Pembayaran).
  - Memverifikasi bukti transfer QRIS yang diunggah pelanggan (tersimpan di Supabase Storage).
  - Memproses pesanan (Mengubah status menjadi "Diproses" yang otomatis memicu kalkulasi waktu estimasi).
- **Notifikasi WhatsApp**: Tombol aksi "Kabari User" yang akan membuka tab WhatsApp Web (`wa.me`) dengan pesan otomatis (template) untuk memberi tahu pesanan siap diambil.
- **Rekapitulasi Penjualan & Ekspor**: Halaman laporan yang menampilkan metrik pendapatan dan tombol "Ekspor CSV" untuk mengunduh histori penjualan harian/bulanan yang siap dibagikan ke grup WA divisi atau Google Drive.

## 4. Alur Status Pesanan (Order Flow)
1. `PENDING_PAYMENT`: Pesanan dibuat.
2. `VERIFYING_PAYMENT`: (Hanya untuk QRIS) Pelanggan mengunggah bukti transfer.
3. `PROCESSING`: Admin mengonfirmasi pembayaran (cash/qris). Antrean dan estimasi waktu mulai dihitung.
4. `READY`: Makanan selesai dimasak. Admin menekan tombol WA.
5. `COMPLETED`: Makanan telah diambil oleh pelanggan.
6. `CANCELLED`: Dibatalkan oleh admin (misal bukti transfer tidak valid).

## 5. Arsitektur Hosting & Infrastruktur
- **Backend**: Python 3, FastAPI, SQLAlchemy (ORM), Alembic.
- **Database**: PostgreSQL di Cloud (Supabase Free Tier) sebagai Single Source of Truth terpusat.
- **Penyimpanan Gambar (Storage)**: Supabase Storage Bucket (Free Tier 1GB) agar foto bukti transfer dapat diakses oleh siapapun yang membuka dashboard admin lintas hari/laptop.
- **Frontend**: React (TypeScript), Vite, Tailwind CSS.
- **Design System**: Menggunakan warna Primary (Biru) dan Secondary (Oranye) yang diekstraksi dari logo `assets/logo display.png`.
- **Runtime Portable (Docker Compose)**: Seluruh aplikasi dikemas dalam `docker-compose.yml` (`backend`, `frontend`, dan `cloudflared`). Siapapun anggota divisi yang bertugas cukup menjalankan `docker compose up` di laptopnya.
- **Domain & Akses Publik (Cloudflare Tunnel)**: Menggunakan token Cloudflare Tunnel pada file `.env`. URL publik bersifat permanen sehingga QR Code fisik yang dicetak di meja tidak perlu diganti meski laptop yang menyala berganti orang.
