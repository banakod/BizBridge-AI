import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [helpMsg, setHelpMsg] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [helpSent, setHelpSent] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Register business inline form state
  const [form, setForm] = useState({ name: "", category: "", city: "", area: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchMyBusiness = useCallback(async () => {
    try {
      const res = await api.get("/businesses/my-business");
      setBusiness(res.data.business);
      setHelpSent(res.data.business?.needsDigitalHelp || false);
    } catch (error) {
      if (error.response?.status !== 404) console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMyBusiness(); }, [fetchMyBusiness]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔴 CHANGED: Register business directly from owner dashboard — simple focused form
  const handleRegister = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/businesses", { ...form, registeredByOwner: true, needsDigitalHelp: true });
      setShowForm(false);
      fetchMyBusiness();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register business");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestHelp = async (e) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await api.post("/businesses/request-help", { message: helpMsg });
      setHelpSent(true);
      setHelpMsg("");
      fetchMyBusiness();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
          <p className="gradient-text font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow shadow-emerald-200">B</div>
            <div>
              {/* 🔴 CHANGED: clear role label */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Business Owner</p>
              <h1 className="text-lg font-black text-slate-900">Welcome, {user.name || "Owner"} 👋</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100">Logout</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-6 py-8">

        {/* 🔴 CHANGED: role mission banner */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">
            🏢 Your goal: List your business → Let freelancers find you → Get a website or digital help → Grow your business.
          </p>
        </div>

        {/* ── No business yet ── */}
        {!business && !showForm && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-3xl">🏢</div>
            <h2 className="text-xl font-black text-slate-900">List Your Business</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Add your business so freelancers can find it, see if you need a website, and reach out to help you grow.
            </p>

            {/* 🔴 CHANGED: show what happens after listing */}
            <div className="mx-auto mt-5 max-w-sm space-y-2 text-left">
              {[
                { icon: "📋", text: "Freelancers browse your listing" },
                { icon: "💬", text: "They contact you with a website proposal" },
                { icon: "🌐", text: "You pick the offer you like and get your website" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                  <span className="text-lg">{t.icon}</span>{t.text}
                </div>
              ))}
            </div>

            {/* 🔴 CHANGED: was navigate("/businesses/add") — now opens inline form */}
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mx-auto mt-6 block px-8 py-3 text-sm"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
            >
              + List My Business
            </button>
          </div>
        )}

        {/* ── 🔴 ADDED: Inline register form (owner-focused, simpler than freelancer AddBusiness) ── */}
        {!business && showForm && (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Tell us about your business</h2>
              <button onClick={() => setShowForm(false)} className="text-sm text-slate-400 hover:text-slate-600">✕ Cancel</button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Business Name *</span>
                <input type="text" placeholder="e.g. Royal Gym" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Type of Business *</span>
                <input type="text" placeholder="e.g. Gym, Restaurant, Salon, Clinic" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Address *</span>
                <input type="text" placeholder="Street or landmark" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-dark" required />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">City *</span>
                  <input type="text" placeholder="Bangalore" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-dark" required />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Area</span>
                  <input type="text" placeholder="JP Nagar" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-dark" />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number *</span>
                <input type="text" placeholder="Your contact number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" required />
              </label>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
                ✦ Once listed, freelancers can see your business and contact you with website & digital support offers.
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-sm"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                {saving ? "Listing..." : "✓ List My Business"}
              </button>
            </form>
          </div>
        )}

        {/* ── Business listed ── */}
        {business && (
          <>
            {/* My business card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">✓ Listed</span>
                  <h2 className="mt-2 text-xl font-black text-slate-900">{business.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{business.category} · {[business.area, business.city].filter(Boolean).join(", ")}</p>
                </div>
                <button
                  onClick={() => navigate(`/owner/edit/${business._id}`)}
                  className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-100"
                >✏ Edit</button>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                {[
                  { label: "Phone",   value: business.phone },
                  { label: "Website", value: business.websiteStatus ? "✓ You have a website" : "✗ No website yet", cls: business.websiteStatus ? "text-emerald-600 font-bold" : "text-red-500 font-bold" },
                  { label: "City",    value: business.city },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className={`mt-1 text-sm font-semibold ${item.cls || "text-slate-800"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Request help panel */}
            <div className={`rounded-xl border p-6 shadow-sm ${helpSent ? "border-emerald-200 bg-emerald-50" : "border-indigo-200 bg-white"}`}>
              {helpSent ? (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl">✅</div>
                  <div>
                    <p className="font-black text-emerald-800">Freelancers can see you need help!</p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Your listing is now marked as <strong>"Looking for Digital Support"</strong>. Freelancers will contact you at <strong>{business.phone}</strong> with proposals.
                    </p>
                    <button
                      onClick={async () => {
                        try { await api.post("/businesses/request-help", { message: "" }); } catch {}
                        setHelpSent(false);
                        fetchMyBusiness();
                      }}
                      className="mt-3 text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
                    >Remove request</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl">🙋</div>
                    <div>
                      <p className="font-black text-slate-900">Do you need a website or digital support?</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Flag your business as <strong>"Looking for Digital Support"</strong> so freelancers know to reach out to you.
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleRequestHelp}>
                    <textarea
                      rows={3}
                      placeholder="Optional: what do you need? (e.g. 'I need a website for my gym with membership booking')"
                      value={helpMsg}
                      onChange={(e) => setHelpMsg(e.target.value)}
                      className="input-dark mb-3 resize-none"
                    />
                    <button type="submit" disabled={requesting} className="btn-primary px-6 py-2.5 text-sm">
                      {requesting ? "Sending..." : "📣 Yes, I want digital help"}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* What to expect */}
            {/* 🔴 CHANGED: removed AI score, lead potential — those are freelancer concepts, replaced with owner-relevant info */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">What happens next?</p>
              <div className="space-y-3">
                {[
                  { icon: "🔍", title: "Freelancers find your listing", desc: "They browse the directory and filter for businesses that need digital help." },
                  { icon: "📞", title: "They contact you", desc: "A freelancer calls or messages you at the phone number on your listing." },
                  { icon: "💡", title: "They show you options", desc: "They'll present a website design, pricing, and a timeline — you decide." },
                  { icon: "🌐", title: "You get your website", desc: "Once you agree, they build it. You grow online." },
                ].map((s) => (
                  <div key={s.title} className="flex items-start gap-4 rounded-lg bg-slate-50 p-4">
                    <span className="mt-0.5 text-2xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typical costs — so owner knows what to expect */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Typical Website Costs in India</p>
              <p className="mb-4 text-xs text-slate-400">So you know what to expect when a freelancer sends a quote.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase text-slate-400">Basic</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">₹5,000</p>
                  <p className="mt-1 text-xs text-slate-400">Simple info site</p>
                </div>
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase text-indigo-600">⭐ Standard</p>
                  <p className="mt-2 text-2xl font-black text-indigo-700">₹15,000</p>
                  <p className="mt-1 text-xs text-indigo-500">Full business site</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-center shadow">
                  <p className="text-xs font-bold uppercase text-white/70">Premium</p>
                  <p className="mt-2 text-2xl font-black text-white">₹30,000</p>
                  <p className="mt-1 text-xs text-white/60">Booking + payments</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">* Actual price depends on the freelancer. Use this as a reference.</p>
            </div>

          </>
        )}
      </main>
    </div>
  );
}

export default OwnerDashboard;
