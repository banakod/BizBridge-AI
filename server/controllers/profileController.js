const ProfessionalProfile = require("../models/ProfessionalProfile");

// Create or Update Profile
const saveProfile = async (req, res) => {
  try {
    const {
      profession,
      about,
      skills,
      experience,
      location,
      phone,
      portfolio,
      projects,
    } = req.body;

      if (
      !profession ||
      !experience ||
      !location ||
      !phone ||
      !about ||
      !skills ||
      skills.length === 0
    ) {
      return res.status(400).json({
        message:
          "Profession, Experience, Location, Phone, Skills and About are required.",
      });
    }


    let profile = await ProfessionalProfile.findOne({
      user: req.user.id,
    });

    if (profile) {
      profile.profession = profession;
      profile.about = about;
      profile.skills = skills;
      profile.experience = experience;
      profile.location = location;
      profile.phone = phone;
      profile.portfolio = portfolio;
      profile.projects = projects;

      await profile.save();
    } else {
      profile = await ProfessionalProfile.create({
        user: req.user.id,
        profession,
        about,
        skills,
        experience,
        location,
        phone,
        portfolio,
        projects,
      });
    }

    

    res.json(profile);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Logged in user's profile
const getMyProfile = async (req, res) => {

  try {

    const profile = await ProfessionalProfile
      .findOne({ user: req.user.id })
      .populate("user", "name email role");

    res.json(profile);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// View another professional's profile
const getProfileById = async (req, res) => {
  try {
    const profile = await ProfessionalProfile.findOne({
      user: req.params.id,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  saveProfile,
  getMyProfile,
  getProfileById,
};