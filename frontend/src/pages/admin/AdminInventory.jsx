import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);

  const load = () => api.get("/products", { params: { limit: 100 } }).then(({ data }) => setProducts(data.items));
  useEffect(() => { load(); }, []);

  const adjustStock = async (id, delta) => {
    await api.patch(`/products/${id}/stock`, { delta });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EFE1E0] text-left text-[#6B5760]">
              <th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-[#EFE1E0]">
                <td className="p-4 font-semibold">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <span className={`chip px-2 py-1 text-xs ${p.stock < 15 ? "text-red-600" : "text-mint"}`}>{p.stock < 15 ? "Low stock" : "In stock"}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 chip px-2 py-1 w-fit">
                    <button onClick={() => adjustStock(p._id, -1)}>−</button>
                    <button onClick={() => adjustStock(p._id, 1)}>+</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
