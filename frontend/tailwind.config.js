/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FBF5F3",
        ink: "#2A1B22",
        "ink-soft": "#6B5760",
        accent: "#E8527A",
        "accent-ink": "#8A1F3D",
        "accent-soft": "#FBDDE5",
        gold: "#B98A3E",
        mint: "#3E9C82",
      },
    },
  },
  plugins: [],
};
