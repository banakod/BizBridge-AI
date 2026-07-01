import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const statusOptions = [
  { value: "new",              label: "🔵 New",               color: "border-sky-200 bg-sky-50 text-sky-700" },
  { value: "contacted",        label: "🟡 Contacted",         color: "border-yellow-200 bg-yellow-50 text-yellow-700" },
  { value: "meetingScheduled", label: "🟣 Meeting Scheduled", color: "border-purple-200 bg-purple-50 text-purple-700" },
  { value: "proposalSent",     label: "🟠 Proposal Sent",     color: "border-orange-200 bg-orange-50 text-orange-700" },
  { value: "won",              label: "🟢 Won",               color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { value: "lost",             label: "🔴 Lost",              color: "border-red-200 bg-red-50 text-red-600" },
];

function AddLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", { businessId: id, status, notes });
      navigate("/leads");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create lead");
    }
  };

  const selected = statusOptions.find((s) => s.value === status);

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl shadow-lg shadow-emerald-200">🎯</div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">CRM Pipeline</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Add Lead</h1>
          <p className="mt-1 text-sm text-slate-400">Track this business in your pipeline</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
          <div className="mb-5 grid grid-cols-2 gap-2">
            {statusOptions.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setStatus(opt.value)}
                className={`rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${
                  status === opt.value ? opt.color + " shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>

          <div className={`mb-5 rounded-xl border px-4 py-2.5 text-sm font-semibold ${selected?.color}`}>
            Selected: {selected?.label}
          </div>

          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Notes</label>
          <textarea rows={4} placeholder="Any notes about this lead..." value={notes} onChange={(e) => setNotes(e.target.value)} className="input-dark mb-5 resize-none" />

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1 py-3 text-sm" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>✦ Create Lead</button>
            <button type="button" onClick={() => navigate("/businesses")} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLead;
