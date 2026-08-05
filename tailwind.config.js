/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f6f7',
          100: '#e9e9ec',
          200: '#d2d2d8',
          300: '#b0b0ba',
          400: '#868692',
          500: '#6a6a76',
          600: '#52525b',
          700: '#3f3f47',
          800: '#27272d',
          900: '#18181c',
          950: '#0d0d10',
        },
        beige: {
          50: '#fbf8f3',
          100: '#f5efe2',
          200: '#ece0c8',
          300: '#ddc9a1',
          400: '#cbac76',
          500: '#bd9555',
          600: '#a87d44',
          700: '#8a6438',
          800: '#6f4f30',
          900: '#5a4128',
        },
        gold: {
          50: '#fbf7ee',
          100: '#f5ecd2',
          200: '#ead4a0',
          300: '#ddb968',
          400: '#d2a23f',
          500: '#c2922f',
          600: '#a87626',
          700: '#875a22',
          800: '#6f4820',
          900: '#5b3c1e',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(24,24,28,0.06), 0 8px 24px -8px rgba(24,24,28,0.08)',
        card: '0 1px 2px rgba(24,24,28,0.04), 0 12px 32px -12px rgba(24,24,28,0.12)',
        lift: '0 4px 12px -2px rgba(24,24,28,0.08), 0 24px 48px -16px rgba(24,24,28,0.18)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-up': 'slide-up 0.6s ease-out both',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
