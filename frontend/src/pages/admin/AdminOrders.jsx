import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/orders", { params: { limit: 50 } }).then(({ data }) => setOrders(data.orders));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EFE1E0] text-left text-[#6B5760]">
              <th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-[#EFE1E0]">
                <td className="p-4 font-semibold">{o.orderNumber}</td>
                <td className="p-4">{o.user?.name}</td>
                <td className="p-4">₹{o.totalPrice}</td>
                <td className="p-4">
                  <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)} className="chip px-2 py-1 text-xs">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
