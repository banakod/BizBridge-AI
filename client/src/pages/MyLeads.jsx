import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const statusConfig = {
  new:              { label: "New",           classes: "bg-sky-100 text-sky-700 border-sky-200" },
  contacted:        { label: "Contacted",     classes: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  meetingScheduled: { label: "Meeting",       classes: "bg-purple-100 text-purple-700 border-purple-200" },
  proposalSent:     { label: "Proposal Sent", classes: "bg-orange-100 text-orange-700 border-orange-200" },
  won:              { label: "Won",           classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  lost:             { label: "Lost",          classes: "bg-red-100 text-red-600 border-red-200" },
};

function MyLeads() {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    try {
      const response = await api.get("/leads");
      setLeads(response.data.leads);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load leads");
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      fetchLeads();
    } catch (error) {
      console.log(error);
      alert("Failed to update lead");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete lead");
    }
  };

  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500">CRM Pipeline</p>
              <h1 className="text-lg font-black text-slate-900">My Leads</h1>
            </div>
          </div>
          <button
  onClick={() => navigate("/dashboard")}
  className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100"
>
  🏠 Dashboard
</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <p className="text-5xl">🎯</p>
            <h2 className="mt-4 text-xl font-bold text-slate-900">No Leads Yet</h2>
            <p className="mt-2 text-sm text-slate-500">Add a lead from the Businesses page to start tracking.</p>
            <button onClick={() => navigate("/businesses")} className="btn-primary mx-auto mt-6 block px-6 py-2 text-sm">Browse Businesses</button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <p className="text-sm text-slate-500">{leads.length} lead{leads.length !== 1 ? "s" : ""} in your pipeline</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Business", "Category", "City", "Status", "Notes", "Action"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-slate-50 transition hover:bg-indigo-50/40">
                      <td className="px-5 py-4 font-bold text-slate-900">{lead.businessId?.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{lead.businessId?.category}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{lead.businessId?.city}</td>
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead._id, e.target.value)}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold outline-none transition ${statusConfig[lead.status]?.classes || "bg-slate-100 text-slate-600 border-slate-200"}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="meetingScheduled">Meeting Scheduled</option>
                          <option value="proposalSent">Proposal Sent</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="max-w-[160px] truncate px-5 py-4 text-sm text-slate-400">{lead.notes || "—"}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => deleteLead(lead._id)} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-500 transition hover:bg-red-100">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyLeads;
