/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B0F17",
          800: "#131A26",
          700: "#1E2734",
          600: "#2B3648",
        },
        paper: {
          100: "#ECEFE6",
          400: "#8D96A6",
        },
        amber: {
          flap: "#F5A623",
          flapDark: "#C9820F",
        },
        mint: "#3DDC97",
        signal: "#FF5C5C",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        panel:
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
