import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const taskOptions = [
  { value: "proposal",        label: "📋 Proposal",         desc: "Ready-to-send proposal" },
  { value: "email",           label: "✉️ Outreach Email",    desc: "Cold email draft" },
  { value: "pitch",           label: "🎤 Sales Pitch",       desc: "Quick pitch script" },
  { value: "chat",            label: "💬 Business Advice",   desc: "AI consultation" },
  { value: "website_preview", label: "🌐 Website Preview",   desc: "Live dummy site mockup", full: true },
];

function AIAssistant() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [type, setType] = useState("proposal");
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState("");
  const [provider, setProvider] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const fetchBusinesses = useCallback(async () => {
    try {
      const response = await api.get("/businesses");
      const list = response.data.businesses || [];
      setBusinesses(list);
      setBusinessId(list[0]?._id || "");
    } catch (error) {
      console.log(error);
      alert("Failed to load businesses");
    }
  }, []);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  const generateContent = async () => {
    setLoading(true);
    setResult("");
    setWarning("");
    try {
      const response = await api.post("/ai/generate", { type, businessId, userPrompt });
      setResult(response.data.content);
      setProvider(response.data.provider);
      setWarning(response.data.warning || "");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const isPreview = type === "website_preview";
  const isHtml = isPreview && result && result.trim().startsWith("<");

  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow shadow-indigo-200">B</button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500">AI Assistant</p>
              <h1 className="text-lg font-black text-slate-900">BizBridge AI</h1>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
            Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Left panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Select Business</label>
            <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} className="input-dark mb-5">
              {businesses.map((b) => <option key={b._id} value={b._id}>{b.name} — {b.category}</option>)}
            </select>

            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">AI Task</label>
            <div className="mb-5 grid grid-cols-2 gap-2">
              {taskOptions.map((opt) => (
                <button key={opt.value} type="button"
                  onClick={() => { setType(opt.value); setResult(""); }}
                  className={`rounded-xl border px-3 py-3 text-left transition ${opt.full ? "col-span-2" : ""} ${
                    type === opt.value
                      ? "border-indigo-400 bg-indigo-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50"
                  }`}
                >
                  <p className={`text-sm font-bold ${type === opt.value ? "text-indigo-700" : "text-slate-700"}`}>{opt.label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{opt.desc}</p>
                </button>
              ))}
            </div>

            {isPreview && (
              <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                <p className="text-xs font-semibold text-indigo-700">✦ AI generates a real HTML page so your client sees exactly how their site will look.</p>
              </div>
            )}

            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
              {isPreview ? "Style Instructions" : "Extra Instructions"}
            </label>
            <textarea
              value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} rows={6}
              placeholder={isPreview ? "E.g. Modern theme, food delivery focus, WhatsApp button..." : "E.g. Make it friendly, mention 7-day delivery..."}
              className="input-dark mb-5 resize-none"
            />

            <button type="button" onClick={generateContent} disabled={loading || !businessId} className="btn-primary w-full py-3 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </span>
              ) : isPreview ? "✦ Generate Website Preview" : "✦ Generate"}
            </button>
          </div>

          {/* Right panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">{isPreview ? "🌐 Website Preview" : "Generated Output"}</h2>
                {provider && <p className="mt-0.5 text-xs text-indigo-500">Powered by {provider}</p>}
              </div>
              {isHtml && (
                <div className="flex overflow-hidden rounded-lg border border-slate-200">
                  {["desktop", "mobile"].map((d) => (
                    <button key={d} onClick={() => setPreviewDevice(d)}
                      className={`px-4 py-2 text-xs font-bold transition ${previewDevice === d ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                      {d === "desktop" ? "🖥 Desktop" : "📱 Mobile"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {warning && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                ⚠ {warning}
              </div>
            )}

            {isHtml ? (
              <div className="flex flex-col items-center">
                <div className={`overflow-hidden rounded-xl border border-slate-200 shadow transition-all duration-300 ${previewDevice === "mobile" ? "w-[390px]" : "w-full"}`} style={{ height: 580 }}>
                  <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <div className="ml-2 flex-1 rounded bg-white border border-slate-200 px-3 py-1 text-xs text-slate-400">
                      {businesses.find(b => b._id === businessId)?.name?.toLowerCase().replace(/\s+/g, "") || "preview"}.com
                    </div>
                  </div>
                  <iframe srcDoc={result} title="Website Preview" className="h-[calc(100%-36px)] w-full" sandbox="allow-same-origin" />
                </div>
                <p className="mt-2 text-xs text-slate-400">Dummy preview — show this to your client to close the deal</p>
              </div>
            ) : (
              <pre className="min-h-[420px] whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-5 font-sans text-sm leading-7 text-slate-700">
                {loading ? (
                  <span className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
                    <span className="gradient-text font-bold">AI is generating your content...</span>
                  </span>
                ) : result || <span className="text-slate-400">{isPreview ? "Select a business and generate a live website preview." : "Choose a business, select a task, and generate a draft."}</span>}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIAssistant;
