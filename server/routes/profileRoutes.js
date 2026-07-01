const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  saveProfile,
  getMyProfile,
  getProfileById,
} = require("../controllers/profileController");

// Logged in user
router.get("/me", protect, getMyProfile);

// Create / Update
router.post("/", protect, saveProfile);

// Public Profile
router.get("/:id", getProfileById);

module.exports = router;