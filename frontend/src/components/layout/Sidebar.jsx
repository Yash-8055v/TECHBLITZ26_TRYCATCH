import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = {
  receptionist: [
    { to: '/dashboard',     icon: 'dashboard',      label: 'Dashboard' },
    { to: '/queue',         icon: 'group',           label: 'Queue Management' },
    { to: '/walk-in',       icon: 'person_add',      label: 'Walk-in Registration' },
    { to: '/appointments',  icon: 'calendar_month',  label: 'Appointments' },
    { to: '/patients',      icon: 'folder_shared',   label: 'Patients' },
  ],
  doctor: [
    { to: '/doctor',         icon: 'dashboard',      label: 'Dashboard' },
    { to: '/queue',          icon: 'group',           label: 'Queue' },
    { to: '/patients',       icon: 'folder_shared',   label: 'Patient Records' },
    { to: '/prescriptions',  icon: 'medication',      label: 'Prescriptions' },
  ],
};

const Sidebar = () => {
  const { userProfile, logout, isDoctor } = useAuth();
  const navigate = useNavigate();
  const items = isDoctor ? navItems.doctor : navItems.receptionist;
  const roleLabel = isDoctor ? 'Doctor Portal' : 'Reception Desk';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined">medical_services</span>
        </div>
        <div>
          <h1 className="text-slate-900 font-bold text-lg leading-none">ClinicFlow</h1>
          <p className="text-slate-500 text-xs mt-0.5">{roleLabel}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{userProfile?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{userProfile?.role || 'Staff'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
