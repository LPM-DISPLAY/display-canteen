import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Order } from '../types';
import { Header } from '../components/common/Header';
import { StatusBadge } from '../components/common/StatusBadge';
import { StatusStepper } from '../components/guest/StatusStepper';

export const StatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const data = await api.getOrder(id);
      setOrder(data);
      setErrorMsg('');

      // Calculate countdown if estimated_ready_at is present
      if (data.estimated_ready_at) {
        const target = new Date(data.estimated_ready_at).getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.max(0, Math.ceil((target - now) / 60000));
        setMinutesLeft(diffMinutes);
      } else {
        setMinutesLeft(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat status pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // 5-second polling interval
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !order) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center shadow-lg">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Memuat status pesanan...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center shadow-lg">
        <span className="material-symbols-outlined text-rose-500 text-5xl mb-2">error</span>
        <h3 className="font-bold text-slate-800 text-base">Pesanan Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">{errorMsg}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col pb-16 shadow-lg">
      <Header showBack onBack={() => navigate('/')} title="Status Pesanan" />

      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Main Status Hero Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs text-center space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">Nomor Pesanan</span>
            <span className="text-xs font-bold text-slate-500">
              {new Date(order.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <h2 className="text-3xl font-black text-primary tracking-tight">
            {order.order_number}
          </h2>

          <div className="flex justify-center">
            <StatusBadge status={order.status} size="lg" />
          </div>

          {/* Dynamic Countdown for PROCESSING */}
          {order.status === 'PROCESSING' && (
            <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3.5 mt-2 space-y-1 animate-pulse">
              <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">
                Estimasi Siap
              </span>
              <p className="text-xl font-extrabold text-orange-900">
                {minutesLeft !== null && minutesLeft > 0 ? `~${minutesLeft} Menit Lagi` : 'Sebentar Lagi Siap!'}
              </p>
              <p className="text-[10px] text-orange-700">
                Roti Bakarmu sedang dipanggang di dapur kantin.
              </p>
            </div>
          )}

          {/* Pickup Callout for READY */}
          {order.status === 'READY' && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 space-y-1.5 animate-bounce">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700">
                <span className="material-symbols-outlined text-[24px]">celebration</span>
                <span className="text-sm font-extrabold">Pesanan Siap Diambil!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Silakan menuju meja kasir DISPLAY Canteen dan sebutkan nomor{' '}
                <strong>{order.order_number}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Status Stepper Progression */}
        <StatusStepper currentStatus={order.status} />

        {/* Order Items Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Item Roti yang Dipesan
            </span>
            <span className="text-xs font-bold text-slate-500">{order.guest_name}</span>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-slate-800">
                    {item.quantity}x {item.item_name}
                  </span>
                  <p className="text-[11px] text-primary font-semibold mt-0.5">
                    Topping: {item.selected_flavors || 'Original'}
                  </p>
                  {item.notes && (
                    <p className="text-[10px] text-slate-400 italic">"{item.notes}"</p>
                  )}
                </div>
                <span className="font-bold text-slate-700">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Metode Pembayaran</span>
            <span className="font-bold text-slate-800 uppercase">
              {order.payment_method === 'QRIS' ? 'QRIS Online' : 'Tunai di Kasir'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span className="text-slate-800">Total Pembayaran</span>
            <span className="text-primary text-base font-extrabold">
              Rp {order.total_amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* CTA to order again */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Pesan Roti Bakar Lainnya
        </button>
      </main>
    </div>
  );
};
