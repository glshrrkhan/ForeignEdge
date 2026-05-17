import { useState, useEffect } from 'react';
import { Search, Plane, Star, ArrowRight, RefreshCw, Clock, Luggage, Wifi } from 'lucide-react';
import { airlineAPI } from '../../utils/api';

function AirlineCard({ airline }) {
  const alliances = { 'Star Alliance': 'bg-blue-100 text-blue-700', 'SkyTeam': 'bg-red-100 text-red-700', 'Oneworld': 'bg-purple-100 text-purple-700' };
  return (
    <div className="card card-hover p-5 flex items-center gap-4 group">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 text-2xl font-black text-gray-600 group-hover:from-green-50 group-hover:to-teal-50 transition-all">
        {airline.code || airline.name?.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#00D26A] transition-colors">{airline.name}</h3>
          {airline.alliance && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${alliances[airline.alliance] || 'bg-gray-100 text-gray-600'}`}>{airline.alliance}</span>}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {airline.country && <span>🌍 {airline.country}</span>}
          {airline.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-700">{airline.rating}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {airline.student_discount && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-100">Student Discount</span>}
          {airline.halal_meals && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium border border-orange-100">Halal Meals</span>}
          {airline.wifi && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-100">WiFi</span>}
        </div>
      </div>
      <div className="text-right shrink-0">
        {airline.baggage && <p className="text-xs text-gray-500">{airline.baggage}</p>}
        <a href={airline.booking_url || '#'} target="_blank" rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#00D26A] hover:underline">
          Book <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function FlightResult({ flight }) {
  return (
    <div className="card p-5 hover:border-[#00D26A] hover:shadow-lg transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600">
            {flight.airline_code || 'XX'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{flight.airline}</p>
            <p className="text-xs text-gray-400">{flight.flight_number || 'FL-XXX'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-[#00D26A]">${flight.price}</p>
          <p className="text-xs text-gray-400">per person</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center">
          <p className="text-lg font-black text-gray-900">{flight.departure_time}</p>
          <p className="text-xs text-gray-500">{flight.from}</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-1">{flight.duration}</p>
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <Plane className="w-4 h-4 text-[#00D26A]" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <p className="text-xs text-gray-400 mt-1">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-gray-900">{flight.arrival_time}</p>
          <p className="text-xs text-gray-500">{flight.to}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Luggage className="w-3 h-3" />{flight.baggage || '23kg'}</span>
          {flight.wifi && <span className="flex items-center gap-1"><Wifi className="w-3 h-3" />WiFi</span>}
          <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />Refundable</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${flight.seats_left < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {flight.seats_left} seats left
        </span>
      </div>
    </div>
  );
}

export default function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Flight search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [flights, setFlights] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const popularRoutes = [
    { from: 'PAK', to: 'UK', label: 'Pakistan → UK' },
    { from: 'IND', to: 'USA', label: 'India → USA' },
    { from: 'CHN', to: 'AUS', label: 'China → Australia' },
    { from: 'NGA', to: 'CAN', label: 'Nigeria → Canada' },
    { from: 'PAK', to: 'GER', label: 'Pakistan → Germany' },
    { from: 'EGY', to: 'FRA', label: 'Egypt → France' },
  ];

  useEffect(() => {
    airlineAPI.getAll().then(r => {
      setAirlines(r.data.airlines || []);
      setLoading(false);
    });
  }, []);

  const searchFlights = async () => {
    if (!from || !to) return;
    setSearching(true);
    setSearched(true);
    try {
      const r = await airlineAPI.searchFlights({ from, to, date, passengers });
      setFlights(r.data.flights || []);
    } catch { setFlights([]); }
    setSearching(false);
  };

  const filteredAirlines = search
    ? airlines.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()) || a.country?.toLowerCase().includes(search.toLowerCase()))
    : airlines;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00D26A] rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#00D26A] font-semibold uppercase tracking-wider text-sm">Airlines & Flights</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Book Your Student Flight</h1>
          <p className="text-gray-300 text-lg mb-8">Compare fares, find student discounts & halal-friendly airlines</p>

          {/* Flight Search */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input type="text" placeholder="From (e.g. PAK, LHR)" value={from} onChange={e => setFrom(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D26A] transition-colors" />
              <input type="text" placeholder="To (e.g. UK, JFK)" value={to} onChange={e => setTo(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D26A] transition-colors" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D26A] transition-colors" />
              <input type="number" min={1} max={9} placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D26A] transition-colors" />
              <button onClick={searchFlights} disabled={searching}
                className="bg-[#00D26A] hover:bg-green-500 text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                {searching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search className="w-5 h-5" /> Search</>}
              </button>
            </div>

            {/* Popular routes */}
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-medium mb-2">Popular student routes:</p>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.map(route => (
                  <button key={route.label} onClick={() => { setFrom(route.from); setTo(route.to); }}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-white border border-white/20 transition-all">
                    ✈️ {route.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Flight Results */}
        {searched && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {searching ? 'Searching flights...' : `${flights.length} flights found`}
            </h2>
            {searching ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-32 bg-gray-100" />)}
              </div>
            ) : flights.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No flights found. Try different routes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flights.map((f, i) => <FlightResult key={i} flight={f} />)}
              </div>
            )}
          </div>
        )}

        {/* Airlines list */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Partner Airlines</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search airlines..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00D26A] transition-colors" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-24 bg-gray-100" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAirlines.map(a => <AirlineCard key={a.id} airline={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
