import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/customers", { params: { search } }).then(({ data }) => setCustomers(data.customers));
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="mb-4 px-3 py-2 rounded-lg border border-[#EFE1E0] w-full max-w-sm" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EFE1E0] text-left text-[#6B5760]">
              <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Orders</th><th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-[#EFE1E0]">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 text-[#6B5760]">{c.email}</td>
                <td className="p-4">{c.orderCount}</td>
                <td className="p-4">₹{c.totalSpent?.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
