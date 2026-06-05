"use client";

import { useApp } from "@/lib/context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, user } = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleRemove = (id: number) => {
    setRemoving(id);
    setTimeout(() => { removeFromCart(id); setRemoving(null); }, 300);
  };

  const shipping = cartCount > 0 ? (cartTotal >= 500 ? 0 : 25) : 0;
  const discount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const finalTotal = cartTotal - discount + shipping;

  const handleCheckout = () => {
    if (!user) { router.push("/login"); return; }
    router.push("/checkout");
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #FAF3E8; }

        .cart-root { min-height: 100vh; background: #FAF3E8; }

        /* ── top bar ── */
        .cart-topbar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(245,237,220,0.85);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(139,90,43,0.12);
          padding: 0 2rem; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .topbar-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700;
          color: #4A2E12; text-decoration: none;
        }
        .topbar-logo em { color: #8B5A2B; font-style: italic; }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #8B5A2B; text-decoration: none;
          font-weight: 500; transition: gap 0.2s;
        }
        .back-btn:hover { gap: 10px; }

        /* ── main layout ── */
        .cart-layout {
          max-width: 1200px; margin: 0 auto;
          padding: 3rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
        }
        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
        }

        /* ── section header ── */
        .section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 700; color: #3D1F08;
        }
        .clear-btn {
          font-size: 12px; color: #c0392b; background: none; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          padding: 4px 10px; border-radius: 6px;
          transition: background 0.2s;
        }
        .clear-btn:hover { background: rgba(192,57,43,0.07); }

        /* ── empty state ── */
        .empty-state {
          text-align: center; padding: 5rem 2rem;
          background: white; border-radius: 20px;
          border: 1.5px dashed rgba(139,90,43,0.2);
        }
        .empty-icon {
          font-size: 4rem; margin-bottom: 1.2rem;
          display: block;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; color: #3D1F08; margin-bottom: 0.5rem;
        }
        .empty-sub { color: #9A7050; font-size: 14px; margin-bottom: 1.5rem; font-weight: 300; }
        .shop-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 28px; border-radius: 30px;
          background: linear-gradient(135deg, #8B5A2B, #C49A6C);
          color: #FAF3E8; text-decoration: none;
          font-size: 14px; font-weight: 600;
          box-shadow: 0 6px 20px rgba(139,90,43,0.3);
          transition: all 0.3s;
        }
        .shop-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(139,90,43,0.4); }

        /* ── cart item ── */
        .cart-item {
          display: grid;
          grid-template-columns: 88px 1fr auto;
          gap: 1.2rem; align-items: center;
          background: white; border-radius: 16px;
          padding: 1.2rem; margin-bottom: 1rem;
          border: 1px solid rgba(139,90,43,0.08);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: all 0.3s;
        }
        .cart-item.removing {
          opacity: 0; transform: translateX(20px);
        }
        .cart-item:hover {
          border-color: rgba(139,90,43,0.18);
          box-shadow: 0 4px 20px rgba(139,90,43,0.1);
        }

        .item-image {
          width: 88px; height: 88px; border-radius: 12px;
          background: linear-gradient(135deg, #F5EDD8, #EEE0C8);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; flex-shrink: 0;
        }
        .item-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700; color: #3D1F08;
          margin-bottom: 4px;
        }
        .item-price { font-size: 16px; font-weight: 600; color: #8B5A2B; margin-bottom: 10px; }

        .qty-control {
          display: inline-flex; align-items: center; gap: 0; border-radius: 10px;
          border: 1.5px solid rgba(139,90,43,0.2); overflow: hidden;
        }
        .qty-btn {
          width: 32px; height: 32px; border: none; background: rgba(250,243,232,0.8);
          color: #5C3A1E; font-size: 16px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .qty-btn:hover { background: rgba(139,90,43,0.12); }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-value {
          width: 36px; text-align: center; font-size: 14px; font-weight: 600;
          color: #3D1F08; background: white; padding: 6px 0;
        }

        .item-right { text-align: right; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .item-subtotal { font-size: 15px; font-weight: 600; color: #3D1F08; }
        .remove-btn {
          font-size: 12px; color: #c0392b; background: none; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          padding: 3px 8px; border-radius: 6px;
          transition: background 0.2s;
        }
        .remove-btn:hover { background: rgba(192,57,43,0.08); }

        /* ── order summary ── */
        .summary-card {
          background: white; border-radius: 20px;
          padding: 1.8rem; border: 1px solid rgba(139,90,43,0.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          position: sticky; top: 80px;
          height: fit-content;
        }
        .summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; font-weight: 700; color: #3D1F08;
          margin-bottom: 1.5rem; padding-bottom: 1rem;
          border-bottom: 1px solid rgba(139,90,43,0.1);
        }

        .summary-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.8rem; font-size: 14px;
        }
        .summary-row .label { color: #9A7050; }
        .summary-row .value { color: #3D1F08; font-weight: 500; }
        .summary-row.total {
          border-top: 1.5px solid rgba(139,90,43,0.12);
          padding-top: 1rem; margin-top: 0.5rem;
          font-size: 16px; font-weight: 700; margin-bottom: 0;
        }
        .summary-row.total .label { color: #3D1F08; font-weight: 700; }
        .summary-row.total .value { color: #8B5A2B; font-size: 18px; }
        .summary-row.discount .value { color: #16a34a; }
        .summary-row.free .value { color: #16a34a; }

        .coupon-section { margin: 1.2rem 0; }
        .coupon-input-row { display: flex; gap: 8px; }
        .coupon-input {
          flex: 1; padding: 10px 14px;
          border: 1.5px solid rgba(139,90,43,0.2); border-radius: 10px;
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          background: rgba(250,243,232,0.5); color: #3D1F08;
          outline: none; transition: border-color 0.2s;
        }
        .coupon-input:focus { border-color: #8B5A2B; }
        .coupon-btn {
          padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid rgba(139,90,43,0.3);
          background: transparent; color: #8B5A2B;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
          transition: all 0.2s;
        }
        .coupon-btn:hover { background: rgba(139,90,43,0.08); }
        .coupon-success { font-size: 12px; color: #16a34a; margin-top: 6px; }
        .coupon-error { font-size: 12px; color: #c0392b; margin-top: 6px; }

        .checkout-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%);
          border: none; border-radius: 14px;
          color: #FAF3E8; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.3s; margin-top: 1.5rem;
          box-shadow: 0 6px 20px rgba(139,90,43,0.3);
          letter-spacing: 0.02em;
        }
        .checkout-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(139,90,43,0.4);
        }
        .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .continue-link {
          display: block; text-align: center;
          margin-top: 1rem; font-size: 13px;
          color: #8B5A2B; text-decoration: none; font-weight: 500;
        }
        .continue-link:hover { text-decoration: underline; }

        .badges {
          display: flex; justify-content: center; gap: 1rem;
          margin-top: 1.2rem; flex-wrap: wrap;
        }
        .badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #9A7050;
        }
        .badge svg { width: 14px; height: 14px; }

        /* ── product item emojis map ── */
      `}</style>

      <div className="cart-root">
        {/* Top bar */}
        <header className="cart-topbar">
          <Link href="/" className="topbar-logo">Lumi<em>è</em>re</Link>
          <Link href="/products" className="back-btn">← Continue Shopping</Link>
        </header>

        <div className="cart-layout">
          {/* ── Left: Item list ── */}
          <div>
            <div className="section-header">
              <h1 className="section-title">
                My Cart
                {cartCount > 0 && (
                  <span style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: "#9A7050", marginLeft: "10px" }}>
                    ({cartCount} item{cartCount > 1 ? "s" : ""})
                  </span>
                )}
              </h1>
              {cart.length > 0 && (
                <button className="clear-btn" onClick={clearCart}>Clear all</button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🛍️</span>
                <h2 className="empty-title">Your cart is empty</h2>
                <p className="empty-sub">Looks like you haven&apos;t added anything yet</p>
                <Link href="/products" className="shop-btn">Browse Collection →</Link>
              </div>
            ) : (
              <div>
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className={`cart-item${removing === item.product_id ? " removing" : ""}`}
                  >
                    {/* Image placeholder */}
                    <div className="item-image">
                      {["👗","👔","👖","🧥","✨","💍"][item.product_id % 6]}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="item-name">{item.product_name}</div>
                      <div className="item-price">Rp {Number(item.price).toLocaleString("id-ID")}</div>
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                          aria-label="Kurangi"
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Tambah"
                        >+</button>
                      </div>
                      {item.quantity >= item.stock && (
                        <p style={{ fontSize: "11px", color: "#e67e22", marginTop: "6px" }}>
                          Stok habis (maks {item.stock})
                        </p>
                      )}
                    </div>

                    {/* Right: subtotal + remove */}
                    <div className="item-right">
                      <span className="item-subtotal">
                        Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                      </span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.product_id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Free shipping progress */}
                {cartTotal < 500 && (
                  <div style={{
                    background: "rgba(139,90,43,0.05)", borderRadius: 12, padding: "1rem 1.2rem",
                    border: "1px solid rgba(139,90,43,0.1)", marginTop: "0.5rem",
                  }}>
                    <p style={{ fontSize: "13px", color: "#6B4520", marginBottom: "6px" }}>
                      ✦ Tambah <strong>Rp {(500 - cartTotal).toLocaleString("id-ID")}</strong> lagi untuk <strong>Free Shipping!</strong>
                    </p>
                    <div style={{ height: 4, background: "rgba(139,90,43,0.12)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${Math.min((cartTotal / 500) * 100, 100)}%`,
                        background: "linear-gradient(90deg, #8B5A2B, #C49A6C)", borderRadius: 2,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <div>
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span className="label">Subtotal ({cartCount} items)</span>
                <span className="value">Rp {cartTotal.toLocaleString("id-ID")}</span>
              </div>

              {couponApplied && (
                <div className="summary-row discount">
                  <span className="label">Diskon (LUMIERE10)</span>
                  <span className="value">−Rp {discount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className={`summary-row ${shipping === 0 ? "free" : ""}`}>
                <span className="label">Ongkir</span>
                <span className="value">
                  {cartCount === 0 ? "—" : shipping === 0 ? "✓ Gratis" : `Rp ${shipping.toLocaleString("id-ID")}`}
                </span>
              </div>

              <div className="summary-row total">
                <span className="label">Total</span>
                <span className="value">Rp {finalTotal.toLocaleString("id-ID")}</span>
              </div>

              {/* Coupon */}
              {!couponApplied && cart.length > 0 && (
                <div className="coupon-section">
                  <div className="coupon-input-row">
                    <input
                      className="coupon-input"
                      placeholder="Kode promo"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (coupon === "LUMIERE10") setCouponApplied(true);
                        }
                      }}
                    />
                    <button className="coupon-btn" onClick={() => {
                      if (coupon === "LUMIERE10") setCouponApplied(true);
                    }}>
                      Apply
                    </button>
                  </div>
                  <p style={{ fontSize: "11px", color: "#9A7050", marginTop: 6 }}>
                    Coba kode: <strong>LUMIERE10</strong>
                  </p>
                </div>
              )}
              {couponApplied && (
                <p className="coupon-success">✓ Kode LUMIERE10 berhasil diterapkan — hemat 10%!</p>
              )}

              <button
                className="checkout-btn"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                {user ? "Proceed to Checkout →" : "Login to Checkout →"}
              </button>

              {!user && cart.length > 0 && (
                <p style={{ fontSize: "12px", color: "#9A7050", textAlign: "center", marginTop: "8px" }}>
                  Kamu perlu <Link href="/login" style={{ color: "#8B5A2B", fontWeight: 600 }}>login</Link> sebelum checkout
                </p>
              )}

              <Link href="/products" className="continue-link">← Continue Shopping</Link>

              <div className="badges">
                <span className="badge">🔒 Secure checkout</span>
                <span className="badge">↩ Free returns</span>
                <span className="badge">🚚 Fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
