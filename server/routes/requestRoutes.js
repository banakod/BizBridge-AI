const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");

const {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  getRequestStatus,
  getUnreadRequestCount,
} = require("../controllers/requestController");

// Freelancer sends connection request
router.post(
  "/",
  protect,
  requireRole("freelancer"),
  createRequest
);

// Check request status for a business
router.get(
  "/status/:businessId",
  protect,
  requireRole("freelancer"),
  getRequestStatus
);

// Business Owner views all requests
router.get(
  "/my",
  protect,
  requireRole("businessOwner"),
  getMyRequests
);

router.get(
  "/unread-count",
  protect,
  requireRole("businessOwner"),
  getUnreadRequestCount
);

// Business Owner accepts/rejects request
router.put(
  "/:id",
  protect,
  requireRole("businessOwner"),
  updateRequestStatus
);


module.exports = router;