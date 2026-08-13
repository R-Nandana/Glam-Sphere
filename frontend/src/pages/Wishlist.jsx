import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "@phosphor-icons/react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { SkeletonGrid } from "../components/SkeletonCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import sampleProducts from "../data/sampleProducts";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const { wishlist, addToCart, toggleWishlist } = useCart();
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.get("/wishlist")
      .then(({ data }) => {
        if (isMounted) {
          if (data?.wishlist?.length > 0) {
            setItems(data.wishlist);
          } else {
            // Fallback to local wishlist matched items
            const localItems = sampleProducts.filter((p) => wishlist.includes(String(p._id)));
            setItems(localItems);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          // Offline / Guest fallback
          const localItems = sampleProducts.filter((p) => wishlist.includes(String(p._id)));
          setItems(localItems);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Load trending suggestions for empty state
    api.get("/ai/trending")
      .then(({ data }) => {
        if (isMounted) setSuggestions((data.items || sampleProducts.filter((p) => p.trending)).slice(0, 4));
      })
      .catch(() => {
        if (isMounted) setSuggestions(sampleProducts.filter((p) => p.trending).slice(0, 4));
      });

    return () => {
      isMounted = false;
    };
  }, [wishlist]);

  const handleMoveToBag = async (productId, name) => {
    try {
      await addToCart(productId);
      await toggleWishlist(productId);
      toast.success(`${name} moved to your bag!`);
    } catch {
      toast.error("Couldn't move item — please try again");
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: "3rem" }}>
        <div className="skeleton" style={{ height: 36, width: 200, borderRadius: 8, marginBottom: "1.5rem" }} />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-surface)", paddingBottom: "4rem", minHeight: "75vh" }}>
      <div className="page-container" style={{ paddingTop: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 400,
            marginBottom: "2rem",
          }}
        >
          Your Wishlist
          {items.length > 0 && (
            <span
              style={{
                fontSize: "1rem",
                fontFamily: "'Inter', sans-serif",
                color: "var(--color-ink-muted)",
                fontWeight: 400,
                marginLeft: "0.75rem",
              }}
            >
              ({items.length} saved)
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <>
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1rem 4rem",
                background: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                marginBottom: "3rem",
              }}
            >
              <Heart size={56} weight="thin" style={{ color: "var(--color-primary-300)", marginBottom: "1.25rem" }} />
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.625rem", marginBottom: "0.5rem" }}>
                Nothing saved yet
              </h2>
              <p style={{ color: "var(--color-ink-muted)", maxWidth: "340px", margin: "0 auto 1.75rem", lineHeight: 1.6 }}>
                Tap the heart icon on any product to save your luxury favorites here for later.
              </p>
              <Link to="/" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                Explore products
              </Link>
            </div>

            {suggestions.length > 0 && (
              <section>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-primary-500)",
                    marginBottom: "0.5rem",
                  }}
                >
                  You might like
                </div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.375rem", marginBottom: "1.25rem" }}>
                  Trending right now
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                  {suggestions.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {items.map((p) => (
              <div key={p._id} style={{ position: "relative" }}>
                <ProductCard product={p} />
                <button
                  onClick={() => handleMoveToBag(p._id, p.name)}
                  className="btn-outline"
                  style={{
                    width: "calc(100% - 1.75rem)",
                    margin: "0.5rem 0.875rem 0",
                    padding: "0.5rem",
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    background: "var(--color-primary-50)",
                    borderColor: "var(--color-primary-300)",
                    color: "var(--color-primary-800)",
                  }}
                >
                  <ShoppingBag size={14} /> Move to bag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
