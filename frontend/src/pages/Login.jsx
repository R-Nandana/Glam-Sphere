import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Sparkle } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 64px)" }}>
      {/* Left — editorial brand panel */}
      <div style={{
        background: "linear-gradient(155deg, var(--color-primary-950) 0%, var(--color-primary-800) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "3rem 2.5rem", textAlign: "center",
      }} className="hidden md:flex">
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(201,162,39,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem" }}>
          <Sparkle size={28} weight="fill" color="var(--color-accent)" />
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2.25rem", fontWeight: 300, color: "#FBF0F0", lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
          Your beauty,<br />
          <em style={{ fontStyle: "italic", color: "var(--color-primary-300)" }}>personalised.</em>
        </div>
        <p style={{ color: "var(--color-primary-300)", fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: "300px", opacity: 0.85 }}>
          Sign in to access your curated recommendations, skin profile, and order history.
        </p>
        <div className="divider-gold" style={{ width: "80px", margin: "2rem auto" }} />
        <p style={{ color: "var(--color-primary-300)", fontSize: "0.825rem", opacity: 0.6 }}>
          Not a member?{" "}
          <Link to="/register" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>

      {/* Right — form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", background: "var(--color-surface)" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.5rem" }}>Welcome back</h1>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "0.9375rem", marginBottom: "2rem" }}>Sign in to your GlamSphere account</p>

          {error && (
            <div style={{ background: "#FFF0F0", border: "1px solid #F5D5D5", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--color-error)", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>Email</label>
              <input
                type="email" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="field"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} required
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  className="field" style={{ paddingRight: "2.75rem" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted)", display: "flex" }}>
                  {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "0.875rem", fontSize: "1rem", marginTop: "0.5rem" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-ink-muted)", marginTop: "1.25rem" }}>
            No account?{" "}
            <Link to="/register" style={{ color: "var(--color-primary-500)", fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
