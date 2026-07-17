import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import api from "../../api/axios";

const statusStyle = {
  Pending: "border-amber-flap text-amber-flap",
  Confirmed: "border-mint text-mint",
  Completed: "border-paper-400 text-paper-400",
  Cancelled: "border-signal text-signal",
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    api
      .get("/appointments/my")
      .then((res) => setAppointments(res.data.data.appointments))
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAppointments, []);

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-amber-flap font-mono mb-2">
        Ticket Stubs
      </p>
      <h1 className="text-3xl font-display font-semibold mb-8">
        My appointments
      </h1>

      {loading && (
        <p className="text-paper-400 font-mono text-sm animate-pulse">
          Loading...
        </p>
      )}
      {!loading && appointments.length === 0 && (
        <div className="board-panel p-8 text-center text-paper-400">
          No appointments yet.
        </div>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="board-panel p-0 flex overflow-hidden">
            <div className="flex-1 p-5">
              <p className="font-display font-semibold text-paper-100">
                {a.providerId?.name}
              </p>
              <p className="font-mono text-sm text-paper-400 mt-1">
                {new Date(a.appointmentDate).toISOString().slice(0, 10)}{" "}
                &middot; {a.startTime} – {a.endTime}
              </p>
              {a.reason && (
                <p className="text-sm text-paper-400 mt-2">{a.reason}</p>
              )}
            </div>

            <div
              className="w-px border-l border-dashed border-ink-600"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 0 -6px, transparent 6px, #0B0F17 7px), radial-gradient(circle at 0 calc(100% + 6px), transparent 6px, #0B0F17 7px)",
              }}
            />

            <div className="w-32 flex flex-col items-center justify-center gap-2 p-4">
              <span className={`status-pill ${statusStyle[a.status]}`}>
                {a.status}
              </span>
              {(a.status === "Pending" || a.status === "Confirmed") && (
                <button
                  onClick={() => handleCancel(a._id)}
                  className="text-signal text-xs font-mono flex items-center gap-1 hover:underline"
                >
                  <FiX size={12} /> Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
