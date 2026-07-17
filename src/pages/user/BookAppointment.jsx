import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiUser, FiCheck } from "react-icons/fi";
import api from "../../api/axios";

const BookAppointment = () => {
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    api
      .get("/auth/providers")
      .then((res) => setProviders(res.data.data.providers))
      .catch(() => toast.error("Could not load providers"));
  }, []);

  useEffect(() => {
    if (!providerId || !date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot(null);
    api
      .get(`/slots/${providerId}`, { params: { date } })
      .then((res) => setSlots(res.data.data.slots))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load slots");
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [providerId, date]);

  const handleBook = async () => {
    if (!selectedSlot) {
      toast.error("Select a slot first");
      return;
    }
    setBooking(true);
    try {
      await api.post("/appointments", {
        providerId,
        appointmentDate: date,
        startTime: selectedSlot.startTime,
        reason,
      });
      toast.success("Appointment booked");
      setSelectedSlot(null);
      setReason("");
      const res = await api.get(`/slots/${providerId}`, { params: { date } });
      setSlots(res.data.data.slots);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Slot just taken — pick another");
      } else {
        toast.error(err.response?.data?.message || "Booking failed");
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-amber-flap font-mono mb-2">
        Departures
      </p>
      <h1 className="text-3xl font-display font-semibold mb-8">
        Book an appointment
      </h1>

      <div className="board-panel p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="board-label flex items-center gap-1.5">
            <FiUser size={12} /> Provider
          </label>
          <select
            className="board-input"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
          >
            <option value="">Select provider</option>
            {providers.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="board-label flex items-center gap-1.5">
            <FiCalendar size={12} /> Date
          </label>
          <input
            type="date"
            min={todayStr}
            className="board-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={!providerId}
          />
        </div>
      </div>

      {loadingSlots && (
        <p className="text-sm text-paper-400 font-mono animate-pulse">
          Loading board...
        </p>
      )}

      {!loadingSlots && date && providerId && slots.length === 0 && (
        <div className="board-panel p-6 text-center">
          <p className="text-signal font-mono text-sm">
            No slots available for this date
          </p>
        </div>
      )}

      {slots.length > 0 && (
        <div className="board-panel p-6 mb-6">
          <label className="board-label flex items-center gap-1.5 mb-3">
            <FiClock size={12} /> Available slots
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.startTime}
                onClick={() => setSelectedSlot(slot)}
                className={`flap-tile animate-flap ${
                  selectedSlot?.startTime === slot.startTime
                    ? "flap-tile-selected"
                    : ""
                }`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div className="board-panel p-6">
          <label className="board-label">Reason (optional)</label>
          <textarea
            className="board-input font-body mb-4"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. General consultation"
          />
          <button
            onClick={handleBook}
            disabled={booking}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FiCheck />
            {booking
              ? "Booking..."
              : `Confirm ${selectedSlot.startTime} – ${selectedSlot.endTime}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
