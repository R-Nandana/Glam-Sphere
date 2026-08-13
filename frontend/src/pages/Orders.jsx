import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/mine").then(({ data }) => setOrders(data.orders));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex justify-between">
              <span className="font-bold text-sm">{o.orderNumber}</span>
              <span className="text-xs font-bold chip px-2 py-1">{o.status}</span>
            </div>
            <div className="text-sm text-[#6B5760] mt-1">{new Date(o.createdAt).toLocaleDateString()} · {o.items.map((i) => i.name).join(", ")}</div>
            <div className="font-bold mt-2">₹{o.totalPrice}</div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-center py-16 text-[#6B5760]">No orders yet.</div>}
      </div>
    </div>
  );
}
