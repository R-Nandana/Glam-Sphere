import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ChartLine, Package, Receipt, Users, Tag, CurrencyDollar, List, X, Sparkle
} from "@phosphor-icons/react";

const links = [
  { to: "/admin",           label: "Dashboard",      icon: ChartLine,      end: true },
  { to: "/admin/inventory", label: "Inventory",      icon: Package },
  { to: "/admin/orders",    label: "Orders",         icon: Receipt },
  { to: "/admin/customers", label: "Customers",      icon: Users },
  { to: "/admin/coupons",   label: "Coupons",        icon: Tag },
  { to: "/admin/revenue",   label: "Revenue",        icon: CurrencyDollar },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid var(--admin-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,162,39,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkle size={16} weight="fill" color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1rem", color: "var(--admin-text)", lineHeight: 1.1 }}>GlamSphere</div>
            <div style={{ fontSize: "0.6rem", color: "var(--color-accent)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
        {links.map((l) => (
          <NavLink
            key={l.to} to={l.to} end={l.end}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "10px",
              marginBottom: "0.25rem",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: isActive ? "var(--color-primary-100)" : "rgba(243,236,229,0.55)",
              background: isActive ? "rgba(181,75,84,0.18)" : "transparent",
              borderLeft: isActive ? "3px solid var(--color-primary-500)" : "3px solid transparent",
              transition: "all 150ms",
              textDecoration: "none",
            })}
          >
            {({ isActive }) => (
              <>
                <l.icon size={18} weight={isActive ? "fill" : "regular"} />
                {l.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", background: "var(--color-surface)" }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "var(--admin-bg, #1C1815)",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid var(--admin-border, #3A332C)",
      }} className="hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden"
        style={{
          position: "fixed", top: "70px", left: "1rem", zIndex: 50,
          width: 40, height: 40, borderRadius: "10px",
          background: "#1C1815", border: "1px solid #3A332C",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--admin-text, #F3ECE5)",
        }}
      >
        {mobileOpen ? <X size={18} /> : <List size={18} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,24,21,0.7)", zIndex: 48 }} />
          <aside style={{
            position: "fixed", left: 0, top: 0, bottom: 0, width: 220, zIndex: 49,
            background: "#1C1815", display: "flex", flexDirection: "column",
            borderRight: "1px solid #3A332C",
          }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <main style={{ flex: 1, padding: "2rem 1.5rem", minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
