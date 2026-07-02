const SibApiV3Sdk = require("@getbrevo/brevo");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        name: "BizBridge AI",
        email: process.env.BREVO_USER,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.body || error.message
    );
    throw error;
  }
};

module.exports = sendEmail;