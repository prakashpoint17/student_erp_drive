import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  GraduationCap, 
  HardDrive, 
  FileText, 
  ShieldAlert, 
  ClipboardCheck, 
  BookOpen, 
  Layers, 
  FileSpreadsheet,
  BarChart3,
  Bell,
  Settings,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Database,
  Sparkles
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) => {
  const { currentUser } = useAuth();
  const { activeSpace } = useDriveSpace();

  // Navigation tabs based on role
  const getNavItems = () => {
    if (currentUser?.role === "admin") {
      return [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "users", label: "User & Login Management", icon: Users },
        { id: "departments", label: "Department Management", icon: Building2 },
        { id: "spaces", label: "Drive Space Management", icon: HardDrive },
        { id: "batches", label: "Batch & Class Management", icon: Layers },
        { id: "students", label: "Student Records (Drive)", icon: GraduationCap },
        { id: "faculty", label: "Faculty & Staff (GSpace)", icon: UserCheck },
        { id: "records", label: "Academic Records & Results", icon: FileSpreadsheet },
        { id: "attendance", label: "Attendance & Exams", icon: ClipboardCheck },
        { id: "permissions", label: "Roles & Permissions", icon: ShieldCheck },
        { id: "files", label: "File & Document Registry", icon: Database },
        { id: "notifications", label: "Notifications & Approvals", icon: Bell, badge: "5" },
        { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
        { id: "audit", label: "Audit Logs & Security", icon: ShieldAlert },
        { id: "settings", label: "Integrations & Settings", icon: Settings },
      ];
    }

    if (currentUser?.role === "hod") {
      return [
        { id: "overview", label: "Department Hub", icon: LayoutDashboard },
        { id: "spaces", label: "Drive Spaces Setup", icon: HardDrive },
        { id: "staff", label: "Faculty & Staff Directory", icon: Users },
        { id: "tutors", label: "Tutor & Incharge Mapping", icon: UserCheck },
        { id: "students", label: "Department Students Roster", icon: GraduationCap },
        { id: "attendance", label: "Department Attendance", icon: ClipboardCheck },
        { id: "exams", label: "Department Exams", icon: FileSpreadsheet },
      ];
    }

    if (currentUser?.role === "staff") {
      const items = [
        { id: "profile", label: "Faculty Profile", icon: UserCheck },
      ];
      if (currentUser.isTutor) {
        items.push(
          { id: "my_class", label: "My Class Roster (Tutor)", icon: GraduationCap },
          { id: "tasks", label: "Tasks & Google Forms", icon: FileText },
          { id: "corrections", label: "Student Correction Requests", icon: ClipboardCheck },
          { id: "attendance", label: "Class Attendance", icon: ClipboardCheck }
        );
      }
      return items;
    }

    // Student
    return [
      { id: "profile", label: "My Student Profile", icon: GraduationCap },
      { id: "tasks", label: "Class Tasks & Google Forms", icon: FileText },
      { id: "corrections", label: "Profile Correction Requests", icon: Send },
      { id: "space_info", label: "My Batch Drive Space", icon: HardDrive },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  const isCurrentActive = (itemId) => {
    if (activeTab === itemId) return true;
    if (itemId === "overview" && (activeTab === "dashboard" || !activeTab)) return true;
    if (itemId === "users" && activeTab === "users_auth") return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 md:top-[109px] z-30 md:z-20 h-screen md:h-[calc(100vh-109px)] w-64
        bg-gradient-to-b from-[#071a4c] via-[#092261] to-[#041235] text-slate-200 border-r border-[#0d2f82]
        flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Top: Brand Header */}
        <div className="p-4 border-b border-blue-900/50 bg-[#061845]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-blue-400/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">
                  STUDENT<span className="text-red-400">.ERP</span>
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-blue-400/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-blue-200/70 font-medium truncate max-w-[150px]">
                RVS College of Engineering
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/60">
            Super Admin Blueprint
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  active 
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold" 
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    active ? "text-white" : "text-blue-300/80"
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                ) : active ? (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Bottom: RVS Group Brand Box */}
        <div className="p-3 border-t border-blue-900/50 bg-[#041235]/80">
          <div className="rounded-xl bg-gradient-to-br from-blue-950 to-slate-900 p-3 border border-blue-800/40 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <img 
                src="/assets/rvs-crest.png" 
                alt="RVS Group" 
                className="w-7 h-7 object-contain opacity-90"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <div className="text-[11px] font-black tracking-widest text-white uppercase">
                  RVS GROUP
                </div>
                <div className="text-[10px] text-amber-300 font-medium italic">
                  Building Intellectual Capital
                </div>
                <div className="text-[9px] text-blue-300/60 font-mono mt-0.5">
                  Estd 1983 • Autonomous
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
