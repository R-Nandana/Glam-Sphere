import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Cart() {
  const { cart, updateQty, removeItem } = useCart();
  const items = cart.items || [];
  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Bag</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 text-[#6B5760]">Your bag is empty.</div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i._id} className="card p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold">{i.product?.name}</div>
                  <div className="text-sm text-[#6B5760]">{i.product?.brand}</div>
                </div>
                <div className="flex items-center gap-2 chip px-2 py-1">
                  <button onClick={() => updateQty(i._id, i.qty - 1)}>−</button>
                  <span className="w-4 text-center">{i.qty}</span>
                  <button onClick={() => updateQty(i._id, i.qty + 1)}>+</button>
                </div>
                <div className="font-bold w-20 text-right">{rupee((i.product?.price || 0) * i.qty)}</div>
                <button onClick={() => removeItem(i._id)} className="text-[#6B5760]">✕</button>
              </div>
            ))}
          </div>
          <div className="card p-5 mt-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-[#6B5760]">Subtotal</div>
              <div className="font-bold text-2xl">{rupee(total)}</div>
            </div>
            <Link to="/checkout" className="btn-primary px-6 py-3">Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}
