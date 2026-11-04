import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Order, DashboardMetrics } from '../types';
import { MetricsCard } from '../components/admin/MetricsCard';
import { MenuManagerModal } from '../components/admin/MenuManagerModal';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminReports: React.FC = () => {
  const navigate = useNavigate();
  const [adminSecret] = useState(() => {
    return localStorage.getItem('admin_secret') || 'displaycanteen2026';
  });

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const loadData = async () => {
    try {
      const [m, o] = await Promise.all([
        api.getDashboardMetrics(adminSecret),
        api.getOrders(undefined, adminSecret),
      ]);
      setMetrics(m);
      setOrders(o);
    } catch (err) {
      console.error('Failed to load reports data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [adminSecret]);

  const handleExportCsv = () => {
    const url = api.getExportUrl(adminSecret);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[20px]">analytics</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              DISPLAY Canteen <span className="text-primary font-bold">Rekapitulasi Penjualan</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Laporan Pendapatan & Ekspor CSV untuk PIC Shift
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">view_kanban</span>
            <span>Kanban</span>
          </button>

          <button
            onClick={() => setShowMenuModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Kelola Menu</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Pendapatan Selesai"
            value={`Rp ${(metrics?.total_revenue || 0).toLocaleString('id-ID')}`}
            subtitle="Dari seluruh transaksi selesai"
            icon="payments"
            color="primary"
          />
          <MetricsCard
            title="Total Pesanan"
            value={`${metrics?.total_orders || 0} Pesanan`}
            subtitle={`${metrics?.completed_orders || 0} selesai, ${metrics?.pending_orders || 0} antre`}
            icon="receipt_long"
            color="secondary"
          />
          <MetricsCard
            title="Pembayaran QRIS"
            value={`Rp ${(metrics?.payment_breakdown.qris || 0).toLocaleString('id-ID')}`}
            subtitle="Digital cashless via Supabase Storage"
            icon="qr_code_scanner"
            color="emerald"
          />
          <MetricsCard
            title="Pembayaran Tunai"
            value={`Rp ${(metrics?.payment_breakdown.cash || 0).toLocaleString('id-ID')}`}
            subtitle="Diterima langsung di kasir"
            icon="point_of_sale"
            color="amber"
          />
        </div>

        {/* Transactions Ledger Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Histori Transaksi Penjualan Roti Bakar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar rincian pesanan dan rasa topping yang dipilih pembeli
              </p>
            </div>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              Unduh CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Order</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Roti & Rasa</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      Belum ada transaksi pada shift ini
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-primary">{o.order_number}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(o.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{o.guest_name}</span>
                        <span className="text-[10px] text-slate-400 block">{o.guest_wa}</span>
                      </td>
                      <td className="py-3 px-4">
                        {o.items.map((i) => (
                          <div key={i.id} className="text-slate-700">
                            <span className="font-semibold">{i.quantity}x {i.item_name}</span>
                            {i.selected_flavors && (
                              <span className="text-[11px] text-primary block">
                                Topping: {i.selected_flavors}
                              </span>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            o.payment_method === 'QRIS'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {o.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={o.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 text-right whitespace-nowrap">
                        Rp {o.total_amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Menu Manager Modal */}
      {showMenuModal && (
        <MenuManagerModal
          adminSecret={adminSecret}
          onClose={() => {
            setShowMenuModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};
