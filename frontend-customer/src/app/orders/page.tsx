"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API = "http://localhost:3000/api";

type Order = {
  order_id: number;
  buyer_id: number;
  institution_id: number;
  total_amount: number;
  order_status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pay:       { label: "Menunggu Pembayaran", color: "#8B5A2B", bg: "rgba(139,90,43,0.10)" },
  paid:      { label: "Dibayar",             color: "#2E7D32", bg: "rgba(46,125,50,0.10)" },
  in_transit:{ label: "Dalam Pengiriman",    color: "#1565C0", bg: "rgba(21,101,192,0.10)" },
  delivered: { label: "Diterima",            color: "#2E7D32", bg: "rgba(46,125,50,0.12)" },
  completed: { label: "Selesai",             color: "#5C3A1E", bg: "rgba(92,58,30,0.08)"  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, color: "#8B5A2B", bg: "rgba(139,90,43,0.10)" };
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      color: s.color,
      background: s.bg,
      letterSpacing: "0.03em",
    }}>
      {s.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/orders`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat riwayat order. Pastikan server berjalan.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#8B5A2B", display: "block", marginBottom: "0.5rem", fontWeight: 600,
            }}>
              Akun Saya
            </span>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700, color: "#3D1F08", margin: 0,
            }}>
              Riwayat <em style={{ color: "#8B5A2B", fontStyle: "italic" }}>Pesanan</em>
            </h1>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "4rem", color: "#8B5A2B", fontFamily: "'DM Sans', sans-serif" }}>
              Memuat pesanan...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: "1.5rem", borderRadius: "16px",
              background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
              color: "#B91C1C", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#C49A6C" }}>◇</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#3D1F08", marginBottom: "0.5rem" }}>
                Belum ada pesanan
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#9A7050", marginBottom: "2rem" }}>
                Mulai belanja dan temukan perhiasan impianmu.
              </p>
              <Link href="/products" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 28px", borderRadius: "50px",
                background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                color: "#FAF3E8", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600,
                boxShadow: "0 6px 20px rgba(139,90,43,0.3)",
              }}>
                Lihat Produk →
              </Link>
            </div>
          )}

          {/* Order List */}
          {!loading && !error && orders.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orders.map((order) => (
                <div key={order.order_id} style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,154,108,0.25)",
                  borderRadius: "20px",
                  padding: "1.5rem 2rem",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(139,90,43,0.12)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,90,43,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,154,108,0.25)";
                }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    {/* Left */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <span style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "16px", fontWeight: 700, color: "#3D1F08",
                        }}>
                          Order #{order.order_id}
                        </span>
                        <StatusBadge status={order.order_status} />
                      </div>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px", color: "#9A7050",
                      }}>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("id-ID", {
                              day: "numeric", month: "long", year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>

                    {/* Right */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "18px", fontWeight: 700, color: "#8B5A2B",
                        marginBottom: "6px",
                      }}>
                        Rp {Number(order.total_amount).toLocaleString("id-ID")}
                      </div>
                      <Link href={`/track`} style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px", color: "#8B5A2B",
                        textDecoration: "none", fontWeight: 600,
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        padding: "5px 14px", borderRadius: "20px",
                        border: "1.5px solid rgba(139,90,43,0.3)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,90,43,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        Lacak Paket →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to shop */}
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link href="/products" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
              color: "#8B5A2B", textDecoration: "none", fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}>
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </>
  );
}
