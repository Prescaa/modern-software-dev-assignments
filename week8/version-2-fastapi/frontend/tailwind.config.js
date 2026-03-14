/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#6366f1",
          soft: "#4f46e5",
        },
      },
      boxShadow: {
        subtle: "0 10px 30px rgba(15,23,42,0.45)",
      },
    },
  },
  plugins: [],
};

