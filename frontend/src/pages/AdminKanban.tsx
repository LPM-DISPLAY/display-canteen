import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { KanbanColumn } from '../components/admin/KanbanColumn';
import { ProofModal } from '../components/admin/ProofModal';
import { SearchFilterBar } from '../components/admin/SearchFilterBar';
import { playOrderChime } from '../services/audio';

export const AdminKanban: React.FC = () => {
  const navigate = useNavigate();
  const [adminSecret, setAdminSecret] = useState(() => {
    return localStorage.getItem('admin_secret') || 'displaycanteen2026';
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'QRIS' | 'CASH'>('ALL');
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Track known order IDs for chime trigger
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  const fetchOrders = async () => {
    try {
      const list = await api.getOrders(undefined, adminSecret);

      // Check for newly arrived orders
      if (!initialLoadRef.current && audioEnabled) {
        const hasNewOrder = list.some(
          (o) =>
            !knownOrderIdsRef.current.has(o.id) &&
            (o.status === 'PENDING_PAYMENT' || o.status === 'VERIFYING_PAYMENT')
        );
        if (hasNewOrder) {
          playOrderChime();
        }
      }

      // Update known IDs
      knownOrderIdsRef.current = new Set(list.map((o) => o.id));
      initialLoadRef.current = false;

      setOrders(list);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat daftar pesanan.');
    }
  };

  useEffect(() => {
    localStorage.setItem('admin_secret', adminSecret);
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [adminSecret, audioEnabled]);

  const handleToggleAudio = () => {
    // If activating, play test chime to unlock browser audio context
    if (!audioEnabled) {
      playOrderChime();
    }
    setAudioEnabled((prev) => !prev);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status, adminSecret);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status');
    }
  };

  // Filter orders by search query and payment filter
  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.guest_name.toLowerCase().includes(q);
      const matchNumber = order.order_number.toLowerCase().includes(q);
      if (!matchName && !matchNumber) return false;
    }

    // Payment method filter
    if (paymentFilter === 'QRIS' && order.payment_method !== 'QRIS') {
      return false;
    }
    if (paymentFilter === 'CASH' && order.payment_method !== 'CASH') {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[20px]">view_kanban</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              DISPLAY Canteen <span className="text-primary font-bold">Admin Kanban</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Manajemen Pesanan Roti Bakar Real-Time
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">view_kanban</span>
            <span>Kanban</span>
          </button>

          <button
            onClick={() => navigate('/admin/reports')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>Laporan & Ekspor</span>
          </button>

          <button
            onClick={() => window.open('/queue', '_blank')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            title="Buka Layar Monitor Antrean"
          >
            <span className="material-symbols-outlined text-[16px]">tv</span>
            <span className="hidden sm:inline">Layar TV Antrean</span>
          </button>

          <button
            onClick={() => window.open('/', '_blank')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            title="Buka Aplikasi Pelanggan"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span className="hidden sm:inline">Menu Tamu</span>
          </button>
        </div>
      </header>

      {/* Main Kanban Content */}
      <main className="flex-1 p-6 space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl flex items-center justify-between">
            <span>{errorMsg}</span>
            <input
              type="password"
              placeholder="Admin Secret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="px-2 py-1 bg-white border border-rose-300 rounded text-xs ml-4"
            />
          </div>
        )}

        {/* Search, Filter & Sound Bar */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
        />

        {/* Kanban Board Columns */}
        <div className="flex items-start gap-4 pb-6 min-h-[calc(100vh-200px)] overflow-x-auto">
          {/* Column 1: QRIS Verifying */}
          <KanbanColumn
            title="Verifikasi QRIS"
            status="VERIFYING_PAYMENT"
            orders={filteredOrders.filter((o) => o.status === 'VERIFYING_PAYMENT')}
            onUpdateStatus={handleUpdateStatus}
            onViewProof={(order) => setSelectedProofOrder(order)}
          />

          {/* Column 2: Pending Cash */}
          <KanbanColumn
            title="Menunggu Kasir"
            status="PENDING_PAYMENT"
            orders={filteredOrders.filter((o) => o.status === 'PENDING_PAYMENT')}
            onUpdateStatus={handleUpdateStatus}
            onViewProof={(order) => setSelectedProofOrder(order)}
          />

          {/* Column 3: Processing */}
          <KanbanColumn
            title="Sedang Dipanggang"
            status="PROCESSING"
            orders={filteredOrders.filter((o) => o.status === 'PROCESSING')}
            onUpdateStatus={handleUpdateStatus}
            onViewProof={(order) => setSelectedProofOrder(order)}
          />

          {/* Column 4: Ready for Pickup */}
          <KanbanColumn
            title="Siap Diambil"
            status="READY"
            orders={filteredOrders.filter((o) => o.status === 'READY')}
            onUpdateStatus={handleUpdateStatus}
            onViewProof={(order) => setSelectedProofOrder(order)}
          />

          {/* Column 5: Completed */}
          <KanbanColumn
            title="Selesai"
            status="COMPLETED"
            orders={filteredOrders.filter((o) => o.status === 'COMPLETED')}
            onUpdateStatus={handleUpdateStatus}
            onViewProof={(order) => setSelectedProofOrder(order)}
          />
        </div>
      </main>

      {/* Proof Modal */}
      {selectedProofOrder && selectedProofOrder.payment_proof_url && (
        <ProofModal
          imageUrl={selectedProofOrder.payment_proof_url}
          orderNumber={selectedProofOrder.order_number}
          customerName={selectedProofOrder.guest_name}
          totalAmount={selectedProofOrder.total_amount}
          onClose={() => setSelectedProofOrder(null)}
          onVerify={() => handleUpdateStatus(selectedProofOrder.id, 'PROCESSING')}
        />
      )}
    </div>
  );
};
