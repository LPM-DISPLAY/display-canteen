import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { PublicQueueResponse } from '../types';
import { formatWIB } from '../services/time';

export const PublicQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PublicQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchQueue = async () => {
    try {
      const res = await api.getPublicQueue();
      setData(res);
      setLastUpdated(res.server_time_wib);
    } catch (err) {
      console.error('Failed to fetch public queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // 8-second auto polling
    const interval = setInterval(fetchQueue, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Bar for TV & Visitors */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              title="Kembali ke Menu"
            >
              <span className="material-symbols-outlined text-[24px]">bakery_dining</span>
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>DISPLAY Canteen</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Live Queue
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Papan Status Antrean Roti Bakar Terkini
              </p>
            </div>
          </div>

          {/* Right Live Clock & Sync indicator */}
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">Auto-Update 8s</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {lastUpdated || 'Menyinkronkan...'}
              </span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>Pesan Roti</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Queue Dashboard Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Sedang Disiapkan (PROCESSING) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-amber-50/40 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  progress_activity
                </span>
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Sedang Disiapkan
                </h2>
                <p className="text-xs text-orange-800 font-medium">
                  Roti sedang dipanggang di dapur
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-secondary bg-white px-3 py-1 rounded-full border border-orange-200 shadow-2xs">
              {data?.processing.length || 0} Antre
            </span>
          </div>

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
            {loading ? (
              <div className="py-20 text-center text-slate-400">
                <span className="material-symbols-outlined animate-spin text-3xl text-secondary">
                  progress_activity
                </span>
                <p className="text-xs mt-2">Memuat antrean...</p>
              </div>
            ) : !data?.processing.length ? (
              <div className="py-20 text-center text-slate-400 space-y-1">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  cookie
                </span>
                <p className="text-xs font-semibold">Tidak ada pesanan yang sedang diproses.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.processing.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 shadow-2xs space-y-1 hover:border-secondary transition-all"
                  >
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">
                      {item.order_number}
                    </span>
                    <span className="text-xs font-bold text-slate-600 block">
                      a.n. {item.guest_name}
                    </span>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-orange-700 font-medium">
                      <span>Waktu Pesan</span>
                      <span>{formatWIB(item.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Column 2: Siap Diambil (READY) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50/40 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-bounce">
                <span className="material-symbols-outlined text-[20px]">
                  notifications_active
                </span>
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Siap Diambil
                </h2>
                <p className="text-xs text-emerald-800 font-medium">
                  Silakan menuju meja kasir
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
              {data?.ready.length || 0} Siap
            </span>
          </div>

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
            {loading ? (
              <div className="py-20 text-center text-slate-400">
                <span className="material-symbols-outlined animate-spin text-3xl text-emerald-600">
                  progress_activity
                </span>
                <p className="text-xs mt-2">Memuat pesanan siap...</p>
              </div>
            ) : !data?.ready.length ? (
              <div className="py-20 text-center text-slate-400 space-y-1">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  hourglass_empty
                </span>
                <p className="text-xs font-semibold">Belum ada pesanan yang siap diambil.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.ready.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-xs space-y-1 animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-emerald-950 tracking-tight">
                        {item.order_number}
                      </span>
                      <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                        check_circle
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-800 block">
                      a.n. {item.guest_name}
                    </span>
                    <p className="text-[10px] text-emerald-700 pt-1 font-semibold uppercase tracking-wider">
                      ★ Siap di Meja Kasir
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
