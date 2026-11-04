import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersDrawer: React.FC<OrdersDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchRecentOrders() {
      setLoading(true);
      try {
        const guestData = localStorage.getItem('display_canteen_guest');
        if (!guestData) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(guestData);
        const orderIds: string[] = parsed.recent_orders || [];

        if (orderIds.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch each recent order (up to 5 most recent)
        const reversedIds = [...orderIds].reverse().slice(0, 5);
        const fetched: Order[] = [];

        for (const id of reversedIds) {
          try {
            const ord = await api.getOrder(id);
            fetched.push(ord);
          } catch {
            // ignore deleted/unavailable orders
          }
        }

        setOrders(fetched);
      } catch (err) {
        console.error('Failed to load recent orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-2xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              receipt_long
            </span>
            <h3 className="text-sm font-bold text-slate-800">Riwayat Pesanan Saya</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
                progress_activity
              </span>
              <span className="text-xs">Memuat pesanan Anda...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-[36px] text-slate-300">
                shopping_basket
              </span>
              <p className="text-xs font-medium">Belum ada riwayat pesanan di perangkat ini.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                onClick={() => {
                  onClose();
                  navigate(`/orders/${order.id}`);
                }}
                className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-primary/40 hover:shadow-sm cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary">
                    {order.order_number}
                  </span>
                  <StatusBadge status={order.status} size="sm" />
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span className="line-clamp-1">
                        {it.quantity}x {it.item_name}
                      </span>
                      <span className="text-slate-400">
                        {it.selected_flavors ? it.selected_flavors : 'Original'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    {new Date(order.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Asia/Jakarta',
                    })}{' '}
                    WIB
                  </span>
                  <span className="font-bold text-slate-900">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link to Public Queue */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/queue');
            }}
            className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1 w-full py-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tv</span>
            Lihat Layar Antrean Publik (/queue)
          </button>
        </div>
      </div>
    </div>
  );
};
