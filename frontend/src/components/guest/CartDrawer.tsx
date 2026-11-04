import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { items, updateQuantity, removeItem, totalAmount, totalQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (totalQuantity === 0) return null;

  return (
    <>
      {/* Floating Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-4 max-w-md mx-auto pointer-events-none">
        <div className="bg-[#0F172A] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto backdrop-blur-md border border-slate-700/60 transition-all active:scale-[0.99]">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 text-left focus:outline-hidden"
          >
            <div className="relative">
              <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </span>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-[11px] font-bold">
                {totalQuantity}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Total Pesanan</p>
              <p className="text-base font-bold text-white tracking-tight">
                Rp {totalAmount.toLocaleString('id-ID')}
              </p>
            </div>
          </button>

          <button
            onClick={onCheckout}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>Bayar</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Slide-Up Cart Details Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">shopping_cart</span>
                <h3 className="font-bold text-slate-800 text-base">Keranjang Roti Bakar</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
              {items.map((item, idx) => (
                <div
                  key={`${item.menu_id}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60"
                >
                  <div className="flex-1 pr-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      Rasa: {item.flavors.length > 0 ? item.flavors.join(' + ') : 'Original Mentega'}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="text-sm font-bold text-slate-800 min-w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                    <button
                      onClick={() => removeItem(idx)}
                      className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center ml-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Checkout CTA */}
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-base font-bold text-slate-900">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
              >
                <span>Lanjut ke Pembayaran</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
