import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Sparkle } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}
const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["", "var(--color-error)", "var(--color-warning)", "var(--color-accent)", "var(--color-success)"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const strength = getStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (strength < 2) { setError("Please choose a stronger password (min 8 chars, mix of letters & numbers)"); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success("Account created — welcome to GlamSphere!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 64px)" }}>
      {/* Left panel */}
      <div style={{
        background: "linear-gradient(155deg, var(--color-primary-950) 0%, var(--color-primary-800) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "3rem 2.5rem", textAlign: "center",
      }} className="hidden md:flex">
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(201,162,39,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem" }}>
          <Sparkle size={28} weight="fill" color="var(--color-accent)" />
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2.25rem", fontWeight: 300, color: "#FBF0F0", lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
          Beauty that<br />
          <em style={{ fontStyle: "italic", color: "var(--color-primary-300)" }}>knows you.</em>
        </div>
        <p style={{ color: "var(--color-primary-300)", fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: "300px", opacity: 0.85 }}>
          Create your profile, take the skin quiz, and let our AI find products made for your unique skin.
        </p>
        <div className="divider-gold" style={{ width: "80px", margin: "2rem auto" }} />
        <p style={{ color: "var(--color-primary-300)", fontSize: "0.825rem", opacity: 0.6 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>

      {/* Right — form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", background: "var(--color-surface)" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.5rem" }}>Create account</h1>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "0.9375rem", marginBottom: "1.75rem" }}>Join GlamSphere — free forever</p>

          {error && (
            <div style={{ background: "#FFF0F0", border: "1px solid #F5D5D5", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--color-error)", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>Full name</label>
              <input type="text" required className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>Email</label>
              <input type="email" required className="field" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>Phone (optional)</label>
              <input type="tel" className="field" placeholder="10-digit mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} required
                  className="field" style={{ paddingRight: "2.75rem" }}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted)", display: "flex" }}>
                  {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.3rem" }}>
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="strength-bar" style={{
                        flex: 1,
                        background: i <= strength ? STRENGTH_COLOR[strength] : "var(--color-border)",
                        width: `${(i <= strength ? 100 : 0)}%`,
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: STRENGTH_COLOR[strength], fontWeight: 600 }}>
                    {STRENGTH_LABEL[strength]}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "0.875rem", fontSize: "1rem", marginTop: "0.25rem" }}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-ink-muted)", marginTop: "1.25rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--color-primary-500)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
