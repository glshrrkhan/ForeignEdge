import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, Award } from 'lucide-react';
import { scholarshipAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const empty = { name: '', country: '', amount: '', currency: 'USD', degree_level: 'masters', field: '', deadline: '', fully_funded: false, description: '', eligibility: '', link: '' };

function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || empty);
  const [saving, setSaving] = useState(false);
  const save = async () => { setSaving(true); try { await onSave(form); onClose(); } catch { toast.error('Failed'); } setSaving(false); };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold">{item?.id ? 'Edit' : 'Add'} Scholarship</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
            <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 25000" className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Degree Level</label>
            <select value={form.degree_level} onChange={e => setForm({ ...form, degree_level: e.target.value })} className="input-field w-full">
              <option value="bachelors">Bachelors</option>
              <option value="masters">Masters</option>
              <option value="phd">PhD</option>
              <option value="all">All Levels</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Field</label>
            <input value={form.field} onChange={e => setForm({ ...form, field: e.target.value })} placeholder="All Fields" className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link</label>
            <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://" className="input-field w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.fully_funded} onChange={e => setForm({ ...form, fully_funded: e.target.checked })} className="w-5 h-5 accent-[#00D26A]" />
              <span className="text-sm font-semibold text-gray-700">Fully Funded</span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Eligibility</label>
            <textarea rows={2} value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} className="input-field w-full" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="btn-secondary px-5 py-2.5">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminScholarships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await scholarshipAPI.getAll({ page, per_page: PER_PAGE, search });
      setItems(r.data.scholarships || []);
      setTotal(r.data.total || 0);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleSave = async (form) => {
    if (form.id) { await scholarshipAPI.update(form.id, form); toast.success('Updated!'); }
    else { await scholarshipAPI.create(form); toast.success('Added!'); }
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await scholarshipAPI.delete(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="p-6 space-y-5">
      {modal && <Modal item={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Scholarships</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 px-5 py-2.5">
          <Plus className="w-4 h-4" /> Add Scholarship
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search scholarships..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00D26A]" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3">Scholarship</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Country</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Degree</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Amount</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
            )) : items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      {item.fully_funded && <span className="text-xs text-green-600 font-semibold">Fully Funded</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{item.country}</td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.degree_level}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm font-bold text-[#00D26A]">{item.amount ? `$${Number(item.amount).toLocaleString()}` : '—'}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setModal(item)} className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors">
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
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-[#00D26A] text-white' : 'bg-white border border-gray-200 hover:border-[#00D26A]'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
