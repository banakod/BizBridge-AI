import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import BusinessCard from "../components/BusinessCard";
import { useNavigate } from "react-router-dom";

function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [filters, setFilters] = useState({ q: "", city: "", category: "", pincode: "", noWebsite: false, needsHelp: false });
  const navigate = useNavigate();

 const fetchBusinesses = useCallback(async () => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const endpoint =
      params.toString()
        ? `/businesses/search?${params.toString()}`
        : "/businesses";

    const response = await api.get(endpoint);

    setBusinesses(response.data.businesses);
  } catch (error) {
    console.log(error);
    toast.error("Failed to load businesses");
  }
}, [filters]);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters({ ...filters, [name]: type === "checkbox" ? checked : value });
  };

  const deleteBusiness = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business?")) return;
    try {
      await api.delete(`/businesses/${id}`);
      toast.success("Business deleted successfully");
      await fetchBusinesses();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</button>
            <div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500"> Business Opportunities</p>
             <h1 className="text-lg font-black text-slate-900">Discover Your Next Client</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/dashboard")}
             className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
             >
             🏠 Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Opportunity Explorer</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Find businesses that need digital transformation</h2>
          <p className="mt-2 max-w-3xl text-slate-600">Search businesses by city, category, or website status. Discover potential clients, analyze them with AI,
            and add promising opportunities to your pipeline.
          </p>
        </div>
        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Find Opportunities</p>
          <div className="grid gap-3 md:grid-cols-6">
            <input type="text" name="q" placeholder="Search name, area..." value={filters.q} onChange={handleFilterChange} className="input-dark" />
            <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} className="input-dark" />
            <input type="text" name="category" placeholder="Category" value={filters.category} onChange={handleFilterChange} className="input-dark" />
            <input type="text" name="pincode" placeholder="Pincode" value={filters.pincode} onChange={handleFilterChange} className="input-dark" />
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100">
              <input type="checkbox" name="noWebsite" checked={filters.noWebsite} onChange={handleFilterChange} className="accent-indigo-500" />
              No website only
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-4 text-sm font-semibold text-pink-600 transition hover:bg-pink-100">
              <input type="checkbox" name="needsHelp" checked={filters.needsHelp} onChange={handleFilterChange} className="accent-pink-500" />
              🙋 Needs help
            </label>
          </div>
          <button onClick={fetchBusinesses} className="btn-primary mt-4 px-6 py-2 text-sm">Search</button>
        </div>

        {businesses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <p className="text-5xl">🔍</p>
            <p className="mt-4 text-lg font-bold text-slate-900">No businesses found</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
           <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500"> Showing <span className="mx-1 font-bold text-indigo-600">{businesses.length}</span>business opportunities</p>
            <p className="text-sm font-medium text-slate-400">Sorted by relevance</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => 
            (<BusinessCard
            key={b._id}
            business={b}
            />
            ))}
          </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Businesses;
