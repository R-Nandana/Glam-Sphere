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
    <header className="sticky top-0 z-40 bg-[rgba(251,245,243,0.92)] backdrop-blur border-b border-[#EFE1E0]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="font-bold text-xl">GlamSphere</Link>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shades, brands, concerns..."
            className="w-full px-4 py-2 rounded-full text-sm border border-[#EFE1E0]"
          />
        </form>

        <nav className="flex items-center gap-3 text-sm">
          <Link to="/quiz" className="chip px-3 py-1.5">Skin Quiz</Link>
          <Link to="/shade-finder" className="chip px-3 py-1.5">Shade Finder</Link>
          <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
          <Link to="/cart">Bag ({cart.items?.length || 0})</Link>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
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
