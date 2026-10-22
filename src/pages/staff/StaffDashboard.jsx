import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { 
  UserCheck, 
  GraduationCap, 
  FileText, 
  ClipboardCheck, 
  Plus, 
  Search, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink, 
  Send, 
  HardDrive, 
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail
} from "lucide-react";

export const StaffDashboard = ({ activeTab }) => {
  const { currentUser, departments, authorizeNewUser } = useAuth();
  const { 
    students, 
    addStudent, 
    updateStudent, 
    tasks, 
    addTask, 
    correctionRequests, 
    reviewCorrectionRequest, 
    activeSpace 
  } = useDriveSpace();

  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeStudents = Array.isArray(students) ? students : [];

  // Find department
  const myDept = safeDepartments.find(d => d.deptId === currentUser?.departmentId);

  // Class Tutor Scope
  const isTutor = currentUser?.isTutor;
  const assignedClass = currentUser?.assignedClass;

  // Filter students for this tutor's class (defensive match)
  const classStudents = safeStudents.filter(s => {
    if (!assignedClass) return false;
    const matchDept = !s.departmentId || s.departmentId === assignedClass.departmentId;
    const matchBatch = s.batch === assignedClass.batch || 
                       String(s.batchYear) === String(assignedClass.batchYear) || 
                       (s.batch && assignedClass.batchYear && String(s.batch).includes(String(assignedClass.batchYear)));
    const matchSec = !assignedClass.section || (s.section || "A").toUpperCase() === String(assignedClass.section).toUpperCase();
    return matchDept && matchBatch && matchSec;
  });

  // Search filter (defensive null-safe)
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStudents = classStudents.filter(s => 
    (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.regNo && s.regNo.includes(searchQuery)) ||
    (s.rollNo && s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Class Attendance Proctoring State
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const classAvgAttendance = classStudents.length > 0
    ? (classStudents.reduce((sum, s) => sum + (parseFloat(s.attendancePercentage) || 100), 0) / classStudents.length).toFixed(1)
    : "100.0";
  const classDefaulters = classStudents.filter(s => (parseFloat(s.attendancePercentage) || 100) < 75);

  const handleExportClassAttendanceCSV = () => {
    const headers = "Register_No,Roll_No,Student_Name,Department,Batch,Section,Attendance_Percentage,Status,Email,Phone\n";
    const rows = classStudents.map(s => {
      const att = parseFloat(s.attendancePercentage) || 100;
      const status = att >= 75 ? "Eligible" : "Defaulter (<75%)";
      return `${s.regNo},${s.rollNo || ""},"${s.name}",${s.departmentId || "CSE"},${s.batch || s.batchYear || "2026"},${s.section || "A"},${att}%,${status},${s.email || ""},${s.phone || ""}`;
    }).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Class_${assignedClass?.batchYear || "2026"}_Sec_${assignedClass?.section || "A"}_Attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    regNo: "",
    rollNo: "",
    name: "",
    email: "",
    password: "student123",
    phone: "",
    bloodGroup: "O +ve",
    dob: "2004-06-15",
    fatherName: "",
    cgpa: "8.50",
    attendancePercentage: 95.0,
    quota: "Govt (Counseling)",
    hosteller: false
  });

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState(null);

  // Add Task Modal State
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    formLink: "",
    deadline: ""
  });

  // Filter pending correction requests for this tutor's students
  const myClassCorrections = correctionRequests.filter(r => {
    if (!assignedClass) return false;
    return r.departmentId === assignedClass.departmentId &&
           r.batchYear === assignedClass.batchYear &&
           r.section === assignedClass.section;
  });

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.regNo || !studentForm.name) return;

    await addStudent({
      ...studentForm,
      departmentId: assignedClass.departmentId,
      batchYear: assignedClass.batchYear,
      section: assignedClass.section,
      spaceId: assignedClass.spaceId || "cse_2026"
    });

    // Authorize student account in auth registry
    if (studentForm.email) {
      authorizeNewUser({
        name: studentForm.name,
        email: studentForm.email,
        password: studentForm.password || "student123",
        role: "student",
        regNo: studentForm.regNo,
        rollNo: studentForm.rollNo,
        departmentId: assignedClass.departmentId,
        batchYear: assignedClass.batchYear,
        section: assignedClass.section
      });
    }

    setStudentForm({
      regNo: "",
      rollNo: "",
      name: "",
      email: "",
      password: "student123",
      phone: "",
      bloodGroup: "O +ve",
      dob: "2004-06-15",
      fatherName: "",
      cgpa: "8.50",
      attendancePercentage: 95.0,
      quota: "Govt (Counseling)",
      hosteller: false
    });
    setShowAddStudentModal(false);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    await updateStudent(editingStudent.regNo, editingStudent);
    setEditingStudent(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title) return;

    await addTask({
      ...taskForm,
      departmentId: assignedClass.departmentId,
      batchYear: assignedClass.batchYear,
      section: assignedClass.section,
      spaceId: assignedClass.spaceId || "cse_2026"
    });

    setTaskForm({ title: "", description: "", formLink: "", deadline: "" });
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs text-center">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-brand-blue-100"
            />
            <h2 className="font-bold text-base text-slate-900 mt-4">{currentUser.name}</h2>
            <p className="text-xs text-brand-blue-700 font-semibold">{currentUser.designation}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isTutor 
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                  : "bg-purple-100 text-purple-800 border border-purple-200"
              }`}>
                {isTutor ? "Class Tutor Assigned" : "Teaching Faculty"}
              </span>

              {isTutor && assignedClass && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left text-xs">
                  <div className="font-bold text-emerald-900">Class Incharge Scope:</div>
                  <div className="text-emerald-800 mt-0.5">
                    Batch {assignedClass.batchYear} — Section {assignedClass.section}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1 font-mono">
                    Storage: {assignedClass.spaceId}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Faculty Details & Qualifications</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block mb-0.5">Department</span>
                <span className="font-bold text-slate-800">{myDept?.name || "Computer Science"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block mb-0.5">Contact Number</span>
                <span className="font-bold text-slate-800">{currentUser.phone || "+91 97890 33445"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block mb-0.5">Highest Qualification</span>
                <span className="font-bold text-slate-800">{currentUser.qualification || "M.E. (CSE)"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block mb-0.5">Teaching Experience</span>
                <span className="font-bold text-slate-800">{currentUser.experience || "8 Years"}</span>
              </div>
            </div>

            <div className="p-4 bg-brand-blue-50 border border-brand-blue-200 rounded-xl text-xs text-brand-blue-900">
              <h4 className="font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-blue-600" />
                Staff Role Permissions
              </h4>
              <p className="text-[11px] text-brand-blue-800">
                All staff can view and manage their personal profile. When designated as a Class Tutor by the HOD, you gain write and edit privileges over the specific batch's Google Sheets records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Class Roster (Tutor Mode) */}
      {activeTab === "my_class" && isTutor && (
        <div className="space-y-4">
          {/* Class Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/20 text-white">
                  Tutor Management Scope
                </span>
                <span className="text-xs text-emerald-200">Authorized Edit Access</span>
              </div>
              <h2 className="text-xl font-bold">
                Batch {assignedClass.batchYear} — Section {assignedClass.section}
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Target Google Sheet Space: <span className="font-mono">{assignedClass.spaceId}</span>
              </p>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Add Student to Sheet</span>
            </button>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student by name, register no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
                />
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Showing <strong className="text-slate-900">{filteredStudents.length}</strong> students
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Register No</th>
                    <th className="px-4 py-3">Roll No</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Blood Group</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">CGPA</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => (
                    <tr key={student.regNo} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-brand-blue-700">{student.regNo}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{student.rollNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{student.phone}</td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 rounded bg-brand-red-50 text-brand-red-700 font-bold border border-brand-red-200 text-[10px]">
                          {student.bloodGroup}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{student.attendancePercentage}%</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{student.cgpa}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-800 flex items-center gap-1 ml-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tasks & Google Forms Manager */}
      {activeTab === "tasks" && isTutor && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Class Tasks & Google Forms</h3>
              <p className="text-xs text-slate-500">
                Publish Google Forms or project milestones to Batch {assignedClass.batchYear} Sec {assignedClass.section}
              </p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Class Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.filter(t => t.section === assignedClass.section).map(task => (
              <div key={task.taskId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200">
                      {task.taskId}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{task.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-600">{task.description}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Deadline: <strong className="text-brand-red-700">{task.deadline || "Open"}</strong>
                  </div>
                  {task.formLink && (
                    <a
                      href={task.formLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-blue-600 hover:text-brand-blue-800 font-semibold flex items-center gap-1"
                    >
                      <span>Google Form</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Student Correction Requests */}
      {activeTab === "corrections" && isTutor && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-brand-blue-600" />
              <span>Student Profile Correction Requests</span>
            </h3>
            <p className="text-xs text-slate-500">
              Students submit requests to update their details; approving automatically synchronizes the change to the Google Sheet
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Field to Change</th>
                  <th className="px-4 py-3">Current Value</th>
                  <th className="px-4 py-3">Requested Value</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myClassCorrections.map(req => (
                  <tr key={req.requestId} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{req.studentName}</div>
                      <div className="text-[11px] font-mono text-brand-blue-700">{req.studentRegNo}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{req.field}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{req.currentValue}</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold font-mono text-[11px]">{req.requestedValue}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{req.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        req.status === "Approved" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                        req.status === "Rejected" ? "bg-brand-red-50 text-brand-red-800 border border-brand-red-200" :
                        "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {req.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reviewCorrectionRequest(req.requestId, "Approved", currentUser.name)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                            title="Approve & Update Google Sheet"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => reviewCorrectionRequest(req.requestId, "Rejected", currentUser.name)}
                            className="p-1 rounded bg-brand-red-600 hover:bg-brand-red-700 text-white"
                            title="Reject Request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Class Attendance Proctoring Tab (Class Tutor Scope) */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          {isTutor && assignedClass ? (
            <>
              {/* Header KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Class Average</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{classAvgAttendance}%</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Continuous Evaluation</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Enrolled Students</span>
                  <div className="text-2xl font-black text-blue-700 mt-1">{classStudents.length}</div>
                  <span className="text-[10px] text-slate-500">Sec {assignedClass.section} Roster</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Attendance Defaulters</span>
                  <div className="text-2xl font-black text-rose-600 mt-1">{classDefaulters.length}</div>
                  <span className="text-[10px] text-rose-500 font-bold">&lt;75% Detention Warning</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Proctor Scope</span>
                  <div className="text-sm font-black text-slate-900 mt-2 truncate">
                    {assignedClass.departmentId?.toUpperCase()} {assignedClass.batchYear}
                  </div>
                  <span className="text-[10px] text-slate-500">Section {assignedClass.section}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search class student or Reg No..."
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleExportClassAttendanceCSV}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Class Attendance (.CSV)</span>
                </button>
              </div>

              {/* Attendance Register Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Register No</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3 text-center">Current %</th>
                        <th className="px-4 py-3">Proctoring Status</th>
                        <th className="px-4 py-3">Student Phone</th>
                        <th className="px-4 py-3 text-right">Attendance Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classStudents
                        .filter(s => 
                          !attendanceSearch || 
                          s.name?.toLowerCase().includes(attendanceSearch.toLowerCase()) || 
                          s.regNo?.includes(attendanceSearch)
                        )
                        .map(student => {
                          const att = parseFloat(student.attendancePercentage) || 100;
                          const isDefaulter = att < 75;
                          return (
                            <tr key={student.regNo} className="hover:bg-slate-50/80 transition">
                              <td className="px-4 py-3 font-mono font-bold text-blue-700">{student.regNo}</td>
                              <td className="px-4 py-3 font-semibold text-slate-900">{student.name}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
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
                                  <span>{isDefaulter ? "Detention Warning (<75%)" : "Exam Eligible"}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                                {student.phone || "-"}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => updateStudent(student.regNo, { attendancePercentage: Math.min(100, Math.round(att + 1)) })}
                                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition"
                                    title="Mark Present (+1%)"
                                  >
                                    + Present
                                  </button>
                                  <button
                                    onClick={() => updateStudent(student.regNo, { attendancePercentage: Math.max(0, Math.round(att - 1)) })}
                                    className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200 transition"
                                    title="Mark Absent (-1%)"
                                  >
                                    - Absent
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {classStudents.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                            No students registered yet in Batch {assignedClass.batchYear} Section {assignedClass.section}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Class Attendance Proctoring</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Class Attendance Proctoring is exclusively designated for appointed Class Tutors. If you are a Class Incharge, contact your Head of Department to map your tutor role.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Add Student to Batch {assignedClass.batchYear} (Section {assignedClass.section})
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Register No *</label>
                  <input
                    type="text"
                    placeholder="921322104006"
                    value={studentForm.regNo}
                    onChange={(e) => setStudentForm({ ...studentForm, regNo: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll No *</label>
                  <input
                    type="text"
                    placeholder="22CSE06"
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  placeholder="Kavitha M."
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="kavitha.22cse06@rvs.edu.in"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98400 11223"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="text"
                  placeholder="student123"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Student can sign in with this password or with their authorized Google account</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={studentForm.bloodGroup}
                    onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="O +ve">O +ve</option>
                    <option value="A +ve">A +ve</option>
                    <option value="B +ve">B +ve</option>
                    <option value="AB +ve">AB +ve</option>
                    <option value="O -ve">O -ve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admission Quota</label>
                  <select
                    value={studentForm.quota}
                    onChange={(e) => setStudentForm({ ...studentForm, quota: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Govt (Counseling)">Govt (Counseling)</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  Save to Google Sheets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Edit Student: {editingStudent.name} ({editingStudent.regNo})
            </h3>
            <form onSubmit={handleUpdateStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attendance Percentage</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingStudent.attendancePercentage}
                  onChange={(e) => setEditingStudent({ ...editingStudent, attendancePercentage: parseFloat(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CGPA</label>
                <input
                  type="text"
                  value={editingStudent.cgpa}
                  onChange={(e) => setEditingStudent({ ...editingStudent, cgpa: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Create Task / Google Form Announcement</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  placeholder="Elective Subject Choice Selection"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Description</label>
                <textarea
                  rows="2"
                  placeholder="Fill out the attached Google Form before the deadline."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Form Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/forms/d/..."
                  value={taskForm.formLink}
                  onChange={(e) => setTaskForm({ ...taskForm, formLink: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
