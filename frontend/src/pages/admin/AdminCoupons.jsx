import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", type: "Percentage", value: 10, expiresAt: "" });

  const load = () => api.get("/coupons").then(({ data }) => setCoupons(data.coupons));
  useEffect(() => { load(); }, []);

  const createCoupon = async (e) => {
    e.preventDefault();
    await api.post("/coupons", form);
    setForm({ code: "", type: "Percentage", value: 10, expiresAt: "" });
    load();
  };

  const toggleActive = async (c) => {
    await api.put(`/coupons/${c._id}`, { active: !c.active });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coupons</h1>

      <form onSubmit={createCoupon} className="card p-4 mb-6 flex flex-wrap gap-3 items-end">
        <input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="px-3 py-2 rounded-lg border border-[#EFE1E0]" required />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded-lg border border-[#EFE1E0]">
          <option>Percentage</option><option>Flat</option>
        </select>
        <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-[#EFE1E0] w-28" required />
        <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="px-3 py-2 rounded-lg border border-[#EFE1E0]" required />
        <button className="btn-primary px-4 py-2">Add coupon</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EFE1E0] text-left text-[#6B5760]">
              <th className="p-4">Code</th><th className="p-4">Type</th><th className="p-4">Value</th><th className="p-4">Uses</th><th className="p-4">Expires</th><th className="p-4">Active</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-[#EFE1E0]">
                <td className="p-4 font-bold">{c.code}</td>
                <td className="p-4">{c.type}</td>
                <td className="p-4">{c.type === "Percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-4">{c.usedCount}</td>
                <td className="p-4">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button onClick={() => toggleActive(c)} className="chip px-2 py-1 text-xs">{c.active ? "Active" : "Paused"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
