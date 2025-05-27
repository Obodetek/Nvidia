/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obodetek': {
          'yellow': '#f8b706',
          'orange': '#ff6702',
          'red': '#eb4349',
          'pink': '#d8326d',
          'purple': '#ca45c4',
          'dark': '#121212',
          'card': 'rgba(30, 30, 30, 0.7)',
          'card-hover': 'rgba(40, 40, 40, 0.8)',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}