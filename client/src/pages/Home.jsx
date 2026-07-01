import { useNavigate } from "react-router-dom";

// 🔴 CHANGED: removed "Business Claims" — replaced with "Business Directory" which is accurate
const features = [
  {
    icon: "🏢",
    title: "Business Discovery",
    desc: "Explore local businesses looking for digital services and growth opportunities.",
    color: "border-indigo-200 bg-indigo-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: "🤖",
    title: "AI Business Insights",
    desc: "Understand business needs with AI-powered recommendations and analysis.",
    color: "border-purple-200 bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    icon: "👤",
    title: "Professional Profiles",
    desc: "Showcase your skills, experience and portfolio to business owners.",
    color: "border-pink-200 bg-pink-50",
    iconBg: "bg-pink-100",
  },
  {
    icon: "🤝",
    title: "Connection Requests",
    desc: "Send personalized requests and connect directly with business owners.",
    color: "border-sky-200 bg-sky-50",
    iconBg: "bg-sky-100",
  },
  {
    icon: "📊",
    title: "Lead Management",
    desc: "Track every opportunity from first contact to successful collaboration.",
    color: "border-emerald-200 bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🚀",
    title: "Business Growth",
    desc: "Help businesses improve their digital presence and grow together.",
    color: "border-amber-200 bg-amber-50",
    iconBg: "bg-amber-100",
  },
];

const stats = [
  { value: "AI Powered", label: "Business Discovery" },
  { value: "2 Roles", label: "Freelancers & Business Owners" },
  { value: "Smart", label: "Connection Requests" },
  { value: "Secure", label: "Lead Management" },
];

const steps = [
  {
    icon: "🏢",
    title: "Business Discovery",
    desc: "Explore nearby businesses looking for digital services and new opportunities.",
    color: "border-indigo-200 bg-indigo-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: "👤",
    title: "Professional Profile",
    desc: "Create your profile to showcase your skills, portfolio and experience.",
    color: "border-purple-200 bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    icon: "🤝",
    title: "Connect & Collaborate",
    desc: "Send connection requests, chat with business owners and build partnerships.",
    color: "border-emerald-200 bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🤖",
    title: "AI Assistance",
    desc: "Generate proposals, business insights and recommendations with AI.",
    color: "border-pink-200 bg-pink-50",
    iconBg: "bg-pink-100",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white">B</div>
            <span className="text-lg font-black text-slate-900">BizBridge AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow shadow-indigo-200 transition hover:from-indigo-600 hover:to-purple-700">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 px-6 pb-24 pt-20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-100 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-100 opacity-40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AI-Powered Platform for Freelancers & Business Owners
          </div>

          <h1 className="text-5xl font-black leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
           Connect Freelancers
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
             with Local Businesses
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            BizBridge AI is an AI-powered platform that connects freelancers with local businesses. Discover opportunities, showcase your professional profile, connect with business owners, and build successful collaborations.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-300"
            >
              Start Finding Leads →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
            >
              Open Dashboard
            </button>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.value} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xl font-black text-indigo-600">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mock Dashboard Preview ── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs text-slate-400">
                app.bizbridge.ai/businesses
              </div>
            </div>

            {/* Mock content */}
            <div className="bg-slate-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="h-3 w-24 rounded bg-indigo-200" />
                  <div className="mt-1.5 h-5 w-36 rounded bg-slate-300" />
                </div>
                <div className="h-9 w-28 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { name: "One8 Restaurant", cat: "Restaurant", score: 82, noWeb: true, clr: "bg-emerald-500" },
                  { name: "Glow Salon",       cat: "Salon",      score: 74, noWeb: true, clr: "bg-emerald-500" },
                  { name: "City Clinic",      cat: "Clinic",     score: 55, noWeb: false, clr: "bg-amber-500" },
                ].map((b) => (
                  <div key={b.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">{b.name}</p>
                        <p className="text-xs text-slate-400">{b.cat}</p>
                      </div>
                      <div className={`rounded-lg px-2.5 py-1 text-center text-white ${b.clr}`}>
                        <p className="text-lg font-black leading-none">{b.score}</p>
                        <p className="text-[9px] font-bold">Score</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${b.noWeb ? "bg-red-500" : "bg-emerald-500"}`} />
                      <p className={`text-xs font-semibold ${b.noWeb ? "text-red-500" : "text-emerald-600"}`}>
                        Website {b.noWeb ? "Not Available" : "Available"}
                      </p>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <div className="h-6 flex-1 rounded-lg bg-indigo-100" />
                      <div className="h-6 flex-1 rounded-lg bg-emerald-100" />
                      <div className="h-6 flex-1 rounded-lg bg-red-50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Everything you need</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">Everything You Need in One Platform</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">Everything required to connect freelancers and business owners through one intelligent platform.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className={`card-hover rounded-2xl border p-6 ${f.color}`}>
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-black text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BizBridge AI ── */}

<section className="bg-white px-6 py-20">
  <div className="mx-auto max-w-6xl">

    <div className="mb-12 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
        Why BizBridge AI
      </p>

      <h2 className="mt-2 text-4xl font-black text-slate-900">
        Everything You Need to Build Business Connections
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-slate-500">
        BizBridge AI provides everything freelancers and business owners need
        to connect, collaborate and grow together.
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {steps.map((item) => (

        <div
          key={item.title}
          className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${item.color}`}
        >

          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${item.iconBg}`}
          >
            {item.icon}
          </div>

          <h3 className="text-lg font-black text-slate-900">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {item.desc}
          </p>

        </div>

      ))}

    </div>

  </div>
</section>

      {/* ── Role cards ── */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Built for Everyone</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">Who is BizBridge AI for?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">A smarter way for freelancers and businesses to connect.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Freelancer */}
            <div className="rounded-2xl border border-indigo-200 bg-white p-8 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">💼</div>
              <h3 className="text-xl font-black text-slate-900">Freelancers & Developers</h3>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-500">FOR FREELANCERS</p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">Discover local businesses, showcase your professional profile, send personalized connection requests, and build long-term business relationships.</p>
              <ul className="mt-5 space-y-2">
                {["Discover local businesses","Create your professional profile","Send personalized connection requests","Manage your lead pipeline","Grow your freelance business",].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500">✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/register")} className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-bold text-white shadow shadow-indigo-200 transition hover:from-indigo-600 hover:to-purple-700">
               Join as Freelancer →
              </button>
            </div>

            {/* 🔴 CHANGED: removed all "Claim" language — replaced with accurate owner features */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">🏢</div>
              <h3 className="text-xl font-black text-slate-900">Business Owners</h3>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-500">FOR BUSINESS OWNERS</p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">Register your business, receive connection requests from skilled freelancers, review their profiles, and collaborate to grow your business.</p>
              <ul className="mt-5 space-y-2">
                {[ "Register your business","Receive connection requests","View freelancer profiles", "Accept or reject requests","Grow your business with professionals",].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500">✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/register")} className="mt-6 w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
                Join as Business Owner →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-20 text-center text-white">
        <h2 className="text-4xl font-black">Start Discovering Business Opportunities Today</h2>
        <p className="mx-auto mt-4 max-w-lg text-indigo-100">Start discovering local business opportunities with AI-powered analysis and proposal generation. Free to get started.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            Get Started Free →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white transition hover:bg-white/20"
          >
            Login
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-black text-white">B</div>
            <span className="text-sm font-black text-slate-900">BizBridge AI</span>
          </div>
          <p className="text-xs text-slate-400">Built for freelancers, developers & business owners.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;
