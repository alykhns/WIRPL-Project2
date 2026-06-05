"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { useApp } from "@/lib/context";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: ["Our Story", "Artisans", "Sustainability"],
  },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount, user, logout } = useApp();

  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.getElementById("user-menu-anchor");
      if (el && !el.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          transition: "all 0.4s ease",
          background: scrolled ? "rgba(245,237,220,0.88)" : "rgba(245,237,220,0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: scrolled ? "1px solid rgba(139,90,43,0.18)" : "1px solid rgba(139,90,43,0.08)",
          boxShadow: scrolled ? "0 4px 32px rgba(101,60,20,0.10)" : "none",
        }}
      >
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "0 2rem", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 60%, #D4A96A 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(139,90,43,0.3)",
            }}>
              <span style={{ color: "#FAF3E8", fontSize: "16px", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>L</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#4A2E12", letterSpacing: "0.5px" }}>
              Lumière
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul style={{ display: "flex", alignItems: "center", gap: "0.25rem", listStyle: "none", margin: 0, padding: 0 }} className="desktop-nav">
            {navLinks.map((link) => (
              <li key={link.label} style={{ position: "relative" }}
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={link.href} style={{
                  display: "flex", alignItems: "center", gap: "3px",
                  padding: "6px 12px", borderRadius: "20px", textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 500,
                  color: "#5C3A1E", transition: "all 0.2s", letterSpacing: "0.1px",
                  background: activeDropdown === link.label ? "rgba(139,90,43,0.10)" : "transparent",
                }}>
                  {link.label}
                  {link.children && (
                    <ChevronDown size={13} style={{
                      color: "#8B5A2B",
                      transform: activeDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s",
                    }} />
                  )}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(250,243,232,0.95)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(139,90,43,0.15)", borderRadius: "14px",
                    padding: "8px", minWidth: "170px",
                    boxShadow: "0 8px 32px rgba(101,60,20,0.15)",
                    animation: "dropIn 0.2s ease",
                  }}>
                    {link.children.map((child) => (
                      <Link key={child} href={`${link.href}/${child.toLowerCase().replace(/\s/g, "-")}`}
                        style={{ display: "block", padding: "8px 14px", borderRadius: "9px", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#5C3A1E", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(139,90,43,0.10)"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                      >{child}</Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

            {/* Cart button */}
            <Link href="/cart" style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 18px", borderRadius: "20px",
              border: "1.5px solid rgba(139,90,43,0.35)",
              background: "rgba(250,243,232,0.6)", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 500,
              color: "#4A2E12", transition: "all 0.2s", position: "relative",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(139,90,43,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,90,43,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(250,243,232,0.6)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,90,43,0.35)"; }}
            >
              <ShoppingCart size={15} />
              <span>Cart</span>
              {mounted && cartCount > 0 && (
                <span style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                  color: "#FAF3E8", fontSize: "10px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth area */}
            {mounted && (
              user ? (
                // ── User menu ──
                <div id="user-menu-anchor" style={{ position: "relative" }}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "7px 14px", borderRadius: "20px",
                    border: "1.5px solid rgba(139,90,43,0.3)",
                    background: "rgba(139,90,43,0.08)", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600,
                    color: "#5C3A1E", transition: "all 0.2s",
                  }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ color: "#FAF3E8", fontSize: "11px", fontWeight: 700 }}>
                        {user.username?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <span className="desktop-only">{user.username}</span>
                    <ChevronDown size={12} style={{ color: "#8B5A2B", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0,
                      background: "rgba(250,243,232,0.97)", backdropFilter: "blur(20px)",
                      border: "1px solid rgba(139,90,43,0.15)", borderRadius: "16px",
                      padding: "8px", minWidth: "200px",
                      boxShadow: "0 12px 40px rgba(101,60,20,0.18)",
                      animation: "dropIn 0.2s ease",
                    }}>
                      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(139,90,43,0.1)", marginBottom: "6px" }}>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: 600, color: "#3D1F08" }}>{user.username}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: "#9A7050" }}>{user.email}</div>
                      </div>

                      {[
                        { icon: <User size={14} />, label: "My Profile", href: "/profile" },
                        { icon: <ShoppingCart size={14} />, label: "My Orders", href: "/orders" },
                      ].map((item) => (
                        <Link key={item.label} href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 14px", borderRadius: "9px", textDecoration: "none", fontFamily: "'DM Sans'", fontSize: "13px", color: "#5C3A1E", transition: "background 0.15s" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(139,90,43,0.08)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <span style={{ color: "#8B5A2B" }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <div style={{ borderTop: "1px solid rgba(139,90,43,0.1)", marginTop: "6px", paddingTop: "6px" }}>
                        <button onClick={handleLogout} style={{
                          display: "flex", alignItems: "center", gap: "9px",
                          width: "100%", padding: "9px 14px", borderRadius: "9px",
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "'DM Sans'", fontSize: "13px", color: "#c0392b",
                          transition: "background 0.15s",
                        }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.07)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // ── Auth buttons ──
                <div style={{ display: "flex", gap: "8px" }} className="desktop-nav">
                  <Link href="/login" style={{
                    padding: "8px 18px", borderRadius: "20px",
                    border: "1.5px solid rgba(139,90,43,0.3)",
                    background: "transparent", textDecoration: "none",
                    fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: 500, color: "#5C3A1E",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(139,90,43,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >Sign In</Link>
                  <Link href="/register" style={{
                    padding: "8px 18px", borderRadius: "20px",
                    background: "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                    textDecoration: "none",
                    fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: 600, color: "#FAF3E8",
                    boxShadow: "0 4px 14px rgba(139,90,43,0.3)", transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 18px rgba(139,90,43,0.4)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(139,90,43,0.3)"; }}
                  >Join Free</Link>
                </div>
              )
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{
              display: "none", background: "none", border: "none",
              cursor: "pointer", color: "#4A2E12", padding: "4px",
            }} className="mobile-toggle">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: "rgba(250,243,232,0.97)", backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(139,90,43,0.12)",
            padding: "1rem 1.5rem 1.5rem",
          }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "10px 0", borderBottom: "1px solid rgba(139,90,43,0.08)", textDecoration: "none", fontFamily: "'DM Sans'", fontSize: "15px", color: "#4A2E12", fontWeight: 500 }}>
                {link.label}
              </Link>
            ))}
            {mounted && !user && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", border: "1.5px solid rgba(139,90,43,0.3)", color: "#5C3A1E", textDecoration: "none", fontFamily: "'DM Sans'", fontSize: "14px", fontWeight: 500 }}>Sign In</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg, #8B5A2B, #C49A6C)", color: "#FAF3E8", textDecoration: "none", fontFamily: "'DM Sans'", fontSize: "14px", fontWeight: 600 }}>Join Free</Link>
              </div>
            )}
            {mounted && user && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ padding: "10px 0", color: "#8B5A2B", fontFamily: "'DM Sans'", fontSize: "14px", fontWeight: 600 }}>👤 {user.username}</div>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ background: "none", border: "none", color: "#c0392b", fontFamily: "'DM Sans'", fontSize: "14px", cursor: "pointer", padding: "8px 0" }}>
                  Sign Out
                </button>
              </div>
            )}
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
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
}