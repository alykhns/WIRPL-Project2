"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const router = useRouter();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi";
    if (!form.email) next.email = "Email wajib diisi";
    else if (!emailRegex.test(form.email)) next.email = "Format email tidak valid";
    if (!form.password) next.password = "Password wajib diisi";
    else if (form.password.length < 6) next.password = "Password minimal 6 karakter";
    if (form.confirm !== form.password) next.confirm = "Konfirmasi password tidak cocok";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
    });
    if (res.ok) router.push("/products");
    else if (res.fieldErrors) setErrors(res.fieldErrors);
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Daftar Akun</h1>
      <p className="mb-6 text-sm text-gray-500">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="font-medium text-orange-600 hover:underline">
          Masuk
        </Link>
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Nama" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Nama lengkap" />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="nama@email.com" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Minimal 6 karakter" />
        <Field label="Konfirmasi Password" name="confirm" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} placeholder="Ulangi password" />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Memproses…" : "Daftar"}
        </button>
      </form>
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
