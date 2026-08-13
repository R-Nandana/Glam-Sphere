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
      {/* Hero / Brand Statement */}
      <section className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF0F4] via-[#FFF7F2] to-white p-6 shadow-md">
        <div className="flex flex-col-reverse md:flex-row items-center gap-6">
          <div className="md:w-1/2">
            <div className="mb-2 text-sm font-semibold text-[#8A1F3D] uppercase tracking-wide">Curated for you</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink">Beauty that feels personal — not generic.</h1>
            <p className="mt-4 text-base text-[#6B5760]">We blend clean science and playful glamour to help you discover products that actually suit your skin, style, and story.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#catalog" className="btn-primary px-5 py-3">Shop curated</a>
              <a href="/quiz" className="btn-outline px-5 py-3">Take the skin quiz</a>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden bg-white shadow-lg">
              <img src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80" alt="hero" className="w-full h-64 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-black">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`flex flex-col items-center gap-2 p-3 rounded-xl transition hover:scale-[1.03] ${category === c ? 'ring-2 ring-accent' : 'bg-white'}`}>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-100 to-amber-100 flex items-center justify-center text-xl font-bold text-accent">{c[0]}</div>
              <div className="text-sm font-semibold text-ink">{c}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Spotlight */}
      {trending.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent">Editors pick</div>
              <h2 className="text-2xl font-black">Spotlight</h2>
            </div>
            <a href="#catalog" className="text-sm font-semibold text-accent">View all trending →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {trending.slice(0, 3).map((p) => (
              <div key={p._id} className="rounded-2xl overflow-hidden bg-white p-4 shadow-md">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catalog controls */}
      <div id="catalog" className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`chip px-3 py-1.5 ${category === c ? "active" : ""}`}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="chip px-3 py-1.5 ml-auto">
          <option value="relevance">Sort: Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product grid */}
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
