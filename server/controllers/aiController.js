const Groq = require("groq-sdk");
const Business = require("../models/Business");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL =
  process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const buildBusinessContext = (business = {}) => {
  const location = [
    business.area,
    business.city,
    business.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return `
Business Name: ${business.name || "Local Business"}
Category: ${business.category || "Business"}
Location: ${location || "Local Area"}
Website: ${
    business.websiteStatus
      ? "Business already has a website."
      : "Business has no website."
  }

Rating: ${business.rating || 0}
Reviews: ${business.reviewsCount || 0}
Business Size: ${business.businessSize || "Small"}
Digital Presence: ${business.digitalPresence || "Low"}
`;
};

const getBusiness = async (businessId) => {
  if (!businessId) return null;

  return await Business.findById(businessId);
};

const localAiFallback = ({
  type,
  business = {},
  userPrompt = "",
}) => {
  const name = business.name || "Business";
  const category = business.category || "Business";
  const city = business.city || "";
  const area = business.area || "";
  const location =
    [area, city].filter(Boolean).join(", ") || "your city";

  if (type === "proposal") {
    return `
BUSINESS PROPOSAL

Hello ${name},

We noticed that your business can attract many more customers with a professional online presence.

Our proposal includes:

• Modern Responsive Website
• Google Maps
• WhatsApp Integration
• Contact Forms
• SEO Optimization
• Mobile Friendly Design

Estimated Price:

Basic Website - ₹5,000

Professional Website - ₹15,000

Advanced Business Website - ₹30,000

Thank you.
`;
  }

  if (type === "email") {
    return `
Subject: Grow ${name} Online

Hello,

I came across your business in ${location}.

I help local businesses build professional websites that increase customer trust and generate more enquiries.

Would you be interested in a quick discussion?

Thank you.
`;
  }

  if (type === "chat") {
    return `
Business Advice

${userPrompt}

Suggestion:

Focus on helping the owner understand how a website increases trust, visibility and customer enquiries.

Start small, then offer marketing services later.
`;
  }

  if (type === "website_preview") {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${name}</title>

<style>

body{
font-family:Arial;
margin:0;
background:#f7fafc;
}

header{
background:#2563eb;
color:white;
padding:30px;
text-align:center;
}

section{
padding:50px;
}

.card{
background:white;
padding:25px;
border-radius:10px;
box-shadow:0 5px 15px rgba(0,0,0,.08);
margin-top:20px;
}

button{
background:#2563eb;
color:white;
border:none;
padding:15px 25px;
border-radius:8px;
cursor:pointer;
}

footer{
background:#1e293b;
color:white;
padding:20px;
text-align:center;
}

</style>

</head>

<body>

<header>

<h1>${name}</h1>

<p>${category} • ${location}</p>

</header>

<section>

<div class="card">

<h2>Welcome</h2>

<p>
Professional services for all customers.
</p>

<button>

Contact Us

</button>

</div>

</section>

<footer>

© 2026 ${name}

</footer>

</body>

</html>
`;
  }

  return `
Hello ${name},

A professional website can increase your business visibility, improve trust and generate more leads.

Recommended Package

Basic Website
₹5,000
`;
};
const callGroq = async (prompt, maxTokens = 2048) => {
  try {
    console.log("Calling Groq...");

    const completion = await groq.chat.completions.create({
      model: MODEL,

      messages: [
        {
          role: "system",
          content:
            "You are BizBridge AI. Help freelancers generate business proposals, outreach emails, business advice and beautiful HTML website previews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const content =
      completion.choices?.[0]?.message?.content || "";

    console.log("Groq Response Received");

    return {
      content,
      warning: "",
    };
  } catch (error) {
    console.log("========== GROQ ERROR ==========");
    console.log(error.message);
    console.log("===============================");

    return {
      content: null,
      warning: "Groq AI is unavailable.",
    };
  }
};
const cleanHtml = (content) => {
  if (!content) return "";

  // Remove markdown fences
  content = content
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract only the HTML document
  const match = content.match(/<!DOCTYPE html[\s\S]*<\/html>/i);

  if (match) {
    return match[0];
  }

  const htmlMatch = content.match(/<html[\s\S]*<\/html>/i);

  if (htmlMatch) {
    return "<!DOCTYPE html>\n" + htmlMatch[0];
  }

  return content;
};

const generateAiContent = async (req, res) => {
  console.log("AI Generate API Hit");

  try {
    const {
      type = "proposal",
      businessId,
      userPrompt = "",
    } = req.body;

    const business = await getBusiness(businessId);

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    let content = null;
    let provider = "local-fallback";
    let warning = "";

    // =====================================
    // WEBSITE PREVIEW
    // =====================================

    if (type === "website_preview") {

      const previewPrompt = `
You are a Senior UI/UX Designer and Frontend Developer.

Create a PREMIUM business website.

Business Name:
${business.name}

Category:
${business.category}

Location:
${business.city}

Phone:
${business.phone || "Not Available"}

User Instructions:
${userPrompt || "Modern premium website"}

Requirements:

- Return ONLY HTML.
- Start with <!DOCTYPE html>.
- End with </html>.
- No markdown.
- No explanation.
- Put ALL CSS inside one <style>.
- Responsive.
- Sticky Navbar.
- Hero Section.
- About.
- Services.
- Why Choose Us.
- Testimonials.
- Gallery.
- Statistics.
- Contact Form.
- Google Maps placeholder.
- Floating WhatsApp Button.
- Beautiful gradients.
- Modern cards.
- Glassmorphism.
- Nice animations.
- Professional Footer.
`;

      const groqResult = await callGroq(previewPrompt, 3500);

      content = groqResult.content;
      warning = groqResult.warning;

      if (content) {
        provider = "groq";
        content = cleanHtml(content);
      }

      if (!content) {
        content = localAiFallback({
          type,
          business,
          userPrompt,
        });
      }

      return res.json({
        success: true,
        provider,
        warning,
        content,
      });
    }

    // =====================================
    // PROPOSAL / EMAIL / CHAT
    // =====================================

    let prompt = "";

if (type === "proposal") {
  prompt = `
You are an expert Business Consultant.

Business Details:
${buildBusinessContext(business)}

Extra Instructions:
${userPrompt || "None"}

Create a professional proposal.

Requirements:

- Maximum 200 words.
- Address the business owner professionally.
- Explain why they need a website.
- Mention these services:
  • Responsive Website
  • SEO
  • Google Maps
  • WhatsApp Integration
  • Contact Form
- Include estimated pricing in INR.
- End with a strong call-to-action.
- Follow the Extra Instructions exactly.
- Return ONLY the proposal.
`;
}

else if (type === "email") {

  prompt = `
You are a professional email copywriter.

Business Details:
${buildBusinessContext(business)}

Extra Instructions:
${userPrompt || "None"}

Write a cold outreach email.

Requirements:

- Maximum 120 words.
- Include a Subject line.
- Friendly but professional.
- Mention one important benefit.
- Invite them for a short meeting.
- Follow the Extra Instructions exactly.
- Return ONLY the email.
`;
}

else if (type === "chat") {

  prompt = `
You are a Digital Business Consultant.

Business Details:
${buildBusinessContext(business)}

User Question:

${userPrompt}

Requirements:

- Maximum 8 bullet points.
- Keep every point short.
- Give practical advice.
- Be specific to this business.
- Return ONLY the advice.
`;
}

let maxTokens = 500;

switch (type) {

  case "proposal":
    maxTokens = 700;
    break;

  case "email":
    maxTokens = 350;
    break;

  case "chat":
    maxTokens = 500;
    break;

  default:
    maxTokens = 500;
}

const groqResult = await callGroq(prompt, maxTokens);

content = groqResult.content;
warning = groqResult.warning;

if (content) {
  provider = "groq";
}

if (!content) {
  content = localAiFallback({
    type,
    business,
    userPrompt,
  });
}

return res.json({
  success: true,
  provider,
  warning,
  content,
});

  } catch (error) {
    console.log("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  generateAiContent,
};