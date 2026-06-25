import { create } from "zustand";
import api, { TOKEN_KEY } from "@/lib/api";

const USER_KEY = "logistik_user";

function persistSession(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,

  // Rehydrate session from localStorage on the client (call once on mount).
  init: () => {
    if (typeof window === "undefined" || get().initialized) return;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const rawUser = localStorage.getItem(USER_KEY);
      if (token && rawUser) {
        set({ token, user: JSON.parse(rawUser) });
      }
    } catch {
      clearSession();
    }
    set({ initialized: true });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persistSession(data.token, data.user);
      set({ user: data.user, token: data.token, loading: false });
      return { ok: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login gagal, coba lagi";
      set({ error: message, loading: false });
      return { ok: false, error: message };
    }
  },

  register: async ({ name, email, password }) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      persistSession(data.token, data.user);
      set({ user: data.user, token: data.token, loading: false });
      return { ok: true };
    } catch (err) {
      const data = err.response?.data;
      const message = data?.message || "Registrasi gagal, coba lagi";
      set({ error: message, loading: false });
      return { ok: false, error: message, fieldErrors: data?.errors };
    }
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null, error: null });
  },

  isAuthenticated: () => !!get().token,
}));
