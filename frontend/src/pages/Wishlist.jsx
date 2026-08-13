import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/wishlist").then(({ data }) => setItems(data.wishlist));
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 text-[#6B5760]">Nothing saved yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
