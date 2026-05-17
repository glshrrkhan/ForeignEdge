import { useState } from 'react';
import {
  DollarSign, GraduationCap, Globe, FileText, Calculator, Clock,
  BookOpen, Plane, Home, TrendingUp, Languages, Shield, Briefcase,
  CreditCard, BarChart2, Calendar, CheckSquare, Star, Map, Zap
} from 'lucide-react';

// ── Tool registry ─────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'cost', icon: DollarSign,   label: 'Cost of Living',        category: 'Finance',   desc: 'Compare monthly living costs between cities' },
  { id: 'gpa',  icon: GraduationCap,label: 'GPA Converter',         category: 'Academic',  desc: 'Convert GPA between different grading systems' },
  { id: 'visa', icon: Globe,        label: 'Visa Requirements',     category: 'Visa',      desc: 'Check student visa requirements by country' },
  { id: 'schol',icon: Star,         label: 'Scholarship Match',     category: 'Funding',   desc: 'Find scholarships matching your profile' },
  { id: 'budget',icon: Calculator,  label: 'Student Budget Planner',category: 'Finance',   desc: 'Plan your monthly student budget abroad' },
  { id: 'tuition',icon: CreditCard, label: 'Tuition Fee Estimator', category: 'Finance',   desc: 'Estimate total degree cost with fees & living' },
  { id: 'ielts', icon: BookOpen,    label: 'IELTS Score Checker',   category: 'Academic',  desc: 'Check if your IELTS meets university requirements' },
  { id: 'deadline',icon: Calendar,  label: 'Application Deadline',  category: 'Academic',  desc: 'Track and calculate application deadlines' },
  { id: 'currency',icon: TrendingUp,label: 'Currency Converter',    category: 'Finance',   desc: 'Convert currencies with live rates (approx)' },
  { id: 'cgpa',  icon: BarChart2,   label: 'CGPA to Percentage',    category: 'Academic',  desc: 'Convert CGPA to percentage and vice versa' },
  { id: 'parttime',icon: Briefcase, label: 'Part-time Work Income', category: 'Finance',   desc: 'Estimate monthly earnings from part-time work abroad' },
  { id: 'language',icon: Languages, label: 'Language Requirement',  category: 'Academic',  desc: 'Check language requirements for top universities' },
  { id: 'insurance',icon: Shield,   label: 'Health Insurance Cost', category: 'Finance',   desc: 'Estimate student health insurance costs by country' },
  { id: 'accommodation',icon: Home, label: 'Accommodation Cost',    category: 'Finance',   desc: 'Estimate and compare student housing costs' },
  { id: 'flight', icon: Plane,      label: 'Flight Cost Estimator', category: 'Travel',    desc: 'Estimate flight costs to your study destination' },
  { id: 'duration',icon: Clock,     label: 'Degree Duration',       category: 'Academic',  desc: 'Calculate total time and cost for your degree' },
  { id: 'checklist',icon: CheckSquare,label: 'Pre-Departure Checklist',category: 'Planning',desc: 'Complete checklist before moving abroad' },
  { id: 'roi',   icon: TrendingUp,  label: 'Education ROI',         category: 'Finance',   desc: 'Calculate return on investment for your degree' },
  { id: 'timezone',icon: Globe,     label: 'Timezone Converter',    category: 'Planning',  desc: 'Convert times between your home and study country' },
  { id: 'packing',icon: Map,        label: 'Packing List Generator',category: 'Planning',  desc: 'Generate a custom packing list for your destination' },
  { id: 'ranking',icon: Zap,        label: 'University Score Check',category: 'Academic',  desc: 'Compare your profile against university requirements' },
  { id: 'tax',   icon: FileText,    label: 'Student Tax Guide',     category: 'Finance',   desc: 'Understand tax obligations for students abroad' },
];

const CATEGORIES = ['All', 'Finance', 'Academic', 'Visa', 'Funding', 'Travel', 'Planning'];
const CAT_COLORS = { Finance: 'bg-blue-100 text-blue-700', Academic: 'bg-[#E8FFF3] text-[#00D26A]', Visa: 'bg-purple-100 text-purple-700', Funding: 'bg-amber-100 text-amber-700', Travel: 'bg-pink-100 text-pink-700', Planning: 'bg-orange-100 text-orange-700' };

