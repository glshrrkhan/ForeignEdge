import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, GraduationCap, X, Save } from 'lucide-react';
import { uniAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const emptyUni = {
  name: '', country: '', city: '', ranking: '', type: 'Public', tuition_min: '', tuition_max: '',
  acceptance_rate: '', website: '', description: '', programs_count: 0,
};

function Modal({ uni, onClose, onSave }) {
  const [form, setForm] = useState(uni || emptyUni);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{uni?.id ? 'Edit' : 'Add'} University</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'University Name', full: true },
            { key: 'country', label: 'Country' },
            { key: 'city', label: 'City' },
            { key: 'ranking', label: 'World Ranking', type: 'number' },
            { key: 'tuition_min', label: 'Min Tuition ($/yr)', type: 'number' },
            { key: 'tuition_max', label: 'Max Tuition ($/yr)', type: 'number' },
            { key: 'acceptance_rate', label: 'Acceptance Rate (%)', type: 'number' },
            { key: 'website', label: 'Website URL', full: true },
          ].map(f => (
            <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
              <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="input-field w-full" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field w-full">
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-field w-full" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary px-5 py-2.5">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUniversities() {
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | uni object
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await uniAPI.getAll({ page, per_page: PER_PAGE, search });
      setUnis(r.data.universities || []);
      setTotal(r.data.total || 0);
    } catch { setUnis([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleSave = async (form) => {
    if (form.id) {
      await uniAPI.update(form.id, form);
      toast.success('University updated!');
    } else {
      await uniAPI.create(form);
      toast.success('University added!');
    }
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this university?')) return;
    try {
      await uniAPI.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="p-6 space-y-5">
      {modal && <Modal uni={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Universities</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 px-5 py-2.5">
          <Plus className="w-4 h-4" /> Add University
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search universities..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00D26A] transition-colors" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">University</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Location</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Ranking</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Type</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-5 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td>
                </tr>
              ))
            ) : unis.map(uni => (
              <tr key={uni.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{uni.name}</p>
                      <p className="text-xs text-gray-400 md:hidden">{uni.city}, {uni.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-600">{uni.city}</p>
                  <p className="text-xs text-gray-400">{uni.country}</p>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm font-bold text-gray-900">#{uni.ranking || '—'}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${uni.type === 'Public' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                    {uni.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setModal(uni)}
                      className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(uni.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > PER_PAGE && (
        <div className="flex justify-center gap-2">
          {[...Array(Math.ceil(total / PER_PAGE))].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-[#00D26A] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#00D26A]'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
