import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => (
  <div className="flex min-h-screen bg-background-light font-display">
    <Sidebar />
    <main className="flex-1 ml-64 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
