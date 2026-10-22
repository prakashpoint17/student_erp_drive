import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  Users, 
  Cloud, 
  ShieldCheck, 
  BarChart3, 
  Shield, 
  Landmark, 
  User, 
  UserCheck,
  Eye, 
  EyeOff,
  X,
  Phone,
  HelpCircle,
  ExternalLink
} from "lucide-react";

export const LoginPage = () => {
  const { users, loginByEmailAndRole, loginWithGoogleOAuth, defaultAdminEmail } = useAuth();

  // Role selection state (defaults to Super Admin)
  const [selectedRole, setSelectedRole] = useState("admin"); // "admin" | "hod" | "tutor" | "staff" | "student"
  const [emailInput, setEmailInput] = useState(defaultAdminEmail || "erprvs@gmail.com");
  const [passwordInput, setPasswordInput] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals for About, Help, Forgot Password
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'about' | 'help' | 'forgot' | null

  // Dynamic user counts per role
  const adminCount = users.filter(u => u.role === "admin").length;
  const hodCount = users.filter(u => u.role === "hod").length;
  const tutorCount = users.filter(u => u.isTutor).length;
  const staffCount = users.filter(u => u.role === "staff" && !u.isTutor).length;
  const studentCount = users.filter(u => u.role === "student").length;

  // The 5 institutional roles
  const roles = [
    { 
      id: "admin", 
      label: "Super Admin", 
      desc: "Initial access",
      icon: Shield,
      iconBg: "bg-red-500 text-white",
      cardActive: "bg-red-50 border-red-300 ring-2 ring-red-400 text-slate-900",
      cardInactive: "bg-red-50/50 border-red-100 hover:bg-red-50 text-slate-700",
      radioColor: "border-red-500 bg-red-500",
      defaultEmail: defaultAdminEmail,
      count: adminCount
    },
    { 
      id: "hod", 
      label: "HOD / Head", 
      desc: "Department management",
      icon: Landmark,
      iconBg: "bg-blue-600 text-white",
      cardActive: "bg-blue-50 border-blue-300 ring-2 ring-blue-400 text-slate-900",
      cardInactive: "bg-blue-50/50 border-blue-100 hover:bg-blue-50 text-slate-700",
      radioColor: "border-blue-600 bg-blue-600",
      defaultEmail: "",
      count: hodCount
    },
    { 
      id: "tutor", 
      label: "Class Tutor", 
      desc: tutorCount === 0 ? "Pending appointment" : `${tutorCount} appointed`,
      icon: UserCheck,
      iconBg: "bg-emerald-600 text-white",
      cardActive: "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400 text-slate-900",
      cardInactive: "bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 text-slate-700",
      radioColor: "border-emerald-600 bg-emerald-600",
      defaultEmail: "",
      count: tutorCount
    },
    { 
      id: "staff", 
      label: "Faculty / Staff", 
      desc: staffCount === 0 ? "Pending appointment" : `${staffCount} registered`,
      icon: User,
      iconBg: "bg-purple-600 text-white",
      cardActive: "bg-purple-50 border-purple-300 ring-2 ring-purple-400 text-slate-900",
      cardInactive: "bg-purple-50/50 border-purple-100 hover:bg-purple-50 text-slate-700",
      radioColor: "border-purple-600 bg-purple-600",
      defaultEmail: "",
      count: staffCount
    },
    { 
      id: "student", 
      label: "Student", 
      desc: studentCount === 0 ? "Pending appointment" : `${studentCount} registered`,
      icon: GraduationCap,
      iconBg: "bg-amber-500 text-white",
      cardActive: "bg-amber-50 border-amber-300 ring-2 ring-amber-400 text-slate-900",
      cardInactive: "bg-amber-50/50 border-amber-100 hover:bg-amber-50 text-slate-700",
      radioColor: "border-amber-500 bg-amber-500",
      defaultEmail: "",
      count: studentCount
    }
  ];

  // Role click handler
  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMessage(null);
    if (roleId === "admin") {
      setEmailInput(defaultAdminEmail);
      setPasswordInput("admin");
    } else {
      setEmailInput("");
      setPasswordInput("");
    }
  };

  // Email / Password Form Submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!emailInput.trim()) {
      setErrorMessage("Please enter an authorized email address.");
      setLoading(false);
      return;
    }

    if (!passwordInput.trim()) {
      setErrorMessage("Password is required. (Default password for Super Admin is 'admin').");
      setLoading(false);
      return;
    }

    const res = loginByEmailAndRole(emailInput, passwordInput, selectedRole);
    if (!res.success) {
      setErrorMessage(res.error);
    }
    setLoading(false);
  };

  // Direct Google OAuth Popup
  const handleGoogleOAuthLogin = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await loginWithGoogleOAuth(selectedRole);
      if (!res.success) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMessage("Google sign-in popup was closed before completing.");
      } else if (err.code === "auth/unauthorized-domain") {
        setErrorMessage("localhost is not authorized in Firebase Authentication settings.");
      } else {
        setErrorMessage(err.message || "Google OAuth sign-in encountered an error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col justify-between selection:bg-blue-200 selection:text-blue-900 font-sans"
      style={{
        backgroundImage: `
          linear-gradient(110deg, rgba(8, 38, 105, 0.95) 0%, rgba(10, 60, 160, 0.88) 32%, rgba(14, 85, 200, 0.55) 62%, rgba(16, 95, 220, 0.15) 100%),
          url('/assets/campus-bg.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* ============================================================ */}
      {/* TOP HEADER / NAVBAR (Exact Figma layout)                    */}
      {/* ============================================================ */}
      <header className="w-full bg-gradient-to-b from-blue-950/80 to-transparent py-4 px-4 sm:px-8 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Official College Crest + Title + NAAC Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <img 
              src="/assets/rvs-logo-nav.png" 
              alt="RVS Group Crest" 
              className="h-14 sm:h-16 w-auto object-contain shrink-0 drop-shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/rvs-logo.png';
              }}
            />
            
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-white font-extrabold text-base sm:text-xl tracking-wide uppercase drop-shadow-xs">
                  RVS COLLEGE OF ENGINEERING
                </h1>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xs tracking-wider uppercase inline-flex items-center">
                  NAAC B+ Accredited
                </span>
              </div>
              <p className="text-blue-200 text-xs sm:text-[13px] font-medium flex items-center gap-2 mt-0.5">
                <span>Dindigul, Tamil Nadu</span>
                <span className="text-blue-300">•</span>
                <span>Autonomous Institution</span>
              </p>
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-sm font-semibold text-white">
            <button 
              onClick={() => setActiveInfoModal(null)} 
              className="hover:text-amber-300 transition hidden md:block"
            >
              Home
            </button>
            <button 
              onClick={() => setActiveInfoModal('about')} 
              className="hover:text-amber-300 transition hidden md:block"
            >
              About
            </button>
            <button 
              onClick={() => setActiveInfoModal('help')} 
              className="hover:text-amber-300 transition hidden md:block"
            >
              Help
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN HERO & LOGIN WORKSPACE                                  */}
      {/* ============================================================ */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Hero Presentation & Feature Badges */}
          <div className="lg:col-span-7 space-y-6 text-white pt-2 pb-6">
            
            {/* Digital Campus Tag */}
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
              <span className="text-amber-300 font-extrabold tracking-widest text-xs uppercase">
                DIGITAL CAMPUS
              </span>
            </div>

            {/* Giant Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-sm">
                Student <span className="text-sky-400">ERP</span>
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-3 tracking-tight">
                One platform for your academic journey
              </h2>
              <p className="text-sm sm:text-base text-blue-100/90 max-w-xl mt-3 leading-relaxed font-normal">
                Manage academic records, departments, student services and campus activities — all in one secure and unified portal.
              </p>
            </div>

            {/* 4 Feature Cards Row (Exact Figma Mockup Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-4 max-w-3xl">
              
              {/* Card 1: Role-Based Access */}
              <div className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 mb-2.5">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-xs sm:text-sm leading-tight">
                  Role-Based Access
                </span>
                <span className="text-[11px] text-blue-200/90 mt-1 leading-snug">
                  Admin, HOD, Staff & Student
                </span>
              </div>

              {/* Card 2: Google Drive Integration */}
              <div className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 mb-2.5">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-xs sm:text-sm leading-tight">
                  Google Drive Integration
                </span>
                <span className="text-[11px] text-blue-200/90 mt-1 leading-snug">
                  Store data securely in dedicated spaces
                </span>
              </div>

              {/* Card 3: Secure Authentication */}
              <div className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 mb-2.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-xs sm:text-sm leading-tight">
                  Secure Authentication
                </span>
                <span className="text-[11px] text-blue-200/90 mt-1 leading-snug">
                  Sign in with Google Account
                </span>
              </div>

              {/* Card 4: Efficient Management */}
              <div className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 mb-2.5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-xs sm:text-sm leading-tight">
                  Efficient Management
                </span>
                <span className="text-[11px] text-blue-200/90 mt-1 leading-snug">
                  Departments, Batches, Classes & More
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Pixel-Perfect Login Card (Exact UI Layout) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-950/40 border border-white/80 p-6 sm:p-8 w-full max-w-[480px] space-y-5">
              
              {/* Card Brand Header */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mx-auto mb-2.5">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h2 className="font-black text-2xl tracking-tight text-slate-900">
                  STUDENT<span className="text-blue-600">.ERP</span>
                </h2>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  RVS College of Engineering
                </p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center justify-center gap-1.5">
                  <span>Dindigul, Tamil Nadu</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-600 font-bold">NAAC B+ Accredited</span>
                </p>
              </div>

              {/* Error Alert (if authentication error occurs) */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Authentication Notice</strong>
                    <span className="text-[11px] leading-tight block mt-0.5">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* 1. ROLE SELECTION PILLS (Clean Grid) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Your Institutional Role
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {roles.map(r => {
                    const isSelected = selectedRole === r.id;
                    const Icon = r.icon;
                    const isStudent = r.id === "student";
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelect(r.id)}
                        className={`p-2.5 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${
                          isStudent ? "col-span-2" : ""
                        } ${
                          isSelected ? r.cardActive : r.cardInactive
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-8 h-8 rounded-xl ${r.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate leading-tight">
                              {r.label}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                              {r.desc}
                            </span>
                          </div>
                        </div>

                        {/* Radio selection circle */}
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? r.radioColor : "border-slate-300 bg-white"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. EMAIL & PASSWORD FORM */}
              <form onSubmit={handleEmailSubmit} className="space-y-3.5 pt-1">
                {/* Institutional Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institutional Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="Enter your institutional email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800 transition"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveInfoModal('forgot')}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>Verify Credentials & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Direct Google OAuth Sign-in Button */}
                <button
                  type="button"
                  onClick={handleGoogleOAuthLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google Account</span>
                </button>
              </form>

              {/* 3. BOTTOM INFO BOX (Matching Figma Alert) */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">New User Setup:</strong> Only the Super Admin can add HODs, Staff and Students. Use your authorized institutional Google account.
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ============================================================ */}
      {/* FOOTER BAR                                                   */}
      {/* ============================================================ */}
      <footer className="w-full bg-blue-950/70 backdrop-blur-xs border-t border-white/10 py-3 px-4 text-center text-xs text-blue-200 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Student ERP Portal • Autonomous RVS College of Engineering & Technology, Dindigul</span>
          <span className="font-mono text-[11px] text-blue-300">
            TNEA Code: 5913 • Accredited by NAAC with 'B+' Grade
          </span>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* HELPER MODALS (About, Help, Forgot Password)                 */}
      {/* ============================================================ */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {activeInfoModal === 'about' && "About RVS College of Engineering"}
                {activeInfoModal === 'help' && "ERP Support & Helpdesk"}
                {activeInfoModal === 'forgot' && "Password Recovery Guide"}
              </h3>
              <button 
                onClick={() => setActiveInfoModal(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeInfoModal === 'about' && (
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  <strong>RVS College of Engineering and Technology (Autonomous)</strong> is an esteemed institution established in 1985 under the RVS Educational Trust.
                </p>
                <p>
                  Located on Karur Road, Dindigul, Tamil Nadu, the college is approved by AICTE, affiliated with Anna University Chennai, and accredited with <strong>'B+' Grade by NAAC</strong>.
                </p>
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
                  TNEA Counseling Code: <strong>5913</strong>
                </div>
              </div>
            )}

            {activeInfoModal === 'help' && (
              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  For assistance regarding institutional ERP access, Google Drive space quotas, or department authorizations, please contact:
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-800">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>erprvs@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>04551-227229 / 9976441414</span>
                  </div>
                </div>
              </div>
            )}

            {activeInfoModal === 'forgot' && (
              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  In this decentralized zero-cost architecture:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Super Admin</strong> default password is <code className="font-mono text-blue-700">admin</code>.</li>
                  <li><strong>HODs & Staff</strong> receive their initial password directly from the Super Admin upon appointment.</li>
                  <li><strong>Students</strong> receive their password from their Class Tutor upon enrollment.</li>
                </ul>
                <p className="text-[11px] text-slate-500">
                  You can also click <strong>"Continue with Google Account"</strong> to sign in passwordlessly using your authorized Google email.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
