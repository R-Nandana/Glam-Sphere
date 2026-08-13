import React, { useEffect, useState, useCallback } from "react";
import { MagnifyingGlass, DownloadSimple } from "@phosphor-icons/react";
import api from "../../api/axios";
import { useToast } from "../../components/Toast";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const load = useCallback(() => {
    setLoading(true);
    api.get("/orders", { params: { limit: 100 } })
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status, orderNumber) => {
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Order ${orderNumber} → ${status}`);
    } catch {
      load();
      toast.error("Couldn't update order status");
    }
  };

  const exportCSV = () => {
    const rows = [["Order No","Customer","Total","Status","Date"]];
    filtered.forEach((o) => {
      rows.push([
        o.orderNumber || o._id,
        o.user?.name || "—",
        o.totalPrice,
        o.status,
        new Date(o.createdAt).toLocaleDateString("en-IN"),
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `glamsphere-orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Orders exported as CSV");
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (o.orderNumber?.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q));
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor = { Processing: "var(--color-primary-500)", Shipped: "var(--color-accent)", Delivered: "var(--color-success)", Cancelled: "var(--color-error)", Pending: "var(--color-warning)" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400 }}>Order Tracking</h1>
        <button onClick={exportCSV} className="btn-outline" style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <DownloadSimple size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative" }}>
          <MagnifyingGlass size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-ink-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order # or customer…" className="field" style={{ paddingLeft: "2.25rem", width: 260 }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["All", ...STATUSES, "Pending"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={filterStatus === s ? "chip active" : "chip"} style={{ padding: "0.4rem 0.875rem" }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{[1,2,3,4,5].map(j => <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>)}</tr>
                ))
                : filtered.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, fontSize: "0.875rem", fontFamily: "monospace" }}>{o.orderNumber}</td>
                    <td>{o.user?.name || "—"}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>₹{o.totalPrice?.toLocaleString("en-IN")}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => setStatus(o._id, e.target.value, o.orderNumber)}
                        style={{
                          border: "1.5px solid var(--color-border)", borderRadius: "9999px",
                          padding: "0.3rem 0.75rem", fontSize: "0.8125rem",
                          fontWeight: 600, color: statusColor[o.status] || "var(--color-ink)",
                          background: "var(--color-surface)", cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {["Pending", ...STATUSES].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ color: "var(--color-ink-muted)", fontSize: "0.875rem" }}>
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-ink-muted)" }}>No orders match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
