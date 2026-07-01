import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FiChevronDown,FiUser,FiLock,FiLogOut, } from "react-icons/fi";
import api from "../services/api";

const statCards = [
  {
    key: "totalBusinesses",
    label: "Business Opportunities",
    icon: "🏢",
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    description: "Businesses available to explore",
  },
  {
    key: "totalLeads",
    label: "My Pipeline",
    icon: "🎯",
    border: "border-purple-200",
    bg: "bg-purple-50",
    text: "text-purple-600",
    description: "Businesses you're tracking",
  },
  {
    key: "wonLeads",
    label: "Projects Won",
    icon: "🏆",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    description: "Successfully converted clients",
  },
  {
    key: "revenueGenerated",
    label: "Potential Revenue",
    icon: "💰",
    border: "border-teal-200",
    bg: "bg-teal-50",
    text: "text-teal-600",
    prefix: "₹",
    description: "Estimated project value",
  },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

const fetchDashboard = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const [statsResponse, profileResponse] = await Promise.all([
      api.get("/dashboard/stats"),
      api.get("/profile/me"),
    ]);

    setStats(statsResponse.data);

    if (profileResponse.data) {
      setProfileCompleted(true);
    } else {
      setProfileCompleted(false);
    }

  } catch (error) {
    console.log(error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }
}, [navigate]);

  useEffect(() => { fetchDashboard(); fetchUnreadCount(); }, [fetchDashboard]);

  useEffect(() => {
  const interval = setInterval(() => {
    fetchUnreadCount();
  }, 30000); // every 30 seconds

  return () => clearInterval(interval);
 }, []);

  const fetchUnreadCount = async () => {
  try {
    const response = await api.get("/notifications/unread-count");
    setUnreadCount(response.data.count);
  } catch (error) {
    console.log(error);
  }
 };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!stats) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
          <p className="gradient-text text-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

    {/* Left Side */}
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white shadow-lg">
        B
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
          Freelancer Dashboard
        </p>

        <h1 className="text-lg font-black text-slate-900">
          Welcome back, {user.name || "Freelancer"} 👋
        </h1>
      </div>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-4">

      {/* Notification Bell */}
      <div className="relative">
  <button
    onClick={() => navigate("/notifications")}
    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
  >
    <span className="text-lg">🔔</span>
    <span>Notifications</span>
  </button>

  {unreadCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
      {unreadCount}
    </span>
  )}
</div>
 <div className="relative">

  <button
    onClick={() => setShowMenu(!showMenu)}
    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-indigo-400"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
      {user?.name?.charAt(0).toUpperCase()}
    </div>

    <div className="hidden text-left md:block">
      <p className="text-sm font-bold text-slate-900">
        {user?.name}
      </p>

      <p className="text-xs text-slate-500">
        {user?.role}
      </p>
    </div>

    <FiChevronDown />
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

      <button
        onClick={() => {
          navigate("/my-profile");
          setShowMenu(false);
        }}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <FiUser />
        My Profile
      </button>

      <button
        onClick={() => {
          navigate("/change-password");
          setShowMenu(false);
        }}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <FiLock />
        Change Password
      </button>

      <div className="border-t"></div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-5 py-4 text-left text-red-600 transition hover:bg-red-50"
      >
        <FiLogOut />
        Logout
      </button>

    </div>
  )}

</div>

    </div>

  </div>
</header>
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* 🔴 CHANGED: removed generic "Here's what's happening" — now shows role-specific mission */}
        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

    <div>

      <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
        Freelancer Workspace
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-900">
        Ready to discover your next client?
      </h2>

      <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
        Discover local businesses, analyze their digital presence with AI,
        generate proposals, and manage every opportunity from first contact
        to project completion.
      </p>

    </div>

    <div className="max-w-sm rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500"> AI Insight</p>

    <p className="mt-3 text-sm leading-relaxed text-slate-600">
    Businesses without a website are more likely to need
    digital services. Explore opportunities, analyze them
    with AI, and save promising businesses to your pipeline.</p>

    </div>

    </div>

    </div>

    <div
  className={`mb-8 rounded-2xl p-6 shadow-sm border ${
    profileCompleted
      ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50"
      : "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50"
  }`}
>
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>

      <p
        className={`text-xs font-bold uppercase tracking-widest ${
          profileCompleted ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {profileCompleted
          ? "Professional Profile"
          : "Complete Your Profile"}
      </p>

      <h3 className="mt-2 text-2xl font-black text-slate-900">
        {profileCompleted
          ? "Your profile is ready for business owners."
          : "Business owners can't view your profile yet."}
      </h3>

      <p className="mt-2 max-w-2xl text-slate-600">
        {profileCompleted
          ? "Keep your skills, experience and portfolio updated to attract more clients."
          : "Complete your professional profile to showcase your skills, experience, projects and portfolio before sending connection requests."}
      </p>

    </div>

    <button
      onClick={() => navigate("/my-profile")}
      className={`rounded-xl px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 ${
        profileCompleted
          ? "bg-gradient-to-r from-indigo-500 to-purple-600"
          : "bg-gradient-to-r from-amber-500 to-orange-500"
      }`}
    >
      {profileCompleted ? "✏️ Update Profile" : "Complete Profile →"}
    </button>

  </div>
</div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{statCards.map((card) => ( <div key={card.key}
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.border}`}>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
        <span className="text-2xl">{card.icon}</span>
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {card.label}
      </h3>

      <p className={`mt-3 text-4xl font-black ${card.text}`}>
        {card.prefix || ""}
        {stats[card.key]}
        {card.suffix || ""}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        {card.description}
      </p>
      </div>
      ))}</div>

        {/* Nav cards — 🔴 CHANGED: fixed descriptions to be freelancer-specific */}
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Actions</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate("/businesses")}
            className="card-hover group rounded-xl border border-indigo-100 bg-white p-6 text-left shadow-sm hover:border-indigo-300"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">🏢</div>
            <p className="text-base font-bold text-slate-900">Find Businesses</p>
            {/* 🔴 CHANGED: was "View and manage all leads" */}
            <p className="mt-1 text-sm text-slate-500">Browse local businesses — filter by no website or needs help</p>
            <p className="mt-3 text-xs font-bold text-indigo-500 group-hover:text-indigo-700">Browse →</p>
          </button>

          <button
            onClick={() => navigate("/leads")}
            className="card-hover group rounded-xl border border-purple-100 bg-white p-6 text-left shadow-sm hover:border-purple-300"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">🎯</div>
            <p className="text-base font-bold text-slate-900">My Pipeline</p>
            {/* 🔴 CHANGED: was "Track your pipeline" */}
            <p className="mt-1 text-sm text-slate-500">Track businesses you're pitching — New → Contacted → Won</p>
            <p className="mt-3 text-xs font-bold text-purple-500 group-hover:text-purple-700">Manage →</p>
          </button>

          <button
            onClick={() => navigate("/ai-assistant")}
            className="card-hover group rounded-xl border border-pink-100 bg-white p-6 text-left shadow-sm hover:border-pink-300"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl">🤖</div>
            <p className="text-base font-bold text-slate-900">AI Assistant</p>
            {/* 🔴 CHANGED: was "Generate proposals & previews" */}
            <p className="mt-1 text-sm text-slate-500">Generate proposal, email, pitch or a live website preview for your client</p>
            <p className="mt-3 text-xs font-bold text-pink-500 group-hover:text-pink-700">Launch →</p>
          </button>
        </div>


      </main>
    </div>
  );
}

export default Dashboard;
