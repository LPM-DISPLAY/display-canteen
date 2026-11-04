import React from 'react';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  onOpenOrders?: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  title = 'DISPLAY Canteen',
  onOpenOrders,
  onOpenCart,
}) => {
  const { totalQuantity } = useCart();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 py-2.5 max-w-lg mx-auto">
        {/* Left Branding / Back */}
        <div className="flex items-center gap-2">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">bakery_dining</span>
            </div>
          )}
          <div>
            <span className="text-base font-bold text-primary tracking-tight block leading-tight">
              {title}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              Spesialis Roti Bakar
            </span>
          </div>
        </div>

        {/* Right Navigation & Cart Controls */}
        <div className="flex items-center gap-1.5">
          {/* My Orders Drawer Trigger */}
          {onOpenOrders && (
            <button
              type="button"
              onClick={onOpenOrders}
              title="Pesanan Saya"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </button>
          )}

          {/* Cart Icon Trigger with Badge */}
          {onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              title="Keranjang Belanja"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-primary hover:bg-slate-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                  {totalQuantity}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
