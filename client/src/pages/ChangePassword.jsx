import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";

function ChangePassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.currentPassword ||
    !formData.newPassword ||
    !formData.confirmPassword
  ) {
    toast.error("Please fill all fields.");
    return;
  }

  if (formData.newPassword.length < 6) {
    toast.error("New password must be at least 6 characters.");
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const response = await api.put("/users/change-password", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    toast.success(response.data.message);

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to change password."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-6 py-10">

      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
          Security
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Change Password
        </h1>

        <p className="mt-2 text-slate-500">
          Keep your account secure by updating your password regularly.
        </p>

       <form onSubmit={handleSubmit} className="mt-8 space-y-5">

  {/* Current Password */}

  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Current Password
    </label>

    <div className="relative">
      <input
        type={showCurrent ? "text" : "password"}
        value={formData.currentPassword}
        onChange={(e) =>
          setFormData({
            ...formData,
            currentPassword: e.target.value,
          })
        }
        className="input-dark pr-12"
        placeholder="Enter current password"
      />

      <button
        type="button"
        onClick={() => setShowCurrent(!showCurrent)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      >
        {showCurrent ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  </div>

  {/* New Password */}

  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      New Password
    </label>

    <div className="relative">
      <input
        type={showNew ? "text" : "password"}
        value={formData.newPassword}
        onChange={(e) =>
          setFormData({
            ...formData,
            newPassword: e.target.value,
          })
        }
        className="input-dark pr-12"
        placeholder="Enter new password"
      />

      <button
        type="button"
        onClick={() => setShowNew(!showNew)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      >
        {showNew ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  </div>

  {/* Confirm Password */}

  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Confirm New Password
    </label>

    <div className="relative">
      <input
        type={showConfirm ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({
            ...formData,
            confirmPassword: e.target.value,
          })
        }
        className="input-dark pr-12"
        placeholder="Confirm new password"
      />

      <button
        type="button"
        onClick={() => setShowConfirm(!showConfirm)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      >
        {showConfirm ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  </div>

  <button
  type="submit"
  disabled={loading}
  className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Updating Password..." : "🔒 Change Password"}
</button>

</form>

      </div>

    </div>
  );
}

export default ChangePassword;