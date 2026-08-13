const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  submitSkinQuiz,
  getRecommendations,
  shadeFinder,
  similarProducts,
  trending,
  chat,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "AI request rate limit exceeded. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public smart features
router.get("/trending", trending);
router.get("/similar/:productId", similarProducts);
router.post("/chat", aiLimiter, chat);

// Personalized (auth optional but recommended — quiz/shade save to profile if logged in)
router.post("/skin-quiz", aiLimiter, submitSkinQuiz);
router.post("/shade-finder", aiLimiter, shadeFinder);
router.get("/recommendations", protect, getRecommendations);

module.exports = router;
