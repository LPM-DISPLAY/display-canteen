import React from 'react';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  tableNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  title = 'DISPLAY Canteen',
  tableNumber = 'Meja Stand',
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 py-3 max-w-lg mx-auto">
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
              Spesialis Roti Bakar Hangat
            </span>
          </div>
        </div>

        {tableNumber && (
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">{tableNumber}</span>
          </div>
        )}
      </div>
    </header>
  );
};
