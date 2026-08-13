import React, { useState, useRef, useEffect } from "react";
import { X, PaperPlaneTilt, Sparkle } from "@phosphor-icons/react";
import api from "../api/axios";

const QUICK_REPLIES = [
  "What's my skin type?",
  "Best moisturiser for oily skin",
  "Track my order",
  "How do I find my shade?",
];

const SESSION_KEY = "gs_chat_history";

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "10px 14px", background: "var(--color-surface-alt)", borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-ink-muted)", display: "block" }} className="animate-bounceDot1" />
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-ink-muted)", display: "block" }} className="animate-bounceDot2" />
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-ink-muted)", display: "block" }} className="animate-bounceDot3" />
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : [{ from: "bot", text: "Hi, I'm Glow — your AI beauty advisor. ✨ Ask me about skincare, routines, or shade matching.", time: Date.now() }];
    } catch {
      return [{ from: "bot", text: "Hi, I'm Glow ✨ Ask me anything about skincare or products.", time: Date.now() }];
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setInput("");
    const now = Date.now();
    setMessages((m) => [...m, { from: "user", text: t, time: now }]);
    setTyping(true);
    try {
      const { data } = await api.post("/ai/chat", { message: t });
      setMessages((m) => [...m, { from: "bot", text: data.reply || "Ask me about routines, skin types, or shade matching!", time: Date.now() }]);
    } catch {
      // Smart offline fallback responder
      let reply = "I'm Glow, your AI beauty advisor! ✨ Ask me about oily/dry skin, routine steps, foundation shades, SPF, or tracking orders.";
      if (/oily/i.test(t)) reply = "For oily skin, look for lightweight, oil-free formulas with salicylic acid or niacinamide. Try our Clarity Clay Cleanser!";
      else if (/dry/i.test(t)) reply = "Dry skin thrives on layered hydration! Try Dew Drop Hydra Serum followed by Cloud Veil Barrier Cream.";
      else if (/sensitive/i.test(t)) reply = "For sensitive skin, choose soothing Centella and Squalane formulas like Cloud Veil Barrier Cream.";
      else if (/routine/i.test(t)) reply = "A great daily routine: Cleanse → Hydrating Serum → Moisturizer → SPF 50 in AM; Double Cleanse → Treatment → Barrier Cream in PM!";
      else if (/shade|foundation/i.test(t)) reply = "Try our AI Shade Finder! Pick your undertone and skin depth to get your perfect foundation match.";
      else if (/track|order/i.test(t)) reply = "Track your order anytime under 'My Orders' in the main menu to view live status updates!";
      else if (/sunscreen|spf/i.test(t)) reply = "Protect your glow daily with Solar Defense Mineral Sunscreen SPF 50 — broad spectrum with zero white cast.";
      else if (/hi|hello|hey/i.test(t)) reply = "Hi there! ✨ I'm Glow. Ask me anything about skincare, shade matching, or product picks.";
      
      setMessages((m) => [...m, { from: "bot", text: reply, time: Date.now() }]);
    } finally {
      setTyping(false);
    }
  };

  const fmt = (ts) => new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-primary"
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem",
          padding: "0.75rem 1.25rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxShadow: "0 8px 32px rgba(181,75,84,0.35)",
          zIndex: 99,
          animation: "slideUp 400ms ease-out both",
        }}
        aria-label="Open Glow beauty AI chat"
      >
        <Sparkle size={18} weight="fill" />
        Ask Glow
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem",
        width: "min(360px, calc(100vw - 2rem))",
        height: 500,
        display: "flex", flexDirection: "column",
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "20px",
        boxShadow: "0 24px 80px rgba(36,31,28,0.2)",
        zIndex: 99,
        animation: "slideUp 280ms cubic-bezier(0.16,1,0.3,1) both",
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Glow Beauty AI chat"
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "0.875rem 1rem",
        background: "linear-gradient(90deg, var(--color-primary-950), var(--color-primary-800))",
        color: "var(--color-primary-50)",
        flexShrink: 0,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(201,162,39,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkle size={18} weight="fill" color="var(--color-accent)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.2 }}>Glow</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Beauty AI · always on</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary-300)", display: "flex", padding: "4px", borderRadius: "6px" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0.875rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "84%",
              padding: "0.625rem 0.875rem",
              borderRadius: m.from === "bot" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
              background: m.from === "bot" ? "var(--color-surface-alt)" : "var(--color-primary-500)",
              color: m.from === "bot" ? "var(--color-ink)" : "#fff",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}>
              {m.text}
            </div>
            {m.time && (
              <div style={{ fontSize: "0.65rem", color: "var(--color-ink-muted)", marginTop: "2px", opacity: 0.6 }}>{fmt(m.time)}</div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={{ flexShrink: 0, padding: "0 0.75rem 0.5rem", display: "flex", gap: "0.4rem", overflowX: "auto", scrollbarWidth: "none" }}>
        {QUICK_REPLIES.map((r) => (
          <button
            key={r}
            onClick={() => send(r)}
            style={{
              flexShrink: 0, padding: "0.35rem 0.75rem",
              background: "var(--color-primary-50)", border: "1px solid var(--color-primary-100)",
              borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
              color: "var(--color-primary-800)", cursor: "pointer", whiteSpace: "nowrap",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-100)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-primary-50)")}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, padding: "0.625rem 0.75rem", borderTop: "1px solid var(--color-border)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about skincare…"
          disabled={typing}
          style={{
            flex: 1, padding: "0.5rem 0.875rem",
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "9999px", fontSize: "0.875rem",
            color: "var(--color-ink)", outline: "none",
            transition: "border-color 150ms",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-300)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
        <button
          onClick={() => send()}
          disabled={typing || !input.trim()}
          className="btn-primary"
          style={{ padding: "0.5rem", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          aria-label="Send message"
        >
          <PaperPlaneTilt size={15} weight="fill" />
        </button>
      </div>
    </div>
  );
}
