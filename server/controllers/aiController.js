const Business = require("../models/Business");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const getGeminiApiKey = () => {
  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey) return "";
  return rawKey.trim().replace(/^["']|["']$/g, "");
};

const getGeminiKeyProblem = (apiKey) => {
  if (!apiKey) return "GEMINI_API_KEY is missing, so local AI fallback was used.";
  if (/^Bearer\s+/i.test(apiKey)) return "GEMINI_API_KEY contains 'Bearer'. Paste only the API key value from Google AI Studio.";
  if (apiKey.startsWith("ya29.") || apiKey.includes("oauth")) return "GEMINI_API_KEY looks like an OAuth access token. Use a Google AI Studio API key instead.";
  if (apiKey.startsWith("{")) return "GEMINI_API_KEY looks like a JSON service account. Use a Google AI Studio API key instead.";
  if (!apiKey.startsWith("AIza")) return "GEMINI_API_KEY does not look like a Google AI Studio API key. It usually starts with AIza.";
  return "";
};

const buildBusinessContext = (business = {}) => {
  const location = [business.area, business.city, business.pincode].filter(Boolean).join(", ");
  return [
    `Business name: ${business.name || "Local business"}`,
    `Category: ${business.category || "business"}`,
    `Location: ${location || business.city || "local market"}`,
    `Website status: ${business.websiteStatus ? "has a website" : "does not have a website"}`,
    `Rating: ${business.rating || 0}/5`,
    `Reviews: ${business.reviewsCount || 0}`,
    `Popularity: ${business.popularity || "medium"}`,
    `Business size: ${business.businessSize || "small"}`,
    `Digital presence: ${business.digitalPresence || "none"}`,
  ].join("\n");
};

const localAiFallback = ({ type, business = {}, userPrompt = "" }) => {
  const category = business.category || "business";
  const name = business.name || "your business";
  const location = [business.area, business.city].filter(Boolean).join(", ") || "your local area";
  const phone = business.phone || "";

  if (type === "email") {
    return `Subject: Helping ${name} get more customers online\n\nDear Business Owner,\n\nI noticed ${name} in ${location} and saw an opportunity to improve your online presence. A professional ${category} website can help customers find your services, contact you quickly, view photos or pricing, and trust your business before visiting.\n\nI can help you build a clean, mobile-friendly website with Google Maps, enquiry buttons, customer reviews, and a simple lead capture form.\n\nWould you be open to a short call this week?\n\nRegards,\nBizBridge AI User`;
  }

  if (type === "pitch") {
    return `${name} can attract more local customers by adding a simple website with service details, contact buttons, Google Maps, customer reviews, and a clear offer. Start with a basic website, then add booking, online payments, or marketing automation once the owner sees results.`;
  }

  if (type === "chat") {
    return `Suggested answer: ${userPrompt || "Focus on the business owner's pain point."}\n\nPosition the website as a revenue tool, not only a design project. Explain how it improves discovery, trust, calls, bookings, and repeat enquiries. Keep the offer simple: basic website first, then optional marketing upgrades.`;
  }

  if (type === "website_preview") {
    const color = "#1d4ed8";
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1e293b}header{background:${color};color:#fff;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}header h1{font-size:1.4rem;font-weight:800}nav a{color:#fff;text-decoration:none;margin-left:16px;font-weight:600;font-size:.9rem}.hero{background:linear-gradient(135deg,#eff6ff,#f8fafc);padding:64px 32px;text-align:center}.hero h2{font-size:2rem;font-weight:900;color:#0f172a}.hero p{margin:14px auto;max-width:520px;color:#475569;line-height:1.8}.hero a{display:inline-block;margin-top:20px;background:${color};color:#fff;padding:12px 32px;border-radius:6px;font-weight:700;text-decoration:none}.services{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;padding:48px 32px;background:#fff}.card{border:1px solid #e2e8f0;border-radius:10px;padding:24px;text-align:center}.card span{font-size:2rem}.card h3{font-size:1rem;font-weight:700;margin:10px 0 6px}.card p{font-size:.85rem;color:#64748b}.about{padding:48px 32px;background:#f8fafc;display:flex;gap:32px;align-items:center;flex-wrap:wrap}.about-text{flex:1;min-width:240px}.about-text h2{font-size:1.5rem;font-weight:800;margin-bottom:12px;color:#0f172a}.about-text p{color:#475569;line-height:1.8}.about-img{flex:1;min-width:240px;background:#dbeafe;height:200px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:4rem}.contact{padding:48px 32px;text-align:center;background:#0f172a;color:#fff}.contact h2{font-size:1.4rem;font-weight:800;margin-bottom:16px}.contact p{color:#94a3b8;margin:6px 0}.contact a{color:#60a5fa;font-weight:700}.wa{display:inline-block;margin-top:20px;background:#25d366;color:#fff;padding:10px 28px;border-radius:6px;font-weight:700;text-decoration:none}footer{background:${color};color:#fff;text-align:center;padding:14px;font-size:.8rem}</style></head><body><header><h1>${name}</h1><nav><a href="#">Home</a><a href="#">Services</a><a href="#">About</a><a href="#">Contact</a></nav></header><section class="hero"><h2>Welcome to ${name}</h2><p>Your trusted ${category} in ${location}. We deliver exceptional service to every customer.</p><a href="#contact">📞 Contact Us Now</a></section><section class="services"><div class="card"><span>⭐</span><h3>Quality Service</h3><p>Top-rated ${category} experience in ${location}.</p></div><div class="card"><span>📍</span><h3>Easy to Find</h3><p>Conveniently located in ${location}.</p></div><div class="card"><span>💬</span><h3>Customer Support</h3><p>Always available for enquiries and bookings.</p></div><div class="card"><span>🏆</span><h3>Trusted Brand</h3><p>Loved by hundreds of local customers.</p></div></section><section class="about"><div class="about-text"><h2>About ${name}</h2><p>We are a leading ${category} business in ${location}. Our mission is to provide top-quality service and build lasting relationships with our community. Visit us today!</p></div><div class="about-img">🏪</div></section><section class="contact" id="contact"><h2>Get In Touch</h2><p>📍 ${location}</p>${phone ? `<p>📞 <a href="tel:${phone}">${phone}</a></p>` : ""}<br><a class="wa" href="https://wa.me/91">💬 WhatsApp Us</a></section><footer><p>© 2025 ${name}. All rights reserved. | ${location}</p></footer></body></html>`;
  }

  return `Dear Business Owner,\n\nYour ${category} business, ${name}, can reach more customers with a professional website. A website can show your services, location, contact details, reviews, photos, and enquiry options in one trusted place.\n\nRecommended features:\n- Mobile-friendly design\n- Google Maps and click-to-call\n- Reviews and photo gallery\n- Enquiry or booking form\n- WhatsApp contact button\n\nEstimated packages:\nBasic Website: Rs. 5,000\nProfessional Website: Rs. 15,000\nAdvanced Website: Rs. 30,000\n\nThis can improve visibility, build trust, and help convert more local searches into real customers.`;
};

const callGemini = async (prompt, maxTokens = 900) => {
  const apiKey = getGeminiApiKey();
  const keyProblem = getGeminiKeyProblem(apiKey);

  if (keyProblem) return { content: null, warning: keyProblem };

  const response = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: "You are BizBridge AI, a concise assistant for freelancers selling websites and digital services to local businesses. Return practical, ready-to-use text. Do not use markdown tables." }],
      },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
    }),
  });

  if (!response.ok) {
    let message = `Gemini API returned ${response.status}.`;
    try {
      const errorData = await response.json();
      message = errorData.error?.message || message;
    } catch { /* keep fallback message */ }
    return { content: null, warning: message };
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n").trim();

  return {
    content,
    warning: content ? "" : "Gemini returned an empty response, so local AI fallback was used.",
  };
};

