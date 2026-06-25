import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth store untuk admin & kurir. Token juga disimpan di key "token"
// agar bisa dibaca langsung oleh interceptor axios di lib/api.js.
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        if (typeof window !== "undefined" && token) {
          localStorage.setItem("token", token);
        }
        set({ user, token });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ user: null, token: null });
      },
    }),
    { name: "auth-logistik" }
  )
);

export default useAuthStore;
