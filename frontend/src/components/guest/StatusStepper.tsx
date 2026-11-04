import React from 'react';
import { OrderStatus } from '../../types';

interface StatusStepperProps {
  currentStatus: OrderStatus;
}

const STEPS = [
  {
    key: 'PENDING_PAYMENT',
    title: 'Pesanan Dibuat',
    desc: 'Menunggu pembayaran',
    icon: 'receipt',
  },
  {
    key: 'VERIFYING_PAYMENT',
    title: 'Verifikasi Pembayaran',
    desc: 'Kasir memeriksa bukti',
    icon: 'verified_user',
  },
  {
    key: 'PROCESSING',
    title: 'Sedang Dipanggang',
    desc: 'Roti sedang dimasak',
    icon: 'outdoor_grill',
  },
  {
    key: 'READY',
    title: 'Siap Diambil',
    desc: 'Ambil di stan kantin',
    icon: 'takeout_dining',
  },
  {
    key: 'COMPLETED',
    title: 'Selesai',
    desc: 'Selamat menikmati',
    icon: 'task_alt',
  },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING_PAYMENT: 0,
  VERIFYING_PAYMENT: 1,
  PROCESSING: 2,
  READY: 3,
  COMPLETED: 4,
  CANCELLED: -1,
};

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-1">
        <span className="material-symbols-outlined text-rose-500 text-3xl">cancel</span>
        <h4 className="text-sm font-bold text-rose-900">Pesanan Dibatalkan</h4>
        <p className="text-xs text-rose-700">
          Pesanan ini telah dibatalkan oleh kasir atau pembayaran tidak terverifikasi.
        </p>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER[currentStatus] ?? 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
      <div className="space-y-4">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              {/* Vertical connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-8 -ml-[1px] ${
                    isDone ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Step Circle Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                  isDone
                    ? 'bg-primary text-white shadow-xs'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20 scale-105 shadow-md'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDone ? 'check' : step.icon}
                </span>
              </div>

              {/* Step Label */}
              <div className="flex-1 pt-0.5">
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-primary'
                      : isDone
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500">{step.desc}</p>
              </div>

              {/* Pulse status indicator for active step */}
              {isCurrent && (
                <span className="w-2 h-2 rounded-full bg-primary animate-ping mt-2 mr-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