const getBusiness = async (businessId) => {
  if (!businessId) return null;
  return Business.findById(businessId);
};

const generateAiContent = async (req, res) => {
  try {
    const { type = "proposal", businessId, userPrompt = "" } = req.body;
    const business = await getBusiness(businessId);

    // --- Website Preview ---
    if (type === "website_preview") {
      const name = business?.name || "Local Business";
      const category = business?.category || "business";
      const loc = [business?.area, business?.city].filter(Boolean).join(", ") || "local area";
      const phone = business?.phone || "";
      const styleHint = userPrompt ? `Design preference: ${userPrompt}.` : "";

      const previewPrompt = [
        "Task: Generate a complete, self-contained HTML webpage (single file, no external CSS or JS links) as a realistic dummy website mockup for this business.",
        `Business name: ${name}`,
        `Category: ${category}`,
        `Location: ${loc}`,
        `Phone: ${phone}`,
        styleHint,
        "Requirements:",
        "- Include a navigation header, hero section with call-to-action, services section (4 cards), about section, contact section with WhatsApp button, and footer.",
        "- Use only inline CSS inside a <style> tag. No external links.",
        "- Make it visually impressive, mobile-responsive using CSS grid/flex, and realistic.",
        "- Use a color palette that fits the business category.",
        "- Return ONLY the HTML code starting with <!DOCTYPE html>. No markdown, no explanation, no code fences.",
      ].filter(Boolean).join("\n");

      let content = null;
      let provider = "local-fallback";
      let warning = "";

      try {
        const geminiResult = await callGemini(previewPrompt, 2048);
        content = geminiResult?.content || null;
        warning = geminiResult?.warning || "";
        if (content) provider = "gemini";
      } catch (error) {
        warning = "Gemini request failed, so local fallback was used.";
        console.log(`Gemini warning: ${error.message}`);
      }

      if (!content) {
        content = localAiFallback({ type, business: business || {}, userPrompt });
      }

      // Strip markdown code fences if present
      const htmlMatch = content.match(/(<!DOCTYPE html[\s\S]*<\/html>)/i);
      if (htmlMatch) content = htmlMatch[1];

      return res.status(200).json({ success: true, provider, warning, content });
    }

    // --- All other types ---
    const businessContext = buildBusinessContext(business);
    const prompt = [
      `Task: Generate a ${type} for a freelancer using BizBridge AI.`,
      businessContext,
      userPrompt ? `User request: ${userPrompt}` : "",
      "Make it specific, polite, easy to send, and focused on business growth.",
      "Use Indian rupee pricing when pricing is needed.",
    ]
      .filter(Boolean)
      .join("\n\n");

    let content = null;
    let provider = "local-fallback";
    let warning = "";

    try {
      const geminiResult = await callGemini(prompt);
      content = geminiResult?.content || null;
      warning = geminiResult?.warning || "";
      if (content) provider = "gemini";
    } catch (error) {
      warning = "Gemini request failed, so local AI fallback was used.";
      console.log(`Gemini warning: ${error.message}`);
    }

    if (!content) {
      content = localAiFallback({ type, business: business || {}, userPrompt });
    }

    res.status(200).json({ success: true, provider, warning, content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateAiContent };
