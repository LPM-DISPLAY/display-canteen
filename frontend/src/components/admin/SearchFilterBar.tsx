import React from 'react';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  paymentFilter: 'ALL' | 'QRIS' | 'CASH';
  onPaymentFilterChange: (p: 'ALL' | 'QRIS' | 'CASH') => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  paymentFilter,
  onPaymentFilterChange,
  audioEnabled,
  onToggleAudio,
}) => {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama pelanggan atau nomor pesanan (ORD-xxx)..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Payment Filter Pills & Audio Alert Toggle */}
      <div className="flex items-center gap-2">
        {/* Payment Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => onPaymentFilterChange('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              paymentFilter === 'ALL'
                ? 'bg-white text-slate-800 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onPaymentFilterChange('QRIS')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              paymentFilter === 'QRIS'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            QRIS
          </button>
          <button
            type="button"
            onClick={() => onPaymentFilterChange('CASH')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              paymentFilter === 'CASH'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Tunai
          </button>
        </div>

        {/* Audio Toggle Button */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            audioEnabled
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title={audioEnabled ? 'Bunyi Chime Aktif saat pesanan baru masuk' : 'Klik untuk mengaktifkan bunyi notifikasi'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {audioEnabled ? 'volume_up' : 'volume_off'}
          </span>
          <span>{audioEnabled ? 'Suara Aktif' : 'Suara Mati'}</span>
        </button>
      </div>
    </div>
  );
};
