"use client";

import { useEffect, useState } from "react";
import { getFleets } from "@/lib/courier";

const statusLabel = {
  available: { text: "Tersedia", cls: "bg-green-100 text-green-700" },
  in_use: { text: "Digunakan", cls: "bg-blue-100 text-blue-700" },
};

export default function Fleet() {
  const [fleets, setFleets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getFleets();
        setFleets(Array.isArray(res) ? res : res?.data ?? []);
      } catch (err) {
        setError(err?.response?.data?.message || "Gagal memuat data armada.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Armada Kendaraan</h1>
        <p className="text-sm text-gray-500">Daftar armada logistik</p>
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
              <th className="px-4 py-3">Plat Nomor</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  Memuat...
                </td>
              </tr>
            ) : fleets.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  Belum ada armada.
                </td>
              </tr>
            ) : (
              fleets.map((f) => {
                const s = statusLabel[f.status] || statusLabel.available;
                return (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{f.plateNumber}</td>
                    <td className="px-4 py-3">{f.type || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${s.cls}`}>
                        {s.text}
                      </span>
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
