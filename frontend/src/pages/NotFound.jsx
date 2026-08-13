import React from "react";
import { Link } from "react-router-dom";
import { Sparkle } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "var(--color-primary-50)",
      }}
      className="animate-fadeIn"
    >
      {/* Decorative icon */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "var(--color-primary-100)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1.5rem",
      }}>
        <Sparkle size={36} weight="fill" color="var(--color-primary-500)" />
      </div>

      {/* Large 404 */}
      <p style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(5rem, 18vw, 10rem)",
        lineHeight: 1,
        fontWeight: 300,
        color: "var(--color-primary-300)",
        margin: 0,
        letterSpacing: "-0.04em",
      }}>
        404
      </p>

      <h1 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
        fontWeight: 400,
        color: "var(--color-primary-800)",
        marginTop: "0.5rem",
        marginBottom: "0.75rem",
      }}>
        This page wandered off
      </h1>

      <p style={{
        color: "var(--color-ink-muted)",
        fontSize: "1.0625rem",
        maxWidth: "28rem",
        lineHeight: 1.6,
        marginBottom: "2rem",
      }}>
        We couldn't find what you were looking for — but our shelves are full of things you'll love.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
          Back to shop
        </Link>
        <Link to="/quiz" className="btn-outline" style={{ padding: "0.75rem 1.75rem" }}>
          Take the skin quiz
        </Link>
      </div>
    </div>
  );
}
