import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";
import api from "../../api/axios";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AvailabilityManage = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  });
  const [saving, setSaving] = useState(false);

  const fetchList = () => {
    api
      .get("/availability")
      .then((res) => setList(res.data.data.availability))
      .catch(() => toast.error("Failed to load availability"));
  };

  useEffect(fetchList, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/availability", form);
      toast.success("Availability added to the board");
      fetchList();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create availability",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/availability/${id}`);
      toast.success("Removed");
      fetchList();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggle = async (item) => {
    try {
      await api.put(`/availability/${item._id}`, {
        isAvailable: !item.isAvailable,
      });
      fetchList();
    } catch (err) {
      toast.error("Toggle failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-amber-flap font-mono mb-2">
        Provider Schedule
      </p>
      <h1 className="text-3xl font-display font-semibold mb-8">
        Manage availability
      </h1>

      <form onSubmit={handleCreate} className="board-panel p-6 mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="board-label">Working day</label>
            <select
              className="board-input"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm({ ...form, dayOfWeek: Number(e.target.value) })
              }
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="board-label">Slot duration (min)</label>
            <input
              type="number"
              min={1}
              className="board-input"
              value={form.slotDuration}
              onChange={(e) =>
                setForm({ ...form, slotDuration: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="board-label">Start time</label>
            <input
              type="time"
              className="board-input"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className="board-label">End time</label>
            <input
              type="time"
              className="board-input"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>
        <button
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> {saving ? "Saving..." : "Add availability"}
        </button>
      </form>

      <div className="space-y-2">
        {list.map((item) => (
          <div
            key={item._id}
            className="board-panel p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-display font-semibold">
                {DAYS[item.dayOfWeek]}
              </p>
              <p className="font-mono text-sm text-paper-400 mt-1">
                {item.startTime} – {item.endTime} &middot; {item.slotDuration}
                min slots
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-mono text-paper-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isAvailable}
                  onChange={() => handleToggle(item)}
                  className="accent-amber-flap w-4 h-4"
                />
                Active
              </label>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-signal"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityManage;
