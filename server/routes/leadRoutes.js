const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createLead, getMyLeads, updateLeadStatus, deleteLead } = require("../controllers/leadController");

router.post("/", protect, createLead);
router.get("/", protect, getMyLeads);
router.put("/:id", protect, updateLeadStatus);
router.delete("/:id", protect, deleteLead);

module.exports = router;
