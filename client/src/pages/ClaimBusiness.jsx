import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// step: "search" | "verify" | "code"
function ClaimBusiness() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const [step, setStep] = useState("search"); // search → verify → code
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [devCode, setDevCode] = useState(""); // shown in dev mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    try {
      const res = await api.get(`/businesses/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.businesses || []);
      setSearched(true);
    } catch {
      setError("Search failed. Please try again.");
    }
  };

  const startClaim = (business) => {
    setSelectedBusiness(business);
    setPhoneInput("");
    setCodeInput("");
    setDevCode("");
    setError("");
    setStep("verify");
  };

  // Step 2 — submit phone to get verification code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/businesses/${selectedBusiness._id}/request-claim`, {
        phone: phoneInput,
      });
      setDevCode(res.data.devCode); // show code in dev mode
      setStep("code");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — submit code to confirm
  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post(`/businesses/${selectedBusiness._id}/claim`, { code: codeInput });
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("search");
    setSelectedBusiness(null);
    setError("");
    setDevCode("");
  };

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow shadow-emerald-200">B</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Business Owner</p>
              <h1 className="text-lg font-black text-slate-900">Claim Your Business</h1>
            </div>
          </div>
          <button
            onClick={() => step !== "search" ? reset() : navigate("/owner-dashboard")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">

        {/* Progress steps */}
        <div className="mb-8 flex items-center gap-2">
          {[
            { id: "search", label: "Find Business" },
            { id: "verify", label: "Verify Phone" },
            { id: "code",   label: "Enter Code" },
          ].map((s, i) => {
            const steps = ["search", "verify", "code"];
            const current = steps.indexOf(step);
            const thisIdx = steps.indexOf(s.id);
            const done = thisIdx < current;
            const active = thisIdx === current;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition ${
                    done   ? "bg-emerald-500 text-white" :
                    active ? "bg-indigo-600 text-white shadow shadow-indigo-200" :
                             "bg-slate-100 text-slate-400"
                  }`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <p className={`text-[10px] font-bold ${active ? "text-indigo-600" : done ? "text-emerald-600" : "text-slate-400"}`}>{s.label}</p>
                </div>
                {i < 2 && <div className={`mb-4 h-0.5 flex-1 rounded ${done ? "bg-emerald-300" : "bg-slate-100"}`} />}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Search ── */}
        {step === "search" && (
          <>
            <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
              <h2 className="text-sm font-black text-indigo-800">How verification works</h2>
              <ul className="mt-3 space-y-2 text-sm text-indigo-700">
                <li className="flex items-start gap-2"><span className="mt-0.5">🔍</span> Search for your business by name or city</li>
                <li className="flex items-start gap-2"><span className="mt-0.5">📞</span> Enter the phone number registered to your business</li>
                <li className="flex items-start gap-2"><span className="mt-0.5">🔐</span> We verify it matches — a code confirms you're the owner</li>
                <li className="flex items-start gap-2"><span className="mt-0.5">✅</span> Enter the code and the business is yours to manage</li>
              </ul>
            </div>

            <form onSubmit={handleSearch} className="mb-5 flex gap-3">
              <input
                type="text"
                placeholder="Search by business name, category, or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-dark flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap px-6 py-3 text-sm">
                🔍 Search
              </button>
            </form>

            {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

            {searched && results.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                <p className="text-4xl">🏢</p>
                <p className="mt-4 font-bold text-slate-900">No businesses found</p>
                <p className="mt-2 text-sm text-slate-500">Try a different name, or ask a freelancer to add your business listing first.</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
                {results.map((b) => (
                  <div key={b._id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">{b.name}</h3>
                        {b.isClaimed && (
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                            Already Claimed
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{b.category} · {[b.area, b.city].filter(Boolean).join(", ")}</p>
                      {/* Show masked phone so owner knows which number to enter */}
                      <p className="mt-0.5 text-xs text-slate-400">
                        📞 Registered phone ends in <span className="font-bold text-slate-600">
                          ···{String(b.phone).slice(-4)}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-black text-indigo-600">{b.leadScore}</p>
                        <p className="text-xs text-slate-400">Score</p>
                      </div>
                      {!b.isClaimed ? (
                        <button
                          onClick={() => startClaim(b)}
                          className="btn-primary whitespace-nowrap px-4 py-2 text-sm"
                          style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                        >
                          Claim →
                        </button>
                      ) : (
                        <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-400">Taken</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: Verify Phone ── */}
        {step === "verify" && selectedBusiness && (
          <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">🏢</div>
              <div>
                <p className="font-black text-slate-900">{selectedBusiness.name}</p>
                <p className="text-sm text-slate-500">{selectedBusiness.category} · {selectedBusiness.city}</p>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">📞 Ownership Verification</p>
              <p className="mt-1 text-xs text-amber-700">
                Enter the phone number registered to this business. It must match exactly what's on file. This proves you are the real owner.
              </p>
              <p className="mt-2 text-xs text-amber-600 font-semibold">
                Registered number ends in: <span className="font-black">···{String(selectedBusiness.phone).slice(-4)}</span>
              </p>
            </div>

            <form onSubmit={handleRequestCode}>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Business Phone Number</label>
              <input
                type="text"
                placeholder="Enter the exact phone number of this business"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="input-dark mb-5"
                required
              />

              {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">⚠ {error}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-sm"
                  style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Verifying...
                    </span>
                  ) : "Send Verification Code →"}
                </button>
                <button type="button" onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: Enter Code ── */}
        {step === "code" && selectedBusiness && (
          <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">🔐</div>
              <div>
                <p className="font-black text-slate-900">Verify Your Code</p>
                <p className="text-sm text-slate-500">Enter the 4-digit code to confirm ownership</p>
              </div>
            </div>

            {/* Dev mode code display */}
            {devCode && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-bold text-emerald-700">🛠 Dev Mode — In production this would be sent via SMS</p>
                <p className="mt-2 text-center text-3xl font-black tracking-[0.5em] text-emerald-700">{devCode}</p>
              </div>
            )}

            <form onSubmit={handleConfirmCode}>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">4-Digit Verification Code</label>
              <input
                type="text"
                placeholder="Enter 4-digit code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="input-dark mb-2 text-center text-2xl font-black tracking-widest"
                maxLength={4}
                required
              />
              <p className="mb-5 text-xs text-slate-400">Code expires in 10 minutes.</p>

              {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">⚠ {error}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={loading || codeInput.length !== 4} className="btn-primary flex-1 py-3 text-sm"
                  style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Confirming...
                    </span>
                  ) : "✓ Confirm & Claim Business"}
                </button>
                <button type="button" onClick={() => { setStep("verify"); setError(""); }} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50">
                  ← Back
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClaimBusiness;
