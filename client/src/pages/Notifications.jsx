import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-black text-indigo-600">
          Loading Notifications...
        </h2>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Notification Center
            </p>

            <h1 className="text-2xl font-black">
              Notifications
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-bold text-indigo-600"
          >
            Back
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">

        {notifications.length === 0 ? (

          <div className="rounded-2xl bg-white p-16 text-center shadow">

            <div className="text-6xl">
              🔔
            </div>

            <h2 className="mt-5 text-2xl font-black">
              No Notifications
            </h2>

            <p className="mt-3 text-slate-500">
              You're all caught up.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                onClick={() => markAsRead(notification._id)}
                className={`cursor-pointer rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${
                  notification.isRead
                    ? "bg-white"
                    : "border-indigo-400 bg-indigo-50"
                }`}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-lg font-black">
                      {notification.title}
                    </h2>

                    <p className="mt-2 text-slate-600">
                      {notification.message}
                    </p>

                  </div>

                  {!notification.isRead && (

                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                      NEW
                    </span>

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

export default Notifications;