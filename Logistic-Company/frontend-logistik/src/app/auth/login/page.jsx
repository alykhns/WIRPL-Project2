"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login as loginRequest } from "@/lib/auth";
import useAuthStore from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(form);
      // backend mengembalikan { token, user } untuk admin/kurir
      loginStore(data.user ?? null, data.token ?? null);
      router.push("/couriers");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login gagal. Periksa email & password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-1">Masuk</h1>
        <p className="text-sm text-gray-500 mb-6">
          Dashboard Admin &amp; Kurir Logistik
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@logistik.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}
