import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signature palette — "holographic photocard" identity
        paper: {
          light: "#FBF7FF",
          dark: "#13101F",
        },
        ink: {
          light: "#1C1730",
          dark: "#F3EFFB",
        },
        plum: {
          50: "#F5F0FF",
          100: "#EADFFF",
          200: "#D3BFFF",
          300: "#B594FF",
          400: "#9868F5",
          500: "#8B5CF6",
          600: "#7440E0",
          700: "#5D2FBB",
          800: "#452490",
          900: "#2E1863",
        },
        bloom: {
          400: "#FF9CC2",
          500: "#FF6FA5",
          600: "#E84F8A",
        },
        mint: {
          400: "#7BF0D4",
          500: "#5EE6C7",
          600: "#3ECBAC",
        },
        glass: {
          light: "rgba(255,255,255,0.55)",
          lightBorder: "rgba(255,255,255,0.85)",
          dark: "rgba(30,24,54,0.55)",
          darkBorder: "rgba(255,255,255,0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "system-ui", "sans-serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
        "glass-dark": "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        float: "0 20px 60px -10px rgba(139, 92, 246, 0.35)",
        stapler: "0 12px 24px -6px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "holo-sheen":
          "conic-gradient(from 0deg, #ff6fa5, #ffd76f, #7bf0d4, #8b5cf6, #ff6fa5)",
        "aurora-light":
          "radial-gradient(circle at 20% 20%, #EADFFF 0%, transparent 50%), radial-gradient(circle at 80% 0%, #FFD9EC 0%, transparent 45%), radial-gradient(circle at 50% 100%, #C7FFF0 0%, transparent 50%)",
        "aurora-dark":
          "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 0%, rgba(255,111,165,0.18) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(94,230,199,0.15) 0%, transparent 50%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 3.5s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        popIn: "popIn 0.25s cubic-bezier(0.16,1,0.3,1)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
