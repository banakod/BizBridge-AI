const Business = require("../models/Business");
const Lead = require("../models/Lead");
const { enrichBusiness } = require("../utils/enrichBusiness");

const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === "businessOwner") {
      const business = await Business.findOne({ claimedBy: req.user._id });
      return res.status(200).json({
        success: true,
        role: "businessOwner",
        business: business ? enrichBusiness(business) : null,
        totalLeadsReceived: business
          ? await Lead.countDocuments({ businessId: business._id })
          : 0,
      });
    }

    // Freelancer stats
    const totalBusinesses    = await Business.countDocuments();
    const totalLeads         = await Lead.countDocuments({ userId: req.user._id });
    const newLeads           = await Lead.countDocuments({ userId: req.user._id, status: "new" });
    const contactedLeads     = await Lead.countDocuments({ userId: req.user._id, status: "contacted" });
    const wonLeads           = await Lead.countDocuments({ userId: req.user._id, status: "won" });
    const lostLeads          = await Lead.countDocuments({ userId: req.user._id, status: "lost" });
    const proposalSentLeads  = await Lead.countDocuments({ userId: req.user._id, status: "proposalSent" });
    const conversionRate     = totalLeads === 0 ? 0 : Math.round((wonLeads / totalLeads) * 100);
    const revenueGenerated   = wonLeads * 15000;

    res.status(200).json({
      success: true,
      role: "freelancer",
      totalBusinesses, totalLeads, newLeads, contactedLeads,
      proposalSentLeads, wonLeads, lostLeads, conversionRate, revenueGenerated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
