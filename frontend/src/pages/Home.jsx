import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Sparkle, ArrowRight, Fire, Brain } from "@phosphor-icons/react";
import api from "../api/axios";
import sampleProducts from "../data/sampleProducts";
import ProductCard from "../components/ProductCard";
import { SkeletonGrid } from "../components/SkeletonCard";
import { useAuth } from "../context/AuthContext";
import useTitle from "../hooks/useTitle";

const CATEGORIES = ["All", "Skincare", "Makeup", "Haircare", "Fragrance", "Tools"];

const categoryEmoji = { All: "✦", Skincare: "🌿", Makeup: "💄", Haircare: "🪐", Fragrance: "🌸", Tools: "✦" };

export default function Home() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [offline, setOffline] = useState(false);
  const search = params.get("search") || "";
  useTitle(search ? `Search: ${search}` : "GlamSphere — AI-Powered Personalised Beauty");

  useEffect(() => {
    setLoadingProducts(true);
    api.get("/products", { params: { search, category, sort } })
      .then(({ data }) => {
        if (data.items?.length > 0) setProducts(data.items);
        else { setProducts(sampleProducts); setOffline(true); }
      })
      .catch(() => { setProducts(sampleProducts); setOffline(true); })
      .finally(() => setLoadingProducts(false));
  }, [search, category, sort]);

  useEffect(() => {
    setLoadingTrending(true);
    api.get("/ai/trending")
      .then(({ data }) => {
        if (data.items?.length > 0) setTrending(data.items);
        else { setTrending(sampleProducts.filter((p) => p.trending)); setOffline(true); }
      })
      .catch(() => { setTrending(sampleProducts.filter((p) => p.trending)); setOffline(true); })
      .finally(() => setLoadingTrending(false));
  }, []);

  return (
    <div style={{ background: "var(--color-surface)" }}>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-800) 60%, #5A1E26 100%)",
        color: "var(--color-primary-50)",
        padding: "5rem clamp(1rem,4vw,1.5rem) 6rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "5%", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle, rgba(222,156,160,0.1) 0%, transparent 65%)" }} />
        </div>

        <div className="page-container" style={{ position: "relative", maxWidth: "1200px" }}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-7" style={{ maxWidth: "640px" }}>
              <div className="eyebrow" style={{ color: "var(--color-accent)", marginBottom: "1.25rem" }}>
                AI-Powered Personalization
              </div>
              <h1 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "#FBF0F0",
                margin: "0 0 1.25rem",
              }}>
                Beauty that feels{" "}
                <em style={{ fontStyle: "italic", color: "var(--color-primary-300)" }}>personal</em>
                {" "}—{" "}not generic.
              </h1>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.65, color: "var(--color-primary-100)", opacity: 0.88, maxWidth: "520px", marginBottom: "2rem" }}>
                We blend clean science and personalized AI to help you discover products that actually suit your skin, shade, and story.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem" }}>
                <a href="#catalog" className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "0.9375rem", background: "var(--color-accent)", color: "var(--color-ink)" }}>
                  Shop curated
                </a>
                <Link to="/quiz" className="btn-outline" style={{
                  padding: "0.875rem 2rem", fontSize: "0.9375rem",
                  borderColor: "rgba(243,217,218,0.35)", color: "var(--color-primary-100)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-primary-100)"; e.currentTarget.style.background = "rgba(251,240,240,0.08)"; e.currentTarget.style.color = "var(--color-primary-50)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(243,217,218,0.35)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-primary-100)"; }}
                >
                  Take the skin quiz
                </Link>
              </div>
              {/* Trust badges */}
              <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                {[["10k+", "Happy customers"], ["500+", "Curated products"], ["AI", "Personalised picks"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, color: "var(--color-accent)", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-primary-300)", marginTop: "0.25rem", fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 hidden lg:block" style={{ position: "relative" }}>
              <div style={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                border: "1px solid rgba(243,217,218,0.2)",
                aspectRatio: "4/5",
              }}>
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85"
                  alt="GlamSphere Luxury Cosmetics"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(61,18,21,0.6) 0%, transparent 50%)",
                }} />

                {/* Floating Glassmorphism AI Recommendation Badge */}
                <div style={{
                  position: "absolute", bottom: "1.25rem", left: "1.25rem", right: "1.25rem",
                  background: "rgba(36, 31, 28, 0.75)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(243,217,218,0.25)",
                  borderRadius: "16px",
                  padding: "0.875rem 1.125rem",
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  color: "#FFFFFF",
                }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "12px",
                    background: "var(--color-primary-500)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Sparkle size={22} weight="fill" style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", fontWeight: 700 }}>
                      ✦ 98% Match Guarantee
                    </div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, fontFamily: "'Fraunces', serif" }}>
                      Dew Drop Hydra Serum
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        {offline && (
          <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", borderRadius: "10px", background: "var(--color-accent-soft)", border: "1px solid rgba(201,162,39,0.2)", fontSize: "0.875rem", color: "var(--color-warning)" }}>
            Demo mode — backend unavailable. Showing sample products.
          </div>
        )}

        {/* ── Trending Spotlight ────────────────────────── */}
        {(loadingTrending || trending.length > 0) && (
          <section style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <Fire size={13} weight="fill" /> Trending now
                </div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 400, margin: 0 }}>
                  Editor's Spotlight
                </h2>
              </div>
              <a href="#catalog" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-primary-500)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                View all <ArrowRight size={14} weight="bold" />
              </a>
            </div>
            {loadingTrending ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="h-carousel md:grid md:grid-cols-3" style={{ gap: "1.25rem" }}>
                {trending.slice(0, 3).map((p) => (
                  <div key={p._id} style={{ minWidth: "260px" }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Personalized section if logged in with skin type */}
        {user?.skinType && !loadingProducts && products.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div>
                <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <Brain size={13} weight="fill" /> AI Picks for you
                </div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, margin: 0 }}>
                  Because you have <em style={{ fontStyle: "italic", color: "var(--color-primary-500)" }}>{user.skinType}</em> skin
                </h2>
              </div>
            </div>
            <div className="h-carousel md:grid md:grid-cols-4" style={{ gap: "1rem" }}>
              {products.filter((p) => p.skinTypes?.includes(user.skinType)).slice(0, 4).map((p) => (
                <div key={p._id} style={{ minWidth: "220px" }}><ProductCard product={p} /></div>
              ))}
            </div>
          </section>
        )}

        {/* ── Browse by Category ────────────────────────── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, marginBottom: "1rem" }}>
            Browse by category
          </h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? "chip active" : "chip"}
                style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span>{categoryEmoji[c] || c[0]}</span>
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* ── Catalog ───────────────────────────────────── */}
        <div id="catalog" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.375rem", fontWeight: 400, margin: 0 }}>
            {search ? `Results for "${search}"` : category === "All" ? "All Products" : category}
          </h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="chip"
            style={{ padding: "0.5rem 1rem" }}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {loadingProducts ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
            <Sparkle size={48} weight="thin" style={{ color: "var(--color-primary-300)", marginBottom: "1rem" }} />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400, color: "var(--color-ink)", marginBottom: "0.5rem" }}>
              Nothing found
            </div>
            <p style={{ color: "var(--color-ink-muted)" }}>Try a different search term or browse all categories.</p>
            <button onClick={() => setCategory("All")} className="btn-primary" style={{ marginTop: "1.25rem", padding: "0.75rem 1.5rem" }}>
              Browse all
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 animate-fadeIn">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
