import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function EditBusiness() {
  const navigate = useNavigate();
const { id } = useParams();

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  category: "",
  address: "",
  city: "",
  area: "",
  pincode: "",
  phone: "",
  website: "",
  websiteStatus: false,
  needsDigitalHelp: false,
});

const fetchBusiness = async () => {
  try {
    const res = await api.get(`/businesses/${id}`);

    setFormData({
      name: res.data.business.name || "",
      category: res.data.business.category || "",
      address: res.data.business.address || "",
      city: res.data.business.city || "",
      area: res.data.business.area || "",
      pincode: res.data.business.pincode || "",
      phone: res.data.business.phone || "",
      website: res.data.business.website || "",
      websiteStatus: res.data.business.websiteStatus || false,
      needsDigitalHelp: res.data.business.needsDigitalHelp || false,
    });
  } catch (err) {
    console.log(err);
    toast.error("Failed to load business");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBusiness();
}, []);

const handleChange = (e) => {
  const { name, value, checked, type } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  setSaving(true);

  try {
    await api.put(`/businesses/${id}`, formData);

    toast.success("Business updated successfully");

    navigate("/my-business", {
      state: { refresh: true },
    });
  } catch (err) {
    console.log(err);

    toast.error(
      err.response?.data?.message || "Update failed"
    );
  } finally {
    setSaving(false);
  }
};

if (loading) {
  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>

        <p className="font-semibold text-indigo-600">
          Loading Business...
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="mesh-bg min-h-screen">
      

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white">
              B
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                Business Owner
              </p>

              <h1 className="text-lg font-black text-slate-900">
                Edit Business
              </h1>
            </div>

          </div>

          <button
            onClick={() => navigate("/my-business")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100"
          >
            Back
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* Hero */}
        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
                Business Profile
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Update your business information
              </h2>

              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                Keep your business profile updated so freelancers can discover
                your business and contact you for websites, branding,
                digital marketing and other digital services.
              </p>

            </div>

            <div className="max-w-sm rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                BizBridge AI
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Keeping your business profile updated helps freelancers
                understand your business better and provide more relevant
                digital solutions.
              </p>

            </div>

          </div>

        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="mb-8">

            <h2 className="text-2xl font-black text-slate-900">
              Business Information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Update the details below.
            </p>

          </div>

         <form onSubmit={handleSubmit}>

            <div className="grid gap-6 md:grid-cols-2">

              <input
               type="text"
               name="name"
               value={formData.name}
               onChange={handleChange}
               className="input-dark"
               placeholder="Business Name"
               required
               />
              
              <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-dark"
              required
              >

                <option>Select Category</option>

                <option>Restaurant</option>
                <option>Hotel</option>
                <option>Lodge</option>
                <option>Salon</option>
                <option>Clinic</option>
                <option>Gym</option>
                <option>Bakery</option>
                <option>Retail Store</option>
                <option>Repair Shop</option>
                <option>Other</option>

              </select>

              <input
               type="text"
               name="phone"
               value={formData.phone}
               onChange={handleChange}
               className="input-dark"
               placeholder="Phone Number"
               required
               />

              <input
               type="text"
               name="city"
               value={formData.city}
               onChange={handleChange}
               className="input-dark"
               placeholder="City"
               required
               />

             <input
             type="text"
             name="address"
             value={formData.address}
             onChange={handleChange}
             className="input-dark md:col-span-2"
             placeholder="Business Address"
             required
             />

              <input
               type="text"
               name="area"
               value={formData.area}
               onChange={handleChange}
               className="input-dark"
               placeholder="Area"
               />

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="input-dark"
                placeholder="Pincode"
              />

              <input
               type="text"
               name="website"
               value={formData.website}
               onChange={handleChange}
               className="input-dark md:col-span-2"
               placeholder="Website"
               />

            </div>

            {/* Options */}

            <div className="mt-8 space-y-4">

              <label className="flex items-center gap-3">

                <input
                 type="checkbox"
                 name="websiteStatus"
                 checked={formData.websiteStatus}
                 onChange={handleChange}
                 className="accent-indigo-600"
                 />

                <span className="text-sm text-slate-700">
                  My business has a website.
                </span>

              </label>

              <label className="flex items-center gap-3">

                <input
                 type="checkbox"
                 name="needsDigitalHelp"
                 checked={formData.needsDigitalHelp}
                 onChange={handleChange}
                 className="accent-indigo-600"
                 />

                <span className="text-sm text-slate-700">
                  I'm looking for digital services.
                </span>

              </label>

            </div>

            <p className="mt-8 text-sm text-slate-500">
              Changes will immediately update your public business profile.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">

              <button
  type="submit"
  disabled={saving}
  className="btn-primary px-8 py-3"
>
  {saving ? "Updating..." : "💾 Update Business"}
</button>

              <button
                type="button"
                onClick={() => navigate("/my-business")}
                className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditBusiness;