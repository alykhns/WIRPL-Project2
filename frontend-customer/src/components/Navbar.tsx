"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: ["Our Story", "Artisans", "Sustainability"],
  },
  {
    label: "Collection",
    href: "/products",
    children: ["Rings", "Earrings", "Necklaces", "Bracelets"],
  },
  {
    label: "Customization",
    href: "/customization",
    children: ["Engrave", "Design Your Own", "Gift Wrapping"],
  },
  {
    label: "Materials",
    href: "/materials",
    children: ["Gold", "Silver", "Diamonds", "Gemstones"],
  },
  { label: "My Orders", href: "/orders" },   // ← tambah ini
  { label: "Track Package", href: "/track" }, // ← dan ini
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cartCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.4s ease",
          background: scrolled
            ? "rgba(245, 237, 220, 0.82)"
            : "rgba(245, 237, 220, 0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: scrolled
            ? "1px solid rgba(139, 90, 43, 0.18)"
            : "1px solid rgba(139, 90, 43, 0.08)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(101, 60, 20, 0.10)"
            : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 2rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 60%, #D4A96A 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(139, 90, 43, 0.3)",
              }}
            >
              <span
                style={{
                  color: "#FAF3E8",
                  fontSize: "16px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                L
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#4A2E12",
                letterSpacing: "0.5px",
              }}
            >
              Lumière
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <li
                key={link.label}
                style={{ position: "relative" }}
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#5C3A1E",
                    transition: "all 0.2s",
                    background:
                      activeDropdown === link.label
                        ? "rgba(139, 90, 43, 0.10)"
                        : "transparent",
                    letterSpacing: "0.1px",
                  }}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      size={13}
                      style={{
                        color: "#8B5A2B",
                        transform:
                          activeDropdown === link.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.25s",
                      }}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(250, 243, 232, 0.95)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(139, 90, 43, 0.15)",
                      borderRadius: "14px",
                      padding: "8px",
                      minWidth: "170px",
                      boxShadow:
                        "0 8px 32px rgba(101, 60, 20, 0.15), 0 2px 8px rgba(101, 60, 20, 0.08)",
                      animation: "dropIn 0.2s ease",
                    }}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child}
                        href={`${link.href}/${child
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                        style={{
                          display: "block",
                          padding: "8px 14px",
                          borderRadius: "9px",
                          textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          color: "#5C3A1E",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background =
                            "rgba(139, 90, 43, 0.10)";
                          (e.target as HTMLElement).style.color = "#3D1F08";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background =
                            "transparent";
                          (e.target as HTMLElement).style.color = "#5C3A1E";
                        }}
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right Side - Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "20px",
                border: "1.5px solid rgba(139, 90, 43, 0.35)",
                background: "rgba(250, 243, 232, 0.6)",
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "#4A2E12",
                transition: "all 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(139, 90, 43, 0.12)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(139, 90, 43, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(250, 243, 232, 0.6)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(139, 90, 43, 0.35)";
              }}
            >
              <ShoppingCart size={15} />
              <span>My Cart</span>
              {cartCount > 0 && (
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                    color: "#FAF3E8",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4A2E12",
                padding: "4px",
              }}
              className="mobile-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              background: "rgba(250, 243, 232, 0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(139, 90, 43, 0.12)",
              padding: "1rem 1.5rem 1.5rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(139, 90, 43, 0.08)",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  color: "#4A2E12",
                  fontWeight: 500,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}