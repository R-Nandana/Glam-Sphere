import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, MapPin, ShoppingBag, Tag } from "@phosphor-icons/react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");
const STEPS = ["Shipping Address", "Review Order", "Confirmation"];

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ name: "", line1: "", city: "", state: "", pincode: "", phone: "" });
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null); // set after success
  const [fieldErrors, setFieldErrors] = useState({});

  const items = cart.items || [];
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
  const discount = couponResult?.discount || 0;
  const shipping = subtotal - discount >= 499 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const validateAddress = () => {
    const errors = {};
    if (!address.name.trim()) errors.name = "Full name is required";
    if (!address.line1.trim()) errors.line1 = "Address is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode)) errors.pincode = "Enter a valid 6-digit PIN";
    if (!/^[6-9]\d{9}$/.test(address.phone)) errors.phone = "Enter a valid 10-digit mobile number";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode, cartTotal: subtotal });
      setCouponResult({ discount: data.discount });
      toast.success(`Coupon applied — ${rupee(data.discount)} off!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setCouponResult(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod: "razorpay",
        couponCode: couponCode || undefined,
      });
      await refreshCart();
      setOrder(data.order || { orderNumber: data.orderNumber });
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed — please try again");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ background: "var(--color-surface)", paddingBottom: "4rem", minHeight: "80vh" }}>
      <div className="page-container" style={{ paddingTop: "2.5rem", maxWidth: "960px" }}>
        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < step ? "var(--color-primary-500)" : i === step ? "var(--color-primary-500)" : "var(--color-border)",
                  color: i <= step ? "#fff" : "var(--color-ink-muted)",
                  fontSize: "0.8125rem", fontWeight: 700,
                  transition: "background 300ms",
                }}>
                  {i < step ? <CheckCircle size={16} weight="fill" /> : i + 1}
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: i === step ? "var(--color-primary-500)" : "var(--color-ink-muted)", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: i < step ? "var(--color-primary-500)" : "var(--color-border)", margin: "0 0.5rem", marginBottom: "1.25rem", transition: "background 300ms" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 0 — Address */}
        {step === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px, 100%)", gap: "2rem", alignItems: "start" }}>
            <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
                <MapPin size={20} weight="fill" color="var(--color-primary-500)" />
                <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.25rem", margin: 0 }}>Shipping Address</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Field label="Full name" error={fieldErrors.name}>
                  <input className={`field ${fieldErrors.name ? "error" : ""}`} placeholder="Your full name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                </Field>
                <Field label="Street address" error={fieldErrors.line1}>
                  <input className={`field ${fieldErrors.line1 ? "error" : ""}`} placeholder="Flat / House No., Street, Area" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="City" error={fieldErrors.city}>
                    <input className={`field ${fieldErrors.city ? "error" : ""}`} placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </Field>
                  <Field label="State" error={fieldErrors.state}>
                    <input className={`field ${fieldErrors.state ? "error" : ""}`} placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="PIN code" error={fieldErrors.pincode}>
                    <input className={`field ${fieldErrors.pincode ? "error" : ""}`} placeholder="6-digit PIN" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
                  </Field>
                  <Field label="Mobile number" error={fieldErrors.phone}>
                    <input className={`field ${fieldErrors.phone ? "error" : ""}`} placeholder="10-digit number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                  </Field>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "0.875rem", marginTop: "1.5rem", fontSize: "1rem" }}
                onClick={() => { if (validateAddress()) setStep(1); }}
              >
                Continue to Review
              </button>
            </div>
            <OrderSummaryCard items={items} subtotal={subtotal} discount={discount} shipping={shipping} total={total} mini />
          </div>
        )}

        {/* STEP 1 — Review */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px, 100%)", gap: "2rem", alignItems: "start" }}>
            <div>
              {/* Item list */}
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "1.5rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                  <ShoppingBag size={18} weight="fill" color="var(--color-primary-500)" />
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.125rem", margin: 0 }}>Items in your order</h2>
                </div>
                {items.map((i) => (
                  <div key={i._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0", borderBottom: "1px solid var(--color-border)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{i.product?.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)" }}>{i.product?.brand} · Qty {i.qty}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{rupee((i.product?.price || 0) * i.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
                  <Tag size={16} color="var(--color-primary-500)" />
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Apply coupon</span>
                </div>
                {couponResult ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--color-surface-alt)", borderRadius: "10px" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-success)", fontWeight: 600 }}>✓ {couponCode} — {rupee(discount)} off</span>
                    <button onClick={() => { setCouponResult(null); setCouponCode(""); }} style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "0.625rem" }}>
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="field" style={{ flex: 1, padding: "0.5rem 0.875rem" }} />
                    <button onClick={applyCoupon} disabled={applyingCoupon} className="btn-outline" style={{ padding: "0.5rem 1rem" }}>{applyingCoupon ? "…" : "Apply"}</button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(0)} className="btn-outline" style={{ flex: 1, padding: "0.875rem" }}>← Back</button>
                <button onClick={placeOrder} disabled={placing} className="btn-primary" style={{ flex: 2, padding: "0.875rem", fontSize: "1rem" }}>
                  {placing ? "Placing order…" : "Place Order"}
                </button>
              </div>
            </div>
            <OrderSummaryCard items={items} subtotal={subtotal} discount={discount} shipping={shipping} total={total} address={address} />
          </div>
        )}

        {/* STEP 2 — Confirmation */}
        {step === 2 && (
          <div style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto", paddingTop: "2rem" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-surface-alt)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <CheckCircle size={44} weight="fill" color="var(--color-success)" />
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "2.25rem", marginBottom: "0.75rem" }}>
              Order Placed!
            </h1>
            <p style={{ color: "var(--color-ink-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
              We've received your order and it's being prepared with care. You'll receive updates as it ships.
            </p>
            {order?.orderNumber && (
              <div style={{ display: "inline-block", background: "var(--color-primary-50)", border: "1px solid var(--color-primary-100)", borderRadius: "10px", padding: "0.75rem 1.25rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)" }}>Order number</span>
                <div style={{ fontWeight: 700, color: "var(--color-primary-800)", fontFamily: "'Inter', monospace" }}>{order.orderNumber}</div>
              </div>
            )}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/orders" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>View my orders</Link>
              <Link to="/" className="btn-outline" style={{ padding: "0.75rem 1.75rem" }}>Continue shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.375rem" }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: "0.8rem", color: "var(--color-error)", marginTop: "0.25rem" }}>{error}</div>}
    </div>
  );
}

function OrderSummaryCard({ items, subtotal, discount, shipping, total, address, mini }) {
  return (
    <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "1.25rem" }}>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.125rem", marginBottom: "1rem" }}>Summary</h3>
      {!mini && address?.name && (
        <div style={{ marginBottom: "1rem", padding: "0.875rem", background: "var(--color-surface-alt)", borderRadius: "10px", fontSize: "0.875rem", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.25rem" }}>{address.name}</div>
          {address.line1}, {address.city} — {address.pincode}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
        {items.slice(0, 3).map((i) => (
          <div key={i._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--color-ink-muted)" }}>{i.product?.name?.slice(0, 22)}{i.product?.name?.length > 22 ? "…" : ""} ×{i.qty}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{rupee((i.product?.price || 0) * i.qty)}</span>
          </div>
        ))}
        {items.length > 3 && <span style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)" }}>+{items.length - 3} more items</span>}
      </div>
      <div className="divider" style={{ marginBottom: "0.875rem" }} />
      <Row label="Subtotal" value={rupee(subtotal)} />
      {discount > 0 && <Row label="Discount" value={`–${rupee(discount)}`} style={{ color: "var(--color-success)" }} />}
      <Row label="Shipping" value={shipping === 0 ? "FREE" : rupee(shipping)} />
      <div className="divider" style={{ margin: "0.75rem 0" }} />
      <Row label="Total" value={rupee(total)} bold />
    </div>
  );
}
function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? "1rem" : "0.875rem", fontWeight: bold ? 700 : 400, marginBottom: "0.375rem" }}>
      <span style={{ color: bold ? "var(--color-ink)" : "var(--color-ink-muted)" }}>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
