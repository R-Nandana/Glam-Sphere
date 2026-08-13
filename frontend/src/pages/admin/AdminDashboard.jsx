import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale,
  ArcElement, Tooltip, Legend,
} from "chart.js";
import api from "../../api/axios";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data.stats));
    api.get("/admin/revenue-report").then(({ data }) => setRevenue(data.report));
    api.get("/admin/category-sales").then(({ data }) => setCategorySales(data.data));
  }, []);

  const lineData = {
    labels: revenue.map((r) => MONTHS[r._id.month - 1]),
    datasets: [{ label: "Revenue", data: revenue.map((r) => r.revenue), borderColor: "#E8527A", backgroundColor: "#FBDDE5", tension: 0.35 }],
  };

  const doughnutData = {
    labels: categorySales.map((c) => c._id),
    datasets: [{ data: categorySales.map((c) => c.total), backgroundColor: ["#3E9C82", "#E8527A", "#B98A3E", "#8C6470", "#6B5760"] }],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={rupee(stats.totalRevenue)} />
        <StatCard label="Total Orders" value={stats.totalOrders ?? "—"} />
        <StatCard label="Active Customers" value={stats.totalCustomers ?? "—"} />
        <StatCard label="Avg. Order Value" value={rupee(stats.avgOrderValue)} />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <div className="font-semibold mb-4">Revenue Trend</div>
          <Line data={lineData} />
        </div>
        <div className="card p-5">
          <div className="font-semibold mb-4">Sales by Category</div>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-[#6B5760]">{label}</div>
    </div>
  );
}
