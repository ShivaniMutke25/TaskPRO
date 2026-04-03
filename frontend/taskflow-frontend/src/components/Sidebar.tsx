import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CheckSquare, PlusCircle, Bell,
  LogOut, Zap, Shield, User
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/tasks/new', icon: PlusCircle, label: 'New Task' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-[#13151f] border-r border-white/8">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">TaskFlow Pro</h1>
            <p className="text-xs text-slate-500">Microservices Demo</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-white/8">
            <p className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Admin</p>
            <NavLink to="/admin/assign" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Shield size={17} />
              Assign Tasks
            </NavLink>
          </div>
        )}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-white/8 pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center border border-indigo-500/30">
            <User size={14} className="text-indigo-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
