"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCouriers, deleteCourier } from "@/lib/courier";

const statusLabel = {
  available: { text: "Tersedia", cls: "bg-green-100 text-green-700" },
  on_delivery: { text: "Mengantar", cls: "bg-yellow-100 text-yellow-700" },
  off: { text: "Off", cls: "bg-gray-200 text-gray-600" },
};

export default function Couriers() {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCouriers();
      setCouriers(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat data kurir.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Hapus kurir ini?")) return;
    try {
      await deleteCourier(id);
      setCouriers((list) => list.filter((c) => c.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menghapus kurir.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daftar Kurir</h1>
          <p className="text-sm text-gray-500">Manajemen kurir logistik</p>
        </div>
        <Link
          href="/couriers/new"
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          + Tambah Kurir
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Telepon</th>
              <th className="px-4 py-3">Armada</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Memuat...
                </td>
              </tr>
            ) : couriers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Belum ada kurir.
                </td>
              </tr>
            ) : (
              couriers.map((c) => {
                const s = statusLabel[c.status] || statusLabel.off;
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/couriers/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{c.phone || "-"}</td>
                    <td className="px-4 py-3">{c.vehicleId || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${s.cls}`}>
                        {s.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <Link
                        href={`/couriers/${c.id}`}
                        className="text-gray-600 hover:underline"
                      >
                        Detail
                      </Link>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
