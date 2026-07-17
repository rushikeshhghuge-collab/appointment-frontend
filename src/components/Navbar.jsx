import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StationClock from "./StationClock";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-display transition-colors ${
        active
          ? "bg-amber-flap text-ink-900 font-semibold"
          : "text-paper-400 hover:text-paper-100"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-ink-800 border-b border-ink-600">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span className="font-display font-semibold tracking-wide text-paper-100">
            SLOT<span className="text-amber-flap">BOARD</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!user && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
          {user?.role === "user" && (
            <>
              <NavLink to="/book">Book</NavLink>
              <NavLink to="/my-appointments">My Appointments</NavLink>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/availability">Availability</NavLink>
              <NavLink to="/admin/appointments">Appointments</NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <StationClock />
          {user && (
            <button
              onClick={handleLogout}
              className="text-signal text-sm font-display hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
