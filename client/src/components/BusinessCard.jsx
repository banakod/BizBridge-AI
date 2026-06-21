import { useNavigate } from "react-router-dom";

function BusinessCard({ business, deleteBusiness }) {
  const navigate = useNavigate();
  const location = [business.area, business.city, business.pincode].filter(Boolean).join(", ");
  const score = business.leadScore ?? 0;

  // 🔴 ADDED: only show edit/delete if this user created the business
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isCreator = business.createdBy &&
    (business.createdBy === currentUser.id ||
     business.createdBy?._id === currentUser.id ||
     business.createdBy?.toString() === currentUser.id);

  const scoreBg =
    score >= 70 ? "bg-emerald-500 shadow-emerald-200" :
    score >= 40 ? "bg-amber-500 shadow-amber-200" :
    "bg-red-500 shadow-red-200";

  return (
    <div className="card-hover flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-black text-slate-900">{business.name}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{business.category}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">📍 {location || business.city}</p>
        </div>
        <div className={`shrink-0 rounded-xl px-3 py-2 text-center text-white shadow-lg ${scoreBg}`}>
          <p className="text-xl font-black leading-none">{score}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-90">Score</p>
        </div>
      </div>

      {/* Website status */}
      <div className="mt-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${business.websiteStatus ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${business.websiteStatus ? "bg-emerald-500" : "bg-red-500"}`} />
        </span>
        <p className={`text-sm font-semibold ${business.websiteStatus ? "text-emerald-600" : "text-red-500"}`}>
          Website {business.websiteStatus ? "Available" : "Not Available"}
        </p>
      </div>

      <p className="mt-1.5 text-xs text-slate-400">{business.leadPotential || "Lead potential pending"}</p>
      <p className="mt-0.5 text-xs font-semibold text-indigo-400">✦ {business.recommendedWebsiteType || "Business Website"}</p>

      {business.needsDigitalHelp && (
        <span className="mt-2 inline-block w-fit rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
          🙋 Looking for Digital Help
        </span>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {/* View and Add Lead — always visible to freelancers */}
        <button
          onClick={() => navigate(`/businesses/${business._id}`)}
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
        >View</button>

        <button
          onClick={() => navigate(`/businesses/${business._id}/add-lead`)}
          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
        >Add Lead</button>

        {/* 🔴 CHANGED: Edit & Delete only visible to the user who created this business */}
        {isCreator && (
          <>
            <button
              onClick={() => navigate(`/businesses/edit/${business._id}`)}
              className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 transition hover:bg-amber-100"
            >Edit</button>

            <button
              onClick={() => deleteBusiness(business._id)}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-100"
            >Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessCard;
