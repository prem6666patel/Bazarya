/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#ffbf00",
        "primary-light": "#ffc929",
        "secondary-dark": "#00b050",
        "secondary-light": "#0b1a78",
      },
    },
  },
  plugins: [scrollbarHide],
};
