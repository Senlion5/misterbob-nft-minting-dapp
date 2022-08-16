/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mouseMemoirs: ['Mouse Memoirs', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'brand-light': 'var(--clr-light)',
        'brand-purple': 'var(--clr-purple)',
        'brand-pink': 'var(--clr-pink)',
        'brand-yellow': 'var(--clr-yellow)',
        'brand-blue': 'var(--clr-blue)',
        'brand-green': 'var(--clr-green)',
        'brand-hard-purple': 'var(--clr-hard-purple)',
        'brand-hard-pink': 'var(--clr-hard-pink)',
        'brand-hard-yellow': 'var(--clr-hard-yellow)',
        'brand-hard-blue': 'var(--clr-hard-blue)',
        'brand-hard-green': 'var(--clr-hard-green)',
        'brand-background': 'var(--clr-background)'
      },
      animation: {
        'pulse-slow': 'pulse 12s linear infinite'
      }
    },
  },
  plugins: [],
}
