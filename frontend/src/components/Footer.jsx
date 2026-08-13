import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background: "var(--color-primary-950)",
        color: "var(--color-primary-100)",
        marginTop: "auto",
      }}
    >
      {/* Gold divider */}
      <div className="divider-gold" />

      <div className="page-container" style={{ padding: "3rem clamp(1rem, 4vw, 1.5rem)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, color: "#FBF0F0", marginBottom: "0.5rem" }}>
              GlamSphere
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--color-primary-300)", lineHeight: 1.6, maxWidth: "200px" }}>
              Beauty, thoughtfully — AI-powered personalization for every skin type and tone.
            </p>
          </div>

          {/* Discover */}
          <nav>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "1rem" }}>
              Discover
            </div>
            {[
              { to: "/", label: "Shop All" },
              { to: "/quiz", label: "Skin Quiz" },
              { to: "/shade-finder", label: "Shade Finder" },
            ].map((l) => (
              <Link
                key={l.to} to={l.to}
                style={{ display: "block", fontSize: "0.875rem", color: "var(--color-primary-100)", marginBottom: "0.5rem", opacity: 0.8, transition: "opacity 150ms" }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Account */}
          <nav>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "1rem" }}>
              Account
            </div>
            {[
              { to: "/login", label: "Sign in" },
              { to: "/register", label: "Create account" },
              { to: "/orders", label: "My orders" },
              { to: "/wishlist", label: "Wishlist" },
            ].map((l) => (
              <Link
                key={l.to} to={l.to}
                style={{ display: "block", fontSize: "0.875rem", color: "var(--color-primary-100)", marginBottom: "0.5rem", opacity: 0.8, transition: "opacity 150ms" }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="divider" style={{ background: "rgba(243,217,218,0.12)", marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-primary-300)", opacity: 0.7, margin: 0 }}>
            © {year} GlamSphere. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Use"].map((label) => (
              <span key={label} style={{ fontSize: "0.8125rem", color: "var(--color-primary-300)", opacity: 0.6, cursor: "pointer" }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
