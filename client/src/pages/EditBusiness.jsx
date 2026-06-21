import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "", address: "", city: "", area: "", pincode: "",
    phone: "", website: "", websiteStatus: false, rating: "", reviewsCount: "",
    popularity: "medium", businessSize: "small", digitalPresence: "none",
  });

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await api.get(`/businesses/${id}`);
      setFormData(response.data.business);
    } catch (error) {
      console.log(error);
      alert("Failed to load business");
    }
  }, [id]);

  useEffect(() => { fetchBusiness(); }, [fetchBusiness]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/businesses/${id}`, formData);
      navigate("/businesses");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update Failed");
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
            <button onClick={() => navigate("/businesses")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white shadow shadow-amber-200">B</button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Edit Mode</p>
              <h1 className="text-lg font-black text-slate-900">Edit Business</h1>
            </div>
          </div>
          <button onClick={() => navigate("/businesses")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">← Back</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                <div><h2 className="text-base font-black text-slate-900">Basic Information</h2><p className="text-xs text-slate-400">Update core details</p></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block"><L>Business Name</L><input type="text" name="name" placeholder="e.g. One8 Restaurant" value={formData.name ?? ""} onChange={handleChange} className="input-dark" required /></label>
                <label className="block"><L>Category</L><input type="text" name="category" placeholder="Restaurant, Salon" value={formData.category ?? ""} onChange={handleChange} className="input-dark" required /></label>
                <label className="block md:col-span-2"><L>Address</L><input type="text" name="address" placeholder="Street, landmark" value={formData.address ?? ""} onChange={handleChange} className="input-dark" required /></label>
                <label className="block"><L>City</L><input type="text" name="city" placeholder="Bangalore" value={formData.city ?? ""} onChange={handleChange} className="input-dark" required /></label>
                <label className="block"><L>Area</L><input type="text" name="area" placeholder="JP Nagar" value={formData.area ?? ""} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Pincode</L><input type="text" name="pincode" placeholder="560078" value={formData.pincode ?? ""} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Phone</L><input type="text" name="phone" placeholder="Contact number" value={formData.phone ?? ""} onChange={handleChange} className="input-dark" required /></label>
              </div>
            </div>

            <div className="mb-8 border-t border-slate-100 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-gradient-to-b from-pink-500 to-purple-600" />
                <div><h2 className="text-base font-black text-slate-900">Digital Presence</h2><p className="text-xs text-slate-400">Improves lead scoring</p></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2"><L>Website URL</L><input type="text" name="website" placeholder="https://example.com" value={formData.website ?? ""} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Rating (0–5)</L><input type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating ?? ""} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Reviews Count</L><input type="number" name="reviewsCount" min="0" value={formData.reviewsCount ?? ""} onChange={handleChange} className="input-dark" /></label>
                <label className="block"><L>Popularity</L><select name="popularity" value={formData.popularity || "medium"} onChange={handleChange} className="input-dark"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
                <label className="block"><L>Business Size</L><select name="businessSize" value={formData.businessSize || "small"} onChange={handleChange} className="input-dark"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>
                <label className="block"><L>Digital Presence</L><select name="digitalPresence" value={formData.digitalPresence || "none"} onChange={handleChange} className="input-dark"><option value="none">None</option><option value="basic">Basic</option><option value="strong">Strong</option></select></label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition hover:bg-amber-100">
                  <input type="checkbox" name="websiteStatus" checked={!!formData.websiteStatus} onChange={handleChange} className="h-4 w-4 accent-amber-500" />
                  <span className="text-sm font-semibold text-amber-700">Business already has a website</span>
                </label>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <button type="submit" disabled={saving} className="btn-primary px-8 py-3 text-sm" style={{ background: saving ? undefined : "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                {saving ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Saving...</span> : "✦ Update Business"}
              </button>
            </div>
          </form>

          <aside className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">✦ Edit Mode</p>
              <h3 className="mt-1 text-base font-black text-slate-900">Update & Re-score</h3>
              <p className="mt-1 text-xs text-slate-400">Editing data triggers a new AI lead score.</p>
            </div>
            {[
              { icon: "🔄", title: "Score Recalculation", desc: "Lead score updates after every edit." },
              { icon: "🌐", title: "Website Gap", desc: "Removing a website boosts opportunity score." },
              { icon: "📊", title: "Data Accuracy", desc: "Correct ratings improve AI output quality." },
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

export default EditBusiness;
