import React, { useState } from 'react';
import { Search, Link as LinkIcon, Mail, Phone, AlertCircle, CheckCircle2, ChevronDown, Activity, Users } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  const [jsonVisible, setJsonVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eVal = email.trim();
    const pVal = phoneNumber.trim();

    if (!eVal && !pVal) {
      setErrorMsg("Please provide at least an email or phone number.");
      setErrorVisible(true);
      return;
    }

    setErrorVisible(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: eVal || null,
          phoneNumber: pVal || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.contact);
      } else {
        setErrorMsg(data.error || "An error occurred fetching the identity.");
        setErrorVisible(true);
      }
    } catch (err) {
      setErrorMsg("Failed to connect to the Bitespeed Identity service. Ensure the backend is running.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const PrimaryList = ({ items, icon: Icon }) => {
    if (!items || items.length === 0) return <li className="text-gray-400 italic flex items-center gap-2"><Icon className="w-4 h-4 opacity-50" /> None Provided</li>;
    return items.map((item, idx) => (
      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors rounded px-2 -mx-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="font-medium">{item}</span>
        {idx === 0 && (
          <span className="ml-auto bg-emerald-100/80 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
            PRIMARY
          </span>
        )}
      </li>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 mb-2">
            <Activity className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Reconciliation</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Instantly consolidate fragmented user touchpoints into a unified customer profile.
          </p>
        </div>

        {/* Action Card */}
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/40 ring-1 ring-slate-200 mb-12 transform transition-all hover:shadow-2xl hover:shadow-indigo-100/50">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="w-4 h-4 text-indigo-500" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all peer placeholder:text-slate-400"
                  placeholder="e.g. mcfly@hillvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone className="w-4 h-4 text-indigo-500" />
                Phone Number
              </label>
              <div className="relative group">
                <input
                  type="text"
                  className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all peer placeholder:text-slate-400"
                  placeholder="e.g. 123456"
                  value={phoneNumber}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-auto pt-2 md:pt-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Identify
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Banner */}
          <div className={`mt-6 overflow-hidden transition-all duration-300 ${errorVisible ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-xl ring-1 ring-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          </div>
        </div>

        {/* Results Graph Visualization */}
        {result && (
          <div className="w-full animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-slate-300" />
              <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Consolidated Profile Graph
              </h2>
              <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-slate-300" />
            </div>

            <div className="flex flex-col items-center pb-20">

              {/* Core Primary Identity Node */}
              <div className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 w-full max-w-2xl transform transition-all hover:shadow-2xl hover:-translate-y-1 mx-4 z-20">

                {/* Status Badges */}
                <div className="absolute -top-4 inset-x-0 flex justify-center gap-2">
                  <span className="bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ROOT IDENTITY
                  </span>
                </div>

                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full ring-1 ring-slate-200 font-mono text-xs font-semibold text-slate-500">
                  ID: <span className="text-indigo-600">{result.primaryContactId}</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-6 mt-2">Unified Profile</h3>

                <div className="grid md:grid-cols-2 gap-8 relative mt-4">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-slate-100 hidden md:block" />

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-2">Registered Emails</h4>
                    <ul className="space-y-1">
                      <PrimaryList items={result.emails} icon={Mail} />
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-2">Connected Phones</h4>
                    <ul className="space-y-1">
                      <PrimaryList items={result.phoneNumbers} icon={Phone} />
                    </ul>
                  </div>
                </div>
              </div>

              {/* Linked Secondary Contact Sub-Trees */}
              {result.secondaryContactIds && result.secondaryContactIds.length > 0 && (
                <div className="relative w-full flex flex-col items-center mt-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>

                  {/* Flow Connector Line */}
                  <div className="w-px h-16 bg-gradient-to-b from-indigo-200 to-indigo-400 -mt-8 relative z-10" />

                  <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full ring-1 ring-indigo-200 shadow-sm z-20 -my-3">
                    <Users className="w-3.5 h-3.5" />
                    {result.secondaryContactIds.length} Linked Accounts
                  </div>

                  <div className="w-px h-12 bg-gradient-to-b from-indigo-400 to-transparent -mb-8 z-10" />

                  {/* Secondary Node Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 px-4 relative z-20">
                    {result.secondaryContactIds.map((id, index) => (
                      <div
                        key={id}
                        className="bg-white hover:bg-slate-50 group border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative border-t-[6px] border-t-slate-300 hover:border-t-indigo-400 cursor-default"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute -top-[12px] left-1/2 transform -translate-x-1/2 bg-white ring-2 ring-slate-200 w-3 h-3 rounded-full group-hover:ring-indigo-400 transition-colors" />

                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2 flex items-center justify-between">
                          Sub-profile
                          <LinkIcon className="w-3 h-3 text-slate-300" />
                        </div>
                        <div className="text-slate-800 font-medium">
                          Node <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm ml-1 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">#{id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Developer Inspector Toggle */}
            <div className="flex flex-col items-center mt-12">
              <button
                onClick={() => setJsonVisible(!jsonVisible)}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm ring-1 ring-slate-200 hover:ring-indigo-300"
              >
                <Activity className="w-4 h-4" />
                Raw JSON Payload
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${jsonVisible ? 'rotate-180' : ''}`} />
              </button>

              {/* Expandable JSON Area */}
              <div
                className={`w-full max-w-3xl overflow-hidden transition-all duration-500 ease-in-out mt-4 ${jsonVisible ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="bg-[#0D1117] rounded-2xl p-6 shadow-2xl relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                    <div className="w-3 h-3 rounded-full bg-green-400/20" />
                  </div>
                  <pre className="text-emerald-400/90 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed mt-2">
                    {JSON.stringify({ contact: result }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
