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
      keyframes: {
        stars: {
          "0%": { backgroundPosition: "-100% 100%" },
          "100%": { backgroundPosition: "0 0" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        stars: "stars 8s linear infinite alternate",
        "spin-slow": "spinSlow 5s linear infinite",
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
};

export default config;
