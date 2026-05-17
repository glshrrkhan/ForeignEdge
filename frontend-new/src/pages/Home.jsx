import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { uniAPI } from '../utils/api';
import {
  GraduationCap, BookOpen, Home as HomeIcon, Utensils, Plane,
  Bus, ArrowRight, Globe, Users, Star,
  Search, MapPin, ChevronRight, Building2
} from 'lucide-react';

const features = [
  { icon: GraduationCap, title: 'World Universities', desc: 'Browse universities worldwide with real rankings, programs & requirements', href: '/universities', count: '10,000+' },
  { icon: BookOpen, title: 'Scholarships', desc: 'Fully-funded scholarships for Bachelor, Master & PhD globally', href: '/scholarships', count: '500+' },
  { icon: HomeIcon, title: 'Accommodation', desc: 'Student housing in every major study destination', href: '/accommodation', count: '2,000+' },
  { icon: Utensils, title: 'Halal Restaurants', desc: 'Halal food, local cuisine near universities worldwide', href: '/restaurants', count: '5,000+' },
  { icon: Plane, title: 'Airlines & Flights', desc: 'Compare flights and find student discounts', href: '/airlines', count: '100+ airlines' },
  { icon: Bus, title: 'Transport & Apps', desc: 'Essential apps for transport, jobs and finance abroad', href: '/transport', count: '200+ apps' },
];

const stats = [
  { icon: Building2, value: '10,000+', label: 'Universities Listed' },
  { icon: BookOpen, value: '500+', label: 'Active Scholarships' },
  { icon: Globe, value: '30+', label: 'Countries Covered' },
  { icon: Users, value: '50,000+', label: 'Students Helped' },
];

const topCountries = [
  { name: 'United States', flag: '🇺🇸', unis: 4500 },
  { name: 'United Kingdom', flag: '🇬🇧', unis: 160 },
  { name: 'Germany', flag: '🇩🇪', unis: 400 },
  { name: 'Canada', flag: '🇨🇦', unis: 100 },
  { name: 'Australia', flag: '🇦🇺', unis: 43 },
  { name: 'Netherlands', flag: '🇳🇱', unis: 85 },
  { name: 'Singapore', flag: '🇸🇬', unis: 6 },
  { name: 'South Korea', flag: '🇰🇷', unis: 300 },
  { name: 'Turkey', flag: '🇹🇷', unis: 207 },
  { name: 'Malaysia', flag: '🇲🇾', unis: 20 },
  { name: 'Sweden', flag: '🇸🇪', unis: 35 },
  { name: 'Switzerland', flag: '🇨🇭', unis: 12 },
];

export default function Home() {
  const [recentUnis, setRecentUnis] = useState([]);

  useEffect(() => {
    uniAPI.getAll({ sort: 'ranking_qs', per_page: 4, page: 1 })
      .then(r => setRecentUnis(r.data.universities || []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#E8FFF3] to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8FFF3] border border-[#00D26A]/30 text-[#00D26A] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4" /> Trusted by 50,000+ students worldwide
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            Your Study Abroad<br />
            <span className="text-[#00D26A]">Journey Starts Here</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Discover universities, scholarships, accommodation and everything you need to study abroad — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/universities"
              className="bg-[#00D26A] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#00A854] transition-colors flex items-center gap-2 justify-center">
              <Search className="w-5 h-5" /> Explore Universities
            </Link>
            <Link to="/profile/evaluation"
              className="border-2 border-[#00D26A] text-[#00D26A] font-semibold px-7 py-3.5 rounded-xl hover:bg-[#E8FFF3] transition-colors flex items-center gap-2 justify-center">
              AI Profile Evaluation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <Icon className="w-6 h-6 text-[#00D26A] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything You Need</h2>
            <p className="text-gray-500">One platform for your entire study abroad journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, href, count }) => (
              <Link key={href} to={href}
                className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#00D26A] hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-[#E8FFF3] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00D26A] transition-colors">
                  <Icon className="w-6 h-6 text-[#00D26A] group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xs font-semibold text-[#00D26A] bg-[#E8FFF3] px-2.5 py-1 rounded-full">{count}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00D26A] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Countries */}
      <section className="py-16 px-4 bg-[#E8FFF3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Study Destinations</h2>
          <p className="text-gray-500 text-center mb-8">Choose from 30+ countries worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {topCountries.map(({ name, flag, unis }) => (
              <Link key={name} to={`/universities?country=${encodeURIComponent(name)}`}
                className="bg-white rounded-xl p-4 text-center hover:border-[#00D26A] border border-transparent hover:shadow-md transition-all group">
                <div className="text-3xl mb-2">{flag}</div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#00D26A] transition-colors">{name}</p>
                <p className="text-xs text-gray-400">{unis.toLocaleString()} unis</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities Preview */}
      {recentUnis.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Top Universities</h2>
                <p className="text-gray-500 mt-1">Highest ranked by QS World Rankings</p>
              </div>
              <Link to="/universities" className="text-[#00D26A] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentUnis.map(u => (
                <Link key={u.id} to={`/universities/${u.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-[#00D26A] hover:shadow-lg transition-all p-4">
                  <div className="h-28 bg-[#E8FFF3] rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    {u.image ? (
                      <img src={u.image} alt={u.name} className="w-full h-full object-cover rounded-xl" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                    ) : null}
                    <GraduationCap className={`w-10 h-10 text-[#00D26A]/40 ${u.image ? 'hidden' : 'block'}`} />
                  </div>
                  {u.ranking_qs && (
                    <span className="text-xs font-bold text-[#00D26A] bg-[#E8FFF3] px-2 py-0.5 rounded-full">#{u.ranking_qs} QS</span>
                  )}
                  <h3 className="font-bold text-gray-900 text-sm mt-1.5 leading-snug group-hover:text-[#00D26A] transition-colors line-clamp-2">{u.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{u.city || u.country}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI CTA */}
      <section className="py-16 px-4 bg-[#E8FFF3]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#00D26A] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Get AI-Powered Profile Evaluation</h2>
          <p className="text-gray-600 mb-6">
            Our AI analyzes your academic profile and recommends the best universities and scholarships for you — completely personalized.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="bg-[#00D26A] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#00A854] transition-colors">
              Get Started Free
            </Link>
            <Link to="/calculators" className="border-2 border-[#00D26A] text-[#00D26A] font-semibold px-7 py-3 rounded-xl hover:bg-white transition-colors">
              Try Calculators
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}