import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, UtensilsCrossed, Filter, X, ChefHat } from 'lucide-react';
import { restaurantAPI } from '../../utils/api';

const categoryColors = {
  'Asian': 'badge-blue', 'Middle Eastern': 'badge-yellow', 'Western': 'badge-gray',
  'Italian': 'badge-green', 'Fast Food': 'badge-purple', 'Indian': 'badge-yellow', 'Mediterranean': 'badge-blue'
};
const categoryEmojis = {
  'Asian': '🍜', 'Middle Eastern': '🥙', 'Western': '🍔', 'Italian': '🍕',
  'Fast Food': '🍟', 'Indian': '🍛', 'Mediterranean': '🫒', 'Seafood': '🦞', 'Vegetarian': '🥗'
};

function RestaurantCard({ r }) {
  return (
    <div className="card card-hover overflow-hidden group">
      <div className={`h-36 flex items-center justify-center text-6xl relative bg-gradient-to-br from-orange-50 to-red-50`}>
        <span>{categoryEmojis[r.category] || '🍽️'}</span>
        {r.halal && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ Halal
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`badge ${categoryColors[r.category] || 'badge-gray'} text-xs`}>{r.category}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#00D26A] transition-colors line-clamp-1">{r.name}</h3>

        <div className="flex items-center gap-1 text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{r.city}, {r.country}</span>
        </div>

        {r.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{r.description}</p>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {r.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-gray-700">{r.rating}</span>
              </div>
            )}
            {r.price_range && (
              <span className="text-xs font-medium text-green-600">{r.price_range}</span>
            )}
          </div>
          {r.opening_hours && (
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{r.opening_hours}</span>
            </div>
          )}
        </div>

        {r.address && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-1">📍 {r.address}</p>
        )}
      </div>
    </div>
  );
}

export default function Restaurants() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [halal, setHalal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [countries, setCountries] = useState([]);
  const PER_PAGE = 12;

  useEffect(() => {
    restaurantAPI.getAll({ per_page: 100 }).then(r => {
      const all = r.data.restaurants || [];
      const unique = [...new Set(all.map(x => x.country))].sort();
      setCountries(unique);
    });
  }, []);

  useEffect(() => { fetchData(); }, [page, country, city, category, halal]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: PER_PAGE, country, city, category, halal: halal || '' };
      const r = await restaurantAPI.getAll(params);
      setItems(r.data.restaurants || []);
      setTotal(r.data.total || 0);
    } catch { setItems([]); }
    setLoading(false);
  };

  const filtered = search
    ? items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()) || i.city?.toLowerCase().includes(search.toLowerCase()))
    : items;

  const categories = ['Asian', 'Middle Eastern', 'Western', 'Italian', 'Fast Food', 'Indian', 'Mediterranean', 'Seafood', 'Vegetarian'];

  // group by city
  const byCity = {};
  filtered.forEach(r => {
    const key = `${r.city}, ${r.country}`;
    if (!byCity[key]) byCity[key] = [];
    byCity[key].push(r);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-900 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00D26A] rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#00D26A] font-semibold uppercase tracking-wider text-sm">Restaurants & Malls</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Eat Like a Local</h1>
          <p className="text-gray-300 text-lg mb-8">Halal-friendly restaurants, malls & dining spots in student cities worldwide</p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search restaurants or cities..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00D26A]" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <select value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}
              className="input-field flex-1 min-w-[150px] py-2.5">
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
              className="input-field flex-1 min-w-[140px] py-2.5">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{categoryEmojis[c]} {c}</option>)}
            </select>
            <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-4 py-2.5 rounded-xl border border-green-100 hover:border-green-300 transition-colors">
              <input type="checkbox" checked={halal} onChange={e => { setHalal(e.target.checked); setPage(1); }}
                className="accent-[#00D26A]" />
              <span className="text-sm font-semibold text-green-700">Halal Only</span>
            </label>
            {(country || category || halal) && (
              <button onClick={() => { setCountry(''); setCategory(''); setHalal(false); setPage(1); }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button onClick={() => setCategory('')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!category ? 'bg-[#00D26A] text-white border-[#00D26A]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#00D26A]'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${category === c ? 'bg-[#00D26A] text-white border-[#00D26A]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#00D26A]'}`}>
              {categoryEmojis[c]} {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="h-36 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(byCity).length === 0 ? (
          <div className="text-center py-20">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No restaurants found</h3>
            <p className="text-gray-400">Try different filters</p>
          </div>
        ) : (
          Object.entries(byCity).map(([cityKey, rests]) => (
            <div key={cityKey} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#00D26A]" />
                <h2 className="text-lg font-bold text-gray-900">{cityKey}</h2>
                <span className="text-sm text-gray-400">({rests.length} places)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {rests.map(r => <RestaurantCard key={r.id} r={r} />)}
              </div>
            </div>
          ))
        )}

        {total > PER_PAGE && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(Math.ceil(total / PER_PAGE))].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${page === i + 1 ? 'bg-[#00D26A] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#00D26A]'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
