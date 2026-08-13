const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;
