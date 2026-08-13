import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale,
  ArcElement, Tooltip, Legend, Filler,
} from "chart.js";
import { TrendUp, TrendDown, Warning } from "@phosphor-icons/react";
import api from "../../api/axios";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Filler);

const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function KpiCard({ label, value, delta, loading }) {
  if (loading) return <div className="skeleton" style={{ height: 110, borderRadius: 16 }} />;
  const up = delta >= 0;
  return (
    <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "0.625rem" }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 400, lineHeight: 1, marginBottom: "0.5rem", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {delta != null && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: up ? "var(--color-success)" : "var(--color-error)", fontWeight: 600 }}>
          {up ? <TrendUp size={14} weight="fill" /> : <TrendDown size={14} weight="fill" />}
          {Math.abs(delta)}% vs last period
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/revenue-report"),
      api.get("/admin/category-sales"),
      api.get("/products", { params: { sort: "stock-low", limit: 6 } }),
    ]).then(([dash, rev, cat, prod]) => {
      setStats(dash.data.stats || {});
      setRevenue(rev.data.report || []);
      setCategorySales(cat.data.data || []);
      setLowStock((prod.data.items || []).filter(p => p.stock < 15));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const lineData = {
    labels: revenue.map((r) => MONTHS[(r._id?.month || 1) - 1]),
    datasets: [{
      label: "Revenue (₹)",
      data: revenue.map((r) => r.revenue),
      borderColor: "#B54B54",
      backgroundColor: "rgba(181,75,84,0.08)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#B54B54",
      pointRadius: 4,
    }],
  };

  const doughnutData = {
    labels: categorySales.map((c) => c._id),
    datasets: [{
      data: categorySales.map((c) => c.total),
      backgroundColor: ["#B54B54","#C9A227","#3F7A5C","#DE9CA0","#6B615B","#B8842E"],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#241F1C", titleColor: "#FBF7F3", bodyColor: "#F3ECE5" } },
    scales: { x: { grid: { display: false }, ticks: { color: "#6B615B", font: { size: 11 } } }, y: { grid: { color: "rgba(231,220,211,0.5)" }, ticks: { color: "#6B615B", font: { size: 11 } } } },
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400, marginBottom: "1.75rem" }}>Dashboard</h1>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Total Revenue" value={rupee(stats.totalRevenue)} delta={12} loading={loading} />
        <KpiCard label="Total Orders" value={stats.totalOrders ?? "—"} delta={8} loading={loading} />
        <KpiCard label="Active Customers" value={stats.totalCustomers ?? "—"} delta={5} loading={loading} />
        <KpiCard label="Avg. Order Value" value={rupee(stats.avgOrderValue)} delta={-3} loading={loading} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr min(260px, 40%)", gap: "1.25rem", marginBottom: "2rem" }}>
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "1rem", color: "var(--color-ink)" }}>Revenue Trend</div>
          {loading
            ? <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
            : <Line data={lineData} options={chartOptions} />
          }
        </div>
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "1rem", color: "var(--color-ink)" }}>Sales by Category</div>
          {loading
            ? <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
            : <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { color: "#6B615B", font: { size: 11 } } } } }} />
          }
        </div>
      </div>

      {/* Low stock action list */}
      {(loading || lowStock.length > 0) && (
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Warning size={18} weight="fill" color="var(--color-warning)" />
            <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-ink)" }}>Low Stock Alert</span>
            {stats.lowStockCount > 0 && <span className="chip-warning">{stats.lowStockCount} items</span>}
          </div>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 40, borderRadius: 8, marginBottom: "0.5rem" }} />)
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Category</th><th>Stock</th><th></th></tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td><span className={p.stock === 0 ? "chip-error" : "chip-warning"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span></td>
                    <td><Link to="/admin/inventory" style={{ fontSize: "0.8125rem", color: "var(--color-primary-500)", fontWeight: 600 }}>Edit →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
