import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);

  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  const openRequestModal = async () => {
  try {
    // Check whether professional profile exists
    const response = await api.get("/profile/me");

    if (!response.data) {
      toast.error(
        "Please complete your professional profile before sending connection requests."
      );

      navigate("/my-profile");
      return;
    }

    setMessage(`Hello ${business.name},

I came across your business on BizBridge AI and was impressed by what you do.

I specialize in helping businesses improve their online presence through professional websites, branding, SEO and digital solutions.

After reviewing your business, I believe I can help your business attract more customers online.

If you're interested, I'd love to discuss your requirements.

Looking forward to connecting with you.

Best regards,
`);

    setShowRequestModal(true);

  } catch (error) {

    toast.error(
      "Please complete your professional profile before sending connection requests."
    );

    navigate("/my-profile");
  }
};

 const fetchBusiness = useCallback(async () => {
  try {
    const response = await api.get(`/businesses/${id}`);
    setBusiness(response.data.business);
  } catch (error) {
    console.log(error);
    toast.error("Failed to load business");
  }
}, [id]);

const fetchRequestStatus = useCallback(async () => {
  try {
    const response = await api.get(`/requests/status/${id}`);

    setRequestSent(response.data.exists);
    setRequestStatus(response.data.status || "");
  } catch (error) {
    console.log(error);
  }
}, [id]);

useEffect(() => {
  fetchBusiness();
  fetchRequestStatus();
}, [fetchBusiness, fetchRequestStatus]);

const sendRequest = async () => {
  try {
    setSending(true);

    await api.post("/requests", {
      businessId: business._id,
      message,
    });

    toast.success("Connection Request Sent Successfully!");

// Update button immediately
setRequestSent(true);
setRequestStatus("pending");

setShowRequestModal(false);

// Go back to Dashboard and refresh it
setTimeout(() => {
  navigate("/dashboard", {
    state: {
      refresh: true,
    },
  });
}, 1000);

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to send request."
    );

  } finally {
    setSending(false);
  }
};

  if (!business) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <p className="gradient-text font-bold">
            Loading Business...
          </p>
        </div>
      </div>
    );
  }

  const location = [
    business.area,
    business.city,
    business.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const score = business.leadScore || 0;

  const scoreGradient =
    score >= 70
      ? "from-emerald-400 to-teal-500"
      : score >= 40
      ? "from-amber-400 to-orange-500"
      : "from-red-400 to-rose-500";

  return (
  <div className="mesh-bg min-h-screen">

    {/* Header */}

    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/businesses")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white"
          >
            B
          </button>

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Business Details
            </p>

            <h1 className="text-xl font-black text-slate-900">
              {business.name}
            </h1>

          </div>

        </div>

        <button
          onClick={() => navigate("/businesses")}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>

      </div>

    </header>

    <main className="mx-auto max-w-6xl px-6 py-8">

      {/* Business Info */}

      <div className="grid gap-6 lg:grid-cols-[1fr_180px]">

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Business Information
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div>
              <p className="text-xs text-slate-400">Category</p>
              <p className="font-bold text-slate-900">
                {business.category}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="font-bold text-slate-900">
                {business.phone}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p className="font-bold text-slate-900">
                {location || business.city}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Website Status</p>

              <p
                className={`font-bold ${
                  business.websiteStatus
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {business.websiteStatus
                  ? "Website Available"
                  : "No Website"}
              </p>

            </div>

            {business.website && (

              <div className="md:col-span-2">

                <p className="text-xs text-slate-400">
                  Website
                </p>

                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-indigo-600 underline"
                >
                  {business.website}
                </a>

              </div>

            )}

          </div>

        </div>

        {/* Score */}

        <div
          className={`rounded-2xl bg-gradient-to-br ${scoreGradient} flex flex-col items-center justify-center p-6 text-white shadow-lg`}
        >

          <p className="text-xs uppercase tracking-widest">
            Opportunity
          </p>

          <h2 className="mt-2 text-5xl font-black">
            {score}
          </h2>

          <p className="mt-2 text-sm">
            {business.leadPotential}
          </p>

        </div>

      </div>

      {/* AI Analysis */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
          AI Recommendation
        </p>

        <h3 className="mt-3 text-xl font-black text-slate-900">
          {business.recommendedWebsiteType}
        </h3>

        <ul className="mt-6 space-y-3">

          {business.recommendations?.map((item) => (

            <li
              key={item}
              className="rounded-xl bg-slate-50 p-4 text-slate-700"
            >
              ✅ {item}
            </li>

          ))}

        </ul>

      </div>

      {/* Actions */}

      <div className="mt-8 flex flex-wrap gap-4">

        <button
         disabled={requestSent}
         onClick={openRequestModal}
         className={`rounded-xl px-8 py-3 font-bold transition-all duration-300 ${
         requestStatus === "accepted"
         ? "bg-emerald-500 text-white cursor-not-allowed"
         : requestStatus === "rejected"
         ? "bg-red-500 text-white cursor-not-allowed"
         : requestStatus === "pending"
         ? "bg-amber-500 text-white cursor-not-allowed"
         : "btn-primary"
         }`} 
        >
          {!requestSent && "🤝 Request Connection"}
          {requestStatus === "pending" && "🟡 Request Pending"}
          {requestStatus === "accepted" && "🟢 Request Accepted"}
          {requestStatus === "rejected" && "🔴 Request Rejected"}
          </button>

        <button
          onClick={() => navigate("/ai-assistant")}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-8 py-3 font-bold text-indigo-600 hover:bg-indigo-100"
        >
          🤖 Generate AI Proposal
        </button>

      </div>

    </main>

    {/* Request Modal */}

    {showRequestModal && (

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Connection Request
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Introduce Yourself
          </h2>

         <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">

  <div className="flex items-start gap-3">

    <span className="text-xl">💡</span>

    <div>

      <p className="font-bold text-indigo-700">
        Personalize your message
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-600">
        We've generated a professional message for you.
        Feel free to edit it, add your experience, portfolio,
        or explain why you're the right person for this project.
      </p>

    </div>

  </div>

</div>

          <textarea
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-dark mt-6"
          />

          <div className="mt-8 flex justify-end gap-3">

            <button
              onClick={() => setShowRequestModal(false)}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={sendRequest}
              disabled={sending}
              className="btn-primary px-8 py-3"
            >
              {sending ? "Sending..." : "Send Request"}
            </button>

          </div>

        </div>

      </div>

    )}

  </div>
);

}

export default BusinessDetails;