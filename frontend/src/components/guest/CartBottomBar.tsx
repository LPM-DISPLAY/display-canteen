import React from 'react';
import { useCart } from '../../context/CartContext';

interface CartBottomBarProps {
  onOpenCart: () => void;
  onCheckout: () => void;
}

export const CartBottomBar: React.FC<CartBottomBarProps> = ({
  onOpenCart,
  onCheckout,
}) => {
  const { totalQuantity, totalAmount } = useCart();

  if (totalQuantity === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto px-3.5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] bg-primary text-white shadow-2xl rounded-t-2xl border-t border-primary-light flex items-center justify-between animate-slide-up">
      {/* Left: Cart Info trigger */}
      <button
        type="button"
        onClick={onOpenCart}
        className="flex items-center gap-2.5 text-left active:opacity-80 transition-opacity"
      >
        <div className="relative w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          <span className="absolute -top-1 -right-1 bg-secondary text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {totalQuantity}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-blue-100 block leading-tight">
            Total {totalQuantity} Roti Bakar
          </span>
          <span className="text-sm font-black text-white tracking-tight block">
            Rp {totalAmount.toLocaleString('id-ID')}
          </span>
        </div>
      </button>

      {/* Right: Checkout CTA */}
      <button
        type="button"
        onClick={onCheckout}
        className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
      >
        <span>Checkout</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </div>
  );
};
