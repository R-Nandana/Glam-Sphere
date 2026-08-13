import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const WISHLIST_KEY = "glamsphere_wishlist";
const CART_KEY = "glamsphere_cart";

export function CartProvider({ children }) {
  const { user } = useAuth();
  
  // Local storage initializers for instant offline/demo mode compatibility
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  // Save local state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync cart from backend when user is logged in
  const refreshCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/cart");
      if (data?.cart) setCart(data.cart);
    } catch {
      // Fallback to local cart if backend fails
    }
  }, [user]);

  // Sync wishlist from backend when user is logged in
  const refreshWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/wishlist");
      if (data?.wishlist) {
        const ids = data.wishlist.map((p) => (typeof p === "string" ? p : p._id));
        setWishlist(ids);
      }
    } catch {
      // Fallback to local wishlist if backend fails
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  // Dual-mode Add to Cart
  const addToCart = async (productId, shade, qty = 1) => {
    try {
      if (user) {
        const { data } = await api.post("/cart", { productId, shade, qty });
        if (data?.cart) {
          setCart(data.cart);
          return;
        }
      }
    } catch {
      // Fallback to local state if offline or API error
    }

    // Local cart logic
    setCart((prevCart) => {
      const items = Array.isArray(prevCart?.items) ? [...prevCart.items] : [];
      const existingIdx = items.findIndex(
        (it) => (it.product?._id || it.product || it.productId) === productId && it.shade === shade
      );

      if (existingIdx > -1) {
        items[existingIdx] = {
          ...items[existingIdx],
          qty: (items[existingIdx].qty || 1) + qty,
        };
      } else {
        items.push({
          _id: "local_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
          product: productId,
          shade: shade || null,
          qty,
        });
      }

      return { ...prevCart, items };
    });
  };

  // Dual-mode Update Quantity
  const updateQty = async (itemId, qty) => {
    try {
      if (user) {
        const { data } = await api.put(`/cart/${itemId}`, { qty });
        if (data?.cart) {
          setCart(data.cart);
          return;
        }
      }
    } catch {
      // Fallback to local update
    }

    setCart((prevCart) => {
      const items = (prevCart?.items || [])
        .map((it) => (it._id === itemId ? { ...it, qty } : it))
        .filter((it) => it.qty > 0);
      return { ...prevCart, items };
    });
  };

  // Dual-mode Remove Item from Cart
  const removeItem = async (itemId) => {
    try {
      if (user) {
        const { data } = await api.delete(`/cart/${itemId}`);
        if (data?.cart) {
          setCart(data.cart);
          return;
        }
      }
    } catch {
      // Fallback to local remove
    }

    setCart((prevCart) => ({
      ...prevCart,
      items: (prevCart?.items || []).filter((it) => it._id !== itemId),
    }));
  };

  // Dual-mode Toggle Wishlist (Instantly updates UI & localStorage, syncs with API if online/user)
  const toggleWishlist = async (productId) => {
    const strId = String(productId);
    setWishlist((prev) => {
      const exists = prev.includes(strId);
      const updated = exists ? prev.filter((id) => id !== strId) : [...prev, strId];
      return updated;
    });

    if (user) {
      try {
        const { data } = await api.post(`/wishlist/${productId}`);
        if (data?.wishlist) {
          const ids = data.wishlist.map((p) => (typeof p === "string" ? p : p._id));
          setWishlist(ids);
        }
      } catch {
        // Silently retain local state if backend API request fails
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQty,
        removeItem,
        toggleWishlist,
        refreshCart,
        refreshWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
