const CATEGORY_WEBSITE_TYPES = {
  restaurant: "Restaurant Website", hotel: "Hotel Booking Website",
  lodge: "Hotel Booking Website", salon: "Salon Appointment Website",
  clinic: "Clinic Appointment Website", gym: "Gym Membership Website",
  store: "Local Store Website", retail: "E-commerce Website", bakery: "Bakery Ordering Website",
};

const getWeight = (value, weights, fallback = 0) => weights[value] ?? fallback;

const calculateLeadScore = (b) => {
  const ratingScore = Math.min(Number(b.rating || 0) * 10, 50);
  const reviewScore = Math.min(Number(b.reviewsCount || 0) / 5, 20);
  const websiteGap  = b.websiteStatus ? 0 : 15;
  const popularity  = getWeight(b.popularity, { low: 3, medium: 8, high: 12 }, 8);
  const size        = getWeight(b.businessSize, { small: 4, medium: 8, large: 12 }, 4);
  const digitalGap  = getWeight(b.digitalPresence, { none: 10, basic: 5, strong: 0 }, 10);
  return Math.min(100, Math.round(ratingScore + reviewScore + websiteGap + popularity + size + digitalGap));
};

const getWebsiteType = (category = "") => {
  const norm = category.toLowerCase();
  const match = Object.keys(CATEGORY_WEBSITE_TYPES).find((k) => norm.includes(k));
  return match ? CATEGORY_WEBSITE_TYPES[match] : "Business Website";
};

const getRecommendations = (b) => {
  const cat = b.category.toLowerCase();
  const common = ["Google Maps integration", "Customer reviews section", "Contact form or WhatsApp CTA"];
  if (cat.includes("restaurant") || cat.includes("bakery")) return ["Online menu", "Table booking", ...common];
  if (cat.includes("hotel") || cat.includes("lodge")) return ["Room gallery", "Booking inquiry form", ...common];
  if (cat.includes("salon") || cat.includes("clinic") || cat.includes("gym")) return ["Service list", "Appointment booking", ...common];
  return ["Service catalog", "Lead capture form", ...common];
};

const enrichBusiness = (doc) => {
  const b = doc && doc.toObject ? doc.toObject() : doc;
  const leadScore = calculateLeadScore(b);
  const expectedMonthlyTraffic = Math.max(250, Math.round(leadScore * 18));
  const potentialCustomers = Math.round(expectedMonthlyTraffic * 0.08);
  return {
    ...b,
    leadScore,
    leadPotential: leadScore >= 80 ? "High Potential" : leadScore >= 55 ? "Medium Potential" : "Early Stage",
    recommendedWebsiteType: getWebsiteType(b.category),
    recommendations: getRecommendations(b),
    costEstimates: { basic: 5000, professional: 15000, advanced: 30000 },
    revenueOpportunity: {
      expectedMonthlyTraffic, potentialCustomers,
      estimatedRevenueGrowth: leadScore >= 80 ? "20-35%" : leadScore >= 55 ? "10-20%" : "5-10%",
    },
    proposal:
      `Dear Business Owner, your ${b.category} business can gain more visibility with a professional ${getWebsiteType(b.category).toLowerCase()}. ` +
      `Features like ${getRecommendations(b).slice(0, 3).join(", ")} help customers discover and contact you faster.`,
  };
};

module.exports = { enrichBusiness };
