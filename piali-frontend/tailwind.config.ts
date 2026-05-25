import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      colors: {
        pink:    "#e91e8c",
        purple:  "#8b5cf6",
        surface: "#13131f",
        surface2:"#0d0d15",
      },
      backgroundImage: {
        "piali-gradient": "linear-gradient(90deg, #e91e8c, #8b5cf6)",
      },
    },
  },
  plugins: [],
};
export default config;