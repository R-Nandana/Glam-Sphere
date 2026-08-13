import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product._id);
  const image = product.images?.[0]?.url;
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="group bg-white border border-[#EFE1E0] rounded-[20px] overflow-hidden flex flex-col shadow-[0_14px_45px_rgba(42,27,34,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(42,27,34,0.13)]">
      <Link to={`/products/${product._id}`} className="relative block">
        <div className="aspect-[4/5] bg-[#F3ECEB] flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          ) : (
            <span className="text-xs text-[#6B5760]">{product.category}</span>
          )}
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          {product.trending && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-accent shadow-sm">Trending</span>}
          {discount > 0 && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">{discount}% off</span>}
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A1F3D]">{product.brand}</div>
          <div className="text-xs font-semibold text-gold">{(product.ratingAvg || 4.5).toFixed(1)} ★</div>
        </div>
        <Link to={`/products/${product._id}`} className="mt-1 font-bold leading-snug text-ink hover:text-accent">{product.name}</Link>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-[#6B5760]">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="font-extrabold text-lg">{rupee(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs line-through text-[#6B5760]">{rupee(product.mrp)}</span>
          )}
        </div>
        <div className="mt-auto pt-3 flex gap-2">
          <button onClick={() => addToCart(product._id)} className="btn-primary flex-1 py-2.5 text-sm">Add to bag</button>
          <button onClick={() => toggleWishlist(product._id)} className={`h-10 w-10 rounded-full border-2 text-lg font-bold transition ${isWishlisted ? "border-accent bg-accent-soft text-accent" : "border-[#EFE1E0] text-ink hover:border-ink"}`} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
