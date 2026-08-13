const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc  Get wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, wishlist: user.wishlist });
});

// @desc  Toggle a product in wishlist
// @route POST /api/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  const idx = user.wishlist.findIndex((id) => id.toString() === productId);

  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(productId);

  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = { getWishlist, toggleWishlist };
