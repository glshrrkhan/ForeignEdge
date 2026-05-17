import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BarChart2, Building2, Award, Users, Database, LogOut, Menu, X } from 'lucide-react';

const items = [
  { label: 'Dashboard', icon: BarChart2, href: '/admin' },
  { label: 'Universities', icon: Building2, href: '/admin/universities' },
  { label: 'Scholarships', icon: Award, href: '/admin/scholarships' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Database', icon: Database, href: '/admin/database' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const isActive = (href) => href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${open ? 'w-56' : 'w-16'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-200`}>
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-[#00D26A] rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {open && <span className="font-bold text-gray-900 text-sm">ForeignEdge<br /><span className="text-[#00D26A] text-xs font-semibold">Admin</span></span>}
          <button onClick={() => setOpen(!open)} className="ml-auto p-1 rounded text-gray-400 hover:text-[#00D26A]">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-1">
          {items.map(({ label, icon: Icon, href }) => (
            <Link key={href} to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(href) ? 'bg-[#E8FFF3] text-[#00D26A]' : 'text-gray-600 hover:bg-[#E8FFF3] hover:text-[#00D26A]'}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {open && label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-[#00D26A] transition-colors">
            <GraduationCap className="w-3.5 h-3.5" />
            {open && 'Back to Site'}
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1">
            <LogOut className="w-3.5 h-3.5" />
            {open && 'Sign Out'}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
