/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        "primary-hover": "#4338ca",
        dark: "#0f172a",
        "dark-light": "#1e293b",
        "dark-lighter": "#334155",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
