"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCourier,
  updateCourier,
  deleteCourier,
  COURIER_STATUS,
} from "@/lib/courier";

export default function CourierDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getCourier(id);
        const data = res?.data ?? res;
        setForm({
          name: data?.name ?? "",
          phone: data?.phone ?? "",
          vehicleId: data?.vehicleId ?? "",
          status: data?.status ?? "available",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Gagal memuat detail kurir.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateCourier(id, {
        name: form.name,
        phone: form.phone || null,
        vehicleId: form.vehicleId ? Number(form.vehicleId) : null,
        status: form.status,
      });
      router.push("/couriers");
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Hapus kurir ini?")) return;
    try {
      await deleteCourier(id);
      router.push("/couriers");
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menghapus kurir.");
    }
  };

  if (loading) {
    return (
      <main className="max-w-xl mx-auto px-4 py-8 text-gray-400">Memuat...</main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <Link href="/couriers" className="text-sm text-blue-600 hover:underline">
        &larr; Kembali ke daftar kurir
      </Link>

      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-2xl font-bold">Detail Kurir #{id}</h1>
        <button
          onClick={onDelete}
          className="rounded-md border border-red-300 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50"
        >
          Hapus
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {form && (
        <form
          onSubmit={onSave}
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
            <label className="block text-sm font-medium mb-1">ID Armada</label>
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
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      )}
    </main>
  );
}
