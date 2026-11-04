import React from 'react';
import { FlavorVariant } from '../../types';

interface ToppingLayerProps {
  flavor: FlavorVariant;
}

export const ToppingLayer: React.FC<ToppingLayerProps> = ({ flavor }) => {
  switch (flavor) {
    case 'Cokelat':
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center p-3">
          {/* Chocolate drizzle pattern */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            <path
              d="M 25 35 Q 55 55 85 30 T 145 40 T 180 30"
              fill="none"
              stroke="#4A2810"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M 20 70 Q 60 90 100 65 T 150 75 T 185 60"
              fill="none"
              stroke="#5C3826"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 30 110 Q 70 130 110 105 T 160 115 T 175 100"
              fill="none"
              stroke="#4A2810"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Chocolate chips / curls */}
            <circle cx="50" cy="50" r="4" fill="#381D0B" />
            <circle cx="120" cy="45" r="4.5" fill="#381D0B" />
            <circle cx="80" cy="85" r="5" fill="#381D0B" />
            <circle cx="150" cy="95" r="4" fill="#381D0B" />
            <circle cx="100" cy="125" r="4" fill="#381D0B" />
          </svg>
        </div>
      );

    case 'Keju':
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center p-2">
          {/* Shredded cheddar cheese strands */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-sm">
            <line x1="30" y1="35" x2="65" y2="38" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="85" y1="28" x2="125" y2="35" stroke="#FCD34D" strokeWidth="4" strokeLinecap="round" />
            <line x1="140" y1="32" x2="175" y2="40" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="45" y1="65" x2="90" y2="60" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
            <line x1="105" y1="68" x2="155" y2="62" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="35" y1="95" x2="80" y2="102" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="95" y1="92" x2="140" y2="98" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
            <line x1="145" y1="105" x2="178" y2="95" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            <line x1="55" y1="125" x2="100" y2="120" stroke="#FCD34D" strokeWidth="4" strokeLinecap="round" />
            <line x1="115" y1="128" x2="160" y2="122" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'Strawberry':
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center p-3">
          {/* Strawberry jam coulis with seeds */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            <path
              d="M 35 45 Q 70 20 110 50 Q 150 25 175 55 Q 160 95 140 125 Q 90 140 50 115 Q 25 80 35 45 Z"
              fill="#E11D48"
              fillOpacity="0.82"
            />
            <path
              d="M 50 55 Q 85 35 120 60 Q 140 75 125 105 Q 80 120 55 95 Z"
              fill="#BE123C"
              fillOpacity="0.6"
            />
            {/* Seeds */}
            <circle cx="65" cy="55" r="2" fill="#FEF08A" />
            <circle cx="105" cy="45" r="2" fill="#FEF08A" />
            <circle cx="145" cy="65" r="2" fill="#FEF08A" />
            <circle cx="85" cy="85" r="2" fill="#FEF08A" />
            <circle cx="125" cy="95" r="2" fill="#FEF08A" />
            <circle cx="70" cy="110" r="2" fill="#FEF08A" />
          </svg>
        </div>
      );

    case 'Blueberry':
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center p-3">
          {/* Blueberry deep glaze & berries */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            <path
              d="M 30 50 Q 75 30 115 55 Q 165 35 180 70 Q 165 110 135 130 Q 80 140 45 110 Q 20 75 30 50 Z"
              fill="#4338CA"
              fillOpacity="0.82"
            />
            {/* Wild berries */}
            <circle cx="60" cy="65" r="8" fill="#312E81" />
            <circle cx="115" cy="55" r="9" fill="#312E81" />
            <circle cx="150" cy="75" r="8.5" fill="#312E81" />
            <circle cx="85" cy="95" r="8.5" fill="#312E81" />
            <circle cx="130" cy="105" r="8" fill="#312E81" />
          </svg>
        </div>
      );

    case 'Tiramisu':
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center p-3">
          {/* Tiramisu mascarpone swirls and espresso dust */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            <path
              d="M 35 40 Q 75 60 115 35 T 175 45"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 25 75 Q 80 100 125 70 T 180 80"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 35 115 Q 85 135 130 110 T 170 120"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Cocoa dust stipples */}
            <circle cx="45" cy="40" r="3" fill="#92400E" />
            <circle cx="75" cy="55" r="3.5" fill="#78350F" />
            <circle cx="115" cy="40" r="3" fill="#92400E" />
            <circle cx="155" cy="50" r="3" fill="#78350F" />
            <circle cx="60" cy="80" r="3.5" fill="#92400E" />
            <circle cx="100" cy="75" r="3" fill="#78350F" />
            <circle cx="140" cy="85" r="3.5" fill="#92400E" />
            <circle cx="70" cy="120" r="3" fill="#92400E" />
            <circle cx="120" cy="115" r="3.5" fill="#78350F" />
          </svg>
        </div>
      );

    case 'Green Tea':
      return (
        <div className="absolute inset-0 pointer-events-none animate-topping-bounce z-10 flex items-center justify-center p-3">
          {/* Matcha ganache drizzle & powder */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            <path
              d="M 30 35 Q 70 55 105 30 T 175 40"
              fill="none"
              stroke="#65A30D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 25 70 Q 75 95 120 65 T 180 75"
              fill="none"
              stroke="#4D7C0F"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 30 110 Q 75 130 120 105 T 170 115"
              fill="none"
              stroke="#65A30D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Fine matcha powder specks */}
            <circle cx="55" cy="48" r="2.5" fill="#365314" />
            <circle cx="95" cy="42" r="3" fill="#365314" />
            <circle cx="145" cy="48" r="2.5" fill="#365314" />
            <circle cx="65" cy="85" r="3" fill="#365314" />
            <circle cx="110" cy="80" r="2.5" fill="#365314" />
            <circle cx="150" cy="88" r="3" fill="#365314" />
            <circle cx="85" cy="122" r="2.5" fill="#365314" />
            <circle cx="135" cy="118" r="3" fill="#365314" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};
