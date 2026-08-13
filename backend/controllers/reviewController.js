const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, { ratingAvg: Math.round(avg * 10) / 10, ratingCount: count });
};

// @desc  Get reviews for a product
// @route GET /api/products/:id/reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate("user", "name").sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

// @desc  Create a review (must have purchased to be marked verified)
// @route POST /api/products/:id/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.id;

  const purchased = await Order.exists({
    user: req.user._id,
    "items.product": productId,
    status: "Delivered",
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    title,
    comment,
    verifiedPurchase: !!purchased,
  });

  await recalcProductRating(productId);
  res.status(201).json({ success: true, review });
});

module.exports = { getProductReviews, createReview };
