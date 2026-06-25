// In-memory data store for the mock API routes.
// Persisted on globalThis so it survives Next.js dev hot-reloads (resets on a
// full server restart). This is a demo backend, not a real database.
import { hashPassword } from "./auth";

function seedProducts() {
  return [
    { id: 1, name: "Kardus Packing Tebal", price: 12000, category: "Packaging", stock: 250, description: "Kardus double wall tahan beban untuk pengiriman barang berat." },
    { id: 2, name: "Bubble Wrap 50m", price: 85000, category: "Packaging", stock: 120, description: "Gelembung udara pelindung barang pecah belah, panjang 50 meter." },
    { id: 3, name: "Lakban Fragile", price: 15000, category: "Packaging", stock: 300, description: "Lakban penanda barang mudah pecah, lebar 48mm." },
    { id: 4, name: "Timbangan Digital 50kg", price: 320000, category: "Alat", stock: 40, description: "Timbangan gantung digital untuk paket sampai 50kg." },
    { id: 5, name: "Label Resi Thermal", price: 95000, category: "Alat", stock: 80, description: "Roll label thermal untuk printer resi, 1000 lembar." },
    { id: 6, name: "Sarung Tangan Kurir", price: 25000, category: "Perlengkapan", stock: 200, description: "Sarung tangan anti slip untuk handling paket." },
  ];
}

function createStore() {
  const store = { users: new Map(), products: seedProducts(), nextUserId: 1 };
  // Seed a demo account so login works out of the box.
  const email = "demo@logistik.id";
  store.users.set(email, {
    id: store.nextUserId++,
    name: "Demo User",
    email,
    password: hashPassword("password123"),
  });
  return store;
}

const globalRef = globalThis;
if (!globalRef.__LOGISTIK_STORE__) {
  globalRef.__LOGISTIK_STORE__ = createStore();
}

export const store = globalRef.__LOGISTIK_STORE__;

export function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}
