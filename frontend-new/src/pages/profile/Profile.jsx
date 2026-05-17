import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../utils/api';
import { User, Mail, Phone, MapPin, GraduationCap, Globe, Save, FileText, Plus, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const sections = ['Personal Info', 'Education', 'Test Scores', 'Applications'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('Personal Info');
  const [profile, setProfile] = useState({
    phone: '', nationality: '', dob: '', current_country: '', bio: '',
    highest_degree: '', field_of_study: '', gpa: '', graduation_year: '', university_name: '',
    ielts: '', toefl: '', gre: '', gmat: '', sat: '', act: '',
  });
  const [applications, setApplications] = useState([]);
  const [newApp, setNewApp] = useState({ university_name: '', program: '', country: '', intake: '', status: 'pending', notes: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    profileAPI.getProfile().then(r => {
      if (r.data.profile) setProfile(p => ({ ...p, ...r.data.profile }));
    }).catch(() => {});
    profileAPI.getApplications().then(r => {
      setApplications(r.data.applications || []);
    }).catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await profileAPI.saveProfile(profile);
      setSaved(true);
      toast.success('Profile saved!');
      setTimeout(() => setSaved(false), 3000);
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const addApplication = async () => {
    if (!newApp.university_name) return;
    try {
      const r = await profileAPI.addApplication(newApp);
      setApplications([...applications, r.data.application || { ...newApp, id: Date.now() }]);
      setNewApp({ university_name: '', program: '', country: '', intake: '', status: 'pending', notes: '' });
      toast.success('Application added!');
    } catch { toast.error('Failed to add'); }
  };

  const deleteApp = async (id) => {
    try {
      await profileAPI.deleteApplication(id);
      setApplications(applications.filter(a => a.id !== id));
      toast.success('Removed');
    } catch { toast.error('Failed'); }
  };

  const statusColors = { pending: 'text-yellow-600 bg-yellow-50', submitted: 'text-blue-600 bg-blue-50', accepted: 'text-green-600 bg-green-50', rejected: 'text-red-600 bg-red-50', waitlisted: 'text-purple-600 bg-purple-50' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#00D26A] rounded-2xl flex items-center justify-center text-2xl font-black">
              {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
            </div>
            <div>
              <h1 className="text-2xl font-black">{user?.name}</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <Link to="/profile/evaluation"
            className="bg-[#00D26A] hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all">
            ⚡ AI Evaluation
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-48 shrink-0 hidden md:block">
            <div className="card p-3 sticky top-20">
              {sections.map(s => (
                <button key={s} onClick={() => setActiveSection(s)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-1 ${activeSection === s ? 'bg-[#00D26A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden w-full mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sections.map(s => (
                <button key={s} onClick={() => setActiveSection(s)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeSection === s ? 'bg-[#00D26A] text-white border-[#00D26A]' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeSection === 'Personal Info' && (
              <div className="card p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input value={user?.name || ''} disabled className="input-field w-full opacity-60" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input value={user?.email || ''} disabled className="input-field w-full opacity-60" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input placeholder="+92 300 0000000" value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                    <input placeholder="e.g. Pakistani" value={profile.nationality}
                      onChange={e => setProfile({ ...profile, nationality: e.target.value })} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input type="date" value={profile.dob}
                      onChange={e => setProfile({ ...profile, dob: e.target.value })} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Country</label>
                    <input placeholder="e.g. Pakistan" value={profile.current_country}
                      onChange={e => setProfile({ ...profile, current_country: e.target.value })} className="input-field w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea rows={3} placeholder="Tell us about yourself and your study abroad goals..." value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })} className="input-field w-full" />
                </div>
              </div>
            )}

            {activeSection === 'Education' && (
              <div className="card p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Education Background</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Degree</label>
                    <select value={profile.highest_degree}
                      onChange={e => setProfile({ ...profile, highest_degree: e.target.value })} className="input-field w-full">
                      <option value="">Select Degree</option>
                      <option>High School</option>
                      <option>Bachelors</option>
                      <option>Masters</option>
                      <option>PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study</label>
                    <input placeholder="e.g. Computer Science" value={profile.field_of_study}
                      onChange={e => setProfile({ ...profile, field_of_study: e.target.value })} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GPA</label>
                    <input type="number" step="0.01" placeholder="e.g. 3.75" value={profile.gpa}
                      onChange={e => setProfile({ ...profile, gpa: e.target.value })} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year</label>
                    <input type="number" placeholder="e.g. 2023" value={profile.graduation_year}
                      onChange={e => setProfile({ ...profile, graduation_year: e.target.value })} className="input-field w-full" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">University / School Name</label>
                    <input placeholder="e.g. University of Punjab" value={profile.university_name}
                      onChange={e => setProfile({ ...profile, university_name: e.target.value })} className="input-field w-full" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Test Scores' && (
              <div className="card p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Test Scores</h2>
                <p className="text-sm text-gray-400">Fill in only the tests you've taken</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'ielts', label: 'IELTS', max: '9.0', placeholder: '7.5' },
                    { key: 'toefl', label: 'TOEFL', max: '120', placeholder: '100' },
                    { key: 'gre', label: 'GRE', max: '340', placeholder: '320' },
                    { key: 'gmat', label: 'GMAT', max: '800', placeholder: '650' },
                    { key: 'sat', label: 'SAT', max: '1600', placeholder: '1400' },
                    { key: 'act', label: 'ACT', max: '36', placeholder: '30' },
                  ].map(test => (
                    <div key={test.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{test.label} <span className="text-gray-400 font-normal">/ {test.max}</span></label>
                      <input type="number" placeholder={test.placeholder} value={profile[test.key]}
                        onChange={e => setProfile({ ...profile, [test.key]: e.target.value })} className="input-field w-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'Applications' && (
              <div className="card p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Application Tracker</h2>

                {/* Add new */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700">Add New Application</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input placeholder="University name" value={newApp.university_name}
                      onChange={e => setNewApp({ ...newApp, university_name: e.target.value })} className="input-field" />
                    <input placeholder="Program / Course" value={newApp.program}
                      onChange={e => setNewApp({ ...newApp, program: e.target.value })} className="input-field" />
                    <input placeholder="Country" value={newApp.country}
                      onChange={e => setNewApp({ ...newApp, country: e.target.value })} className="input-field" />
                    <input placeholder="Intake (e.g. Fall 2025)" value={newApp.intake}
                      onChange={e => setNewApp({ ...newApp, intake: e.target.value })} className="input-field" />
                    <select value={newApp.status}
                      onChange={e => setNewApp({ ...newApp, status: e.target.value })} className="input-field">
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="waitlisted">Waitlisted</option>
                    </select>
                  </div>
                  <button onClick={addApplication}
                    className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    <Plus className="w-4 h-4" /> Add Application
                  </button>
                </div>

                {/* List */}
                {applications.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm">No applications tracked yet</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm">{app.university_name}</p>
                          <p className="text-xs text-gray-400">{app.program} • {app.country} • {app.intake}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                          {app.status}
                        </span>
                        <button onClick={() => deleteApp(app.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Save button */}
            {activeSection !== 'Applications' && (
              <div className="mt-4">
                <button onClick={saveProfile} disabled={saving}
                  className="btn-primary flex items-center gap-2 px-8 py-3">
                  {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : saved ? <><CheckCircle className="w-5 h-5" /> Saved!</>
                    : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
