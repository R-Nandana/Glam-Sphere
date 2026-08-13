import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Glam-Sphere/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false, // set to true for debugging prod issues
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libs into their own chunk
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-charts": ["chart.js", "react-chartjs-2"],
          "vendor-icons": ["@phosphor-icons/react"],
          "vendor-pdf": ["jspdf"],
        },
      },
    },
  },
});
