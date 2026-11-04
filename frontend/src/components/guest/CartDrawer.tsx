import React from 'react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">shopping_cart</span>
            <h3 className="font-bold text-slate-800 text-sm">Keranjang Belanja</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 no-scrollbar">
          {items.map((item, idx) => (
            <div
              key={`${item.menu_id}-${idx}`}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs"
            >
              <div className="flex-1 pr-2">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {item.name}
                </p>
                <p className="text-[11px] text-primary font-medium mt-0.5">
                  {item.flavors.length > 0 ? item.flavors.join(' + ') : 'Original (Mentega Gurih)'}
                </p>
                {item.notes && (
                  <p className="text-[10px] text-slate-400 italic mt-0.5">
                    "{item.notes}"
                  </p>
                )}
                <p className="text-xs font-bold text-slate-700 mt-1">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(idx, item.quantity - 1)}
                  aria-label="Kurangi"
                  className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 font-bold text-xs"
                >
                  -
                </button>
                <span className="text-xs font-bold text-slate-800 min-w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(idx, item.quantity + 1)}
                  aria-label="Tambah"
                  className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 font-bold text-xs"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  aria-label="Hapus item"
                  className="w-6 h-6 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center ml-1"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Checkout CTA */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="text-sm font-extrabold text-slate-900">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          >
            <span>Lanjut ke Pembayaran</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
