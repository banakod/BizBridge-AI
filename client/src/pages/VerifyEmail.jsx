import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    verifyAccount();
  }, []);

  const verifyAccount = async () => {
    try {
      const response = await api.get(`/users/verify-email/${token}`);

      toast.success(response.data.message);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Verification failed."
      );

      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg grid min-h-screen lg:grid-cols-2">

      {/* LEFT */}

      <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-purple-700 px-12 py-12 text-white">

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
            📧 Email Verification
          </div>

          <h1 className="max-w-md text-5xl font-black leading-tight">
            Secure your account
          </h1>

          <p className="mt-5 max-w-sm text-base leading-8 text-indigo-100">
            We're verifying your email address to keep your BizBridge AI account secure.
          </p>
        </div>

        <p className="text-xs text-indigo-200">
          Trusted authentication powered by BizBridge AI.
        </p>

      </section>

      {/* RIGHT */}

      <section className="flex items-center justify-center bg-slate-50 px-6 py-12">

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">

          {loading ? (
            <>
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>

              <h2 className="text-2xl font-black">
                Verifying Email...
              </h2>

              <p className="mt-3 text-slate-500">
                Please wait.
              </p>
            </>
          ) : success ? (
            <>
              <div className="mb-5 text-6xl">
                ✅
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                Email Verified
              </h2>

              <p className="mt-3 text-slate-500">
                Redirecting to Login...
              </p>
            </>
          ) : (
            <>
              <div className="mb-5 text-6xl">
                ❌
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                Verification Failed
              </h2>

              <button
                onClick={() => navigate("/login")}
                className="btn-primary mt-8 w-full"
              >
                Go to Login
              </button>
            </>
          )}

        </div>

      </section>

    </div>
  );
}

export default VerifyEmail;