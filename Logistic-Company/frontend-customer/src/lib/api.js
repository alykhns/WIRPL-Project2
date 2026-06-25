import axios from "axios";

export const TOKEN_KEY = "logistik_token";

// Calls go to this app's own Next.js API routes (e.g. http://localhost:3100/api).
// Override with NEXT_PUBLIC_API_URL if you ever point it elsewhere.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token from localStorage to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
