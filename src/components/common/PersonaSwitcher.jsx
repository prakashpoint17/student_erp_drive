import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserCheck, ChevronDown, Check, Shield, User, GraduationCap, Briefcase } from "lucide-react";

export const PersonaSwitcher = () => {
  const { currentUser, users, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleBadge = (role, isTutor) => {
    if (role === "admin") return { label: "Super Admin", color: "bg-brand-red-100 text-brand-red-800 border-brand-red-200", icon: Shield };
    if (role === "hod") return { label: "HOD", color: "bg-brand-blue-100 text-brand-blue-800 border-brand-blue-200", icon: Briefcase };
    if (role === "staff") {
      return isTutor 
        ? { label: "Class Tutor", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: UserCheck }
        : { label: "Faculty", color: "bg-purple-100 text-purple-800 border-purple-200", icon: User };
    }
    return { label: "Student", color: "bg-amber-100 text-amber-800 border-amber-200", icon: GraduationCap };
  };

  const currentBadge = getRoleBadge(currentUser.role, currentUser.isTutor);
  const CurrentIcon = currentBadge.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm transition"
        title="Switch User Persona (Role Simulation)"
      >
        <img
          src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={currentUser.name}
          className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-blue-500/20"
        />
        <div className="text-left hidden md:block">
          <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
            <span>{currentUser.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${currentBadge.color}`}>
              {currentBadge.label}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 leading-tight">
            {currentUser.email}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-brand-blue-600" />
                Switch ERP User Persona
              </h4>
              <p className="text-[11px] text-slate-500">
                Experience role-based authorization from each level of the hierarchy
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto p-1 space-y-1">
              {users.map(user => {
                const isSelected = user.uid === currentUser.uid;
                const badge = getRoleBadge(user.role, user.isTutor);
                const Icon = badge.icon;

                return (
                  <div
                    key={user.uid}
                    onClick={() => {
                      switchUser(user.uid);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition border text-left flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-brand-blue-50/70 border-brand-blue-300"
                        : "hover:bg-slate-50 border-transparent hover:border-slate-200"
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {user.name}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user.designation || user.rollNo || user.email}
                      </div>
                      {user.assignedClass && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          Tutor: Batch {user.assignedClass.batchYear} - Sec {user.assignedClass.section}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-blue-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 rounded-b-lg">
              <span className="font-medium text-slate-700">Hierarchy Note:</span> Class tutors only have edit access over their assigned batch & section.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
