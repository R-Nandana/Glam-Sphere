import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import api from "../../api/axios";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminRevenue() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    api.get("/admin/revenue-report").then(({ data }) => setReport(data.report));
  }, []);

  const barData = {
    labels: report.map((r) => `${MONTHS[r._id.month - 1]} ${r._id.year}`),
    datasets: [{ label: "Revenue", data: report.map((r) => r.revenue), backgroundColor: "#E8527A", borderRadius: 6 }],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Revenue Reports</h1>
      <div className="card p-5 mb-5">
        <Bar data={barData} />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EFE1E0] text-left text-[#6B5760]">
              <th className="p-4">Month</th><th className="p-4">Revenue</th><th className="p-4">Orders</th><th className="p-4">Avg. Order Value</th>
            </tr>
          </thead>
          <tbody>
            {report.map((r, i) => (
              <tr key={i} className="border-b border-[#EFE1E0]">
                <td className="p-4 font-semibold">{MONTHS[r._id.month - 1]} {r._id.year}</td>
                <td className="p-4">₹{r.revenue.toLocaleString("en-IN")}</td>
                <td className="p-4">{r.orders}</td>
                <td className="p-4">₹{Math.round(r.revenue / r.orders).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
