import { useState, useEffect } from 'react';
import { Search, Smartphone, ExternalLink, Star, Globe, Briefcase, DollarSign, Car, ShoppingBag, BookOpen } from 'lucide-react';
import { transportAPI } from '../../utils/api';

const categoryConfig = {
  'Transport': { icon: Car, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-100' },
  'Food Delivery': { icon: ShoppingBag, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700 border-orange-100' },
  'Jobs': { icon: Briefcase, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-100' },
  'Finance': { icon: DollarSign, color: 'bg-green-500', light: 'bg-green-50 text-green-700 border-green-100' },
  'Education': { icon: BookOpen, color: 'bg-yellow-500', light: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  'Social': { icon: Globe, color: 'bg-pink-500', light: 'bg-pink-50 text-pink-700 border-pink-100' },
};
const categoryEmojis = { 'Transport': '🚗', 'Food Delivery': '🛵', 'Jobs': '💼', 'Finance': '💰', 'Education': '📚', 'Social': '🌐' };

function AppCard({ app }) {
  const cat = categoryConfig[app.category] || { color: 'bg-gray-500', light: 'bg-gray-50 text-gray-700 border-gray-100' };
  return (
    <div className="card card-hover p-5 group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0`}>
          {app.icon || app.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#00D26A] transition-colors">{app.name}</h3>
            {app.rating && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-gray-700">{app.rating}</span>
              </div>
            )}
          </div>
          {app.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{app.description}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cat.light}`}>
              {categoryEmojis[app.category]} {app.category}
            </span>
            {app.free && <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-medium">Free</span>}
            {app.student_discount && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">Student Deal</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-1">
          {(app.countries || []).slice(0, 3).map(c => (
            <span key={c} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{c}</span>
          ))}
          {(app.countries || []).length > 3 && <span className="text-xs text-gray-400">+{app.countries.length - 3}</span>}
        </div>
        {app.url && (
          <a href={app.url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-[#00D26A] hover:underline">
            Get App <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Transport() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    transportAPI.getAll().then(r => {
      setApps(r.data.apps || []);
      setLoading(false);
    });
  }, []);

  const categories = Object.keys(categoryConfig);

  const filtered = apps.filter(a => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || a.category === category;
    return matchSearch && matchCat;
  });

  const byCategory = {};
  filtered.forEach(a => {
    if (!byCategory[a.category]) byCategory[a.category] = [];
    byCategory[a.category].push(a);
  });

  const stats = [
    { label: 'Transport Apps', value: apps.filter(a => a.category === 'Transport').length, icon: '🚗' },
    { label: 'Job Portals', value: apps.filter(a => a.category === 'Jobs').length, icon: '💼' },
    { label: 'Finance Apps', value: apps.filter(a => a.category === 'Finance').length, icon: '💰' },
    { label: 'Food Delivery', value: apps.filter(a => a.category === 'Food Delivery').length, icon: '🛵' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-violet-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00D26A] rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#00D26A] font-semibold uppercase tracking-wider text-sm">Apps & Tools</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Essential Student Apps</h1>
          <p className="text-gray-300 text-lg mb-8">Transport, jobs, food delivery & finance apps for international students</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-gray-300 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search apps..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00D26A]" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <button onClick={() => setCategory('')}
            className={`shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all ${!category ? 'bg-[#00D26A] text-white border-[#00D26A] shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-[#00D26A]'}`}>
            All Apps
          </button>
          {categories.map(c => {
            const Ic = categoryConfig[c]?.icon || Globe;
            return (
              <button key={c} onClick={() => setCategory(c)}
                className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all ${category === c ? 'bg-[#00D26A] text-white border-[#00D26A] shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-[#00D26A]'}`}>
                <span>{categoryEmojis[c]}</span> {c}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => <div key={i} className="card animate-pulse h-40" />)}
          </div>
        ) : category ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(a => <AppCard key={a.id} a={a} app={a} />)}
          </div>
        ) : (
          Object.entries(byCategory).map(([cat, catApps]) => (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 ${categoryConfig[cat]?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                  <span className="text-xl">{categoryEmojis[cat]}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{cat}</h2>
                  <p className="text-sm text-gray-400">{catApps.length} apps available</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catApps.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
