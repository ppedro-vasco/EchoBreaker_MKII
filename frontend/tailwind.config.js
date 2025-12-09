/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aero-blue': '#00f0ff',
        'deep-space': '#050b14',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        'surface-dark': '#0a1929',
      },
      fontFamily: {
        sans: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Eurostile', 'sans-serif'],
      },
      backgroundImage: {
        'aero-gradient': 'linear-gradient(135deg, #050b14 0%, #0a1929 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px rgba(0, 240, 255, 0.5)',
      },
    },
  },
  plugins: [],
}