/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hacker-green': '#0f0',
        'hacker-dark-green': '#050',
        'hacker-black': '#0a0a0a',
        'alert-red': '#ff0033',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px #0f0, 0 0 20px #0f0',
      }
    },
  },
  plugins: [],
}