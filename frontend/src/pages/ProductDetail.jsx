import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const { addToCart } = useCart();

  const load = () => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
    api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data.reviews));
    api.get(`/ai/similar/${id}`).then(({ data }) => setSimilar(data.items));
  };

  useEffect(() => { load(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    await api.post(`/products/${id}/reviews`, reviewForm);
    setReviewForm({ rating: 5, comment: "" });
    load();
  };

  if (!product) return <div className="max-w-[1000px] mx-auto px-6 py-10">Loading...</div>;

  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10">
        <div className="relative aspect-[4/5] max-h-[620px] bg-[#F3ECEB] rounded-[28px] flex items-center justify-center overflow-hidden shadow-[0_18px_60px_rgba(42,27,34,0.12)]">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#6B5760]">{product.category}</span>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            {product.trending && <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-accent shadow-sm">Trending</span>}
            {discount > 0 && <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-sm">{discount}% off</span>}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.14em] text-accent">{product.brand}</div>
          <h1 className="text-4xl font-black leading-tight mt-2">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-white px-3 py-1.5 font-bold text-gold shadow-sm">{product.ratingAvg?.toFixed(1) || "—"} ★</span>
            <span className="text-[#6B5760]">{product.ratingCount || 0} reviews</span>
            <span className="text-[#6B5760]">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-black text-3xl">{rupee(product.price)}</span>
            {product.mrp > product.price && <span className="line-through text-[#6B5760]">{rupee(product.mrp)}</span>}
          </div>
          <p className="mt-5 text-lg leading-8 text-[#6B5760]">{product.description}</p>
          {product.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="chip px-3 py-1.5 text-xs text-[#6B5760]">#{tag}</span>
              ))}
            </div>
          )}
          {product.shades?.length > 0 && (
            <div className="mt-5">
              <div className="font-semibold text-sm mb-2">Shades</div>
              <div className="flex gap-2">
                {product.shades.map((s, i) => (
                  <span key={i} title={s.name} className="w-7 h-7 rounded-full border-2 border-white shadow" style={{ background: s.hex }} />
                ))}
              </div>
            </div>
          )}
          <button onClick={() => addToCart(product._id)} className="btn-primary w-full py-3.5 mt-7">Add to bag</button>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>
        <form onSubmit={submitReview} className="card p-4 mb-4 flex gap-3 items-start">
          <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="border border-[#EFE1E0] rounded-lg px-2 py-2 text-sm">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
          </select>
          <input
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            placeholder="Write a review..."
            className="flex-1 border border-[#EFE1E0] rounded-lg px-3 py-2 text-sm"
          />
          <button className="btn-primary px-4 py-2 text-sm">Post</button>
        </form>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex justify-between text-sm font-semibold"><span>{r.user?.name}</span><span>{r.rating} ★</span></div>
              <p className="text-sm text-[#6B5760] mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">You may also like</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {similar.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
