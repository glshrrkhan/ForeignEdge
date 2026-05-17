import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, BookOpen, Home, Utensils, Plane, Bus,
  Calculator, X, LayoutDashboard, User, Shield, ChevronRight,
  MapPin, Star
} from 'lucide-react';

const navItems = [
  { label: 'Universities', icon: GraduationCap, href: '/universities', desc: 'Browse global universities' },
  { label: 'Scholarships', icon: BookOpen, href: '/scholarships', desc: 'Find funding opportunities' },
  { label: 'Accommodation', icon: Home, href: '/accommodation', desc: 'Student housing worldwide' },
  { label: 'Restaurants', icon: Utensils, href: '/restaurants', desc: 'Halal food & dining' },
  { label: 'Airlines', icon: Plane, href: '/airlines', desc: 'Flights & travel' },
  { label: 'Transport & Apps', icon: Bus, href: '/transport', desc: 'Essential apps abroad' },
  { label: 'Calculators', icon: Calculator, href: '/calculators', desc: '22 free planning & finance tools' },
];

const studentItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'My Profile', icon: User, href: '/profile' },
  { label: 'AI Evaluation', icon: Star, href: '/profile/evaluation' },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00D26A] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Foreign<span className="text-[#00D26A]">Edge</span>
            </span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Explore</p>
          {navItems.map(({ label, icon: Icon, href, desc }) => (
            <Link
              key={href}
              to={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 group transition-all duration-150 ${
                isActive(href)
                  ? 'bg-[#E8FFF3] text-[#00D26A]'
                  : 'text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A]'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive(href) ? 'bg-[#00D26A] text-white' : 'bg-gray-100 group-hover:bg-[#00D26A] group-hover:text-white'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="text-xs text-gray-400 leading-tight mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto opacity-30 group-hover:opacity-70" />
            </Link>
          ))}

          {user && (
            <>
              <div className="border-t border-gray-100 my-4" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">My Account</p>
              {studentItems.map(({ label, icon: Icon, href }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 ${
                    isActive(href)
                      ? 'bg-[#E8FFF3] text-[#00D26A]'
                      : 'text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
              {user.is_admin && (
                <Link to="/admin" onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A] transition-all">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <a href="mailto:support@foreignedge.com"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00D26A] transition-colors">
            <MapPin className="w-4 h-4 text-[#00D26A]" />
            support@foreignedge.com
          </a>
          <p className="text-xs text-gray-400 mt-1">© 2025 ForeignEdge</p>
        </div>
      </aside>
    </>
  );
}