import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[GlamSphere ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          background: "var(--color-surface)",
        }}>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 400,
            color: "var(--color-primary-800)",
            marginBottom: "0.75rem",
          }}>
            Something went beautifully wrong.
          </div>
          <p style={{ color: "var(--color-ink-muted)", maxWidth: "28rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            We encountered an unexpected error. Please refresh the page to continue.
          </p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
            style={{ padding: "0.75rem 1.75rem" }}
          >
            Refresh page
          </button>
          {process.env.NODE_ENV !== "production" && (
            <pre style={{
              marginTop: "2rem",
              fontSize: "0.75rem",
              textAlign: "left",
              color: "var(--color-error)",
              background: "#FFF0F0",
              borderRadius: "8px",
              padding: "1rem",
              maxWidth: "600px",
              overflow: "auto",
            }}>
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
