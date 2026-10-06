import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bed, 
  CalendarDays, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Rooms', path: '/admin/rooms', icon: <Bed className="w-5 h-5" /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarDays className="w-5 h-5" /> },
    { name: 'Guests', path: '/admin/guests', icon: <Users className="w-5 h-5" /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen transition-all duration-300 shadow-xl">
      {/* Brand/Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <Link to="/admin" className="text-2xl font-bold tracking-tight text-white hover:text-sky-400 transition">
          Admin <span className="text-sky-500 font-extrabold">Portal</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Management
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit to Client</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
