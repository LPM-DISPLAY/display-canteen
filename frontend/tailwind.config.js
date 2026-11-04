/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057B8',
          dark: '#00408B',
          light: '#E2E7FF',
        },
        secondary: {
          DEFAULT: '#FF6B00',
          dark: '#A04100',
          light: '#FFE4D6',
        },
        tertiary: {
          DEFAULT: '#10B981',
          dark: '#004E33',
          light: '#D1FAE5',
        },
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          600: '#475569',
          400: '#94A3B8',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        // Flavor specific visual accents
        flavor: {
          cokelat: '#4A2810',
          keju: '#F59E0B',
          strawberry: '#E11D48',
          blueberry: '#4338CA',
          tiramisu: '#92400E',
          greentea: '#65A30D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        toppingBounce: {
          '0%': { transform: 'translateY(-24px) scale(0.85)', opacity: '0' },
          '60%': { transform: 'translateY(4px) scale(1.05)', opacity: '1' },
          '80%': { transform: 'translateY(-2px) scale(0.98)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        'topping-bounce': 'toppingBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
}
