import axios from "axios";

// Vite dev server proxies /api -> http://localhost:5000 (see vite.config.js)
// On GitHub Pages (VITE_API_URL=''), requests will fail silently and components will use fallback data
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // send the httpOnly JWT cookie set by the backend
});

// Suppress errors when API is disabled (empty VITE_API_URL on production)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.VITE_API_URL === '') {
      // On GitHub Pages, silently return empty response so components can use fallback data
      return Promise.resolve({ data: { items: [] } });
    }
    return Promise.reject(err);
  }
);

export default api;
