import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", line1: "", city: "", state: "", pincode: "", phone: "" });
  const [couponCode, setCouponCode] = useState("");
  const [placing, setPlacing] = useState(false);

  const items = cart.items || [];
  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post("/orders", { shippingAddress: address, paymentMethod: "razorpay", couponCode: couponCode || undefined });
      await refreshCart();
      navigate("/orders");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>

      {step === 1 && (
        <div className="card p-5 space-y-3">
          <input placeholder="Full name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#EFE1E0]" />
          <input placeholder="Address" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#EFE1E0]" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="px-3 py-2 rounded-lg border border-[#EFE1E0]" />
            <input placeholder="PIN code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="px-3 py-2 rounded-lg border border-[#EFE1E0]" />
          </div>
          <input placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#EFE1E0]" />
          <button onClick={() => setStep(2)} className="btn-primary w-full py-3 mt-2">Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="card p-5">
          <div className="space-y-2 mb-4">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between text-sm">
                <span>{i.product?.name} × {i.qty}</span>
                <span className="font-semibold">₹{(i.product?.price || 0) * i.qty}</span>
              </div>
            ))}
          </div>
          <input placeholder="Coupon code (optional)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#EFE1E0] mb-4" />
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-[#EFE1E0]">
            <span>Total</span><span>₹{total}</span>
          </div>
          <p className="text-xs text-[#6B5760] mt-2">
            Payment is processed via Razorpay/Stripe on the backend (see <code>paymentController.js</code>); this demo places the order directly.
          </p>
          <button onClick={placeOrder} disabled={placing} className="btn-primary w-full py-3 mt-4">
            {placing ? "Placing order..." : "Place order"}
          </button>
        </div>
      )}
    </div>
  );
}
