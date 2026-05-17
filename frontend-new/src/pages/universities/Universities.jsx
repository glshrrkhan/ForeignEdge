import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { uniAPI } from '../../utils/api';
import { Search, MapPin, Star, Filter, X, ChevronLeft, ChevronRight, ExternalLink, GraduationCap, Users, Award } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'ranking_qs', label: 'QS Ranking' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'established', label: 'Established' },
  { value: 'student_count', label: 'Student Count' },
];

function UniCard({ uni }) {
  const flagUrl = uni.country_code
    ? `https://flagcdn.com/48x36/${uni.country_code.toLowerCase()}.png`
    : null;
  const imgUrl = uni.image || `https://source.unsplash.com/400x200/?university,campus,${encodeURIComponent(uni.country || '')}`;

  return (
    <Link to={`/universities/${uni.id}`}
      className="bg-white rounded-2xl border border-gray-100 hover:border-[#00D26A] hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-[#E8FFF3] to-[#00D26A]/20 relative overflow-hidden">
        {uni.image ? (
          <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-[#00D26A]/40" />
          </div>
        )}
        {uni.ranking_qs && (
          <div className="absolute top-3 left-3 bg-[#00D26A] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            #{uni.ranking_qs} QS
          </div>
        )}
        {uni.type && (
          <div className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {uni.type}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-2">
          {flagUrl && <img src={flagUrl} alt={uni.country} className="w-6 h-4 rounded object-cover mt-0.5 flex-shrink-0" onError={e => e.target.style.display='none'} />}
          <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#00D26A] transition-colors line-clamp-2">
            {uni.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3 text-[#00D26A]" />
          <span>{uni.city ? `${uni.city}, ` : ''}{uni.country}</span>
        </div>

        {uni.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">{uni.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-gray-50">
          {uni.tuition_min === 0 && (
            <span className="text-xs bg-[#E8FFF3] text-[#00D26A] font-semibold px-2 py-0.5 rounded-full">Free Tuition</span>
          )}
          {uni.student_count && (
            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />{(uni.student_count / 1000).toFixed(0)}k students
            </span>
          )}
          {uni.ielts_requirement && (
            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">IELTS {uni.ielts_requirement}</span>
          )}
          {uni.established && (
            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">Est. {uni.established}</span>
          )}
        </div>

        {uni.tuition_min > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Tuition: <span className="font-semibold text-gray-700">
              {uni.tuition_currency} {uni.tuition_min?.toLocaleString()} – {uni.tuition_max?.toLocaleString()}/yr
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
    </div>
  );
}

export default function Universities() {
  const [unis, setUnis] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [sort, setSort] = useState('ranking_qs');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const PER_PAGE = 12;

  useEffect(() => {
    uniAPI.getCountries().then(r => setCountries(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    uniAPI.getAll({ search, country, sort, type, page, per_page: PER_PAGE })
      .then(r => {
        setUnis(r.data.universities || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
      })
      .catch(() => setUnis([]))
      .finally(() => setLoading(false));
  }, [search, country, sort, type, page]);

  const handleSearch = (v) => { setSearch(v); setPage(1); };
  const handleCountry = (v) => { setCountry(v); setPage(1); };
  const handleType = (v) => { setType(v); setPage(1); };

  const activeFilters = [country, type].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          World <span className="text-[#00D26A]">Universities</span>
        </h1>
        <p className="text-gray-500">{total ? `${total.toLocaleString()} universities across 30+ countries` : 'Loading...'}</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search universities..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D26A] text-sm"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <select value={country} onChange={e => handleCountry(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D26A] text-sm bg-white">
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D26A] text-sm bg-white">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${filterOpen || activeFilters ? 'bg-[#00D26A] text-white border-[#00D26A]' : 'border-gray-200 text-gray-700 hover:border-[#00D26A]'}`}>
          <Filter className="w-4 h-4" />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">University Type</label>
            <div className="flex gap-2">
              {['', 'Public', 'Private', 'Technical'].map(t => (
                <button key={t} onClick={() => handleType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${type === t ? 'bg-[#00D26A] text-white' : 'bg-white text-gray-700 hover:bg-[#00D26A]/10'}`}>
                  {t || 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : unis.length > 0
            ? unis.map(u => <UniCard key={u.id} uni={u} />)
            : <div className="col-span-4 text-center py-20 text-gray-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p>No universities found. Try different filters.</p>
              </div>
        }
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-[#00D26A] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(7, pages) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page - 3 + i;
              if (p < 1 || p > pages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#00D26A] text-white' : 'border border-gray-200 text-gray-700 hover:border-[#00D26A]'}`}>
                  {p}
                </button>
              );
            })}
          </div>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-[#00D26A] transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
