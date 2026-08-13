import React, { useEffect, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import api from "../../api/axios";
import { useToast } from "../../components/Toast";

const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const BLANK = { code: "", discountType: "percentage", discountValue: 0, minOrder: 0, maxUses: 100, expiresAt: "" };

export default function AdminCoupons() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/coupons/admin")
      .then(({ data }) => setCoupons(data.coupons || []))
      .catch(() => api.get("/coupons").then(({ data }) => setCoupons(data.coupons || [])).catch(() => setCoupons([])))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const previewDiscount = (cartTotal = 1000) => {
    if (!form.discountValue) return "—";
    if (form.discountType === "percentage") return rupee(Math.min((cartTotal * form.discountValue) / 100, cartTotal));
    return rupee(Math.min(form.discountValue, cartTotal));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) { toast.error("Coupon code is required"); return; }
    setSaving(true);
    try {
      await api.post("/coupons", form);
      toast.success(`Coupon "${form.code}" created!`);
      setForm(BLANK); setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save coupon");
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.info(`Coupon "${code}" deleted`);
    } catch { toast.error("Couldn't delete coupon"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400 }}>Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem" }}>
          <Plus size={16} weight="bold" /> New Coupon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.125rem", fontWeight: 400, marginBottom: "1.25rem" }}>New Coupon</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div><label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", display: "block", marginBottom: "0.3rem" }}>Code</label>
              <input className="field" placeholder="e.g. GLOW20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></div>
            <div><label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", display: "block", marginBottom: "0.3rem" }}>Type</label>
              <select className="field" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed Amount ₹</option>
              </select></div>
            <div><label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", display: "block", marginBottom: "0.3rem" }}>Value</label>
              <input type="number" min={0} className="field" placeholder={form.discountType === "percentage" ? "20" : "200"} value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} /></div>
            <div><label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", display: "block", marginBottom: "0.3rem" }}>Min Order (₹)</label>
              <input type="number" min={0} className="field" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} /></div>
            <div><label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", display: "block", marginBottom: "0.3rem" }}>Max Uses</label>
              <input type="number" min={1} className="field" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} /></div>
            <div><label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", display: "block", marginBottom: "0.3rem" }}>Expires</label>
              <input type="date" className="field" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>

            {/* Live preview */}
            <div style={{ gridColumn: "1 / -1", background: "var(--color-surface-alt)", borderRadius: 10, padding: "0.875rem 1rem", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--color-ink-muted)" }}>Discount preview (on ₹1,000 cart):</span>{" "}
              <span style={{ fontWeight: 700, color: "var(--color-primary-500)" }}>{previewDiscount()}</span>
              {form.discountType === "percentage" && form.discountValue > 0 && (
                <span style={{ color: "var(--color-ink-muted)", fontSize: "0.8125rem" }}> ({form.discountValue}% of cart)</span>
              )}
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "0.625rem 1.5rem" }}>
                {saving ? "Saving…" : "Create Coupon"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon list */}
      <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Usage</th><th>Expires</th><th></th></tr></thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <tr key={i}>{[1,2,3,4,5,6,7].map(j => <td key={j}><div className="skeleton" style={{ height: 14, borderRadius: 4 }} /></td>)}</tr>)
                : coupons.map((c) => {
                  const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                  const usagePct = c.maxUses ? Math.round((c.usageCount / c.maxUses) * 100) : 0;
                  return (
                    <tr key={c._id} style={{ opacity: expired ? 0.55 : 1 }}>
                      <td>
                        <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.9375rem", color: expired ? "var(--color-ink-muted)" : "var(--color-ink)", textDecoration: expired ? "line-through" : "none" }}>
                          {c.code}
                        </span>
                        {expired && <span className="chip-error" style={{ marginLeft: "0.5rem" }}>Expired</span>}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{c.discountType}</td>
                      <td style={{ fontWeight: 600 }}>{c.discountType === "percentage" ? `${c.discountValue}%` : rupee(c.discountValue)}</td>
                      <td>{rupee(c.minOrder)}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <div style={{ width: 60, height: 6, borderRadius: "9999px", background: "var(--color-border)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${usagePct}%`, background: usagePct >= 90 ? "var(--color-error)" : "var(--color-primary-500)", borderRadius: "9999px" }} />
                          </div>
                          <span style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)" }}>{c.usageCount}/{c.maxUses}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}
                      </td>
                      <td>
                        <button onClick={() => deleteCoupon(c._id, c.code)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted)", display: "flex" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink-muted)")}
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          {!loading && coupons.length === 0 && <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-ink-muted)" }}>No coupons yet — create one above.</div>}
        </div>
      </div>
    </div>
  );
}
