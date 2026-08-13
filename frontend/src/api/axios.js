import axios from "axios";

// Vite dev server proxies /api -> http://localhost:5000 (see vite.config.js)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // send the httpOnly JWT cookie set by the backend
});

export default api;
