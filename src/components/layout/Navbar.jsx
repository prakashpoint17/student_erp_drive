import React, { useState, useEffect } from "react";
import { GraduationCap, Menu, X, FileCode2, LogOut, HardDrive, Bell, Calendar, ChevronDown, CheckCircle2 } from "lucide-react";
import { DriveSpaceSelector } from "../common/DriveSpaceSelector";
import { useAuth } from "../../context/AuthContext";

export const Navbar = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  onOpenScriptGuide, 
  onOpenConnectModal 
}) => {
  const { currentUser, logout } = useAuth();
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
    setCurrentDateStr(now.toLocaleDateString("en-US", options));
  }, []);

  const getRoleBadgeStyle = (role, isTutor) => {
    if (role === "admin") return "bg-red-500/20 text-red-200 border-red-400/40";
    if (role === "hod") return "bg-blue-500/20 text-blue-200 border-blue-400/40";
    if (role === "staff") {
      return isTutor 
        ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40" 
        : "bg-purple-500/20 text-purple-200 border-purple-400/40";
    }
    return "bg-amber-500/20 text-amber-200 border-amber-400/40";
  };

  const getRoleLabel = (role, isTutor) => {
    if (role === "admin") return "Super Admin";
    if (role === "hod") return `HOD (${currentUser?.departmentId?.toUpperCase() || "DEPT"})`;
    if (role === "staff") {
      return isTutor 
        ? `Tutor (${currentUser?.assignedClass?.section || 'A'})` 
        : "Faculty";
    }
    return "Student";
  };

  const getRoleSubtitle = (role) => {
    if (role === "admin") return "Super Admin Dashboard | Central Institutional Governance";
    if (role === "hod") return "Department Head Portal | Faculty, Batch Spaces & Academics";
    if (role === "staff") return "Faculty & Tutor Portal | Student Proctoring & Continuous Evaluation";
    return "Student Academic Self-Service Portal | Google Drive Records";
  };

  return (
    <header className="sticky top-0 z-30 shadow-md">
      {/* 1. TOP HEADER: Institutional Branding Strip with Campus Overlay */}
      <div className="relative bg-[#06194b] text-white border-b border-[#0d2b7a] overflow-hidden">
        {/* Subtle Campus photo overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/campus-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06194b] via-[#09256e]/95 to-[#06194b] pointer-events-none" />

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Crest & College Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <img 
                src="/assets/rvs-crest.png" 
                alt="RVS Crest" 
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-extrabold text-sm sm:text-base tracking-wide text-white drop-shadow-xs">
                    RVS COLLEGE OF ENGINEERING & TECHNOLOGY
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-blue-200/90 font-medium flex-wrap">
                  <span>Dindigul, Tamil Nadu</span>
                  <span className="text-blue-400">•</span>
                  <span className="hidden sm:inline">Autonomous Institution</span>
                  <span className="text-blue-400 hidden sm:inline">•</span>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.2 rounded border border-amber-400/30">
                    NAAC B+ Accredited
                  </span>
                  <span className="text-blue-400 hidden md:inline">•</span>
                  <span className="text-emerald-300 text-[10px] font-semibold hidden md:inline">
                    Approved by AICTE • Affiliated to Anna University
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell with Badge */}
            <button 
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition border border-white/10"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#06194b]">
                5
              </span>
            </button>

            {/* User Profile Pill */}
            {currentUser && (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-blue-950 font-black text-xs flex items-center justify-center ring-2 ring-white/30 shrink-0">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    currentUser.name?.charAt(0) || "P"
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                    <span className="truncate max-w-[130px]">{currentUser.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${getRoleBadgeStyle(currentUser.role, currentUser.isTutor)}`}>
                      {getRoleLabel(currentUser.role, currentUser.isTutor)}
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-200/80 font-mono truncate max-w-[150px]">
                    {currentUser.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-300 hidden sm:block" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SUB-HEADER BAR: Welcome greetings, Live Date, Drive Space Selector & Quick Controls */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left: Welcome Greeting */}
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                👋 Welcome Back, {currentUser?.name || "Prakash N"} !
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Session
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {getRoleSubtitle(currentUser?.role)}
            </p>
          </div>
        </div>

        {/* Right: Live Date, Apps Script, Space Selector, Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live Date Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentDateStr || "Monday, 21 Oct 2026"}</span>
          </div>

          {/* Apps Script Guide Trigger (visible to Admin and HOD) */}
          {(currentUser?.role === "admin" || currentUser?.role === "hod") && (
            <button
              onClick={onOpenScriptGuide}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
              title="View the 1-File Google Apps Script for your Gmail accounts"
            >
              <FileCode2 className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Drive Apps Script</span>
            </button>
          )}

          {/* Drive Space Selector */}
          <DriveSpaceSelector 
            onOpenConnectModal={onOpenConnectModal} 
            onOpenScriptGuide={onOpenScriptGuide} 
          />

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition shadow-2xs"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
