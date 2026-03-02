import React, { useState } from "react";
import {
  Mail,
  Phone,
  CheckCircle2,
  Activity,
  Users,
  Shield,
  Database,
  ChevronRight,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

function App() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eVal = email.trim();
    const pVal = phoneNumber.trim();

    if (!eVal && !pVal) {
      toast.error("Provide at least email or phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: eVal || null,
          phoneNumber: pVal || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.contact);
        toast.success("Identity graph generated.");
      } else {
        toast.error(data.error || "Failed.");
      }
    } catch {
      toast.error("Backend not running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/30 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/30 blur-[150px] rounded-full" />

      {/* Sidebar */}
      <div className="w-full lg:w-[480px] backdrop-blur-xl bg-white/5 border-r border-white/10 p-10 relative z-10">

        {/* Branding */}
        <div className="flex items-center gap-4 mb-14">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              AetherLink
            </h1>
            <p className="text-xs uppercase tracking-widest text-indigo-300">
              Identity Intelligence Engine
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Resolve Identity</h2>
          <p className="text-slate-400 text-sm">
            Merge fragmented user touchpoints into a unified digital identity graph.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-xs uppercase text-slate-400 font-semibold">
              Email Address
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="neo@matrix.io"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs uppercase text-slate-400 font-semibold">
              Phone Number
            </label>
            <div className="relative mt-2">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 404 555 0199"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-4 rounded-2xl font-semibold tracking-wide shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Generate Identity Graph
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="absolute bottom-8 text-xs text-slate-500 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Secured Graph Infrastructure
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Database className="w-16 h-16 mx-auto text-indigo-400 mb-6" />
              <h3 className="text-4xl font-extrabold mb-4">
                Awaiting Query
              </h3>
              <p className="text-slate-400 max-w-md">
                Submit an email or phone to visualize a consolidated identity structure.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
            >
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" />
                Unified Identity #{result.primaryContactId}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm text-indigo-300 uppercase mb-3">
                    Emails
                  </h4>
                  {result.emails?.map((e, i) => (
                    <div key={i} className="bg-white/10 p-3 rounded-xl mb-2">
                      {e}
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm text-indigo-300 uppercase mb-3">
                    Phone Numbers
                  </h4>
                  {result.phoneNumbers?.map((p, i) => (
                    <div key={i} className="bg-white/10 p-3 rounded-xl mb-2">
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {result.secondaryContactIds?.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm text-indigo-300 uppercase mb-4">
                    Linked Profiles
                  </h4>
                  <div className="flex gap-3 flex-wrap">
                    {result.secondaryContactIds.map((id) => (
                      <div
                        key={id}
                        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 px-4 py-2 rounded-xl"
                      >
                        <LinkIcon className="inline w-3 h-3 mr-2" />
                        #{id}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
