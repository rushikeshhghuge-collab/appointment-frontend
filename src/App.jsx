import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/user/BookAppointment";
import MyAppointments from "./pages/user/MyAppointments";
import AvailabilityManage from "./pages/admin/AvailabilityManage";
import AppointmentManage from "./pages/admin/AppointmentManage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/book"
            element={
              <ProtectedRoute role="user">
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute role="user">
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/availability"
            element={
              <ProtectedRoute role="admin">
                <AvailabilityManage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute role="admin">
                <AppointmentManage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
