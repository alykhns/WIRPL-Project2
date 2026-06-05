"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
export interface User {
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface AppContextType {
  // Auth
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (product_id: number) => void;
  updateQty: (product_id: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("lumiere_token");
      const storedUser = localStorage.getItem("lumiere_user");
      const storedCart = localStorage.getItem("lumiere_cart");
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch {}
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("lumiere_cart", JSON.stringify(cart));
  }, [cart]);

  const login = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("lumiere_token", t);
    localStorage.setItem("lumiere_user", JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("lumiere_token");
    localStorage.removeItem("lumiere_user");
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product_id === item.product_id);
      if (existing) {
        return prev.map((c) =>
          c.product_id === item.product_id
            ? { ...c, quantity: Math.min(c.quantity + 1, item.stock) }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (product_id: number) => {
    setCart((prev) => prev.filter((c) => c.product_id !== product_id));
  };

  const updateQty = (product_id: number, qty: number) => {
    if (qty <= 0) { removeFromCart(product_id); return; }
    setCart((prev) =>
      prev.map((c) =>
        c.product_id === product_id ? { ...c, quantity: Math.min(qty, c.stock) } : c
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <AppContext.Provider value={{ token, user, login, logout, cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
