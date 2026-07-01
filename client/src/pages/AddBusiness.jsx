import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function AddBusiness() {
  const navigate = useNavigate();

 const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
  name: "",
  category: "",
  phone: "",
  address: "",
  city: "",
  area: "",
  pincode: "",
  website: "",
  noWebsite: false,
  needsDigitalHelp: true,
 });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.category ||
    !formData.phone ||
    !formData.address ||
    !formData.city
  ) {
    toast.error("Please fill all required fields.");
    return;
  }

  try {
    setLoading(true);

    await api.post("/businesses", {
      name: formData.name,
      category: formData.category,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      area: formData.area,
      pincode: formData.pincode,
      website: formData.website,
      websiteStatus: !formData.noWebsite,
      needsDigitalHelp: formData.needsDigitalHelp,
    });

    toast.success("Business Registered Successfully!");

    navigate("/my-business");

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Business registration failed."
    );

  } finally {
    setLoading(false);
  }
 };

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
                Register Your Business
              </h1>

            </div>

          </div>

          <button
            onClick={() => navigate("/my-business")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-100"
          >
            Back
          </button>

        </div>

      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">

        {/* Hero */}

        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
            Business Registration
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Connect with skilled freelancers
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Register your business so freelancers can discover your business
            and help you with websites, digital marketing, branding and
            business growth.
          </p>

        </div>

        {/* Form */}

       <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <h3 className="text-xl font-black text-slate-900">
            Business Information
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <input
              className="input-dark"
              placeholder="Business Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <select
              className="input-dark"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>

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
              className="input-dark"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              className="input-dark"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              className="input-dark md:col-span-2"
              placeholder="Business Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <input
              className="input-dark"
              placeholder="Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
            />

            <input
              className="input-dark"
              placeholder="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />

            <input
              className="input-dark md:col-span-2"
              placeholder="Website (Optional)"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />

          </div>

          <div className="mt-8 space-y-4">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="noWebsite"
                checked={formData.noWebsite}
                onChange={handleChange}
              />

              <span className="text-sm text-slate-700">
                My business doesn't have a website.
              </span>

            </label>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="needsDigitalHelp"
                checked={formData.needsDigitalHelp}
                onChange={handleChange}
              />

              <span className="text-sm text-slate-700">
                I am looking for digital services.
              </span>

            </label>

          </div>

            <button type="submit" disabled={loading} className="btn-primary mt-8 w-full py-3">
             {loading ? "Registering..." : "Register Business"}
            </button>

        </form>

      </main>

    </div>
  );
}

export default AddBusiness;