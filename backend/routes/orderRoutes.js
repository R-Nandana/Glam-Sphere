const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);

router.post("/", placeOrder);
router.get("/mine", getMyOrders);
router.get("/:id", getOrderById);

// Admin order tracking
router.get("/", adminOnly, getAllOrders);
router.patch("/:id/status", adminOnly, updateOrderStatus);

module.exports = router;
