import { useState } from 'react';
import { Zap, ChevronRight, ChevronLeft, CheckCircle, Star, Award, TrendingUp, AlertTriangle, Brain, Loader } from 'lucide-react';
import { profileAPI } from '../../utils/api';

const steps = [
  { id: 'background', title: 'Academic Background', desc: 'Education & grades' },
  { id: 'scores', title: 'Test Scores', desc: 'Language & aptitude tests' },
  { id: 'goals', title: 'Study Goals', desc: 'What you want to study' },
  { id: 'extra', title: 'Extra Curriculars', desc: 'Activities & achievements' },
  { id: 'financial', title: 'Financial Info', desc: 'Budget & funding needs' },
];

const initialForm = {
  // background
  degree_level: 'bachelors', current_gpa: '', gpa_scale: '4.0', current_degree: '', major: '', graduation_year: '',
  university_name: '', country_of_origin: '',
  // scores
  ielts: '', toefl: '', gre: '', gmat: '', sat: '',
  // goals
  target_degree: 'masters', desired_field: '', preferred_countries: '', preferred_universities: '', budget_usd: '',
  intake_year: '2025', career_goal: '',
  // extra
  work_experience: '', internships: '', publications: '', awards: '', volunteering: '', languages: '', projects: '',
  // financial
  funding_needed: true, can_self_fund: '', scholarship_needed: true, part_time_work_ok: true,
};

