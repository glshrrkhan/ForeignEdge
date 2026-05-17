import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { scholarshipAPI } from '../../utils/api';
import { Search, BookOpen, Globe, DollarSign, Calendar, CheckCircle, ArrowRight, X, Star, Filter } from 'lucide-react';

const LEVEL_COLORS = { Bachelor: 'badge-blue', Master: 'badge-green', PhD: 'badge-purple', 'Bachelor,Master,PhD': 'badge-orange' };
const TYPE_COLORS = { Government: 'bg-blue-50 text-blue-700', Foundation: 'bg-purple-50 text-purple-700', University: 'bg-green-50 text-green-700' };

function ScholarshipCard({ s }) {
  return (
    <Link to={`/scholarships/${s.id}`} className="card-hover block">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {s.fully_funded && <span className="badge bg-[#E8FFF3] text-[#00A854] text-xs">⭐ Fully Funded</span>}
              {s.type && <span className={`badge text-xs ${TYPE_COLORS[s.type] || 'badge-blue'}`}>{s.type}</span>}
            </div>
            <h3 className="font-bold text-gray-900 leading-tight">{s.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.provider}</p>
          </div>
          <div className="text-3xl flex-shrink-0">
            {s.host_country === 'USA' ? '🇺🇸' : s.host_country === 'UK' ? '🇬🇧' : s.host_country === 'Germany' ? '🇩🇪' : s.host_country === 'Australia' ? '🇦🇺' : s.host_country === 'Japan' ? '🇯🇵' : s.host_country === 'South Korea' ? '🇰🇷' : s.host_country === 'Europe' ? '🇪🇺' : '🌍'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {s.degree_level?.split(',').map(d => (
            <span key={d} className={`badge text-xs ${LEVEL_COLORS[d] || 'badge-blue'}`}>{d.trim()}</span>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4 text-[#00D26A]" />
            <span>{s.host_country}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-[#00D26A]" />
            <span className="font-semibold text-[#00D26A]">{s.amount}</span>
          </div>
          {s.deadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Deadline: {s.deadline}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{s.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Globe className="w-3.5 h-3.5" />
            <span>{s.country || 'All countries'}</span>
          </div>
          <span className="text-[#00D26A] text-sm font-semibold flex items-center gap-1">
            Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Scholarships() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const search = searchParams.get('search') || '';
  const degree = searchParams.get('degree') || '';
  const country = searchParams.get('country') || '';
  const fullyFunded = searchParams.get('fully_funded') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    scholarshipAPI.getAll({ search, degree, country, fully_funded: fullyFunded, page, per_page: 12 })
      .then(r => {
        setScholarships(r.data.scholarships);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  }, [search, degree, country, fullyFunded, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D26A]/10 rounded-full blur-3xl"/>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">World Scholarships</h1>
          <p className="text-gray-300">Fully-funded & partial scholarships for Bachelor, Master & PhD — updated regularly</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search scholarships..."
            defaultValue={search}
            onKeyDown={e => e.key === 'Enter' && setParam('search', e.target.value)}
            className="input-field pl-11"
          />
        </div>

        <select value={degree} onChange={e => setParam('degree', e.target.value)} className="input-field w-auto min-w-36">
          <option value="">All Degrees</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="PhD">PhD</option>
        </select>

        <select value={country} onChange={e => setParam('country', e.target.value)} className="input-field w-auto min-w-36">
          <option value="">All Countries</option>
          {['USA', 'UK', 'Germany', 'Canada', 'Australia', 'Japan', 'South Korea', 'Europe'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={() => setParam('fully_funded', fullyFunded ? '' : 'true')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${fullyFunded ? 'border-[#00D26A] bg-[#E8FFF3] text-[#00D26A]' : 'border-gray-200 text-gray-600 hover:border-[#00D26A]'}`}
        >
          <Star className="w-4 h-4" /> Fully Funded Only
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">{loading ? 'Loading...' : `${total} scholarships found`}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array(9).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5"><div className="space-y-3"><div className="h-4 skeleton rounded"/><div className="h-6 skeleton rounded"/><div className="h-4 w-2/3 skeleton rounded"/><div className="h-16 skeleton rounded"/></div></div>)
          : scholarships.map(s => <ScholarshipCard key={s.id} s={s} />)
        }
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { const np = new URLSearchParams(searchParams); np.set('page', p); setSearchParams(np); }} className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${p === page ? 'bg-[#00D26A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
