/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand palette — warm berry / quiet luxury
        primary: {
          50:  "#FBF0F0",
          100: "#F3D9DA",
          300: "#DE9CA0",
          500: "#B54B54",
          600: "#9C3B44",
          800: "#6B2229",
          950: "#3D1215",
        },
        // Champagne gold — use sparingly
        accent:      "#C9A227",
        "accent-soft": "#EFE3C0",
        // Text
        ink:         "#241F1C",
        "ink-muted": "#6B615B",
        // Surfaces
        surface:     "#FBF7F3",
        "surface-alt": "#F3ECE5",
        border:      "#E7DCD3",
        // Semantic
        success:     "#3F7A5C",
        warning:     "#B8842E",
        error:       "#B33A3A",
        // Admin dark surfaces
        "admin-bg":      "#1C1815",
        "admin-surface": "#242019",
        "admin-border":  "#3A332C",
        "admin-text":    "#F3ECE5",
        // White token
        white:       "#FFFFFF",
        // Legacy aliases kept for backward compat with any remaining usage
        bg:          "#FBF7F3",
        gold:        "#C9A227",
        mint:        "#3F7A5C",
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        body:    ["'Inter'", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)",     { lineHeight: "1.1",  letterSpacing: "-0.015em" }],
      },
      spacing: {
        // 8pt scale tokens for consistency
        "px-page": "clamp(1rem, 4vw, 1.5rem)",
      },
      borderRadius: {
        card: "16px",
        xl2: "20px",
        xl3: "28px",
      },
      boxShadow: {
        card:      "0 8px 32px rgba(36,31,28,0.08)",
        "card-hover": "0 20px 56px rgba(36,31,28,0.14)",
        "product": "0 14px 45px rgba(36,31,28,0.07)",
        "product-hover": "0 24px 60px rgba(36,31,28,0.13)",
        toast:     "0 4px 24px rgba(36,31,28,0.16)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceDot: {
          "0%,80%,100%": { transform: "scale(0)", opacity: "0.5" },
          "40%":         { transform: "scale(1)",   opacity: "1" },
        },
      },
      animation: {
        float:          "float 6s ease-in-out infinite",
        fadeIn:         "fadeIn 400ms ease-out both",
        slideUp:        "slideUp 350ms ease-out both",
        slideInRight:   "slideInRight 300ms ease-out both",
        shimmer:        "shimmer 1.6s linear infinite",
        scaleIn:        "scaleIn 250ms ease-out both",
        bounceDot1:     "bounceDot 1.4s ease-in-out 0s infinite both",
        bounceDot2:     "bounceDot 1.4s ease-in-out 0.2s infinite both",
        bounceDot3:     "bounceDot 1.4s ease-in-out 0.4s infinite both",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
