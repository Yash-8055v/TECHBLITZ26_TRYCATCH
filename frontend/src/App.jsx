import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage         from './pages/public/LandingPage';
import Login               from './pages/auth/Login';
import QRCheckIn           from './pages/public/QRCheckIn';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import WalkInRegistration  from './pages/receptionist/WalkInRegistration';
import QueueManagement     from './pages/receptionist/QueueManagement';
import AppointmentBooking  from './pages/receptionist/AppointmentBooking';
import PatientRecords      from './pages/shared/PatientRecords';
import DoctorDashboard     from './pages/doctor/DoctorDashboard';
import Prescriptions       from './pages/doctor/Prescriptions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── Public routes ─── */}
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/check-in"  element={<QRCheckIn />} />

          {/* ─── Receptionist routes (sidebar layout) ─── */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"    element={<ReceptionistDashboard />} />
            <Route path="queue"        element={<QueueManagement />} />
            <Route path="walk-in"      element={<WalkInRegistration />} />
            <Route path="appointments" element={<AppointmentBooking />} />
            <Route path="patients"     element={<PatientRecords />} />

            {/* Doctor routes (same layout, different nav items shown by Sidebar) */}
            <Route path="doctor"        element={<DoctorDashboard />} />
            <Route path="prescriptions" element={<Prescriptions />} />
          </Route>

          {/* ─── Catch-all ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
