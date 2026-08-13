const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");

// @desc  Get current user's cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ success: true, cart });
});

// @desc  Add item to cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, shade, qty = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId && i.shade === shade);
  if (existing) existing.qty += qty;
  else cart.items.push({ product: productId, shade, qty });

  await cart.save();
  await cart.populate("items.product");
  res.status(201).json({ success: true, cart });
});

// @desc  Update item quantity
// @route PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }
  if (qty <= 0) item.deleteOne();
  else item.qty = qty;

  await cart.save();
  await cart.populate("items.product");
  res.json({ success: true, cart });
});

// @desc  Remove item from cart
// @route DELETE /api/cart/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items.id(req.params.itemId)?.deleteOne();
  await cart.save();
  res.json({ success: true, cart });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
