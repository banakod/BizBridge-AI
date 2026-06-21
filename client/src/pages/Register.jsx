import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const roles = [
  {
    value: "freelancer",
    icon: "💼",
    title: "I'm a Freelancer",
    desc: "Find local businesses with no website. Pitch them, generate proposals with AI, and grow your income.",
    border: "border-indigo-200",
    activeBg: "border-indigo-500 bg-indigo-50 shadow-sm",
    inactiveBg: "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50",
    tag: "bg-indigo-100 text-indigo-700",
    btnGradient: undefined,
  },
  {
    value: "businessOwner",
    icon: "🏢",
    title: "I Own a Business",
    desc: "List your business in the directory. Freelancers will find you and offer websites, SEO, and digital help.",
    border: "border-emerald-200",
    activeBg: "border-emerald-500 bg-emerald-50 shadow-sm",
    inactiveBg: "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50",
    tag: "bg-emerald-100 text-emerald-700",
    btnGradient: "linear-gradient(135deg,#10b981,#059669)",
  },
];

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("freelancer");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users/register", { ...formData, role });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate(role === "businessOwner" ? "/owner-dashboard" : "/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const selected = roles.find((r) => r.value === role);

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">

      {/* ── Left: Form ── */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-6 lg:hidden text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-black text-white shadow">B</div>
            <p className="text-xl font-black text-slate-900">BizBridge AI</p>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Create Account</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Join BizBridge AI</h1>
          <p className="mt-2 text-sm text-slate-500">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="font-bold text-indigo-600 hover:text-indigo-800">Login</button>
          </p>

          {/* ── Role picker ── */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`rounded-xl border p-4 text-left transition ${role === r.value ? r.activeBg : r.inactiveBg}`}
              >
                <p className="text-2xl">{r.icon}</p>
                <p className="mt-2 text-sm font-black text-slate-900">{r.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">{r.desc}</p>
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${selected?.tag}`}>
              {selected?.icon} Registering as {selected?.title}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</span>
              <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} className="input-dark" required />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</span>
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="input-dark" required />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</span>
              <input type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="input-dark" required />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 w-full py-3 text-sm"
              style={{ background: selected?.btnGradient || undefined }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

        </div>
      </section>

      {/* ── Right: Info panel ── */}
      <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 to-purple-700 px-12 py-12 text-white lg:flex">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-black">B</div>
          <span className="text-xl font-black">BizBridge AI</span>
        </button>

        <div>
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            ✦ Two sides, one platform
          </div>
          <h2 className="max-w-md text-4xl font-black leading-tight">Built for both sides of the deal.</h2>
          <p className="mt-4 max-w-sm text-base leading-8 text-indigo-100">Freelancers earn by helping businesses grow online. Business owners get discovered and get help.</p>

          <div className="mt-8 space-y-3">
            {[
              { icon: "💼", title: "Freelancers", desc: "Discover leads, pitch them, generate AI proposals, close deals" },
              { icon: "🏢", title: "Business Owners", desc: "List your business, get found, receive digital help offers" },
              { icon: "🤖", title: "AI Powered", desc: "Auto proposals, pitch scripts, live website previews" },
              { icon: "🗺",  title: "Map Discovery", desc: "Find businesses near you on a live OpenStreetMap" },
            ].map((s) => (
              <div key={s.title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/10 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xl">{s.icon}</div>
                <div>
                  <p className="font-bold">{s.title}</p>
                  <p className="text-xs text-indigo-200">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-indigo-300">Built for freelancers, developers & business owners.</p>
      </section>

    </div>
  );
}

export default Register;
