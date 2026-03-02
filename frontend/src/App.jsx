import React, { useState } from 'react';
import { Search, Link as LinkIcon, Mail, Phone, CheckCircle2, Activity, Users, Shield, Database, LayoutGrid, Zap, Sparkles } from 'lucide-react';
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
        toast.success('Identity graph resolved!');
      } else {
        toast.error(data.error || "Failed to identify user.");
      }
    } catch (err) {
      toast.error("Network error. Ensure the backend is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  const PrimaryList = ({ items, icon: Icon, title, colorClass }) => {
    if (!items || items.length === 0) return (
      <div className="flex items-center justify-center gap-2 text-white/40 italic text-sm p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <Icon className="w-4 h-4 opacity-50" /> No {title.toLowerCase()} recorded
      </div>
    );
    return (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            key={idx}
            className="group flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full relative overflow-hidden shadow-lg"
          >
            {idx === 0 && (
              <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-r", colorClass)} />
            )}
            <div className="flex items-center gap-4 relative z-10">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors shadow-inner",
                idx === 0 ? "bg-white/20 text-white" : "bg-white/5 text-white/60 group-hover:text-white"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "font-bold tracking-wide",
                idx === 0 ? "text-white text-lg" : "text-white/80"
              )}>{item}</span>
            </div>
            {idx === 0 && (
              <span className={cn(
                "text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-white/20 relative z-10 bg-gradient-to-r",
                colorClass
              )}>
                Primary
              </span>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0A0F1C] font-sans overflow-hidden selection:bg-pink-500/30 selection:text-pink-200 text-white">
      <Toaster position="top-right" richColors theme="dark" />

      {/* Left Sidebar Form - Dark & Vibrant */}
      <div className="w-full lg:w-[480px] h-full flex flex-col border-r border-white/10 bg-[#0F1629] shrink-0 z-30 relative shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)] overflow-y-auto">

        {/* Subtle top gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        <div className="p-10 pb-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-[2px] shadow-lg shadow-purple-500/30 animate-pulse">
              <div className="w-full h-full bg-[#0F1629] rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-3xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">FluxKart</h1>
              <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-black tracking-[0.2em] uppercase mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" /> Nexus Engine
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-3">Target Acquisition</h2>
            <p className="text-sm text-white/50 leading-relaxed font-medium">
              Deploy graph traversal algorithms to compile fragmented records into a unified identity matrix.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest pl-2">Primary Locator (Email)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full bg-[#151D30] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-white/20 font-bold text-white shadow-inner"
                  placeholder="mcfly@hillvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest pl-2">Secondary Locator (Phone)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-white/30 group-focus-within:text-pink-400 transition-colors" />
                </div>
                <input
                  type="text"
                  className="w-full bg-[#151D30] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-white/20 font-bold text-white shadow-inner"
                  placeholder="123456"
                  value={phoneNumber}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl py-4 text-sm font-black tracking-wide transition-all shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)] hover:shadow-[0_0_60px_-15px_rgba(236,72,153,0.7)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 group mt-8 flex justify-center cursor-pointer border border-pink-400/30"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Compiling...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  <Zap className="w-4 h-4 text-pink-200" /> Execute Query
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto p-10 bg-[#0B101E] border-t border-white/5">
          <div className="flex items-center justify-center gap-3 text-white/40 text-xs font-bold tracking-wider uppercase">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secure Node Connection Active</span>
          </div>
        </div>
      </div>

      {/* Right Content Canvas - Colorful & Atmospheric */}
      <div className="flex-1 h-full relative overflow-y-auto bg-[#050810]">

        {/* Deep Atmospheric Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        <div className="min-h-full flex flex-col items-center justify-center p-8 md:p-16 relative z-10 w-full">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                className="flex flex-col items-center justify-center text-center max-w-lg my-auto"
              >
                <div className="relative mb-10 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
                  <div className="w-32 h-32 bg-[#12192A] rounded-full shadow-2xl flex items-center justify-center relative z-10 border border-white/10 group-hover:border-white/20 transition-colors">
                    <Database className="w-14 h-14 text-white/50" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">System Standby</h3>
                <p className="text-white/40 leading-relaxed font-medium text-lg">
                  Input parameters in the console to generate a unified topological view of the subject's identity.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className="w-full max-w-5xl py-12"
              >
                {/* Main Root Node Dashboard */}
                <div className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative z-20 w-full overflow-hidden">

                  {/* Glowing top border */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                          <CheckCircle2 className="w-4 h-4" />
                          Apex Identity Verified
                        </span>
                        <span className="text-xs font-mono font-bold text-white/40 bg-black/30 px-3 py-2 rounded-lg border border-white/5">
                          UID // {result.primaryContactId}
                        </span>
                      </div>
                      <h3 className="text-5xl font-black text-white tracking-tighter">Unified Matrix</h3>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-white/30">Total Data Nodes</div>
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl shadow-inner text-2xl font-black text-white w-full md:w-auto">
                        <LayoutGrid className="w-6 h-6 text-purple-400" />
                        {result.emails?.length + result.phoneNumbers?.length}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12 bg-black/20 p-8 rounded-3xl border border-white/5">
                    <div>
                      <h4 className="text-xs font-black text-cyan-400 tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                        <Mail className="w-5 h-5 text-cyan-400" /> Registered Email Vectors
                      </h4>
                      <PrimaryList items={result.emails} icon={Mail} title="Emails" colorClass="from-cyan-600 to-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-pink-400 tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                        <Phone className="w-5 h-5 text-pink-400" /> Linked Telemetry
                      </h4>
                      <PrimaryList items={result.phoneNumbers} icon={Phone} title="Phones" colorClass="from-pink-600 to-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Secondary Nodes Visualizer */}
                {result.secondaryContactIds && result.secondaryContactIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative mt-12 flex flex-col items-center w-full"
                  >
                    {/* Glowing Tree Connector Line */}
                    <div className="w-[2px] h-20 bg-gradient-to-b from-cyan-400/50 via-purple-500/50 to-transparent z-10" />

                    <div className="bg-[#1A2235] text-white border border-purple-500/30 text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] z-20 flex items-center gap-3 -my-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                      <Users className="w-5 h-5 text-purple-400 relative z-10" />
                      <span className="relative z-10">{result.secondaryContactIds.length} Linked Sub-Nodes</span>
                    </div>

                    <div className="w-[2px] h-16 bg-gradient-to-b from-purple-500/30 to-white/5 z-10 -mb-8" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-12 z-20">
                      {result.secondaryContactIds.map((id, index) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.6 + (index * 0.1), type: 'spring', damping: 12 }}
                          key={id}
                          className="bg-[#111827]/60 backdrop-blur-xl border border-white/10 text-center p-6 rounded-3xl shadow-xl relative group hover:bg-[#1A2235] hover:border-purple-500/50 transition-all duration-300 cursor-default overflow-hidden"
                        >
                          {/* Hover flare */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-purple-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,1)]" />

                          <div className="text-[10px] flex flex-col items-center gap-2 text-white/40 uppercase font-black tracking-widest mb-4">
                            <LinkIcon className="w-5 h-5 text-white/20 group-hover:text-purple-400 transition-colors" />
                            Reference ID
                          </div>
                          <div className="text-white font-black text-2xl flex items-center justify-center tracking-tighter">
                            <span className="text-purple-500 mr-1">#</span>{id}
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
