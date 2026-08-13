import React from "react";

/**
 * SkeletonCard — animated shimmer placeholder matching product card dimensions.
 * Use while product data is being fetched.
 */
export default function SkeletonCard() {
  return (
    <div className="product-card" aria-hidden="true">
      {/* Image area */}
      <div className="skeleton" style={{ aspectRatio: "4/5", width: "100%" }} />
      {/* Content */}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <div className="skeleton" style={{ height: "10px", width: "40%" }} />
        <div className="skeleton" style={{ height: "14px", width: "80%" }} />
        <div className="skeleton" style={{ height: "12px", width: "92%" }} />
        <div className="skeleton" style={{ height: "12px", width: "68%" }} />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <div className="skeleton" style={{ height: "36px", flex: 1, borderRadius: "9999px" }} />
          <div className="skeleton" style={{ height: "36px", width: "36px", borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
