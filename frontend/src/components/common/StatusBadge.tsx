import React from 'react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; icon: string; pulse?: boolean }
> = {
  PENDING_PAYMENT: {
    label: 'Menunggu Pembayaran',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'hourglass_empty',
  },
  VERIFYING_PAYMENT: {
    label: 'Verifikasi Pembayaran',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'verified',
    pulse: true,
  },
  PROCESSING: {
    label: 'Sedang Diproses',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: 'skillet',
    pulse: true,
  },
  READY: {
    label: 'Siap Diambil',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'check_circle',
  },
  COMPLETED: {
    label: 'Selesai',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: 'task_alt',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'cancel',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING_PAYMENT;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${sizeClasses}`}
    >
      <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
      <span>{config.label}</span>
      {config.pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse ml-0.5" />
      )}
    </span>
  );
};
