import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usage: <ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
