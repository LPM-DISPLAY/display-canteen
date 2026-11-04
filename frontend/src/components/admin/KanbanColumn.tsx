import React from 'react';
import { Order, OrderStatus } from '../../types';
import { OrderCard } from './OrderCard';

interface KanbanColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewProof: (order: Order) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  orders,
  onUpdateStatus,
  onViewProof,
}) => {
  return (
    <div className="flex flex-col min-w-[300px] max-w-[340px] bg-slate-100/70 rounded-3xl p-3 border border-slate-200/80 shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          {title}
        </h3>
        <span className="bg-white border border-slate-200 text-slate-800 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
          {orders.length}
        </span>
      </div>

      {/* Orders List */}
      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar max-h-[calc(100vh-210px)] pr-1">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            Tidak ada pesanan
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onViewProof={onViewProof}
            />
          ))
        )}
      </div>
    </div>
  );
};
