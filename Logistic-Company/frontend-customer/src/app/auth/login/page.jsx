"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const next = {};
    if (!form.email) next.email = "Email wajib diisi";
    else if (!emailRegex.test(form.email)) next.email = "Format email tidak valid";
    if (!form.password) next.password = "Password wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.ok) router.push("/products");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Masuk</h1>
      <p className="mb-6 text-sm text-gray-500">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="font-medium text-orange-600 hover:underline">
          Daftar
        </Link>
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="demo@logistik.id"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Coba akun demo: demo@logistik.id / password123
      </p>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
