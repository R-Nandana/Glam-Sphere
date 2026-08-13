const asyncHandler = require("express-async-handler");
const {
  recommendBySkinProfile,
  findSimilarProducts,
  getTrendingProducts,
  findShadeMatch,
} = require("../utils/recommendationEngine");
const { getChatbotReply } = require("../utils/chatbotService");

// @desc  Submit skin quiz answers, get back a skin type + save to profile
// @route POST /api/ai/skin-quiz
const submitSkinQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body; // { feel, pores, sensitivity, goal }
  const vals = Object.values(answers || {}).join(" ").toLowerCase();

  let skinType = "Normal";
  if ((vals.match(/oily|greasy/g) || []).length >= 2) skinType = "Oily";
  else if ((vals.match(/tight|flaky|dry/g) || []).length >= 2) skinType = "Dry";
  else if (vals.includes("t-zone")) skinType = "Combination";
  else if (vals.includes("redness") || vals.includes("itch")) skinType = "Sensitive";

  if (req.user) {
    req.user.skinType = skinType;
    await req.user.save();
  }

  const recommendations = await recommendBySkinProfile({ skinType });
  res.json({ success: true, skinType, recommendations });
});

// @desc  Get personalized recommendations for the logged-in user
// @route GET /api/ai/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const { skinType, skinConcerns } = req.user;
  const recommendations = await recommendBySkinProfile({ skinType, concerns: skinConcerns });
  res.json({ success: true, recommendations });
});

// @desc  Shade Finder — match undertone + depth to a product shade
// @route POST /api/ai/shade-finder
const shadeFinder = asyncHandler(async (req, res) => {
  const { undertone, depth } = req.body;
  const match = await findShadeMatch({ undertone, depth: Number(depth) });
  if (req.user) {
    req.user.undertone = undertone;
    req.user.shadeDepth = depth;
    await req.user.save();
  }
  res.json({ success: true, match });
});

// @desc  Similar products for a given product (product detail page)
// @route GET /api/ai/similar/:productId
const similarProducts = asyncHandler(async (req, res) => {
  const items = await findSimilarProducts(req.params.productId);
  res.json({ success: true, items });
});

// @desc  Trending products (homepage)
// @route GET /api/ai/trending
const trending = asyncHandler(async (req, res) => {
  const items = await getTrendingProducts();
  res.json({ success: true, items });
});

// @desc  AI Beauty Chatbot
// @route POST /api/ai/chat
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("A message is required");
  }
  const reply = await getChatbotReply(message, { user: req.user });
  res.json({ success: true, reply });
});

module.exports = { submitSkinQuiz, getRecommendations, shadeFinder, similarProducts, trending, chat };
