import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order } from '../types';
import { OrdersDrawer } from '../components/guest/OrdersDrawer';
import { StatusBadge } from '../components/common/StatusBadge';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  useEffect(() => {
    // Check if user has an active order in localStorage
    try {
      const stored = localStorage.getItem('display_canteen_guest');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.active_order_id) {
          api.getOrder(parsed.active_order_id)
            .then((ord) => {
              // Only consider active if not COMPLETED or CANCELLED
              if (ord.status !== 'COMPLETED' && ord.status !== 'CANCELLED') {
                setActiveOrder(ord);
              }
            })
            .catch(() => {
              // Ignore if order fetch fails
            });
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-5 shadow-lg relative overflow-x-hidden">
      {/* Top Brand Bar */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[22px]">bakery_dining</span>
          </div>
          <div>
            <span className="text-sm font-black text-primary tracking-tight block leading-tight">
              DISPLAY Canteen
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">
              Spesialis Roti Bakar
            </span>
          </div>
        </div>

        {/* Live Kitchen Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dapur Buka</span>
        </div>
      </header>

      {/* Hero Visual Section */}
      <section className="my-auto py-4 flex flex-col items-center text-center">
        {/* Animated Roti Bakar Stage with Steam & Glow */}
        <div className="relative w-64 h-52 flex items-center justify-center">
          {/* Ambient Warm Golden Glow */}
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl -z-10 animate-pulse" />
          <div className="absolute inset-x-6 bottom-2 h-8 bg-slate-400/25 rounded-full blur-md -z-10" />

          {/* Steam wisps */}
          <div className="absolute -top-3 inset-x-0 flex justify-center gap-5 opacity-50 pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-[20px] animate-bounce">
              air
            </span>
            <span className="material-symbols-outlined text-slate-400 text-[24px] animate-bounce delay-150">
              air
            </span>
          </div>

          {/* Sliced Bread Toast Illustration */}
          <div className="relative w-48 h-40 transform transition-transform duration-300 hover:scale-105">
            <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-xl overflow-visible">
              <defs>
                <linearGradient id="splash-crust" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="50%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#5B210B" />
                </linearGradient>
                <radialGradient id="splash-crumb" cx="50%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="#FEF3C7" />
                  <stop offset="45%" stopColor="#FDE68A" />
                  <stop offset="85%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </radialGradient>
                <radialGradient id="splash-butter" cx="50%" cy="45%" r="40%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#FDE047" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                </radialGradient>
                <clipPath id="splash-bread-shape">
                  <path d="M 28 65 C 24 38, 55 18, 110 18 C 165 18, 196 38, 192 65 C 190 95, 198 135, 185 178 C 180 186, 172 188, 155 188 L 65 188 C 48 188, 40 186, 35 178 C 22 135, 30 95, 28 65 Z" />
                </clipPath>
              </defs>

              {/* Crust */}
              <path
                d="M 28 65 C 24 38, 55 18, 110 18 C 165 18, 196 38, 192 65 C 190 95, 198 135, 185 178 C 180 186, 172 188, 155 188 L 65 188 C 48 188, 40 186, 35 178 C 22 135, 30 95, 28 65 Z"
                fill="url(#splash-crust)"
              />
              {/* Crumb */}
              <path
                d="M 33 68 C 30 44, 58 26, 110 26 C 162 26, 190 44, 187 68 C 185 96, 191 133, 180 174 C 176 181, 168 183, 153 183 L 67 183 C 52 183, 44 181, 40 174 C 29 133, 35 96, 33 68 Z"
                fill="url(#splash-crumb)"
              />
              {/* Grilled Char Marks */}
              <g clipPath="url(#splash-bread-shape)" opacity="0.3" stroke="#78350F" strokeWidth="6" strokeLinecap="round">
                <line x1="10" y1="50" x2="160" y2="200" />
                <line x1="50" y1="20" x2="200" y2="170" />
                <line x1="100" y1="10" x2="220" y2="130" />
              </g>
              {/* Butter puddle */}
              <ellipse cx="110" cy="105" rx="55" ry="38" fill="url(#splash-butter)" />

              {/* Meses & Keju Toppings Layer Sample */}
              <g opacity="0.95">
                {/* Chocolate Meses */}
                <rect x="55" y="80" width="8" height="3" rx="1.5" fill="#2B1408" transform="rotate(20 55 80)" />
                <rect x="75" y="95" width="8.5" height="3" rx="1.5" fill="#1F0D04" transform="rotate(-30 75 95)" />
                <rect x="95" y="75" width="8" height="3" rx="1.5" fill="#3D1E0B" transform="rotate(45 95 75)" />
                <rect x="115" y="85" width="8.5" height="3" rx="1.5" fill="#2B1408" transform="rotate(-15 115 85)" />
                <rect x="135" y="98" width="8" height="3" rx="1.5" fill="#1F0D04" transform="rotate(35 135 98)" />
                <rect x="150" y="80" width="8.5" height="3" rx="1.5" fill="#3D1E0B" transform="rotate(-25 150 80)" />

                {/* Shredded Cheddar Keju Strands */}
                <path d="M 60 70 Q 80 62 105 72" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <path d="M 90 68 Q 120 78 145 68" fill="none" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
                <path d="M 70 115 Q 100 125 130 112" fill="none" stroke="#FCD34D" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 110 110 Q 140 102 165 115" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          {/* Floating Pill Badges */}
          <div className="absolute -top-1 -left-2 bg-white/95 backdrop-blur-xs border border-amber-200 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-fade-in">
            <span className="material-symbols-outlined text-[13px] text-amber-600">local_fire_department</span>
            Hangat & Crispy
          </div>

          <div className="absolute -bottom-1 -right-2 bg-white/95 backdrop-blur-xs border border-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-fade-in">
            <span className="material-symbols-outlined text-[13px]">payments</span>
            Rp 6.000 / porsi
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="mt-5 space-y-1.5 max-w-xs">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Selamat Datang di <span className="text-primary">DISPLAY Canteen</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Pesan roti bakar hangat kreasimu langsung dari meja tanpa ribet antre dan tanpa perlu login.
          </p>
        </div>

        {/* Active Order Card Alert (If Present) */}
        {activeOrder && (
          <div className="w-full mt-4 bg-primary/5 border border-primary/20 rounded-2xl p-3 flex items-center justify-between text-left animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px] animate-pulse">
                  restaurant
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900">
                    Pesanan #{activeOrder.order_number}
                  </span>
                  <StatusBadge status={activeOrder.status} size="sm" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  {activeOrder.status === 'READY'
                    ? 'Pesanan sudah siap diambil di counter!'
                    : 'Sedang disiapkan di dapur.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/orders/${activeOrder.id}`)}
              className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-0.5 shrink-0"
            >
              <span>Lihat</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        )}
      </section>

      {/* Primary Actions (The 2 Core Requests) */}
      <section className="space-y-3 pb-2">
        {/* Action 1: Pesan Roti Bakar */}
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-white p-4.5 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px]">lunch_dining</span>
            </div>
            <div>
              <span className="text-base font-black tracking-tight block">
                Pesan Roti Bakar
              </span>
              <span className="text-[11px] text-white/80 font-medium block">
                Pilih kombinasi meses, keju, tiramisu & selai
              </span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </span>
        </button>

        {/* Action 2: Pantau Pesanan */}
        <button
          type="button"
          onClick={() => {
            if (activeOrder) {
              navigate(`/orders/${activeOrder.id}`);
            } else {
              setIsOrdersOpen(true);
            }
          }}
          className="w-full bg-white border-2 border-slate-200 hover:border-primary/40 text-slate-800 p-4 rounded-2xl shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[26px]">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight block">
                  Pantau Pesanan
                </span>
                {activeOrder && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {activeOrder
                  ? 'Cek status pesanan aktif Anda saat ini'
                  : 'Cek riwayat pesanan & status antrean dapur'}
              </span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </span>
        </button>

        {/* Floating Cart Indicator if Cart has items */}
        {totalQuantity > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="w-full bg-secondary text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-between active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>Ada {totalQuantity} roti bakar di keranjang</span>
              </div>
              <span className="inline-flex items-center gap-1 underline text-[11px]">
                Lanjutkan Pesan
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Footer Secondary Links */}
      <footer className="pt-2 border-t border-slate-100 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => navigate('/queue')}
            className="hover:text-primary flex items-center gap-1 py-1"
          >
            <span className="material-symbols-outlined text-[16px]">tv</span>
            Layar Antrean TV
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => setIsOrdersOpen(true)}
            className="hover:text-primary flex items-center gap-1 py-1"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            Riwayat Pesanan
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="hover:text-primary flex items-center gap-1 py-1 text-slate-400"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Admin PIC
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          DISPLAY Canteen © 2026 • Himpunan Mahasiswa DISPLAY
        </p>
      </footer>

      {/* Orders Drawer Modal */}
      <OrdersDrawer isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
    </div>
  );
};