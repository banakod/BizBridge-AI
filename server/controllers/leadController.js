const Lead = require("../models/Lead");

const createLead = async (req, res) => {
  try {
    const { businessId, status, notes } = req.body;

    if (!businessId) {
      return res.status(400).json({
        message: "Business ID is required",
      });
    }

    const lead = await Lead.create({
      businessId,
      userId: req.user.id,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      userId: req.user.id,
    })
      .populate("businessId", "name category city area pincode websiteStatus rating reviewsCount")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "contacted", "meetingScheduled", "proposalSent", "won", "lost"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid lead status",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    lead.status = status;

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getMyLeads,
  updateLeadStatus,
  deleteLead,
};
