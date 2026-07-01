import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../services/api";

function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadRequests, setUnreadRequests] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchMyBusiness = useCallback(async () => {
    try {
      const response = await api.get("/businesses/my-business");
      setBusiness(response.data.business);
    } catch (error) {
      console.log(error);
   } finally {
  setLoading(false);
 }
 }, []);

 const fetchUnreadRequests = async () => {
  try {
    const res = await api.get("/requests/unread-count");

    setUnreadRequests(res.data.count);
  } catch (error) {
    console.log(error);
  }
};

 useEffect(() => {
    fetchMyBusiness();
    fetchUnreadRequests();
}, []);

useEffect(() => {
  if (location.state?.refresh) {
    fetchMyBusiness();
    fetchUnreadRequests();

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }
}, [location, fetchMyBusiness, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <p className="gradient-text text-lg font-bold">
            Loading Business...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">

      {/* Header */}

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
                My Business
              </h1>
            </div>

          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-100"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* Hero */}

        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
                Business Profile
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Manage your business information
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
                Keep your business details updated so freelancers can discover
                your business and connect with you for digital services.
              </p>

            </div>

            <div className="max-w-sm rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                BizBridge AI
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Your business profile helps skilled freelancers connect with
                you and offer websites, marketing, branding and other digital
                services.
              </p>

            </div>

          </div>

        </div>

        {!business ? (

          <div className="rounded-2xl border border-dashed border-indigo-300 bg-white py-20 text-center shadow-sm">

            <div className="text-6xl">
              🏢
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              No Business Registered
            </h2>

            <p className="mt-3 text-slate-500">
              Register your business to become visible to freelancers.
            </p>

            <button
             onClick={() => navigate("/register-business")}
              className="btn-primary mt-8 px-8 py-3"
            >
              + Register Business
            </button>

          </div>

        ) : (

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-3xl font-black text-slate-900">
                  {business.name}
                </h2>

                <p className="mt-2 text-lg text-slate-500">
                  {business.category}
                </p>

              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  business.websiteStatus
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {business.websiteStatus
                  ? "Website Available"
                  : "No Website"}
              </span>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Address
                </p>

                <p className="mt-2 text-slate-700">
                  {business.address}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  City
                </p>

                <p className="mt-2 text-slate-700">
                  {business.city}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Phone
                </p>

                <p className="mt-2 text-slate-700">
                  {business.phone}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Website
                </p>

                <p className="mt-2 text-slate-700">
                  {business.website || "Not Available"}
                </p>

              </div>

            </div>

            <div className="mt-10 flex gap-4">

              <button
               onClick={() => {
                console.log("Business ID:", business._id);
                console.log("Navigate to:", `/businesses/edit/${business._id}`);
                navigate(`/businesses/edit/${business._id}`);
            }}
            className="btn-primary px-6 py-3">
                Edit Business
             </button>

              <button
  onClick={() => navigate("/connection-requests")}
  className="relative rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
>
  🤝 Connection Requests

  {unreadRequests > 0 && (
    <span className="absolute -right-2 -top-2 flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
      {unreadRequests}
    </span>
  )}
</button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default MyBusiness;