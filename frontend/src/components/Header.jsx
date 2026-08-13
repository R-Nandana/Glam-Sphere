import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MagnifyingGlass, ShoppingBag, Heart, List, X, User, SignOut, Sparkle } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const cartCount = cart.items?.length || 0;
  const wishlistCount = wishlist.length || 0;

  // Debounced search — navigates on keystroke after 250ms
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate(val.trim() ? `/?search=${encodeURIComponent(val.trim())}` : "/");
    }, 250);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    navigate(search.trim() ? `/?search=${encodeURIComponent(search.trim())}` : "/");
  };

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [navigate]);

  const navLinks = [
    { to: "/", label: "Shop", end: true },
    { to: "/quiz", label: "Skin Quiz" },
    { to: "/shade-finder", label: "Shade Finder" },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "rgba(251,247,243,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "0 1px 12px rgba(36,31,28,0.06)",
        }}
      >
        <div className="page-container" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem clamp(1rem, 4vw, 1.5rem)" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-accent-soft) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Sparkle size={20} weight="fill" color="var(--color-primary-800)" />
            </div>
            <div className="hidden md:block">
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.25rem", lineHeight: 1.1, color: "var(--color-primary-800)", letterSpacing: "-0.01em" }}>
                GlamSphere
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--color-ink-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
                Beauty, thoughtfully
              </div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={onSearchSubmit} style={{ flex: 1, maxWidth: 480 }}>
            <div style={{ position: "relative" }}>
              <MagnifyingGlass
                size={16} weight="bold"
                style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-ink-muted)", pointerEvents: "none" }}
              />
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search shades, brands, concerns…"
                aria-label="Search products"
                style={{
                  width: "100%",
                  paddingLeft: "2.625rem",
                  paddingRight: "1rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  background: "var(--color-white)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  outline: "none",
                  transition: "border-color 150ms, box-shadow 150ms",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-primary-300)"; e.target.style.boxShadow = "0 0 0 3px rgba(181,75,84,0.10)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center" style={{ gap: "0.25rem" }}>
            {navLinks.map((l) => (
              <NavLink
                key={l.to} to={l.to} end={l.end}
                style={({ isActive }) => ({
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "9999px",
                  color: isActive ? "var(--color-primary-500)" : "var(--color-ink-muted)",
                  background: isActive ? "var(--color-primary-50)" : "transparent",
                  transition: "all 150ms",
                  whiteSpace: "nowrap",
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
            {/* Wishlist */}
            <Link to="/wishlist" aria-label={`Wishlist (${wishlistCount})`} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", transition: "background 150ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Heart size={20} weight={wishlistCount > 0 ? "fill" : "regular"} color={wishlistCount > 0 ? "var(--color-primary-500)" : "var(--color-ink-muted)"} />
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "var(--color-primary-500)", color: "#fff", fontSize: "0.55rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" aria-label={`Cart (${cartCount})`} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", transition: "background 150ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ShoppingBag size={20} weight={cartCount > 0 ? "fill" : "regular"} color={cartCount > 0 ? "var(--color-primary-500)" : "var(--color-ink-muted)"} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "var(--color-primary-500)", color: "#fff", fontSize: "0.55rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Link to="/orders" className="hidden md:flex btn-ghost" style={{ gap: "0.4rem", padding: "0.4rem 0.75rem" }}>
                  <User size={16} /> Orders
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn-outline hidden md:inline-flex" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8125rem" }}>Admin</Link>
                )}
                <button onClick={logout} className="btn-ghost hidden md:inline-flex" style={{ gap: "0.4rem", padding: "0.4rem 0.75rem" }}>
                  <SignOut size={16} /> Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary hidden md:inline-flex" style={{ padding: "0.5rem 1.125rem", fontSize: "0.875rem" }}>
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-ink)" }}
            >
              {mobileOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--color-surface)",
              borderTop: "1px solid var(--color-border)",
              padding: "1rem clamp(1rem,4vw,1.5rem) 1.5rem",
              animation: "slideUp 200ms ease-out both",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1rem" }}>
              {navLinks.map((l) => (
                <NavLink
                  key={l.to} to={l.to} end={l.end}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    padding: "0.625rem 0.875rem",
                    borderRadius: "10px",
                    fontWeight: 500,
                    fontSize: "0.9375rem",
                    color: isActive ? "var(--color-primary-500)" : "var(--color-ink)",
                    background: isActive ? "var(--color-primary-50)" : "transparent",
                  })}
                >
                  {l.label}
                </NavLink>
              ))}
              {user && (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ padding: "0.625rem 0.875rem", borderRadius: "10px", fontWeight: 500, color: "var(--color-ink)", fontSize: "0.9375rem" }}>My Orders</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ padding: "0.625rem 0.875rem", borderRadius: "10px", fontWeight: 500, color: "var(--color-ink)", fontSize: "0.9375rem" }}>Admin Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} style={{ padding: "0.625rem 0.875rem", borderRadius: "10px", fontWeight: 500, color: "var(--color-error)", background: "none", border: "none", textAlign: "left", fontSize: "0.9375rem", cursor: "pointer" }}>
                    Sign out
                  </button>
                </>
              )}
            </nav>
            {!user && (
              <Link to="/login" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ display: "block", textAlign: "center", padding: "0.75rem" }}>
                Sign in
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
