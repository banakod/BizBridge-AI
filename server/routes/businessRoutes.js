const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createBusiness, getBusinesses, searchBusinesses,
  getBusinessesWithoutWebsite, getBusinessById,
  updateBusiness, deleteBusiness,
  getMyBusiness, requestHelp, discoverBusinesses,
} = require("../controllers/businessController");

router.post("/",            protect, createBusiness);
router.get("/",             getBusinesses);
router.get("/search",       searchBusinesses);
router.get("/no-website",   getBusinessesWithoutWebsite);
router.get("/discover",     protect, discoverBusinesses);

// Business owner routes
router.get("/my-business",     protect, requireRole("businessOwner"), getMyBusiness);
router.post("/request-help",   protect, requireRole("businessOwner"), requestHelp);

router.get("/:id",          getBusinessById);
router.put("/:id",          protect, updateBusiness);
router.delete("/:id",       protect, deleteBusiness);

module.exports = router;
