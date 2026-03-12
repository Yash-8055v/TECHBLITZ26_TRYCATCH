/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#007bff",
        "primary-dark": "#0056b3",
        "background-light": "#f5f7f8",
        "background-dark": "#0f1923",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}
