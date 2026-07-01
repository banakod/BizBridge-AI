import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function ConnectionRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests/my");
      setRequests(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 const updateStatus = async (id, status) => {
  try {
    await api.put(`/requests/${id}`, {
      status,
    });

    toast.success(`Request ${status} successfully.`);

    setTimeout(() => {
      navigate("/my-business", {
        state: {
          refresh: true,
        },
      });
    }, 800);

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to update request."
    );
  }
};

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-black text-indigo-600">
          Loading Requests...
        </h2>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">

    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white">
            B
          </div>
         <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Business Owner
          </p>
          <h1 className="text-lg font-black text-slate-900">
            Connection Requests
          </h1>
       </div>
      </div>
      <button
       onClick={()=>navigate("/my-business")}
       className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-bold text-indigo-600">
        Back
      </button>
     </div>
    </header>

      <main className="mx-auto max-w-6xl p-6">

{requests.length === 0 ? (

  <div className="rounded-2xl border border-dashed border-indigo-300 bg-white py-20 text-center shadow-sm">

    <div className="text-6xl">🤝</div>

    <h2 className="mt-6 text-3xl font-black text-slate-900">
      No Connection Requests
    </h2>

    <p className="mt-3 text-slate-500">
      Professionals who want to work with your business will appear here.
    </p>

  </div>

) : (

  <div className="space-y-6">

    {requests.map((request) => (

      <div
        key={request._id}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >

        {/* Top */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-black text-white">

              {request.freelancer?.name?.charAt(0)}

            </div>

            <div>

              <h2 className="text-2xl font-black text-slate-900">
                {request.freelancer?.name}
              </h2>

              <p className="text-slate-500">
                {request.freelancer?.email}
              </p>

              <p className="mt-1 text-sm font-semibold text-indigo-600">
                Professional
              </p>

            </div>

          </div>

          <span
            className={`rounded-full px-5 py-2 text-sm font-bold capitalize

            ${
              request.status === "accepted"
                ? "bg-emerald-100 text-emerald-700"

                : request.status === "rejected"

                ? "bg-red-100 text-red-700"

                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {request.status}
          </span>

        </div>

        {/* Business */}

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Business
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {request.business?.name}
            </p>

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Category
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {request.business?.category}
            </p>

          </div>

        </div>

        {/* Message */}

        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Message
          </p>

          <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
            {request.message}
          </p>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex flex-wrap gap-4">

          <button
             onClick={() => {
              console.log(request.freelancer);
              navigate(`/professional/${request.freelancer._id}`);
            }}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-3 font-bold text-indigo-600 transition hover:bg-indigo-100"
          >
            👤 View Profile
          </button>

         {request.status === "pending" && (
          <button
           onClick={() => updateStatus(request._id, "accepted")}
           className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-bold text-white shadow transition hover:scale-105">
            ✅ Accept
          </button>
        )}

         {request.status === "pending" && (
          <button
           onClick={() => updateStatus(request._id, "rejected")}
           className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-bold text-white shadow transition hover:scale-105">
           ❌ Reject
          </button>
        )}

        </div>

      </div>

    ))}

  </div>

)}

      </main>

    </div>
  );
}

export default ConnectionRequests;