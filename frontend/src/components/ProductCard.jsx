import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import QuickView from "./QuickView";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

function StarRating({ rating = 0, size = 12 }) {
  return (
    <span style={{ display: "inline-flex", gap: "1px" }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={size} weight={i <= Math.round(rating) ? "fill" : "regular"} color={i <= Math.round(rating) ? "var(--color-accent)" : "var(--color-border)"} />
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const productIdStr = String(product._id || product.id || "");
  const isWishlisted = wishlist.some((id) => String(id) === productIdStr);
  const image = product.images?.[0]?.url;
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock > 0 && product.stock < 6;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || adding) return;
    setAdding(true);
    try {
      await addToCart(product._id);
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  return (
    <>
      <div className="product-card" style={{ position: "relative" }}>
        {/* Image */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Quick view ${product.name}`}
          onClick={() => setQuickOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setQuickOpen(true)}
          style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}
        >
          <div style={{
            aspectRatio: "4/5",
            background: outOfStock ? "var(--color-border)" : "var(--color-surface-alt)",
            overflow: "hidden",
            position: "relative",
          }}>
            {image ? (
              <img
                src={image}
                alt={product.name}
                loading="lazy"
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 400ms ease-out",
                  filter: outOfStock ? "saturate(0.35) brightness(0.95)" : "none",
                }}
                onMouseEnter={(e) => !outOfStock && (e.target.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            ) : (
              <div className="img-placeholder" style={{ width: "100%", height: "100%", background: "var(--color-surface-alt)" }}>
                {product.category}
              </div>
            )}

            {/* Out of stock overlay */}
            {outOfStock && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(251,247,243,0.6)",
              }}>
                <span className="badge-oos">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {product.trending && <span className="badge-ai">✦ AI Pick</span>}
            {discount > 0 && !outOfStock && <span className="badge-discount">{discount}% off</span>}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              position: "absolute", top: "0.75rem", right: "0.75rem",
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(251,247,243,0.9)",
              backdropFilter: "blur(4px)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 150ms, background 150ms",
              boxShadow: "0 2px 8px rgba(36,31,28,0.10)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Heart size={15} weight={isWishlisted ? "fill" : "regular"} color={isWishlisted ? "var(--color-primary-500)" : "var(--color-ink-muted)"} />
          </button>
        </div>

        {/* Card body */}
        <div style={{ padding: "0.875rem 1rem 1rem", display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-primary-500)" }}>
              {product.brand}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <StarRating rating={product.ratingAvg || 4.5} size={11} />
              <span style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)", fontWeight: 500 }}>
                {(product.ratingAvg || 4.5).toFixed(1)}
              </span>
            </div>
          </div>

          <Link
            to={`/products/${product._id}`}
            style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9375rem",
              lineHeight: 1.35, color: "var(--color-ink)", marginBottom: "0.25rem",
              transition: "color 150ms",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary-500)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
          >
            {product.name}
          </Link>

          <p style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", lineHeight: 1.5, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.3rem" }}>
            {product.description}
          </p>

          {lowStock && (
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-warning)", marginBottom: "0.5rem" }}>
              Only {product.stock} left!
            </div>
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.875rem" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.125rem", fontVariantNumeric: "tabular-nums", color: "var(--color-ink)" }}>
              {rupee(product.price)}
            </span>
            {product.mrp > product.price && (
              <span style={{ fontSize: "0.8125rem", textDecoration: "line-through", color: "var(--color-ink-muted)", fontVariantNumeric: "tabular-nums" }}>
                {rupee(product.mrp)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock || adding}
            className="btn-primary"
            style={{ width: "100%", padding: "0.625rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            <ShoppingBag size={15} weight="bold" />
            {outOfStock ? "Out of Stock" : adding ? "Adding…" : "Add to bag"}
          </button>
        </div>
      </div>

      <QuickView
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        toggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted}
      />
    </>
  );
}
