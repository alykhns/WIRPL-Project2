"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API = "http://localhost:3000/api";

type Courier = {
  courier_id: number;
  courier_name: string;
  service_type: string;
  cost_per_km: number;
};

type PaymentMethod = {
  method_id: number;
  method_name: string;
  provider: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ order_id: number; tracking_number: string } | null>(null);

  const [form, setForm] = useState({
    buyer_id: 1,
    institution_id: 1,
    product_id: 1,
    quantity: 1,
    price: 100,
    payment_method_id: 0,
    courier_id: 0,
    destination_address: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/logistics/couriers`).then((r) => r.json()),
      fetch(`${API}/payment/methods`).then((r) => r.json()),
    ])
      .then(([couriersData, methodsData]) => {
        const c = Array.isArray(couriersData) ? couriersData : [];
        const m = Array.isArray(methodsData) ? methodsData : [];
        setCouriers(c);
        setPaymentMethods(m);
        if (c.length > 0) setForm((f) => ({ ...f, courier_id: c[0].courier_id }));
        if (m.length > 0) setForm((f) => ({ ...f, payment_method_id: m[0].method_id }));
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data. Pastikan server berjalan.");
        setLoading(false);
      });
  }, []);

  const total = form.price * form.quantity;

  const handleSubmit = async () => {
    if (!form.destination_address.trim()) {
      setError("Alamat pengiriman harus diisi.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: form.buyer_id,
          institution_id: form.institution_id,
          total_amount: total,
          items: [{ product_id: form.product_id, quantity: form.quantity, price: form.price }],
          payment_method_id: form.payment_method_id,
          courier_id: form.courier_id,
          destination_address: form.destination_address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
          router.push(`/payment?order_id=${data.order_id}&tracking_number=${data.tracking_number}`);
      } else {
        setError(data.message ?? "Checkout gagal. Coba lagi.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid rgba(196,154,108,0.35)",
    background: "rgba(250,243,232,0.6)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "#3D1F08",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "#8B5A2B",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: "6px",
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", color: "#C49A6C" }}>✦</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem", fontWeight: 700, color: "#3D1F08", marginBottom: "1rem",
            }}>
              Pesanan Berhasil!
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6B4520", marginBottom: "2rem", lineHeight: 1.7 }}>
              Order <strong>#{success.order_id}</strong> telah dibuat. Gunakan nomor resi di bawah untuk melacak paket kamu.
            </p>
            <div style={{
              padding: "1.5rem 2rem",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(196,154,108,0.3)",
              borderRadius: "16px",
              marginBottom: "2rem",
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A7050", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                Nomor Resi
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#8B5A2B" }}>
                {success.tracking_number}
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push(`/payment?order_id=${success.order_id}&tracking_number=${success.tracking_number}`)}
                style={{
                  padding: "12px 28px", borderRadius: "50px",
                  background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                  color: "#FAF3E8", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600,
                  boxShadow: "0 6px 20px rgba(139,90,43,0.3)",
                }}
              >
                Lacak Paket →
              </button>
              
              <button
                onClick={() => router.push(`/payment?order_id=${success.order_id}&tracking_number=${success.tracking_number}`)}
                style={{
                  padding: "12px 28px", borderRadius: "50px",
                  background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                  color: "#FAF3E8", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600,
                  boxShadow: "0 6px 20px rgba(139,90,43,0.3)",
                  }}
                  >
                  Bayar Sekarang →
              </button>
            </div>
          </div>
        </main>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      </>
    );
  }

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
              Pembayaran
            </span>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700, color: "#3D1F08", margin: 0,
            }}>
              Konfirmasi <em style={{ color: "#8B5A2B", fontStyle: "italic" }}>Pesanan</em>
            </h1>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#8B5A2B", fontFamily: "'DM Sans', sans-serif" }}>
              Memuat data...
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>

              {/* Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Produk */}
                <div style={{
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px", padding: "1.5rem 2rem",
                }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.2rem" }}>
                    Detail Produk
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>ID Produk</label>
                      <input type="number" style={inputStyle} value={form.product_id}
                        onChange={(e) => setForm({ ...form, product_id: Number(e.target.value) })} min={1} />
                    </div>
                    <div>
                      <label style={labelStyle}>Jumlah</label>
                      <input type="number" style={inputStyle} value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min={1} />
                    </div>
                    <div>
                      <label style={labelStyle}>Harga Satuan (Rp)</label>
                      <input type="number" style={inputStyle} value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} />
                    </div>
                  </div>
                </div>

                {/* Pengiriman */}
                <div style={{
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px", padding: "1.5rem 2rem",
                }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.2rem" }}>
                    Alamat Pengiriman
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Alamat Lengkap</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                        placeholder="Jl. Kaliurang, Sleman, DI Yogyakarta"
                        value={form.destination_address}
                        onChange={(e) => setForm({ ...form, destination_address: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Pilih Kurir</label>
                      <select style={inputStyle} value={form.courier_id}
                        onChange={(e) => setForm({ ...form, courier_id: Number(e.target.value) })}>
                        {couriers.map((c) => (
                          <option key={c.courier_id} value={c.courier_id}>
                            {c.courier_name} — {c.service_type} (Rp {c.cost_per_km.toLocaleString("id-ID")}/km)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pembayaran */}
                <div style={{
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,154,108,0.25)", borderRadius: "20px", padding: "1.5rem 2rem",
                }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.2rem" }}>
                    Metode Pembayaran
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {paymentMethods.map((m) => (
                      <label key={m.method_id} style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 16px", borderRadius: "12px",
                        border: `1.5px solid ${form.payment_method_id === m.method_id ? "rgba(139,90,43,0.5)" : "rgba(196,154,108,0.25)"}`,
                        background: form.payment_method_id === m.method_id ? "rgba(139,90,43,0.06)" : "transparent",
                        cursor: "pointer", transition: "all 0.2s",
                      }}>
                        <input type="radio" name="payment" value={m.method_id}
                          checked={form.payment_method_id === m.method_id}
                          onChange={() => setForm({ ...form, payment_method_id: m.method_id })}
                          style={{ accentColor: "#8B5A2B" }}
                        />
                        <div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#3D1F08" }}>
                            {m.provider}
                          </div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9A7050" }}>
                            {m.method_name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ position: "sticky", top: "80px" }}>
                <div style={{
                  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(196,154,108,0.3)", borderRadius: "20px", padding: "1.5rem 2rem",
                }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: "#3D1F08", marginBottom: "1.5rem" }}>
                    Ringkasan Pesanan
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
                    {[
                      ["Produk", `Product #${form.product_id}`],
                      ["Jumlah", `${form.quantity} pcs`],
                      ["Harga satuan", `Rp ${Number(form.price).toLocaleString("id-ID")}`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9A7050" }}>{k}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#3D1F08" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ height: "1px", background: "rgba(196,154,108,0.2)", margin: "4px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#3D1F08" }}>Total</span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#8B5A2B" }}>
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      padding: "10px 14px", borderRadius: "10px",
                      background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
                      color: "#B91C1C", fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                      marginBottom: "1rem",
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      width: "100%", padding: "14px",
                      borderRadius: "50px",
                      background: submitting
                        ? "rgba(139,90,43,0.4)"
                        : "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                      color: "#FAF3E8", border: "none",
                      cursor: submitting ? "not-allowed" : "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600,
                      boxShadow: "0 6px 20px rgba(139,90,43,0.3)",
                      transition: "all 0.25s",
                    }}
                  >
                    {submitting ? "Memproses..." : "Buat Pesanan →"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus, textarea:focus { border-color: rgba(139,90,43,0.6) !important; }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
