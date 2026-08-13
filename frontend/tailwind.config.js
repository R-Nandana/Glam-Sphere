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
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeIn: 'fadeIn 600ms ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
