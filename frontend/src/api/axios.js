import axios from "axios";

// Base URL:
//   - Dev:  Vite proxy forwards /api to http://localhost:5000/api
//   - Prod: VITE_API_URL must be set to your deployed backend root (e.g. https://api.glamsphere.onrender.com/api)
//   - GH Pages demo: VITE_API_URL='' → requests silently return empty and components use sample data
let baseURL = import.meta.env.VITE_API_URL;
if (baseURL !== undefined && baseURL !== "" && !baseURL.endsWith("/api")) {
  baseURL = baseURL.replace(/\/$/, "") + "/api";
} else if (!baseURL) {
  baseURL = "/api";
}

const api = axios.create({
  baseURL,
  withCredentials: true, // send the httpOnly JWT cookie issued by the backend
  timeout: 15000,
});

// ── Request interceptors ────────────────────────────────────────────────────

// Attach stored JWT token to every request (cross-domain auth fix)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("glamsphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptors ────────────────────────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // GitHub Pages / static demo mode — silently return empty data
    if (import.meta.env.VITE_API_URL === "") {
      return Promise.resolve({ data: { items: [], orders: [], wishlist: [], coupons: [] } });
    }

    // 401 Unauthorized — token expired or missing; clear local user state and redirect
    if (err.response?.status === 401) {
      localStorage.removeItem("glamsphere_user");
      localStorage.removeItem("glamsphere_token");
      // Only redirect if not already on /login or /register
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/register")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
