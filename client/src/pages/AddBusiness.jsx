import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialFormData = {
  name: "", category: "", address: "", city: "", area: "", pincode: "",
  phone: "", website: "", websiteStatus: false, rating: "", reviewsCount: "",
  popularity: "medium", businessSize: "small", digitalPresence: "none",
};

function AddBusiness() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/businesses", formData);
      navigate("/businesses");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add business");
    } finally {
      setSaving(false);
    }
  };

  const L = ({ children }) => <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">{children}</span>;

  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/businesses")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Business Discovery</p>
              <h1 className="text-lg font-black text-slate-900">Add Business Lead</h1>
            </div>
          </div>
          <button onClick={() => navigate("/businesses")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">← Back</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Basic */}
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                <div>
                  <h2 className="text-base font-black text-slate-900">Basic Information</h2>
                  <p className="text-xs text-slate-400">Core details about this business</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block"><L>Business Name</L><input type="text" name="name" placeholder="e.g. One8 Restaurant" value={formData.name} onChange={handleChange} className="input-dark" required /></label>
                <label className="block"><L>Category</L><input type="text" name="category" placeholder="Restaurant, Salon, Clinic" value={formData.category} onChange={handleChange} className="input-dark" required /></label>
                <label className="block md:col-span-2"><L>Address</L><input type="text" name="address" placeholder="Street, landmark" value={formData.address} onChange={handleChange} className="input-dark" required /></label>
                <label className="block"><L>City</L><input type="text" name="city" placeholder="Bangalore" value={formData.city} onChange={handleChange} className="input-dark" required /></label>
                <label className="block"><L>Area</L><input type="text" name="area" placeholder="JP Nagar" value={formData.area} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Pincode</L><input type="text" name="pincode" placeholder="560078" value={formData.pincode} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Phone</L><input type="text" name="phone" placeholder="Business contact number" value={formData.phone} onChange={handleChange} className="input-dark" required /></label>
              </div>
            </div>

            {/* Digital */}
            <div className="mb-8 border-t border-slate-100 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-gradient-to-b from-pink-500 to-purple-600" />
                <div>
                  <h2 className="text-base font-black text-slate-900">Digital Presence</h2>
                  <p className="text-xs text-slate-400">Improves lead scoring and AI recommendations</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2"><L>Website URL</L><input type="text" name="website" placeholder="https://example.com" value={formData.website} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Rating (0–5)</L><input type="number" name="rating" placeholder="4.2" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Reviews Count</L><input type="number" name="reviewsCount" placeholder="250" min="0" value={formData.reviewsCount} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Popularity</L><select name="popularity" value={formData.popularity} onChange={handleChange} className="input-dark"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
                <label className="block"><L>Business Size</L><select name="businessSize" value={formData.businessSize} onChange={handleChange} className="input-dark"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>
                <label className="block"><L>Digital Presence</L><select name="digitalPresence" value={formData.digitalPresence} onChange={handleChange} className="input-dark"><option value="none">None</option><option value="basic">Basic</option><option value="strong">Strong</option></select></label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 transition hover:bg-indigo-100">
                  <input type="checkbox" name="websiteStatus" checked={formData.websiteStatus} onChange={handleChange} className="h-4 w-4 accent-indigo-500" />
                  <span className="text-sm font-semibold text-indigo-700">Business already has a website</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 pt-5">
              <button type="submit" disabled={saving} className="btn-primary px-8 py-3 text-sm">
                {saving ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Saving...</span> : "✦ Save Business"}
              </button>
              <button type="button" onClick={() => setFormData(initialFormData)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50">Clear</button>
            </div>
          </form>

          {/* Tips sidebar */}
          <aside className="space-y-3">
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">✦ Tips</p>
              <h3 className="mt-1 text-base font-black text-slate-900">Better data = Better AI</h3>
            </div>
            {[
              { icon: "🌐", title: "Website Gap", desc: "No-website businesses are your strongest leads." },
              { icon: "⭐", title: "Reviews & Rating", desc: "High demand + weak presence = strong signal." },
              { icon: "📍", title: "Location Data", desc: "City & area enable precise field targeting." },
              { icon: "🤖", title: "AI Output", desc: "More data = richer proposals and pitches." },
            ].map((t) => (
              <div key={t.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><span>{t.icon}</span>{t.title}</p>
                <p className="mt-1 text-xs text-slate-400">{t.desc}</p>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}

export default AddBusiness;
