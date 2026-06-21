const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    category:     { type: String, required: true },
    address:      { type: String, required: true },
    city:         { type: String, required: true, trim: true },
    area:         { type: String, default: "", trim: true },
    pincode:      { type: String, default: "", trim: true },
    phone:        { type: String, required: true },
    website:      { type: String, default: "" },
    websiteStatus:{ type: Boolean, default: false },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    popularity:   { type: String, enum: ["low", "medium", "high"], default: "medium" },
    businessSize: { type: String, enum: ["small", "medium", "large"], default: "small" },
    digitalPresence: { type: String, enum: ["none", "basic", "strong"], default: "none" },

    // Map coordinates
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },

    // Who added this business (freelancer or business owner themselves)
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // registeredByOwner = true means the business owner added their own business
    registeredByOwner: { type: Boolean, default: false },

    // Source: manual | discovered (via map)
    source: { type: String, enum: ["manual", "discovered"], default: "manual" },

    // Owner can request digital help — freelancers will see this
    needsDigitalHelp: { type: Boolean, default: false },
    helpMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
