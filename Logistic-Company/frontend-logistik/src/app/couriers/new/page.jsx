"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCourier, COURIER_STATUS } from "@/lib/courier";

export default function AddCourier() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicleId: "",
    status: "available",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createCourier({
        name: form.name,
        phone: form.phone || null,
        vehicleId: form.vehicleId ? Number(form.vehicleId) : null,
        status: form.status,
      });
      router.push("/couriers");
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menambah kurir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <Link href="/couriers" className="text-sm text-blue-600 hover:underline">
        &larr; Kembali ke daftar kurir
      </Link>

      <h1 className="text-2xl font-bold mt-3 mb-6">Tambah Kurir</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telepon</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            ID Armada (opsional)
          </label>
          <input
            type="number"
            name="vehicleId"
            value={form.vehicleId}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COURIER_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <Link
            href="/couriers"
            className="rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
          >
            Batal
          </Link>
        </div>
      </form>
    </main>
  );
}
