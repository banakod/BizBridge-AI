import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "leaflet/dist/leaflet.css";

const CATEGORIES = ["restaurant", "cafe", "salon", "clinic", "gym", "hotel", "bakery", "pharmacy", "supermarket"];
const scoreColor = (s) => s >= 70 ? "#10b981" : s >= 40 ? "#f59e0b" : "#ef4444";

function MapDiscovery() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  const [category, setCategory] = useState("restaurant");
  const [radius, setRadius] = useState(1500);
  const [businesses, setBusinesses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ── Init Leaflet ──────────────────────────────────────
  useEffect(() => {
    if (leafletMap.current) return;
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      leafletMap.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(leafletMap.current);
    });
  }, []);

  // ── Search city using Nominatim (free, no API key, works on http) ──
  const searchCity = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setGeocoding(true);
    setLocationError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&limit=1&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (!data.length) {
        setLocationError(`Could not find "${cityInput}". Try a different city name.`);
        return;
      }
      const { lat, lon, display_name } = data[0];
      const loc = { lat: parseFloat(lat), lng: parseFloat(lon) };
      setUserLocation(loc);

      import("leaflet").then((L) => {
        if (!leafletMap.current) return;
        leafletMap.current.setView([loc.lat, loc.lng], 13);
        L.circle([loc.lat, loc.lng], { radius: 300, color: "#6366f1", fillOpacity: 0.12 })
          .addTo(leafletMap.current)
          .bindPopup(`📍 ${display_name.split(",")[0]}`);
      });
    } catch {
      setLocationError("Geocoding failed. Check your internet connection.");
    } finally {
      setGeocoding(false);
    }
  };

  // ── Discover from Overpass API ────────────────────────
  const discover = async () => {
    if (!userLocation) {
      setLocationError("Enter a city name first to set your location.");
      return;
    }
    setLoading(true);
    setSelected(null);
    try {
      const res = await api.get(
        `/businesses/discover?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}&category=${category}`
      );
      const found = res.data.businesses || [];
      setBusinesses(found);
      plotMarkers(found);
      if (found.length === 0) {
        setLocationError(`No ${category} businesses found nearby. Try increasing the radius or a different category.`);
      } else {
        setLocationError("");
      }
    } catch (error) {
      console.log(error);
      setLocationError(error.response?.data?.message || "Discovery failed. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // ── Plot markers on map ───────────────────────────────
  const plotMarkers = (list) => {
    import("leaflet").then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      list.forEach((b) => {
        if (!b.lat || !b.lng) return;
        const color = scoreColor(b.leadScore || 0);
        const icon = L.divIcon({
          html: `<div style="background:${color};color:white;font-weight:900;font-size:11px;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;"><span style="transform:rotate(45deg)">${b.leadScore || 0}</span></div>`,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });
        const marker = L.marker([b.lat, b.lng], { icon })
          .addTo(leafletMap.current)
          .on("click", () => setSelected(b));
        markersRef.current.push(marker);
      });

      if (list.length > 0 && list[0].lat) {
        leafletMap.current.setView([list[0].lat, list[0].lng], 14);
      }
    });
  };

  // ── Save discovered business to DB then add as lead ──
  const saveToLeads = async (b) => {
    try {
      let businessId = b._id;
      if (!businessId || b.source === "discovered") {
        const res = await api.post("/businesses", {
          name: b.name, category: b.category, address: b.address,
          city: b.city, area: b.area, pincode: b.pincode,
          phone: b.phone !== "N/A" ? b.phone : "TBD",
          website: b.website, websiteStatus: b.websiteStatus,
          rating: b.rating, reviewsCount: b.reviewsCount,
          popularity: b.popularity, businessSize: b.businessSize,
          digitalPresence: b.digitalPresence, lat: b.lat, lng: b.lng,
          source: "discovered",
        });
        businessId = res.data.business._id;
      }
      navigate(`/businesses/${businessId}/add-lead`);
    } catch (error) {
      console.log(error);
      alert("Failed to save business");
    }
  };

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Lead Discovery</p>
              <h1 className="text-lg font-black text-slate-900">Business Map</h1>
            </div>
          </div>
          <button onClick={() => navigate("/businesses")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
            ← Businesses
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">

          {/* ── Left panel ── */}
          <div className="space-y-4">

            {/* Step 1 — Set location via city search */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Step 1 — Set Location</p>
              <p className="mb-3 text-xs text-slate-400">Type your city to search nearby businesses</p>

              {/* City search form */}
              <form onSubmit={searchCity} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai, Delhi"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="input-dark flex-1 text-sm"
                />
                <button
                  type="submit"
                  disabled={geocoding}
                  className="btn-primary shrink-0 px-4 py-2 text-xs"
                >
                  {geocoding ? "..." : "Set"}
                </button>
              </form>

              {/* Location confirmed */}
              {userLocation && (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <p className="text-xs font-bold text-emerald-700">✓ Location set — {cityInput}</p>
                  <p className="text-xs text-emerald-600">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                </div>
              )}

              {locationError && (
                <p className="mt-2 text-xs font-semibold text-red-500">{locationError}</p>
              )}
            </div>

            {/* Step 2 — Filters */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Step 2 — Choose Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold capitalize transition ${
                      category === c
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <p className="mb-1.5 mt-4 text-xs font-bold text-slate-500">Radius: {(radius / 1000).toFixed(1)} km</p>
              <input
                type="range" min="500" max="5000" step="500"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>0.5 km</span><span>5 km</span>
              </div>
            </div>

            {/* Step 3 — Discover */}
            <button
              onClick={discover}
              disabled={loading || !userLocation}
              className="btn-primary w-full py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Discovering...
                </span>
              ) : "🔍 Discover Businesses"}
            </button>

            {!userLocation && (
              <p className="text-center text-xs text-slate-400">Set your city first to enable discovery</p>
            )}

            {/* Score legend */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Lead Score Colors</p>
              {[
                { color: "bg-emerald-500", label: "High Potential (70+)" },
                { color: "bg-amber-500",   label: "Medium (40–69)" },
                { color: "bg-red-500",     label: "Early Stage (<40)" },
              ].map((l) => (
                <div key={l.label} className="mb-1.5 flex items-center gap-2 text-xs text-slate-600">
                  <span className={`h-3 w-3 rounded-full ${l.color}`} />{l.label}
                </div>
              ))}
            </div>

            {/* Results list */}
            {businesses.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-xs font-bold text-slate-700">{businesses.length} businesses found</p>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {businesses.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(b)}
                      className={`w-full border-b border-slate-50 px-4 py-3 text-left transition hover:bg-indigo-50/50 ${selected?.name === b.name ? "bg-indigo-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-bold text-slate-900">{b.name}</p>
                        <span className="ml-2 shrink-0 text-sm font-black" style={{ color: scoreColor(b.leadScore || 0) }}>{b.leadScore}</span>
                      </div>
                      <p className="text-xs text-slate-400 capitalize">{b.category} · {b.city}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Map + detail ── */}
          <div className="space-y-4">
            <div ref={mapRef} className="h-[500px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm" />

            {selected && (
              <div className="rounded-xl border border-indigo-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{selected.name}</h3>
                    <p className="mt-0.5 text-sm capitalize text-slate-500">{selected.category} · {selected.city}</p>
                  </div>
                  <div className="shrink-0 rounded-xl px-4 py-2 text-center text-white shadow"
                    style={{ background: scoreColor(selected.leadScore || 0) }}>
                    <p className="text-2xl font-black leading-none">{selected.leadScore}</p>
                    <p className="text-[10px] font-bold uppercase opacity-90">Score</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="mt-1 font-semibold text-slate-800">{selected.address}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-1 font-semibold text-slate-800">{selected.phone}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Website</p>
                    <p className={`mt-1 font-bold ${selected.websiteStatus ? "text-emerald-600" : "text-red-500"}`}>
                      {selected.websiteStatus ? "✓ Has a website" : "✗ No website — pitch them!"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Opportunity</p>
                    <p className="mt-1 font-bold text-indigo-600">{selected.leadPotential}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => saveToLeads(selected)}
                    className="btn-primary px-5 py-2 text-sm"
                    style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                  >
                    🎯 Add as Lead
                  </button>
                  <button
                    onClick={() => navigate("/ai-assistant")}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100"
                  >
                    🤖 AI Proposal
                  </button>
                </div>
              </div>
            )}

            {businesses.length === 0 && !loading && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-3xl">🗺</p>
                <p className="mt-3 font-bold text-slate-900">No businesses on map yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Type your city name above → set the category → click Discover Businesses
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapDiscovery;
