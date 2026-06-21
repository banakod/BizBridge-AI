import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await api.get(`/businesses/${id}`);
      setBusiness(response.data.business);
    } catch (error) {
      console.log(error);
      alert("Failed to load business");
    }
  }, [id]);

  useEffect(() => { fetchBusiness(); }, [fetchBusiness]);

  if (!business) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
          <p className="gradient-text font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  const location = [business.area, business.city, business.pincode].filter(Boolean).join(", ");
  const score = business.leadScore || 0;
  const scoreGradient = score >= 70 ? "from-emerald-400 to-teal-500" : score >= 40 ? "from-amber-400 to-orange-400" : "from-red-400 to-rose-500";

  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/businesses")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Business Details</p>
              <h1 className="max-w-xs truncate text-lg font-black text-slate-900">{business.name}</h1>
            </div>
          </div>
          <button onClick={() => navigate("/businesses")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">← Back</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-6 py-8">
        {/* Info + Score */}
        <div className="grid gap-5 lg:grid-cols-[1fr_160px]">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Business Info</p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-slate-400">Category: </span><span className="font-semibold text-slate-800">{business.category}</span></div>
              <div><span className="text-slate-400">Phone: </span><span className="font-semibold text-slate-800">{business.phone}</span></div>
              <div><span className="text-slate-400">📍 </span><span className="font-semibold text-slate-800">{location || business.city}</span></div>
              <div><span className="text-slate-400">Website: </span><span className={`font-bold ${business.websiteStatus ? "text-emerald-600" : "text-red-500"}`}>{business.websiteStatus ? "✓ Available" : "✗ Not Available"}</span></div>
              <div><span className="text-slate-400">Rating: </span><span className="font-semibold text-slate-800">⭐ {business.rating || 0}/5 ({business.reviewsCount || 0} reviews)</span></div>
              {business.website && <div className="sm:col-span-2"><span className="text-slate-400">URL: </span><a href={business.website} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 underline">{business.website}</a></div>}
            </div>
          </div>
          <div className={`flex flex-col items-center justify-center rounded-xl bg-gradient-to-br p-5 text-center shadow-lg ${scoreGradient}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Score</p>
            <p className="mt-1 text-5xl font-black text-white">{score}</p>
            <p className="text-xs text-white/70">/100</p>
            <div className="mt-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">{business.leadPotential}</div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">✦ AI Analysis</p>
          <p className="mb-3 text-sm text-slate-700">Recommended: <span className="font-bold text-indigo-600">{business.recommendedWebsiteType}</span></p>
          <ul className="space-y-2">
            {business.recommendations?.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                <span className="text-emerald-500">✓</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cost */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Cost Estimates</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-slate-400">Basic</p>
              <p className="mt-2 text-2xl font-black text-slate-900">₹5,000</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-indigo-600">⭐ Professional</p>
              <p className="mt-2 text-2xl font-black text-indigo-700">₹15,000</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-center shadow">
              <p className="text-xs font-bold uppercase text-white/70">Advanced</p>
              <p className="mt-2 text-2xl font-black text-white">₹30,000</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Revenue Opportunity</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Monthly Traffic", value: business.revenueOpportunity?.expectedMonthlyTraffic, color: "bg-sky-50 border-sky-200 text-sky-700" },
              { label: "Potential Customers", value: business.revenueOpportunity?.potentialCustomers, color: "bg-purple-50 border-purple-200 text-purple-700" },
              { label: "Revenue Growth", value: business.revenueOpportunity?.estimatedRevenueGrowth, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
                <p className="text-xs font-bold opacity-70">{s.label}</p>
                <p className="mt-1 text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Proposal Draft</p>
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-4 font-sans text-sm leading-7 text-slate-700">{business.proposal}</pre>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pb-4">
          <button onClick={() => navigate(`/businesses/${id}/add-lead`)} className="btn-primary px-6 py-3 text-sm" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>🎯 Add Lead</button>
          <button onClick={() => navigate(`/businesses/edit/${id}`)} className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-sm font-bold text-amber-600 transition hover:bg-amber-100">✏ Edit</button>
          <button onClick={() => navigate("/ai-assistant")} className="rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-3 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100">🤖 AI Assistant</button>
        </div>
      </main>
    </div>
  );
}

export default BusinessDetails;
