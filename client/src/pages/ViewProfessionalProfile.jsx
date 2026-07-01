import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function ViewProfessionalProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get(`/profile/${userId}`);
     setProfile(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <p className="gradient-text font-bold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <div className="rounded-2xl bg-white p-10 shadow">
          <h2 className="text-2xl font-black">Profile Not Found</h2>

          <button
            onClick={() => navigate(-1)}
            className="btn-primary mt-6"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white">
              B
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                Professional Profile
              </p>

              <h1 className="text-lg font-black">{profile.user?.name}</h1>
            </div>

          </div>

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-bold text-indigo-600"
          >
            Back
          </button>

        </div>

      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-black text-white">
              {profile.user?.name?.charAt(0)}
            </div>

            <div>

              <h2 className="text-3xl font-black">
                {profile.user?.name}
              </h2>

              <p className="mt-2 text-lg text-indigo-600">
                {profile.profession}
              </p>

              <p className="mt-2 text-slate-500">
                📍 {profile.location}
              </p>

              <p className="mt-1 text-slate-500">
                ⭐ {profile.experience}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-5 flex flex-wrap gap-4">

  <div className="rounded-xl bg-indigo-100 px-5 py-3">

    <p className="text-xs font-bold uppercase text-indigo-500">
      Rating
    </p>

    <p className="mt-1 text-xl font-black">
      ⭐ {profile.rating}
    </p>

  </div>

  <div className="rounded-xl bg-emerald-100 px-5 py-3">

    <p className="text-xs font-bold uppercase text-emerald-600">
      Projects
    </p>

    <p className="mt-1 text-xl font-black">
      {profile.completedProjects}
    </p>

  </div>

</div>

        <div className="grid gap-6">

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h3 className="text-xl font-black">
              About
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              {profile.about}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h3 className="text-xl font-black">
              Skills
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">

              {profile.skills?.map((skill) => (

                <span
                  key={skill}
                  className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-700"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">

  <h3 className="text-xl font-black">
    Projects
  </h3>

  {profile.projects?.length > 0 ? (

    <div className="mt-5 space-y-4">

      {profile.projects.map((project, index) => (

        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50 p-5"
        >

          <h4 className="text-lg font-bold text-slate-900">
            {project.title}
          </h4>

          <p className="mt-2 text-slate-600">
            {project.description}
          </p>

          {project.liveLink && (

            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-bold text-indigo-600 underline"
            >
              View Live Project
            </a>

          )}

        </div>

      ))}

    </div>

  ) : (

    <p className="mt-4 text-slate-500">
      No projects added yet.
    </p>

  )}

</div>  

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h3 className="text-xl font-black">
              Portfolio
            </h3>

            <a
              href={profile.portfolio}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block font-bold text-indigo-600 underline"
            >
              {profile.portfolio || "Not Provided"}
            </a>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ViewProfessionalProfile;