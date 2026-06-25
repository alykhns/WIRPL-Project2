import api from "./api";

// Integrasi ke service Courier melalui gateway: /api/courier/*
// (courier service: /couriers dan /fleets)

// ---- Kurir ----
export async function getCouriers() {
  const { data } = await api.get("/api/courier/couriers");
  return data;
}

export async function getCourier(id) {
  const { data } = await api.get(`/api/courier/couriers/${id}`);
  return data;
}

export async function createCourier(payload) {
  const { data } = await api.post("/api/courier/couriers", payload);
  return data;
}

export async function updateCourier(id, payload) {
  const { data } = await api.put(`/api/courier/couriers/${id}`, payload);
  return data;
}

export async function deleteCourier(id) {
  const { data } = await api.delete(`/api/courier/couriers/${id}`);
  return data;
}

// ---- Armada / Fleet ----
export async function getFleets() {
  const { data } = await api.get("/api/courier/fleets");
  return data;
}

export const COURIER_STATUS = ["available", "on_delivery", "off"];
export const FLEET_STATUS = ["available", "in_use"];
