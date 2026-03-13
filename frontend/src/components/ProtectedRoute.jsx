import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light font-display">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white animate-pulse">
            <span className="material-symbols-outlined">medical_services</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading ClinicFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'doctor' ? '/app/doctor' : '/app/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
