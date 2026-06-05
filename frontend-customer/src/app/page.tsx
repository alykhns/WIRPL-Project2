"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Oversized Linen Blazer",
    category: "Outerwear",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 312,
    isSale: true,
    stock: 3,
  },
  {
    id: 2,
    name: "Silk Wrap Midi Dress",
    category: "Dresses",
    price: 649,
    rating: 4.7,
    reviewCount: 184,
    isSale: false,
    stock: 12,
  },
  {
    id: 3,
    name: "Wide Leg Trousers",
    category: "Bottoms",
    price: 479,
    originalPrice: 599,
    rating: 4.8,
    reviewCount: 256,
    isSale: true,
    stock: 7,
  },
];

const CATEGORIES = [
  { name: "Dresses",    icon: "◎", count: "240+", href: "/products?category=dresses" },
  { name: "Tops",       icon: "◈", count: "180+", href: "/products?category=tops" },
  { name: "Bottoms",    icon: "◇", count: "150+", href: "/products?category=bottoms" },
  { name: "Outerwear",  icon: "◉", count: "120+", href: "/products?category=outerwear" },
  { name: "Accessories",icon: "✦", count: "95+",  href: "/products?category=accessories" },
  { name: "Sets",       icon: "◆", count: "60+",  href: "/products?category=sets" },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = Math.ceil(to / 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= to) { setCount(to); clearInterval(timer); }
        else setCount(start);
      }, 20);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products?limit=3")
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const mapped = arr.map((p: any) => ({
          id: p.product_id,
          name: p.product_name,
          price: p.price,
          stock: p.stock,
          category: "Fashion",
          rating: 4.5,
          reviewCount: 0,
          isSale: false,
        }));
        setFeaturedProducts(mapped.length > 0 ? mapped : FEATURED_PRODUCTS);
      })
      .catch(() => setFeaturedProducts(FEATURED_PRODUCTS));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const testimonials = [
    { quote: "The quality is unmatched. I wear my linen blazer everywhere and always get compliments.", author: "Sophia R.", location: "Jakarta" },
    { quote: "Finally a local brand that understands modern minimalist style. Every piece is chef's kiss.", author: "Ayu P.", location: "Bali" },
    { quote: "Ordered twice already. The silk dress fits like it was made just for me.", author: "Rania K.", location: "Surabaya" },
  ];

  return (
    <>
      <Navbar />

      <main style={{ background: "#FAF3E8", minHeight: "100vh", overflowX: "hidden" }}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden", paddingTop: "64px",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196,154,108,0.18) 0%, rgba(250,243,232,0) 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(139,90,43,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 10%, rgba(212,169,106,0.12) 0%, transparent 60%)",
          }} />

          {[
            { size: 420, top: "8%", left: "-6%", opacity: 0.06 },
            { size: 280, top: "60%", right: "-4%", opacity: 0.07 },
            { size: 180, top: "15%", right: "12%", opacity: 0.09 },
          ].map((r, i) => (
            <div key={i} style={{
              position: "absolute", top: r.top, left: r.left, right: r.right,
              width: r.size, height: r.size, borderRadius: "50%",
              border: `${i === 0 ? 24 : 12}px solid rgba(139,90,43,${r.opacity})`,
              pointerEvents: "none",
              animation: `floatRing ${8 + i * 2}s ease-in-out infinite alternate`,
            }} />
          ))}

          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 1.5rem", maxWidth: "800px",
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 18px", borderRadius: "30px",
              background: "rgba(139,90,43,0.08)", border: "1px solid rgba(139,90,43,0.2)",
              marginBottom: "2rem",
            }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B5A2B", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                ✦ &nbsp;New Collection 2026 &nbsp;✦
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 700, color: "#3D1F08",
              lineHeight: 1.05, marginBottom: "1.5rem", letterSpacing: "-0.02em",
            }}>
              Style That<br />
              <em style={{ color: "#8B5A2B", fontStyle: "italic" }}>Speaks for You</em>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "#6B4520", maxWidth: "520px",
              margin: "0 auto 2.5rem", lineHeight: 1.7, fontWeight: 300,
            }}>
              Curated fashion pieces in premium fabrics — designed for the woman who dresses with intention.
            </p>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
              <SearchBar variant="hero" placeholder="Search dresses, tops, outerwear..." />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/products" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 32px", borderRadius: "50px",
                background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                color: "#FAF3E8", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600,
                boxShadow: "0 6px 24px rgba(139,90,43,0.35)", transition: "all 0.3s",
              }}>
                Shop the Collection →
              </Link>
              <Link href="/lookbook" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 32px", borderRadius: "50px",
                background: "transparent", border: "1.5px solid rgba(139,90,43,0.35)",
                color: "#5C3A1E", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500,
                transition: "all 0.3s",
              }}>
                ✦ View Lookbook
              </Link>
            </div>
          </div>

          <div style={{
            position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            opacity: 0.5, animation: "bounceDown 2s ease-in-out infinite",
          }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: "10px", letterSpacing: "0.15em", color: "#8B5A2B", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #8B5A2B, transparent)" }} />
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section style={{
          borderTop: "1px solid rgba(139,90,43,0.12)",
          borderBottom: "1px solid rgba(139,90,43,0.12)",
          background: "rgba(139,90,43,0.03)",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { value: 25000, suffix: "+", label: "Happy Shoppers" },
              { value: 800, suffix: "+", label: "Unique Styles" },
              { value: 5, suffix: "", label: "Years in Fashion" },
              { value: 97, suffix: "%", label: "5-Star Reviews" },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: "2.5rem 1rem", textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(139,90,43,0.12)" : "none",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  fontWeight: 700, color: "#8B5A2B", lineHeight: 1, marginBottom: "0.4rem",
                }}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px", color: "#9A7050",
                  letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section style={{ padding: "6rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B5A2B",
              display: "block", marginBottom: "0.8rem", fontWeight: 600,
            }}>Browse By Category</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700, color: "#3D1F08", margin: 0,
            }}>
              Find Your <em style={{ color: "#8B5A2B" }}>Perfect Look</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "2rem 1rem", borderRadius: "20px",
                  background: "rgba(250,243,232,0.8)", border: "1px solid rgba(196,154,108,0.25)",
                  textAlign: "center", cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px) scale(1.03)";
                  el.style.boxShadow = "0 16px 40px rgba(139,90,43,0.2)";
                  el.style.borderColor = "rgba(139,90,43,0.4)";
                  el.style.background = "rgba(250,243,232,0.95)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0) scale(1)";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "rgba(196,154,108,0.25)";
                  el.style.background = "rgba(250,243,232,0.8)";
                }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem", color: "#C49A6C" }}>{cat.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 600, color: "#3D1F08", marginBottom: "4px" }}>{cat.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#A07040" }}>{cat.count} styles</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ── */}
        <section style={{ padding: "2rem 1.5rem 6rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
                letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B5A2B",
                display: "block", marginBottom: "0.6rem", fontWeight: 600,
              }}>Editor's Pick</span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700, color: "#3D1F08", margin: 0,
              }}>
                Featured <em style={{ color: "#8B5A2B" }}>Styles</em>
              </h2>
            </div>
            <Link href="/products" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
              color: "#8B5A2B", textDecoration: "none", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 18px", borderRadius: "30px",
              border: "1.5px solid rgba(139,90,43,0.3)", transition: "all 0.2s",
            }}>
              View all styles →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* ── BRAND BANNER ── */}
        <section style={{
          background: "linear-gradient(135deg, #3D1F08 0%, #6B3F18 50%, #3D1F08 100%)",
          padding: "5rem 1.5rem", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,154,108,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,169,106,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", position: "relative" }}>
            <div>
              <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C49A6C", display: "block", marginBottom: "1rem", fontWeight: 600 }}>
                Our Philosophy
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#FAF3E8", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Dressed With<br /><em style={{ color: "#C49A6C" }}>Intention</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "15px", color: "rgba(250,243,232,0.65)", lineHeight: 1.8, marginBottom: "2rem", fontWeight: 300 }}>
                Every piece in our collection is chosen with care — premium fabrics, thoughtful cuts, and timeless silhouettes that work for real life. We believe getting dressed should feel like a pleasure, not a chore.
              </p>
              <Link href="/about" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 28px", borderRadius: "30px",
                border: "1.5px solid rgba(196,154,108,0.5)",
                color: "#C49A6C", textDecoration: "none",
                fontFamily: "'DM Sans'", fontSize: "14px", fontWeight: 600, transition: "all 0.3s",
              }}>
                Our Story →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { icon: "✦", title: "Premium Fabrics", desc: "Sourced from trusted mills — linen, silk, cotton, and more" },
                { icon: "◈", title: "Free Returns", desc: "Changed your mind? Return within 30 days, no questions asked" },
                { icon: "◉", title: "Size Inclusive", desc: "Styles available from XS to 3XL for every body" },
                { icon: "◇", title: "Sustainable Choices", desc: "We're working toward a more conscious wardrobe, together" },
              ].map((feat) => (
                <div key={feat.title} style={{
                  padding: "1.5rem", borderRadius: "16px",
                  background: "rgba(250,243,232,0.05)", border: "1px solid rgba(196,154,108,0.15)",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: "1.4rem", color: "#C49A6C", marginBottom: "0.6rem" }}>{feat.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 600, color: "#FAF3E8", marginBottom: "0.4rem" }}>{feat.title}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "rgba(250,243,232,0.5)", lineHeight: 1.6 }}>{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: "6rem 1.5rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B5A2B", display: "block", marginBottom: "0.8rem", fontWeight: 600 }}>
            What They're Saying
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#3D1F08", marginBottom: "3rem" }}>
            Loved by <em style={{ color: "#8B5A2B" }}>Thousands</em>
          </h2>

          <div style={{ position: "relative", minHeight: "160px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                position: "absolute", inset: 0,
                opacity: activeTestimonial === i ? 1 : 0,
                transform: activeTestimonial === i ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s ease",
                pointerEvents: activeTestimonial === i ? "auto" : "none",
              }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                  fontStyle: "italic", color: "#3D1F08", lineHeight: 1.7, marginBottom: "1.5rem",
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: "#8B5A2B", fontWeight: 600 }}>
                  {t.author}
                  <span style={{ color: "#A07040", fontWeight: 400, marginLeft: "6px" }}>— {t.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2.5rem" }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                width: activeTestimonial === i ? "24px" : "8px", height: "8px",
                borderRadius: "4px", border: "none", cursor: "pointer",
                background: activeTestimonial === i ? "linear-gradient(135deg, #8B5A2B, #C49A6C)" : "rgba(139,90,43,0.2)",
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{
          margin: "0 1.5rem 6rem", borderRadius: "28px",
          background: "linear-gradient(135deg, rgba(196,154,108,0.15) 0%, rgba(139,90,43,0.08) 100%)",
          border: "1px solid rgba(196,154,108,0.3)", padding: "4rem 3rem",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,154,108,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
          <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B5A2B", display: "block", marginBottom: "1rem", fontWeight: 600 }}>
            ✦ &nbsp;This Week Only &nbsp;✦
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "#3D1F08", marginBottom: "1rem" }}>
            Free Shipping on<br /><em style={{ color: "#8B5A2B" }}>All Orders This Week</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "15px", color: "#6B4520", marginBottom: "2.5rem", fontWeight: 300 }}>
            No minimum spend. Same-day dispatch on orders before 12PM.
          </p>
          <Link href="/products" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "15px 36px", borderRadius: "50px",
            background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
            color: "#FAF3E8", textDecoration: "none",
            fontFamily: "'DM Sans'", fontSize: "15px", fontWeight: 600,
            boxShadow: "0 8px 28px rgba(139,90,43,0.35)",
          }}>
            Shop Now →
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#2D1A08", padding: "4rem 1.5rem 2rem", color: "rgba(250,243,232,0.55)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#FAF3E8", marginBottom: "1rem" }}>
                  Lumi<span style={{ color: "#C49A6C", fontStyle: "italic" }}>è</span>re
                </div>
                <p style={{ fontFamily: "'DM Sans'", fontSize: "13px", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  Curated fashion for the intentional dresser. Premium pieces, honest prices, and style that lasts beyond the season.
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["Instagram", "Pinterest", "TikTok"].map((s) => (
                    <a key={s} href="#" style={{
                      padding: "6px 14px", borderRadius: "20px",
                      border: "1px solid rgba(196,154,108,0.2)",
                      fontSize: "11px", color: "rgba(250,243,232,0.5)",
                      textDecoration: "none", fontFamily: "'DM Sans'", transition: "all 0.2s",
                    }}>{s}</a>
                  ))}
                </div>
              </div>

              {[
                { title: "Shop", links: ["All Products", "Dresses", "Tops", "Bottoms", "Outerwear", "Sale"] },
                { title: "Help", links: ["Size Guide", "Shipping Info", "Returns", "Track Order", "FAQ"] },
                { title: "Company", links: ["About Us", "Sustainability", "Careers", "Blog", "Contact"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 style={{ fontFamily: "'DM Sans'", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,243,232,0.7)", marginBottom: "1.2rem", fontWeight: 600 }}>
                    {col.title}
                  </h4>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{
                      display: "block", fontFamily: "'DM Sans'", fontSize: "13px",
                      color: "rgba(250,243,232,0.45)", textDecoration: "none",
                      marginBottom: "0.6rem", transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C49A6C")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,243,232,0.45)")}
                    >{link}</a>
                  ))}
                </div>
              ))}
            </div>

            <div style={{
              borderTop: "1px solid rgba(250,243,232,0.08)", paddingTop: "1.5rem",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
            }}>
              <span style={{ fontFamily: "'DM Sans'", fontSize: "12px" }}>© 2026 Lumière. All rights reserved.</span>
              <span style={{ fontFamily: "'DM Sans'", fontSize: "12px" }}>Made with care in Indonesia 🇮🇩</span>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatRing {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-20px) rotate(8deg); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          footer div[style*="grid-template-columns: 2fr"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}