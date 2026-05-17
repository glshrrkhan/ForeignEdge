import { useState, useEffect } from 'react';
import { Users, GraduationCap, Award, Home, TrendingUp, Activity, ArrowUp, Eye } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00D26A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <ArrowUp className="w-3 h-3" /> {change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-gray-900">{value?.toLocaleString() || 0}</p>
      <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
    </div>
  );
}

const mockMonthlyData = [
  { month: 'Jan', users: 12, applications: 5 },
  { month: 'Feb', users: 19, applications: 8 },
  { month: 'Mar', users: 28, applications: 14 },
  { month: 'Apr', users: 35, applications: 20 },
  { month: 'May', users: 48, applications: 27 },
  { month: 'Jun', users: 62, applications: 35 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(r => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.users, change: 12, color: 'bg-blue-500' },
    { icon: GraduationCap, label: 'Universities', value: stats?.universities, change: 5, color: 'bg-purple-500' },
    { icon: Award, label: 'Scholarships', value: stats?.scholarships, change: 8, color: 'bg-[#00D26A]' },
    { icon: Home, label: 'Accommodations', value: stats?.accommodations, change: 3, color: 'bg-orange-500' },
  ];

  const pieData = [
    { name: 'Universities', value: stats?.universities || 20 },
    { name: 'Scholarships', value: stats?.scholarships || 15 },
    { name: 'Accommodations', value: stats?.accommodations || 21 },
    { name: 'Restaurants', value: stats?.restaurants || 24 },
    { name: 'Transport Apps', value: stats?.transport_apps || 15 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User growth chart */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-bold text-gray-900 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#00D26A" strokeWidth={2.5} dot={{ fill: '#00D26A', strokeWidth: 0, r: 4 }} />
              <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4">Content Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00D26A]" /> Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { action: 'New user registered', detail: 'ahmed@example.com', time: '2 min ago', type: 'user' },
            { action: 'University added', detail: 'Lahore University of Management', time: '15 min ago', type: 'uni' },
            { action: 'Scholarship updated', detail: 'HEC Overseas Scholarship', time: '1 hr ago', type: 'scholarship' },
            { action: 'New user registered', detail: 'sara.khan@gmail.com', time: '2 hrs ago', type: 'user' },
            { action: 'Accommodation listed', detail: 'Berlin Student Housing', time: '3 hrs ago', type: 'accommodation' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                a.type === 'user' ? 'bg-blue-100 text-blue-600' :
                a.type === 'uni' ? 'bg-purple-100 text-purple-600' :
                a.type === 'scholarship' ? 'bg-green-100 text-green-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {a.type === 'user' ? '👤' : a.type === 'uni' ? '🎓' : a.type === 'scholarship' ? '🏆' : '🏠'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{a.action}</p>
                <p className="text-xs text-gray-500 truncate">{a.detail}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
