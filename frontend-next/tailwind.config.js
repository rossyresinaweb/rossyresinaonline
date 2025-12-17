/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      colors: {
        brand_purple: "#6E2CA1",
        brand_pink: "#F03AA8",
        brand_teal: "#10C4C4",
        brand_yellow: "#FFDD3C",
        brand_green: "#7CD957",
        amazon_blue: "#6E2CA1",
        amazon_light: "#5A3A8E",
        amazon_yellow: "#FFDD3C",
        lightText: "#ccc",
      },
      fontFamily: {
        bodyFont: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
