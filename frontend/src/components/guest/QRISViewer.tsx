import React from 'react';

interface QRISViewerProps {
  totalAmount: number;
}

export const QRISViewer: React.FC<QRISViewerProps> = ({ totalAmount }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
          </span>
          <span className="text-sm font-bold text-slate-800">QRIS DISPLAY Canteen</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          NMID Terverifikasi
        </span>
      </div>

      {/* QR Code Container */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col items-center justify-center">
        {/* Static QR SVG / Code */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200">
          <svg
            className="w-48 h-48"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Realistic stylized QR pattern */}
            <rect width="100" height="100" fill="white" />
            {/* Top-left marker */}
            <rect x="10" y="10" width="24" height="24" fill="#0F172A" rx="3" />
            <rect x="14" y="14" width="16" height="16" fill="white" />
            <rect x="18" y="18" width="8" height="8" fill="#0057B8" />
            {/* Top-right marker */}
            <rect x="66" y="10" width="24" height="24" fill="#0F172A" rx="3" />
            <rect x="70" y="14" width="16" height="16" fill="white" />
            <rect x="74" y="18" width="8" height="8" fill="#0057B8" />
            {/* Bottom-left marker */}
            <rect x="10" y="66" width="24" height="24" fill="#0F172A" rx="3" />
            <rect x="14" y="70" width="16" height="16" fill="white" />
            <rect x="18" y="74" width="8" height="8" fill="#0057B8" />
            {/* Random QR data dots */}
            <rect x="40" y="12" width="6" height="6" fill="#0F172A" />
            <rect x="52" y="12" width="6" height="6" fill="#0F172A" />
            <rect x="46" y="24" width="6" height="6" fill="#0F172A" />
            <rect x="40" y="36" width="8" height="8" fill="#FF6B00" />
            <rect x="12" y="42" width="6" height="6" fill="#0F172A" />
            <rect x="24" y="48" width="6" height="6" fill="#0F172A" />
            <rect x="40" y="52" width="6" height="6" fill="#0F172A" />
            <rect x="54" y="46" width="8" height="8" fill="#0F172A" />
            <rect x="68" y="40" width="6" height="6" fill="#0F172A" />
            <rect x="80" y="48" width="8" height="8" fill="#0F172A" />
            <rect x="44" y="68" width="6" height="6" fill="#0F172A" />
            <rect x="58" y="64" width="6" height="6" fill="#0F172A" />
            <rect x="72" y="74" width="8" height="8" fill="#0F172A" />
            <rect x="84" y="68" width="6" height="6" fill="#0F172A" />
            <rect x="50" y="80" width="8" height="8" fill="#0F172A" />
            <rect x="66" y="84" width="6" height="6" fill="#0F172A" />
          </svg>
        </div>

        <p className="text-xs text-slate-500 font-medium mt-2">
          Scan dengan GoPay, OVO, Dana, BCA, atau m-Banking
        </p>

        <div className="mt-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-xs text-primary font-medium">Nominal Transfer:</span>
          <span className="text-sm font-extrabold text-primary">
            Rp {totalAmount.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
};
