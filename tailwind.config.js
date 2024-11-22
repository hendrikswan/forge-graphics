// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          background: '#f8fafc',
          toolbar: '#ffffff',
          canvas: '#ffffff',
          accent: '#3b82f6',
          hover: '#60a5fa',
        }
      }
    },
  },
  plugins: [],
}