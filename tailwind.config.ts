import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        boxCustom: "0 0 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
};

export default config;