export default function ProfileEvaluation() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await profileAPI.evaluate(form);
      setResult(r.data);
    } catch (e) {
      setError('Evaluation failed. Please try again.');
    }
    setLoading(false);
  };

  if (result) {
    return <EvaluationResult result={result} onReset={() => { setResult(null); setStep(0); }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-green-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#00D26A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">AI Profile Evaluation</h1>
          <p className="text-gray-300">Get personalized university & scholarship recommendations powered by AI</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step ? 'bg-[#00D26A] border-[#00D26A] text-white' : i === step ? 'border-[#00D26A] text-[#00D26A] bg-green-50' : 'border-gray-200 text-gray-400 bg-white'}`}>
                    {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-1 hidden sm:block text-center max-w-[80px] leading-tight">{s.title}</p>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-all ${i < step ? 'bg-[#00D26A]' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#00D26A] rounded-full transition-all duration-500"
              style={{ width: `${((step) / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Step content */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{steps[step].title}</h2>
          <p className="text-gray-500 text-sm mb-6">{steps[step].desc}</p>

          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Degree</label>
                <select value={form.current_degree} onChange={e => update('current_degree', e.target.value)} className="input-field w-full">
                  <option value="">Select</option>
                  <option>High School</option>
                  <option>Bachelors</option>
                  <option>Masters</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Major / Field</label>
                <input placeholder="e.g. Computer Science" value={form.major} onChange={e => update('major', e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GPA</label>
                <div className="flex gap-2">
                  <input type="number" step="0.01" placeholder="3.75" value={form.current_gpa} onChange={e => update('current_gpa', e.target.value)} className="input-field flex-1" />
                  <select value={form.gpa_scale} onChange={e => update('gpa_scale', e.target.value)} className="input-field w-24">
                    <option>4.0</option>
                    <option>5.0</option>
                    <option>10.0</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year</label>
                <input type="number" placeholder="2024" value={form.graduation_year} onChange={e => update('graduation_year', e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your University</label>
                <input placeholder="e.g. NUST, IIT Delhi" value={form.university_name} onChange={e => update('university_name', e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country of Origin</label>
                <input placeholder="e.g. Pakistan" value={form.country_of_origin} onChange={e => update('country_of_origin', e.target.value)} className="input-field w-full" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { key: 'ielts', label: 'IELTS', placeholder: '7.5', max: '/9.0' },
                { key: 'toefl', label: 'TOEFL iBT', placeholder: '100', max: '/120' },
                { key: 'gre', label: 'GRE', placeholder: '320', max: '/340' },
                { key: 'gmat', label: 'GMAT', placeholder: '650', max: '/800' },
                { key: 'sat', label: 'SAT', placeholder: '1400', max: '/1600' },
              ].map(t => (
                <div key={t.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t.label} <span className="text-gray-400 font-normal">{t.max}</span></label>
                  <input type="number" placeholder={t.placeholder} value={form[t.key]} onChange={e => update(t.key, e.target.value)} className="input-field w-full" />
                </div>
              ))}
              <div className="sm:col-span-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">💡 Leave blank if you haven't taken the test. The AI will note missing scores as areas to address.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Degree</label>
                <select value={form.target_degree} onChange={e => update('target_degree', e.target.value)} className="input-field w-full">
                  <option value="bachelors">Bachelors</option>
                  <option value="masters">Masters</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Desired Field</label>
                <input placeholder="e.g. Artificial Intelligence" value={form.desired_field} onChange={e => update('desired_field', e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Countries</label>
                <input placeholder="e.g. Germany, UK, Canada" value={form.preferred_countries} onChange={e => update('preferred_countries', e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Intake Year</label>
                <select value={form.intake_year} onChange={e => update('intake_year', e.target.value)} className="input-field w-full">
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Career Goal</label>
                <textarea rows={2} placeholder="Where do you see yourself in 5 years?" value={form.career_goal} onChange={e => update('career_goal', e.target.value)} className="input-field w-full" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dream Universities (optional)</label>
                <input placeholder="e.g. MIT, Oxford, ETH Zurich" value={form.preferred_universities} onChange={e => update('preferred_universities', e.target.value)} className="input-field w-full" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'work_experience', label: 'Work Experience', placeholder: 'e.g. 2 years as Software Engineer at XYZ' },
                { key: 'internships', label: 'Internships', placeholder: 'e.g. Google Summer Internship 2023' },
                { key: 'publications', label: 'Publications / Research', placeholder: 'e.g. IEEE paper on ML algorithms' },
                { key: 'awards', label: 'Awards & Honors', placeholder: "e.g. Dean's List, National Olympiad winner" },
                { key: 'volunteering', label: 'Volunteering', placeholder: 'e.g. Teaching underprivileged students' },
                { key: 'languages', label: 'Languages Spoken', placeholder: 'e.g. English (C1), Urdu (native), German (A2)' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                  <textarea rows={2} placeholder={f.placeholder} value={form[f.key]} onChange={e => update(f.key, e.target.value)} className="input-field w-full" />
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Budget (USD)</label>
                  <input type="number" placeholder="e.g. 20000" value={form.budget_usd} onChange={e => update('budget_usd', e.target.value)} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Self-funding Ability</label>
                  <input placeholder="e.g. Can fund first year" value={form.can_self_fund} onChange={e => update('can_self_fund', e.target.value)} className="input-field w-full" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'scholarship_needed', label: 'I need scholarship funding' },
                  { key: 'part_time_work_ok', label: 'I am willing to work part-time while studying' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#00D26A] transition-colors">
                    <input type="checkbox" checked={form[item.key]} onChange={e => update(item.key, e.target.checked)} className="w-5 h-5 accent-[#00D26A]" />
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl">{error}</p>}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="btn-primary flex items-center gap-2 px-6 py-2.5">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={loading}
                className="btn-primary flex items-center gap-2 px-8 py-2.5">
                {loading ? (
                  <><Loader className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
                ) : (
                  <><Zap className="w-5 h-5" /> Get AI Evaluation</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvaluationResult({ result, onReset }) {
  const [tab, setTab] = useState('overview');
  const tabs = ['overview', 'universities', 'scholarships', 'roadmap'];

  const strengthColor = (s) => {
    if (s >= 80) return 'text-green-600 bg-green-50';
    if (s >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-green-900 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#00D26A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">Your AI Evaluation is Ready!</h1>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl mt-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-black text-2xl">{result.profile_score || 72}</span>
            <span className="text-gray-300">/ 100</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm capitalize transition-all border ${tab === t ? 'bg-[#00D26A] text-white border-[#00D26A] shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:border-green-200'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-5">
            {/* Summary */}
            {result.summary && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-3">Profile Summary</h3>
                <p className="text-gray-600 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {result.strengths?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /> Strengths</h3>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.weaknesses?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" /> Areas to Improve</h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'universities' && (
          <div className="space-y-4">
            {(result.recommended_universities || []).map((u, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{u.name}</h3>
                    <p className="text-sm text-gray-500">{u.country} • {u.program}</p>
                    {u.reason && <p className="text-sm text-gray-600 mt-2">{u.reason}</p>}
                    <div className="flex gap-2 mt-2">
                      {u.tuition && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-100">{u.tuition}</span>}
                      {u.ranking && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-100">Rank #{u.ranking}</span>}
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${strengthColor(u.match_score)}`}>
                    {u.match_score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'scholarships' && (
          <div className="space-y-4">
            {(result.recommended_scholarships || []).map((s, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                    <p className="text-sm text-gray-500">{s.country} • {s.amount}</p>
                    {s.reason && <p className="text-sm text-gray-600 mt-2">{s.reason}</p>}
                    {s.deadline && <p className="text-xs text-red-500 mt-1 font-medium">⏰ Deadline: {s.deadline}</p>}
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${strengthColor(s.eligibility_score)}`}>
                    {s.eligibility_score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'roadmap' && (
          <div className="space-y-4">
            {result.action_plan ? (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-4">Your Personalized Roadmap</h3>
                <div className="space-y-3">
                  {(Array.isArray(result.action_plan) ? result.action_plan : [result.action_plan]).map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 bg-[#00D26A] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{i + 1}</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{typeof step === 'string' ? step : JSON.stringify(step)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <p className="text-gray-500 text-center">No roadmap generated.</p>
              </div>
            )}
          </div>
        )}

        <button onClick={onReset} className="mt-6 btn-secondary flex items-center gap-2 mx-auto">
          ← Re-evaluate Profile
        </button>
      </div>
    </div>
  );
}
