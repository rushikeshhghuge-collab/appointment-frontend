import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(
        form.name,
        form.email,
        form.password,
        form.role,
      );
      toast.success("Account created");
      navigate(user.role === "admin" ? "/admin/availability" : "/book");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 px-6">
      <div className="board-panel p-8">
        <p className="text-xs uppercase tracking-widest text-amber-flap font-mono mb-2">
          New Ticket
        </p>
        <h1 className="text-2xl font-display font-semibold mb-6">
          Create account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="board-label">Full name</label>
            <input
              className="board-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="board-label">Email</label>
            <input
              type="email"
              className="board-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="board-label">Password</label>
            <input
              type="password"
              className="board-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="board-label">I am a</label>
            <select
              className="board-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User / Customer</option>
              <option value="admin">Admin / Service Provider</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Create account"}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p className="text-sm text-paper-400 mt-6">
          Have an account?{" "}
          <Link to="/login" className="text-amber-flap hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
