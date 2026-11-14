/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAFAFA",
          dark: "#0A0A0B",
        },
        surface: {
          DEFAULT: "#FAFAFA", // Upgraded pure card base for light mode to look premium and crisp
          dark: "#0A0A0B",    // Rich matte charcoal for dark mode
        },
        ink: {
          DEFAULT: "#111215",
          dark: "#F4F4F6",
        },
        muted: {
          DEFAULT: "#616166",
          dark: "#9E9EA6",
        },
        line: {
          DEFAULT: "#DEDEE3",
          dark: "#26262B",
        },
        accent: {
          DEFAULT: "#2F5D46",
          dark: "#5fbe8e",
        },
        signal: {
          DEFAULT: "#3E8E58",
          amber: "#B8863B",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "1070px",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};