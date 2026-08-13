import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingBag, Heart, ArrowLeft, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

function StarRow({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={14} weight={i <= Math.round(rating) ? "fill" : "regular"} color={i <= Math.round(rating) ? "var(--color-accent)" : "var(--color-border)"} />
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedShade, setSelectedShade] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const toast = useToast();

  const load = () => {
    api.get(`/products/${id}`).then(({ data }) => { setProduct(data.product); setActiveImg(0); setSelectedShade(null); });
    api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data.reviews || []));
    api.get(`/ai/similar/${id}`).then(({ data }) => setSimilar(data.items || [])).catch(() => {});
  };

  useEffect(() => { load(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review posted!");
      load();
    } catch {
      toast.error("Could not post review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (outOfStock || adding) return;
    setAdding(true);
    try {
      await addToCart(product._id, selectedShade);
      toast.success(`${product.name} added to bag`);
    } catch {
      toast.error("Couldn't add to bag — please try again");
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  if (!product) {
    return (
      <div className="page-container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          <div className="skeleton" style={{ aspectRatio: "4/5", borderRadius: "28px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ height: "14px", width: "40%" }} />
            <div className="skeleton" style={{ height: "48px", width: "85%" }} />
            <div className="skeleton" style={{ height: "24px", width: "30%" }} />
            <div className="skeleton" style={{ height: "80px", width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [];
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock < 6;
  const isWishlisted = wishlist.includes(product._id);

  // Review histogram
  const ratingCounts = [5,4,3,2,1].map((r) => ({ r, count: reviews.filter((rv) => rv.rating === r).length }));

  return (
    <div style={{ background: "var(--color-surface)", paddingBottom: "4rem" }}>
      <div className="page-container" style={{ paddingTop: "2rem" }}>
        {/* Back */}
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--color-ink-muted)", marginBottom: "1.5rem", fontWeight: 500 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink-muted)")}
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
          {/* ── Image Gallery ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Main image */}
            <div style={{
              aspectRatio: "4/5", maxHeight: "600px", borderRadius: "28px",
              overflow: "hidden", background: "var(--color-surface-alt)",
              boxShadow: "0 18px 60px rgba(36,31,28,0.12)",
              position: "relative",
            }}>
              {images.length > 0 ? (
                <img src={images[activeImg].url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="img-placeholder" style={{ width: "100%", height: "100%" }}>{product.category}</div>
              )}
              {/* Discount badge */}
              {discount > 0 && (
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span className="badge-discount">{discount}% off</span>
                </div>
              )}
              {product.trending && (
                <div style={{ position: "absolute", top: discount > 0 ? "3rem" : "1rem", left: "1rem" }}>
                  <span className="badge-ai">✦ AI Pick</span>
                </div>
              )}
            </div>
            {/* Thumbnail rail */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "0.625rem" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 64, height: 64, borderRadius: "10px", overflow: "hidden",
                      border: `2px solid ${i === activeImg ? "var(--color-primary-500)" : "var(--color-border)"}`,
                      cursor: "pointer", background: "none", padding: 0,
                      transition: "border-color 150ms",
                      flexShrink: 0,
                    }}
                  >
                    <img src={img.url} alt={`${product.name} view ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-primary-500)", marginBottom: "0.5rem" }}>
              {product.brand}
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}>
              {product.name}
            </h1>

            {/* Rating + stock */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <StarRow rating={product.ratingAvg || 0} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-ink)" }}>{(product.ratingAvg || 0).toFixed(1)}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>({reviews.length} reviews)</span>
              </div>
              {outOfStock ? (
                <span className="chip-error" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <WarningCircle size={12} weight="fill" /> Out of stock
                </span>
              ) : lowStock ? (
                <span className="chip-warning">Only {product.stock} left!</span>
              ) : (
                <span className="chip-success" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <CheckCircle size={12} weight="fill" /> In stock
                </span>
              )}
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "2rem", fontVariantNumeric: "tabular-nums" }}>
                {rupee(product.price)}
              </span>
              {product.mrp > product.price && (
                <span style={{ fontSize: "1.0625rem", textDecoration: "line-through", color: "var(--color-ink-muted)", fontVariantNumeric: "tabular-nums" }}>
                  {rupee(product.mrp)}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--color-ink-muted)", marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {product.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="chip" style={{ padding: "0.25rem 0.75rem", fontSize: "0.8125rem" }}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Shade swatches */}
            {product.shades?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-ink)" }}>
                  Shade: {selectedShade ? <span style={{ color: "var(--color-ink-muted)", fontWeight: 400 }}>{selectedShade.name}</span> : <span style={{ color: "var(--color-ink-muted)", fontWeight: 400 }}>Select a shade</span>}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                  {product.shades.map((s, i) => (
                    <button
                      key={i}
                      title={s.name}
                      onClick={() => setSelectedShade(s.name === selectedShade?.name ? null : s)}
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: s.hex,
                        border: `2px solid ${selectedShade?.name === s.name ? "var(--color-ink)" : "transparent"}`,
                        outline: selectedShade?.name === s.name ? "2px solid var(--color-ink)" : "2px solid transparent",
                        outlineOffset: "2px",
                        cursor: "pointer",
                        transition: "outline 150ms, transform 150ms",
                        boxShadow: "0 1px 4px rgba(36,31,28,0.15)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
              <button
                onClick={handleAddToCart}
                disabled={outOfStock || adding}
                className="btn-primary"
                style={{ flex: 1, padding: "0.875rem 1.5rem", fontSize: "1rem', display: 'flex", gap: "0.5rem", alignItems: "center", justifyContent: "center" }}
              >
                <ShoppingBag size={18} weight="bold" />
                {outOfStock ? "Out of Stock" : adding ? "Adding…" : "Add to bag"}
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                className="btn-outline"
                style={{ padding: "0.875rem 1rem", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Heart size={20} weight={isWishlisted ? "fill" : "regular"} color={isWishlisted ? "var(--color-primary-500)" : undefined} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Reviews ─────────────────────────────────── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.625rem", marginBottom: "1.5rem" }}>
            Customer Reviews
          </h2>

          {reviews.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "2rem", marginBottom: "2rem", alignItems: "start" }}>
              {/* Average */}
              <div style={{ textAlign: "center", padding: "1.5rem", borderRadius: "16px", background: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "3.5rem", fontWeight: 300, lineHeight: 1, color: "var(--color-ink)" }}>
                  {(product.ratingAvg || 0).toFixed(1)}
                </div>
                <StarRow rating={product.ratingAvg || 0} />
                <div style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", marginTop: "0.375rem" }}>{reviews.length} reviews</div>
              </div>
              {/* Histogram */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center" }}>
                {ratingCounts.map(({ r, count }) => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.8125rem", width: "1.5rem", textAlign: "right", color: "var(--color-ink-muted)" }}>{r}★</span>
                    <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "var(--color-border)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "4px",
                        background: "var(--color-accent)",
                        width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%",
                        transition: "width 600ms ease-out",
                      }} />
                    </div>
                    <span style={{ fontSize: "0.8125rem", color: "var(--color-ink-muted)", width: "1.5rem" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Write review form */}
          <form onSubmit={submitReview} style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.875rem",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="field"
              style={{ width: "auto", minWidth: "100px" }}
            >
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
            <input
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your experience with this product…"
              className="field"
              style={{ flex: 1, minWidth: "200px" }}
              required
            />
            <button className="btn-primary" disabled={submittingReview} style={{ padding: "0.625rem 1.25rem", whiteSpace: "nowrap" }}>
              {submittingReview ? "Posting…" : "Post review"}
            </button>
          </form>

          {/* Review list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {reviews.map((r) => (
              <div key={r._id} style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "1.125rem 1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{r.user?.name || "Anonymous"}</span>
                    <span className="chip-success" style={{ marginLeft: "0.75rem" }}>Verified</span>
                  </div>
                  <StarRow rating={r.rating} />
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--color-ink-muted)", lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                {r.createdAt && (
                  <div style={{ fontSize: "0.75rem", color: "var(--color-border)", marginTop: "0.5rem" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-ink-muted)", fontSize: "0.9375rem" }}>
                No reviews yet — be the first to leave one!
              </div>
            )}
          </div>
        </section>

        {/* ── Similar products ─────────────────────────── */}
        {similar.length > 0 && (
          <section>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: "1.625rem", marginBottom: "1.25rem" }}>
              You may also like
            </h2>
            <div className="h-carousel md:grid md:grid-cols-4" style={{ gap: "1.25rem" }}>
              {similar.map((p) => (
                <div key={p._id} style={{ minWidth: "220px" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile add-to-cart bar */}
      {!outOfStock && (
        <div className="md:hidden" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
          background: "rgba(251,247,243,0.95)", backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--color-border)",
          padding: "0.875rem clamp(1rem,4vw,1.5rem)",
          display: "flex", alignItems: "center", gap: "1rem",
        }}>
          <div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-ink)", fontVariantNumeric: "tabular-nums" }}>{rupee(product.price)}</div>
            {product.mrp > product.price && (
              <div style={{ fontSize: "0.8125rem", textDecoration: "line-through", color: "var(--color-ink-muted)" }}>{rupee(product.mrp)}</div>
            )}
          </div>
          <button onClick={handleAddToCart} disabled={adding} className="btn-primary" style={{ flex: 1, padding: "0.75rem" }}>
            <ShoppingBag size={16} weight="bold" style={{ marginRight: "0.5rem" }} />
            {adding ? "Adding…" : "Add to bag"}
          </button>
        </div>
      )}
    </div>
  );
}
