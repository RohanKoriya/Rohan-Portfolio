// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "class",
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         canvas: {
//           DEFAULT: "#FAFAF7",
//           dark: "#0A0A0B",
//         },
//         surface: {
//           DEFAULT: "#F2F1EC",
//           dark: "#111113",
//         },
//         ink: {
//           DEFAULT: "#17181A",
//           dark: "#F2F2EF",
//         },
//         muted: {
//           DEFAULT: "#6E6E68",
//           dark: "#9B9B96",
//         },
//         line: {
//           DEFAULT: "#E4E3DD",
//           dark: "#232326",
//         },
//         accent: {
//           DEFAULT: "#2F5D46",
//           dark: "#5FAE86",
//         },
//         signal: {
//           DEFAULT: "#3E8E58",
//           amber: "#B8863B",
//         },
//       },
//       fontFamily: {
//         sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
//         mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
//       },
//       maxWidth: {
//         content: "1150px",
//       },
//       keyframes: {
//         pulseDot: {
//           "0%, 100%": { opacity: 1 },
//           "50%": { opacity: 0.35 },
//         },
//       },
//       animation: {
//         "pulse-dot": "pulseDot 2s ease-in-out infinite",
//       },
//     },
//   },
//   plugins: [],
// };

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
          DEFAULT: "#F3F3F5",
          dark: "#111113",
        },
        ink: {
          DEFAULT: "#17181A",
          dark: "#F2F2F4",
        },
        muted: {
          DEFAULT: "#6B6B70",
          dark: "#9A9AA0",
        },
        line: {
          DEFAULT: "#E5E5E9",
          dark: "#232326",
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
        content: "1150px",
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