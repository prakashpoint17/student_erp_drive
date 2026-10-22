import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { isSupabaseConfigured, SupabaseAuthService } from "../../config/supabase";
import { 
  X, 
  Shield, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Lock, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Database,
  ArrowRight,
  User
} from "lucide-react";

export const LoginModal = ({ isOpen, onClose }) => {
  const { users, currentUser, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("personas"); // "personas" | "email"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthMessage(null);
    try {
      const res = await SupabaseAuthService.signInWithGoogle();
      setAuthMessage({ 
        type: "success", 
        text: isSupabaseConfigured ? "Redirecting to Google OAuth..." : "Demo Google OAuth Active!" 
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setAuthMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage(null);
    try {
      // Find matching user from seed list
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        switchUser(matchedUser.uid);
        setAuthMessage({ type: "success", text: `Welcome back, ${matchedUser.name}!` });
        setTimeout(() => onClose(), 800);
      } else {
        setAuthMessage({ 
          type: "error", 
          text: "User not found. Use one of the registered role personas below." 
        });
      }
    } catch (err) {
      setAuthMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const selectPersona = (userUid) => {
    switchUser(userUid);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-blue-800 to-brand-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Lock className="w-5 h-5 text-brand-red-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">ERP Authentication & Role Access</h3>
              <p className="text-xs text-brand-blue-200">Supabase RBAC & Role-Based Hierarchy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Provider Status Indicator */}
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-brand-blue-600" />
            Auth Engine: <strong>{isSupabaseConfigured ? "Supabase Cloud" : "Local Dev Sandbox (Zero Setup)"}</strong>
          </span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ready
          </span>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab("personas")}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition ${
              activeTab === "personas"
                ? "border-brand-blue-600 text-brand-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Instant Role Switcher ({users.length} Personas)
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition ${
              activeTab === "email"
                ? "border-brand-blue-600 text-brand-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Google OAuth / Email Sign-In
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {authMessage && (
            <div className={`mb-4 p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
              authMessage.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-brand-red-50 text-brand-red-800 border border-brand-red-200"
            }`}>
              {authMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Shield className="w-4 h-4 shrink-0" />}
              <span>{authMessage.text}</span>
            </div>
          )}

          {activeTab === "personas" ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                Select any user below to authenticate and enter their authorized dashboard:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {users.map(user => {
                  const isCurrent = user.uid === currentUser.uid;
                  return (
                    <div
                      key={user.uid}
                      onClick={() => selectPersona(user.uid)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isCurrent
                          ? "bg-brand-blue-50/70 border-brand-blue-300 ring-1 ring-brand-blue-400"
                          : "hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-9 h-9 rounded-full object-cover shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{user.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              user.role === "admin" ? "bg-brand-red-100 text-brand-red-800 border border-brand-red-200" :
                              user.role === "hod" ? "bg-brand-blue-100 text-brand-blue-800 border border-brand-blue-200" :
                              user.isTutor ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                              user.role === "student" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                              "bg-purple-100 text-purple-800 border border-purple-200"
                            }`}>
                              {user.role === "admin" ? "Super Admin" :
                               user.role === "hod" ? "HOD" :
                               user.isTutor ? "Class Tutor" :
                               user.role === "student" ? "Student" : "Staff"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          {user.assignedClass && (
                            <div className="text-[10px] text-emerald-700 font-medium">
                              Scope: Batch {user.assignedClass.batchYear} - Sec {user.assignedClass.section}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-brand-blue-600 text-xs font-semibold">
                        <span>{isCurrent ? "Active" : "Switch"}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Sign-In</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
                  Or Email Login
                </span>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="admin@rvs.edu.in or hod.cse@rvs.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
