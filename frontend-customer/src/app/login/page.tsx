"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";

const API = "http://localhost:3000/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useApp();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (user) router.replace("/"); }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal");
      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #FAF3E8;
        }
        @media (max-width: 768px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-panel { display: none !important; }
        }

        .auth-panel {
          background: linear-gradient(160deg, #3D1F08 0%, #6B3F18 50%, #8B5A2B 100%);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem;
          position: relative; overflow: hidden;
        }
        .auth-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 50% at 30% 40%, rgba(196,154,108,0.18) 0%, transparent 60%);
        }
        .panel-logo {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem; font-weight: 700;
          color: #FAF3E8; letter-spacing: -1px;
          position: relative; margin-bottom: 1.5rem;
        }
        .panel-logo em { color: #C49A6C; font-style: italic; }
        .panel-tagline {
          color: rgba(250,243,232,0.6);
          font-size: 15px; line-height: 1.8;
          text-align: center; max-width: 300px;
          font-weight: 300; position: relative;
        }
        .panel-circles span {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(196,154,108,0.15);
          animation: spinSlow 20s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .auth-form-side {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 2rem;
        }
        .form-card {
          width: 100%; max-width: 420px;
        }
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #8B5A2B; text-decoration: none;
          margin-bottom: 2.5rem; font-weight: 500;
          transition: gap 0.2s;
        }
        .back-link:hover { gap: 10px; }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 700;
          color: #3D1F08; margin-bottom: 0.4rem;
        }
        .form-subtitle {
          font-size: 14px; color: #9A7050;
          margin-bottom: 2.5rem; font-weight: 300;
        }

        .field-group { margin-bottom: 1.2rem; }
        .field-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #5C3A1E; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 0.5rem;
        }
        .field-input {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid rgba(139,90,43,0.2);
          border-radius: 12px; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: rgba(250,243,232,0.5);
          color: #3D1F08; outline: none;
          transition: all 0.2s;
        }
        .field-input:focus {
          border-color: #8B5A2B;
          background: rgba(250,243,232,0.9);
          box-shadow: 0 0 0 3px rgba(139,90,43,0.08);
        }
        .field-input::placeholder { color: rgba(139,90,43,0.35); }

        .error-box {
          background: rgba(220,38,38,0.06);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; color: #c0392b;
          margin-bottom: 1.2rem;
          display: flex; align-items: center; gap: 8px;
        }

        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%);
          border: none; border-radius: 12px;
          color: #FAF3E8; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 6px 20px rgba(139,90,43,0.3);
          letter-spacing: 0.02em;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(139,90,43,0.4);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 1.6rem 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1;
          height: 1px; background: rgba(139,90,43,0.15);
        }
        .divider span { font-size: 12px; color: #A07040; white-space: nowrap; }

        .switch-link {
          text-align: center; font-size: 13px; color: #9A7050;
        }
        .switch-link a {
          color: #8B5A2B; font-weight: 600; text-decoration: none;
        }
        .switch-link a:hover { text-decoration: underline; }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(250,243,232,0.3);
          border-top-color: #FAF3E8; border-radius: 50%;
          animation: spin 0.7s linear infinite; vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="auth-root">
        {/* ── Left decorative panel ── */}
        <div className="auth-panel">
          <div className="panel-circles">
            <span style={{ width: 400, height: 400, top: "-100px", left: "-100px" }} />
            <span style={{ width: 250, height: 250, bottom: "-60px", right: "-60px", animationDirection: "reverse" }} />
          </div>
          <div className="panel-logo">Lumi<em>è</em>re</div>
          <p className="panel-tagline">
            Style that speaks for you — curated fashion pieces in premium fabrics.
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%", maxWidth: "260px", position: "relative" }}>
            {["✦  Premium fabrics", "◈  Free 30-day returns", "◉  Size inclusive XS–3XL"].map((f) => (
              <div key={f} style={{ color: "rgba(250,243,232,0.55)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>{f}</div>
            ))}
          </div>
        </div>

        {/* ── Right form side ── */}
        <div className="auth-form-side">
          <div className="form-card">
            <Link href="/" className="back-link">← Back to store</Link>

            <h1 className="form-title">Welcome back</h1>
            <p className="form-subtitle">Sign in to your Lumière account</p>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="error-box">
                  <span>⚠</span> {error}
                </div>
              )}

              <div className="field-group">
                <label htmlFor="email" className="field-label">Email address</label>
                <input
                  id="email" name="email" type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  required autoComplete="email"
                />
              </div>

              <div className="field-group">
                <label htmlFor="password" className="field-label">Password</label>
                <input
                  id="password" name="password" type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  required autoComplete="current-password"
                />
              </div>

              <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
                <a href="#" style={{ fontSize: "12px", color: "#8B5A2B", textDecoration: "none" }}>Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <p className="switch-link">
              Don&apos;t have an account?{" "}
              <Link href="/register">Create one free →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
