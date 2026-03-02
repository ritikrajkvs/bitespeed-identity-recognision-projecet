import React, { useState } from 'react';
import { Search, Link as LinkIcon, Mail, Phone, CheckCircle2, Activity, Users, Shield, Database, LayoutGrid, ChevronRight } from 'lucide-react';
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/identify`, {
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
      <div className="flex items-center gap-2 text-slate-400 italic text-sm p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Icon className="w-4 h-4 opacity-50" /> No {title.toLowerCase()} recorded
      </div>
    );
    return (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 w-full relative overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors",
                idx === 0 ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-500 group-hover:bg-indigo-50/50 group-hover:text-indigo-500"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-700">{item}</span>
            </div>
            {idx === 0 && (
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                Primary
              </span>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-center" richColors />

      {/* Left Sidebar Form */}
      <div className="w-full lg:w-[460px] h-full flex flex-col border-r border-slate-200/80 bg-white shrink-0 z-20 relative shadow-2xl shadow-slate-200/30 overflow-y-auto">
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-inner">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">FluxKart</h1>
              <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase mt-0.5">Identity Engine</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Reconcile User</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Query our graph database to consolidate fragmented touchpoints into a single customer view.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400 font-semibold text-slate-800"
                  placeholder="mcfly@hillvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400 font-semibold text-slate-800"
                  placeholder="123456"
                  value={phoneNumber}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-indigo-600 text-white rounded-2xl py-4 text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 group mt-6 flex justify-center cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Execute Graph Query <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto p-10 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Connected to Bitespeed Production DB</span>
          </div>
        </div>
      </div>

      {/* Right Content Canvas */}
      <div className="flex-1 h-full bg-[#f8fafc] relative overflow-y-auto pattern-dots pattern-slate-200 pattern-bg-transparent pattern-size-4 pattern-opacity-40">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="min-h-full flex flex-col items-center justify-center p-8 md:p-16 relative z-10 w-full">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center max-w-md my-auto"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-200 rounded-3xl blur-xl opacity-50 animate-pulse" />
                  <div className="w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10 border border-slate-100">
                    <Database className="w-12 h-12 text-indigo-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Waiting for Query</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Enter an email or phone number in the panel to instantly retrieve or construct their consolidated identity graph.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                className="w-full max-w-4xl py-12"
              >
                {/* Main Root Node */}
                <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 relative z-20 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Root Identity
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          ID: {result.primaryContactId}
                        </span>
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight">Unified Profile</h3>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl shadow-sm text-sm font-bold text-slate-700 w-full md:w-auto">
                      <LayoutGrid className="w-5 h-5 text-indigo-500" />
                      {result.emails?.length + result.phoneNumbers?.length} Connected Data Points
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Mail className="w-4 h-4 text-slate-400" /> Known Emails
                      </h4>
                      <PrimaryList items={result.emails} icon={Mail} title="Emails" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Phone className="w-4 h-4 text-slate-400" /> Known Phones
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
                    <div className="w-1 h-16 bg-gradient-to-b from-indigo-200 to-slate-200 z-10 rounded-full" />

                    <div className="bg-slate-800 text-white border border-slate-700 text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg z-20 flex items-center gap-2 -my-4">
                      <Users className="w-4 h-4 text-indigo-400" />
                      {result.secondaryContactIds.length} Linked Sub-Profiles
                    </div>

                    <div className="w-1 h-12 bg-slate-200 z-10 -mb-6 rounded-full" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mt-10 z-20">
                      {result.secondaryContactIds.map((id, index) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + (index * 0.05), type: 'spring' }}
                          key={id}
                          className="bg-white border-2 border-slate-100 text-center p-5 rounded-3xl shadow-lg shadow-slate-200/40 relative group hover:border-indigo-400 transition-colors cursor-default"
                        >
                          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-300 rounded-full group-hover:bg-indigo-500 transition-colors border-2 border-white" />
                          <div className="text-[10px] flex flex-col items-center gap-1.5 text-slate-400 uppercase font-black tracking-widest mb-3">
                            <LinkIcon className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            Linked ID
                          </div>
                          <div className="text-slate-800 font-black text-xl flex items-center justify-center">
                            #{id}
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
