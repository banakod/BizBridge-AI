const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Check required environment variables
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is missing.");
    }

    if (!process.env.BREVO_USER) {
      throw new Error("BREVO_USER is missing.");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Sending Email...");
    console.log("To:", to);
    console.log("From:", process.env.BREVO_USER);
    console.log(
      "API Key:",
      process.env.BREVO_API_KEY.substring(0, 12) + "..."
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const response = await axios({
      method: "POST",
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY.trim(),
        "content-type": "application/json",
      },
      data: {
        sender: {
          name: "BizBridge AI",
          email: process.env.BREVO_USER.trim(),
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: html,
      },
      timeout: 30000,
    });

    console.log("✅ Email sent successfully.");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Brevo Email Error");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    throw error;
  }
};

module.exports = sendEmail;