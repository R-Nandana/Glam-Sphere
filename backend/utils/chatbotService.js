/**
 * Beauty advice chatbot. Ships with a rule-based responder so the feature
 * works with zero external dependencies. To upgrade to a real LLM, set
 * AI_PROVIDER_API_KEY in .env and implement callLLM() below to call your
 * provider of choice (Anthropic, OpenAI, etc.), then flip USE_LLM to true.
 */
const USE_LLM = false;

const RULES = [
  { test: /oily/i, reply: "For oily skin, reach for lightweight, oil-free formulas with salicylic acid or niacinamide. Our Clarity Clay Cleanser is a strong start — want a full routine?" },
  { test: /dry/i, reply: "Dry skin thrives on layered hydration: a hyaluronic serum under a richer moisturizer, and lukewarm (not hot) water when cleansing." },
  { test: /routine/i, reply: "A simple starting routine — AM: cleanse, hydrating serum, SPF. PM: cleanse, treatment (like retinol), moisturizer. Want product picks for your skin type?" },
  { test: /shade|foundation|undertone/i, reply: "Try the Shade Finder — tell it your undertone and depth and I'll match you to a foundation shade with a confidence score." },
  { test: /retinol/i, reply: "Start retinol 2–3 nights a week, always follow with moisturizer, and never skip SPF the next morning — retinol raises sun sensitivity." },
  { test: /acne|breakout/i, reply: "For breakouts, look for salicylic acid or benzoyl peroxide spot treatments, and avoid over-cleansing, which can trigger more oil production." },
  { test: /hi|hello|hey/i, reply: "Hi! I'm your GlamSphere beauty advisor. Ask me about skin types, routines, ingredients, or shade matching." },
];

const ruleBasedReply = (message) => {
  const hit = RULES.find((r) => r.test.test(message));
  return hit ? hit.reply : "Good question — try our Skin Type Quiz so I can tailor advice specifically to you, or ask about a concern like acne, dryness, or dullness.";
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
