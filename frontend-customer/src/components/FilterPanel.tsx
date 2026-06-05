"use client";

import { useState, useCallback } from "react";
import { SlidersHorizontal, ChevronDown, X, RotateCcw, Check } from "lucide-react";

export interface FilterState {
  priceMin: number;
  priceMax: number;
  sortBy: string;
}

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void;
  variant?: "sidebar" | "drawer" | "inline";
  className?: string;
}

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "popular",  label: "Most Popular" },
];

const DEFAULT_FILTERS: FilterState = {
  priceMin: 0,
  priceMax: 5000,
  sortBy: "newest",
};

function AccordionSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(196, 154, 108, 0.18)",
        paddingBottom: open ? "16px" : "0",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#3D1F08",
          letterSpacing: "0.2px",
        }}
      >
        {title}
        <ChevronDown
          size={15}
          color="#8B5A2B"
          style={{
            transition: "transform 0.25s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function FilterPanel({
  onFilterChange,
  variant = "sidebar",
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = useCallback(
    (partial: Partial<FilterState>) => {
      const next = { ...filters, ...partial };
      setFilters(next);
      onFilterChange?.(next);
    },
    [filters, onFilterChange]
  );

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange?.(DEFAULT_FILTERS);
  };

  const activeCount =
    (filters.priceMin > 0 || filters.priceMax < 5000 ? 1 : 0);

  const panelStyle: React.CSSProperties = {
    background: "rgba(250, 243, 232, 0.80)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(196, 154, 108, 0.28)",
    borderRadius: "20px",
    padding: "20px 20px 8px",
    fontFamily: "'DM Sans', sans-serif",
    width: variant === "sidebar" ? "260px" : "100%",
    minWidth: variant === "sidebar" ? "240px" : undefined,
    boxShadow: "0 4px 24px rgba(101, 60, 20, 0.09)",
  };

  const PanelContent = () => (
    <div style={panelStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SlidersHorizontal size={16} color="#8B5A2B" />
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#3D1F08",
            }}
          >
            Filters
          </span>
          {activeCount > 0 && (
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                color: "#FAF3E8",
                fontSize: "10px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#A07040",
              fontFamily: "'DM Sans', sans-serif",
              padding: "3px 6px",
              borderRadius: "8px",
              transition: "color 0.15s",
            }}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <AccordionSection title="Sort By" defaultOpen={true}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ sortBy: opt.value })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background:
                  filters.sortBy === opt.value
                    ? "rgba(139, 90, 43, 0.10)"
                    : "transparent",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: filters.sortBy === opt.value ? 600 : 400,
                color: filters.sortBy === opt.value ? "#3D1F08" : "#6B4520",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              {opt.label}
              {filters.sortBy === opt.value && (
                <Check size={12} color="#8B5A2B" />
              )}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Price Range */}
      <AccordionSection title="Price Range" defaultOpen={true}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#4A2E12",
                background: "rgba(139, 90, 43, 0.08)",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(139, 90, 43, 0.15)",
              }}
            >
              ${filters.priceMin.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#4A2E12",
                background: "rgba(139, 90, 43, 0.08)",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(139, 90, 43, 0.15)",
              }}
            >
              ${filters.priceMax.toLocaleString()}
            </span>
          </div>
          <div style={{ padding: "0 2px" }}>
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={filters.priceMin}
              onChange={(e) =>
                update({
                  priceMin: Math.min(Number(e.target.value), filters.priceMax - 50),
                })
              }
              style={{
                width: "100%",
                marginBottom: "8px",
                accentColor: "#8B5A2B",
                cursor: "pointer",
              }}
            />
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={filters.priceMax}
              onChange={(e) =>
                update({
                  priceMax: Math.max(Number(e.target.value), filters.priceMin + 50),
                })
              }
              style={{
                width: "100%",
                accentColor: "#8B5A2B",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </AccordionSection>

      {/* Apply Button (inline/drawer variant) */}
      {variant !== "sidebar" && (
        <button
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
            color: "#FAF3E8",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            marginTop: "12px",
            marginBottom: "8px",
            boxShadow: "0 3px 12px rgba(139, 90, 43, 0.28)",
            transition: "all 0.2s",
          }}
          onClick={() => setDrawerOpen(false)}
        >
          Apply Filters {activeCount > 0 ? `(${activeCount})` : ""}
        </button>
      )}
    </div>
  );

  if (variant === "drawer") {
    return (
      <>
        {/* Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 18px",
            borderRadius: "20px",
            border: "1.5px solid rgba(139, 90, 43, 0.35)",
            background: "rgba(250, 243, 232, 0.7)",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13.5px",
            fontWeight: 500,
            color: "#4A2E12",
          }}
        >
          <SlidersHorizontal size={15} color="#8B5A2B" />
          Filters
          {activeCount > 0 && (
            <span
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                color: "#FAF3E8",
                fontSize: "10px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeCount}
            </span>
          )}
        </button>

        {/* Drawer overlay */}
        {drawerOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              display: "flex",
            }}
          >
            <div
              onClick={() => setDrawerOpen(false)}
              style={{
                flex: 1,
                background: "rgba(62, 31, 8, 0.35)",
                backdropFilter: "blur(3px)",
              }}
            />
            <div
              style={{
                width: "300px",
                overflowY: "auto",
                background: "#FAF3E8",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "8px",
                }}
              >
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8B5A2B",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <PanelContent />
            </div>
          </div>
        )}
      </>
    );
  }

  return <PanelContent />;
}