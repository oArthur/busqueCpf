/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        primaryLight: '#e0f2fe',
        primaryDark: '#1d4ed8',
        light: "#64748b",
        card: '#e7e7e7',
        secondary: '#1e3a8a',
        textPrimary: '#1a202c',
        primaryContrast: '#0e137e',
        title: '#2563eb'},
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
