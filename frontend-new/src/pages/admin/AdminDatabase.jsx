import { useState } from 'react';
import { Database, Table, Search, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const tables = ['universities', 'scholarships', 'accommodations', 'restaurants', 'airlines', 'transport_apps', 'users'];

export default function AdminDatabase() {
  const [selected, setSelected] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadTable = async (table) => {
    setSelected(table);
    setLoading(true);
    setSearch('');
    try {
      const r = await adminAPI.getTable(table);
      setRows(r.data.rows || []);
    } catch { setRows([]); }
    setLoading(false);
  };

  const cols = rows.length > 0 ? Object.keys(rows[0]).slice(0, 8) : [];

  const filtered = search
    ? rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    : rows;

  const tableIcons = {
    universities: '🎓', scholarships: '🏆', accommodations: '🏠',
    restaurants: '🍽️', airlines: '✈️', transport_apps: '📱', users: '👥',
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <Database className="w-7 h-7 text-[#00D26A]" /> Database Browser
        </h1>
        <p className="text-gray-500 text-sm mt-1">View raw data from all database tables</p>
      </div>

      {/* Table selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {tables.map(t => (
          <button key={t} onClick={() => loadTable(t)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${selected === t ? 'border-[#00D26A] bg-green-50 shadow-md' : 'border-gray-100 bg-white hover:border-green-200'}`}>
            <div className="text-2xl mb-1">{tableIcons[t]}</div>
            <p className={`text-xs font-bold capitalize ${selected === t ? 'text-[#00D26A]' : 'text-gray-600'}`}>{t.replace('_', ' ')}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">{tableIcons[selected]}</span>
              <div>
                <h2 className="font-bold text-gray-900 capitalize">{selected.replace('_', ' ')}</h2>
                <p className="text-xs text-gray-400">{filtered.length} rows</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Filter rows..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00D26A]" />
              </div>
              <button onClick={() => loadTable(selected)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table data */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading data...</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="p-8 text-center">
                <Table className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No data found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {cols.map(col => (
                      <th key={col} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2.5 whitespace-nowrap border-b border-gray-100">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.slice(0, 50).map((row, i) => (
                    <tr key={i} className="hover:bg-green-50 transition-colors">
                      {cols.map(col => (
                        <td key={col} className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap max-w-[200px] truncate">
                          {String(row[col] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {filtered.length > 50 && (
            <div className="p-3 text-center text-xs text-gray-400 border-t border-gray-100">
              Showing 50 of {filtered.length} rows. Use the filter to narrow down results.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
