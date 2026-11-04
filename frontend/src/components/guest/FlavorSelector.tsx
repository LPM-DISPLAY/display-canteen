import React from 'react';
import { FlavorVariant } from '../../types';

interface FlavorSelectorProps {
  selectedFlavors: FlavorVariant[];
  onToggleFlavor: (flavor: FlavorVariant) => void;
  maxFlavors?: number;
}

const FLAVORS_CONFIG: {
  name: FlavorVariant;
  color: string;
  bgLight: string;
  borderActive: string;
  icon: string;
}[] = [
  {
    name: 'Cokelat',
    color: '#4A2810',
    bgLight: 'bg-[#4A2810]/10 text-[#4A2810]',
    borderActive: 'border-[#4A2810] ring-2 ring-[#4A2810]/20',
    icon: 'cookie',
  },
  {
    name: 'Keju',
    color: '#D97706',
    bgLight: 'bg-amber-100 text-amber-900',
    borderActive: 'border-amber-500 ring-2 ring-amber-500/20',
    icon: 'lunch_dining',
  },
  {
    name: 'Strawberry',
    color: '#E11D48',
    bgLight: 'bg-rose-100 text-rose-900',
    borderActive: 'border-rose-500 ring-2 ring-rose-500/20',
    icon: 'nutrition',
  },
  {
    name: 'Blueberry',
    color: '#4338CA',
    bgLight: 'bg-indigo-100 text-indigo-900',
    borderActive: 'border-indigo-600 ring-2 ring-indigo-600/20',
    icon: 'grain',
  },
  {
    name: 'Tiramisu',
    color: '#92400E',
    bgLight: 'bg-amber-200/60 text-[#78350F]',
    borderActive: 'border-[#92400E] ring-2 ring-[#92400E]/20',
    icon: 'coffee',
  },
  {
    name: 'Green Tea',
    color: '#65A30D',
    bgLight: 'bg-lime-100 text-lime-900',
    borderActive: 'border-lime-600 ring-2 ring-lime-600/20',
    icon: 'local_cafe',
  },
];

export const FlavorSelector: React.FC<FlavorSelectorProps> = ({
  selectedFlavors,
  onToggleFlavor,
  maxFlavors = 3,
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
          Pilih Varian Rasa ({selectedFlavors.length}/{maxFlavors})
        </label>
        {selectedFlavors.length > 1 && (
          <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            Kombinasi +Rp 3.000
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {FLAVORS_CONFIG.map((flavor) => {
          const isSelected = selectedFlavors.includes(flavor.name);
          const isMaxReached =
            !isSelected && selectedFlavors.length >= maxFlavors;

          return (
            <button
              key={flavor.name}
              type="button"
              disabled={isMaxReached}
              onClick={() => onToggleFlavor(flavor.name)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-150 ${
                isSelected
                  ? `bg-white ${flavor.borderActive} shadow-sm font-bold scale-[1.02]`
                  : isMaxReached
                  ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 active:scale-95'
              }`}
            >
              {/* Flavor dot indicator */}
              <div
                className="w-5 h-5 rounded-full mb-1 flex items-center justify-center text-white text-[12px] shadow-2xs"
                style={{ backgroundColor: flavor.color }}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px]">
                    check
                  </span>
                )}
              </div>

              <span className="text-xs font-medium text-center leading-tight">
                {flavor.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
