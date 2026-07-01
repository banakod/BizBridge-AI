import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/users/forgot-password", {
        email,
      });

      toast.success(response.data.message);

      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg grid min-h-screen lg:grid-cols-2">

      {/* LEFT */}

      <section className="hidden flex-col justify-between border-r border-slate-100 bg-gradient-to-br from-indigo-600 to-purple-700 px-12 py-12 text-white lg:flex">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-black">
            B
          </div>

          <span className="text-xl font-black">
            BizBridge AI
          </span>
        </button>

        <div>

          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            🔐 Password Recovery
          </div>

          <h1 className="max-w-md text-5xl font-black leading-tight">
            Forgot your password?
          </h1>

          <p className="mt-5 max-w-sm text-base leading-8 text-indigo-100">
            Don't worry. Enter your registered email and we'll send a secure password reset link.
          </p>

        </div>

        <p className="text-xs text-indigo-200">
          Secure authentication powered by BizBridge AI.
        </p>

      </section>

      {/* RIGHT */}

      <section className="flex items-center justify-center bg-slate-50 px-6 py-12">

        <div className="w-full max-w-md">

          <div className="mb-6 lg:hidden text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white">
              B
            </div>

            <p className="text-2xl font-black text-slate-900">
              BizBridge AI
            </p>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Password Recovery
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Forgot Password
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Enter your registered email address.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >

            <label className="block">

              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </span>

              <input
                type="email"
                placeholder="you@example.com"
                className="input-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 w-full py-3 text-sm"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-4 w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Login
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}

export default ForgotPassword;