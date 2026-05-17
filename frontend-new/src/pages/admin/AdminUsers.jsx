import { useState, useEffect } from 'react';
import { Search, Trash2, Users, Shield, User } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getUsers().then(r => {
      setUsers(r.data.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const filtered = search
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total registered users</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-blue-700">{users.length} Users</span>
        </div>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00D26A]" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3">User</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Email</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Role</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Joined</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
            )) : filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold ${user.role === 'admin' ? 'bg-[#00D26A]' : 'bg-blue-500'}`}>
                      {user.name?.slice(0, 2).toUpperCase() || 'US'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400 md:hidden">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{user.email}</td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit ${user.role === 'admin' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role || 'student'}
                  </span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-500">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    {user.role !== 'admin' && (
                      <button onClick={() => handleDelete(user.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
