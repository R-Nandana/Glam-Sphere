import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#F1E9E8] shadow-sm">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FBDDE5] to-[#FFEBD6] flex items-center justify-center font-extrabold text-lg text-[#8A1F3D]">GS</div>
            <div className="hidden md:block">
              <div className="font-extrabold text-lg leading-none">GlamSphere</div>
              <div className="text-xs text-[#6B5760]">Beauty, thoughtfully</div>
            </div>
          </Link>
        </div>

        <form onSubmit={onSearch} className="flex-1 max-w-xl">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shades, brands, concerns..."
            className="w-full px-4 py-2 rounded-full text-sm border border-[#F0E6E5] shadow-sm"
          />
        </form>

        <nav className="flex items-center gap-3 text-sm">
          <Link to="/quiz" className="chip px-3 py-1.5">Skin Quiz</Link>
          <Link to="/shade-finder" className="chip px-3 py-1.5">Shade Finder</Link>
          <Link to="/wishlist" className="hidden sm:inline">Wishlist ({wishlist.length})</Link>
          <Link to="/cart" className="font-semibold">Bag ({cart.items?.length || 0})</Link>
          {user ? (
            <>
              <Link to="/orders" className="hidden md:inline">Orders</Link>
              {user.role === "admin" && <Link to="/admin" className="btn-outline px-3 py-1.5">Admin</Link>}
              <button onClick={logout} className="btn-outline px-3 py-1.5">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary px-4 py-2">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
