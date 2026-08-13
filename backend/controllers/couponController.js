const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

// @desc  List all coupons (admin)
// @route GET /api/coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
});

// @desc  Create coupon (admin)
// @route POST /api/coupons
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc  Update coupon (admin) — e.g. toggle active, change value
// @route PUT /api/coupons/:id
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.json({ success: true, coupon });
});

// @desc  Delete coupon (admin)
// @route DELETE /api/coupons/:id
const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Coupon deleted" });
});

// @desc  Validate a coupon code at checkout (customer)
// @route GET /api/coupons/validate/:code
const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), active: true });
  if (!coupon || coupon.expiresAt < new Date()) {
    res.status(404);
    throw new Error("Coupon is invalid or expired");
  }
  res.json({ success: true, coupon });
});

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
