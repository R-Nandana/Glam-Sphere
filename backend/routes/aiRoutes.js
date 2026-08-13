const express = require("express");
const router = express.Router();
const {
  submitSkinQuiz,
  getRecommendations,
  shadeFinder,
  similarProducts,
  trending,
  chat,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

// Public smart features
router.get("/trending", trending);
router.get("/similar/:productId", similarProducts);
router.post("/chat", chat);

// Personalized (auth optional but recommended — quiz/shade save to profile if logged in)
router.post("/skin-quiz", submitSkinQuiz);
router.post("/shade-finder", shadeFinder);
router.get("/recommendations", protect, getRecommendations);

module.exports = router;
