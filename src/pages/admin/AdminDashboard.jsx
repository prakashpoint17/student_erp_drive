import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { 
  Building2, 
  Users, 
  UserCheck, 
  GraduationCap, 
  HardDrive, 
  ShieldCheck, 
  Plus, 
  ExternalLink,
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  BarChart3,
  Bell,
  Settings,
  FileText,
  ClipboardCheck,
  Search,
  Download,
  RefreshCw,
  Filter,
  Trash2,
  Key,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  PieChart,
  Clock,
  ArrowUpRight,
  Activity,
  Check,
  Lock,
  Server,
  Database,
  UploadCloud,
  X
} from "lucide-react";

export const AdminDashboard = ({ activeTab = "overview", onOpenConnectModal, onOpenScriptGuide }) => {
  const { 
    currentUser, 
    departments: rawDepartments, 
    users: rawUsers, 
    auditLogs: rawAuditLogs, 
    addDepartment, 
    deleteDepartment,
    appointHOD, 
    authorizeNewUser, 
    deleteUser,
    toggleUserStatus,
    logAudit 
  } = useAuth();

  const { 
    spaces: rawSpaces, 
    deleteSpace,
    students: rawStudents, 
    addStudent, 
    deleteStudent,
    batches: rawBatches,
    addBatch,
    deleteBatch,
    classes: rawClasses,
    addClass,
    deleteClass,
    tutorAssignments: rawTutors,
    assignTutor,
    connectSpace,
    registeredFiles: rawFiles,
    registerNewFile,
    syncFileWithDrive,
    staffRecords: rawStaff,
    addStaffToGSpace,
    deleteStaffFromGSpace,
    resultsRecords: rawResults,
    addOrUpdateResult,
    deleteResult,
    openInGoogleDrive,
    getDriveUrlForSpace,
    testSpaceConnection
  } = useDriveSpace();

  // Strict defensive array normalizations preventing any undefined / null crashes
  const departments = Array.isArray(rawDepartments) ? rawDepartments : [];
  const users = Array.isArray(rawUsers) ? rawUsers : [];
  const auditLogs = Array.isArray(rawAuditLogs) ? rawAuditLogs : [];
  const spaces = Array.isArray(rawSpaces) ? rawSpaces : [];
  const students = Array.isArray(rawStudents) ? rawStudents : [];
  const batches = Array.isArray(rawBatches) ? rawBatches : [];
  const classes = Array.isArray(rawClasses) ? rawClasses : [];
  const registeredFiles = Array.isArray(rawFiles) ? rawFiles : [];
  const staffRecords = Array.isArray(rawStaff) ? rawStaff : [];
  const resultsRecords = Array.isArray(rawResults) ? rawResults : [];
  const tutorAssignments = Array.isArray(rawTutors) ? rawTutors : [];

  // Local modal states
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ 
    name: "", 
    code: "", 
    commonSpaceEmail: "",
    hodEmail: "",
    hodName: "",
    assignedStaffUid: ""
  });

  const [showAppointModal, setShowAppointModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [hodForm, setHodForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "admin",
    selectedStaffUid: ""
  });

  const [showAuthorizeModal, setShowAuthorizeModal] = useState(false);
  const [userAuthForm, setUserAuthForm] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "hod",
    departmentId: "",
    designation: "",
    phone: ""
  });

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    regulation: "2021 Autonomous",
    startYear: "2026",
    endYear: "2030",
    departmentId: "",
    sections: "A, B",
    accountEmail: ""
  });

  const [showTutorModal, setShowTutorModal] = useState(false);
  const [tutorForm, setTutorForm] = useState({
    departmentId: "",
    batch: "2026-2030",
    section: "A",
    tutorName: "",
    tutorEmail: ""
  });

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    regNo: "",
    departmentId: "",
    batch: "2026-2030",
    section: "A",
    email: "",
    phone: "",
    cgpa: "0.00",
    attendancePercentage: "100.0"
  });

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [classForm, setClassForm] = useState({
    name: "",
    departmentId: "",
    batch: "2026-2030",
    section: "A",
    tutorName: "",
    room: "LH-101",
    studentCount: 0
  });

  // Modal & Form: Store Staff in GSpace (Faculty.xlsx)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    empId: "",
    departmentId: "",
    designation: "Assistant Professor",
    qualification: "M.E., Ph.D.",
    phone: "",
    password: "password123",
    role: "staff"
  });

  // Modal & Form: Add / Edit Exam Result (Semester_5_Results.xlsx)
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultForm, setResultForm] = useState({
    regNo: "",
    studentName: "",
    departmentId: "",
    batch: "2026-2030",
    semester: 5,
    cs501: 85,
    cs502: 88,
    cs503: 92
  });

  // Modal & Form: Register New Document in Drive Space
  const [showRegisterFileModal, setShowRegisterFileModal] = useState(false);
  const [fileForm, setFileForm] = useState({
    name: "",
    category: "Academic Records",
    spaceId: "space_rvs_master",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  // Drive Space Live Ping status
  const [pingStatus, setPingStatus] = useState({});

  // Announcements
  const [announcements, setAnnouncements] = useState(() => {
    const defaultNotices = [
      {
        id: "notice_1",
        title: "Autonomous Odd Semester Examinations Schedule (2026-2027)",
        target: "All Faculty & Students",
        date: "Oct 20, 2026",
        content: "The Autonomous Examination Cell has published the official timetable for Semester 3 and Semester 5 exams commencing next month.",
        priority: "Urgent"
      },
      {
        id: "notice_2",
        title: "Google Drive Master Space Decentralized Setup",
        target: "All Department Heads (HOD)",
        date: "Oct 18, 2026",
        content: "All newly appointed HODs are requested to ensure batch-specific Google Drive spaces are connected with the 1-file Apps Script.",
        priority: "Normal"
      }
    ];
    const saved = localStorage.getItem("rvs_erp_announcements");
    if (!saved) return defaultNotices;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultNotices;
    } catch {
      return defaultNotices;
    }
  });

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    target: "All Faculty & Students",
    content: "",
    priority: "Normal"
  });

  useEffect(() => {
    localStorage.setItem("rvs_erp_announcements", JSON.stringify(announcements));
  }, [announcements]);

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) return;
    const newNotice = {
      id: `notice_${Date.now()}`,
      ...noticeForm,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    setAnnouncements(prev => [newNotice, ...prev]);
    logAudit("BROADCAST_CIRCULAR", `Published circular: "${newNotice.title}" targeting ${newNotice.target}`);
    setShowNoticeModal(false);
    setNoticeForm({ title: "", target: "All Faculty & Students", content: "", priority: "Normal" });
  };

  const downloadCSV = (filename, content) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // State for user management filter & search
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Search & Filter for Results & Files
  const [resultSearch, setResultSearch] = useState("");
  const [resultDeptFilter, setResultDeptFilter] = useState("all");
  const [fileSearch, setFileSearch] = useState("");
  const [fileCategoryFilter, setFileCategoryFilter] = useState("all");

  // Chart state
  const [hoveredYear, setHoveredYear] = useState(null);
  const [enrollmentMetric, setEnrollmentMetric] = useState("students");

  // =========================================================================
  // REAL-TIME DYNAMIC COMPUTATIONS (100% Derived from live state)
  // =========================================================================
  const totalStudents = students.length;
  const facultyList = useMemo(() => users.filter(u => u.role === "staff" || u.role === "hod"), [users]);
  const totalFacultyStaff = facultyList.length;
  const totalDepartments = departments.length;
  const totalBatches = batches.length;
  const totalClasses = classes.length;
  const totalDriveSpaces = spaces.length;
  const totalActiveUsers = users.length;
  const onlineUsersCount = users.filter(u => u.isActive !== false).length;

  // Real Storage Calculation
  const totalStoragePoolGB = Math.max(0, spaces.length * 15);
  const usedStorageTotalGB = spaces.reduce((acc, s) => acc + (s.usedStorageGB || 0.1), 0);
  const storagePercent = totalStoragePoolGB > 0 ? Math.min(100, Math.round((usedStorageTotalGB / totalStoragePoolGB) * 100)) : 0;
  const availableStorageGB = Math.max(0, totalStoragePoolGB - usedStorageTotalGB);

  // Dynamic 5-Year Enrollment Data
  const enrollmentYears = ["2022", "2023", "2024", "2025", "2026"];
  const dynamicEnrollmentData = useMemo(() => {
    return enrollmentYears.map(yr => {
      const studentCount = students.filter(s => (s.batch && s.batch.includes(yr)) || (s.enrolledAt && s.enrolledAt.includes(yr))).length;
      // If student count is 0 and no student has that year, reflect 0!
      // For 2026, include students without a batch as well
      const yearStudents = yr === "2026" 
        ? students.filter(s => (s.batch && s.batch.includes("2026")) || !s.batch).length 
        : studentCount;

      const yearBatches = batches.filter(b => b.startYear === yr || b.batch?.includes(yr)).length;
      const yearFaculty = facultyList.length;

      return {
        year: yr,
        count: yearStudents,
        batches: yearBatches,
        faculty: yearFaculty
      };
    });
  }, [students, batches, facultyList]);

  // Max value for bar chart scale
  const maxEnrollmentVal = useMemo(() => {
    const vals = dynamicEnrollmentData.map(d => 
      enrollmentMetric === "students" ? d.count : enrollmentMetric === "batches" ? d.batches : d.faculty
    );
    const highest = Math.max(...vals, 0);
    return Math.max(5, highest + Math.ceil(highest * 0.2));
  }, [dynamicEnrollmentData, enrollmentMetric]);

  // Dynamic Department Distribution for Donut Chart
  const deptPalette = ["#2563eb", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#ec4899", "#6366f1"];
  const dynamicDeptDistribution = useMemo(() => {
    if (departments.length === 0) return [];
    
    return departments.map((d, index) => {
      const deptStudentsCount = students.filter(s => s.departmentId === d.deptId).length;
      const percent = totalStudents > 0 ? Math.round((deptStudentsCount / totalStudents) * 100) : 0;
      return {
        deptId: d.deptId,
        code: d.code,
        name: d.name,
        count: deptStudentsCount,
        percent: percent,
        color: deptPalette[index % deptPalette.length]
      };
    });
  }, [departments, students, totalStudents]);

  // Dynamic Attendance Computations
  const overallAttendanceAvg = useMemo(() => {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + (parseFloat(s.attendancePercentage) || 100), 0);
    return (sum / students.length).toFixed(1);
  }, [students]);

  const defaultersCount = useMemo(() => {
    return students.filter(s => (parseFloat(s.attendancePercentage) || 100) < 75).length;
  }, [students]);

  // =========================================================================
  // MODAL SUBMISSION HANDLERS
  // =========================================================================
  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;

    const deptCode = deptForm.code.toUpperCase();
    const deptId = deptForm.code.toLowerCase();

    // Determine HOD name and email
    let finalHodName = deptForm.hodName;
    let finalHodEmail = deptForm.hodEmail;

    if (deptForm.assignedStaffUid) {
      const staffMember = users.find(u => u.uid === deptForm.assignedStaffUid);
      if (staffMember) {
        finalHodName = staffMember.name;
        finalHodEmail = deptForm.hodEmail || staffMember.email;
      }
    }

    // 1. Create Department
    const newDept = addDepartment({
      name: deptForm.name,
      code: deptCode,
      commonSpaceEmail: deptForm.commonSpaceEmail || `rvs${deptId}.dept@gmail.com`,
      hodName: finalHodName || "Pending Appointment",
      hodEmail: finalHodEmail || ""
    });

    // 2. Automatically provision Department Common Drive Space (15 GB)
    if (deptForm.commonSpaceEmail) {
      connectSpace({
        spaceId: `${deptId}_common`,
        departmentId: deptId,
        name: `${deptCode} Department Common Space`,
        type: "common",
        batchYear: null,
        accountEmail: deptForm.commonSpaceEmail,
        description: `Department Master Google Drive Space for ${deptForm.name} (15 GB Quota)`
      });
    }

    // 3. Automatically authorize / appoint HOD account
    if (finalHodEmail) {
      appointHOD(deptId, {
        name: finalHodName || `${deptCode} HOD`,
        email: finalHodEmail,
        password: "admin",
        phone: "+91 94433 00000"
      });
    }

    setDeptForm({ 
      name: "", 
      code: "", 
      commonSpaceEmail: "",
      hodEmail: "",
      hodName: "",
      assignedStaffUid: ""
    });
    setShowAddDeptModal(false);
  };

  const handleAppointHOD = (e) => {
    e.preventDefault();
    if (!selectedDeptId) return;

    let finalName = hodForm.name;
    let finalEmail = hodForm.email;

    if (hodForm.selectedStaffUid) {
      const staffMember = users.find(u => u.uid === hodForm.selectedStaffUid);
      if (staffMember) {
        finalName = staffMember.name;
        finalEmail = hodForm.email || staffMember.email;
      }
    }

    if (!finalName || !finalEmail) {
      alert("Please specify the HOD name and official login email.");
      return;
    }

    appointHOD(selectedDeptId, {
      name: finalName,
      email: finalEmail,
      phone: hodForm.phone || "+91 94433 00000",
      password: hodForm.password || "admin"
    });

    setHodForm({ name: "", email: "", phone: "", password: "admin", selectedStaffUid: "" });
    setShowAppointModal(false);
  };

  const handleAuthorizeUser = (e) => {
    e.preventDefault();
    if (!userAuthForm.name || !userAuthForm.email) return;
    authorizeNewUser(userAuthForm);
    setUserAuthForm({ name: "", email: "", password: "password123", role: "hod", departmentId: "", designation: "", phone: "" });
    setShowAuthorizeModal(false);
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    addBatch(batchForm);
    setBatchForm({ regulation: "2021 Autonomous", startYear: "2026", endYear: "2030", departmentId: "", sections: "A, B", accountEmail: "" });
    setShowBatchModal(false);
  };

  const handleAssignTutor = (e) => {
    e.preventDefault();
    if (!tutorForm.tutorName) return;
    assignTutor(tutorForm);
    setTutorForm({ departmentId: "", batch: "2026-2030", section: "A", tutorName: "", tutorEmail: "" });
    setShowTutorModal(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.regNo) return;
    await addStudent(studentForm);
    setStudentForm({ name: "", regNo: "", departmentId: "", batch: "2026-2030", section: "A", email: "", phone: "", cgpa: "0.00", attendancePercentage: "100.0" });
    setShowAddStudentModal(false);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!classForm.name) return;
    addClass(classForm);
    setClassForm({ name: "", departmentId: "", batch: "2026-2030", section: "A", tutorName: "", room: "LH-101", studentCount: 0 });
    setShowAddClassModal(false);
  };

  const handleStoreStaff = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;
    addStaffToGSpace(staffForm);
    setShowAddStaffModal(false);
    setStaffForm({
      name: "",
      email: "",
      empId: "",
      departmentId: "",
      designation: "Assistant Professor",
      qualification: "M.E., Ph.D.",
      phone: "",
      password: "password123",
      role: "staff"
    });
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    if (!resultForm.regNo || !resultForm.studentName) return;
    addOrUpdateResult(resultForm);
    setShowResultModal(false);
    setResultForm({
      regNo: "",
      studentName: "",
      departmentId: "",
      batch: "2026-2030",
      semester: 5,
      cs501: 85,
      cs502: 88,
      cs503: 92
    });
  };

  const handleRegisterFile = (e) => {
    e.preventDefault();
    if (!fileForm.name) return;
    registerNewFile(fileForm);
    setShowRegisterFileModal(false);
    setFileForm({
      name: "",
      category: "Academic Records",
      spaceId: "space_rvs_master",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  };

  const handlePingSpace = async (spaceId) => {
    setPingStatus(prev => ({ ...prev, [spaceId]: { loading: true } }));
    const result = await testSpaceConnection(spaceId);
    setPingStatus(prev => ({
      ...prev,
      [spaceId]: {
        loading: false,
        success: result.success,
        latencyMs: result.latencyMs,
        storageAvailable: result.storageAvailable
      }
    }));
  };

  // Filtered Results for Semester_5_Results.xlsx
  const filteredResults = useMemo(() => {
    return resultsRecords.filter(r => {
      const matchSearch = !resultSearch || 
        r.studentName?.toLowerCase().includes(resultSearch.toLowerCase()) || 
        r.regNo?.toLowerCase().includes(resultSearch.toLowerCase());
      const matchDept = resultDeptFilter === "all" || r.departmentId === resultDeptFilter;
      return matchSearch && matchDept;
    });
  }, [resultsRecords, resultSearch, resultDeptFilter]);

  const resultsStats = useMemo(() => {
    const total = resultsRecords.length;
    const passed = resultsRecords.filter(r => r.status === "PASS").length;
    const failed = total - passed;
    const avgGpa = total > 0 ? (resultsRecords.reduce((acc, r) => acc + (parseFloat(r.gpa) || 0), 0) / total).toFixed(2) : "0.00";
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, passed, failed, avgGpa, passRate };
  }, [resultsRecords]);

  // Filtered Registered Files in Google Drive
  const filteredFiles = useMemo(() => {
    return registeredFiles.filter(f => {
      const matchSearch = !fileSearch || 
        f.name?.toLowerCase().includes(fileSearch.toLowerCase()) || 
        f.accountEmail?.toLowerCase().includes(fileSearch.toLowerCase());
      const matchCat = fileCategoryFilter === "all" || f.category === fileCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [registeredFiles, fileSearch, fileCategoryFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.departmentId && u.departmentId.toLowerCase().includes(userSearch.toLowerCase()));
      
      const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter || (userRoleFilter === "tutor" && u.isTutor);
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const currentTab = (activeTab === "overview" || activeTab === "dashboard") ? "dashboard" : activeTab;

  return (
    <div className="space-y-6 max-w-full pb-12">
      {/* =========================================================================
          1. DASHBOARD OVERVIEW TAB (Real-Time State Integrated)
         ========================================================================= */}
      {currentTab === "dashboard" && (
        <>
          {/* Top Hero Banner: Super Admin Console & Floating Drive Space Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a2769] via-[#0d3b8f] to-[#071d52] p-6 text-white shadow-lg border border-blue-900/60">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            
            <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              {/* Left Column: Console Heading & Action Buttons */}
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                    SUPER ADMIN CONSOLE
                  </span>
                  <span className="text-xs font-semibold text-blue-200">
                    Level 1 Hierarchy Governance
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                  Institutional Student ERP & Drive Management
                </h1>

                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
                  Centralized command for RVS College. Live metrics reflect real records created by the Super Administrator.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => setShowAuthorizeModal(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-blue-900/30 active:scale-95"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Authorize User / Set Role</span>
                  </button>

                  <button
                    onClick={() => setShowAddDeptModal(true)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-red-900/30 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Create Department</span>
                  </button>

                  <button
                    onClick={onOpenConnectModal}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 border border-white/20 backdrop-blur-xs active:scale-95"
                  >
                    <HardDrive className="w-4 h-4 text-blue-300" />
                    <span>Connect Drive Space</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Floating Institutional Drive Storage Card (Real-Time) */}
              <div className="w-full xl:w-80 rounded-xl bg-white p-4.5 text-slate-800 shadow-xl border border-white/20 shrink-0">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Institutional Drive Storage</div>
                      <div className="text-[10px] text-slate-500">Decentralized 15 GB Quota</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    spaces.length > 0 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${spaces.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    {spaces.length > 0 ? "Active" : "0 Spaces"}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900">
                      {usedStorageTotalGB.toFixed(1)} GB
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / {totalStoragePoolGB} GB ({storagePercent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${storagePercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                    <span>{spaces.length} Spaces Connected</span>
                    <span className="text-emerald-600 font-semibold">{availableStorageGB.toFixed(1)} GB Available</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => openInGoogleDrive(spaces[0] || "erprvs@gmail.com")}
                    className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-xs"
                    title="Open Connected Google Drive in new tab"
                  >
                    <span>Open Drive ↗</span>
                  </button>
                  <button
                    onClick={onOpenConnectModal}
                    className="flex-1 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 border border-slate-200 transition text-center flex items-center justify-center gap-1"
                  >
                    <span>Manage Spaces</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 7 Metric Summary Cards Row (100% REAL-TIME DYNAMIC METRICS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
            {/* Total Students */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Students</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalStudents}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-1">
                <span>{totalStudents > 0 ? "Live Enrolled" : "No records yet"}</span>
              </div>
            </div>

            {/* Faculty & Staff */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Faculty & Staff</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalFacultyStaff}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-1">
                <span>{totalFacultyStaff > 0 ? "Authorized Staff" : "0 authorized"}</span>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Departments</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalDepartments}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-1">
                <span>Autonomous Branches</span>
              </div>
            </div>

            {/* Batches */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Batches</span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalBatches}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-1">
                <span>Active Batches</span>
              </div>
            </div>

            {/* Active Classes */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Classes</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalClasses}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-1">
                <span>Class Sections</span>
              </div>
            </div>

            {/* Drive Spaces */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Drive Spaces</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalDriveSpaces}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-1">
                <span>{totalStoragePoolGB} GB Total Free</span>
              </div>
            </div>

            {/* Active Users */}
            <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Users</span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalActiveUsers}</div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{onlineUsersCount} Online Now</span>
              </div>
            </div>
          </div>

          {/* Analytics & Charts Section (Dynamically Derived from real state) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Dynamic Student Enrollment Bar Chart */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Enrollment Trends</h3>
                  <p className="text-xs text-slate-500">Dynamic admissions trend across autonomous batches</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={enrollmentMetric}
                    onChange={(e) => setEnrollmentMetric(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="students">Students</option>
                    <option value="batches">Batches</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
              </div>

              {/* Bar Chart Graphic */}
              <div className="h-64 flex items-end justify-between gap-4 sm:gap-8 px-2 sm:px-6 pt-4 pb-2 border-b border-slate-100">
                {dynamicEnrollmentData.map((item, idx) => {
                  const val = enrollmentMetric === "students" ? item.count : enrollmentMetric === "batches" ? item.batches : item.faculty;
                  const heightPercent = maxEnrollmentVal > 0 ? Math.min(100, Math.round((val / maxEnrollmentVal) * 100)) : 0;
                  const isHovered = hoveredYear === item.year;
                  const isLatest = idx === dynamicEnrollmentData.length - 1;

                  return (
                    <div 
                      key={item.year}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      onMouseEnter={() => setHoveredYear(item.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                    >
                      <div className={`text-[11px] font-bold mb-1 transition-all ${
                        val > 0 ? (isHovered || isLatest ? "text-blue-700 scale-105" : "text-slate-700") : "text-slate-300"
                      }`}>
                        {val}
                      </div>

                      <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-48">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            val === 0 ? "h-1 bg-slate-200" :
                            isLatest 
                              ? "bg-gradient-to-t from-blue-700 to-blue-500 shadow-md shadow-blue-500/20" 
                              : isHovered 
                              ? "bg-blue-600" 
                              : "bg-blue-400/80 group-hover:bg-blue-500"
                          }`}
                          style={{ height: `${Math.max(val > 0 ? 5 : 1, heightPercent)}%` }}
                        />
                      </div>

                      <div className={`text-xs mt-2 font-semibold ${
                        isLatest ? "text-blue-700 font-bold" : "text-slate-500"
                      }`}>
                        {item.year}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Footer Info */}
              <div className="flex items-center justify-between text-xs text-slate-500 mt-4 px-2">
                <span>Total Live Students: <strong>{totalStudents}</strong></span>
                <span className="text-emerald-600 font-semibold">{totalStudents === 0 ? "Ready to add students" : "Data synchronized with local storage"}</span>
                <span className="hidden sm:inline text-blue-600 font-medium">Departments: {totalDepartments}</span>
              </div>
            </div>

            {/* Right: Department-wise Students Donut Chart (Dynamic) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">Department-wise Students</h3>
                  <span className="text-xs text-slate-500 font-semibold">{totalStudents} Total</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Live enrollment distribution across departments</p>

                {/* SVG Donut Graphic */}
                <div className="relative flex items-center justify-center my-3">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Ring */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />

                    {totalStudents > 0 && dynamicDeptDistribution.map((item, idx) => {
                      if (item.percent === 0) return null;
                      // Circumference = 2 * PI * 38 ≈ 238.76
                      const circumference = 238.76;
                      const strokeDash = (item.percent / 100) * circumference;
                      const strokeOffset = dynamicDeptDistribution
                        .slice(0, idx)
                        .reduce((acc, curr) => acc - ((curr.percent / 100) * circumference), 0);

                      return (
                        <circle
                          key={item.deptId}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth="12"
                          strokeDasharray={`${strokeDash} ${circumference}`}
                          strokeDashoffset={strokeOffset}
                        />
                      );
                    })}
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 leading-none">{totalStudents}</span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1">Enrolled</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Legend List */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 max-h-40 overflow-y-auto">
                {dynamicDeptDistribution.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-400">
                    No departments created yet. Click "+ Create Department".
                  </div>
                ) : (
                  dynamicDeptDistribution.map(item => (
                    <div key={item.deptId} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-700 truncate max-w-[130px]">{item.name} ({item.code})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{item.count}</span>
                        <span className="font-bold text-slate-900 w-10 text-right">{item.percent}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel (Direct Real-Time Triggers) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Administrative Actions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Add Student */}
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 font-bold text-xs transition active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>Add Student</span>
              </button>

              {/* Add Faculty */}
              <button
                onClick={() => {
                  setUserAuthForm({ ...userAuthForm, role: "staff" });
                  setShowAuthorizeModal(true);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-900 font-bold text-xs transition active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span>Add Faculty</span>
              </button>

              {/* Create Department */}
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 font-bold text-xs transition active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Create Dept</span>
              </button>

              {/* Create Batch */}
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 font-bold text-xs transition active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <span>Create Batch</span>
              </button>

              {/* Assign Tutor */}
              <button
                onClick={() => setShowTutorModal(true)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-900 font-bold text-xs transition active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Assign Tutor</span>
              </button>

              {/* Connect Drive Space */}
              <button
                onClick={onOpenConnectModal}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-900 font-bold text-xs transition active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <span>Connect Space</span>
              </button>
            </div>
          </div>

          {/* Academic Departments Carousel / Grid (Real-Time Dynamic List) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Academic Departments</h3>
                <p className="text-xs text-slate-500">Live departments, appointed HODs, and allocated Google Drive spaces</p>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Department</span>
              </button>
            </div>

            {departments.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-2xs">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-800">No Academic Departments Added Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  You are logged in as Super Admin. Click below to add your first department (e.g. CSE, ECE, MECH, AI-DS).
                </p>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  + Create First Department
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {departments.map((dept) => {
                  const deptSpaces = spaces.filter(s => s.departmentId === dept.deptId);
                  const deptStudentsCount = students.filter(s => s.departmentId === dept.deptId).length;
                  const deptBatchesCount = batches.filter(b => b.departmentId === dept.deptId).length;

                  return (
                    <div key={dept.deptId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-sm shadow-xs">
                            {dept.code}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {deptBatchesCount} Batches
                            </span>
                            <button
                              onClick={() => {
                                if (confirm(`Delete Department ${dept.name} (${dept.code})?`)) {
                                  deleteDepartment(dept.deptId);
                                }
                              }}
                              className="text-slate-400 hover:text-red-600 p-1 rounded"
                              title="Delete Department"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mt-3">{dept.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{dept.commonSpaceEmail}</p>

                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Head of Dept:</span>
                            <span className="font-bold text-slate-800 truncate max-w-[130px]">
                              {dept.hodName || "Pending Appointment"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Connected Spaces:</span>
                            <span className="font-bold text-blue-700">{deptSpaces.length} Spaces</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Enrolled Students:</span>
                            <span className="font-bold text-slate-700">{deptStudentsCount} Students</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedDeptId(dept.deptId);
                            setShowAppointModal(true);
                          }}
                          className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                        >
                          Appoint / Change HOD
                        </button>
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Academic Calendar & Deadlines Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Academic Calendar & Upcoming Milestones</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Autonomous Cycle 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">OCT 15</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">Academic</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Internal Assessment - II</div>
                  <p className="text-[11px] text-slate-500 mt-1">Autonomous continuous evaluation cycle.</p>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-3">All Branches</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">OCT 20</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded">Council</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Academic Council Meeting</div>
                  <p className="text-[11px] text-slate-500 mt-1">Review curriculum & autonomous credits.</p>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-3">Boardroom</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">OCT 25</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100/60 px-1.5 py-0.2 rounded">Event</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Freshers Induction Program</div>
                  <p className="text-[11px] text-slate-500 mt-1">First year student orientation ceremony.</p>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-3">Auditorium</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">OCT 28</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded">Feedback</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Student Feedback Due</div>
                  <p className="text-[11px] text-slate-500 mt-1">Mid-semester proctor feedback window.</p>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-3">ERP Portal</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">NOV 01</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100/60 px-1.5 py-0.2 rounded">Exams</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Semester Exam Applications</div>
                  <p className="text-[11px] text-slate-500 mt-1">Anna University Autonomous examination forms.</p>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-3">Exam Cell</div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Real-Time Audit Activities + Storage Donut Gauge + System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Real Activities (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Live Institutional Audit Trail</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{auditLogs.length} Events</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {auditLogs.slice(0, 6).map((log, index) => (
                  <div key={log.id || index} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {log.details || log.action}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-mono text-blue-700">{log.actor}</span>
                        <span>•</span>
                        <span>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Just now"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drive Space Gauge (3 cols) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">Drive Storage Meter</h3>
                  <HardDrive className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-xs text-slate-500 mb-4">Decentralized Google Drive quota utilization</p>

                <div className="flex flex-col items-center justify-center my-2">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        strokeDasharray={`${storagePercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-black text-slate-900">{storagePercent}%</span>
                      <span className="text-[9px] font-semibold text-slate-400 uppercase">Utilized</span>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                    <div className="text-xs font-bold text-slate-800">
                      {usedStorageTotalGB.toFixed(1)} GB of {totalStoragePoolGB} GB
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      {availableStorageGB.toFixed(1)} GB Available
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenConnectModal}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-center"
              >
                + Connect New Space
              </button>
            </div>

            {/* System Status & Operational Health (4 cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">System Operational Status</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    All Operational
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Core services, authentication, and database integrity</p>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600 font-medium">Google OAuth (Firebase)</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Online
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600 font-medium">Decentralized Drive API</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Connected (GAS v2.0)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600 font-medium">Database & RBAC</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Synchronized
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600 font-medium">Cloud Serverless Cost</span>
                    <span className="font-bold text-blue-600">₹0.00 / month</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Backup: Automated</span>
                <span>Active Account: erprvs@gmail.com</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          2. USER MANAGEMENT TAB (Real Users Table with Delete & Toggle)
         ========================================================================= */}
      {(currentTab === "users" || currentTab === "users_auth") && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">User Management & Permissions</h2>
                <p className="text-xs text-slate-500">Live directory of authorized users. You can add, toggle, or remove access.</p>
              </div>

              <button
                onClick={() => setShowAuthorizeModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Authorize New User</span>
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: `All (${users.length})` },
                  { id: "admin", label: `Admins (${users.filter(u => u.role === "admin").length})` },
                  { id: "hod", label: `HODs (${users.filter(u => u.role === "hod").length})` },
                  { id: "tutor", label: `Tutors (${users.filter(u => u.isTutor).length})` },
                  { id: "staff", label: `Faculty (${users.filter(u => u.role === "staff").length})` },
                  { id: "student", label: `Students (${users.filter(u => u.role === "student").length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setUserRoleFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      userRoleFilter === tab.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, email, dept..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Official Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid || u.email} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              u.name?.charAt(0) || "U"
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{u.designation || "User"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "admin" ? "bg-red-100 text-red-800 border border-red-200" :
                          u.role === "hod" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                          u.isTutor ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          u.role === "staff" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                          "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {u.role === "admin" ? "Super Admin" : u.role === "hod" ? "HOD" : u.isTutor ? "Class Tutor" : u.role === "staff" ? "Faculty" : "Student"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold uppercase text-slate-800">{u.departmentId || "All / Central"}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleUserStatus(u.uid)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full transition ${
                            u.isActive !== false ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                          }`}
                          title="Click to toggle account active status"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{u.isActive !== false ? "Active" : "Suspended"}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role !== "admin" && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove user access for ${u.name} (${u.email})?`)) {
                                  deleteUser(u.uid);
                                }
                              }}
                              className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                              title="Delete User Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                        No users found. Click "+ Authorize New User" to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. ACADEMICS TAB
         ========================================================================= */}
      {currentTab === "academics" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Autonomous Curriculum & Regulations</h2>
            <p className="text-xs text-slate-500 mb-4">Curriculum frameworks, credit schemes, and autonomous syllabus tracking</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Autonomous</span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">Regulation 2021 (Autonomous)</h3>
                <p className="text-xs text-slate-500 mt-1">Applicable for Batches 2021-2025, 2022-2026, 2023-2027.</p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                  <div>Total Credits: <strong>165 Credits</strong></div>
                  <div>CBCS Electives: <strong>Active</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Upcoming</span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">Regulation 2025 (Autonomous)</h3>
                <p className="text-xs text-slate-500 mt-1">Applicable for Batches 2025-2029, 2026-2030 onwards.</p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                  <div>Total Credits: <strong>160 Credits</strong></div>
                  <div>AICTE Model Curriculum: <strong>Aligned</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Curriculum</span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">Academic Calendar 2026-2027</h3>
                <p className="text-xs text-slate-500 mt-1">Odd & Even Semester working days, IAT dates, and holidays.</p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                  <div>Working Days: <strong>90 Days / Semester</strong></div>
                  <div>Status: <strong>Approved by Council</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. DEPARTMENTS TAB (Real List with Add & Delete)
         ========================================================================= */}
      {currentTab === "departments" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Academic Departments ({departments.length})</h2>
                <p className="text-xs text-slate-500">Autonomous engineering branches and appointed HODs</p>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Department</span>
              </button>
            </div>

            {departments.length === 0 ? (
              <div className="py-12 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Departments Created</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Click below to create your first department.</p>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  + Create Department
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {departments.map((dept) => (
                  <div key={dept.deptId} className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {dept.code}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete Department ${dept.name}?`)) {
                            deleteDepartment(dept.deptId);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mt-3">{dept.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{dept.commonSpaceEmail}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">HOD:</span>
                        <span className="font-bold text-slate-800">{dept.hodName || "Not Appointed"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Students:</span>
                        <span className="font-bold text-blue-700">{students.filter(s => s.departmentId === dept.deptId).length} Enrolled</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDeptId(dept.deptId);
                        setShowAppointModal(true);
                      }}
                      className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-red-700 text-xs font-bold rounded-lg transition"
                    >
                      Appoint / Change HOD
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. BATCHES & SECTIONS TAB (Real List with Add & Delete)
         ========================================================================= */}
      {currentTab === "batches" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Batches & Sections Registry ({batches.length})</h2>
                <p className="text-xs text-slate-500">Graduation batches, regulation mappings, and section allocations</p>
              </div>
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Batch</span>
              </button>
            </div>

            {batches.length === 0 ? (
              <div className="py-12 text-center">
                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Batches Created Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Click below to create an academic batch (e.g. 2026-2030).</p>
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  + Create First Batch
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                {batches.map(b => (
                  <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {b.batch}
                      </span>
                      <button
                        onClick={() => deleteBatch(b.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                        title="Delete Batch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">{b.departmentId.toUpperCase()} Department</h4>
                    <div className="text-xs text-slate-500 mt-1">Regulation: <strong>{b.regulation}</strong></div>
                    <div className="text-xs text-slate-500 mt-1">Sections: <strong>{Array.isArray(b.sections) ? b.sections.join(", ") : b.sections}</strong></div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                      <span>{students.filter(s => s.batch === b.batch && s.departmentId === b.departmentId).length} Students</span>
                      <span>Batch Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          6. CLASSES TAB (Real List with Add & Delete)
         ========================================================================= */}
      {currentTab === "classes" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Class Allocations ({classes.length})</h2>
                <p className="text-xs text-slate-500">Live section schedules, classroom mapping, and class tutors</p>
              </div>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Class</span>
              </button>
            </div>

            {classes.length === 0 ? (
              <div className="py-12 text-center">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Classes Added Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Click below to add a class section.</p>
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  + Add First Class
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                      <th className="py-2.5 px-3">Class Name</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Batch & Section</th>
                      <th className="py-2.5 px-3">Class Tutor</th>
                      <th className="py-2.5 px-3">Hall / Room</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classes.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{c.name}</td>
                        <td className="py-2.5 px-3 font-semibold text-blue-700 uppercase">{c.departmentId}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{c.batch} (Sec {c.section})</td>
                        <td className="py-2.5 px-3 text-slate-700 font-semibold">{c.tutorName || "Pending"}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{c.room}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => deleteClass(c.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Delete Class"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. DRIVE SPACES REGISTRY TAB (Real List with Add, Ping & Direct Drive Open)
         ========================================================================= */}
      {currentTab === "spaces" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Google Drive Spaces Registry ({spaces.length})</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {totalStoragePoolGB} GB Pool
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Decentralized 15 GB quota spaces. Click &quot;Open in Google Drive ↗&quot; to redirect directly into each account folder.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenScriptGuide}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>GAS Deploy Guide</span>
                </button>
                <button
                  onClick={onOpenConnectModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Connect Drive Space</span>
                </button>
              </div>
            </div>

            {spaces.length === 0 ? (
              <div className="py-12 text-center">
                <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Drive Spaces Connected</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Connect a Gmail account with your Google Apps Script URL.</p>
                <button
                  onClick={onOpenConnectModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  + Connect Space
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4.5 mt-5">
                {spaces.map(s => {
                  const ping = pingStatus[s.spaceId];
                  const spaceFiles = registeredFiles.filter(f => f.spaceId === s.spaceId || f.accountEmail === s.accountEmail);
                  const isMaster = s.type === "master" || s.accountEmail === "erprvs@gmail.com";

                  return (
                    <div key={s.spaceId} className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                      isMaster 
                        ? "border-blue-300 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-xs" 
                        : "border-slate-200 bg-white hover:border-blue-300 shadow-2xs"
                    }`}>
                      <div>
                        {/* Header: Icon, Tags, Disconnect */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                              isMaster ? "bg-blue-600 text-white shadow-xs" : "bg-blue-50 text-blue-600"
                            }`}>
                              <HardDrive className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isMaster 
                                  ? "text-blue-800 bg-blue-100 border-blue-200"
                                  : s.type === "common"
                                  ? "text-purple-800 bg-purple-50 border-purple-200"
                                  : "text-emerald-800 bg-emerald-50 border-emerald-200"
                              }`}>
                                {isMaster ? "INSTITUTIONAL MASTER" : s.type ? s.type.toUpperCase() + " SPACE" : "BATCH SPACE"}
                              </span>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {s.spaceId}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Connected
                            </span>
                            {!isMaster && (
                              <button
                                onClick={() => {
                                  if (confirm(`Disconnect space ${s.name}?`)) {
                                    deleteSpace(s.spaceId);
                                  }
                                }}
                                className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-100 transition"
                                title="Disconnect Space"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Space Name & Email */}
                        <div className="mt-3.5">
                          <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-xs font-mono font-medium text-slate-600 truncate">{s.accountEmail}</span>
                          </div>
                          {s.description && (
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {s.description}
                            </p>
                          )}
                        </div>

                        {/* Storage Progress */}
                        <div className="mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center text-xs text-slate-700 mb-1.5 font-medium">
                            <span>Storage Usage</span>
                            <span className="font-bold">{s.usedStorageGB || 0.1} GB / 15.0 GB</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isMaster ? "bg-blue-600" : "bg-emerald-600"
                              }`} 
                              style={{ width: `${Math.max(2, Math.round(((s.usedStorageGB || 0.1) / 15.0) * 100))}%` }} 
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                            <span>Free: {(15.0 - (s.usedStorageGB || 0.1)).toFixed(1)} GB</span>
                            <span className="text-emerald-700 font-bold">Health: 100% OK</span>
                          </div>
                        </div>

                        {/* Files Stored inside this Space */}
                        <div className="mt-3">
                          <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                            <span>Workbook & File Registry:</span>
                            <span className="text-slate-400 text-[10px]">{spaceFiles.length} files</span>
                          </div>
                          {spaceFiles.length === 0 ? (
                            <div className="text-[10px] text-slate-400 italic">No files registered yet</div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {spaceFiles.map(f => (
                                <span 
                                  key={f.id} 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-semibold border border-blue-200"
                                  title={`${f.name} (${f.recordsCount || 0} rows)`}
                                >
                                  <FileSpreadsheet className="w-2.5 h-2.5 text-blue-600" />
                                  <span>{f.name}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Live Ping Status */}
                        {ping && (
                          <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] flex items-center justify-between text-emerald-800 font-medium">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              GAS Bridge Active
                            </span>
                            <span className="font-mono text-[10px] font-bold text-emerald-700">
                              {ping.latencyMs}ms
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Direct Actions: Open in Google Drive & Ping */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => openInGoogleDrive(s)}
                          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                          title="Open Google Drive folder in a new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open in Google Drive ↗</span>
                        </button>

                        <button
                          onClick={() => handlePingSpace(s.spaceId)}
                          disabled={ping?.loading}
                          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 disabled:opacity-50"
                          title="Ping Google Apps Script WebApp"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${ping?.loading ? "animate-spin text-blue-600" : ""}`} />
                          <span>{ping?.loading ? "Pinging..." : "Ping"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          8. STUDENTS TAB (Real List with Add & Delete)
         ========================================================================= */}
      {currentTab === "students" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Student Directory ({students.length})</h2>
                <p className="text-xs text-slate-500">Live roster of students enrolled in the ERP and batch Drive spaces</p>
              </div>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Student</span>
              </button>
            </div>

            {students.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Students Enrolled Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Click below to enroll your first student.</p>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  + Add First Student
                </button>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                      <th className="py-2.5 px-3">Reg No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Batch & Sec</th>
                      <th className="py-2.5 px-3">CGPA</th>
                      <th className="py-2.5 px-3">Attendance</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(s => (
                      <tr key={s.regNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.regNo}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{s.name}</td>
                        <td className="py-2.5 px-3 font-semibold text-blue-700 uppercase">{s.departmentId}</td>
                        <td className="py-2.5 px-3">{s.batch} (Sec {s.section})</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{s.cgpa || "0.00"}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-600">{s.attendancePercentage || 100}%</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {s.status || "Active"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${s.name} (${s.regNo})?`)) {
                                deleteStudent(s.regNo);
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          9. FACULTY TAB (Real GSpace Storage: erprvs@gmail.com -> Faculty.xlsx)
         ========================================================================= */}
      {currentTab === "faculty" && (
        <div className="space-y-5">
          {/* Header & Informational Banner */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md border border-blue-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500 text-white">
                    Master GSpace Storage
                  </span>
                  <span className="text-xs text-blue-200 font-mono">
                    erprvs@gmail.com &bull; /RVS_Master/Faculty.xlsx
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Institutional Faculty &amp; Staff Registry
                </h3>
                <p className="text-xs text-blue-100/90 max-w-2xl">
                  Staff details are stored directly in the Institutional Master Google Drive Space (<code className="bg-white/10 px-1 py-0.5 rounded text-blue-200 font-mono">erprvs@gmail.com</code>). Staff can sign in with their own email, and Super Admin can appoint them as Department HODs or Class Tutors.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => openInGoogleDrive("erprvs@gmail.com")}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-white/20 active:scale-95"
                  title="Open Faculty.xlsx in Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
                  <span>Open in Drive ↗</span>
                </button>

                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-950/40 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Store Staff in GSpace</span>
                </button>
              </div>
            </div>
          </div>

          {/* Faculty Listing */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Authorized Faculty &amp; Teaching Staff ({facultyList.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Live staff roster synchronized with Google Drive <code className="text-blue-700 font-mono">Faculty.xlsx</code>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Staff Member</span>
                </button>
              </div>
            </div>

            {facultyList.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">No Faculty Stored Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5 max-w-md mx-auto">
                  Click below to record your first teaching staff details. The record will be stored in <strong className="text-slate-700">erprvs@gmail.com</strong> Google Drive (<code className="font-mono text-blue-700">Faculty.xlsx</code>) and authorized for portal sign-in.
                </p>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Store First Staff in GSpace</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                      <th className="py-2.5 px-3">Emp ID</th>
                      <th className="py-2.5 px-3">Faculty Name</th>
                      <th className="py-2.5 px-3">Official Email</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Designation</th>
                      <th className="py-2.5 px-3">GSpace Status</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {facultyList.map((f, idx) => (
                      <tr key={f.uid || idx} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          {f.empId || `EMP-${1000 + idx}`}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {f.name}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {f.email}
                        </td>
                        <td className="py-3 px-3 font-bold text-blue-700 uppercase">
                          {f.departmentId || "General"}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {f.designation || (f.role === "hod" ? "Head of Department" : "Assistant Professor")}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            Faculty.xlsx
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleUserStatus(f.uid)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                              f.isActive !== false
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${f.isActive !== false ? "bg-emerald-500" : "bg-red-500"}`} />
                            {f.isActive !== false ? "Active" : "Suspended"}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Appoint as HOD */}
                            <button
                              onClick={() => {
                                setSelectedDeptId(f.departmentId || "cse");
                                setHodForm({
                                  name: f.name,
                                  email: f.email,
                                  phone: f.phone || "+91 94433 00000",
                                  password: "admin",
                                  selectedStaffUid: f.uid
                                });
                                setShowAppointModal(true);
                              }}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200 transition"
                              title="Promote to Department Head (HOD)"
                            >
                              Appoint HOD
                            </button>

                            {/* Assign as Class Tutor */}
                            <button
                              onClick={() => {
                                setTutorForm({
                                  departmentId: f.departmentId || "cse",
                                  batch: "2026-2030",
                                  section: "A",
                                  tutorName: f.name,
                                  tutorEmail: f.email
                                });
                                setShowTutorModal(true);
                              }}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md border border-purple-200 transition"
                              title="Assign as Section Class Tutor"
                            >
                              Assign Tutor
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Remove staff record for ${f.name} (${f.email})?`)) {
                                  deleteUser(f.uid);
                                  deleteStaffFromGSpace(f.email);
                                }
                              }}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-slate-100 transition"
                              title="Delete Staff"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          10. TUTORS TAB (Real Tutor Assignments)
         ========================================================================= */}
      {currentTab === "tutors" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Class Tutor Management ({tutorAssignments.length})</h2>
                <p className="text-xs text-slate-500">Live mappings of faculty as class incharge mentors</p>
              </div>
              <button
                onClick={() => setShowTutorModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Assign Tutor</span>
              </button>
            </div>

            {tutorAssignments.length === 0 ? (
              <div className="py-12 text-center">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Class Tutors Assigned Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Click below to assign a faculty member as a class tutor.</p>
                <button
                  onClick={() => setShowTutorModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  + Assign First Tutor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {tutorAssignments.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Sec {t.section}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{t.departmentId}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">{t.tutorName}</h4>
                    <div className="text-xs text-slate-500 mt-1 font-mono">{t.tutorEmail}</div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-700">
                      <span>Batch: {t.batch}</span>
                      <span>Assigned: {t.assignedAt || "Active"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          11. ACADEMIC RECORDS TAB (Real Semester 5 Results: Semester_5_Results.xlsx)
         ========================================================================= */}
      {currentTab === "records" && (
        <div className="space-y-5">
          {/* Top KPI Cards for Academic Results */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Evaluated Students</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{resultsStats.total}</div>
              <span className="text-[10px] text-slate-400">Semester 5 Roster</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Passed Candidates</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{resultsStats.passed}</div>
              <span className="text-[10px] text-emerald-700 font-bold">{resultsStats.passRate}% Pass Rate</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Re-Appear (RA)</span>
              <div className="text-2xl font-black text-red-600 mt-1">{resultsStats.failed}</div>
              <span className="text-[10px] text-red-600 font-semibold">Arrears to clear</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Average GPA</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{resultsStats.avgGpa}</div>
              <span className="text-[10px] text-slate-400">Out of 10.0 Scale</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Autonomous Scheme</span>
              <div className="text-xs font-bold text-purple-700 mt-2">Regulation 2021</div>
              <span className="text-[10px] text-slate-400">Anna University Autonomous</span>
            </div>
          </div>

          {/* Main Results Table & Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Autonomous Semester 5 Results (Semester_5_Results.xlsx)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Live Workbook
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronized with Google Drive. Contains individual subject marks, calculated GPA, and status.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openInGoogleDrive("erprvs@gmail.com")}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  title="Open in Google Drive / Sheets"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Open in Drive ↗</span>
                </button>

                <button
                  onClick={() => {
                    if (resultsRecords.length === 0) {
                      alert("No results to export.");
                      return;
                    }
                    const headers = "Reg_No,Student_Name,Dept,Batch,CS501_DS,CS502_DBMS,CS503_ML,GPA,Status\n";
                    const rows = resultsRecords.map(r => `${r.regNo},"${r.studentName}",${r.departmentId},${r.batch},${r.cs501},${r.cs502},${r.cs503},${r.gpa},${r.status}`).join("\n");
                    const blob = new Blob([headers + rows], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Semester_5_Results.csv";
                    a.click();
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setShowResultModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Enter Student Result</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name or reg no..."
                  value={resultSearch}
                  onChange={(e) => setResultSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={resultDeptFilter}
                  onChange={(e) => setResultDeptFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.deptId} value={d.deptId}>{d.code}</option>
                  ))}
                  {departments.length === 0 && <option value="cse">CSE</option>}
                </select>
              </div>
            </div>

            {/* Results Table */}
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-4">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-700">No Semester 5 Results Recorded Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 max-w-md mx-auto">
                  Click below to record student grades for CS501 Data Science, CS502 DBMS, and CS503 Machine Learning.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShowResultModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    + Enter First Student Result
                  </button>
                  <button
                    onClick={() => {
                      addOrUpdateResult({
                        regNo: "921722104001",
                        studentName: "Aadhira S",
                        departmentId: "cse",
                        batch: "2026-2030",
                        semester: 5,
                        cs501: 88,
                        cs502: 92,
                        cs503: 95
                      });
                      addOrUpdateResult({
                        regNo: "921722104002",
                        studentName: "Barath Kumar M",
                        departmentId: "cse",
                        batch: "2026-2030",
                        semester: 5,
                        cs501: 76,
                        cs502: 84,
                        cs503: 79
                      });
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    + Load Demo Grade Sheet
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                      <th className="py-2.5 px-3">Reg No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Dept</th>
                      <th className="py-2.5 px-3 text-center">CS501 (DS)</th>
                      <th className="py-2.5 px-3 text-center">CS502 (DBMS)</th>
                      <th className="py-2.5 px-3 text-center">CS503 (ML)</th>
                      <th className="py-2.5 px-3 text-center">GPA</th>
                      <th className="py-2.5 px-3 text-center">Result</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResults.map(r => (
                      <tr key={r.id || r.regNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.regNo}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{r.studentName}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-700 uppercase">{r.departmentId}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">{r.cs501}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">{r.cs502}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">{r.cs503}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-slate-900">{r.gpa}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "PASS" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete result record for ${r.studentName}?`)) {
                                deleteResult(r.id || r.regNo);
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Delete Result"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          12. ATTENDANCE TAB (Derived from live students)
         ========================================================================= */}
      {currentTab === "attendance" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Institutional Attendance Overview</h2>
            <p className="text-xs text-slate-500 mb-4">Live attendance calculated from enrolled student records</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Overall College Attendance</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{overallAttendanceAvg}%</div>
                <div className="text-[10px] text-slate-400 mt-1">Calculated from {totalStudents} students</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Enrolled Students</div>
                <div className="text-2xl font-black text-blue-600 mt-1">{totalStudents}</div>
                <div className="text-[10px] text-slate-400 mt-1">Active in ERP</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Defaulters (&lt; 75%)</div>
                <div className="text-2xl font-black text-red-600 mt-1">{defaultersCount}</div>
                <div className="text-[10px] text-slate-400 mt-1">Students below attendance threshold</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Departments</div>
                <div className="text-2xl font-black text-purple-600 mt-1">{totalDepartments}</div>
                <div className="text-[10px] text-slate-400 mt-1">Branches tracked</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          13. EXAMS TAB
         ========================================================================= */}
      {currentTab === "exams" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Examinations & Autonomous Evaluations</h2>
            <p className="text-xs text-slate-500 mb-4">Internal Assessment Tests (IAT-1, IAT-2), Model Exams, and End-Semester schedules</p>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Upcoming</span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">Internal Assessment - II (Odd Sem 2026)</h4>
                  <p className="text-xs text-slate-500">Scheduled Oct 15-20, 2026 for all engineering branches.</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">Download Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          14. GOOGLE DRIVE INTEGRATION TAB
         ========================================================================= */}
      {currentTab === "gdrive" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Google Drive Decentralized Architecture Hub</h2>
            <p className="text-xs text-slate-500 mb-4">1-File Apps Script bridge connecting free 15 GB Gmail drives to the ERP</p>
            
            <div className="p-5 rounded-xl bg-blue-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">1-File Apps Script (Code.gs)</span>
                <button 
                  onClick={onOpenScriptGuide}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  View Full Script & Deploy Guide
                </button>
              </div>
              <p className="text-xs text-blue-100">
                Deploy this Google Apps Script Web App in each Gmail account. 
                The Web App handles CORS, student JSON records, and file uploads directly inside the Google Drive folder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLES & PERMISSIONS MATRIX TAB (Level 1 to Level 5 Hierarchy)
         ========================================================================= */}
      {(currentTab === "permissions" || currentTab === "roles") && (
        <div className="space-y-5">
          {/* Top Hero: Role Hierarchy Blueprint */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a2569] to-[#071a4c] text-white shadow-lg border border-blue-900">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                    Access Control Matrix
                  </span>
                  <span className="text-xs text-blue-200">
                    5-Tier ERP &amp; Drive Authorization
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Institutional Roles &amp; Permissions Matrix
                </h2>
                <p className="text-xs text-blue-100/90 max-w-2xl mt-1 leading-relaxed">
                  Clear separation between identity, ERP administrative roles, and decentralized Google Drive storage. Super Admin holds global authority; HOD governs department operations; Tutors mentor specific sections.
                </p>
              </div>

              {/* Badges for 5 tiers */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  L1: Super Admin
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  L2: Dept HOD
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  L3: Faculty
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  L4: Class Tutor
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  L5: Student
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Matrix Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Module &amp; Capability Matrix</h3>
                <p className="text-xs text-slate-500">Effective permissions mapped to user types and Google Drive scopes</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Active Policy: Enforced
              </span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold">
                    <th className="py-3 px-3.5">Capability / Action</th>
                    <th className="py-3 px-3 text-center">Super Admin</th>
                    <th className="py-3 px-3 text-center">Dept HOD</th>
                    <th className="py-3 px-3 text-center">Faculty</th>
                    <th className="py-3 px-3 text-center">Class Tutor</th>
                    <th className="py-3 px-3 text-center">Student</th>
                    <th className="py-3 px-3 text-right">Governing Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Category: Institutional Governance */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900">
                    <td colSpan={7} className="py-2 px-3.5 text-[11px] uppercase tracking-wider text-slate-600">
                      1. Institutional Governance &amp; Structure
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Add / Remove Academic Departments</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Global</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Appoint / Reassign Department HOD</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Global</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Assign Faculty as Class Incharge / Tutor</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Only</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Department</span></td>
                  </tr>

                  {/* Category: Google Drive Architecture */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900">
                    <td colSpan={7} className="py-2 px-3.5 text-[11px] uppercase tracking-wider text-slate-600">
                      2. Google Drive Storage (GSpace Decentralized Pool)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Provision Master Institutional Space (erprvs@gmail.com)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Global</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Connect Batch-Specific Drive Space (e.g. rvscse2026@gmail.com)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Only</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Department</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Direct Open in Google Drive Folder (Redirect ↗)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ All Spaces</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Spaces</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Shared Only</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Batch Space</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Batch View</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Dynamic</span></td>
                  </tr>

                  {/* Category: User Accounts & Authentication */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900">
                    <td colSpan={7} className="py-2 px-3.5 text-[11px] uppercase tracking-wider text-slate-600">
                      3. User Management &amp; Access Control
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Authorize New User Emails for ERP Sign-In</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Staff</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Global</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Suspend / Reactivate User Accounts</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Global</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Inspect Immutable Security Audit Logs</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full Trail</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Global</span></td>
                  </tr>

                  {/* Category: Academics & Results */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900">
                    <td colSpan={7} className="py-2 px-3.5 text-[11px] uppercase tracking-wider text-slate-600">
                      4. Academics, Grading &amp; Class Operations
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Enter / Edit Autonomous Grades (Semester_5_Results.xlsx)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full Override</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Review</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Subject Mark</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Class View</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Own Grades</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Class / Section</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Deploy Class Tasks &amp; Google Forms</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Campus Wide</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Wide</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Subject Tasks</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Section Forms</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Submissions</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Section</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">Review &amp; Approve Student Profile Corrections</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full Override</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Dept Oversight</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">&mdash;</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Class Level</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Submit Request</td>
                    <td className="py-2.5 px-3 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Section</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FILE & DOCUMENT REGISTRY TAB (Faculty.xlsx, Students.xlsx, etc.)
         ========================================================================= */}
      {(currentTab === "files" || currentTab === "documents") && (
        <div className="space-y-5">
          {/* Top KPI Cards for Registered Files */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Registered Workbooks</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{registeredFiles.length}</div>
              <span className="text-[10px] text-blue-700 font-bold">Spreadsheets &amp; PDFs</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Institutional Master Files</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {registeredFiles.filter(f => f.accountEmail === "erprvs@gmail.com").length}
              </div>
              <span className="text-[10px] text-slate-400">Stored in erprvs@gmail.com</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Connected GSpaces</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{spaces.length}</div>
              <span className="text-[10px] text-emerald-700 font-bold">Active 15 GB Accounts</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Sync Pipeline Status</span>
              <div className="text-sm font-black text-emerald-600 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Apps Script
              </div>
              <span className="text-[10px] text-slate-400">CORS WebApp Enabled</span>
            </div>
          </div>

          {/* Files Registry Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Google Drive File &amp; Workbook Registry ({registeredFiles.length})
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Master Inventory
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional workbooks stored across all connected Gmail Drive accounts. Click &quot;Open in Drive ↗&quot; to redirect directly into each file.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openInGoogleDrive("erprvs@gmail.com")}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  title="Open Master Drive in Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Open Master Drive ↗</span>
                </button>

                <button
                  onClick={() => setShowRegisterFileModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Register New File</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search file name, account, or path..."
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={fileCategoryFilter}
                  onChange={(e) => setFileCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="Staff Registry">Staff Registry</option>
                  <option value="Student Registry">Student Registry</option>
                  <option value="Autonomous Grades">Autonomous Grades</option>
                  <option value="Attendance Logs">Attendance Logs</option>
                  <option value="Curriculum Policy">Curriculum Policy</option>
                </select>
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5 mt-4">
              {filteredFiles.map(file => {
                const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
                const isPdf = file.name.endsWith(".pdf");

                return (
                  <div key={file.id} className="p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between">
                    <div>
                      {/* Top Row: Icon, Category, Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isExcel ? "bg-emerald-50 text-emerald-700" : isPdf ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                          }`}>
                            {isExcel ? <FileSpreadsheet className="w-4.5 h-4.5" /> : <FileText className="w-4.5 h-4.5" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {file.category}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {file.status || "Synchronized"}
                        </span>
                      </div>

                      {/* File Name & Path */}
                      <h4 className="font-bold text-sm text-slate-900 mt-3">{file.name}</h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">{file.path}</p>

                      {/* Drive Space Account */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Drive Account:</span>
                          <span className="font-mono font-bold text-slate-800 truncate max-w-[170px]">{file.accountEmail}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>File Size:</span>
                          <span className="font-semibold text-slate-800">{file.sizeKB} KB</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Live Records:</span>
                          <span className="font-bold text-blue-700">{file.recordsCount || 0} rows</span>
                        </div>
                      </div>

                      {/* Columns / Schema Tags */}
                      {file.columns && file.columns.length > 0 && (
                        <div className="mt-3">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Columns Schema:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {file.columns.slice(0, 5).map(col => (
                              <span key={col} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-mono">
                                {col}
                              </span>
                            ))}
                            {file.columns.length > 5 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[9px] font-mono">
                                +{file.columns.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => openInGoogleDrive(file.driveUrl || file.accountEmail)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                        title="Open file in Google Drive or Sheets"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in Drive ↗</span>
                      </button>

                      <button
                        onClick={() => {
                          syncFileWithDrive(file.id);
                          alert(`Synchronized ${file.name} with Google Drive!`);
                        }}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                        title="Sync with Google Drive via GAS"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          15. NOTIFICATIONS TAB (Real Interactive Circular Broadcaster)
         ========================================================================= */}
      {currentTab === "notifications" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Campus Circulars &amp; Broadcast Notifications ({announcements.length})</h2>
                <p className="text-xs text-slate-500">Official notices broadcast to faculty, students, or department heads</p>
              </div>
              <button
                onClick={() => setShowNoticeModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Broadcast New Circular</span>
              </button>
            </div>

            <div className="space-y-3.5 mt-4">
              {announcements.map((notice) => (
                <div key={notice.id} className="p-4.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        notice.priority === "Urgent" 
                          ? "bg-red-50 text-red-700 border-red-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {notice.priority}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {notice.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">{notice.date}</span>
                      <button
                        onClick={() => {
                          setAnnouncements(prev => prev.filter(n => n.id !== notice.id));
                        }}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2.5">{notice.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          16. REPORTS TAB (Real Dynamic CSV Export Engine)
         ========================================================================= */}
      {currentTab === "reports" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Institutional Reports &amp; Compliance Analytics</h2>
            <p className="text-xs text-slate-500 mb-4">Export live compliance reports for NAAC Criterion, NBA, NIRF, and Anna University</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Report 1 */}
              <div className="p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Student Enrollment Master</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Complete nominal roll of {totalStudents} enrolled students with CGPA, batch, and attendance.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const headers = "Reg_No,Name,Department,Batch,Section,Email,Phone,CGPA,Attendance_Percentage,Status\n";
                    const rows = students.map(s => `${s.regNo},"${s.name}",${s.departmentId},${s.batch},${s.section},${s.email},${s.phone},${s.cgpa || "0.00"},${s.attendancePercentage || 100},${s.status || "Active"}`).join("\n");
                    downloadCSV(`RVS_Students_Master_${new Date().toISOString().split("T")[0]}.csv`, headers + rows);
                  }}
                  className="mt-4 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Report 2 */}
              <div className="p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Faculty Roster &amp; Workload</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Official faculty register ({totalFacultyStaff} members) stored in erprvs@gmail.com GSpace.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const headers = "Emp_ID,Name,Email,Department,Designation,Status\n";
                    const rows = facultyList.map((f, i) => `${f.empId || `EMP-${1000 + i}`},"${f.name}",${f.email},${f.departmentId || "General"},${f.designation || f.role},${f.isActive !== false ? "Active" : "Suspended"}`).join("\n");
                    downloadCSV(`RVS_Faculty_Roster_${new Date().toISOString().split("T")[0]}.csv`, headers + rows);
                  }}
                  className="mt-4 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Report 3 */}
              <div className="p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Drive Storage Audit Report</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Decentralized 15 GB quota utilization audit for {totalDriveSpaces} connected Google Drive spaces.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const headers = "Space_ID,Name,Type,Account_Email,Used_Storage_GB,Total_Storage_GB,Available_GB,Status\n";
                    const rows = spaces.map(s => `${s.spaceId},"${s.name}",${s.type || "batch"},${s.accountEmail},${s.usedStorageGB || 0.1},${s.totalStorageGB || 15},${((s.totalStorageGB || 15) - (s.usedStorageGB || 0.1)).toFixed(1)},${s.status}`).join("\n");
                    downloadCSV(`RVS_Drive_Spaces_Audit_${new Date().toISOString().split("T")[0]}.csv`, headers + rows);
                  }}
                  className="mt-4 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Report 4 */}
              <div className="p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Semester 5 Exam Results</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Autonomous evaluation marks and GPA from Semester_5_Results.xlsx ({resultsRecords.length} records).
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const headers = "Reg_No,Student_Name,Dept,Batch,CS501_DS,CS502_DBMS,CS503_ML,GPA,Status\n";
                    const rows = resultsRecords.map(r => `${r.regNo},"${r.studentName}",${r.departmentId},${r.batch},${r.cs501},${r.cs502},${r.cs503},${r.gpa},${r.status}`).join("\n");
                    downloadCSV(`RVS_Semester_5_Results_${new Date().toISOString().split("T")[0]}.csv`, headers + rows);
                  }}
                  className="mt-4 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          17. SECURITY & AUDIT LOGS TAB (Real Immutable Log Trail)
         ========================================================================= */}
      {currentTab === "audit" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Security & Audit Logs ({auditLogs.length})</h2>
            <p className="text-xs text-slate-500 mb-4">Immutable log trail of administrative actions, authorizations, and drive connections</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                    <th className="py-2.5 px-3">Log ID</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{log.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{log.actor}</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">{log.action}</span></td>
                      <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "Just now"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          18. SYSTEM SETTINGS TAB
         ========================================================================= */}
      {currentTab === "settings" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">System & Institutional Settings</h2>
            <p className="text-xs text-slate-500 mb-4">Institution identity, autonomous credentials, and backup policies</p>

            <div className="max-w-2xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institution Full Name</label>
                <input
                  type="text"
                  readOnly
                  value="RVS College of Engineering & Technology"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institution Code</label>
                  <input
                    type="text"
                    readOnly
                    value="9217 (Anna University)"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Accreditation</label>
                  <input
                    type="text"
                    readOnly
                    value="NAAC B+ Accredited • Autonomous"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Super Administrator Account</label>
                <input
                  type="text"
                  readOnly
                  value="erprvs@gmail.com"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Changes are logged in the immutable audit trail.</span>
                <button
                  onClick={() => alert("Settings verified.")}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}

      {/* MODAL 1: AUTHORIZE USER / SET ROLE */}
      {showAuthorizeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Authorize User / Set Role</h3>
                  <p className="text-[11px] text-slate-500">Provide user credentials and select access level</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAuthorizeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthorizeUser} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. S. Priya"
                  value={userAuthForm.name}
                  onChange={(e) => setUserAuthForm({ ...userAuthForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address (OAuth & Login)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hod.ece@rvs.edu or rvsece.dept@gmail.com"
                  value={userAuthForm.email}
                  onChange={(e) => setUserAuthForm({ ...userAuthForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Permission</label>
                  <select
                    value={userAuthForm.role}
                    onChange={(e) => setUserAuthForm({ ...userAuthForm, role: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option value="hod">HOD / Department Head</option>
                    <option value="staff">Faculty / Teaching Staff</option>
                    <option value="student">Student</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  {departments.length === 0 ? (
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={userAuthForm.departmentId}
                      onChange={(e) => setUserAuthForm({ ...userAuthForm, departmentId: e.target.value.toLowerCase() })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  ) : (
                    <select
                      value={userAuthForm.departmentId}
                      onChange={(e) => setUserAuthForm({ ...userAuthForm, departmentId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                    >
                      <option value="">Select Department...</option>
                      {departments.map(d => (
                        <option key={d.deptId} value={d.deptId}>{d.code} - {d.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Professor & HOD"
                    value={userAuthForm.designation}
                    onChange={(e) => setUserAuthForm({ ...userAuthForm, designation: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    value={userAuthForm.password}
                    onChange={(e) => setUserAuthForm({ ...userAuthForm, password: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthorizeModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm"
                >
                  Authorize User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE DEPARTMENT */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Create Academic Department & Master Space</h3>
                  <p className="text-[11px] text-slate-500">Super Admin creates the branch and provisions its 15GB space</p>
                </div>
              </div>
              <button onClick={() => setShowAddDeptModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science and Engineering"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Code (Abbreviation)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE"
                    value={deptForm.code}
                    onChange={(e) => {
                      const code = e.target.value.toUpperCase();
                      setDeptForm({ 
                        ...deptForm, 
                        code,
                        commonSpaceEmail: `rvs${code.toLowerCase()}.dept@gmail.com`,
                        hodEmail: `hod.${code.toLowerCase()}@rvs.edu`
                      });
                    }}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Common Space Gmail (15 GB)</label>
                  <input
                    type="email"
                    placeholder="e.g. rvscse.dept@gmail.com"
                    value={deptForm.commonSpaceEmail}
                    onChange={(e) => setDeptForm({ ...deptForm, commonSpaceEmail: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* HOD Appointment Section */}
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
                <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                  <span>Head of Department (HOD) Authority</span>
                  <span className="text-[10px] font-semibold text-blue-600">Assign Staff or Official Email</span>
                </div>

                {users.filter(u => u.role === "staff").length > 0 && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Promote Existing Staff Member (Optional)
                    </label>
                    <select
                      value={deptForm.assignedStaffUid}
                      onChange={(e) => {
                        const uid = e.target.value;
                        const s = users.find(u => u.uid === uid);
                        setDeptForm({
                          ...deptForm,
                          assignedStaffUid: uid,
                          hodName: s ? s.name : deptForm.hodName,
                          hodEmail: s ? s.email : deptForm.hodEmail
                        });
                      }}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    >
                      <option value="">Select a staff member to assign as HOD...</option>
                      {users.filter(u => u.role === "staff").map(st => (
                        <option key={st.uid} value={st.uid}>{st.name} ({st.email})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">HOD Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. R. Kumar"
                      value={deptForm.hodName}
                      onChange={(e) => setDeptForm({ ...deptForm, hodName: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">HOD Login Email</label>
                    <input
                      type="email"
                      placeholder="e.g. hod.cse@rvs.edu"
                      value={deptForm.hodEmail}
                      onChange={(e) => setDeptForm({ ...deptForm, hodEmail: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Create Department & Provision Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: APPOINT HOD */}
      {showAppointModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Appoint / Change Department HOD</h3>
                  <p className="text-[11px] text-slate-500">Assign a staff member or set department HOD credentials</p>
                </div>
              </div>
              <button onClick={() => setShowAppointModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAppointHOD} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Department</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                >
                  <option value="">Select Department...</option>
                  {departments.map(d => (
                    <option key={d.deptId} value={d.deptId}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>

              {/* Promote Staff Member Dropdown */}
              {users.filter(u => u.role === "staff").length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Promote Existing Faculty / Staff Member
                  </label>
                  <select
                    value={hodForm.selectedStaffUid}
                    onChange={(e) => {
                      const uid = e.target.value;
                      const s = users.find(u => u.uid === uid);
                      setHodForm({
                        ...hodForm,
                        selectedStaffUid: uid,
                        name: s ? s.name : hodForm.name,
                        email: s ? s.email : hodForm.email
                      });
                    }}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="">Select an existing staff member...</option>
                    {users.filter(u => u.role === "staff").map(st => (
                      <option key={st.uid} value={st.uid}>{st.name} ({st.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">HOD Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. R. Kumar"
                  value={hodForm.name}
                  onChange={(e) => setHodForm({ ...hodForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official HOD Email (Login & OAuth)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hod.cse@rvs.edu or rvscse.dept@gmail.com"
                  value={hodForm.email}
                  onChange={(e) => setHodForm({ ...hodForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAppointModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE BATCH */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Create Academic Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                {departments.length === 0 ? (
                  <input
                    type="text"
                    placeholder="e.g. CSE"
                    value={batchForm.departmentId}
                    onChange={(e) => setBatchForm({ ...batchForm, departmentId: e.target.value.toLowerCase() })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                ) : (
                  <select
                    value={batchForm.departmentId}
                    onChange={(e) => setBatchForm({ ...batchForm, departmentId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="">Select Department...</option>
                    {departments.map(d => (
                      <option key={d.deptId} value={d.deptId}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Year</label>
                  <input
                    type="number"
                    value={batchForm.startYear}
                    onChange={(e) => setBatchForm({ ...batchForm, startYear: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={batchForm.endYear}
                    onChange={(e) => setBatchForm({ ...batchForm, endYear: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sections (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. A, B, C"
                  value={batchForm.sections}
                  onChange={(e) => setBatchForm({ ...batchForm, sections: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ASSIGN TUTOR */}
      {showTutorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Assign Class Tutor / Mentor</h3>
              <button onClick={() => setShowTutorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTutor} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                {departments.length === 0 ? (
                  <input
                    type="text"
                    placeholder="e.g. CSE"
                    value={tutorForm.departmentId}
                    onChange={(e) => setTutorForm({ ...tutorForm, departmentId: e.target.value.toLowerCase() })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                ) : (
                  <select
                    value={tutorForm.departmentId}
                    onChange={(e) => setTutorForm({ ...tutorForm, departmentId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="">Select Department...</option>
                    {departments.map(d => (
                      <option key={d.deptId} value={d.deptId}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-2030"
                    value={tutorForm.batch}
                    onChange={(e) => setTutorForm({ ...tutorForm, batch: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={tutorForm.section}
                    onChange={(e) => setTutorForm({ ...tutorForm, section: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tutor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. M. Deepa"
                  value={tutorForm.tutorName}
                  onChange={(e) => setTutorForm({ ...tutorForm, tutorName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tutor Email</label>
                <input
                  type="email"
                  placeholder="e.g. deepa.m@rvs.edu"
                  value={tutorForm.tutorEmail}
                  onChange={(e) => setTutorForm({ ...tutorForm, tutorEmail: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTutorModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Assign Class Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD STUDENT (Real State Direct Insert) */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Add Student Record</h3>
                  <p className="text-[11px] text-slate-500">Live insertion into student master & metric updates</p>
                </div>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aadhavan K"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Register Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 921724104001"
                    value={studentForm.regNo}
                    onChange={(e) => setStudentForm({ ...studentForm, regNo: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  {departments.length === 0 ? (
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={studentForm.departmentId}
                      onChange={(e) => setStudentForm({ ...studentForm, departmentId: e.target.value.toLowerCase() })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase"
                    />
                  ) : (
                    <select
                      value={studentForm.departmentId}
                      onChange={(e) => setStudentForm({ ...studentForm, departmentId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase"
                    >
                      <option value="">Select Department...</option>
                      {departments.map(d => (
                        <option key={d.deptId} value={d.deptId}>{d.code} - {d.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-2030"
                    value={studentForm.batch}
                    onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={studentForm.section}
                    onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CGPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 8.75"
                    value={studentForm.cgpa}
                    onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attendance %</label>
                  <input
                    type="number"
                    placeholder="e.g. 95.0"
                    value={studentForm.attendancePercentage}
                    onChange={(e) => setStudentForm({ ...studentForm, attendancePercentage: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: ADD CLASS */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Academic Class Section</h3>
              <button onClick={() => setShowAddClassModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE - First Year Sec A"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  {departments.length === 0 ? (
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={classForm.departmentId}
                      onChange={(e) => setClassForm({ ...classForm, departmentId: e.target.value.toLowerCase() })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  ) : (
                    <select
                      value={classForm.departmentId}
                      onChange={(e) => setClassForm({ ...classForm, departmentId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="">Select Department...</option>
                      {departments.map(d => (
                        <option key={d.deptId} value={d.deptId}>{d.code}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={classForm.section}
                    onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Hall / Room</label>
                <input
                  type="text"
                  placeholder="e.g. LH-201"
                  value={classForm.room}
                  onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: STORE STAFF IN MASTER GSPACE (Faculty.xlsx) */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Store Staff in Master GSpace</h3>
                <p className="text-[11px] text-slate-500">Record saved in erprvs@gmail.com &bull; Faculty.xlsx</p>
              </div>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStoreStaff} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-1042"
                    value={staffForm.empId}
                    onChange={(e) => setStaffForm({ ...staffForm, empId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh@rvs.edu"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  {departments.length === 0 ? (
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={staffForm.departmentId}
                      onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value.toLowerCase() })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  ) : (
                    <select
                      value={staffForm.departmentId}
                      onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="">Select Department...</option>
                      {departments.map(d => (
                        <option key={d.deptId} value={d.deptId}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Lab Instructor">Lab Instructor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Tech, Ph.D."
                    value={staffForm.qualification}
                    onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94433 11222"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                <strong>GSpace Auto-Sync:</strong> Saving this form updates <code className="font-mono text-blue-700">Faculty.xlsx</code> inside <strong className="text-slate-800">erprvs@gmail.com</strong> Google Drive and authorizes this staff email for instant ERP login.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Store Staff in GSpace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: ENTER EXAM RESULT (Semester_5_Results.xlsx) */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Enter Semester 5 Student Grade</h3>
                <p className="text-[11px] text-slate-500">Autonomous evaluation &bull; Semester_5_Results.xlsx</p>
              </div>
              <button onClick={() => setShowResultModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResult} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Register Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 921722104015"
                  value={resultForm.regNo}
                  onChange={(e) => setResultForm({ ...resultForm, regNo: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaviya S"
                  value={resultForm.studentName}
                  onChange={(e) => setResultForm({ ...resultForm, studentName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={resultForm.departmentId}
                    onChange={(e) => setResultForm({ ...resultForm, departmentId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="cse">CSE</option>
                    <option value="ece">ECE</option>
                    <option value="mech">MECH</option>
                    <option value="eee">EEE</option>
                    <option value="it">IT</option>
                    <option value="aids">AI &amp; DS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={resultForm.batch}
                    onChange={(e) => setResultForm({ ...resultForm, batch: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Subject Marks */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Course Marks (Out of 100):
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">CS501 (DS)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={resultForm.cs501}
                      onChange={(e) => setResultForm({ ...resultForm, cs501: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">CS502 (DBMS)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={resultForm.cs502}
                      onChange={(e) => setResultForm({ ...resultForm, cs502: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">CS503 (ML)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={resultForm.cs503}
                      onChange={(e) => setResultForm({ ...resultForm, cs503: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>

                {/* Live Preview GPA */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                  <span className="font-semibold text-slate-600">Calculated GPA:</span>
                  <span className="font-mono font-black text-blue-700">
                    {(((parseInt(resultForm.cs501 || 0) + parseInt(resultForm.cs502 || 0) + parseInt(resultForm.cs503 || 0)) / 30).toFixed(2))}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Save to Workbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 10: REGISTER NEW FILE IN DRIVE SPACE */}
      {showRegisterFileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Register New Document in Drive</h3>
                <p className="text-[11px] text-slate-500">Add spreadsheet or PDF to space registry</p>
              </div>
              <button onClick={() => setShowRegisterFileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterFile} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab_Evaluation_2026.xlsx"
                  value={fileForm.name}
                  onChange={(e) => setFileForm({ ...fileForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={fileForm.category}
                  onChange={(e) => setFileForm({ ...fileForm, category: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Academic Records">Academic Records</option>
                  <option value="Attendance Logs">Attendance Logs</option>
                  <option value="Staff Registry">Staff Registry</option>
                  <option value="Student Registry">Student Registry</option>
                  <option value="Curriculum Policy">Curriculum Policy</option>
                  <option value="NAAC Documentation">NAAC Documentation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Google Drive Space</label>
                <select
                  value={fileForm.spaceId}
                  onChange={(e) => setFileForm({ ...fileForm, spaceId: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {spaces.map(s => (
                    <option key={s.spaceId} value={s.spaceId}>
                      {s.name} ({s.accountEmail})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterFileModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 11: BROADCAST NEW CAMPUS CIRCULAR */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Broadcast Campus Circular</h3>
                <p className="text-[11px] text-slate-500">Official notice to college community</p>
              </div>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Circular Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of Internal Assessment - II"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={noticeForm.target}
                    onChange={(e) => setNoticeForm({ ...noticeForm, target: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="All Faculty & Students">All Faculty &amp; Students</option>
                    <option value="All Department Heads (HOD)">All Department Heads (HOD)</option>
                    <option value="Class Tutors & Mentors">Class Tutors &amp; Mentors</option>
                    <option value="CSE Department Only">CSE Department Only</option>
                    <option value="ECE Department Only">ECE Department Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Flag</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Body *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed notice content, dates, and instructions..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
