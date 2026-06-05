"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, SlidersHorizontal } from "lucide-react";

const SUGGESTIONS = [
  "Diamond rings",
  "Gold earrings",
  "Silver necklace",
  "Couple rings",
  "Engagement rings",
  "Bracelets",
  "Gemstone pendants",
  "Wedding bands",
];

interface SearchBarProps {
  placeholder?: string;
  variant?: "default" | "hero" | "compact";
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search jewellery...",
  variant = "default",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterInStock, setFilterInStock] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredSuggestions = SUGGESTIONS.filter(
    (s) => query && s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = useCallback(
    (value: string = query) => {
      if (!value.trim()) return;
      setLoading(true);
      const params = new URLSearchParams({ search: value });
      if (filterCategory !== "All") params.set("category", filterCategory);
      if (filterInStock) params.set("in_stock", "true");
      setTimeout(() => {
        setLoading(false);
        setFocused(false);
        if (onSearch) {
          onSearch(value);
        } else {
          router.push(`/products?${params.toString()}`);
        }
      }, 400);
    },
    [query, filterCategory, filterInStock, onSearch, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const categories = ["All", "Rings", "Earrings", "Necklaces", "Bracelets"];

  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: isHero ? "640px" : isCompact ? "280px" : "480px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Main Search Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: focused
            ? "rgba(250, 243, 232, 0.92)"
            : "rgba(250, 243, 232, 0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: focused
            ? "1.5px solid rgba(139, 90, 43, 0.45)"
            : "1.5px solid rgba(196, 154, 108, 0.3)",
          borderRadius: focused && (filteredSuggestions.length > 0 || showFilter)
            ? "18px 18px 0 0"
            : "50px",
          padding: isHero
            ? "14px 18px"
            : isCompact
            ? "9px 14px"
            : "11px 16px",
          boxShadow: focused
            ? "0 8px 32px rgba(101, 60, 20, 0.16), 0 2px 8px rgba(101, 60, 20, 0.08)"
            : "0 2px 12px rgba(101, 60, 20, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Search Icon */}
        <div style={{ flexShrink: 0 }}>
          {loading ? (
            <Loader2
              size={isHero ? 20 : 16}
              color="#8B5A2B"
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Search
              size={isHero ? 20 : 16}
              color={focused ? "#6B3F18" : "#A07040"}
              style={{ transition: "color 0.2s" }}
            />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isHero ? "16px" : isCompact ? "13px" : "14px",
            color: "#3D1F08",
            fontWeight: 400,
          }}
        />

        {/* Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#9A7050",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          )}

          {!isCompact && (
            <button
              onClick={() => setShowFilter(!showFilter)}
              style={{
                background: showFilter
                  ? "rgba(139, 90, 43, 0.12)"
                  : "transparent",
                border: "1px solid rgba(139, 90, 43, 0.2)",
                borderRadius: "10px",
                cursor: "pointer",
                padding: "5px 7px",
                color: showFilter ? "#6B3F18" : "#9A7050",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s",
              }}
            >
              <SlidersHorizontal size={13} />
            </button>
          )}

          <button
            onClick={() => handleSearch()}
            style={{
              padding: isHero ? "8px 20px" : "6px 14px",
              borderRadius: "30px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
              color: "#FAF3E8",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isHero ? "14px" : "12px",
              fontWeight: 600,
              boxShadow: "0 2px 10px rgba(139, 90, 43, 0.3)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(139, 90, 43, 0.45)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 10px rgba(139, 90, 43, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Dropdown Panel */}
      {focused && (filteredSuggestions.length > 0 || showFilter) && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(250, 243, 232, 0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(139, 90, 43, 0.25)",
            borderTop: "none",
            borderRadius: "0 0 18px 18px",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(101, 60, 20, 0.16)",
            zIndex: 50,
          }}
        >
          {/* Filter Panel */}
          {showFilter && (
            <div
              style={{
                padding: "12px 16px",
                borderBottom: filteredSuggestions.length > 0
                  ? "1px solid rgba(139, 90, 43, 0.1)"
                  : "none",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#8B5A2B",
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                }}
              >
                Filter by Category
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor:
                        filterCategory === cat
                          ? "rgba(139, 90, 43, 0.5)"
                          : "rgba(196, 154, 108, 0.3)",
                      background:
                        filterCategory === cat
                          ? "rgba(139, 90, 43, 0.12)"
                          : "transparent",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: filterCategory === cat ? 600 : 400,
                      color: filterCategory === cat ? "#4A2E12" : "#8B6240",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#5C3A1E",
                }}
              >
                <input
                  type="checkbox"
                  checked={filterInStock}
                  onChange={(e) => setFilterInStock(e.target.checked)}
                  style={{ accentColor: "#8B5A2B" }}
                />
                In stock only
              </label>
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div style={{ padding: "6px 8px" }}>
              <p
                style={{
                  margin: "6px 8px 4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#8B5A2B",
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                }}
              >
                Suggestions
              </p>
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onMouseDown={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13.5px",
                    color: "#3D1F08",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(139, 90, 43, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <Search size={13} color="#A07040" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}