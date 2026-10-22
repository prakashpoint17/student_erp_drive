import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { 
  Building2, 
  Users, 
  UserCheck, 
  GraduationCap, 
  HardDrive, 
  Plus, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  FileCode2,
  Edit2,
  ClipboardCheck,
  FileSpreadsheet,
  Download,
  Search,
  Award,
  Filter,
  AlertTriangle,
  Trash2,
  Mail,
  Phone,
  Calendar,
  X
} from "lucide-react";

export const HodDashboard = ({ activeTab, onOpenConnectModal, onOpenScriptGuide }) => {
  const { currentUser, departments, users, addStaffMember, assignTutorRole } = useAuth();
  const { 
    spaces, 
    students, 
    selectSpace,
    batches,
    classes,
    resultsRecords,
    addOrUpdateResult,
    deleteResult,
    openInGoogleDrive
  } = useDriveSpace();

  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeSpaces = Array.isArray(spaces) ? spaces : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeBatches = Array.isArray(batches) ? batches : [];
  const safeClasses = Array.isArray(classes) ? classes : [];
  const safeResults = Array.isArray(resultsRecords) ? resultsRecords : [];

  // Find HOD's department safely
  const myDept = safeDepartments.find(d => d.deptId === currentUser?.departmentId) || safeDepartments[0] || {
    deptId: currentUser?.departmentId || "general",
    name: "Department Hub",
    code: (currentUser?.departmentId || "DEPT").toUpperCase(),
    commonSpaceEmail: ""
  };

  // Filter department staff, spaces, batches and students
  const deptStaff = safeUsers.filter(u => u.departmentId === myDept.deptId && (u.role === "staff" || u.isTutor));
  const deptSpaces = safeSpaces.filter(s => s.departmentId === myDept.deptId);
  const commonSpace = deptSpaces.find(s => s.type === "common");
  const batchSpaces = deptSpaces.filter(s => s.type === "batch");
  const deptStudents = safeStudents.filter(s => s.departmentId === myDept.deptId);
  const deptBatches = safeBatches.filter(b => b.departmentId === myDept.deptId);
  const deptResults = safeResults.filter(r => r.departmentId === myDept.deptId);

  // Attendance Analytics
  const deptStudentsCount = deptStudents.length;
  const avgDeptAttendance = deptStudentsCount > 0 
    ? (deptStudents.reduce((sum, s) => sum + (parseFloat(s.attendancePercentage) || 100), 0) / deptStudentsCount).toFixed(1)
    : "100.0";
  const defaultersList = deptStudents.filter(s => (parseFloat(s.attendancePercentage) || 100) < 75);
  const eligibleList = deptStudents.filter(s => (parseFloat(s.attendancePercentage) || 100) >= 75);

  // Exam Analytics
  const deptPassed = deptResults.filter(r => r.status === "PASS");
  const deptFailed = deptResults.filter(r => r.status !== "PASS");
  const passRate = deptResults.length > 0 ? Math.round((deptPassed.length / deptResults.length) * 100) : 0;
  const avgGpa = deptResults.length > 0 
    ? (deptResults.reduce((sum, r) => sum + (parseFloat(r.gpa) || 0), 0) / deptResults.length).toFixed(2)
    : "0.00";

  // Filter & Search states for Attendance and Exams
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // 'all' | 'defaulters' | 'eligible'
  const [examSearch, setExamSearch] = useState("");
  const [examBatchFilter, setExamBatchFilter] = useState("all");

  // Add Staff Modal State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "staff123",
    designation: "Assistant Professor",
    phone: "",
    qualification: "M.E. (CSE)",
    experience: "3 Years"
  });

  // Assign Tutor Modal State
  const [showAssignTutorModal, setShowAssignTutorModal] = useState(false);
  const [tutorForm, setTutorForm] = useState({
    staffUid: "",
    batchYear: "2026",
    section: "A"
  });

  // Add Exam Result Modal State
  const [showExamModal, setShowExamModal] = useState(false);
  const [examForm, setExamForm] = useState({
    regNo: "",
    studentName: "",
    batch: "2026-2030",
    semester: 5,
    cs501: 80,
    cs502: 85,
    cs503: 90
  });

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

  const handleExportAttendanceCSV = () => {
    const headers = "Register_No,Student_Name,Batch,Section,Attendance_Percentage,Eligibility_Status,Email,Phone\n";
    const rows = deptStudents.map(s => {
      const att = parseFloat(s.attendancePercentage) || 100;
      const status = att >= 75 ? "Eligible" : "Detention Risk (<75%)";
      return `${s.regNo},"${s.name}",${s.batchYear || s.batch || "2026"},${s.section || "A"},${att}%,${status},${s.email || ""},${s.phone || ""}`;
    }).join("\n");
    downloadCSV(`${myDept.code}_Attendance_Register.csv`, headers + rows);
  };

  const handleExportExamsCSV = () => {
    const headers = "Register_No,Student_Name,Batch,Semester,CS501_DS,CS502_DBMS,CS503_ML,GPA,Status\n";
    const rows = deptResults.map(r => 
      `${r.regNo},"${r.studentName}",${r.batch},${r.semester},${r.cs501},${r.cs502},${r.cs503},${r.gpa},${r.status}`
    ).join("\n");
    downloadCSV(`${myDept.code}_Autonomous_Exam_Results.csv`, headers + rows);
  };

  const handleAddExamResult = (e) => {
    e.preventDefault();
    if (!examForm.regNo || !examForm.studentName) return;
    addOrUpdateResult({
      ...examForm,
      departmentId: myDept.deptId
    });
    setExamForm({
      regNo: "",
      studentName: "",
      batch: "2026-2030",
      semester: 5,
      cs501: 80,
      cs502: 85,
      cs503: 90
    });
    setShowExamModal(false);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;
    addStaffMember({ ...staffForm, departmentId: myDept.deptId });
    setStaffForm({
      name: "",
      email: "",
      password: "staff123",
      designation: "Assistant Professor",
      phone: "",
      qualification: "M.E. (CSE)",
      experience: "3 Years"
    });
    setShowAddStaffModal(false);
  };

  const handleAssignTutor = (e) => {
    e.preventDefault();
    if (!tutorForm.staffUid) return;
    
    // Find batch space
    const targetBatchSpace = spaces.find(s => 
      s.departmentId === myDept.deptId && 
      s.batchYear === parseInt(tutorForm.batchYear)
    );

    assignTutorRole(tutorForm.staffUid, {
      departmentId: myDept.deptId,
      batchYear: parseInt(tutorForm.batchYear),
      section: tutorForm.section,
      spaceId: targetBatchSpace ? targetBatchSpace.spaceId : "cse_2026"
    });

    setShowAssignTutorModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Hub */}
      {activeTab === "overview" && (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-blue-800 to-brand-blue-950 rounded-2xl p-6 text-white shadow-sm border border-brand-blue-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-blue-500 text-white">
                    HOD Command Center
                  </span>
                  <span className="text-xs text-brand-blue-200">Department Level 2 Hierarchy</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {myDept.name} ({myDept.code})
                </h1>
                <p className="text-xs sm:text-sm text-brand-blue-100 mt-1">
                  Manage department faculty, designate class tutors, and orchestrate Common & Batch Google Drive storage spaces.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-3.5 py-2 bg-brand-red-600 hover:bg-brand-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Department Staff</span>
                </button>
                <button
                  onClick={onOpenConnectModal}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-white/20"
                >
                  <HardDrive className="w-4 h-4 text-brand-blue-300" />
                  <span>Connect Batch Space</span>
                </button>
              </div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Department Faculty</span>
                <Users className="w-4 h-4 text-brand-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{deptStaff.length}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Teaching & Research</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Appointed Tutors</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {deptStaff.filter(s => s.isTutor).length}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Authorized Class Incharges</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Connected Drive Spaces</span>
                <HardDrive className="w-4 h-4 text-brand-red-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{deptSpaces.length}</div>
              <div className="text-[11px] text-brand-red-600 font-medium mt-1">1 Common + {batchSpaces.length} Batches</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Department Students</span>
                <GraduationCap className="w-4 h-4 text-brand-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{deptStudents.length}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Under CSE Batches</div>
            </div>
          </div>

          {/* Drive Space Dual-Tier Architecture Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-blue-600" />
                  <span>Department Storage Topology (Decentralized Google Drive)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Separates Common Department master records from isolated Batch-specific student spaces
                </p>
              </div>
              <button
                onClick={onOpenScriptGuide}
                className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-800 flex items-center gap-1"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Apps Script Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Common Space */}
              <div className="p-4 rounded-xl border border-brand-red-200 bg-brand-red-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-red-100 text-brand-red-800 uppercase">
                    Common Dept Space
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">15 GB Free</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{commonSpace?.name || "CSE Common Space"}</h4>
                <p className="text-[11px] font-mono text-slate-600 mt-0.5">{commonSpace?.accountEmail || myDept.commonSpaceEmail}</p>
                <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                  <div>• Faculty & Staff Master Directory</div>
                  <div>• Department Policies & Circulars</div>
                  <div>• HOD Administrative Minutes</div>
                </div>
              </div>

              {/* Batch Spaces */}
              {batchSpaces.map(space => (
                <div key={space.spaceId} className="p-4 rounded-xl border border-brand-blue-200 bg-brand-blue-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue-100 text-brand-blue-800 uppercase">
                      Batch {space.batchYear} Space
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">15 GB Free</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{space.name}</h4>
                  <p className="text-[11px] font-mono text-slate-600 mt-0.5">{space.accountEmail}</p>
                  <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                    <div>• Student Master Database (Sheet)</div>
                    <div>• Assigned Tutor Tasks & Forms</div>
                    <div>• Student Document Vault</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Drive Spaces Setup Tab */}
      {activeTab === "spaces" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Drive Spaces Configuration</h3>
              <p className="text-xs text-slate-500">Each space connects to a Gmail account without a Python backend</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenScriptGuide}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Apps Script Setup
              </button>
              <button
                onClick={onOpenConnectModal}
                className="px-3.5 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect Space</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptSpaces.map(space => {
              const percent = Math.round((space.usedStorageGB / space.totalStorageGB) * 100);
              return (
                <div key={space.spaceId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        space.type === "common" 
                          ? "bg-brand-red-50 text-brand-red-700 border border-brand-red-200" 
                          : "bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200"
                      }`}>
                        {space.type === "common" ? "Common Dept Space" : `Batch ${space.batchYear}`}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{space.name}</h4>
                      <p className="text-xs font-mono text-slate-500">{space.accountEmail}</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Google Drive 15 GB Free Allowance</span>
                      <span className="font-bold text-slate-800">{space.usedStorageGB} GB / 15.0 GB</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-blue-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => selectSpace(space.spaceId)}
                      className="text-brand-blue-600 hover:text-brand-blue-800 font-bold"
                    >
                      Set Active Space
                    </button>
                    <a
                      href="https://drive.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <span>Open Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Staff Directory Tab */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Faculty & Staff</h3>
              <p className="text-xs text-slate-500">HOD has complete authority over staff profiles, qualifications, and role assignments</p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Faculty Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Faculty Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Qualification</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Tutor Assignment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptStaff.map(staff => (
                  <tr key={staff.uid} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={staff.avatar} alt={staff.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-slate-900">{staff.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{staff.designation}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{staff.qualification || "M.E."}</td>
                    <td className="px-4 py-3 text-slate-600">{staff.experience || "3 Years"}</td>
                    <td className="px-4 py-3">
                      {staff.isTutor && staff.assignedClass ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                          Batch {staff.assignedClass.batchYear} - Sec {staff.assignedClass.section}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setTutorForm({ ...tutorForm, staffUid: staff.uid });
                          setShowAssignTutorModal(true);
                        }}
                        className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-800 px-2 py-1 rounded hover:bg-brand-blue-50"
                      >
                        Assign Tutor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tutor Appointments Tab */}
      {activeTab === "tutors" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Class Tutor & Incharge Appointments</h3>
              <p className="text-xs text-slate-500">
                Staff members appointed as tutors gain authorized edit rights over student records for that batch and section
              </p>
            </div>
            <button
              onClick={() => setShowAssignTutorModal(true)}
              className="px-3.5 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Appoint Class Tutor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptStaff.filter(s => s.isTutor).map(tutor => (
              <div key={tutor.uid} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={tutor.avatar} alt={tutor.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{tutor.name}</h4>
                      <p className="text-xs text-slate-500">{tutor.designation}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    Authorized Tutor
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Scope:</span>
                    <span className="font-bold text-slate-900">
                      Batch {tutor.assignedClass?.batchYear} — Section {tutor.assignedClass?.section}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Connected Drive Space:</span>
                    <span className="font-mono text-[11px] text-brand-blue-700">
                      {tutor.assignedClass?.spaceId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Permitted Actions:</span>
                    <span className="text-slate-700 font-medium">Add/Edit Students, Create Tasks, Approve Requests</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Students Roster Tab */}
      {activeTab === "students" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">Department Enrolled Students</h3>
            <p className="text-xs text-slate-500">Consolidated view of all students enrolled across CSE batch spaces</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Register No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Batch & Section</th>
                  <th className="px-4 py-3">CGPA</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Storage Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptStudents.map(student => (
                  <tr key={student.regNo} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-brand-blue-700">{student.regNo}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{student.name}</td>
                    <td className="px-4 py-3">Batch {student.batchYear} - Sec {student.section}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{student.cgpa}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{student.spaceId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Attendance Proctoring Tab */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          {/* Header KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Attendance</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{avgDeptAttendance}%</div>
              <span className="text-[10px] text-emerald-600 font-bold">Department Average</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Eligible (≥75%)</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{eligibleList.length}</div>
              <span className="text-[10px] text-slate-500">Exam Hall Ticket Ready</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Defaulters (&lt;75%)</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{defaultersList.length}</div>
              <span className="text-[10px] text-rose-500 font-bold">Detention Risk</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Students</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{deptStudentsCount}</div>
              <span className="text-[10px] text-slate-500">{myDept.name}</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or Reg No..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="all">All Students ({deptStudentsCount})</option>
                <option value="defaulters">Defaulters &lt;75% ({defaultersList.length})</option>
                <option value="eligible">Eligible ≥75% ({eligibleList.length})</option>
              </select>
            </div>

            <button
              onClick={handleExportAttendanceCSV}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Attendance CSV</span>
            </button>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Register No</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Batch &amp; Section</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Contact Email</th>
                    <th className="px-4 py-3">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deptStudents
                    .filter(s => {
                      const matchSearch = !attendanceSearch || 
                        s.name?.toLowerCase().includes(attendanceSearch.toLowerCase()) || 
                        s.regNo?.includes(attendanceSearch);
                      const att = parseFloat(s.attendancePercentage) || 100;
                      const matchFilter = attendanceFilter === "all" || 
                        (attendanceFilter === "defaulters" && att < 75) || 
                        (attendanceFilter === "eligible" && att >= 75);
                      return matchSearch && matchFilter;
                    })
                    .map(student => {
                      const att = parseFloat(student.attendancePercentage) || 100;
                      const isDefaulter = att < 75;
                      return (
                        <tr key={student.regNo} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3 font-mono font-bold text-blue-700">{student.regNo}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{student.name}</td>
                          <td className="px-4 py-3">Batch {student.batchYear || student.batch || "2026"} - Sec {student.section || "A"}</td>
                          <td className="px-4 py-3 font-bold">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                              isDefaulter 
                                ? "bg-rose-100 text-rose-800 border border-rose-300" 
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}>
                              {att}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isDefaulter 
                                ? "bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-max" 
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max"
                            }`}>
                              {isDefaulter ? <AlertTriangle className="w-3 h-3 text-rose-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              <span>{isDefaulter ? "Detention Risk (<75%)" : "Exam Eligible"}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{student.email || "-"}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{student.phone || "-"}</td>
                        </tr>
                      );
                    })}
                  {deptStudents.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                        No student attendance records found for {myDept.code}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Department Autonomous Exams Tab */}
      {activeTab === "exams" && (
        <div className="space-y-4">
          {/* Header KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Evaluated</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{deptResults.length}</div>
              <span className="text-[10px] text-slate-500">Autonomous Semester</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Passed</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{deptPassed.length}</div>
              <span className="text-[10px] text-emerald-600 font-bold">Clear Standing</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Arrears (RA)</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{deptFailed.length}</div>
              <span className="text-[10px] text-rose-500 font-bold">Re-Appear Required</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Pass Rate</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{passRate}%</div>
              <span className="text-[10px] text-blue-600 font-bold">Department Score</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Average GPA</span>
              <div className="text-2xl font-black text-purple-700 mt-1">{avgGpa}</div>
              <span className="text-[10px] text-slate-500">Out of 10.0</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or Reg No..."
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={examBatchFilter}
                onChange={(e) => setExamBatchFilter(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="all">All Batches</option>
                {deptBatches.map(b => (
                  <option key={b.id || b.batch} value={b.batch}>{b.batch || b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowExamModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Exam Mark</span>
              </button>
              <button
                onClick={handleExportExamsCSV}
                className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Exam Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Register No</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Batch</th>
                    <th className="px-4 py-3 text-center">CS501 (DS)</th>
                    <th className="px-4 py-3 text-center">CS502 (DBMS)</th>
                    <th className="px-4 py-3 text-center">CS503 (ML)</th>
                    <th className="px-4 py-3 text-center">GPA</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deptResults
                    .filter(r => {
                      const matchSearch = !examSearch || 
                        r.studentName?.toLowerCase().includes(examSearch.toLowerCase()) || 
                        r.regNo?.includes(examSearch);
                      const matchBatch = examBatchFilter === "all" || r.batch === examBatchFilter;
                      return matchSearch && matchBatch;
                    })
                    .map(r => (
                      <tr key={r.regNo} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-700">{r.regNo}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{r.studentName}</td>
                        <td className="px-4 py-3 text-slate-600">{r.batch} (Sem {r.semester})</td>
                        <td className="px-4 py-3 text-center font-mono font-bold">{r.cs501}</td>
                        <td className="px-4 py-3 text-center font-mono font-bold">{r.cs502}</td>
                        <td className="px-4 py-3 text-center font-mono font-bold">{r.cs503}</td>
                        <td className="px-4 py-3 text-center font-black text-purple-700">{r.gpa}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                            r.status === "PASS"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => deleteResult?.(r.regNo)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Remove record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {deptResults.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                        No exam evaluation records found for {myDept.code}. Click "+ Record Exam Mark" to add.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Faculty Member ({myDept.code})</h3>
            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Prof. S. Karthikeyan"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="staff.karthik@rvs.edu.in"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={staffForm.qualification}
                    onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98000 12345"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password *</label>
                <input
                  type="text"
                  placeholder="staff123"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Staff member can sign in with this password or their authorized Google account</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white text-xs font-bold rounded-lg"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Tutor Modal */}
      {showAssignTutorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Appoint Class Tutor</h3>
            <form onSubmit={handleAssignTutor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Staff Member *</label>
                <select
                  value={tutorForm.staffUid}
                  onChange={(e) => setTutorForm({ ...tutorForm, staffUid: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Choose Faculty --</option>
                  {deptStaff.map(s => (
                    <option key={s.uid} value={s.uid}>{s.name} ({s.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Year *</label>
                  <select
                    value={tutorForm.batchYear}
                    onChange={(e) => setTutorForm({ ...tutorForm, batchYear: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="2026">Batch 2026</option>
                    <option value="2027">Batch 2027</option>
                    <option value="2028">Batch 2028</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
                  <select
                    value={tutorForm.section}
                    onChange={(e) => setTutorForm({ ...tutorForm, section: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                Granting this role allows the staff to add/edit students and post class tasks in the designated batch Drive space.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignTutorModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  Confirm Tutor Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Exam Result Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Record Autonomous Exam Marks ({myDept.code})</h3>
              <button onClick={() => setShowExamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExamResult} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Register Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 921322104001"
                  value={examForm.regNo}
                  onChange={(e) => setExamForm({ ...examForm, regNo: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya S"
                  value={examForm.studentName}
                  onChange={(e) => setExamForm({ ...examForm, studentName: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                  <select
                    value={examForm.batch}
                    onChange={(e) => setExamForm({ ...examForm, batch: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="2026-2030">2026-2030</option>
                    <option value="2025-2029">2025-2029</option>
                    <option value="2024-2028">2024-2028</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={examForm.semester}
                    onChange={(e) => setExamForm({ ...examForm, semester: parseInt(e.target.value) || 5 })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CS501 (DS)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examForm.cs501}
                    onChange={(e) => setExamForm({ ...examForm, cs501: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CS502 (DBMS)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examForm.cs502}
                    onChange={(e) => setExamForm({ ...examForm, cs502: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CS503 (ML)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examForm.cs503}
                    onChange={(e) => setExamForm({ ...examForm, cs503: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                GPA and PASS/RA status will automatically calculate and sync into Semester_5_Results.xlsx.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
