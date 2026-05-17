import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, X, Home, Building2, ExternalLink, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { accommodationAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const PLATFORMS = [
  { name: 'All Platforms', value: '' },
  { name: 'Amber', value: 'Amber', url: 'https://amberstudent.com' },
  { name: 'Unilodgers', value: 'Unilodgers', url: 'https://www.unilodgers.com' },
  { name: 'Student.com', value: 'StudentCom', url: 'https://www.student.com' },
  { name: 'Airbnb', value: 'Airbnb', url: 'https://www.airbnb.com' },
  { name: 'Spotahome', value: 'Spotahome', url: 'https://www.spotahome.com' },
  { name: 'HousingAnywhere', value: 'HousingAnywhere', url: 'https://housinganywhere.com' },
  { name: 'Nestpick', value: 'Nestpick', url: 'https://www.nestpick.com' },
  { name: 'Erasmusu', value: 'Erasmusu', url: 'https://erasmusu.com' },
  { name: 'UniAcco', value: 'UniAcco', url: 'https://uniacco.com' },
  { name: 'CASITA', value: 'CASITA', url: 'https://casita.com' },
];

const TYPES = ['All Types', 'Student Residence', 'Shared Apartment', 'Private Studio', 'Homestay', 'Co-living Space', 'University Dormitory'];

const TYPE_COLORS = {
  'Student Residence': 'bg-blue-100 text-blue-700',
  'Shared Apartment': 'bg-[#E8FFF3] text-[#00D26A]',
  'Private Studio': 'bg-purple-100 text-purple-700',
  'Homestay': 'bg-amber-100 text-amber-700',
  'Co-living Space': 'bg-pink-100 text-pink-700',
  'University Dormitory': 'bg-gray-100 text-gray-700',
};

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

function AccomCard({ item }) {
  const [saved, setSaved] = useState(false);
  const amenities = (item.amenities || '').split(',').map(a => a.trim()).filter(Boolean);
  const typeClass = TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-[#00D26A] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
      <div className="h-40 bg-gradient-to-br from-[#E8FFF3] to-[#00D26A]/20 relative flex items-center justify-center">
        <Building2 className="w-14 h-14 text-[#00D26A]/30" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeClass}`}>{item.type}</span>
        </div>
        <button onClick={() => setSaved(!saved)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${saved ? 'bg-[#00D26A] text-white' : 'bg-white text-gray-400 hover:text-[#00D26A]'}`}>
          <Heart className="w-4 h-4" fill={saved ? 'white' : 'none'} />
        </button>
        {item.platform && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
            {item.platform}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-[#00D26A] transition-colors line-clamp-2">{item.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3 text-[#00D26A]" />
          <span>{item.city}, {item.country}</span>
          {item.distance_to_center && <span className="text-gray-400">· {item.distance_to_center} from centre</span>}
        </div>
        <Stars rating={item.rating} />
        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 flex-1">{item.description}</p>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {amenities.slice(0, 4).map(a => (
              <span key={a} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
            ))}
            {amenities.length > 4 && <span className="text-xs text-gray-400">+{amenities.length - 4} more</span>}
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Price / month</p>
            <p className="text-sm font-bold text-gray-900">
              {item.currency} {item.price_min?.toLocaleString()} – {item.price_max?.toLocaleString()}
            </p>
          </div>
          {item.website && (
            <a href={item.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-[#00D26A] hover:underline">
              View <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
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
        <div className="h-8 bg-gray-100 rounded mt-4" />
      </div>
    </div>
  );
}

function useAccommodation({ search, country, type, maxPrice, page, perPage }) {
  const [state, setState] = useState({ items: [], total: 0, pages: 1, loading: true });

  useEffect(() => {
    let cancelled = false;
    accommodationAPI
      .getAll({ search, country, type, max_price: maxPrice, page, per_page: perPage })
      .then(r => {
        if (cancelled) return;
        setState({
          items: r.data.accommodations || [],
          total: r.data.total || 0,
          pages: r.data.pages || 1,
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState(prev => ({ ...prev, items: [], loading: false }));
        toast.error('Failed to load accommodations');
      });
    return () => { cancelled = true; };
  }, [search, country, type, maxPrice, page, perPage]);

  return state;
}

export default function Accommodation() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState('');
  const [platform, setPlatform] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const PER_PAGE = 12;

  useEffect(() => {
    accommodationAPI.getCountries().then(r => setCountries(r.data)).catch(() => {});
  }, []);

  const { items, total, pages, loading } = useAccommodation({
    search, country, type, maxPrice, page, perPage: PER_PAGE,
  });

  const displayed = platform
    ? items.filter(i => (i.platform || '').toLowerCase().includes(platform.toLowerCase()))
    : items;

  const activeFilters = [country, type, platform, maxPrice].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student <span className="text-[#00D26A]">Accommodation</span>
        </h1>
        <p className="text-gray-500">{total ? `${total.toLocaleString()} listings across 12 countries` : 'Loading...'}</p>
      </div>

      {/* Platform pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
        {PLATFORMS.map(p => (
          <button key={p.value} onClick={() => { setPlatform(p.value); setPage(1); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${platform === p.value ? 'bg-[#00D26A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A]'}`}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or city..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D26A] text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        <select value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D26A] text-sm bg-white">
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${filterOpen || activeFilters ? 'bg-[#00D26A] text-white border-[#00D26A]' : 'border-gray-200 text-gray-700 hover:border-[#00D26A]'}`}>
          <Filter className="w-4 h-4" /> Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
      </div>

      {filterOpen && (
        <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-4 mb-5 flex flex-wrap gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Accommodation Type</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => { setType(t === 'All Types' ? '' : t); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${type === (t === 'All Types' ? '' : t) ? 'bg-[#00D26A] text-white' : 'bg-white text-gray-700 hover:bg-[#00D26A]/10'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Max Price / month</label>
            <input type="number" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
              placeholder="e.g. 1000"
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-[#00D26A] focus:outline-none w-36" />
          </div>
          <div className="flex items-end">
            <button onClick={() => { setType(''); setPlatform(''); setMaxPrice(''); setCountry(''); setSearch(''); setPage(1); setFilterOpen(false); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5">
              Clear All
            </button>
          </div>
        </div>
      )}

      {platform && (
        <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">{platform} Listings</p>
            <p className="text-sm text-gray-500">{PLATFORMS.find(p2 => p2.value === platform)?.url}</p>
          </div>
          <a href={PLATFORMS.find(p2 => p2.value === platform)?.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-[#00D26A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#00A854] transition-colors">
            Visit Site <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : displayed.length > 0
            ? displayed.map(item => <AccomCard key={item.id} item={item} />)
            : (
              <div className="col-span-4 text-center py-20">
                <Home className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400">No accommodations found. Try different filters.</p>
              </div>
            )
        }
      </div>

      {pages > 1 && !platform && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-[#00D26A] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
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
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-[#00D26A] transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accommodation Platforms</h2>
        <p className="text-gray-500 mb-6">Trusted platforms used by international students worldwide</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.slice(1).map(p => (
            <a key={p.value} href={p.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 hover:border-[#00D26A] hover:shadow-md transition-all group">
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-[#00D26A] transition-colors">{p.name}</p>
                <p className="text-xs text-gray-400">{p.url.replace('https://', '')}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#00D26A] transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}