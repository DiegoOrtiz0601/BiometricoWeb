/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vml-red': '#E31E24',       // Color rojo del logo
        'vml-gray': '#58595B',      // Color gris del logo
        'vml-light': '#F5F5F5',     // Gris claro para fondos
        'vml-dark': '#2D2D2D',      // Gris oscuro para textos
      },
      backgroundImage: {
        'gradient-corporate': 'linear-gradient(to right, var(--tw-colors-vml-red), var(--tw-colors-vml-gray))',
      },
    },
  },
  plugins: [],
} 