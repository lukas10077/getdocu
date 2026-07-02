import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        swiss: {
          black: "#0A0A0A",
          white: "#FFFFFF",
          gray: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#E8E8E8",
            300: "#D4D4D4",
            500: "#8A8A8A",
            700: "#3A3A3A",
            900: "#161616",
          },
          red: "#D52B1E",
          redDark: "#B7221A",
          gold: "#C8902E",
          goldDark: "#A87020",
        },
        // Dark premium palette
        ink: {
          950: "#050404",
          900: "#100E0B",
          800: "#181511",
          700: "#221E19",
          600: "#302A22",
        },
        cream: {
          DEFAULT: "#F0E8D8",
          muted: "#9A9080",
          subtle: "#635B50",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: [
          "var(--font-cormorant)",
          "Georgia",
          "serif",
        ],
      },
      letterSpacing: {
        tight: "-0.02em",
        tighter: "-0.04em",
      },
      maxWidth: {
        content: "1100px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
