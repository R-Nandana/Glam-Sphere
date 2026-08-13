const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc  Register a new customer
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password, phone });
  generateToken(res, user._id);

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc  Login
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  generateToken(res, user._id);
  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc  Logout
// @route POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out" });
});

// @desc  Get current user profile
// @route GET /api/auth/me
const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc  Update profile (incl. skin profile used by AI features)
// @route PUT /api/auth/me
const updateProfile = asyncHandler(async (req, res) => {
  const fields = ["name", "phone", "skinType", "skinConcerns", "undertone", "shadeDepth"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) req.user[f] = req.body[f];
  });
  await req.user.save();
  res.json({ success: true, user: req.user });
});

module.exports = { registerUser, loginUser, logoutUser, getProfile, updateProfile };
