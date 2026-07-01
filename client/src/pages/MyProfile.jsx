import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function MyProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    profession: "",
    about: "",
    skills: "",
    experience: "",
    location: "",
    phone: "",
    portfolio: "",
    projects: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile/me");

      if (response.data) {
        setProfile({
          profession: response.data.profession || "",
          about: response.data.about || "",
          skills: response.data.skills?.join(", ") || "",
          experience: response.data.experience || "",
          location: response.data.location || "",
          phone: response.data.phone || "",
          portfolio: response.data.portfolio || "",
          projects:
            response.data.projects
              ?.map((p) => p.title)
              .join(", ") || "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

 const saveProfile = async (e) => {
  e.preventDefault();

  // Frontend Validation
  if (
    !profile.profession.trim() ||
    !profile.experience.trim() ||
    !profile.location.trim() ||
    !profile.phone.trim() ||
    !profile.skills.trim() ||
    !profile.about.trim()
  ) {
    alert(
      "Please fill all required fields (Profession, Experience, Location, Phone, Skills and About) before saving your profile."
    );
    return;
  }
   setSaving(true);
  try {
    await api.post("/profile", {
      profession: profile.profession.trim(),
      about: profile.about.trim(),

      skills: profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),

      experience: profile.experience.trim(),
      location: profile.location.trim(),
      phone: profile.phone.trim(),

      portfolio: profile.portfolio.trim(),

      projects: profile.projects
        ? profile.projects
            .split(",")
            .map((p) => ({
              title: p.trim(),
            }))
            .filter((p) => p.title !== "")
        : [],
    });

    toast.success("Profile Saved Successfully");

navigate("/dashboard", {
  state: {
    refresh: true,
  },
});

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to save profile."
    );
   } finally {
    setSaving(false);
   }
};

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <p className="gradient-text font-bold">
            Loading Profile...
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
                Professional
              </p>

              <h1 className="text-lg font-black text-slate-900">
                My Profile
              </h1>

            </div>

          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-100"
          >
            Dashboard
          </button>

        </div>

      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* Hero */}

        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
                Professional Profile
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Build trust with business owners
              </h2>

              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                Complete your profile so business owners can understand your
                skills, experience and projects before accepting your request.
              </p>

            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Profile Completion
              </p>

              <p className="mt-3 text-5xl font-black text-indigo-600">
                100%
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <input
             className="input-dark"
             placeholder="Profession *"
             name="profession"
             value={profile.profession}
             onChange={handleChange}
             required
            />

            <input
              className="input-dark"
              placeholder="Experience (if any) *"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              required
            />

            <input
              className="input-dark"
              placeholder="Location *"
              name="location"
              value={profile.location}
              onChange={handleChange}
              required
            />

            <input
              className="input-dark"
              placeholder="Phone Number *"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
            />

            <input
              className="input-dark md:col-span-2"
              placeholder="Skills (React, Node.js, UI Design) *"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              required
            />

            <textarea
              rows={4}
              className="input-dark md:col-span-2"
              placeholder="About Yourself *"
              name="about"
              value={profile.about}
              onChange={handleChange}
              required
            />

            <input
              className="input-dark md:col-span-2"
              placeholder="Portfolio Website (optional)"
              name="portfolio"
              value={profile.portfolio}
              onChange={handleChange}
            />

            <textarea
              rows={3}
              className="input-dark md:col-span-2"
              placeholder="Projects (comma separated)"
              name="projects"
              value={profile.projects}
              onChange={handleChange}
            />

          </div>

          <button
    type="submit"
    disabled={saving}
    className="btn-primary mt-8 w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
>
    {saving ? "Saving..." : "💾 Save Profile"}
   </button>

        </form>

      </main>

    </div>
  );
}

export default MyProfile;