const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Check environment variables
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is missing.");
    }

    if (!process.env.BREVO_USER) {
      throw new Error("BREVO_USER is missing.");
    }

    console.log("\n==========================================");
    console.log("📧 BREVO EMAIL DEBUG");
    console.log("==========================================");
    console.log("To           :", to);
    console.log("From         :", process.env.BREVO_USER);

    console.log(
      "API Key      :",
      process.env.BREVO_API_KEY.substring(0, 20) + "..."
    );

    console.log(
      "Key Length   :",
      process.env.BREVO_API_KEY.length
    );

    console.log("==========================================\n");

    const response = await axios({
      method: "POST",
      url: "https://api.brevo.com/v3/smtp/email",
      timeout: 30000,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY.trim(),
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
        subject,
        htmlContent: html,
      },
    });

    console.log("==========================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log(response.data);
    console.log("==========================================");

    return response.data;

  } catch (error) {

    console.log("\n==========================================");
    console.log("❌ BREVO EMAIL ERROR");
    console.log("==========================================");

    if (error.response) {
      console.log("Status :", error.response.status);
      console.log("Data   :", error.response.data);
    } else {
      console.log("Message:", error.message);
    }

    console.log(
      "API Key Used:",
      process.env.BREVO_API_KEY
        ? process.env.BREVO_API_KEY.substring(0, 20) + "..."
        : "NOT FOUND"
    );

    console.log(
      "BREVO_USER:",
      process.env.BREVO_USER || "NOT FOUND"
    );

    console.log("==========================================\n");

    throw error;
  }
};

module.exports = sendEmail;