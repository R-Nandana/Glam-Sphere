import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowClockwise, FilePdf, ShoppingBag } from "@phosphor-icons/react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import jsPDF from "jspdf";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
const STATUS_COLOR = {
  Pending:    "var(--color-warning)",
  Processing: "var(--color-primary-500)",
  Shipped:    "var(--color-accent)",
  Delivered:  "var(--color-success)",
  Cancelled:  "var(--color-error)",
};

function StatusStepper({ status }) {
  const idx = STATUS_STEPS.indexOf(status);
  if (status === "Cancelled") {
    return <span className="chip-error">Cancelled</span>;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "0.875rem", marginBottom: "0.25rem" }}>
      {STATUS_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: i <= idx ? STATUS_COLOR[status] : "var(--color-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 300ms",
            }}>
              {i < idx && <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>✓</span>}
              {i === idx && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "block" }} />}
            </div>
            <span style={{ fontSize: "0.625rem", fontWeight: i === idx ? 700 : 500, color: i <= idx ? STATUS_COLOR[status] : "var(--color-ink-muted)", whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div style={{ flex: 1, height: "2px", background: i < idx ? STATUS_COLOR[status] : "var(--color-border)", margin: "0 4px", marginBottom: "1rem", transition: "background 300ms" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function downloadInvoice(order) {
  const doc = new jsPDF();
  const margin = 18;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("GlamSphere", margin, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 97, 91);
  doc.text("Beauty, thoughtfully", margin, 36);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 210 - margin, 28, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 97, 91);
  doc.text(`Order: ${order.orderNumber || order._id}`, 210 - margin, 36, { align: "right" });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 210 - margin, 42, { align: "right" });

  // Divider
  doc.setDrawColor(231, 220, 211);
  doc.line(margin, 50, 210 - margin, 50);

  // Shipping address
  let y = 58;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SHIP TO", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 97, 91);
  y += 6;
  if (order.shippingAddress) {
    const a = order.shippingAddress;
    const addrLines = [a.name, a.line1, `${a.city} ${a.pincode}`, a.phone].filter(Boolean);
    addrLines.forEach((l) => { doc.text(l, margin, y); y += 5.5; });
  }

  // Items table
  y = Math.max(y + 8, 90);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text("ITEM", margin, y);
  doc.text("QTY", 140, y, { align: "right" });
  doc.text("PRICE", 175, y, { align: "right" });
  doc.text("TOTAL", 210 - margin, y, { align: "right" });
  doc.setDrawColor(231, 220, 211);
  doc.line(margin, y + 3, 210 - margin, y + 3);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(36, 31, 28);
  (order.items || []).forEach((item) => {
    const name = item.name || item.product?.name || "Product";
    const qty = item.qty || 1;
    const price = item.price || item.product?.price || 0;
    doc.text(name.slice(0, 42), margin, y);
    doc.text(String(qty), 140, y, { align: "right" });
    doc.text(rupee(price), 175, y, { align: "right" });
    doc.text(rupee(price * qty), 210 - margin, y, { align: "right" });
    y += 7;
  });

  // Totals
  doc.line(margin, y + 2, 210 - margin, y + 2);
  y += 9;
  doc.setTextColor(107, 97, 91);
  doc.text("Total", 155, y, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(36, 31, 28);
  doc.setFontSize(12);
  doc.text(rupee(order.totalPrice), 210 - margin, y, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 97, 91);
  doc.text("Thank you for your purchase — GlamSphere", 105, 285, { align: "center" });

  doc.save(`glamsphere-invoice-${order.orderNumber || order._id}.pdf`);
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    api.get("/orders/mine")
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = async (order) => {
    try {
      await Promise.all((order.items || []).map((i) => addToCart(i.product?._id || i.product, undefined, i.qty)));
      toast.success("Items added back to your bag!");
    } catch {
      toast.error("Couldn't reorder — some items may be unavailable");
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: "3rem" }}>
        {[1,2,3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16, marginBottom: "1rem" }} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-container" style={{ paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <Package size={64} weight="thin" style={{ color: "var(--color-primary-300)", marginBottom: "1.25rem" }} />
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.625rem" }}>No orders yet</h1>
        <p style={{ color: "var(--color-ink-muted)", marginBottom: "2rem" }}>Your order history will appear here once you make your first purchase.</p>
        <Link to="/" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
          <ShoppingBag size={16} style={{ marginRight: "0.5rem" }} /> Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-surface)", paddingBottom: "4rem" }}>
      <div className="page-container" style={{ paddingTop: "2.5rem", maxWidth: "800px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 400, marginBottom: "2rem" }}>
          Order History
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {orders.map((o) => (
            <div key={o._id} style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "20px",
              padding: "1.5rem",
              animation: "fadeIn 300ms ease-out both",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-primary-500)", marginBottom: "0.2rem" }}>
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--color-ink)" }}>{o.orderNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.25rem", fontVariantNumeric: "tabular-nums" }}>{rupee(o.totalPrice)}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)" }}>{o.items?.length} item(s)</div>
                </div>
              </div>

              {/* Status stepper */}
              <StatusStepper status={o.status} />

              {/* Item names */}
              <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", marginTop: "0.875rem", marginBottom: "1rem" }}>
                {(o.items || []).map((i) => i.name || i.product?.name).filter(Boolean).slice(0, 3).join(" · ")}
                {o.items?.length > 3 ? ` +${o.items.length - 3} more` : ""}
              </p>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleReorder(o)}
                  className="btn-outline"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <ArrowClockwise size={14} /> Reorder
                </button>
                <button
                  onClick={() => downloadInvoice(o)}
                  className="btn-ghost"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <FilePdf size={14} /> Invoice PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
