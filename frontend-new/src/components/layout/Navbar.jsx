import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Menu, User, LogOut, ChevronDown, LayoutDashboard, Mail } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-[#E8FFF3] text-gray-600 hover:text-[#00D26A] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00D26A] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Foreign<span className="text-[#00D26A]">Edge</span>
            </span>
          </Link>
        </div>

        {/* Right: Contact + Auth */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:support@foreignedge.com"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#00D26A] transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-[#00D26A] transition-colors"
              >
                <div className="w-7 h-7 bg-[#00D26A] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                  {user.full_name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A] transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A] transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A] transition-colors">
                      <GraduationCap className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#00D26A] px-3 py-2 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm font-semibold bg-[#00D26A] text-white px-4 py-2 rounded-xl hover:bg-[#00A854] transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
