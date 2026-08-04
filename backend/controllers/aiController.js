const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

/**
 * Lightweight, dependency-free "AI" helpers so the project runs out of the
 * box with no external API key. Both functions are written so the internal
 * logic can be swapped 1:1 for a real LLM call (e.g. the Anthropic Messages
 * API) later without touching the routes or the frontend contract.
 */

const SPICE_PHRASES = {
  mild: "gently spiced",
  medium: "warmly spiced",
  spicy: "fired up with a bold, spicy kick",
};

const DIET_PHRASES = {
  veg: "a comforting vegetarian favorite",
  nonveg: "a hearty, protein-packed classic",
  vegan: "a wholesome plant-based dish",
};

function generateDescription({ name, cuisineType = "home-style", spiceLevel = "medium", dietType = "veg", tags = [] }) {
  const spice = SPICE_PHRASES[spiceLevel] || SPICE_PHRASES.medium;
  const diet = DIET_PHRASES[dietType] || DIET_PHRASES.veg;
  const tagLine = tags.length ? ` Notes of ${tags.slice(0, 3).join(", ")}.` : "";

  return `${name} — ${diet}, made ${cuisineType} style and ${spice}, prepared fresh the way it's done at home.${tagLine}`;
}

const POSITIVE_WORDS = [
  "delicious", "tasty", "great", "amazing", "love", "fresh", "authentic", "warm",
  "excellent", "best", "flavorful", "homely", "good", "perfect", "fantastic", "recommend",
];
const NEGATIVE_WORDS = [
  "bland", "cold", "late", "bad", "worst", "stale", "oily", "salty", "disappointing",
  "terrible", "rude", "slow", "poor", "awful", "undercooked", "overpriced",
];

function analyzeReview(text = "") {
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  let score = 0;
  words.forEach((w) => {
    if (POSITIVE_WORDS.includes(w)) score += 1;
    if (NEGATIVE_WORDS.includes(w)) score -= 1;
  });

  let sentiment = "neutral";
  if (score > 0) sentiment = "positive";
  if (score < 0) sentiment = "negative";

  return {
    sentiment,
    score,
    confidence: Math.min(1, Math.abs(score) / 5),
  };
}

exports.generateDishDescription = catchAsyncErrors(async (req, res) => {
  const description = generateDescription(req.body);
  res.status(200).json({ success: true, description });
});

exports.analyzeReviewSentiment = catchAsyncErrors(async (req, res) => {
  const { review } = req.body;
  if (!review) {
    return res.status(400).json({ success: false, message: "Review text is required" });
  }
  const result = analyzeReview(review);
  res.status(200).json({ success: true, ...result });
});
