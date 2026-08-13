const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * Content-based recommendations from a quiz result (skin type + concerns).
 * In production, swap this for a trained model / vector similarity search
 * (e.g. embeddings + cosine similarity via a vector DB), keeping this
 * function signature as the interface.
 */
const recommendBySkinProfile = async ({ skinType, concerns = [], limit = 8 }) => {
  const query = { isActive: true };
  const or = [];
  if (skinType) or.push({ skinTypes: skinType });
  if (concerns.length) or.push({ concerns: { $in: concerns } });
  if (or.length) query.$or = or;

  return Product.find(query).sort({ ratingAvg: -1, ratingCount: -1 }).limit(limit);
};

/**
 * "Similar products": same category + overlapping tags, excluding itself,
 * ranked by rating. Cheap stand-in for an embedding-similarity lookup.
 */
const findSimilarProducts = async (productId, limit = 4) => {
  const base = await Product.findById(productId);
  if (!base) return [];
  return Product.find({
    _id: { $ne: base._id },
    category: base.category,
    isActive: true,
  })
    .sort({ ratingAvg: -1 })
    .limit(limit);
};

/**
 * Trending = highest orders in the last N days, computed from Order line items.
 * Falls back to the `trending` flag if order history is sparse.
 */
const getTrendingProducts = async (limit = 8, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const agg = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.product", totalQty: { $sum: "$items.qty" } } },
    { $sort: { totalQty: -1 } },
    { $limit: limit },
  ]);

  if (agg.length) {
    const ids = agg.map((a) => a._id);
    const products = await Product.find({ _id: { $in: ids }, isActive: true });
    // preserve trending order
    return ids.map((id) => products.find((p) => p._id.equals(id))).filter(Boolean);
  }

  return Product.find({ trending: true, isActive: true }).limit(limit);
};

/**
 * Shade Finder: matches undertone + depth (0-5 scale) to the closest
 * shade variant across foundation/concealer/tint products.
 */
const findShadeMatch = async ({ undertone, depth }) => {
  const candidates = await Product.find({
    category: "Makeup",
    "shades.0": { $exists: true },
    isActive: true,
  });

  let best = null;
  let bestScore = -Infinity;

  for (const product of candidates) {
    for (const shade of product.shades) {
      let score = 0;
      if (shade.undertone === undertone) score += 10;
      score -= Math.abs((shade.depth ?? 0) - depth);
      if (score > bestScore) {
        bestScore = score;
        best = { product, shade };
      }
    }
  }

  if (!best) return null;
  const confidence = Math.max(50, Math.min(99, 70 + bestScore * 5));
  return { productId: best.product._id, productName: best.product.name, shade: best.shade, confidence };
};

module.exports = {
  recommendBySkinProfile,
  findSimilarProducts,
  getTrendingProducts,
  findShadeMatch,
};
