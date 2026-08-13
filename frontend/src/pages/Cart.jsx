import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash, Plus, Minus, ShoppingBag, Tag, ArrowRight, Heart } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");
const FREE_SHIPPING_THRESHOLD = 499;

export default function Cart() {
  const { cart, updateQty, removeItem } = useCart();
  const toast = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null); // { discount, message }
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const items = cart.items || [];
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
  const discount = couponResult?.discount || 0;
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const { default: api } = await import("../api/axios");
      const { data } = await api.post("/coupons/validate", { code: couponCode, cartTotal: subtotal });
      setCouponResult({ discount: data.discount, message: data.message });
      toast.success(`Coupon applied — ${rupee(data.discount)} off!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
      setCouponResult(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => { setCouponResult(null); setCouponCode(""); };

  const handleUpdateQty = async (itemId, qty) => {
    if (qty < 1) { handleRemove(itemId); return; }
    try { await updateQty(itemId, qty); }
    catch { toast.error("Couldn't update quantity"); }
  };

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId); toast.info("Item removed from bag"); }
    catch { toast.error("Couldn't remove item"); }
  };

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <ShoppingBag size={64} weight="thin" style={{ color: "var(--color-primary-300)", marginBottom: "1.25rem" }} />
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.625rem" }}>Your bag is empty</h1>
        <p style={{ color: "var(--color-ink-muted)", marginBottom: "2rem" }}>Add something beautiful to get started.</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>Browse products</Link>
          <Link to="/wishlist" className="btn-outline" style={{ padding: "0.75rem 1.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Heart size={16} /> View wishlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-surface)", paddingBottom: "4rem" }}>
      <div className="page-container" style={{ paddingTop: "2.5rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 400, marginBottom: "2rem" }}>
          Your Bag
          <span style={{ fontSize: "1rem", fontFamily: "'Inter', sans-serif", color: "var(--color-ink-muted)", fontWeight: 400, marginLeft: "0.75rem" }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr min(380px, 100%)", gap: "2rem", alignItems: "start" }}>
          {/* Items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((item) => {
              const p = item.product;
              if (!p) return null;
              const img = p.images?.[0]?.url;
              return (
                <div key={item._id} style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  padding: "1.125rem",
                  display: "flex",
                  gap: "1.125rem",
                  alignItems: "flex-start",
                  transition: "box-shadow 200ms",
                }}>
                  {/* Thumbnail */}
                  <Link to={`/products/${p._id}`} style={{
                    width: 88, height: 88, borderRadius: "12px", overflow: "hidden",
                    background: "var(--color-surface-alt)", flexShrink: 0, display: "block",
                  }}>
                    {img
                      ? <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div className="img-placeholder" style={{ width: "100%", height: "100%" }}>{p.category?.[0]}</div>
                    }
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-primary-500)", marginBottom: "0.2rem" }}>{p.brand}</div>
                    <Link to={`/products/${p._id}`} style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-ink)", display: "block", marginBottom: "0.5rem" }}>
                      {p.name}
                    </Link>
                    {item.shade && (
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", marginBottom: "0.5rem" }}>Shade: {item.shade}</div>
                    )}

                    {/* Qty stepper + price row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                      {/* Stepper */}
                      <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid var(--color-border)", borderRadius: "9999px", overflow: "hidden" }}>
                        <button
                          onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                          style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", cursor: "pointer", color: "var(--color-ink-muted)" }}
                        >
                          <Minus size={13} weight="bold" />
                        </button>
                        <span style={{ minWidth: 28, textAlign: "center", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-ink)" }}>{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                          style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", cursor: "pointer", color: "var(--color-ink-muted)" }}
                        >
                          <Plus size={13} weight="bold" />
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "1.0625rem", fontVariantNumeric: "tabular-nums" }}>
                          {rupee((p.price || 0) * item.qty)}
                        </span>
                        <button
                          onClick={() => handleRemove(item._id)}
                          aria-label="Remove item"
                          style={{ color: "var(--color-ink-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink-muted)")}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div style={{
            position: "sticky", top: "80px",
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "20px",
            padding: "1.5rem",
          }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.25rem", marginBottom: "1.25rem" }}>Order Summary</h2>

            {/* Coupon */}
            <div style={{ marginBottom: "1.25rem" }}>
              {couponResult ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--color-surface-alt)", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-success)", fontWeight: 600 }}>
                    <Tag size={14} weight="fill" /> {couponCode.toUpperCase()} applied!
                  </div>
                  <button onClick={removeCoupon} style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="field" style={{ flex: 1, fontSize: "0.875rem", padding: "0.5rem 0.875rem" }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                  <button onClick={applyCoupon} disabled={applyingCoupon || !couponCode.trim()} className="btn-outline" style={{ padding: "0.5rem 0.875rem", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                    {applyingCoupon ? "…" : "Apply"}
                  </button>
                </div>
              )}
            </div>

            <div className="divider" style={{ marginBottom: "1rem" }} />

            {/* Line items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
              <Row label="Subtotal" value={rupee(subtotal)} />
              {discount > 0 && <Row label={`Discount (${couponCode})`} value={`−${rupee(discount)}`} valueStyle={{ color: "var(--color-success)" }} />}
              <Row label="Shipping" value={shipping === 0 ? "FREE 🎉" : rupee(shipping)} valueStyle={shipping === 0 ? { color: "var(--color-success)" } : {}} />
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", background: "var(--color-primary-50)", padding: "0.5rem 0.75rem", borderRadius: "8px" }}>
                  Add {rupee(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </div>
              )}
            </div>

            <div className="divider" style={{ marginBottom: "1rem" }} />
            <Row label="Total" value={rupee(total)} bold />

            <Link
              to="/checkout"
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.875rem", marginTop: "1.25rem", fontSize: "1rem" }}
            >
              Proceed to Checkout <ArrowRight size={16} weight="bold" />
            </Link>
            <Link to="/" style={{ display: "block", textAlign: "center", fontSize: "0.875rem", color: "var(--color-ink-muted)", marginTop: "0.875rem" }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, valueStyle = {} }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? "1.0625rem" : "0.9375rem", fontWeight: bold ? 700 : 400 }}>
      <span style={{ color: bold ? "var(--color-ink)" : "var(--color-ink-muted)" }}>{label}</span>
      <span style={{ color: "var(--color-ink)", fontVariantNumeric: "tabular-nums", ...valueStyle }}>{value}</span>
    </div>
  );
}
