const ConnectionRequest = require("../models/ConnectionRequest");
const Business = require("../models/Business");
const Notification = require("../models/Notification");

// Freelancer sends request
const createRequest = async (req, res) => {
  try {
    const { businessId, message } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

   const existing = await ConnectionRequest.findOne({
    freelancer: req.user.id,
    business: businessId,
    });

   if (existing) {
  return res.status(400).json({
    message: "You have already sent a connection request to this business.",
  });
}

    const request = await ConnectionRequest.create({
      freelancer: req.user.id,
      businessOwner: business.createdBy,
      business: businessId,
      message,
    });

    await Notification.create({
      user: business.createdBy,
      title: "New Connection Request",
      message: `${req.user.name} sent you a connection request.`,
      type: "request",
      link: "/connection-requests",
    });

    res.status(201).json({
      message: "Connection request sent successfully.",
      request,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Business Owner views requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      businessOwner: req.user.id,
    })
      .populate("freelancer", "name email")
      .populate("business", "name category city");

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get request status for a business
const getRequestStatus = async (req, res) => {
  try {
    const request = await ConnectionRequest.findOne({
      freelancer: req.user.id,
      business: req.params.businessId,
    });

    if (!request) {
      return res.json({
        exists: false,
      });
    }

    res.json({
      exists: true,
      status: request.status,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
 };

// Accept / Reject
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    const request = await ConnectionRequest.findOne({
      _id: req.params.id,
      businessOwner: req.user.id,
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed.",
      });
    }

    request.status = status;

    await request.save();

    await Notification.create({
    user: request.freelancer,
    title:
    status === "accepted"
      ? "Request Accepted"
      : "Request Rejected",

     message:
      status === "accepted"
      ? "Your connection request has been accepted."
      : "Your connection request has been rejected.",

     type: status,
     link: "/leads",
    });

    res.json({
      message: `Request ${status} successfully.`,
      request,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getUnreadRequestCount = async (req, res) => {
  try {
    const count = await ConnectionRequest.countDocuments({
      businessOwner: req.user.id,
      status: "pending",
    });

    res.json({ count });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestStatus,
  updateRequestStatus,
  getUnreadRequestCount,
};