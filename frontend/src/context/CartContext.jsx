import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);

  const refreshCart = useCallback(async () => {
    if (!user) return setCart({ items: [] });
    const { data } = await api.get("/cart");
    setCart(data.cart);
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) return setWishlist([]);
    const { data } = await api.get("/wishlist");
    setWishlist(data.wishlist.map((p) => p._id));
  }, [user]);

  useEffect(() => { refreshCart(); refreshWishlist(); }, [refreshCart, refreshWishlist]);

  const addToCart = async (productId, shade, qty = 1) => {
    const { data } = await api.post("/cart", { productId, shade, qty });
    setCart(data.cart);
  };

  const updateQty = async (itemId, qty) => {
    const { data } = await api.put(`/cart/${itemId}`, { qty });
    setCart(data.cart);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data.cart);
  };

  const toggleWishlist = async (productId) => {
    const { data } = await api.post(`/wishlist/${productId}`);
    setWishlist(data.wishlist.map((id) => id.toString()));
  };

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, updateQty, removeItem, toggleWishlist, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
