const express = require("express");
const router = express.Router();
const { createRazorpayOrder, createStripeIntent } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/razorpay/order", createRazorpayOrder);
router.post("/stripe/intent", createStripeIntent);

module.exports = router;
