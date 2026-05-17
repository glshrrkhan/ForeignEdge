import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { uniAPI, profileAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin, Globe, Star, Users, BookOpen, Award, CheckCircle,
  Calendar, DollarSign, GraduationCap, ArrowLeft, ExternalLink,
  Heart, Building2, Microscope, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const TAB = ['Overview', 'Programs', 'Admissions', 'Campus & Life', 'Research'];

function StatBox({ icon: Icon, label, value, sub }) {
  if (!value && value !== 0) return null;
  return (
    <div className="bg-[#E8FFF3] rounded-xl p-4 text-center">
      <Icon className="w-5 h-5 text-[#00D26A] mx-auto mb-1" />
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function UniversityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');
  const [saved, setSaved] = useState(false);
  const [programFilter, setProgramFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  useEffect(() => {
    setLoading(true);
    uniAPI.getOne(id)
      .then(r => setUni(r.data))
      .catch(() => toast.error('Failed to load university'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!user) return toast.error('Login to save universities');
    try {
      await profileAPI.toggleSave({ item_type: 'university', item_id: parseInt(id) });
      setSaved(!saved);
      toast.success(saved ? 'Removed from saved' : 'Saved!');
    } catch { toast.error('Error saving'); }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-1/3 mb-4" />
      <div className="h-64 bg-gray-100 rounded-2xl mb-6" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
      </div>
    </div>
  );
  if (!uni) return <div className="text-center py-20 text-gray-400">University not found.</div>;

  const flagUrl = uni.country_code ? `https://flagcdn.com/48x36/${uni.country_code.toLowerCase()}.png` : null;
  const programs = uni.programs || [];
  const degrees = [...new Set(programs.map(p => p.degree_level))].filter(Boolean);
  const fields = [...new Set(programs.map(p => p.field))].filter(Boolean);
  let filteredPrograms = programs;
  if (programFilter) filteredPrograms = filteredPrograms.filter(p => p.degree_level === programFilter);
  if (fieldFilter) filteredPrograms = filteredPrograms.filter(p => p.field === fieldFilter);
  const displayedPrograms = showAllPrograms ? filteredPrograms : filteredPrograms.slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/universities" className="inline-flex items-center gap-1.5 text-sm text-[#00D26A] font-medium mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Universities
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6">
        {uni.image && (
          <div className="h-56 overflow-hidden">
            <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" onError={e => e.target.parentNode.style.display='none'} />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {flagUrl && <img src={flagUrl} alt={uni.country} className="w-6 h-4 rounded object-cover" onError={e => e.target.style.display='none'} />}
                <span className="text-sm text-gray-500">{uni.city}{uni.city && uni.country ? ', ' : ''}{uni.country}</span>
                {uni.type && <span className="bg-[#E8FFF3] text-[#00D26A] text-xs font-semibold px-2 py-0.5 rounded-full">{uni.type}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{uni.name}</h1>
              {uni.description && <p className="text-gray-600 text-sm leading-relaxed">{uni.description}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {uni.ranking_qs && <span className="flex items-center gap-1 text-xs bg-[#00D26A] text-white px-3 py-1 rounded-full font-semibold"><Star className="w-3 h-3" />QS #{uni.ranking_qs}</span>}
                {uni.ranking_the && <span className="text-xs border border-[#00D26A] text-[#00D26A] px-3 py-1 rounded-full font-semibold">THE #{uni.ranking_the}</span>}
                {uni.established && <span className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded-full">Est. {uni.established}</span>}
                {uni.nobel_laureates > 0 && <span className="text-xs border border-amber-200 text-amber-600 px-3 py-1 rounded-full">🏆 {uni.nobel_laureates} Nobel Laureates</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave}
                className={`p-2.5 rounded-xl border transition-colors ${saved ? 'bg-[#00D26A] border-[#00D26A] text-white' : 'border-gray-200 text-gray-600 hover:border-[#00D26A]'}`}>
                <Heart className="w-5 h-5" />
              </button>
              {uni.website && (
                <a href={uni.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#00D26A] text-white rounded-xl text-sm font-semibold hover:bg-[#00A854] transition-colors">
                  <Globe className="w-4 h-4" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatBox icon={Users} label="Total Students" value={uni.student_count?.toLocaleString()} />
        <StatBox icon={Globe} label="International" value={uni.international_percent ? `${uni.international_percent}%` : null} sub="of students" />
        <StatBox icon={BookOpen} label="Programs" value={uni.programs_count || programs.length} />
        <StatBox icon={Award} label="Faculty" value={uni.faculty_count?.toLocaleString()} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-6 overflow-x-auto">
        {TAB.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${tab === t ? 'bg-[#00D26A] text-white shadow-sm' : 'text-gray-600 hover:text-[#00D26A]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          {uni.about_long && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About {uni.name}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{uni.about_long}</div>
            </div>
          )}
          {uni.world_class_fields?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">World-Class Fields</h2>
              <div className="flex flex-wrap gap-2">
                {uni.world_class_fields.map(f => (
                  <span key={f} className="bg-[#E8FFF3] text-[#00D26A] text-sm font-medium px-3 py-1.5 rounded-lg">{f}</span>
                ))}
              </div>
            </div>
          )}
          {uni.notable_alumni?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Notable Alumni</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {uni.notable_alumni.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-[#00D26A] flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                ['Location', `${uni.city || ''} ${uni.country || ''}`.trim()],
                ['Type', uni.type],
                ['Established', uni.established],
                ['Campus', uni.campus_type],
                ['Research Output', uni.research_output],
                ['Student:Faculty Ratio', uni.student_faculty_ratio],
              ].map(([k, v]) => v ? (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      )}

      {tab === 'Programs' && (
        <div>
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-gray-500 self-center">Degree:</span>
              {['', ...degrees].map(d => (
                <button key={d} onClick={() => setProgramFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${programFilter === d ? 'bg-[#00D26A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#E8FFF3]'}`}>
                  {d || 'All'}
                </button>
              ))}
            </div>
            {fields.length > 0 && (
              <select value={fieldFilter} onChange={e => setFieldFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:border-[#00D26A] focus:outline-none">
                <option value="">All Fields</option>
                {fields.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            )}
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No programs match your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedPrograms.map(p => (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-100 hover:border-[#00D26A] p-4 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{p.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        p.degree_level === 'PhD' ? 'bg-purple-100 text-purple-700' :
                        p.degree_level === 'Master' ? 'bg-blue-100 text-blue-700' :
                        p.degree_level === 'MBA' ? 'bg-amber-100 text-amber-700' :
                        'bg-[#E8FFF3] text-[#00D26A]'
                      }`}>{p.degree_level}</span>
                    </div>
                    {p.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {p.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#00D26A]" />{p.duration}</span>}
                      {p.tuition > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-[#00D26A]" />{p.currency} {p.tuition?.toLocaleString()}/yr</span>}
                      {p.ielts_min && <span>IELTS {p.ielts_min}+</span>}
                      {p.mode && <span className="bg-gray-50 px-1.5 py-0.5 rounded">{p.mode}</span>}
                      {p.scholarship_available && <span className="text-[#00D26A] font-medium">🎓 Scholarship</span>}
                    </div>
                  </div>
                ))}
              </div>
              {filteredPrograms.length > 8 && (
                <button onClick={() => setShowAllPrograms(!showAllPrograms)}
                  className="flex items-center gap-2 mx-auto mt-5 px-5 py-2.5 border border-[#00D26A] text-[#00D26A] rounded-xl text-sm font-medium hover:bg-[#E8FFF3] transition-colors">
                  {showAllPrograms ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All {filteredPrograms.length} Programs</>}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'Admissions' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Entry Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'IELTS (Minimum)', value: uni.ielts_requirement ? `${uni.ielts_requirement} overall` : 'Contact university' },
                { label: 'TOEFL (Minimum)', value: uni.toefl_requirement ? `${uni.toefl_requirement} iBT` : 'Contact university' },
                { label: 'Duolingo', value: uni.duolingo_requirement ? `${uni.duolingo_requirement}+` : 'Check website' },
                { label: 'Minimum GPA', value: uni.min_gpa ? `${uni.min_gpa} / 4.0` : 'Varies by program' },
                { label: 'GRE Required', value: uni.gre_required ? 'Yes' : 'Not required' },
                { label: 'GMAT Required', value: uni.gmat_required ? 'Yes (MBA)' : 'Not required' },
                { label: 'Acceptance Rate', value: uni.acceptance_rate ? `${uni.acceptance_rate}%` : null },
              ].filter(i => i.value).map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Deadlines & Intake</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uni.application_deadline_fall && (
                <div className="flex items-center gap-3 bg-[#E8FFF3] rounded-xl p-3">
                  <Calendar className="w-5 h-5 text-[#00D26A]" />
                  <div><p className="text-xs text-gray-500">Fall Intake</p><p className="text-sm font-semibold text-gray-800">{uni.application_deadline_fall}</p></div>
                </div>
              )}
              {uni.application_deadline_spring && (
                <div className="flex items-center gap-3 bg-[#E8FFF3] rounded-xl p-3">
                  <Calendar className="w-5 h-5 text-[#00D26A]" />
                  <div><p className="text-xs text-gray-500">Spring Intake</p><p className="text-sm font-semibold text-gray-800">{uni.application_deadline_spring}</p></div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tuition & Fees</h2>
            <div className="flex items-start gap-4">
              <DollarSign className="w-8 h-8 text-[#00D26A] mt-1" />
              <div>
                {uni.tuition_min === 0 ? (
                  <p className="text-2xl font-bold text-[#00D26A]">Free / No Tuition</p>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {uni.tuition_currency} {uni.tuition_min?.toLocaleString()} – {uni.tuition_max?.toLocaleString()}
                    <span className="text-sm text-gray-500 font-normal"> / year</span>
                  </p>
                )}
                {uni.tuition_notes && <p className="text-sm text-gray-500 mt-1">{uni.tuition_notes}</p>}
              </div>
            </div>
          </div>

          {uni.apply_url && (
            <a href={uni.apply_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#00D26A] text-white rounded-xl font-semibold hover:bg-[#00A854] transition-colors">
              <ExternalLink className="w-5 h-5" /> Apply Now
            </a>
          )}
        </div>
      )}

      {tab === 'Campus & Life' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Campus Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Campus Type', uni.campus_type],
                ['Campus Size', uni.campus_size],
                ['Housing Available', uni.housing_available ? 'Yes, on campus' : 'Off-campus only'],
                ['Housing Cost', uni.housing_cost_min && uni.housing_cost_max ? `${uni.tuition_currency} ${uni.housing_cost_min?.toLocaleString()} – ${uni.housing_cost_max?.toLocaleString()}/month` : null],
                ['Scholarships', uni.scholarships_available ? 'Available for international students' : null],
              ].filter(([_, v]) => v).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-[#00D26A] flex-shrink-0" />
                  <div><p className="text-xs text-gray-400">{k}</p><p className="text-sm font-medium text-gray-800">{v}</p></div>
                </div>
              ))}
            </div>
          </div>

          {(uni.latitude && uni.longitude) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <MapPin className="w-4 h-4 text-[#00D26A]" />
                {uni.city && `${uni.city}, `}{uni.country}
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${uni.latitude},${uni.longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#00D26A] font-medium hover:underline flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
              </a>
            </div>
          )}
        </div>
      )}

      {tab === 'Research' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Research Excellence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <StatBox icon={Microscope} label="Research Output" value={uni.research_output} />
              <StatBox icon={Award} label="Nobel Laureates" value={uni.nobel_laureates ?? 0} />
              <StatBox icon={BookOpen} label="Programs" value={programs.length || uni.programs_count} />
            </div>
            {uni.world_class_fields?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Top Research Areas</p>
                <div className="flex flex-wrap gap-2">
                  {uni.world_class_fields.map(f => (
                    <span key={f} className="bg-[#E8FFF3] text-[#00D26A] text-sm px-3 py-1 rounded-full font-medium">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
