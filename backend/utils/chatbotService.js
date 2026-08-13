/**
 * Beauty advice chatbot. Ships with a rule-based responder so the feature
 * works with zero external dependencies. To upgrade to a real LLM, set
 * AI_PROVIDER_API_KEY in .env and implement callLLM() below to call your
 * provider of choice (Anthropic, OpenAI, etc.), then flip USE_LLM to true.
 */
const USE_LLM = false;

const RULES = [
  { test: /oily/i, reply: "For oily skin, reach for lightweight, oil-free formulas with salicylic acid or niacinamide. Our Clarity Clay Cleanser and Dew Drop Hydra Serum are customer favorites — take our Skin Quiz for a custom match!" },
  { test: /dry/i, reply: "Dry skin thrives on layered hydration: try our Dew Drop Hydra Serum under Cloud Veil Barrier Cream to seal in ceramide-rich moisture all day." },
  { test: /sensitive/i, reply: "For sensitive skin, focus on soothing, fragrance-free barrier care like our Cloud Veil Barrier Cream with Centella and Squalane." },
  { test: /combination/i, reply: "Combination skin benefits from zone targeted care: hydrating serums on cheeks and gentle clay cleanser on your T-zone." },
  { test: /routine/i, reply: "A classic daily routine — AM: Gentle Cleanser → Hydrating Serum → Cloud Veil Moisturizer → SPF 50. PM: Double Cleanse → Treatment → Barrier Cream. Ask me for specific product recommendations!" },
  { test: /shade|foundation|undertone|depth/i, reply: "Use our AI Shade Finder! Select your undertone (Cool, Neutral, Warm) and skin depth to get your exact match with a confidence score." },
  { test: /track|order|shipping|delivery|status/i, reply: "You can track your orders anytime by clicking 'My Orders' in the navigation bar. You'll see a visual timeline from Processing to Delivered!" },
  { test: /moisturiser|moisturizer|cream/i, reply: "Cloud Veil Barrier Cream is enriched with ceramides, squalane, and centella to deeply nourish and restore your skin barrier." },
  { test: /sunscreen|spf|sun/i, reply: "Don't skip protection! Our Solar Defense Mineral Sunscreen SPF 50 offers zero white-cast broad-spectrum defense with hydrating squalane." },
  { test: /vitamin c|brightening|dark spots|glow/i, reply: "C-Glow Vitamin Nectar features 15% Vitamin C with ferulic acid to brighten dull skin and fade hyperpigmentation." },
  { test: /lipstick|lip|balm/i, reply: "Our Velvet Matte Lipstick delivers vibrant berry pigment with a weightless soft-blur finish that stays comfortable for hours." },
  { test: /quiz|skin type/i, reply: "Take our 1-minute Skin Quiz from the header menu! It analyzes your skin parameters and tailors the entire storefront to your needs." },
  { test: /retinol|aging|wrinkles/i, reply: "Start retinol 2–3 nights a week, follow with barrier cream, and always wear Solar Defense SPF 50 the next morning." },
  { test: /acne|breakout|pimples|pores/i, reply: "For breakouts, use our Clarity Clay Cleanser with kaolin clay & salicylic acid to clear pores without over-stripping." },
  { test: /hair|scalp|shampoo/i, reply: "Check out our Haircare section! Silk Repair Hair Mask restores shine while Scalp Reset Rosemary Tonic invigorates roots." },
  { test: /coupon|discount|promo|code/i, reply: "Use code GLAM10 for 10% off or WELCOME20 for 20% off orders over ₹2000 at checkout!" },
  { test: /hi|hello|hey|greetings/i, reply: "Hi there! ✨ I'm Glow, your AI beauty advisor at GlamSphere. Ask me anything about skincare, routines, shade matching, or order tracking." },
];

const ruleBasedReply = (message) => {
  const hit = RULES.find((r) => r.test.test(message));
  return hit ? hit.reply : "Great question! Take our Skin Quiz for a custom routine recommendation, or ask me about dryness, oily skin, foundation shades, or order status.";
};

// Placeholder for a real LLM integration.
const callLLM = async (message, context) => {
  throw new Error("LLM provider not configured. Set USE_LLM=false or implement callLLM().");
};

const getChatbotReply = async (message, context = {}) => {
  if (USE_LLM) {
    try {
      return await callLLM(message, context);
    } catch (err) {
      // graceful fallback if the LLM call fails
      return ruleBasedReply(message);
    }
  }
  return ruleBasedReply(message);
};

module.exports = { getChatbotReply };
