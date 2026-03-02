import React, { useState } from 'react';
import { Search, Link as LinkIcon, Mail, Phone, CheckCircle2, Activity, Users, Shield, Database, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function App() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eVal = email.trim();
    const pVal = phoneNumber.trim();

    if (!eVal && !pVal) {
      toast.error('Please provide at least an email or phone number.');
      return;
    }

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
        toast.success('Identity reconciled successfully!');
      } else {
        toast.error(data.error || "Failed to identify user.");
      }
    } catch (err) {
      toast.error("Network error. Ensure the backend is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  const PrimaryList = ({ items, icon: Icon, title }) => {
    if (!items || items.length === 0) return (
      <div className="flex items-center gap-2 text-slate-400 italic text-sm p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50">
        <Icon className="w-4 h-4 opacity-50" /> No {title.toLowerCase()} found
      </div>
    );
    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all w-full"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                idx === 0 ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-700">{item}</span>
            </div>
            {idx === 0 && (
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                Primary
              </span>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-right" richColors />

      {/* Left Sidebar Form */}
      <div className="w-full lg:w-[420px] h-full flex flex-col border-r border-slate-200/60 bg-slate-50/50 backdrop-blur-xl shrink-0 z-20 relative shadow-2xl shadow-slate-200/20 overflow-y-auto">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">Bitespeed</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Identity Engine</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Reconcile User</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Consolidate fragmented touchpoints by searching an email or phone number.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 border-none outline-none" />
                </div>
                <input
                  type="email"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm placeholder:text-slate-400 font-medium text-slate-800"
                  placeholder="mcfly@hillvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400 border-none outline-none" />
                </div>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm placeholder:text-slate-400 font-medium text-slate-800"
                  placeholder="123456"
                  value={phoneNumber}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-slate-900 text-white rounded-2xl py-3.5 text-sm font-semibold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 group mt-4 flex justify-center cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  <Search className="w-4 h-4" />
                  Identify Identity
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto p-8 border-t border-slate-200/50">
          <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
            <Shield className="w-4 h-4" />
            <span>Secure Production Environment</span>
          </div>
        </div>
      </div>

      {/* Right Content Canvas */}
      <div className="flex-1 h-full bg-[#f8fafc] relative overflow-y-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12 relative z-10 w-full">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center max-w-sm my-auto"
              >
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 ring-1 ring-slate-100 rotate-3 transition-transform hover:rotate-6">
                  <Database className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Awaiting Query</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter an email or phone number in the panel to instantly retrieve or construct their consolidated identity graph.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl py-12"
              >
                {/* Main Root Node */}
                <div className="bg-white/80 backdrop-blur-md border border-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 relative z-20 overflow-hidden ring-1 ring-slate-200/50 w-full">
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Root Identity
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          ID: {result.primaryContactId}
                        </span>
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Unified Profile</h3>
                    </div>

                    <div className="flex items-center gap-2 bg-white ring-1 ring-slate-200 px-4 py-2 rounded-xl shadow-sm text-sm font-medium text-slate-600 w-full md:w-auto mt-4 md:mt-0">
                      <LayoutGrid className="w-4 h-4 text-indigo-500" />
                      {result.emails?.length + result.phoneNumbers?.length} Data Points
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> Registered Emails
                      </h4>
                      <PrimaryList items={result.emails} icon={Mail} title="Emails" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> Connected Phones
                      </h4>
                      <PrimaryList items={result.phoneNumbers} icon={Phone} title="Phones" />
                    </div>
                  </div>
                </div>

                {/* Secondary Nodes Tree */}
                {result.secondaryContactIds && result.secondaryContactIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative mt-8 flex flex-col items-center w-full"
                  >
                    {/* Tree Connector Line */}
                    <div className="w-px h-16 bg-gradient-to-b from-slate-300 to-slate-200 z-10" />

                    <div className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full shadow-sm z-20 flex items-center gap-2 -my-3">
                      <Users className="w-4 h-4" />
                      {result.secondaryContactIds.length} Linked Sub-Profiles
                    </div>

                    <div className="w-px h-12 bg-slate-200 z-10 -mb-8" />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 w-full mt-12 z-20">
                      {result.secondaryContactIds.map((id, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + (index * 0.1) }}
                          key={id}
                          className="bg-white border text-center border-slate-200 p-4 md:p-5 rounded-3xl shadow-lg shadow-slate-200/20 relative group hover:border-indigo-300 hover:shadow-indigo-100 transition-all cursor-default"
                        >
                          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-200 rounded-full group-hover:bg-indigo-400 transition-colors" />
                          <div className="text-[10px] flex flex-col items-center gap-1.5 text-slate-400 uppercase font-black tracking-widest mb-3">
                            <LinkIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            Connection
                          </div>
                          <div className="text-slate-700 font-semibold flex items-center justify-center gap-2">
                            Node
                            <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-lg text-sm">#{id}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
