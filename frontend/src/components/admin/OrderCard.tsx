import React from 'react';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatWIB } from '../../services/time';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewProof: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onViewProof,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base text-primary tracking-tight">
            {order.order_number}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {formatWIB(order.created_at)}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              order.payment_method === 'QRIS'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {order.payment_method}
          </span>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      {/* Customer Information */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-slate-800">{order.guest_name}</p>
          <p className="text-[11px] text-slate-500 font-medium">WA: {order.guest_wa}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400 font-medium">Total</p>
          <p className="font-extrabold text-slate-900 text-sm">
            Rp {order.total_amount.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Ordered Items with Custom Flavors */}
      <div className="space-y-1.5 pt-1">
        {order.items.map((item) => (
          <div key={item.id} className="text-xs border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
            <div className="flex justify-between items-baseline font-bold text-slate-800">
              <span>{item.quantity}x {item.item_name}</span>
              <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {item.selected_flavors && (
              <span className="inline-block mt-0.5 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Rasa: {item.selected_flavors}
              </span>
            )}
            {item.notes && (
              <p className="text-[10px] text-slate-400 italic mt-0.5">"{item.notes}"</p>
            )}
          </div>
        ))}
      </div>

      {/* Proof Thumbnail if QRIS */}
      {order.payment_proof_url && (
        <button
          type="button"
          onClick={() => onViewProof(order)}
          className="w-full py-2 px-3 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">image</span>
          <span>Lihat Bukti Transfer QRIS</span>
        </button>
      )}

      {/* Action Buttons based on Status */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
        {/* PENDING / VERIFYING -> Move to PROCESSING */}
        {(order.status === 'PENDING_PAYMENT' || order.status === 'VERIFYING_PAYMENT') && (
          <button
            onClick={() => onUpdateStatus(order.id, 'PROCESSING')}
            className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">skillet</span>
            Proses Masak
          </button>
        )}

        {/* PROCESSING -> Move to READY */}
        {order.status === 'PROCESSING' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Siap Diambil
          </button>
        )}

        {/* READY -> WhatsApp "Kabari User" + COMPLETED */}
        {order.status === 'READY' && (
          <>
            {order.wa_notify_url && (
              <a
                href={order.wa_notify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Kabari WA
              </a>
            )}
            <button
              onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              Selesai
            </button>
          </>
        )}

        {/* Cancel button if not completed */}
        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
          <button
            onClick={() => {
              if (confirm(`Batalkan pesanan ${order.order_number}?`)) {
                onUpdateStatus(order.id, 'CANCELLED');
              }
            }}
            className="px-2.5 py-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
            title="Batalkan Pesanan"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
