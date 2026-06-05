"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import { SlidersHorizontal, Grid3X3, LayoutList, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isSale: boolean;
  stock: number;
  imageUrl?: string;
}

// ── Mock fallback ─────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: ["Eternal Bloom Ring", "Cascade Gold Earrings", "Celestial Necklace", "Moonlit Bracelet", "Stardust Pendant", "Rose Quartz Ring"][i % 6],
  category: ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants", "Rings"][i % 6],
  price: [1299, 489, 749, 389, 299, 899][i % 6],
  originalPrice: i % 3 === 0 ? [1599, 0, 920, 0, 0, 1100][i % 6] || undefined : undefined,
  rating: 4.2 + (i % 8) * 0.1,
  reviewCount: 80 + i * 23,
  isSale: i % 3 === 0,
  stock: i % 5 === 0 ? 2 : 15,
}));

const BREADCRUMB_LABELS: Record<string, string> = {
  rings: "Rings", earrings: "Earrings", necklaces: "Necklaces",
  bracelets: "Bracelets", pendants: "Pendants", couple: "Couple Rings",
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [], priceMin: 0, priceMax: 5000,
    rating: null, materials: [], inStock: false, onSale: false, sortBy: "newest",
  });

  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const ITEMS_PER_PAGE = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (categoryParam) params.set("category", categoryParam);
      if (filters.inStock) params.set("in_stock", "true");
      if (filters.sortBy) params.set("sort", filters.sortBy);
      params.set("limit", String(ITEMS_PER_PAGE));
      params.set("offset", String((page - 1) * ITEMS_PER_PAGE));

      const res = await fetch(`http://localhost:3000/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const arr = Array.isArray(data) ? data : data.products ?? [];
      const mapped: Product[] = arr.map((p: any) => ({
        id: p.product_id,
        name: p.product_name,
        category: p.category_name ?? p.category ?? "Jewellery",
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        rating: p.rating ?? 4.5,
        reviewCount: p.review_count ?? 0,
        isSale: !!p.is_sale || !!p.original_price,
        stock: p.stock ?? 99,
        imageUrl: p.image_url,
      }));

      // client-side price filter (API may not support it)
      const filtered = mapped.filter(p =>
        p.price >= filters.priceMin && p.price <= filters.priceMax &&
        (!filters.rating || p.rating >= filters.rating) &&
        (!filters.onSale || p.isSale)
      );

      setProducts(filtered);
      setTotalCount(data.total ?? filtered.length);
    } catch {
      // fallback to mock
      let mock = [...MOCK_PRODUCTS];
      if (searchQuery) mock = mock.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (categoryParam) mock = mock.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
      if (filters.categories.length) mock = mock.filter(p => filters.categories.includes(p.category));
      if (filters.inStock) mock = mock.filter(p => p.stock > 0);
      if (filters.onSale) mock = mock.filter(p => p.isSale);
      if (filters.rating) mock = mock.filter(p => p.rating >= filters.rating!);
      mock = mock.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);
      if (filters.sortBy === "price_asc") mock.sort((a, b) => a.price - b.price);
      if (filters.sortBy === "price_desc") mock.sort((a, b) => b.price - a.price);
      if (filters.sortBy === "rating") mock.sort((a, b) => b.rating - a.rating);
      setProducts(mock);
      setTotalCount(mock.length);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryParam, filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const pageTitle = categoryParam
    ? BREADCRUMB_LABELS[categoryParam] ?? categoryParam
    : searchQuery ? `"${searchQuery}"` : "All Products";

  return (
    <>
      <Navbar />

      <main style={{ background: "#FAF3E8", minHeight: "100vh", paddingTop: "64px" }}>

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(139,90,43,0.06) 0%, rgba(196,154,108,0.04) 100%)",
          borderBottom: "1px solid rgba(139,90,43,0.1)",
          padding: "2.5rem 1.5rem",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            {/* Breadcrumb */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
              color: "#A07040", marginBottom: "1rem",
            }}>
              <a href="/" style={{ color: "#A07040", textDecoration: "none" }}>Home</a>
              <span>›</span>
              <span style={{ color: "#3D1F08", fontWeight: 500 }}>
                {categoryParam ? BREADCRUMB_LABELS[categoryParam] ?? "Products" : "Products"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700, color: "#3D1F08", margin: 0, lineHeight: 1.1,
                }}>
                  {searchQuery ? <>Results for <em style={{ color: "#8B5A2B" }}>{searchQuery}</em></> : pageTitle}
                </h1>
                {!loading && (
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: "#A07040", marginTop: "0.4rem" }}>
                    {totalCount} {totalCount === 1 ? "piece" : "pieces"} found
                  </p>
                )}
              </div>

              {/* Search bar */}
              <div style={{ minWidth: "280px" }}>
                <SearchBar variant="compact" placeholder="Search collection..." />
              </div>
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ──────────────────────────────────────────────────── */}
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(139,90,43,0.08)",
        }}>
          {/* Mobile filter trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 16px", borderRadius: "20px",
              border: "1.5px solid rgba(139,90,43,0.3)",
              background: "rgba(250,243,232,0.8)",
              cursor: "pointer", fontFamily: "'DM Sans'",
              fontSize: "13px", fontWeight: 500, color: "#4A2E12",
            }}
            className="mobile-filter-btn"
          >
            <SlidersHorizontal size={14} color="#8B5A2B" />
            Filters
          </button>

          {/* View toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#A07040", marginRight: "4px" }}>View:</span>
            {[
              { mode: "grid" as const, Icon: Grid3X3 },
              { mode: "list" as const, Icon: LayoutList },
            ].map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                width: "34px", height: "34px", borderRadius: "10px",
                border: "1px solid rgba(139,90,43,0.2)",
                background: viewMode === mode ? "rgba(139,90,43,0.1)" : "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                <Icon size={15} color={viewMode === mode ? "#6B3F18" : "#A07040"} />
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "1.5rem",
          display: "flex", gap: "1.5rem", alignItems: "flex-start",
        }}>

          {/* Sidebar filter — desktop */}
          <div style={{ flexShrink: 0 }} className="desktop-filter">
            <FilterPanel
              variant="sidebar"
              onFilterChange={(f) => { setFilters(f); setPage(1); }}
            />
          </div>

          {/* Mobile filter drawer */}
          {mobileFilterOpen && (
            <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
              <div
                onClick={() => setMobileFilterOpen(false)}
                style={{ flex: 1, background: "rgba(62,31,8,0.4)", backdropFilter: "blur(3px)" }}
              />
              <div style={{ width: "300px", overflowY: "auto", background: "#FAF3E8", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                  <button onClick={() => setMobileFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#8B5A2B" }}>✕</button>
                </div>
                <FilterPanel variant="inline" onFilterChange={(f) => { setFilters(f); setPage(1); setMobileFilterOpen(false); }} />
              </div>
            </div>
          )}

          {/* Products area */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {loading ? (
              /* Loading skeleton */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 0", gap: "1rem" }}>
                <Loader2 size={32} color="#C49A6C" style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: "#A07040" }}>Loading collection...</p>
              </div>
            ) : products.length === 0 ? (
              /* Empty state */
              <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>◇</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#3D1F08", marginBottom: "0.5rem" }}>No pieces found</h3>
                <p style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: "#A07040" }}>
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: viewMode === "grid"
                    ? "repeat(auto-fill, minmax(240px, 1fr))"
                    : "1fr",
                  gap: viewMode === "grid" ? "1.2rem" : "0.8rem",
                }}>
                  {products.map((product) => (
                    viewMode === "grid" ? (
                      <ProductCard key={product.id} {...product} />
                    ) : (
                      /* List view */
                      <div key={product.id} style={{
                        display: "flex", gap: "1.2rem", alignItems: "center",
                        padding: "1rem 1.2rem",
                        background: "rgba(250,243,232,0.8)",
                        border: "1px solid rgba(196,154,108,0.2)",
                        borderRadius: "16px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(139,90,43,0.12)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,90,43,0.35)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,154,108,0.2)";
                      }}
                      >
                        <div style={{
                          width: "80px", height: "80px", borderRadius: "12px", flexShrink: 0,
                          background: "linear-gradient(135deg, #F5EDDC, #EDE0C8)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.8rem", color: "rgba(139,90,43,0.3)",
                        }}>◎</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#A07040", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{product.category}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 600, color: "#3D1F08", marginBottom: "4px" }}>{product.name}</div>
                          <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
                            {[1,2,3,4,5].map(s => (
                              <span key={s} style={{ fontSize: "11px", color: s <= Math.floor(product.rating) ? "#C49A6C" : "#D4B896" }}>★</span>
                            ))}
                            <span style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#9A7050", marginLeft: "4px" }}>({product.reviewCount})</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: "18px", fontWeight: 700, color: "#4A2E12" }}>${product.price.toLocaleString()}</div>
                          {product.originalPrice && (
                            <div style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: "#B09070", textDecoration: "line-through" }}>${product.originalPrice.toLocaleString()}</div>
                          )}
                          {product.stock <= 5 && <div style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#A05020", marginTop: "3px" }}>Only {product.stock} left</div>}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    gap: "8px", marginTop: "3rem", flexWrap: "wrap",
                  }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        padding: "8px 18px", borderRadius: "20px",
                        border: "1.5px solid rgba(139,90,43,0.3)",
                        background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer",
                        fontFamily: "'DM Sans'", fontSize: "13px", color: page === 1 ? "#C4A882" : "#4A2E12",
                        opacity: page === 1 ? 0.5 : 1, transition: "all 0.2s",
                      }}
                    >← Prev</button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => (
                        <>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span key={`ellipsis-${p}`} style={{ color: "#A07040", fontFamily: "'DM Sans'" }}>…</span>
                          )}
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            style={{
                              width: "38px", height: "38px", borderRadius: "50%",
                              border: "1.5px solid",
                              borderColor: page === p ? "#8B5A2B" : "rgba(139,90,43,0.25)",
                              background: page === p
                                ? "linear-gradient(135deg, #8B5A2B, #C49A6C)"
                                : "transparent",
                              cursor: "pointer",
                              fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: page === p ? 600 : 400,
                              color: page === p ? "#FAF3E8" : "#4A2E12",
                              transition: "all 0.2s",
                            }}
                          >{p}</button>
                        </>
                      ))
                    }

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{
                        padding: "8px 18px", borderRadius: "20px",
                        border: "1.5px solid rgba(139,90,43,0.3)",
                        background: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer",
                        fontFamily: "'DM Sans'", fontSize: "13px", color: page === totalPages ? "#C4A882" : "#4A2E12",
                        opacity: page === totalPages ? 0.5 : 1, transition: "all 0.2s",
                      }}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .desktop-filter { display: block; }
        .mobile-filter-btn { display: none; }

        @media (max-width: 900px) {
          .desktop-filter { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}