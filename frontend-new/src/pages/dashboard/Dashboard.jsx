import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../utils/api';
import { GraduationCap, Bookmark, FileText, Award, ArrowRight, TrendingUp, Bell, Star, MapPin, Clock, CheckCircle, XCircle, AlertCircle, User, Zap } from 'lucide-react';

const statusConfig = {
  'pending': { color: 'text-yellow-600 bg-yellow-50 border-yellow-100', icon: Clock },
  'submitted': { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: FileText },
  'accepted': { color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle },
  'rejected': { color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle },
  'waitlisted': { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: AlertCircle },
};

const quickLinks = [
  { label: 'Browse Universities', to: '/universities', icon: GraduationCap, color: 'bg-blue-500' },
  { label: 'Find Scholarships', to: '/scholarships', icon: Award, color: 'bg-purple-500' },
  { label: 'AI Profile Eval', to: '/profile/evaluation', icon: Zap, color: 'bg-[#00D26A]' },
  { label: 'Calculators', to: '/calculators', icon: TrendingUp, color: 'bg-orange-500' },
];

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileAPI.getSaved().catch(() => ({ data: { saved_items: [] } })),
      profileAPI.getApplications().catch(() => ({ data: { applications: [] } })),
    ]).then(([s, a]) => {
      setSaved(s.data.saved_items || []);
      setApplications(a.data.applications || []);
      setLoading(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { icon: Bookmark, label: 'Saved Items', value: saved.length, color: 'bg-blue-500', sub: 'universities & scholarships' },
    { icon: FileText, label: 'Applications', value: applications.length, color: 'bg-purple-500', sub: 'in progress' },
    { icon: CheckCircle, label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'bg-[#00D26A]', sub: 'congratulations!' },
    { icon: Star, label: 'Profile Score', value: user?.profile_complete ? '85%' : '40%', color: 'bg-orange-500', sub: 'AI evaluation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-green-900 text-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-400 font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-3xl font-black">{user?.name || 'Student'}</h1>
              <p className="text-gray-400 mt-1">Track your study abroad progress</p>
            </div>
            <div className="flex gap-3">
              <Link to="/profile" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20">
                <User className="w-4 h-4" /> Edit Profile
              </Link>
              <Link to="/profile/evaluation" className="flex items-center gap-2 bg-[#00D26A] hover:bg-green-500 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                <Zap className="w-4 h-4" /> AI Evaluation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to}
                  className="card card-hover p-4 flex flex-col items-center gap-2 text-center group">
                  <div className={`w-12 h-12 ${link.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-[#00D26A] transition-colors">{link.label}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saved Items */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Saved Items</h2>
              <span className="text-sm text-gray-400">{saved.length} items</span>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : saved.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No saved items yet</p>
                <Link to="/universities" className="text-[#00D26A] text-sm font-semibold mt-2 inline-block hover:underline">Browse Universities →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {saved.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${item.item_type === 'university' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {item.item_type === 'university' ? '🎓' : '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name || `${item.item_type} #${item.item_id}`}</p>
                      <p className="text-xs text-gray-400 capitalize">{item.item_type}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                {saved.length > 5 && (
                  <p className="text-center text-sm text-[#00D26A] font-medium cursor-pointer hover:underline">+{saved.length - 5} more</p>
                )}
              </div>
            )}
          </div>

          {/* Applications tracker */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Applications</h2>
              <Link to="/profile" className="text-sm text-[#00D26A] font-semibold hover:underline">+ Add</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No applications tracked</p>
                <Link to="/universities" className="text-[#00D26A] text-sm font-semibold mt-2 inline-block hover:underline">Find Universities →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => {
                  const cfg = statusConfig[app.status] || statusConfig['pending'];
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{app.university_name || 'University Application'}</p>
                        <p className="text-xs text-gray-400">{app.program} • {app.intake || 'Fall 2025'}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border capitalize ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Profile completion prompt */}
        {!user?.profile_complete && (
          <div className="bg-gradient-to-r from-[#00D26A] to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Complete Your Profile</h3>
                <p className="text-green-100 text-sm">Get AI-powered scholarship and university recommendations</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 max-w-xs bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="text-sm font-bold">40%</span>
                </div>
              </div>
              <Link to="/profile" className="bg-white text-[#00D26A] font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all text-sm">
                Complete Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
