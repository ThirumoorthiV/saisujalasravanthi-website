import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#FBF4F4",
          100: "#F5E6E6",
          400: "#B85450",
          600: "#9B1B1B",
          700: "#800000", // primary
          900: "#4A0404",
        },
        gold: {
          100: "#FAF3DC",
          500: "#C9A227",
        },
        cream: "#FFFBF5",
        ink: {
          200: "#E3DCDC",
          600: "#5C5C5C",
          900: "#2B2B2B",
        },
        success: "#2E7D32",
        error: "#C62828",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "1200px" },
    },
  },
  plugins: [],
} satisfies Config;
