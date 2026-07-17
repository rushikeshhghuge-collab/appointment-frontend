import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success("Welcome back");
      navigate(user.role === "admin" ? "/admin/availability" : "/book");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 px-6">
      <div className="board-panel p-8">
        <p className="text-xs uppercase tracking-widest text-amber-flap font-mono mb-2">
          Boarding Pass
        </p>
        <h1 className="text-2xl font-display font-semibold mb-6">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="board-label">Email</label>
            <input
              type="email"
              className="board-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="board-label">Password</label>
            <input
              type="password"
              className="board-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p className="text-sm text-paper-400 mt-6">
          No account?{" "}
          <Link to="/register" className="text-amber-flap hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
