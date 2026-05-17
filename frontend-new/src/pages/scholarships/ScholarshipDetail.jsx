import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { scholarshipAPI } from '../../utils/api';
import { ArrowLeft, Globe, DollarSign, Calendar, CheckCircle, ExternalLink, BookOpen, Users, Star } from 'lucide-react';

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scholarshipAPI.getOne(id).then(r => setS(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><div className="h-64 skeleton rounded-3xl"/></div>;
  if (!s) return <div className="text-center py-20 text-gray-500">Scholarship not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/scholarships" className="flex items-center gap-2 text-gray-500 hover:text-[#00D26A] text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Scholarships
      </Link>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-6 text-white">
        <div className="flex flex-wrap gap-2 mb-4">
          {s.fully_funded && <span className="badge bg-[#00D26A]/20 text-[#00D26A]">⭐ Fully Funded</span>}
          {s.type && <span className="badge bg-white/10 text-white">{s.type}</span>}
          {s.degree_level?.split(',').map(d => <span key={d} className="badge bg-blue-500/20 text-blue-300">{d.trim()}</span>)}
        </div>
        <h1 className="text-3xl font-bold mb-2">{s.name}</h1>
        <p className="text-gray-300">{s.provider}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-3">About This Scholarship</h2>
            <p className="text-gray-600 leading-relaxed">{s.description}</p>
          </div>

          {s.eligibility && (
            <div className="card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-[#00D26A]" />Eligibility</h2>
              <p className="text-gray-600 leading-relaxed">{s.eligibility}</p>
            </div>
          )}

          {s.coverage && (
            <div className="card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#00D26A]" />What's Covered</h2>
              <div className="flex flex-wrap gap-2">
                {s.coverage.split(',').map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-[#E8FFF3] text-[#00A854] px-3 py-1.5 rounded-full text-sm font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />{item.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Quick Details</h3>
            <div className="space-y-3">
              {[
                { icon: Globe, label: 'Host Country', value: s.host_country },
                { icon: Globe, label: 'Open To', value: s.country || 'All countries' },
                { icon: DollarSign, label: 'Amount', value: s.amount },
                { icon: Calendar, label: 'Deadline', value: s.deadline },
                { icon: BookOpen, label: 'Degree', value: s.degree_level },
                { icon: Star, label: 'Field', value: s.field_of_study || 'All fields' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <item.icon className="w-4 h-4 text-[#00D26A] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {s.website && (
            <a href={s.website} target="_blank" rel="noopener" className="btn-primary w-full text-center block py-3 flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Apply Now
            </a>
          )}

          <Link to="/profile/evaluate" className="btn-secondary w-full text-center block py-3 text-sm">
            Check My Eligibility (AI)
          </Link>
        </div>
      </div>
    </div>
  );
}
