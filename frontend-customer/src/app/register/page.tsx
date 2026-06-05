"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";

const API = "http://localhost:3000/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user } = useApp();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (user) router.replace("/"); }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    setLoading(true);
    try {
      // Register
      const regRes = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name || undefined,
          last_name: form.last_name || undefined,
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error || "Registrasi gagal");

      // Auto-login setelah register
      const logRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const logData = await logRes.json();
      if (logRes.ok) {
        login(logData.token, logData.user);
        setStep("success");
        setTimeout(() => router.push("/"), 2000);
      } else {
        // Register berhasil tapi login gagal, redirect ke login
        router.push("/login");
      }
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
          padding: 3rem; position: relative; overflow: hidden;
          order: 2;
        }
        .auth-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 50% at 70% 60%, rgba(196,154,108,0.18) 0%, transparent 60%);
        }
        .panel-logo {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem; font-weight: 700;
          color: #FAF3E8; letter-spacing: -1px;
          position: relative; margin-bottom: 1.5rem;
        }
        .panel-logo em { color: #C49A6C; font-style: italic; }

        .auth-form-side {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 2rem;
          order: 1;
        }
        .form-card { width: 100%; max-width: 440px; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #8B5A2B; text-decoration: none;
          margin-bottom: 2.5rem; font-weight: 500; transition: gap 0.2s;
        }
        .back-link:hover { gap: 10px; }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 700;
          color: #3D1F08; margin-bottom: 0.4rem;
        }
        .form-subtitle { font-size: 14px; color: #9A7050; margin-bottom: 2rem; font-weight: 300; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }

        .field-group { margin-bottom: 1rem; }
        .field-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #5C3A1E; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 0.45rem;
        }
        .field-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid rgba(139,90,43,0.2);
          border-radius: 12px; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: rgba(250,243,232,0.5);
          color: #3D1F08; outline: none; transition: all 0.2s;
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
          display: flex; align-items: flex-start; gap: 8px;
        }

        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%);
          border: none; border-radius: 12px;
          color: #FAF3E8; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; margin-top: 0.5rem;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 6px 20px rgba(139,90,43,0.3);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(139,90,43,0.4);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .switch-link { text-align: center; font-size: 13px; color: #9A7050; margin-top: 1.4rem; }
        .switch-link a { color: #8B5A2B; font-weight: 600; text-decoration: none; }
        .switch-link a:hover { text-decoration: underline; }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(250,243,232,0.3);
          border-top-color: #FAF3E8; border-radius: 50%;
          animation: spin 0.7s linear infinite; vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .success-card {
          text-align: center; padding: 2.5rem;
          background: rgba(34,197,94,0.06);
          border: 1.5px solid rgba(34,197,94,0.25);
          border-radius: 20px;
        }
        .success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin: 0 auto 1.2rem;
          box-shadow: 0 8px 24px rgba(34,197,94,0.25);
        }
      `}</style>

      <div className="auth-root">
        {/* ── Form side ── */}
        <div className="auth-form-side">
          <div className="form-card">
            {step === "success" ? (
              <div className="success-card">
                <div className="success-icon">✓</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3D1F08", fontSize: "1.6rem", marginBottom: "0.6rem" }}>
                  Welcome to Lumière!
                </h2>
                <p style={{ color: "#9A7050", fontSize: "14px", marginBottom: "0.5rem" }}>
                  Akun berhasil dibuat. Mengarahkan ke beranda…
                </p>
                <div style={{ width: "100%", height: 4, background: "rgba(34,197,94,0.15)", borderRadius: 2, marginTop: "1.2rem", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #16a34a)", animation: "progressAnim 2s linear forwards", borderRadius: 2 }} />
                </div>
                <style>{`@keyframes progressAnim { from { width: 0 } to { width: 100% } }`}</style>
              </div>
            ) : (
              <>
                <Link href="/" className="back-link">← Back to store</Link>
                <h1 className="form-title">Create account</h1>
                <p className="form-subtitle">Join Lumière — it&apos;s free</p>

                <form onSubmit={handleSubmit} noValidate>
                  {error && (
                    <div className="error-box"><span>⚠</span> {error}</div>
                  )}

                  <div className="field-row">
                    <div className="field-group">
                      <label htmlFor="first_name" className="field-label">First Name</label>
                      <input id="first_name" name="first_name" type="text" className="field-input"
                        placeholder="Andi" value={form.first_name} onChange={handleChange} autoComplete="given-name" />
                    </div>
                    <div className="field-group">
                      <label htmlFor="last_name" className="field-label">Last Name</label>
                      <input id="last_name" name="last_name" type="text" className="field-input"
                        placeholder="Pratama" value={form.last_name} onChange={handleChange} autoComplete="family-name" />
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="username" className="field-label">Username <span style={{ color: "#c0392b" }}>*</span></label>
                    <input id="username" name="username" type="text" className="field-input"
                      placeholder="andipratama" value={form.username} onChange={handleChange}
                      required autoComplete="username" />
                  </div>

                  <div className="field-group">
                    <label htmlFor="email" className="field-label">Email <span style={{ color: "#c0392b" }}>*</span></label>
                    <input id="email" name="email" type="email" className="field-input"
                      placeholder="andi@example.com" value={form.email} onChange={handleChange}
                      required autoComplete="email" />
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label htmlFor="password" className="field-label">Password <span style={{ color: "#c0392b" }}>*</span></label>
                      <input id="password" name="password" type="password" className="field-input"
                        placeholder="min 6 karakter" value={form.password} onChange={handleChange}
                        required autoComplete="new-password" />
                    </div>
                    <div className="field-group">
                      <label htmlFor="confirm_password" className="field-label">Konfirmasi</label>
                      <input id="confirm_password" name="confirm_password" type="password" className="field-input"
                        placeholder="••••••••" value={form.confirm_password} onChange={handleChange}
                        required autoComplete="new-password" />
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  {form.password.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: form.password.length >= i * 2
                              ? i <= 1 ? "#ef4444" : i <= 2 ? "#f59e0b" : i <= 3 ? "#22c55e" : "#16a34a"
                              : "rgba(139,90,43,0.12)",
                            transition: "background 0.3s",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: "11px", color: form.password.length < 4 ? "#ef4444" : form.password.length < 6 ? "#f59e0b" : "#16a34a" }}>
                        {form.password.length < 4 ? "Lemah" : form.password.length < 6 ? "Cukup" : form.password.length < 8 ? "Kuat" : "Sangat kuat"}
                      </span>
                    </div>
                  )}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading && <span className="spinner" />}
                    {loading ? "Membuat akun…" : "Create Account →"}
                  </button>
                </form>

                <p className="switch-link">
                  Sudah punya akun? <Link href="/login">Sign in →</Link>
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Decorative right panel ── */}
        <div className="auth-panel">
          <div className="panel-logo">Lumi<em>è</em>re</div>
          <p style={{ color: "rgba(250,243,232,0.6)", fontSize: "15px", lineHeight: 1.8, textAlign: "center", maxWidth: "280px", fontWeight: 300, position: "relative" }}>
            Join thousands of fashion lovers discovering curated pieces made with intention.
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "260px", position: "relative" }}>
            {[
              { icon: "✦", text: "Free shipping on your first order" },
              { icon: "◈", text: "Exclusive member-only collections" },
              { icon: "◉", text: "Earn points on every purchase" },
              { icon: "◇", text: "30-day free returns" },
            ].map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#C49A6C", fontSize: "14px", flexShrink: 0 }}>{f.icon}</span>
                <span style={{ color: "rgba(250,243,232,0.55)", fontSize: "13px" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
