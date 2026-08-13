import React, { useEffect, useState } from "react";
import { MagnifyingGlass, ProhibitInset, CheckCircle } from "@phosphor-icons/react";
import api from "../../api/axios";
import { useToast } from "../../components/Toast";

const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function AdminCustomers() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [confirmModal, setConfirmModal] = useState(null); // { customer }

  const load = () => {
    setLoading(true);
    api.get("/admin/customers", { params: { search, limit: 50 } })
      .then(({ data }) => setCustomers(data.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const toggleStatus = async (customer) => {
    const newVal = customer.isActive === false ? true : false;
    setCustomers((prev) => prev.map((c) => c._id === customer._id ? { ...c, isActive: newVal } : c));
    setConfirmModal(null);
    try {
      await api.put(`/admin/customers/${customer._id}/status`, { isActive: newVal });
      toast.success(`${customer.name} ${newVal ? "reactivated" : "deactivated"}`);
    } catch {
      load();
      toast.error("Couldn't update customer status");
    }
  };

  const sorted = [...customers].sort((a, b) => {
    if (sortBy === "spend") return (b.totalSpent || 0) - (a.totalSpent || 0);
    if (sortBy === "orders") return (b.orderCount || 0) - (a.orderCount || 0);
    return a.name?.localeCompare(b.name);
  });

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400, marginBottom: "1.5rem" }}>Customers</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative" }}>
          <MagnifyingGlass size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-ink-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name…" className="field" style={{ paddingLeft: "2.25rem", width: 240 }} />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="chip" style={{ padding: "0.4rem 0.875rem" }}>
          <option value="name">Sort: Name</option>
          <option value="spend">Sort: Top Spend</option>
          <option value="orders">Sort: Most Orders</option>
        </select>
      </div>

      <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spend</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{[1,2,3,4,5].map(j => <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>)}</tr>
                ))
                : sorted.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: "var(--color-ink-muted)", fontSize: "0.875rem" }}>{c.email}</td>
                    <td>{c.orderCount || 0}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{rupee(c.totalSpent)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <span className={c.isActive === false ? "chip-error" : "chip-success"}>
                          {c.isActive === false ? "Inactive" : "Active"}
                        </span>
                        <button
                          onClick={() => setConfirmModal(c)}
                          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "var(--color-ink-muted)" }}
                          title={c.isActive === false ? "Reactivate" : "Deactivate"}
                        >
                          {c.isActive === false
                            ? <CheckCircle size={16} color="var(--color-success)" />
                            : <ProhibitInset size={16} color="var(--color-warning)" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {!loading && sorted.length === 0 && <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-ink-muted)" }}>No customers found.</div>}
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmModal && (
        <div className="modal-backdrop" onClick={() => setConfirmModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: 20, padding: "2rem", maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, marginBottom: "0.75rem" }}>
              {confirmModal.isActive === false ? "Reactivate" : "Deactivate"} customer?
            </h3>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {confirmModal.isActive === false
                ? `Reactivating ${confirmModal.name} will restore their access to GlamSphere.`
                : `Deactivating ${confirmModal.name} will prevent them from logging in.`
              }
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmModal(null)} className="btn-ghost">Cancel</button>
              <button
                onClick={() => toggleStatus(confirmModal)}
                className="btn-primary"
                style={{ background: confirmModal.isActive === false ? "var(--color-success)" : "var(--color-error)" }}
              >
                {confirmModal.isActive === false ? "Reactivate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
