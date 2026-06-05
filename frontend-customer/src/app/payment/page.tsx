"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const API = "http://localhost:3000/api";

type PaymentDetail = {
  transaction_id: number;
  order_id: number;
  method_id: number;
  amount: number;
  status: string;
  method_name: string;
  provider: string;
  paid_at: string | null;
};

const METHOD_ICON: Record<string, string> = {
  OVO: "◉",
  GoPay: "◈",
  BCA: "◇",
  Mandiri: "◆",
  "Cash on Delivery": "✦",
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const order_id = searchParams.get("order_id");
  const tracking_number = searchParams.get("tracking_number");

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!order_id) { setError("Order ID tidak ditemukan."); setLoading(false); return; }
    fetch(`${API}/payment/${order_id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.transaction_id) {
          setPayment(data);
          if (data.status === "success") setConfirmed(true);
        } else {
          setError("Data pembayaran tidak ditemukan.");
        }
        setLoading(false);
      })
      .catch(() => { setError("Gagal memuat data pembayaran."); setLoading(false); });
  }, [order_id]);

  const handleConfirm = async () => {
    if (!payment) return;
    setConfirming(true);
    setError("");
    try {
      const res = await fetch(`${API}/payment/${payment.transaction_id}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ external_ref: `${payment.provider}-${payment.transaction_id}-${Date.now()}` }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmed(true);
        setPayment((prev) => prev ? { ...prev, status: "success" } : prev);
      } else {
        setError(data.message ?? "Konfirmasi pembayaran gagal.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#8B5A2B", display: "block", marginBottom: "0.5rem", fontWeight: 600,
            }}>
              Langkah 2 dari 2
            </span>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700, color: "#3D1F08", margin: 0,
            }}>
              {confirmed ? "Pembayaran " : "Konfirmasi "}
              <em style={{ color: "#8B5A2B", fontStyle: "italic" }}>
                {confirmed ? "Berhasil!" : "Pembayaran"}
              </em>
            </h1>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "4rem", color: "#8B5A2B", fontFamily: "'DM Sans', sans-serif" }}>
              Memuat data pembayaran...
            </div>
          )}

          {/* Error */}
          {!loading && error && !payment && (
            <div style={{
              padding: "1.5rem", borderRadius: "16px",
              background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
              color: "#B91C1C", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {/* Success state */}
          {confirmed && payment && (
            <div style={{
              background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(46,125,50,0.25)", borderRadius: "20px",
              padding: "2.5rem 2rem", textAlign: "center", marginBottom: "1.5rem",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#C49A6C" }}>✦</div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem", fontWeight: 700, color: "#2E7D32", marginBottom: "0.5rem",
              }}>
                Pembayaran Dikonfirmasi
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                color: "#6B4520", lineHeight: 1.7,
              }}>
                Pesananmu sudah dibayar dan sedang diproses untuk pengiriman.
              </p>
            </div>
          )}

          {/* Payment detail card */}
          {!loading && payment && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Order & resi info */}
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
                padding: "1.5rem 2rem",
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "15px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.2rem",
                }}>
                  Detail Pesanan
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Order ID", `#${payment.order_id}`],
                    ["Nomor Resi", tracking_number ?? "-"],
                    ["Status Pembayaran", payment.status === "success" ? "✓ Lunas" : "Menunggu Konfirmasi"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9A7050" }}>{k}</span>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600,
                        color: k === "Status Pembayaran"
                          ? (payment.status === "success" ? "#2E7D32" : "#8B5A2B")
                          : "#3D1F08",
                      }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method card */}
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
                padding: "1.5rem 2rem",
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "15px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.2rem",
                }}>
                  Metode Pembayaran
                </h2>
                <div style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "1rem 1.2rem", borderRadius: "14px",
                  background: "rgba(139,90,43,0.05)",
                  border: "1.5px solid rgba(139,90,43,0.2)",
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", color: "#FAF3E8", flexShrink: 0,
                  }}>
                    {METHOD_ICON[payment.provider] ?? "◇"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#3D1F08" }}>
                      {payment.provider}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9A7050" }}>
                      {payment.method_name}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "18px", fontWeight: 700, color: "#8B5A2B",
                    }}>
                      Rp {Number(payment.amount).toLocaleString("id-ID")}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A7050" }}>
                      Total tagihan
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruksi pembayaran */}
              {!confirmed && (
                <div style={{
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
                  padding: "1.5rem 2rem",
                }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "15px", fontWeight: 700, color: "#3D1F08", marginBottom: "1rem",
                  }}>
                    Instruksi Pembayaran
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      `Buka aplikasi ${payment.provider} di smartphone kamu`,
                      `Transfer sejumlah Rp ${Number(payment.amount).toLocaleString("id-ID")} ke nomor tujuan`,
                      "Setelah transfer berhasil, klik tombol Konfirmasi Pembayaran di bawah",
                    ].map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <div style={{
                          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 700, color: "#FAF3E8",
                          fontFamily: "'DM Sans', sans-serif",
                          marginTop: "1px",
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B4520", lineHeight: 1.6 }}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  padding: "10px 14px", borderRadius: "10px",
                  background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
                  color: "#B91C1C", fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                }}>
                  {error}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {!confirmed ? (
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    style={{
                      width: "100%", padding: "15px",
                      borderRadius: "50px",
                      background: confirming
                        ? "rgba(139,90,43,0.4)"
                        : "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                      color: "#FAF3E8", border: "none",
                      cursor: confirming ? "not-allowed" : "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600,
                      boxShadow: "0 6px 20px rgba(139,90,43,0.3)",
                      transition: "all 0.25s",
                    }}
                  >
                    {confirming ? "Mengkonfirmasi..." : "✓ Konfirmasi Pembayaran"}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/track?resi=${tracking_number}`)}
                    style={{
                      width: "100%", padding: "15px",
                      borderRadius: "50px",
                      background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                      color: "#FAF3E8", border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600,
                      boxShadow: "0 6px 20px rgba(139,90,43,0.3)",
                    }}
                  >
                    Lacak Paket →
                  </button>
                )}

                <button
                  onClick={() => router.push("/orders")}
                  style={{
                    width: "100%", padding: "13px",
                    borderRadius: "50px",
                    background: "transparent",
                    border: "1.5px solid rgba(139,90,43,0.35)",
                    color: "#5C3A1E", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,90,43,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Lihat Riwayat Pesanan
                </button>
              </div>

            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </>
  );
}
