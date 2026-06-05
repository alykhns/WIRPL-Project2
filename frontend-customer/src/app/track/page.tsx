"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const API = "http://localhost:3000/api";

type ShipmentHistory = {
  history_id: number;
  shipment_id: number;
  location: string;
  status_note: string;
  recorded_at?: string;
};

type Shipment = {
  shipment_id: number;
  order_id: number;
  courier_id: number;
  tracking_number: string;
  destination_address: string;
  shipping_status: string;
  courier_name: string;
  service_type: string;
  estimated_delivery?: string;
};

type TrackResult = {
  shipment: Shipment;
  history: ShipmentHistory[];
};

const STATUS_STEPS = ["preparing", "picked_up", "in_transit", "delivered"];
const STATUS_LABEL: Record<string, string> = {
  preparing:  "Sedang Disiapkan",
  picked_up:  "Dipickup Kurir",
  in_transit: "Dalam Perjalanan",
  delivered:  "Telah Diterima",
  returned:   "Dikembalikan",
};
const STATUS_ICON: Record<string, string> = {
  preparing:  "◇",
  picked_up:  "◈",
  in_transit: "◉",
  delivered:  "✦",
  returned:   "↩",
};

export default function TrackPage() {
  const [resi, setResi] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    const trimmed = resi.trim();
    if (!trimmed) { setError("Masukkan nomor resi terlebih dahulu."); return; }
    setError(""); setResult(null); setLoading(true);
    try {
      const res = await fetch(`${API}/logistics/track/${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (res.ok && data.shipment) {
        setResult(data);
      } else {
        setError(data.message ?? "Nomor resi tidak ditemukan.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = result
    ? STATUS_STEPS.indexOf(result.shipment.shipping_status)
    : -1;

  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#8B5A2B", display: "block", marginBottom: "0.5rem", fontWeight: 600,
            }}>
              Pengiriman
            </span>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700, color: "#3D1F08", margin: 0,
            }}>
              Lacak <em style={{ color: "#8B5A2B", fontStyle: "italic" }}>Paket</em>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
              color: "#9A7050", marginTop: "0.8rem",
            }}>
              Masukkan nomor resi untuk mengetahui status pengirimanmu.
            </p>
          </div>

          {/* Search box */}
          <div style={{
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
            padding: "1.5rem 2rem", marginBottom: "2rem",
          }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="Contoh: LMR-1780573373323"
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: "12px",
                  border: "1.5px solid rgba(196,154,108,0.35)",
                  background: "rgba(250,243,232,0.6)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#3D1F08",
                  outline: "none",
                }}
              />
              <button
                onClick={handleTrack}
                disabled={loading}
                style={{
                  padding: "12px 24px", borderRadius: "12px",
                  background: loading
                    ? "rgba(139,90,43,0.4)"
                    : "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                  color: "#FAF3E8", border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(139,90,43,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Mencari..." : "Lacak →"}
              </button>
            </div>

            {error && (
              <div style={{
                marginTop: "12px", padding: "10px 14px", borderRadius: "10px",
                background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
                color: "#B91C1C", fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Info shipment */}
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
                padding: "1.5rem 2rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "18px", fontWeight: 700, color: "#3D1F08", marginBottom: "4px",
                    }}>
                      {result.shipment.tracking_number}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9A7050" }}>
                      Order #{result.shipment.order_id} · {result.shipment.courier_name} {result.shipment.service_type}
                    </div>
                  </div>
                  <span style={{
                    display: "inline-block", padding: "6px 16px", borderRadius: "20px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                    color: result.shipment.shipping_status === "delivered" ? "#2E7D32" : "#8B5A2B",
                    background: result.shipment.shipping_status === "delivered"
                      ? "rgba(46,125,50,0.10)" : "rgba(139,90,43,0.10)",
                  }}>
                    {STATUS_ICON[result.shipment.shipping_status] ?? "◇"}&nbsp;
                    {STATUS_LABEL[result.shipment.shipping_status] ?? result.shipment.shipping_status}
                  </span>
                </div>

                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B4520" }}>
                  <span style={{ color: "#9A7050" }}>Tujuan:</span>&nbsp;
                  {result.shipment.destination_address}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
                padding: "1.5rem 2rem",
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "15px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.5rem",
                }}>
                  Status Pengiriman
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStepIndex;
                    const active = i === currentStepIndex;
                    return (
                      <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? "1" : "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                          <div style={{
                            width: active ? "36px" : "28px",
                            height: active ? "36px" : "28px",
                            borderRadius: "50%",
                            background: done
                              ? "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)"
                              : "rgba(196,154,108,0.15)",
                            border: done ? "none" : "1.5px solid rgba(196,154,108,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: active ? "14px" : "11px",
                            color: done ? "#FAF3E8" : "#C49A6C",
                            transition: "all 0.3s",
                            boxShadow: active ? "0 4px 14px rgba(139,90,43,0.35)" : "none",
                          }}>
                            {done ? (active ? STATUS_ICON[step] : "✓") : STATUS_ICON[step]}
                          </div>
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "10px", fontWeight: active ? 600 : 400,
                            color: done ? "#8B5A2B" : "#C49A6C",
                            textAlign: "center", maxWidth: "60px", lineHeight: 1.3,
                          }}>
                            {STATUS_LABEL[step]}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div style={{
                            flex: 1, height: "2px", margin: "0 4px", marginBottom: "22px",
                            background: i < currentStepIndex
                              ? "linear-gradient(90deg, #8B5A2B, #C49A6C)"
                              : "rgba(196,154,108,0.2)",
                            transition: "background 0.3s",
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History */}
              {result.history.length > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px",
                  padding: "1.5rem 2rem",
                }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "15px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.2rem",
                  }}>
                    Riwayat Perjalanan
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {result.history.map((h, i) => (
                      <div key={h.history_id} style={{ display: "flex", gap: "16px" }}>
                        {/* Timeline line */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{
                            width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0,
                            background: i === 0
                              ? "linear-gradient(135deg, #8B5A2B, #C49A6C)"
                              : "rgba(196,154,108,0.4)",
                            marginTop: "4px",
                          }} />
                          {i < result.history.length - 1 && (
                            <div style={{ width: "1px", flex: 1, background: "rgba(196,154,108,0.25)", margin: "4px 0" }} />
                          )}
                        </div>
                        {/* Content */}
                        <div style={{ paddingBottom: i < result.history.length - 1 ? "16px" : 0 }}>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "13px", fontWeight: 600, color: "#3D1F08", marginBottom: "2px",
                          }}>
                            {h.location}
                          </div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12px", color: "#9A7050",
                          }}>
                            {h.status_note}
                            {h.recorded_at && (
                              <span style={{ marginLeft: "8px", color: "#C49A6C" }}>
                                · {new Date(h.recorded_at).toLocaleString("id-ID")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: rgba(139,90,43,0.6) !important; }
      `}</style>
    </>
  );
}
