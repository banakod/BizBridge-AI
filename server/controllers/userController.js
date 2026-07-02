const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
});

let subject = "";
let html = "";

if (role === "freelancer") {
  subject = "🎉 Welcome to BizBridge AI - Start Growing Your Freelance Career";

  html = `
  <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#f8fafc;padding:40px">

    <div style="background:#4f46e5;padding:25px;border-radius:12px;text-align:center;color:white;">
      <h1>💼 Welcome, Freelancer!</h1>
      <p>Your BizBridge AI account is ready.</p>
    </div>

    <div style="background:white;padding:30px;border-radius:12px;margin-top:20px;">

      <h2>Hello ${user.name}, 👋</h2>

      <p>Welcome to <b>BizBridge AI</b>.</p>

      <p>You can now:</p>

      <ul>
        <li>🏢 Discover Local Businesses</li>
        <li>🤖 Generate AI Proposals</li>
        <li>📧 Generate Cold Emails</li>
        <li>🌐 Create Website Previews</li>
        <li>📊 Manage Your Lead Pipeline</li>
      </ul>

      <div style="text-align:center;margin-top:30px;">
        <a
          href="${process.env.CLIENT_URL}/login"
          style="background:#4f46e5;color:white;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;"
        >
          Login as Freelancer
        </a>
      </div>

    </div>

  </div>
  `;
} else {
  subject = "🏢 Welcome to BizBridge AI - Grow Your Business";

  html = `
  <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#f8fafc;padding:40px">

    <div style="background:#059669;padding:25px;border-radius:12px;text-align:center;color:white;">
      <h1>🏢 Welcome, Business Owner!</h1>
      <p>Your business account has been created successfully.</p>
    </div>

    <div style="background:white;padding:30px;border-radius:12px;margin-top:20px;">

      <h2>Hello ${user.name}, 👋</h2>

      <p>Welcome to <b>BizBridge AI</b>.</p>

      <p>You can now:</p>

      <ul>
        <li>🏢 Register and manage your business</li>
        <li>🤝 Receive connection requests from freelancers</li>
        <li>👨‍💻 Discover talented professionals</li>
        <li>📈 Expand your digital presence</li>
        <li>🚀 Collaborate to grow your business</li>
      </ul>
      
      <div style="text-align:center;margin-top:30px;">
        <a
          href="${process.env.CLIENT_URL}/login"
          style="background:#059669;color:white;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;"
        >
          Login as Business Owner
        </a>
      </div>

    </div>

  </div>
  `;
}

await sendEmail({
  to: user.email,
  subject,
  html,
});

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "BizBridge AI - Password Reset",
      html: `
        <h2>Password Reset</h2>

        <p>Hello ${user.name},</p>

        <p>Click the button below to reset your password.</p>

        <a href="${resetUrl}"
           style="
             background:#4f46e5;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:6px;
           ">
          Reset Password
        </a>

        <p>This link expires in 10 minutes.</p>
      `,
    });

    res.json({
      message: "Password reset email sent successfully.",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const bcrypt = require("bcryptjs");

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password updated successfully.",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  changePassword,
};
