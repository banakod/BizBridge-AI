const mongoose = require("mongoose");

const professionalProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profession: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    location: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    projects: [
      {
        title: String,
        description: String,
        liveLink: String,
      },
    ],

    profileImage: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 5,
    },

    completedProjects: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProfessionalProfile",
  professionalProfileSchema
);