import React, { useEffect, useState, useCallback } from "react";
import { MagnifyingGlass, PencilSimple, Check, X } from "@phosphor-icons/react";
import api from "../../api/axios";
import { useToast } from "../../components/Toast";

const CATEGORIES = ["All", "Skincare", "Makeup", "Haircare", "Fragrance", "Tools"];

export default function AdminInventory() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editingStock, setEditingStock] = useState({}); // { [id]: newValue }
  const [saving, setSaving] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;
    params.limit = 50;
    api.get("/products", { params })
      .then(({ data }) => setProducts(data.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (id, currentStock) => {
    setEditingStock((prev) => ({ ...prev, [id]: String(currentStock) }));
  };

  const cancelEdit = (id) => {
    setEditingStock((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const saveStock = async (product) => {
    const newStock = parseInt(editingStock[product._id], 10);
    if (isNaN(newStock) || newStock < 0) { toast.error("Stock must be a non-negative number"); return; }
    setSaving((prev) => ({ ...prev, [product._id]: true }));
    // Optimistic update
    setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, stock: newStock } : p));
    cancelEdit(product._id);
    try {
      await api.patch(`/products/${product._id}`, { stock: newStock });
      toast.success(`Stock updated for ${product.name}`);
    } catch {
      // Rollback
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, stock: product.stock } : p));
      toast.error("Couldn't update stock — please try again");
    } finally {
      setSaving((prev) => { const n = { ...prev }; delete n[product._id]; return n; });
    }
  };

  const toggleActive = async (product) => {
    const updated = { ...product, isActive: !product.isActive };
    setProducts((prev) => prev.map((p) => p._id === product._id ? updated : p));
    try {
      await api.patch(`/products/${product._id}`, { isActive: updated.isActive });
      toast.info(`${product.name} ${updated.isActive ? "activated" : "deactivated"}`);
    } catch {
      setProducts((prev) => prev.map((p) => p._id === product._id ? product : p));
      toast.error("Couldn't update product status");
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400, marginBottom: "1.5rem" }}>Inventory</h1>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative" }}>
          <MagnifyingGlass size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-ink-muted)" }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="field" style={{ paddingLeft: "2.25rem", width: 220 }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={category === c ? "chip active" : "chip"} style={{ padding: "0.4rem 0.875rem" }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5,6].map(j => (
                      <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
                : products.map((p) => {
                  const isEditing = p._id in editingStock;
                  const lowStock = p.stock < 15;
                  return (
                    <tr key={p._id} style={{ background: p.stock === 0 ? "rgba(179,58,58,0.04)" : lowStock ? "rgba(184,132,46,0.04)" : undefined }}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {p.images?.[0]?.url
                            ? <img src={p.images[0].url} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                            : <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-surface-alt)", flexShrink: 0 }} />
                          }
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--color-ink-muted)" }}>{p.brand}</td>
                      <td>{p.category}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>₹{p.price?.toLocaleString("en-IN")}</td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                            <input
                              type="number" min={0}
                              value={editingStock[p._id]}
                              onChange={(e) => setEditingStock((prev) => ({ ...prev, [p._id]: e.target.value }))}
                              className="field" style={{ width: 72, padding: "0.3rem 0.5rem", fontSize: "0.875rem" }}
                              onKeyDown={(e) => { if (e.key === "Enter") saveStock(p); if (e.key === "Escape") cancelEdit(p._id); }}
                              autoFocus
                            />
                            <button onClick={() => saveStock(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-success)", display: "flex" }}><Check size={16} weight="bold" /></button>
                            <button onClick={() => cancelEdit(p._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", display: "flex" }}><X size={16} weight="bold" /></button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 600, color: p.stock === 0 ? "var(--color-error)" : lowStock ? "var(--color-warning)" : "var(--color-ink)" }}>
                              {p.stock}
                            </span>
                            {lowStock && <span className={p.stock === 0 ? "chip-error" : "chip-warning"} style={{ fontSize: "0.65rem" }}>{p.stock === 0 ? "OOS" : "Low"}</span>}
                            <button onClick={() => startEdit(p._id, p.stock)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted)", display: "flex" }}>
                              <PencilSimple size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => toggleActive(p)}
                          className={p.isActive !== false ? "chip-success" : "chip-error"}
                          style={{ padding: "0.3rem 0.625rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                        >
                          {p.isActive !== false ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          {!loading && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-ink-muted)" }}>No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
