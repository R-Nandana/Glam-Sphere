import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, BarElement, PointElement, CategoryScale, LinearScale,
  ArcElement, Tooltip, Legend, Filler,
} from "chart.js";
import api from "../../api/axios";

ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Filler);

const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PERIODS = [{ label: "3 months", value: 3 }, { label: "6 months", value: 6 }, { label: "12 months", value: 12 }];

export default function AdminRevenue() {
  const [revenue, setRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [period, setPeriod] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/admin/revenue-report"),
      api.get("/admin/category-sales"),
      api.get("/products", { params: { sort: "rating", limit: 5 } }),
    ]).then(([rev, cat, prod]) => {
      setRevenue(rev.data.report || []);
      setCategorySales(cat.data.data || []);
      setBestSellers(prod.data.items || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  const filtered = revenue.slice(-period);

  const lineData = {
    labels: filtered.map((r) => MONTHS[(r._id?.month || 1) - 1]),
    datasets: [
      {
        label: "Revenue (₹)",
        data: filtered.map((r) => r.revenue),
        borderColor: "#B54B54", backgroundColor: "rgba(181,75,84,0.1)",
        tension: 0.4, fill: true, pointBackgroundColor: "#B54B54", pointRadius: 4,
      },
    ],
  };

  const barData = {
    labels: filtered.map((r) => MONTHS[(r._id?.month || 1) - 1]),
    datasets: [{ label: "Orders", data: filtered.map((r) => r.orders || 0), backgroundColor: "#C9A227", borderRadius: 6 }],
  };

  const donutData = {
    labels: categorySales.map((c) => c._id),
    datasets: [{ data: categorySales.map((c) => c.total), backgroundColor: ["#B54B54","#C9A227","#3F7A5C","#DE9CA0","#6B615B"], borderWidth: 0 }],
  };

  const chartOpts = { responsive: true, plugins: { legend: { display: false }, tooltip: { backgroundColor: "#241F1C", titleColor: "#FBF7F3", bodyColor: "#F3ECE5" } }, scales: { x: { grid: { display: false }, ticks: { color: "#6B615B", font: { size: 11 } } }, y: { grid: { color: "rgba(231,220,211,0.5)" }, ticks: { color: "#6B615B", font: { size: 11 } } } } };

  const totalRevenue = filtered.reduce((s, r) => s + (r.revenue || 0), 0);
  const totalOrders = filtered.reduce((s, r) => s + (r.orders || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400 }}>Revenue Reports</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {PERIODS.map((p) => (
            <button key={p.value} onClick={() => setPeriod(p.value)} className={period === p.value ? "chip active" : "chip"} style={{ padding: "0.4rem 0.875rem" }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        {[["Period Revenue", rupee(totalRevenue)], ["Orders", totalOrders]].map(([l, v]) => (
          <div key={l} style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "1.125rem 1.375rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "0.5rem" }}>{l}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400, fontVariantNumeric: "tabular-nums" }}>{loading ? "—" : v}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr min(240px, 35%)", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.875rem" }}>Revenue</div>
          {loading ? <div className="skeleton" style={{ height: 180, borderRadius: 8 }} /> : <Line data={lineData} options={chartOpts} />}
        </div>
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.875rem" }}>Orders per month</div>
          {loading ? <div className="skeleton" style={{ height: 180, borderRadius: 8 }} /> : <Bar data={barData} options={chartOpts} />}
        </div>
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.875rem" }}>Category Mix</div>
          {loading ? <div className="skeleton" style={{ height: 180, borderRadius: 8 }} /> : <Doughnut data={donutData} options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { color: "#6B615B", font: { size: 10 } } } } }} />}
        </div>
      </div>

      {/* Best sellers */}
      <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "1.125rem 1.375rem", borderBottom: "1px solid var(--color-border)", fontWeight: 600, fontSize: "0.9375rem" }}>Best Sellers</div>
        <table className="admin-table">
          <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Rating</th><th>Price</th></tr></thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i}>{[1,2,3,4,5].map(j => <td key={j}><div className="skeleton" style={{ height: 14, borderRadius: 4 }} /></td>)}</tr>)
              : bestSellers.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 700, color: "var(--color-accent)", fontSize: "1rem" }}>#{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: "var(--color-ink-muted)" }}>{p.category}</td>
                  <td style={{ fontWeight: 600, color: "var(--color-accent)" }}>★ {(p.ratingAvg || 0).toFixed(1)}</td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>₹{p.price?.toLocaleString("en-IN")}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
