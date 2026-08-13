const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  updateStock,
} = require("../controllers/productController");
const { getProductReviews, createReview } = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/reviews", getProductReviews);

// Customer (auth required)
router.post("/:id/reviews", protect, createReview);

// Admin
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/:id/images", protect, adminOnly, upload.single("image"), uploadProductImage);
router.patch("/:id/stock", protect, adminOnly, updateStock);

module.exports = router;
