import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dde1e9",
          300: "#c0c7d5",
          400: "#8f99ae",
          500: "#6b768c",
          600: "#525c72",
          700: "#41495c",
          800: "#333a4a",
          900: "#222834",
          950: "#12151d",
        },
        accent: {
          50: "#eef3ff",
          100: "#dfe8ff",
          200: "#c4d3ff",
          300: "#9db4ff",
          400: "#728bff",
          500: "#4f63f5",
          600: "#3742e0",
          700: "#2c33bb",
          800: "#272e95",
          900: "#252d76",
        },
        amber: {
          50: "#fffaeb",
          100: "#fff1c6",
          200: "#ffe188",
          300: "#ffcb4a",
          400: "#ffb420",
          500: "#f99307",
          600: "#dd6d02",
          700: "#b74c06",
          800: "#943b0c",
          900: "#7a310d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18,21,29,.04), 0 8px 24px -12px rgba(18,21,29,.12)",
        lift: "0 2px 4px rgba(18,21,29,.04), 0 18px 40px -18px rgba(18,21,29,.28)",
        glow: "0 0 0 1px rgba(255,203,74,.25), 0 20px 60px -20px rgba(255,180,32,.45)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,-18px,0) scale(1.04)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "33%": { transform: "translate3d(24px,-16px,0)" },
          "66%": { transform: "translate3d(-18px,12px,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.85)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        caret: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .5s ease both",
        float: "float 9s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        marquee: "marquee 38s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        caret: "caret 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