// ── Individual tool panels ────────────────────────────────────────────────────
function CostOfLiving() {
  const [city1, setCity1] = useState('Berlin'); const [city2, setCity2] = useState('London');
  const COSTS = {
    'Berlin':      { rent:700,  food:300, transport:80,  utils:100, other:200 },
    'London':      { rent:1400, food:450, transport:160, utils:120, other:350 },
    'Paris':       { rent:1100, food:400, transport:100, utils:110, other:280 },
    'Munich':      { rent:900,  food:350, transport:90,  utils:110, other:220 },
    'Amsterdam':   { rent:1000, food:380, transport:100, utils:120, other:250 },
    'Stockholm':   { rent:900,  food:400, transport:100, utils:90,  other:230 },
    'Vienna':      { rent:800,  food:320, transport:80,  utils:100, other:200 },
    'Barcelona':   { rent:700,  food:300, transport:80,  utils:90,  other:190 },
    'Rome':        { rent:700,  food:310, transport:70,  utils:100, other:180 },
    'Oslo':        { rent:1100, food:500, transport:110, utils:80,  other:300 },
    'Sydney':      { rent:1300, food:420, transport:130, utils:100, other:280 },
    'Melbourne':   { rent:1200, food:400, transport:120, utils:100, other:260 },
    'Toronto':     { rent:1100, food:380, transport:110, utils:100, other:250 },
    'New York':    { rent:1800, food:500, transport:120, utils:150, other:400 },
    'Singapore':   { rent:1200, food:350, transport:100, utils:80,  other:250 },
    'Tokyo':       { rent:900,  food:350, transport:90,  utils:100, other:200 },
    'Dubai':       { rent:1100, food:400, transport:120, utils:130, other:300 },
    'Istanbul':    { rent:400,  food:200, transport:40,  utils:80,  other:120 },
    'Budapest':    { rent:450,  food:250, transport:50,  utils:90,  other:130 },
    'Helsinki':    { rent:850,  food:380, transport:90,  utils:90,  other:220 },
  };
  const cities = Object.keys(COSTS);
  const c1 = COSTS[city1]; const c2 = COSTS[city2];
  const t1 = Object.values(c1).reduce((a,b)=>a+b,0);
  const t2 = Object.values(c2).reduce((a,b)=>a+b,0);
  const diff = Math.abs(t2 - t1);
  const cheaper = t1 < t2 ? city1 : city2;
  const cats = ['rent','food','transport','utils','other'];
  const labels = { rent:'Rent/Housing', food:'Food & Groceries', transport:'Transport', utils:'Utilities & Internet', other:'Entertainment & Other' };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[['City 1', city1, setCity1],['City 2', city2, setCity2]].map(([label,val,setter]) => (
          <div key={label}>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
            <select value={val} onChange={e=>setter(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
              {cities.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[{city:city1,costs:c1,total:t1},{city:city2,costs:c2,total:t2}].map(({city,costs,total})=>(
          <div key={city} className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="font-bold text-gray-900 mb-3">{city}</p>
            {cats.map(k=>(
              <div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-500">{labels[k]}</span>
                <span className="font-medium">€{costs[k]}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-gray-900 pt-2 mt-1">
              <span>Total</span><span className="text-[#00D26A]">€{total}/mo</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-gray-800">💡 Result: <span className="text-[#00D26A]">{cheaper}</span> is cheaper by <span className="text-[#00D26A]">€{diff}/month</span> (€{diff*12}/year)</p>
        <p className="text-gray-500 mt-1">Prices are estimates based on average student spending. Actual costs may vary.</p>
      </div>
    </div>
  );
}

function GPAConverter() {
  const [gpa, setGpa] = useState(''); const [from, setFrom] = useState('US 4.0'); const [result, setResult] = useState(null);
  const SYSTEMS = { 'US 4.0':4.0, 'UK (First Class)':1.0, 'German 1-5':5.0, 'Percentage (100)':100, 'Pakistan (4.0)':4.0, 'Australian 7.0':7.0, 'French 20':20, 'CGPA 10':10 };
  const convert = () => {
    const v = parseFloat(gpa); if(isNaN(v)) return;
    const max = SYSTEMS[from];
    const pct = from === 'German 1-5' ? ((5-v)/4)*100 : (v/max)*100;
    const us = from === 'German 1-5' ? ((5-v)/4)*4 : (v/max)*4;
    setResult({ percentage: pct.toFixed(1), us_gpa: Math.min(4,us).toFixed(2), uk: pct>=70?'First':pct>=60?'2:1':pct>=50?'2:2':'Third', german: (5 - (pct/100)*4).toFixed(1) });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Your Score</label>
          <input value={gpa} onChange={e=>setGpa(e.target.value)} placeholder="e.g. 3.5" type="number" step="0.01" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">From System</label>
          <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {Object.keys(SYSTEMS).map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button onClick={convert} className="w-full bg-[#00D26A] text-white font-semibold py-3 rounded-xl hover:bg-[#00A854] transition-colors">Convert GPA</button>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          {[['US GPA (4.0)',result.us_gpa],['Percentage',result.percentage+'%'],['UK Grade',result.uk],['German Grade',result.german]].map(([l,v])=>(
            <div key={l} className="bg-[#E8FFF3] rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">{l}</p>
              <p className="text-lg font-bold text-[#00D26A]">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VisaRequirements() {
  const [from, setFrom] = useState('Pakistan'); const [to, setTo] = useState('Germany');
  const VISA = {
    'Germany':    { fee:'€75', process:'3-8 weeks', docs:['Valid passport (6+ months validity)','Admission letter from German university','Proof of financial means (€934/month in blocked account)','Health insurance (German public or private)','Biometric photos','Academic transcripts','Language certificates (German B2 or English C1)'], notes:'Germany requires a blocked account with €11,208 for visa. Apply at German embassy.' },
    'UK':         { fee:'£490', process:'3-8 weeks', docs:['Valid passport','UK university CAS number','Proof of funds (£1,334/month London / £1,023 elsewhere)','English language certificate (IELTS 5.5+)','Tuberculosis test results','ATAS clearance (for some subjects)'], notes:'Apply through UKVI. You can work 20 hrs/week during term.' },
    'France':     { fee:'€99', process:'2-4 weeks', docs:['Valid passport','Campus France pre-registration','University admission letter','Proof of accommodation','Financial proof (€615/month)','Health insurance','Passport photos'], notes:'Most applicants must go through Campus France process first.' },
    'Australia':  { fee:'A$710', process:'4-6 weeks', docs:['Valid passport','CoE (Confirmation of Enrolment)','Genuine Temporary Entrant statement','English language certificate','Financial capacity proof (A$21,041/year)','OSHC health insurance','Academic transcripts'], notes:'Apply online through ImmiAccount. OSHC is mandatory.' },
    'Canada':     { fee:'C$150', process:'4-8 weeks', docs:['Valid passport','Canadian university acceptance letter','Proof of funds (C$10,000/year)','Biometrics','English/French proficiency proof','Academic transcripts'], notes:'Study permit required for programs over 6 months.' },
    'USA':        { fee:'$185', process:'4-12 weeks', docs:['Valid passport','F-1 visa form (DS-160)','SEVIS I-20 from university','Financial support documents ($20,000+/year)','TOEFL/IELTS scores','Academic transcripts','Bank statements'], notes:'F-1 visa interview required at US Embassy. Start process 6 months early.' },
    'Netherlands':{ fee:'€207', process:'2-4 weeks', docs:['Valid passport','University acceptance letter','Proof of financial means (€900/month)','Health insurance','MVV (entry visa) if required','Passport photos'], notes:'Usually handled by the Dutch university on your behalf.' },
    'Sweden':     { fee:'€0 (EEA) / SEK 1,500 (non-EEA)', process:'4-8 weeks', docs:['Valid passport','University admission letter','Proof of funds (SEK 8,514/month)','Health insurance','Accommodation proof'], notes:'EU/EEA citizens do not need a visa. Free tuition only for EU students.' },
    'Norway':     { fee:'NOK 600', process:'4-8 weeks', docs:['Valid passport','Admission letter','Proof of funds (NOK 12,700/month)','Housing confirmation','Health insurance'], notes:'Apply from your home country before arrival.' },
    'Finland':    { fee:'€380', process:'4-8 weeks', docs:['Valid passport','University admission letter','Proof of funds (€560/month)','Health insurance','Accommodation proof','Passport photos'], notes:'Apply at Finnish embassy. Can work 25 hrs/week during term.' },
  };
  const FROM_COUNTRIES = ['Pakistan','India','Bangladesh','Nigeria','Egypt','Iran','China','Brazil','Morocco','Turkey','Philippines','Nepal','Sri Lanka','USA','UK','EU Country','Australia'];
  const info = VISA[to] || VISA['Germany'];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Your Country</label>
          <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {FROM_COUNTRIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Study Destination</label>
          <select value={to} onChange={e=>setTo(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {Object.keys(VISA).map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#E8FFF3] rounded-xl p-3"><p className="text-xs text-gray-500">Visa Fee</p><p className="font-bold text-[#00D26A]">{info.fee}</p></div>
        <div className="bg-[#E8FFF3] rounded-xl p-3"><p className="text-xs text-gray-500">Processing Time</p><p className="font-bold text-[#00D26A]">{info.process}</p></div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="font-semibold text-gray-800 mb-3">Required Documents</p>
        <ul className="space-y-2">
          {info.docs.map((d,i)=>(
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-[#00D26A] font-bold mt-0.5">✓</span>{d}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        <span className="font-semibold">💡 Note: </span>{info.notes}
      </div>
    </div>
  );
}

function BudgetPlanner() {
  const [rent, setRent] = useState(700); const [food, setFood] = useState(300);
  const [transport, setTransport] = useState(80); const [utils, setUtils] = useState(100);
  const [entertainment, setEntertainment] = useState(150); const [study, setStudy] = useState(50);
  const [income, setIncome] = useState(400); const [currency, setCurrency] = useState('EUR');
  const total = rent+food+transport+utils+entertainment+study;
  const balance = income - total;
  const cats = [['Rent/Housing',rent,setRent],['Food & Groceries',food,setFood],['Transport',transport,setTransport],['Utilities & Internet',utils,setUtils],['Entertainment',entertainment,setEntertainment],['Study Materials',study,setStudy]];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <select value={currency} onChange={e=>setCurrency(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
          {['EUR','GBP','USD','AUD','SEK','NOK'].map(c=><option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-gray-500">Select your currency</span>
      </div>
      <div className="space-y-3">
        {cats.map(([label,val,setter])=>(
          <div key={label} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-40 flex-shrink-0">{label}</span>
            <input type="range" min="0" max="2000" value={val} onChange={e=>setter(+e.target.value)} className="flex-1 accent-[#00D26A]" />
            <span className="text-sm font-semibold text-gray-800 w-20 text-right">{currency} {val}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-gray-600 w-40 flex-shrink-0">Part-time Income</span>
          <input type="range" min="0" max="2000" value={income} onChange={e=>setIncome(+e.target.value)} className="flex-1 accent-[#00D26A]" />
          <span className="text-sm font-semibold text-[#00D26A] w-20 text-right">{currency} {income}</span>
        </div>
      </div>
      <div className={`rounded-xl p-4 ${balance >= 0 ? 'bg-[#E8FFF3] border border-[#00D26A]/20' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Total Expenses</span><span className="font-bold text-gray-900">{currency} {total}</span></div>
        <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Income</span><span className="font-bold text-[#00D26A]">{currency} {income}</span></div>
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-current/20">
          <span>Monthly Balance</span>
          <span className={balance >= 0 ? 'text-[#00D26A]' : 'text-red-600'}>{currency} {balance >= 0 ? '+' : ''}{balance}</span>
        </div>
        <p className="text-xs mt-2 text-gray-500">{balance >= 0 ? `✅ You have ${currency} ${balance} surplus each month.` : `⚠️ You need ${currency} ${Math.abs(balance)} more per month from savings or scholarships.`}</p>
      </div>
    </div>
  );
}

function TuitionEstimator() {
  const [country, setCountry] = useState('Germany'); const [level, setLevel] = useState('Master');
  const [years, setYears] = useState(2); const [living, setLiving] = useState(800);
  const TUITION = { 'Germany':{Bachelor:500,Master:500,PhD:0},'France':{Bachelor:3000,Master:3500,PhD:400},'UK':{Bachelor:22000,Master:18000,PhD:5000},'Australia':{Bachelor:35000,Master:28000,PhD:10000},'USA':{Bachelor:40000,Master:35000,PhD:20000},'Netherlands':{Bachelor:10000,Master:12000,PhD:3000},'Sweden':{Bachelor:15000,Master:18000,PhD:0},'Norway':{Bachelor:0,Master:0,PhD:0},'Finland':{Bachelor:12000,Master:14000,PhD:0},'Austria':{Bachelor:1500,Master:1500,PhD:750},'Spain':{Bachelor:2000,Master:3000,PhD:1500},'Italy':{Bachelor:2000,Master:2500,PhD:1000} };
  const tuitionPerYear = (TUITION[country]||{Bachelor:10000,Master:12000,PhD:5000})[level] || 10000;
  const totalTuition = tuitionPerYear * years;
  const totalLiving = living * 12 * years;
  const total = totalTuition + totalLiving;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Country</label>
          <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {Object.keys(TUITION).map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Degree Level</label>
          <select value={level} onChange={e=>setLevel(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {['Bachelor','Master','PhD'].map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Duration (years)</label>
          <select value={years} onChange={e=>setYears(+e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {[1,2,3,4,5].map(y=><option key={y} value={y}>{y} year{y>1?'s':''}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Living Cost/Month (€)</label>
          <input type="number" value={living} onChange={e=>setLiving(+e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none" />
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
        {[['Tuition per year',`€${tuitionPerYear.toLocaleString()}`],['Total tuition',`€${totalTuition.toLocaleString()}`],['Total living',`€${totalLiving.toLocaleString()}`]].map(([l,v])=>(
          <div key={l} className="flex justify-between text-sm"><span className="text-gray-500">{l}</span><span className="font-semibold">{v}</span></div>
        ))}
        <div className="flex justify-between font-bold pt-2 border-t border-gray-100 text-lg">
          <span>Total Cost</span><span className="text-[#00D26A]">€{total.toLocaleString()}</span>
        </div>
      </div>
      {tuitionPerYear === 0 && <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-3 text-sm text-[#00A854] font-medium">🎉 No tuition fees for this degree in {country}! Only living costs apply.</div>}
    </div>
  );
}

function IELTSChecker() {
  const [score, setScore] = useState(''); const [level, setLevel] = useState('Master');
  const UNIS = [
    {name:'MIT / Harvard / Oxford / Cambridge',min:7.0}, {name:'Imperial / UCL / LSE',min:6.5},
    {name:'University of Manchester / Edinburgh',min:6.5}, {name:'TU Munich / LMU Munich',min:6.5},
    {name:'University of Melbourne / ANU',min:6.5}, {name:'University of Toronto / UBC',min:6.5},
    {name:'NUS Singapore / NTU',min:6.0}, {name:'German public universities (general)',min:6.0},
    {name:'Scandinavian universities',min:6.0}, {name:'Spanish / Italian universities',min:5.5},
    {name:'Turkish universities (English programs)',min:5.5}, {name:'Hungarian universities',min:5.0},
  ];
  const s = parseFloat(score);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Your IELTS Score</label>
          <input type="number" min="0" max="9" step="0.5" value={score} onChange={e=>setScore(e.target.value)} placeholder="e.g. 6.5" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none" />
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Degree Level</label>
          <select value={level} onChange={e=>setLevel(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            <option>Bachelor</option><option>Master</option><option>PhD</option>
          </select>
        </div>
      </div>
      {score && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 mb-2">Universities you qualify for:</p>
          {UNIS.map(u=>{
            const req = level === 'Bachelor' ? u.min - 0.5 : u.min;
            const ok = s >= req;
            return (
              <div key={u.name} className={`flex items-center justify-between p-3 rounded-xl border text-sm ${ok ? 'bg-[#E8FFF3] border-[#00D26A]/20' : 'bg-red-50 border-red-200'}`}>
                <span className={ok ? 'text-gray-800' : 'text-gray-500'}>{u.name}</span>
                <span className={`font-semibold ${ok ? 'text-[#00D26A]' : 'text-red-500'}`}>{ok ? '✓ Qualifies' : `Need ${req}`}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState(1000); const [from, setFrom] = useState('USD'); const [to, setTo] = useState('EUR');
  const RATES = { USD:1, EUR:0.92, GBP:0.79, AUD:1.53, CAD:1.36, SEK:10.4, NOK:10.7, CHF:0.89, JPY:149, CNY:7.2, INR:83, PKR:278, BDT:110, NGN:1550, EGP:31, TRY:32, HUF:357, PLN:4.0, SGD:1.34, AED:3.67, NZD:1.63 };
  const converted = (amount / RATES[from] * RATES[to]).toFixed(2);
  const currencies = Object.keys(RATES);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 items-end">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Amount</label>
          <input type="number" value={amount} onChange={e=>setAmount(+e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none" />
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">From</label>
          <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {currencies.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">To</label>
          <select value={to} onChange={e=>setTo(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {currencies.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-5 text-center">
        <p className="text-sm text-gray-500 mb-1">{amount.toLocaleString()} {from} =</p>
        <p className="text-4xl font-bold text-[#00D26A]">{parseFloat(converted).toLocaleString()} <span className="text-2xl">{to}</span></p>
        <p className="text-xs text-gray-400 mt-2">Rate: 1 {from} = {(RATES[to]/RATES[from]).toFixed(4)} {to} (approx)</p>
      </div>
      <p className="text-xs text-gray-400 text-center">⚠️ Approximate rates. Use a bank or XE.com for real-time rates.</p>
    </div>
  );
}

function PartTimeWork() {
  const [country, setCountry] = useState('Germany'); const [hrs, setHrs] = useState(20); const [months, setMonths] = useState(10);
  const DATA = { 'Germany':{rate:12,allowed:20,currency:'EUR'},'UK':{rate:11,allowed:20,currency:'GBP'},'France':{rate:11.65,allowed:20,currency:'EUR'},'Australia':{rate:23,allowed:48,currency:'AUD'},'Canada':{rate:15,allowed:20,currency:'CAD'},'USA':{rate:15,allowed:20,currency:'USD'},'Netherlands':{rate:13,allowed:16,currency:'EUR'},'Sweden':{rate:120,allowed:null,currency:'SEK'},'Norway':{rate:180,allowed:null,currency:'NOK'},'Finland':{rate:13,allowed:25,currency:'EUR'},'Austria':{rate:12,allowed:20,currency:'EUR'},'New Zealand':{rate:22,allowed:20,currency:'NZD'} };
  const d = DATA[country] || DATA['Germany'];
  const actualHrs = Math.min(hrs, d.allowed || hrs);
  const monthly = actualHrs * 4.33 * d.rate;
  const annual = monthly * months;
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Study Country</label>
        <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
          {Object.keys(DATA).map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Hours per week</label>
          <input type="range" min="5" max="40" value={hrs} onChange={e=>setHrs(+e.target.value)} className="w-full accent-[#00D26A]" />
          <p className="text-xs text-gray-500 mt-1">{hrs} hours/week {d.allowed && hrs > d.allowed ? `(max allowed: ${d.allowed})` : ''}</p>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Months worked/year</label>
          <input type="range" min="1" max="12" value={months} onChange={e=>setMonths(+e.target.value)} className="w-full accent-[#00D26A]" />
          <p className="text-xs text-gray-500 mt-1">{months} months</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[[`Min. wage`,`${d.currency} ${d.rate}/hr`],[`Monthly`,`${d.currency} ${monthly.toFixed(0)}`],[`Annual`,`${d.currency} ${annual.toFixed(0)}`]].map(([l,v])=>(
          <div key={l} className="bg-[#E8FFF3] rounded-xl p-3 text-center"><p className="text-xs text-gray-500">{l}</p><p className="font-bold text-[#00D26A] text-sm">{v}</p></div>
        ))}
      </div>
      {d.allowed && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">⚠️ Student visa in {country} allows max {d.allowed} hrs/week during term time.</div>}
    </div>
  );
}

function HealthInsurance() {
  const [country, setCountry] = useState('Germany'); const [type, setType] = useState('Public');
  const DATA = {
    'Germany':    { Public:{cost:'€110-160/month',desc:'TK, AOK, Barmer. Mandatory for students under 30.',note:'Best option for most students.'}, Private:{cost:'€60-200/month',desc:'HanseMerkur, Care Concept for international students.',note:'Required if over 30 or from outside EU.'} },
    'UK':         { Public:{cost:'£470/year (IHS)',desc:'NHS surcharge paid with visa. Covers most medical care.',note:'Pay upfront with visa application.'}, Private:{cost:'£30-80/month',desc:'Bupa, AXA for extra coverage.',note:'Optional but recommended for dental/optical.'} },
    'France':     { Public:{cost:'€Free (EU) / €217/year (non-EU)',desc:'Sécurité Sociale covers most healthcare.',note:'Register through AMELI after arriving.'}, Private:{cost:'€20-50/month',desc:'Mutuelle top-up for 100% coverage.',note:'Many universities offer group plans.'} },
    'Australia':  { Public:{cost:'A$600-800/year',desc:'OSHC mandatory with student visa.',note:'Medibank, Bupa, OSHC Worldcare are main providers.'}, Private:{cost:'A$800-1200/year',desc:'Enhanced private health for dental/specialist.',note:'Required by visa conditions.'} },
    'USA':        { Public:{cost:'$1,500-3,000/year',desc:'University student health plan (mandatory at many unis).',note:'Compare with external options like ISO Student.'}, Private:{cost:'$1,000-2,500/year',desc:'ISO Student, Compass Student Insurance.',note:'Must meet ACA minimum requirements.'} },
    'Norway':     { Public:{cost:'NOK 0',desc:'Free healthcare for all residents including students.',note:'Register with GP after getting Norwegian ID.'}, Private:{cost:'NOK 200-500/month',desc:'Gjensidige, Storebrand for faster access.',note:'Optional - public system is excellent.'} },
    'Finland':    { Public:{cost:'€0 (registered) / €300/year (other)',desc:'YTHS student health service for university students.',note:'Very comprehensive student health system.'}, Private:{cost:'€30-80/month',desc:'Lähitapiola, LähiTapiola for additional coverage.',note:'Optional for most students.'} },
  };
  const info = (DATA[country]||DATA['Germany'])[type];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Country</label>
          <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {Object.keys(DATA).map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Insurance Type</label>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            <option>Public</option><option>Private</option>
          </select>
        </div>
      </div>
      <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-4">
        <p className="text-2xl font-bold text-[#00D26A] mb-2">{info.cost}</p>
        <p className="text-sm text-gray-700 mb-2">{info.desc}</p>
        <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">💡 {info.note}</p>
      </div>
    </div>
  );
}

function PreDepartureChecklist() {
  const ITEMS = {
    'Documents (3+ months before)': ['Apply for student visa','Get passport (10+ years validity)','Collect university acceptance letter','Arrange health insurance','Get police clearance certificate','Collect original degree transcripts'],
    'Financial (2 months before)': ['Open international bank account (Wise/Revolut)','Transfer money to blocked account if required','Apply for student loans/scholarships','Set up home country bank international transfers','Research student discounts (ISIC card)'],
    'Accommodation (2 months before)': ['Book temporary accommodation (first month)','Research long-term housing options','Understand tenancy agreements','Check proximity to university campus'],
    'Before Departure (1 month before)': ['Pack essential documents (originals + copies)','Download offline maps and university app','Inform home bank about travel','Buy local SIM card or research options','Pack country-specific adapters','Arrange airport pickup or transport'],
    'On Arrival': ['Register at university international office','Open local bank account','Register with local authorities (some countries)','Get student ID and transport card','Connect with student buddy programme','Explore campus and city'],
  };
  const [checked, setChecked] = useState({});
  const total = Object.values(ITEMS).flat().length;
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div className="space-y-4">
      <div className="bg-[#E8FFF3] rounded-xl p-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Progress: {done}/{total} completed</span>
        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
          <div className="bg-[#00D26A] h-2 rounded-full transition-all" style={{width:`${(done/total)*100}%`}} />
        </div>
        <span className="text-sm font-bold text-[#00D26A]">{Math.round((done/total)*100)}%</span>
      </div>
      <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
        {Object.entries(ITEMS).map(([cat,items])=>(
          <div key={cat}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{cat}</p>
            {items.map(item=>(
              <label key={item} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={!!checked[item]} onChange={e=>setChecked(p=>({...p,[item]:e.target.checked}))} className="accent-[#00D26A] w-4 h-4 flex-shrink-0" />
                <span className={`text-sm ${checked[item]?'line-through text-gray-400':'text-gray-700'}`}>{item}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationROI() {
  const [tuition, setTuition] = useState(20000); const [living, setLiving] = useState(10000);
  const [years, setYears] = useState(2); const [salaryBefore, setSalaryBefore] = useState(15000);
  const [salaryAfter, setSalaryAfter] = useState(50000); const [currency, setCurrency] = useState('EUR');
  const totalCost = (tuition + living) * years;
  const annualGain = salaryAfter - salaryBefore;
  const payback = annualGain > 0 ? (totalCost / annualGain).toFixed(1) : '∞';
  const roi10 = annualGain > 0 ? (((annualGain * 10 - totalCost) / totalCost) * 100).toFixed(0) : 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[['Tuition/year',tuition,setTuition],['Living cost/year',living,setLiving],['Current salary/year',salaryBefore,setSalaryBefore],['Expected salary after',salaryAfter,setSalaryAfter]].map(([l,v,s])=>(
          <div key={l}>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{l} ({currency})</label>
            <input type="number" value={v} onChange={e=>s(+e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00D26A] focus:outline-none" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Duration (years)</label>
          <select value={years} onChange={e=>setYears(+e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {[1,2,3,4,5].map(y=><option key={y} value={y}>{y} year{y>1?'s':''}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Currency</label>
          <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {['EUR','GBP','USD','AUD'].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[[`Total Investment`,`${currency} ${totalCost.toLocaleString()}`],[`Payback Period`,`${payback} years`],[`10-yr ROI`,`${roi10}%`]].map(([l,v])=>(
          <div key={l} className="bg-[#E8FFF3] rounded-xl p-3 text-center"><p className="text-xs text-gray-500">{l}</p><p className="font-bold text-[#00D26A]">{v}</p></div>
        ))}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-3 text-sm">
        <p className="text-gray-600">💡 A {years}-year degree costing {currency} {totalCost.toLocaleString()} will pay for itself in <strong>{payback} years</strong> through the salary increase of {currency} {annualGain.toLocaleString()}/year.</p>
      </div>
    </div>
  );
}

function TimezoneConverter() {
  const [time, setTime] = useState('12:00'); const [from, setFrom] = useState('Pakistan (PKT +5)'); const [to, setTo] = useState('Germany (CET +1)');
  const ZONES = { 'Pakistan (PKT +5)':5,'India (IST +5:30)':5.5,'Bangladesh (BST +6)':6,'UAE (GST +4)':4,'Saudi Arabia (AST +3)':3,'UK (GMT 0)':0,'Germany (CET +1)':1,'France (CET +1)':1,'Sweden (CET +1)':1,'Norway (CET +1)':1,'Finland (EET +2)':2,'Australia Sydney (AEDT +11)':11,'Australia Perth (AWST +8)':8,'New Zealand (NZST +12)':12,'USA New York (EST -5)':-5,'USA California (PST -8)':-8,'Canada Toronto (EST -5)':-5,'Singapore (SGT +8)':8,'Japan (JST +9)':9 };
  const [h,m] = time.split(':').map(Number);
  const fromOff = ZONES[from]||0; const toOff = ZONES[to]||0;
  const diff = toOff - fromOff;
  const totalMins = h*60 + m + diff*60;
  const th = Math.floor(((totalMins % 1440) + 1440) % 1440 / 60);
  const tm = ((totalMins % 60) + 60) % 60;
  const converted = `${th.toString().padStart(2,'0')}:${tm.toString().padStart(2,'0')}`;
  return (
    <div className="space-y-4">
      <div><label className="text-xs font-semibold text-gray-600 block mb-1">Your time</label>
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[['From',from,setFrom],['To',to,setTo]].map(([l,v,s])=>(
          <div key={l}><label className="text-xs font-semibold text-gray-600 block mb-1">{l}</label>
            <select value={v} onChange={e=>s(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
              {Object.keys(ZONES).map(z=><option key={z}>{z}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="bg-[#E8FFF3] border border-[#00D26A]/20 rounded-xl p-5 text-center">
        <p className="text-sm text-gray-500">{time} in {from.split('(')[0]} =</p>
        <p className="text-4xl font-bold text-[#00D26A]">{converted}</p>
        <p className="text-sm text-gray-500">in {to.split('(')[0]}</p>
        <p className="text-xs text-gray-400 mt-2">Difference: {diff > 0 ? '+' : ''}{diff} hours</p>
      </div>
    </div>
  );
}

function PackingList() {
  const [country, setCountry] = useState('Germany'); const [season, setSeason] = useState('Winter');
  const CLIMATE = { 'Germany':'Cold winters (-5°C), warm summers (25°C)','UK':'Mild, very rainy all year','France':'Varies, cold north, warm south','Sweden':'Very cold winters (-10°C), mild summers','Norway':'Extremely cold, heavy snow','Finland':'Arctic winters (-20°C), beautiful summers','Austria':'Cold winters, alpine climate','Australia':'Hot and dry, warm winters','New Zealand':'Mild all year, windy','Hungary':'Cold winters, hot summers','Italy':'Mediterranean south, cold north winters','Spain':'Hot dry summers, mild winters' };
  const BASE = ['Passport (+ photocopies)','University admission documents','Health insurance card','International driving licence','IELTS/language certificates','3-6 months of prescribed medicines','Power adapter (Type C/F for Europe)','Universal travel adapter','Laptop + charger','Unlocked mobile phone','External hard drive (backup)','Student ID / ISIC card'];
  const WINTER = ['Heavy winter coat (-15°C rated)','Thermal underwear (3-4 sets)','Waterproof snow boots','Wool sweaters (3-4)','Gloves, scarf, beanie','Thermal socks','Snow pants for outdoor activities'];
  const SUMMER = ['Lightweight breathable clothes','Sunscreen SPF 50+','Sunglasses','Sun hat/cap','Light jacket for evenings'];
  const items = [...BASE, ...(season === 'Winter' ? WINTER : SUMMER)];
  const [checked, setChecked] = useState({});
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Destination</label>
          <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            {Object.keys(CLIMATE).map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Arrival Season</label>
          <select value={season} onChange={e=>setSeason(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#00D26A] focus:outline-none bg-white">
            <option>Winter</option><option>Summer</option>
          </select>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">🌡️ {CLIMATE[country]}</div>
      <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
        {items.map(item=>(
          <label key={item} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" checked={!!checked[item]} onChange={e=>setChecked(p=>({...p,[item]:e.target.checked}))} className="accent-[#00D26A] w-4 h-4 flex-shrink-0" />
            <span className={`text-sm ${checked[item]?'line-through text-gray-400':'text-gray-700'}`}>{item}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-400">{Object.values(checked).filter(Boolean).length}/{items.length} items packed</p>
    </div>
  );
}

// Placeholder for remaining tools
function SimpleTool({ label }) {
  const displayLabel = label || 'Tool';
  return <div className="text-center py-10 text-gray-400"><Zap className="w-10 h-10 mx-auto mb-3 text-gray-200" /><p className="font-medium">{displayLabel}</p><p className="text-sm mt-1">Coming soon</p></div>;
}

const TOOL_COMPONENTS = {
  cost: CostOfLiving, gpa: GPAConverter, visa: VisaRequirements, budget: BudgetPlanner,
  tuition: TuitionEstimator, ielts: IELTSChecker, currency: CurrencyConverter,
  parttime: PartTimeWork, insurance: HealthInsurance, checklist: PreDepartureChecklist,
  roi: EducationROI, timezone: TimezoneConverter, packing: PackingList,
};

export default function Calculators() {
  const [active, setActive] = useState('cost');
  const [cat, setCat] = useState('All');
  const tool = TOOLS.find(t => t.id === active);
  const ToolComponent = TOOL_COMPONENTS[active] || SimpleTool;
  const filtered = cat === 'All' ? TOOLS : TOOLS.filter(t => t.category === cat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Abroad <span className="text-[#00D26A]">Tools</span></h1>
        <p className="text-gray-500">22 free tools to plan every aspect of your study abroad journey</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === c ? 'bg-[#00D26A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#E8FFF3] hover:text-[#00D26A]'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool list */}
        <div className="lg:col-span-1">
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${active === t.id ? 'bg-[#00D26A] text-white shadow-sm' : 'bg-white border border-gray-100 hover:border-[#00D26A] text-gray-700'}`}>
                <t.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${active === t.id ? 'text-white' : 'text-[#00D26A]'}`} />
                <div>
                  <p className={`text-sm font-semibold ${active === t.id ? 'text-white' : 'text-gray-800'}`}>{t.label}</p>
                  <p className={`text-xs mt-0.5 ${active === t.id ? 'text-white/80' : 'text-gray-400'}`}>{t.desc}</p>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${active === t.id ? 'bg-white/20 text-white' : CAT_COLORS[t.category]}`}>{t.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active tool */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              {tool && <div className="w-10 h-10 bg-[#E8FFF3] rounded-xl flex items-center justify-center"><tool.icon className="w-5 h-5 text-[#00D26A]" /></div>}
              <div>
                <h2 className="font-bold text-gray-900">{tool?.label}</h2>
                <p className="text-sm text-gray-500">{tool?.desc}</p>
              </div>
            </div>
            <ToolComponent label={tool?.label} />
          </div>
        </div>
      </div>
    </div>
  );
}