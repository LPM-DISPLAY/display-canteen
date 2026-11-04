import React from 'react';
import { FlavorVariant } from '../../types';

interface ToppingLayerProps {
  flavor: FlavorVariant;
  splitSide?: 'left' | 'right' | 'top' | 'bottom' | 'full';
}

export const ToppingLayer: React.FC<ToppingLayerProps> = ({
  flavor,
  splitSide = 'full',
}) => {
  const clipId =
    splitSide === 'left'
      ? 'url(#clip-left-half)'
      : splitSide === 'right'
      ? 'url(#clip-right-half)'
      : splitSide === 'top'
      ? 'url(#clip-top-half)'
      : splitSide === 'bottom'
      ? 'url(#clip-bottom-half)'
      : undefined;

  switch (flavor) {
    case 'Cokelat':
      // Realistic Chocolate Meses (Sprinkles)
      return (
        <div
          className={`absolute inset-0 pointer-events-none animate-topping-bounce z-20 ${
            splitSide === 'left'
              ? 'w-1/2 overflow-hidden left-0'
              : splitSide === 'right'
              ? 'w-1/2 overflow-hidden left-1/2'
              : splitSide === 'top'
              ? 'h-1/2 overflow-hidden top-0'
              : splitSide === 'bottom'
              ? 'h-1/2 overflow-hidden top-1/2'
              : 'w-full'
          }`}
        >
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-sm">
            <defs>
              <filter id="meses-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#1C0D02" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Densely scattered Chocolate Meses */}
            <g filter="url(#meses-shadow)">
              {/* Row 1 */}
              <rect x="35" y="55" width="8" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(25 35 55)" />
              <rect x="55" y="45" width="8.5" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-15 55 45)" />
              <rect x="75" y="50" width="9" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(40 75 50)" />
              <rect x="95" y="42" width="8" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-30 95 42)" />
              <rect x="115" y="48" width="9" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(10 115 48)" />
              <rect x="135" y="45" width="8" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(-45 135 45)" />
              <rect x="155" y="52" width="8.5" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(20 155 52)" />
              <rect x="175" y="58" width="8" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(-20 175 58)" />

              {/* Row 2 */}
              <rect x="40" y="75" width="8.5" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-35 40 75)" />
              <rect x="60" y="70" width="9" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(15 60 70)" />
              <rect x="80" y="78" width="8" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(-50 80 78)" />
              <rect x="100" y="68" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(30 100 68)" />
              <rect x="120" y="75" width="8" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(-10 120 75)" />
              <rect x="140" y="70" width="8.5" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(45 140 70)" />
              <rect x="160" y="76" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-25 160 76)" />
              <rect x="180" y="80" width="8" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(15 180 80)" />

              {/* Row 3 - Center Dense */}
              <rect x="32" y="98" width="8.5" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(10 32 98)" />
              <rect x="52" y="95" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-40 52 95)" />
              <rect x="72" y="100" width="8.5" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(25 72 100)" />
              <rect x="92" y="92" width="9" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(-15 92 92)" />
              <rect x="112" y="98" width="8" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(55 112 98)" />
              <rect x="132" y="94" width="9" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(-30 132 94)" />
              <rect x="152" y="102" width="8.5" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(20 152 102)" />
              <rect x="172" y="96" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-45 172 96)" />

              {/* Row 4 */}
              <rect x="42" y="122" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-20 42 122)" />
              <rect x="64" y="118" width="8" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(35 64 118)" />
              <rect x="85" y="125" width="8.5" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(-10 85 125)" />
              <rect x="105" y="119" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(45 105 119)" />
              <rect x="125" y="123" width="8" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(-35 125 123)" />
              <rect x="145" y="117" width="9" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(15 145 117)" />
              <rect x="165" y="124" width="8.5" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-50 165 124)" />

              {/* Row 5 - Bottom Area */}
              <rect x="45" y="145" width="8" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(30 45 145)" />
              <rect x="68" y="142" width="9" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(-15 68 142)" />
              <rect x="90" y="148" width="8.5" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(40 90 148)" />
              <rect x="110" y="140" width="9" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(-25 110 140)" />
              <rect x="130" y="146" width="8" height="3.2" rx="1.6" fill="#3D1E0B" transform="rotate(10 130 146)" />
              <rect x="150" y="141" width="9" height="3.2" rx="1.6" fill="#1F0D04" transform="rotate(-40 150 141)" />
              <rect x="170" y="147" width="8.5" height="3.2" rx="1.6" fill="#2B1408" transform="rotate(20 170 147)" />

              {/* Sweet Condensed Milk Drizzle Accents */}
              <path
                d="M 35 70 Q 75 95 110 65 T 180 85"
                fill="none"
                stroke="#FFFBEB"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 40 115 Q 85 140 130 110 T 175 130"
                fill="none"
                stroke="#FFFBEB"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          </svg>
        </div>
      );

    case 'Keju':
      // Abundant Curly Shredded Cheddar Cheese (Parutan Keju)
      return (
        <div
          className={`absolute inset-0 pointer-events-none animate-topping-bounce z-25 ${
            splitSide === 'left'
              ? 'w-1/2 overflow-hidden left-0'
              : splitSide === 'right'
              ? 'w-1/2 overflow-hidden left-1/2'
              : splitSide === 'top'
              ? 'h-1/2 overflow-hidden top-0'
              : splitSide === 'bottom'
              ? 'h-1/2 overflow-hidden top-1/2'
              : 'w-full'
          }`}
        >
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-sm">
            <defs>
              <filter id="cheese-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="0.6" floodColor="#92400E" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#cheese-shadow)">
              {/* Dense shredded cheddar strands (curved lines) */}
              {/* Top Layer */}
              <path d="M 35 48 Q 55 42 75 49" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 50 44 Q 70 52 95 46" fill="none" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 85 40 Q 110 46 135 41" fill="none" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
              <path d="M 120 45 Q 145 38 170 47" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 145 42 Q 165 50 185 45" fill="none" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round" />

              {/* Upper-Middle Layer */}
              <path d="M 30 68 Q 55 60 80 66" fill="none" stroke="#FCD34D" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 65 62 Q 95 72 120 64" fill="none" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
              <path d="M 105 66 Q 130 58 155 67" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 140 60 Q 165 68 190 62" fill="none" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />

              {/* Cross Shreads */}
              <path d="M 45 60 Q 60 78 75 92" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <path d="M 85 55 Q 98 75 110 95" fill="none" stroke="#FEF08A" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 130 58 Q 142 80 155 98" fill="none" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
              <path d="M 165 65 Q 175 85 182 105" fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />

              {/* Center Mountain Layer */}
              <path d="M 32 92 Q 62 84 92 90" fill="none" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 75 88 Q 105 98 135 90" fill="none" stroke="#F59E0B" strokeWidth="3.8" strokeLinecap="round" />
              <path d="M 115 92 Q 145 84 175 92" fill="none" stroke="#FCD34D" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 40 108 Q 70 118 100 110" fill="none" stroke="#FCD34D" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 85 106 Q 115 98 145 107" fill="none" stroke="#FEF08A" strokeWidth="3.8" strokeLinecap="round" />
              <path d="M 130 112 Q 160 102 188 114" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />

              {/* Lower Shreads */}
              <path d="M 35 130 Q 65 124 95 131" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 78 126 Q 108 136 138 128" fill="none" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 120 132 Q 150 124 180 133" fill="none" stroke="#FCD34D" strokeWidth="3.2" strokeLinecap="round" />

              {/* Bottom Rim Shreads */}
              <path d="M 45 152 Q 75 146 105 153" fill="none" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
              <path d="M 90 148 Q 120 156 150 150" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 135 152 Q 160 146 182 154" fill="none" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case 'Strawberry':
      // Glossy Strawberry Jam Spread
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center">
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-md">
            <defs>
              <clipPath id="clip-top-half">
                <rect x="0" y="0" width="220" height="108" />
              </clipPath>
              <clipPath id="clip-bottom-half">
                <rect x="0" y="108" width="220" height="92" />
              </clipPath>
              <clipPath id="clip-left-half">
                <rect x="0" y="0" width="110" height="200" />
              </clipPath>
              <clipPath id="clip-right-half">
                <rect x="110" y="0" width="110" height="200" />
              </clipPath>
              <linearGradient id="strawberry-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E11D48" stopOpacity="0.92" />
                <stop offset="50%" stopColor="#BE123C" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#9F1239" stopOpacity="0.94" />
              </linearGradient>
            </defs>

            <g clipPath={clipId}>
              {/* Thick Jam spread base */}
              <path
                d="M 32 60 Q 70 30 110 50 Q 150 30 188 60 Q 182 110 178 165 Q 110 175 42 165 Q 38 110 32 60 Z"
                fill="url(#strawberry-grad)"
              />
              {/* Glossy Jam highlights */}
              <path
                d="M 45 68 Q 80 48 115 62 Q 150 50 172 70"
                fill="none"
                stroke="#FECDD3"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M 50 110 Q 90 95 130 108 Q 160 100 170 120"
                fill="none"
                stroke="#FECDD3"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.45"
              />
              {/* Real fruit pulp seeds */}
              <circle cx="60" cy="72" r="1.8" fill="#FEF08A" />
              <circle cx="95" cy="62" r="2" fill="#FEF08A" />
              <circle cx="140" cy="75" r="1.8" fill="#FEF08A" />
              <circle cx="75" cy="115" r="2" fill="#FEF08A" />
              <circle cx="120" cy="105" r="2" fill="#FEF08A" />
              <circle cx="155" cy="118" r="1.8" fill="#FEF08A" />
              <circle cx="85" cy="145" r="2" fill="#FEF08A" />
              <circle cx="135" cy="148" r="1.8" fill="#FEF08A" />
            </g>
          </svg>
        </div>
      );

    case 'Blueberry':
      // Rich Deep Blueberry Jam Spread
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center">
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-md">
            <defs>
              <clipPath id="clip-top-half">
                <rect x="0" y="0" width="220" height="108" />
              </clipPath>
              <clipPath id="clip-bottom-half">
                <rect x="0" y="108" width="220" height="92" />
              </clipPath>
              <clipPath id="clip-left-half">
                <rect x="0" y="0" width="110" height="200" />
              </clipPath>
              <clipPath id="clip-right-half">
                <rect x="110" y="0" width="110" height="200" />
              </clipPath>
              <linearGradient id="blueberry-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338CA" stopOpacity="0.94" />
                <stop offset="50%" stopColor="#3730A3" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#312E81" stopOpacity="0.96" />
              </linearGradient>
            </defs>

            <g clipPath={clipId}>
              {/* Deep Blueberry Spread */}
              <path
                d="M 32 60 Q 70 30 110 50 Q 150 30 188 60 Q 182 110 178 165 Q 110 175 42 165 Q 38 110 32 60 Z"
                fill="url(#blueberry-grad)"
              />
              {/* Specular Jam Sheen */}
              <path
                d="M 45 68 Q 80 48 115 62 Q 150 50 172 70"
                fill="none"
                stroke="#C7D2FE"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d="M 50 112 Q 95 98 135 110 Q 160 102 170 122"
                fill="none"
                stroke="#C7D2FE"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.45"
              />
              {/* Whole wild berry accents */}
              <circle cx="65" cy="80" r="5" fill="#1E1B4B" />
              <circle cx="66" cy="79" r="1.5" fill="#E0E7FF" opacity="0.7" />
              <circle cx="115" cy="72" r="5.5" fill="#1E1B4B" />
              <circle cx="116" cy="71" r="1.5" fill="#E0E7FF" opacity="0.7" />
              <circle cx="155" cy="88" r="5" fill="#1E1B4B" />
              <circle cx="156" cy="87" r="1.5" fill="#E0E7FF" opacity="0.7" />
              <circle cx="85" cy="125" r="5" fill="#1E1B4B" />
              <circle cx="86" cy="124" r="1.5" fill="#E0E7FF" opacity="0.7" />
              <circle cx="135" cy="132" r="5.5" fill="#1E1B4B" />
              <circle cx="136" cy="131" r="1.5" fill="#E0E7FF" opacity="0.7" />
            </g>
          </svg>
        </div>
      );

    case 'Tiramisu':
      // Mascarpone Cream & Espresso Swirl Spread (Classic Creamy Tiramisu)
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center">
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-md">
            <defs>
              <clipPath id="clip-top-half">
                <rect x="0" y="0" width="220" height="108" />
              </clipPath>
              <clipPath id="clip-bottom-half">
                <rect x="0" y="108" width="220" height="92" />
              </clipPath>
              <clipPath id="clip-left-half">
                <rect x="0" y="0" width="110" height="200" />
              </clipPath>
              <clipPath id="clip-right-half">
                <rect x="110" y="0" width="110" height="200" />
              </clipPath>
              <linearGradient id="tiramisu-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FEF3C7" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            <g clipPath={clipId}>
              {/* Creamy Mascarpone Base Spread */}
              <path
                d="M 32 60 Q 70 30 110 50 Q 150 30 188 60 Q 182 110 178 165 Q 110 175 42 165 Q 38 110 32 60 Z"
                fill="url(#tiramisu-grad)"
              />
              {/* Espresso & Mocha Swirls */}
              <path
                d="M 40 70 Q 75 88 110 65 T 180 75"
                fill="none"
                stroke="#B45309"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.65"
              />
              <path
                d="M 35 115 Q 80 135 125 110 T 178 120"
                fill="none"
                stroke="#92400E"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.65"
              />
              {/* Cocoa Dust Powder Stippling */}
              <circle cx="45" cy="48" r="2.5" fill="#78350F" />
              <circle cx="75" cy="58" r="3" fill="#92400E" />
              <circle cx="115" cy="45" r="2.5" fill="#78350F" />
              <circle cx="155" cy="55" r="3" fill="#92400E" />
              <circle cx="55" cy="80" r="3" fill="#78350F" />
              <circle cx="95" cy="78" r="2.8" fill="#92400E" />
              <circle cx="145" cy="82" r="3" fill="#78350F" />
              <circle cx="70" cy="120" r="2.8" fill="#92400E" />
              <circle cx="110" cy="115" r="3" fill="#78350F" />
              <circle cx="150" cy="125" r="2.8" fill="#92400E" />
              <circle cx="85" cy="148" r="2.5" fill="#78350F" />
              <circle cx="130" cy="150" r="2.8" fill="#92400E" />
            </g>
          </svg>
        </div>
      );

    case 'Green Tea':
      // Matcha Glaze Ganache Spread
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center">
          <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-md">
            <defs>
              <clipPath id="clip-top-half">
                <rect x="0" y="0" width="220" height="108" />
              </clipPath>
              <clipPath id="clip-bottom-half">
                <rect x="0" y="108" width="220" height="92" />
              </clipPath>
              <clipPath id="clip-left-half">
                <rect x="0" y="0" width="110" height="200" />
              </clipPath>
              <clipPath id="clip-right-half">
                <rect x="110" y="0" width="110" height="200" />
              </clipPath>
              <linearGradient id="matcha-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#65A30D" stopOpacity="0.92" />
                <stop offset="50%" stopColor="#4D7C0F" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#3F6212" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            <g clipPath={clipId}>
              {/* Thick Matcha Ganache Spread */}
              <path
                d="M 32 60 Q 70 30 110 50 Q 150 30 188 60 Q 182 110 178 165 Q 110 175 42 165 Q 38 110 32 60 Z"
                fill="url(#matcha-grad)"
              />
              {/* White Ganache Drizzle Swirls */}
              <path
                d="M 40 68 Q 80 50 120 65 Q 150 52 175 70"
                fill="none"
                stroke="#ECFCCB"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 42 115 Q 85 98 128 112 Q 155 102 172 122"
                fill="none"
                stroke="#ECFCCB"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="0.75"
              />
              {/* Fine Matcha Powder Specks */}
              <circle cx="55" cy="75" r="1.8" fill="#1A2E05" />
              <circle cx="105" cy="62" r="2" fill="#1A2E05" />
              <circle cx="150" cy="78" r="1.8" fill="#1A2E05" />
              <circle cx="75" cy="125" r="2" fill="#1A2E05" />
              <circle cx="125" cy="118" r="1.8" fill="#1A2E05" />
              <circle cx="155" cy="130" r="2" fill="#1A2E05" />
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
