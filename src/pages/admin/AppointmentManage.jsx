import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const statusStyle = {
  Pending: "border-amber-flap text-amber-flap",
  Confirmed: "border-mint text-mint",
  Completed: "border-paper-400 text-paper-400",
  Cancelled: "border-signal text-signal",
};

const NEXT_ACTIONS = {
  Pending: [
    { label: "Confirm", status: "Confirmed" },
    { label: "Cancel", status: "Cancelled" },
  ],
  Confirmed: [
    { label: "Complete", status: "Completed" },
    { label: "Cancel", status: "Cancelled" },
  ],
  Completed: [],
  Cancelled: [],
};

const AppointmentManage = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    api
      .get("/appointments", { params: { status, date, search } })
      .then((res) => setAppointments(res.data.data.appointments))
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAppointments, [status, date, search]);

  const handleTransition = async (id, nextStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: nextStatus });
      toast.success(`Marked as ${nextStatus}`);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-amber-flap font-mono mb-2">
        Control Room
      </p>
      <h1 className="text-3xl font-display font-semibold mb-8">
        Manage appointments
      </h1>

      <div className="board-panel p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <select
          className="board-input sm:w-40"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          className="board-input sm:w-44"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          placeholder="Search user name or email"
          className="board-input flex-1 font-body"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <p className="text-paper-400 font-mono text-sm animate-pulse">
          Loading board...
        </p>
      )}

      <div className="space-y-2">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="board-panel p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-display font-semibold">{a.userId?.name}</p>
              <p className="font-mono text-sm text-paper-400 mt-1">
                {new Date(a.appointmentDate).toISOString().slice(0, 10)}{" "}
                &middot; {a.startTime} – {a.endTime}
              </p>
              {a.reason && (
                <p className="text-sm text-paper-400 mt-1">{a.reason}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`status-pill ${statusStyle[a.status]}`}>
                {a.status}
              </span>
              {NEXT_ACTIONS[a.status].map((action) => (
                <button
                  key={action.status}
                  onClick={() => handleTransition(a._id, action.status)}
                  className="text-xs font-mono border border-ink-600 rounded-md px-2.5 py-1.5 hover:border-amber-flap hover:text-amber-flap transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {!loading && appointments.length === 0 && (
          <div className="board-panel p-8 text-center text-paper-400">
            No appointments match these filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManage;
