const Business = require("../models/Business");

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

// ── CREATE ──────────────────────────────────────────────

const createBusiness = async (req, res) => {
  try {
    const { name, category, address, city, area, pincode, phone, website,
      websiteStatus, rating, reviewsCount, popularity, businessSize, digitalPresence, lat, lng } = req.body;

    if (!name || !category || !address || !city || !phone) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const isOwner = req.user.role === "businessOwner";

    const business = await Business.create({
      name, category, address, city, area, pincode, phone,
      website, websiteStatus: Boolean(websiteStatus || website),
      rating, reviewsCount, popularity, businessSize, digitalPresence,
      lat: lat || null, lng: lng || null,
      createdBy: req.user._id,
      registeredByOwner: isOwner,
      // If owner registers their own business they already want help
      needsDigitalHelp: isOwner,
    });

    res.status(201).json({ success: true, business: enrichBusiness(business) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── READ ────────────────────────────────────────────────

const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: businesses.length, businesses: businesses.map(enrichBusiness) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchBusinesses = async (req, res) => {
  try {
    const { city, area, pincode, category, q, noWebsite, needsHelp } = req.query;
    const filters = {};
    if (city)     filters.city = new RegExp(city, "i");
    if (area)     filters.area = new RegExp(area, "i");
    if (pincode)  filters.pincode = pincode;
    if (category) filters.category = new RegExp(category, "i");
    if (noWebsite === "true") filters.websiteStatus = false;
    if (needsHelp === "true") filters.needsDigitalHelp = true;
    if (q) filters.$or = [
      { name: new RegExp(q, "i") }, { category: new RegExp(q, "i") },
      { city: new RegExp(q, "i") }, { area: new RegExp(q, "i") },
    ];
    const businesses = await Business.find(filters).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: businesses.length, businesses: businesses.map(enrichBusiness) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBusinessesWithoutWebsite = async (req, res) => {
  try {
    const businesses = await Business.find({ websiteStatus: false });
    res.status(200).json({ success: true, count: businesses.length, businesses: businesses.map(enrichBusiness) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.status(200).json({ success: true, business: enrichBusiness(business) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE ──────────────────────────────────────────────

const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    const isCreator = business.createdBy?.toString() === req.user._id.toString();
    const isAdmin   = req.user.role === "admin";
    if (!isCreator && !isAdmin) return res.status(401).json({ message: "Not authorized" });

    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, business: enrichBusiness(updated) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    const isCreator = business.createdBy?.toString() === req.user._id.toString();
    const isAdmin   = req.user.role === "admin";
    if (!isCreator && !isAdmin) return res.status(401).json({ message: "Not authorized" });

    await Business.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Business deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── OWNER: My Business ──────────────────────────────────
// Business owner sees their own registered business

const getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ createdBy: req.user._id });
    if (!business) return res.status(404).json({ message: "No business found" });
    res.status(200).json({ success: true, business: enrichBusiness(business) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Business owner toggles "I need digital help" flag
// Freelancers see this as a hot lead
const requestHelp = async (req, res) => {
  try {
    const business = await Business.findOne({ createdBy: req.user._id });
    if (!business) return res.status(404).json({ message: "No business found. Please register your business first." });

    business.needsDigitalHelp = true;
    business.helpMessage = req.body.message || "";
    await business.save();

    res.status(200).json({ success: true, message: "Your request for digital help is now visible to freelancers.", business: enrichBusiness(business) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DISCOVER (Overpass API — OpenStreetMap, free, no key) ──

const OSM_CATEGORY_MAP = {
  restaurant: "restaurant", cafe: "cafe", hotel: "hotel",
  lodge: "guest_house", salon: "hairdresser", clinic: "clinic",
  hospital: "hospital", pharmacy: "pharmacy", gym: "fitness_centre",
  bakery: "bakery", supermarket: "supermarket",
};

const discoverBusinesses = async (req, res) => {
  try {
    const { lat, lng, radius = 1500, category = "restaurant" } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "lat and lng are required" });

    const osmTag = OSM_CATEGORY_MAP[category.toLowerCase()] || category.toLowerCase();

    // Build a broad query that checks amenity, shop, and leisure tags
    const query = `[out:json][timeout:25];(
node["amenity"="${osmTag}"](around:${radius},${lat},${lng});
way["amenity"="${osmTag}"](around:${radius},${lat},${lng});
node["shop"="${osmTag}"](around:${radius},${lat},${lng});
node["leisure"="${osmTag}"](around:${radius},${lat},${lng});
);out center 40;`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      console.log("Overpass error:", response.status, text.slice(0, 200));
      return res.status(502).json({ message: `Overpass API returned ${response.status}. Try again in a moment.` });
    }

    const data = await response.json();

    const discovered = (data.elements || [])
      .filter((el) => el.tags?.name)
      .slice(0, 40)
      .map((el) => {
        const tags = el.tags || {};
        // way elements have center coordinates
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        const b = {
          name: tags.name,
          category: tags.amenity || tags.shop || tags.leisure || category,
          address: [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ") || "See map",
          city: tags["addr:city"] || tags["addr:town"] || tags["addr:suburb"] || "Unknown",
          area: tags["addr:suburb"] || "",
          pincode: tags["addr:postcode"] || "",
          phone: tags.phone || tags["contact:phone"] || "N/A",
          website: tags.website || tags["contact:website"] || "",
          websiteStatus: !!(tags.website || tags["contact:website"]),
          rating: tags.stars ? parseFloat(tags.stars) : 0,
          reviewsCount: 0,
          popularity: "medium",
          businessSize: "small",
          digitalPresence: (tags.website || tags["contact:website"]) ? "basic" : "none",
          lat: elLat,
          lng: elLng,
          source: "discovered",
        };
        return { ...b, ...enrichBusiness(b) };
      })
      .filter((b) => b.lat && b.lng); // only keep ones with coordinates

    res.status(200).json({ success: true, count: discovered.length, businesses: discovered });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({ message: "Overpass API timed out. Try a smaller radius or try again." });
    }
    console.log("Discover error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBusiness, getBusinesses, searchBusinesses,
  getBusinessesWithoutWebsite, getBusinessById,
  updateBusiness, deleteBusiness,
  getMyBusiness, requestHelp, discoverBusinesses,
};
