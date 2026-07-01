import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";

function Login() {
 const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const role = response.data.user.role;
      if (role === "businessOwner") {
        navigate("/my-business");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg grid min-h-screen lg:grid-cols-2">
      {/* Left — branding */}
      <section className="hidden flex-col justify-between border-r border-slate-100 bg-gradient-to-br from-indigo-600 to-purple-700 px-12 py-12 text-white lg:flex">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-black">B</div>
          <span className="text-xl font-black">BizBridge AI</span>
        </button>
        <div>
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">✦ Freelancer lead engine</div>
          <h1 className="max-w-md text-5xl font-black leading-tight">Find clients before your competitors do.</h1>
          <p className="mt-5 max-w-sm text-base leading-8 text-indigo-100">Sign in to discover no-website businesses, manage leads, and generate sales material with AI.</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[["🏢","Discover"],["🤖","Pitch"],["🏆","Close"]].map(([icon, label]) => (
              <div key={label} className="rounded-xl border border-white/20 bg-white/10 p-4 text-center">
                <p className="text-2xl">{icon}</p>
                <p className="mt-2 text-xs font-bold text-indigo-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-indigo-200">Built for freelancers, developers & entrepreneurs.</p>
      </section>

      {/* Right — form */}
      <section className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white">B</div>
            <p className="text-2xl font-black text-slate-900">BizBridge AI</p>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Welcome Back</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Login to your account</h2>
          <p className="mt-2 text-sm text-slate-500">Don't have an account?{" "}
            <button type="button" onClick={() => navigate("/register")} className="font-bold text-indigo-600 hover:text-indigo-800">Sign Up</button>
          </p>

          <form onSubmit={handleLogin} className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</span>
              <input type="email" placeholder="you@example.com" className="input-dark" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</span>
              <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                className="input-dark pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
               <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600">
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
               </button>
             </div>
            </label>
            <div className="flex justify-end">
              <button type="button" onClick={() => navigate("/forgot-password")}
               className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
               Forgot Password?
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
