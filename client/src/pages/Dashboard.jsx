import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const statCards = [
  { key: "totalBusinesses",   label: "Businesses Found",  icon: "🏢", border: "border-indigo-200",  bg: "bg-indigo-50",  text: "text-indigo-600" },
  { key: "totalLeads",        label: "My Leads",          icon: "🎯", border: "border-purple-200",  bg: "bg-purple-50",  text: "text-purple-600" },
  { key: "wonLeads",          label: "Deals Won",         icon: "🏆", border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-600" },
  { key: "conversionRate",    label: "Conversion Rate",   icon: "📈", border: "border-amber-200",   bg: "bg-amber-50",   text: "text-amber-600",  suffix: "%" },
  { key: "newLeads",          label: "New",               icon: "✨", border: "border-sky-200",     bg: "bg-sky-50",     text: "text-sky-600" },
  { key: "contactedLeads",    label: "Contacted",         icon: "📞", border: "border-violet-200",  bg: "bg-violet-50",  text: "text-violet-600" },
  { key: "proposalSentLeads", label: "Proposals Sent",    icon: "📄", border: "border-pink-200",    bg: "bg-pink-50",    text: "text-pink-600" },
  { key: "revenueGenerated",  label: "Est. Revenue",      icon: "💰", border: "border-teal-200",    bg: "bg-teal-50",    text: "text-teal-600",   prefix: "₹" },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!stats) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
          <p className="gradient-text text-lg font-bold">Loading...</p>
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</div>
            <div>
              {/* 🔴 CHANGED: was "BizBridge AI" — now shows role clearly */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Freelancer Dashboard</p>
              <h1 className="text-lg font-black text-slate-900">Welcome back, {user.name || "Freelancer"} 👋</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100">
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* 🔴 CHANGED: removed generic "Here's what's happening" — now shows role-specific mission */}
        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700">
            💼 Your mission: Find local businesses with no website → pitch them → win the project → earn money.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.key} className={`card-hover rounded-xl border bg-white p-5 shadow-sm ${card.border}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${card.bg}`}>{card.icon}</span>
              </div>
              <p className={`mt-3 text-3xl font-black ${card.text}`}>
                {card.prefix || ""}{stats[card.key]}{card.suffix || ""}
              </p>
            </div>
          ))}
        </div>

        {/* Nav cards — 🔴 CHANGED: fixed descriptions to be freelancer-specific */}
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Actions</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate("/businesses")}
            className="card-hover group rounded-xl border border-indigo-100 bg-white p-6 text-left shadow-sm hover:border-indigo-300"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">🏢</div>
            <p className="text-base font-bold text-slate-900">Find Businesses</p>
            {/* 🔴 CHANGED: was "View and manage all leads" */}
            <p className="mt-1 text-sm text-slate-500">Browse local businesses — filter by no website or needs help</p>
            <p className="mt-3 text-xs font-bold text-indigo-500 group-hover:text-indigo-700">Browse →</p>
          </button>

          <button
            onClick={() => navigate("/leads")}
            className="card-hover group rounded-xl border border-purple-100 bg-white p-6 text-left shadow-sm hover:border-purple-300"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">🎯</div>
            <p className="text-base font-bold text-slate-900">My Leads</p>
            {/* 🔴 CHANGED: was "Track your pipeline" */}
            <p className="mt-1 text-sm text-slate-500">Track businesses you're pitching — New → Contacted → Won</p>
            <p className="mt-3 text-xs font-bold text-purple-500 group-hover:text-purple-700">Manage →</p>
          </button>

          <button
            onClick={() => navigate("/ai-assistant")}
            className="card-hover group rounded-xl border border-pink-100 bg-white p-6 text-left shadow-sm hover:border-pink-300"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl">🤖</div>
            <p className="text-base font-bold text-slate-900">AI Assistant</p>
            {/* 🔴 CHANGED: was "Generate proposals & previews" */}
            <p className="mt-1 text-sm text-slate-500">Generate proposal, email, pitch or a live website preview for your client</p>
            <p className="mt-3 text-xs font-bold text-pink-500 group-hover:text-pink-700">Launch →</p>
          </button>
        </div>

        {/* 🔴 ADDED: Map shortcut — freelancer specific */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/map")}
            className="card-hover group w-full rounded-xl border border-sky-100 bg-white p-5 text-left shadow-sm hover:border-sky-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-2xl">🗺</div>
              <div>
                <p className="font-bold text-slate-900">Discover on Map</p>
                <p className="text-sm text-slate-500">Auto-find restaurants, salons, clinics near you using OpenStreetMap — no API key needed</p>
              </div>
              <p className="ml-auto text-xs font-bold text-sky-500 group-hover:text-sky-700">Open Map →</p>
            </div>
          </button>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
