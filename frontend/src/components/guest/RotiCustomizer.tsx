import React from 'react';
import { FlavorVariant } from '../../types';
import { ToppingLayer } from './ToppingLayer';

interface RotiCustomizerProps {
  selectedFlavors: FlavorVariant[];
  onRemoveFlavor?: (flavor: FlavorVariant) => void;
}

export const RotiCustomizer: React.FC<RotiCustomizerProps> = ({
  selectedFlavors,
  onRemoveFlavor,
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none py-2">
      {/* Plate / Glow Container */}
      <div className="relative w-72 h-56 md:w-80 md:h-64 flex items-center justify-center">
        {/* Ambient plate shadow & rim */}
        <div className="absolute inset-x-2 bottom-3 h-20 bg-slate-300/60 rounded-full blur-md -z-10" />
        <div className="absolute inset-0 bg-white/80 rounded-3xl border border-slate-200/80 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Subtle wooden/ceramic plate texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0057B8_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Base Roti Bakar (Golden Crust + Soft Center + Grill Marks) */}
        <div className="relative w-56 h-44 md:w-64 md:h-48 rounded-2xl bg-gradient-to-br from-[#E89C48] via-[#D97724] to-[#B45309] shadow-xl border-4 border-[#92400E]/70 overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
          {/* Butter glaze highlight */}
          <div className="absolute top-2 left-3 right-3 h-10 bg-amber-200/40 rounded-full blur-xs" />
          
          {/* Bread crumb texture */}
          <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-[#FDE68A] via-[#FBBF24] to-[#D97706] shadow-inner opacity-90" />

          {/* Diagonal Char / Grill Marks */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-0 left-10 w-2 h-full bg-[#78350F] rotate-45 transform origin-top -translate-x-12" />
            <div className="absolute top-0 left-24 w-2.5 h-full bg-[#78350F] rotate-45 transform origin-top -translate-x-12" />
            <div className="absolute top-0 left-38 w-2 h-full bg-[#78350F] rotate-45 transform origin-top -translate-x-12" />
            <div className="absolute top-0 left-52 w-2.5 h-full bg-[#78350F] rotate-45 transform origin-top -translate-x-12" />
          </div>

          {/* Render Active Toppings Layer with Bounce Animation */}
          {selectedFlavors.map((flavor) => (
            <ToppingLayer key={flavor} flavor={flavor} />
          ))}

          {/* Crispy Toast Edge Corner */}
          <div className="absolute bottom-1 right-2 text-[10px] font-bold text-[#78350F]/60 uppercase tracking-widest pointer-events-none">
            Fresh Toasted
          </div>
        </div>

        {/* Empty state hint when no flavor is picked */}
        {selectedFlavors.length === 0 && (
          <div className="absolute bottom-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full animate-bounce shadow-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">touch_app</span>
            Pilih varian rasa di bawah
          </div>
        )}
      </div>

      {/* Active Flavor Chips */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 min-h-[30px] px-2">
        {selectedFlavors.length > 0 ? (
          selectedFlavors.map((flavor) => (
            <span
              key={flavor}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full animate-fade-in shadow-2xs"
            >
              <span>{flavor}</span>
              {onRemoveFlavor && (
                <button
                  type="button"
                  onClick={() => onRemoveFlavor(flavor)}
                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary/20 text-primary -mr-1"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 font-medium italic">
            Belum ada rasa yang dipilih
          </span>
        )}
      </div>
    </div>
  );
};
