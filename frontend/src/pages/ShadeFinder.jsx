import React, { useState } from "react";
import { CheckCircle, FloppyDisk } from "@phosphor-icons/react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const UNDERTONES = [
  {
    key: "Cool",
    label: "Cool",
    description: "Pink, red or bluish undertones. Silver jewelry suits you.",
    swatchGradient: "linear-gradient(135deg, #E8D5E8 0%, #C8B4D4 50%, #B0A4CC 100%)",
  },
  {
    key: "Neutral",
    label: "Neutral",
    description: "A mix of cool and warm — both gold and silver work for you.",
    swatchGradient: "linear-gradient(135deg, #F5DFD0 0%, #E8C9B5 50%, #D4B5A0 100%)",
  },
  {
    key: "Warm",
    label: "Warm",
    description: "Yellow, peachy or golden undertones. Gold jewelry suits you.",
    swatchGradient: "linear-gradient(135deg, #F5E0B8 0%, #E8C87A 50%, #C9A840 100%)",
  },
];

const DEPTHS = [
  { hex: "#F7E1C8", label: "Fair", idx: 0 },
  { hex: "#EBC199", label: "Light", idx: 1 },
  { hex: "#D9A06B", label: "Medium", idx: 2 },
  { hex: "#B67848", label: "Medium Deep", idx: 3 },
  { hex: "#8A5233", label: "Deep", idx: 4 },
  { hex: "#5C3421", label: "Rich", idx: 5 },
];

export default function ShadeFinder() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [undertone, setUndertone] = useState(user?.undertone || null);
  const [depth, setDepth] = useState(user?.shadeDepth ?? 2);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const find = async (u, d) => {
    if (!u) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/shade-finder", { undertone: u, depth: d });
      setMatch(data.match);
    } catch {
      toast.error("Couldn't find a match — please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleUndertone = (u) => {
    setUndertone(u);
    find(u, depth);
  };

  const handleDepth = (d) => {
    setDepth(d);
    find(undertone, d);
  };

  const saveToProfile = async () => {
    if (!user) { toast.info("Sign in to save your shade profile"); return; }
    setSaving(true);
    try {
      await api.put("/auth/me", { undertone, shadeDepth: depth });
      setUser({ ...user, undertone, shadeDepth: depth });
      toast.success("Shade profile saved!");
    } catch {
      toast.error("Couldn't save — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "var(--color-surface)", paddingBottom: "4rem" }}>
      <div className="page-container" style={{ paddingTop: "3rem", maxWidth: "640px" }}>
        {/* Header */}
        <div className="eyebrow" style={{ marginBottom: "0.625rem" }}>AI Shade Matching</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 400, marginBottom: "0.75rem" }}>
          Find your exact shade
        </h1>
        <p style={{ color: "var(--color-ink-muted)", lineHeight: 1.6, marginBottom: "2.5rem", fontSize: "1.0625rem" }}>
          Tell us about your undertone and depth — we'll find your perfect foundation and concealer match.
        </p>

        {/* Step 1 — Undertone */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink)" }}>
            1. What's your undertone?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem" }}>
            {UNDERTONES.map((u) => (
              <button
                key={u.key}
                onClick={() => handleUndertone(u.key)}
                style={{
                  padding: "0", border: "none", background: "none", cursor: "pointer",
                  borderRadius: "16px", overflow: "hidden",
                  outline: undertone === u.key ? `3px solid var(--color-primary-500)` : "3px solid transparent",
                  outlineOffset: "2px",
                  transition: "outline 150ms, transform 150ms",
                  transform: undertone === u.key ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Color swatch */}
                <div style={{ height: 80, background: u.swatchGradient }} />
                {/* Label */}
                <div style={{
                  background: undertone === u.key ? "var(--color-primary-50)" : "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderTop: "none",
                  padding: "0.75rem 0.875rem",
                  textAlign: "left",
                  transition: "background 150ms",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: undertone === u.key ? "var(--color-primary-800)" : "var(--color-ink)", marginBottom: "0.25rem" }}>
                    {u.label} {undertone === u.key && <CheckCircle size={14} weight="fill" style={{ display: "inline", color: "var(--color-primary-500)" }} />}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)", lineHeight: 1.4 }}>{u.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — Depth */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink)" }}>
            2. Match your depth
          </div>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            {DEPTHS.map((d) => (
              <button
                key={d.idx}
                onClick={() => handleDepth(d.idx)}
                title={d.label}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: d.hex,
                  border: "2px solid transparent",
                  outline: depth === d.idx ? "3px solid var(--color-ink)" : "3px solid transparent",
                  outlineOffset: "2px",
                  cursor: "pointer",
                  transition: "outline 150ms, transform 150ms",
                  transform: depth === d.idx ? "scale(1.18)" : "scale(1)",
                  boxShadow: "0 2px 8px rgba(36,31,28,0.15)",
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", marginTop: "0.625rem", fontWeight: 500 }}>
            Selected: {DEPTHS[depth]?.label}
          </div>
        </section>

        {/* Match result */}
        {loading && (
          <div style={{ padding: "1.5rem", background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "16px" }}>
            <div className="skeleton" style={{ height: "20px", width: "60%", marginBottom: "0.75rem" }} />
            <div className="skeleton" style={{ height: "12px", width: "80%" }} />
          </div>
        )}

        {!loading && match && (
          <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "1.5rem", animation: "scaleIn 250ms ease-out both" }}>
            <div className="eyebrow" style={{ color: "var(--color-success)", marginBottom: "0.875rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle size={13} weight="fill" /> Match found
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: match.shade?.hex || "#D4A573", boxShadow: "0 4px 16px rgba(36,31,28,0.18)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--color-ink)", marginBottom: "0.2rem" }}>{match.productName}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>Shade: {match.shade?.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400, color: "var(--color-ink)", lineHeight: 1 }}>{match.confidence}%</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)" }}>match</div>
              </div>
            </div>

            {/* Confidence bar */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--color-ink-muted)", marginBottom: "0.4rem" }}>
                <span>Match confidence</span>
                <span style={{ fontWeight: 700, color: match.confidence >= 80 ? "var(--color-success)" : "var(--color-warning)" }}>{match.confidence}%</span>
              </div>
              <div style={{ height: "8px", background: "var(--color-border)", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "9999px",
                  background: match.confidence >= 80 ? "var(--color-success)" : "var(--color-warning)",
                  width: `${match.confidence}%`,
                  transition: "width 700ms ease-out",
                }} />
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", marginTop: "0.375rem" }}>
                {match.confidence >= 85 ? "We're very confident this is your match." : match.confidence >= 70 ? "Strong match — try it for a personalised fit." : "Good starting point — test in natural light."}
              </div>
            </div>

            <button onClick={saveToProfile} disabled={saving || !undertone} className="btn-outline" style={{ width: "100%", padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <FloppyDisk size={16} /> {saving ? "Saving…" : "Save shade to my profile"}
            </button>
          </div>
        )}

        {!undertone && !match && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-ink-muted)", fontSize: "0.9375rem", background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "16px" }}>
            Select your undertone above to see your shade match.
          </div>
        )}
      </div>
    </div>
  );
}
