const express = require("express");
const { generateDishDescription, analyzeReviewSentiment } = require("../controllers/aiController");

const router = express.Router();

router.post("/generate-description", generateDishDescription);
router.post("/analyze-review", analyzeReviewSentiment);

module.exports = router;
