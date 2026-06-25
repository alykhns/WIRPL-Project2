import api from "./api";

// Integrasi ke service Auth melalui gateway: /api/auth/*

export async function login({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data; // { token, user }
}

export async function register({ name, email, password, role }) {
  const { data } = await api.post("/api/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/api/auth/profile");
  return data;
}
