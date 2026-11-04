import React from 'react';
import { FlavorVariant } from '../../types';
import { ToppingLayer } from './ToppingLayer';

interface RotiCustomizerProps {
  selectedFlavors: FlavorVariant[];
  onRemoveFlavor?: (flavor: FlavorVariant) => void;
  compact?: boolean;
}

const JAM_FLAVORS: FlavorVariant[] = ['Strawberry', 'Blueberry', 'Tiramisu', 'Green Tea'];

export const RotiCustomizer: React.FC<RotiCustomizerProps> = ({
  selectedFlavors,
  onRemoveFlavor,
  compact = false,
}) => {
  // Determine split layout if 2 toppings are selected
  const getSplitSide = (flavor: FlavorVariant): 'left' | 'right' | 'full' => {
    if (selectedFlavors.length <= 1) return 'full';

    const [flavor1, flavor2] = selectedFlavors;
    const isJam1 = JAM_FLAVORS.includes(flavor1);
    const isJam2 = JAM_FLAVORS.includes(flavor2);

    // Case 1: Both are jams -> strict 50:50 left-right split
    if (isJam1 && isJam2) {
      return flavor === flavor1 ? 'left' : 'right';
    }

    // Case 2: One jam + one sprinkle -> Jam is full base spread, sprinkle is layered full on top
    if (isJam1 || isJam2) {
      return 'full';
    }

    // Case 3: Both are sprinkles (e.g. Cokelat + Keju) -> 50:50 split for clear distinction
    return flavor === flavor1 ? 'left' : 'right';
  };

  return (
    <div className={`relative w-full mx-auto flex flex-col items-center select-none ${compact ? 'py-1' : 'py-2'}`}>
      {/* Toast Stage Container */}
      <div className="relative w-64 h-48 sm:w-72 sm:h-52 flex items-center justify-center">
        {/* Soft plate shadow */}
        <div className="absolute inset-x-4 bottom-1 h-10 bg-slate-400/30 rounded-full blur-md -z-10" />

        {/* Realistic Sliced Bread Toast (Roti Tawar Bakar Slice) */}
        <div className="relative w-52 h-44 sm:w-56 sm:h-48 flex items-center justify-center transform transition-transform duration-200 hover:scale-[1.02]">
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              {/* Bread Crust Gradient (Toasted Baked Edge) */}
              <linearGradient id="crust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="50%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#5B210B" />
              </linearGradient>

              {/* Bread Crumb Interior (Soft Warm Golden Toast) */}
              <radialGradient id="crumb-grad" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="45%" stopColor="#FDE68A" />
                <stop offset="85%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>

              {/* Melted Butter Sheen */}
              <radialGradient id="butter-sheen" cx="50%" cy="45%" r="40%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#FDE047" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>

              {/* Clip path matching the exact bread slice contour */}
              <clipPath id="bread-slice-shape">
                <path d="M 28 65 C 24 38, 55 18, 110 18 C 165 18, 196 38, 192 65 C 190 95, 198 135, 185 178 C 180 186, 172 188, 155 188 L 65 188 C 48 188, 40 186, 35 178 C 22 135, 30 95, 28 65 Z" />
              </clipPath>
            </defs>

            {/* Outer Crust Layer */}
            <path
              d="M 28 65 C 24 38, 55 18, 110 18 C 165 18, 196 38, 192 65 C 190 95, 198 135, 185 178 C 180 186, 172 188, 155 188 L 65 188 C 48 188, 40 186, 35 178 C 22 135, 30 95, 28 65 Z"
              fill="url(#crust-grad)"
            />

            {/* Inner Soft Bread Crumb */}
            <path
              d="M 33 68 C 30 44, 58 26, 110 26 C 162 26, 190 44, 187 68 C 185 96, 191 133, 180 174 C 176 181, 168 183, 153 183 L 67 183 C 52 183, 44 181, 40 174 C 29 133, 35 96, 33 68 Z"
              fill="url(#crumb-grad)"
            />

            {/* Diagonal Grilled Char Marks */}
            <g clipPath="url(#bread-slice-shape)" opacity="0.32" stroke="#78350F" strokeWidth="6" strokeLinecap="round">
              <line x1="10" y1="50" x2="160" y2="200" />
              <line x1="50" y1="20" x2="200" y2="170" />
              <line x1="100" y1="10" x2="220" y2="130" />
            </g>

            {/* Golden Melted Butter Gloss Puddle */}
            <ellipse cx="110" cy="105" rx="55" ry="38" fill="url(#butter-sheen)" />
            <ellipse cx="85" cy="85" rx="22" ry="14" fill="#FFFBEB" opacity="0.45" />
          </svg>

          {/* Active Toppings Overlay within Bread Contour */}
          <div className="absolute inset-0" style={{ clipPath: 'polygon(12% 10%, 88% 10%, 92% 92%, 8% 92%)' }}>
            {selectedFlavors.map((flavor) => (
              <ToppingLayer
                key={flavor}
                flavor={flavor}
                splitSide={getSplitSide(flavor)}
              />
            ))}
          </div>
        </div>

        {/* Empty state hint */}
        {selectedFlavors.length === 0 && (
          <div className="absolute bottom-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-[14px]">touch_app</span>
            Roti Original Mentega • Pilih varian di bawah
          </div>
        )}
      </div>

      {/* Active Flavor Chips */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 min-h-[26px] px-2">
        {selectedFlavors.length > 0 ? (
          selectedFlavors.map((flavor) => (
            <span
              key={flavor}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full animate-fade-in shadow-2xs"
            >
              <span>{flavor}</span>
              {onRemoveFlavor && (
                <button
                  type="button"
                  onClick={() => onRemoveFlavor(flavor)}
                  aria-label={`Hapus ${flavor}`}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-primary/20 text-primary"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-slate-400 font-medium italic">
            Original (Polos Mentega Gurih)
          </span>
        )}
      </div>
    </div>
  );
};
