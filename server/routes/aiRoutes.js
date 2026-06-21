const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { generateAiContent } = require("../controllers/aiController");

router.post("/generate", protect, generateAiContent);

module.exports = router;
