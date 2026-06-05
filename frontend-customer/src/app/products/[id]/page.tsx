"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ShoppingCart, Heart, Star, ChevronLeft, Shield, RotateCcw, Truck, Award, Plus, Minus, Check } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  category?: string;
  material?: string;
  rating?: number;
  review_count?: number;
}

// ── Mock fallback ─────────────────────────────────────────────────────────────
const mockProduct = (id: number): Product => ({
  product_id: id,
  product_name: `Lumière Piece No. ${id}`,
  description: "A masterwork of refined craftsmanship. Each detail has been considered with exacting precision — from the ethically sourced materials to the hand-finished surface. This piece is designed to be worn, treasured, and eventually passed down.",
  price: 299 + id * 17,
  stock: 8,
  created_at: new Date().toISOString(),
  category: "Jewellery",
  rating: 4.6,
  review_count: 142,
});

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "reviews">("description");
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPageLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => setProduct(mockProduct(Number(id))))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const rating = product?.rating ?? 4.5;
  const reviewCount = product?.review_count ?? 0;
  const discount = 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", color: "#C49A6C", marginBottom: "1rem", animation: "pulse 1.5s ease-in-out infinite" }}>◎</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#A07040" }}>Loading piece...</p>
          </div>
        </main>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }`}</style>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1.5rem 0",
          display: "flex", alignItems: "center", gap: "8px",
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#A07040",
        }}>
          <Link href="/" style={{ color: "#A07040", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href="/products" style={{ color: "#A07040", textDecoration: "none" }}>Collection</Link>
          <span>›</span>
          <span style={{ color: "#3D1F08", fontWeight: 500 }}>{product.product_name}</span>
        </div>

        {/* ── BACK BUTTON ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.8rem 1.5rem" }}>
          <Link href="/products" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#8B5A2B",
            textDecoration: "none", fontWeight: 500,
          }}>
            <ChevronLeft size={14} /> Back to Collection
          </Link>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem 4rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start",
          opacity: pageLoaded ? 1 : 0,
          transform: pageLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        className="product-grid"
        >

          {/* ── LEFT: IMAGE ── */}
          <div>
            {/* Main image */}
            <div style={{
              position: "relative",
              aspectRatio: "1/1",
              borderRadius: "24px",
              overflow: "hidden",
              background: "linear-gradient(145deg, #F5EDDC 0%, #EDE0C8 50%, #E4D0B0 100%)",
              marginBottom: "1rem",
              boxShadow: "0 20px 60px rgba(139,90,43,0.15)",
            }}>
              {/* Radial light effect */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.4) 0%, transparent 60%)",
                zIndex: 1,
              }} />

              {/* Placeholder ring SVG */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0,
              }}>
                <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
                  <circle cx="130" cy="130" r="90" stroke="rgba(139,90,43,0.15)" strokeWidth="28" fill="none"/>
                  <circle cx="130" cy="130" r="55" stroke="rgba(196,154,108,0.2)" strokeWidth="6" fill="none"/>
                  <circle cx="130" cy="40" r="14" fill="rgba(212,169,106,0.4)"/>
                  <circle cx="130" cy="40" r="8" fill="rgba(212,169,106,0.6)"/>
                  <circle cx="220" cy="130" r="6" fill="rgba(196,154,108,0.3)"/>
                  <circle cx="40" cy="130" r="6" fill="rgba(196,154,108,0.3)"/>
                </svg>
              </div>

              {/* Stock badge */}
              {product.stock <= 5 && product.stock > 0 && (
                <div style={{
                  position: "absolute", top: "16px", left: "16px", zIndex: 10,
                  background: "rgba(160,80,32,0.9)", color: "#FAF3E8",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                  padding: "5px 12px", borderRadius: "20px", backdropFilter: "blur(8px)",
                }}>
                  Only {product.stock} left
                </div>
              )}

              {/* Wishlist */}
              <button onClick={() => setIsWishlisted(!isWishlisted)} style={{
                position: "absolute", top: "16px", right: "16px", zIndex: 10,
                width: "42px", height: "42px", borderRadius: "50%",
                background: "rgba(250,243,232,0.9)", backdropFilter: "blur(10px)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(139,90,43,0.15)",
                transition: "all 0.25s",
                transform: isWishlisted ? "scale(1.1)" : "scale(1)",
              }}>
                <Heart size={18} fill={isWishlisted ? "#8B5A2B" : "none"} color={isWishlisted ? "#8B5A2B" : "#8B6240"} />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  flex: 1, aspectRatio: "1/1", borderRadius: "12px",
                  background: "linear-gradient(145deg, #F5EDDC, #EDE0C8)",
                  border: i === 1 ? "2px solid #8B5A2B" : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: i === 1 ? 1 : 0.5,
                }}>
                  <svg width="32" height="32" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="20" stroke="rgba(139,90,43,0.2)" strokeWidth="6" fill="none"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: INFO ── */}
          <div>
            {/* Category */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 14px", borderRadius: "20px",
              background: "rgba(139,90,43,0.08)", border: "1px solid rgba(139,90,43,0.2)",
              marginBottom: "1rem",
            }}>
              <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B5A2B", fontWeight: 600 }}>
                {product.category ?? "Jewellery"}
              </span>
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700, color: "#3D1F08",
              lineHeight: 1.1, marginBottom: "1rem",
            }}>
              {product.product_name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={15}
                    fill={s <= Math.floor(rating) ? "#C49A6C" : "none"}
                    color={s <= rating ? "#C49A6C" : "#D4B896"}
                  />
                ))}
              </div>
              <span style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: "#8B5A2B", fontWeight: 600 }}>{rating.toFixed(1)}</span>
              <span style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: "#A07040" }}>({reviewCount} reviews)</span>
              {product.stock > 0 ? (
                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", fontSize: "12px", color: "#5C8A2B", fontWeight: 600 }}>
                  <Check size={13} /> In Stock
                </span>
              ) : (
                <span style={{ marginLeft: "auto", fontFamily: "'DM Sans'", fontSize: "12px", color: "#A05020", fontWeight: 600 }}>Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div style={{
              display: "flex", alignItems: "baseline", gap: "12px",
              marginBottom: "2rem", padding: "1.2rem 1.5rem",
              background: "rgba(139,90,43,0.04)", borderRadius: "16px",
              border: "1px solid rgba(139,90,43,0.1)",
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#3D1F08" }}>
                ${product.price.toLocaleString()}
              </span>
              {discount > 0 && (
                <span style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: "#B09070", textDecoration: "line-through" }}>
                  ${(product.price * (1 + discount / 100)).toLocaleString()}
                </span>
              )}
              <span style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#A07040", marginLeft: "auto" }}>
                Free shipping over $500
              </span>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontFamily: "'DM Sans'", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B5A2B", fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
                Quantity
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                  width: "40px", height: "40px", borderRadius: "12px 0 0 12px",
                  border: "1.5px solid rgba(139,90,43,0.25)", borderRight: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#8B5A2B", transition: "all 0.2s",
                }}>
                  <Minus size={14} />
                </button>
                <div style={{
                  width: "60px", height: "40px",
                  border: "1.5px solid rgba(139,90,43,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Sans'", fontSize: "15px", fontWeight: 600, color: "#3D1F08",
                }}>
                  {qty}
                </div>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{
                  width: "40px", height: "40px", borderRadius: "0 12px 12px 0",
                  border: "1.5px solid rgba(139,90,43,0.25)", borderLeft: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#8B5A2B", transition: "all 0.2s",
                }}>
                  <Plus size={14} />
                </button>
                <span style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#A07040", marginLeft: "12px" }}>
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "2rem" }}>
              <button onClick={handleAddToCart} style={{
                flex: 1, padding: "14px 24px", borderRadius: "14px",
                border: "none", cursor: "pointer",
                background: addedToCart
                  ? "linear-gradient(135deg, #5C8A2B, #7CB97A)"
                  : "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                color: "#FAF3E8",
                fontFamily: "'DM Sans'", fontSize: "15px", fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: "0 6px 24px rgba(139,90,43,0.35)",
                transition: "all 0.3s",
                transform: addedToCart ? "scale(0.98)" : "scale(1)",
              }}>
                {addedToCart ? <><Check size={16} /> Added to Cart!</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>

              <button onClick={() => setIsWishlisted(!isWishlisted)} style={{
                width: "50px", height: "50px", borderRadius: "14px",
                border: "1.5px solid rgba(139,90,43,0.3)",
                background: isWishlisted ? "rgba(139,90,43,0.1)" : "transparent",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s",
              }}>
                <Heart size={18} fill={isWishlisted ? "#8B5A2B" : "none"} color="#8B5A2B" />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "10px", marginBottom: "2rem",
            }}>
              {[
                { Icon: Shield, text: "Authenticity Guaranteed" },
                { Icon: RotateCcw, text: "30-Day Returns" },
                { Icon: Truck, text: "Free Express Shipping" },
                { Icon: Award, text: "Lifetime Warranty" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 12px", borderRadius: "12px",
                  background: "rgba(139,90,43,0.04)",
                  border: "1px solid rgba(139,90,43,0.1)",
                }}>
                  <Icon size={14} color="#8B5A2B" />
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#6B4520", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Product meta */}
            <div style={{
              padding: "1rem 1.2rem", borderRadius: "14px",
              background: "rgba(139,90,43,0.03)",
              border: "1px solid rgba(139,90,43,0.1)",
            }}>
              {[
                { label: "Product ID", value: `#LM-${String(product.product_id).padStart(4, "0")}` },
                { label: "Category", value: product.category ?? "Jewellery" },
                { label: "Material", value: product.material ?? "Premium Gold" },
                { label: "Stock", value: `${product.stock} units` },
                { label: "Added", value: new Date(product.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid rgba(139,90,43,0.08)",
                }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#A07040" }}>{label}</span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#3D1F08", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}>
          {/* Tab headers */}
          <div style={{
            display: "flex", gap: "0",
            borderBottom: "2px solid rgba(139,90,43,0.12)",
            marginBottom: "2.5rem",
          }}>
            {(["description", "details", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "12px 24px",
                border: "none", background: "transparent", cursor: "pointer",
                fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#3D1F08" : "#A07040",
                textTransform: "capitalize", letterSpacing: "0.05em",
                borderBottom: activeTab === tab ? "2px solid #8B5A2B" : "2px solid transparent",
                marginBottom: "-2px", transition: "all 0.2s",
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "description" && (
            <div style={{ maxWidth: "680px" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "15px", color: "#5C3A1E", lineHeight: 1.9, fontWeight: 300, marginBottom: "1.5rem" }}>
                {product.description}
              </p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "15px", color: "#5C3A1E", lineHeight: 1.9, fontWeight: 300 }}>
                Lumière pieces are designed to be worn, treasured, and eventually passed down. Each is made to order with careful attention paid to every surface, joint, and finishing detail.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div style={{ maxWidth: "600px" }}>
              {[
                { label: "Weight", value: "4.2g" },
                { label: "Material", value: product.material ?? "18k Yellow Gold" },
                { label: "Dimensions", value: "Adjustable, fits sizes 5–9" },
                { label: "Finish", value: "High Polish" },
                { label: "Stone", value: "Natural Diamond, 0.15ct" },
                { label: "Certificate", value: "GIA Certified" },
                { label: "Origin", value: "Handcrafted in Indonesia" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0", borderBottom: "1px solid rgba(139,90,43,0.1)",
                }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: "#A07040", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#3D1F08" }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ maxWidth: "680px" }}>
              {/* Rating summary */}
              <div style={{
                display: "flex", gap: "3rem", alignItems: "center",
                padding: "2rem", borderRadius: "20px",
                background: "rgba(139,90,43,0.04)", border: "1px solid rgba(139,90,43,0.1)",
                marginBottom: "2rem",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem", fontWeight: 700, color: "#3D1F08", lineHeight: 1 }}>{rating.toFixed(1)}</div>
                  <div style={{ display: "flex", gap: "3px", justifyContent: "center", margin: "6px 0" }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.floor(rating) ? "#C49A6C" : "none"} color="#C49A6C" />)}
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#A07040" }}>{reviewCount} reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5,4,3,2,1].map(stars => (
                    <div key={stars} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#A07040", width: "8px" }}>{stars}</span>
                      <Star size={10} fill="#C49A6C" color="#C49A6C" />
                      <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "rgba(139,90,43,0.1)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #8B5A2B, #C49A6C)", width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 2 : 1}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample reviews */}
              {[
                { name: "Ayu P.", location: "Jakarta", rating: 5, text: "Absolutely stunning. The craftsmanship is impeccable and it arrived beautifully packaged. Worth every penny.", date: "2 weeks ago" },
                { name: "Rania K.", location: "Bali", rating: 5, text: "I bought this as an anniversary gift and my partner was speechless. The quality exceeded all expectations.", date: "1 month ago" },
                { name: "Sari W.", location: "Surabaya", rating: 4, text: "Beautiful piece, exactly as described. Shipping was fast and the packaging was luxurious.", date: "2 months ago" },
              ].map((review, i) => (
                <div key={i} style={{
                  padding: "1.5rem 0",
                  borderBottom: "1px solid rgba(139,90,43,0.1)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#FAF3E8", fontWeight: 700,
                      }}>
                        {review.name[0]}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: 600, color: "#3D1F08" }}>{review.name}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#A07040" }}>{review.location}</div>
                      </div>
                    </div>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#B09070" }}>{review.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "0.6rem" }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "#C49A6C" : "none"} color="#C49A6C" />)}
                  </div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: "#5C3A1E", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </>
  );
}