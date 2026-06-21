import { useCallback, useEffect, useState } from "react";
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
      Object.entries(filters).forEach(([key, value]) => { if (value) params.append(key, value); });
      const endpoint = params.toString() ? `/businesses/search?${params.toString()}` : "/businesses";
      const response = await api.get(endpoint);
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.log(error);
      alert("Failed to load businesses");
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
      fetchBusinesses();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete Failed");
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Business Discovery</p>
              <h1 className="text-lg font-black text-slate-900">Businesses</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/map")} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100">🗺 Map</button>
            <button onClick={() => navigate("/businesses/add")} className="btn-primary px-4 py-2 text-sm">+ Add Business</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Filter & Search</p>
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
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or add a new business.</p>
            <button onClick={() => navigate("/businesses/add")} className="btn-primary mx-auto mt-6 block px-6 py-2 text-sm">+ Add Business</button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">{businesses.length} business{businesses.length !== 1 ? "es" : ""} found</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((b) => <BusinessCard key={b._id} business={b} deleteBusiness={deleteBusiness} />)}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Businesses;
