import React from 'react';

interface ProofModalProps {
  imageUrl: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  onClose: () => void;
  onVerify?: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  imageUrl,
  orderNumber,
  customerName,
  totalAmount,
  onClose,
  onVerify,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Bukti Pembayaran QRIS</h3>
            <p className="text-xs text-slate-500">
              {orderNumber} • {customerName} (Rp {totalAmount.toLocaleString('id-ID')})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Image Preview Container */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-50">
          <img
            src={imageUrl}
            alt="Bukti Transfer QRIS"
            className="max-h-[60vh] w-auto object-contain rounded-xl shadow-md border border-slate-200"
          />
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
          >
            Tutup
          </button>
          {onVerify && (
            <button
              onClick={() => {
                onVerify();
                onClose();
              }}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Verifikasi & Proses
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
