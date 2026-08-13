import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Skincare", "Makeup", "Haircare", "Fragrance", "Tools"];

export default function Home() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("relevance");
  const search = params.get("search") || "";

  useEffect(() => {
    api.get("/products", { params: { search, category, sort } }).then(({ data }) => setProducts(data.items));
  }, [search, category, sort]);

  useEffect(() => {
    api.get("/ai/trending").then(({ data }) => setTrending(data.items));
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="relative mb-10 overflow-hidden rounded-[28px] bg-ink text-white">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85"
          alt="Luxury beauty products"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />
        <div className="relative max-w-2xl px-7 py-12 md:px-10 md:py-16">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#FBDDE5]">New beauty edit</div>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">Skincare and shades, matched to you.</h1>
          <p className="mt-4 text-base leading-7 text-white/85">Explore fresh serums, glow makeup, fragrances, haircare, and tools curated for a premium GlamSphere shelf.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#catalog" className="btn-primary px-5 py-3 text-sm">Shop the edit</a>
            <a href="/quiz" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-ink">Skin quiz</a>
          </div>
        </div>
      </div>

      {trending.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Most loved</div>
              <h2 className="text-2xl font-black">Trending now</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {trending.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      <div id="catalog" className="mb-5 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`chip px-3 py-1.5 ${category === c ? "active" : ""}`}>{c}</button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="chip px-3 py-1.5 ml-auto">
          <option value="relevance">Sort: Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-[#6B5760]">No products found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
