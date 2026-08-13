import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function QuickView({ product, open, onClose, toggleWishlist, isWishlisted }) {
  const { addToCart } = useCart();
  const [idx, setIdx] = useState(0);
  if (!product) return null;

  const images = product.images || [];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} role="dialog" aria-modal="true">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-[#FBF5F3] p-4 flex items-center justify-center">
            {images.length > 0 ? (
              <div className="w-full">
                <div className="relative">
                  <img src={images[idx].url} alt={product.name} className="w-full h-80 object-cover rounded-lg" />
                  {images.length > 1 && (
                    <>
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow" onClick={() => setIdx((idx - 1 + images.length) % images.length)}>◀</button>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow" onClick={() => setIdx((idx + 1) % images.length)}>▶</button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-[#6B5760]">No image</div>
            )}
          </div>

          <div className="md:w-1/2 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-[#8A1F3D]">{product.brand}</div>
                <h3 className="text-lg font-extrabold">{product.name}</h3>
              </div>
              <button onClick={onClose} className="text-2xl leading-none">✕</button>
            </div>

            <p className="text-sm text-[#6B5760]">{product.description}</p>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-extrabold">{rupee(product.price)}</div>
              {product.mrp > product.price && <div className="text-sm line-through text-[#6B5760]">{rupee(product.mrp)}</div>}
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={() => { addToCart(product._id); onClose(); }} className="btn-primary flex-1 py-2">Add to bag</button>
              <button onClick={() => { toggleWishlist(product._id); }} className={`h-10 w-10 rounded-full border-2 ${isWishlisted ? 'border-accent bg-accent-soft text-accent' : 'border-[#EFE1E0]'}`}>{isWishlisted ? '♥' : '♡'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
