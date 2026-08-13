const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, logoutUser, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many attempts from this IP. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;
