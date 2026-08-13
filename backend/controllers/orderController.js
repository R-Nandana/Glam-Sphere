const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

const generateOrderNumber = () => "GS-" + Date.now().toString().slice(-8);

// @desc  Place an order from the current cart (secure checkout)
// @route POST /api/orders
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  // Validate stock and compute totals
  let itemsPrice = 0;
  const items = [];
  for (const line of cart.items) {
    const product = line.product;
    if (!product || product.stock < line.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product?.name || "a product in your cart"}`);
    }
    itemsPrice += product.price * line.qty;
    items.push({ product: product._id, name: product.name, shade: line.shade, qty: line.qty, price: product.price });
  }

  // Apply coupon if provided
  let discountAmount = 0;
  let couponUsed = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
    if (!coupon || coupon.expiresAt < new Date()) {
      res.status(400);
      throw new Error("Coupon is invalid or expired");
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      res.status(400);
      throw new Error("Coupon usage limit reached");
    }
    discountAmount = coupon.type === "Percentage" ? (itemsPrice * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    coupon.usedCount += 1;
    await coupon.save();
    couponUsed = { code: coupon.code, discount: discountAmount };
  }

  const shippingPrice = itemsPrice > 999 ? 0 : 79;
  const totalPrice = Math.max(0, itemsPrice - discountAmount) + shippingPrice;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items,
    shippingAddress,
    coupon: couponUsed,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
    paymentMethod: paymentMethod || "razorpay",
  });

  // Decrement stock
  for (const line of cart.items) {
    await Product.findByIdAndUpdate(line.product._id, { $inc: { stock: -line.qty } });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

// @desc  Get logged-in user's order history
// @route GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc  Get single order (owner or admin)
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json({ success: true, order });
});

// @desc  List all orders (admin order tracking)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query).populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(query),
  ]);

  res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc  Update order status (admin order tracking)
// @route PATCH /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = status;
  if (status === "Delivered") order.deliveredAt = new Date();
  await order.save();
  res.json({ success: true, order });
});

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
