/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0A0E1A',
        'teal-glow': '#00FFB2',
        'put-red': '#FF4757',
        'glass-white': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(0, 255, 178, 0.1)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.7, filter: 'brightness(1.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 255, 178, 0.4)',
        'glow-red': '0 0 15px rgba(255, 71, 87, 0.4)',
      }
    },
  },
  plugins: [],
}
