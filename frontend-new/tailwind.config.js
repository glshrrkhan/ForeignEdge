/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: '#00D26A',
        'brand-dark': '#00A854',
        'brand-light': '#E8FFF3',
        'brand-50': '#f0fdf4',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {'0%': {opacity:'0'},'100%': {opacity:'1'}},
        slideUp: {'0%': {transform:'translateY(20px)',opacity:'0'},'100%': {transform:'translateY(0)',opacity:'1'}},
        float: {'0%,100%': {transform:'translateY(0)'},'50%': {transform:'translateY(-10px)'}},
      },
      boxShadow: {
        'green-glow': '0 0 20px rgba(0, 210, 106, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 48px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
