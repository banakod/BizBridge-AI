import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditMyBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "", address: "", city: "", area: "",
    phone: "", website: "", websiteStatus: false,
  });

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await api.get(`/businesses/${id}`);
      const b = response.data.business;
      setFormData({
        name: b.name || "",
        category: b.category || "",
        address: b.address || "",
        city: b.city || "",
        area: b.area || "",
        phone: b.phone || "",
        website: b.website || "",
        websiteStatus: b.websiteStatus || false,
      });
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
      // 🔴 CHANGED: owner goes back to owner dashboard, not /businesses
      navigate("/owner-dashboard");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  const L = ({ children }) => (
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">{children}</span>
  );

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow shadow-emerald-200">B</div>
            <div>
              {/* 🔴 CHANGED: clear context — this is owner's own business edit */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Business Owner</p>
              <h1 className="text-lg font-black text-slate-900">Edit My Business</h1>
            </div>
          </div>
          {/* 🔴 CHANGED: back goes to owner-dashboard, not /businesses */}
          <button
            onClick={() => navigate("/owner-dashboard")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              ✏ Update your business details. Freelancers see this information when they browse the directory.
            </p>
          </div>

          {/* Basic fields only — 🔴 REMOVED: Digital Presence, Popularity, Business Size, Rating, Reviews */}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <L>Business Name</L>
              <input type="text" name="name" placeholder="e.g. Royal Gym" value={formData.name} onChange={handleChange} className="input-dark" required />
            </label>

            <label className="block">
              <L>Type of Business</L>
              <input type="text" name="category" placeholder="e.g. Gym, Restaurant, Salon" value={formData.category} onChange={handleChange} className="input-dark" required />
            </label>

            <label className="block md:col-span-2">
              <L>Address</L>
              <input type="text" name="address" placeholder="Street or landmark" value={formData.address} onChange={handleChange} className="input-dark" required />
            </label>

            <label className="block">
              <L>City</L>
              <input type="text" name="city" placeholder="Bangalore" value={formData.city} onChange={handleChange} className="input-dark" required />
            </label>

            <label className="block">
              <L>Area</L>
              <input type="text" name="area" placeholder="JP Nagar" value={formData.area} onChange={handleChange} className="input-dark" />
            </label>

            <label className="block">
              <L>Phone Number</L>
              <input type="text" name="phone" placeholder="Your contact number" value={formData.phone} onChange={handleChange} className="input-dark" required />
            </label>

            <label className="block">
              <L>Website URL (if you have one)</L>
              <input type="text" name="website" placeholder="https://yourbusiness.com" value={formData.website} onChange={handleChange} className="input-dark" />
            </label>

            {/* 🔴 CHANGED: simple plain-language checkbox, no "Lead scoring" context */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 md:col-span-2 transition hover:bg-emerald-100">
              <input type="checkbox" name="websiteStatus" checked={!!formData.websiteStatus} onChange={handleChange} className="h-4 w-4 accent-emerald-500" />
              <span className="text-sm font-semibold text-emerald-800">My business already has a working website</span>
            </label>
          </div>

          <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-8 py-3 text-sm"
              style={{ background: saving ? undefined : "linear-gradient(135deg,#10b981,#059669)" }}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </span>
              ) : "✓ Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/owner-dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditMyBusiness;
