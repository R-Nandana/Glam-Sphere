import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, Brain } from "@phosphor-icons/react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { SkeletonGrid } from "../components/SkeletonCard";

const QUESTIONS = [
  {
    key: "feel",
    q: "How does your skin feel by midday?",
    options: [
      { label: "Shiny & greasy all over", value: "Oily" },
      { label: "Tight, flaky or uncomfortable", value: "Dry" },
      { label: "Oily T-zone, dry on cheeks", value: "Combination" },
      { label: "Comfortable & balanced", value: "Normal" },
    ],
  },
  {
    key: "pores",
    q: "How visible are your pores?",
    options: [
      { label: "Large — especially across the T-zone", value: "Oily" },
      { label: "Barely visible anywhere", value: "Dry" },
      { label: "Visible only in the T-zone", value: "Combination" },
      { label: "Small and evenly-sized", value: "Normal" },
    ],
  },
  {
    key: "sensitivity",
    q: "Does your skin react easily to new products?",
    options: [
      { label: "Rarely — my skin is resilient", value: "Normal" },
      { label: "Sometimes — mild redness", value: "Combination" },
      { label: "Often — redness, itching or breakouts", value: "Sensitive" },
      { label: "Very rarely — I haven't tested much", value: "Normal" },
    ],
  },
  {
    key: "goal",
    q: "What's your top skin goal right now?",
    options: [
      { label: "Control oil & reduce shine", value: "Oily" },
      { label: "Deep hydration & plumpness", value: "Dry" },
      { label: "Even out texture & balance", value: "Combination" },
      { label: "Overall glow & maintenance", value: "Normal" },
    ],
  },
];

const SKIN_TYPE_COPY = {
  Oily: "Your skin produces extra sebum — the right lightweight, non-comedogenic products will keep you balanced and shine-free.",
  Dry: "Your skin needs rich, occlusive hydration. We'll focus on barrier-repairing and deeply moisturising formulas.",
  Combination: "You have two zones with different needs. Balancing products and light hydration in the right areas are key.",
  Normal: "Congratulations — your skin is well-balanced. The focus is maintenance, protection, and enhancement.",
  Sensitive: "Your skin reacts easily, so we'll prioritise gentle, fragrance-free formulas with minimal ingredients.",
};

const SESSION_KEY = "gs_quiz_answers";

export default function SkinQuiz() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}"); } catch { return {}; }
  });
  const [result, setResult] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Persist answers to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(answers));
  }, [answers]);

  const progress = ((step) / QUESTIONS.length) * 100;

  const next = async (opt) => {
    const next = { ...answers, [QUESTIONS[step].key]: opt.value };
    setAnswers(next);
    setSelected(null);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const { data } = await api.post("/ai/skin-quiz", { answers: next });
        setResult(data.skinType);
        setRecs(data.recommendations || []);
        sessionStorage.removeItem(SESSION_KEY);
        // Save skin type to user profile
        if (user) {
          try {
            await api.put("/auth/me", { skinType: data.skinType });
            setUser({ ...user, skinType: data.skinType });
          } catch {}
        }
      } catch {
        toast.error("Couldn't process results — please try again");
      } finally {
        setLoading(false);
      }
    }
  };

  const retake = () => { setStep(0); setAnswers({}); setResult(null); setRecs([]); sessionStorage.removeItem(SESSION_KEY); };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <Brain size={48} weight="thin" style={{ color: "var(--color-primary-500)", animation: "float 2s ease-in-out infinite" }} />
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, color: "var(--color-ink)" }}>Analysing your answers…</div>
        <p style={{ color: "var(--color-ink-muted)", fontSize: "0.9375rem" }}>Our AI is building your skin profile</p>
      </div>
    );
  }

  if (result) {
    return (
      <div style={{ background: "var(--color-surface)", paddingBottom: "4rem" }}>
        <div className="page-container" style={{ paddingTop: "3rem", maxWidth: "900px" }}>
          {/* Result hero */}
          <div style={{ textAlign: "center", padding: "2.5rem 1.5rem", background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "24px", marginBottom: "2.5rem" }}>
            <CheckCircle size={52} weight="fill" color="var(--color-success)" style={{ marginBottom: "1.25rem" }} />
            <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Your skin type</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, color: "var(--color-ink)", marginBottom: "1rem" }}>
              {result} skin
            </h1>
            <p style={{ color: "var(--color-ink-muted)", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 1.5rem" }}>
              {SKIN_TYPE_COPY[result]}
            </p>
            <div className="divider-gold" style={{ width: "80px", margin: "0 auto 1.5rem" }} />
            <button onClick={retake} className="btn-ghost" style={{ margin: "0 auto" }}>
              <ArrowLeft size={14} /> Retake quiz
            </button>
          </div>

          {recs.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Brain size={13} weight="fill" /> Matched for you
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.5rem" }}>
                Products for {result} skin
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                {recs.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div style={{ background: "var(--color-surface)", minHeight: "80vh", paddingBottom: "4rem" }}>
      <div className="page-container" style={{ paddingTop: "3rem", maxWidth: "600px" }}>
        {/* Progress */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Brain size={13} weight="fill" /> Skin Type Quiz
            </div>
            <span style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", fontWeight: 500 }}>{step + 1} of {QUESTIONS.length}</span>
          </div>
          <div style={{ height: "4px", background: "var(--color-border)", borderRadius: "9999px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "9999px",
              background: "linear-gradient(90deg, var(--color-primary-500), var(--color-primary-300))",
              width: `${progress + (100 / QUESTIONS.length)}%`,
              transition: "width 400ms ease-out",
            }} />
          </div>
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 400, lineHeight: 1.2, marginBottom: "2rem", color: "var(--color-ink)" }}>
          {q.q}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {q.options.map((opt) => (
            <button
              key={opt.value + opt.label}
              onClick={() => { setSelected(opt.value); setTimeout(() => next(opt), 180); }}
              style={{
                textAlign: "left",
                padding: "1.125rem 1.375rem",
                background: selected === opt.value ? "var(--color-primary-50)" : "var(--color-white)",
                border: `1.5px solid ${selected === opt.value ? "var(--color-primary-500)" : "var(--color-border)"}`,
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: selected === opt.value ? "var(--color-primary-800)" : "var(--color-ink)",
                transition: "all 200ms ease-out",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: selected === opt.value ? "0 0 0 3px rgba(181,75,84,0.12)" : "none",
              }}
              onMouseEnter={(e) => { if (selected !== opt.value) { e.currentTarget.style.border = "1.5px solid var(--color-primary-300)"; e.currentTarget.style.background = "var(--color-primary-50)"; }}}
              onMouseLeave={(e) => { if (selected !== opt.value) { e.currentTarget.style.border = "1.5px solid var(--color-border)"; e.currentTarget.style.background = "var(--color-white)"; }}}
            >
              {opt.label}
              <ArrowRight size={16} weight="bold" style={{ color: selected === opt.value ? "var(--color-primary-500)" : "var(--color-border)", flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {step > 0 && (
          <button onClick={() => { setStep(step - 1); setSelected(null); }} className="btn-ghost" style={{ marginTop: "1.5rem" }}>
            <ArrowLeft size={14} /> Previous question
          </button>
        )}
      </div>
    </div>
  );
}
