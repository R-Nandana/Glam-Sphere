const express = require("express");
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/validate/:code", protect, validateCoupon);

router.use(protect, adminOnly);
router.get("/", getCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
