import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { 
  GraduationCap, 
  UserCheck, 
  FileText, 
  Send, 
  HardDrive, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Phone, 
  Mail, 
  Award,
  Sparkles
} from "lucide-react";

export const StudentPortal = ({ activeTab }) => {
  const { currentUser, departments, users } = useAuth();
  const { 
    students, 
    tasks, 
    correctionRequests, 
    submitCorrectionRequest, 
    activeSpace 
  } = useDriveSpace();

  const safeStudents = Array.isArray(students) ? students : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Find student record from students master
  const studentData = safeStudents.find(s => s.regNo === currentUser?.regNo) || currentUser;
  const myDept = safeDepartments.find(d => d.deptId === studentData.departmentId);

  // Dynamic Tutor Lookup
  const assignedTutor = safeUsers.find(u => 
    u.isTutor && 
    u.assignedClass && 
    u.assignedClass.departmentId === studentData.departmentId &&
    u.assignedClass.batchYear === studentData.batchYear &&
    u.assignedClass.section === studentData.section
  );

  // Filter tasks for this student's class
  const myTasks = safeTasks.filter(t => 
    t.departmentId === studentData.departmentId &&
    t.batchYear === studentData.batchYear &&
    (t.section === studentData.section || t.section === "All")
  );

  // Filter correction requests submitted by this student
  const myRequests = correctionRequests.filter(r => r.studentRegNo === studentData.regNo);

  // Correction Modal State
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [reqForm, setReqForm] = useState({
    field: "Phone Number",
    requestedValue: "",
    reason: ""
  });

  const handleSubmitCorrection = (e) => {
    e.preventDefault();
    if (!reqForm.requestedValue || !reqForm.reason) return;

    let currentValue = "";
    if (reqForm.field === "Phone Number") currentValue = studentData.phone;
    if (reqForm.field === "Email Address") currentValue = studentData.email;
    if (reqForm.field === "Blood Group") currentValue = studentData.bloodGroup;

    submitCorrectionRequest({
      field: reqForm.field,
      currentValue: currentValue || "Current",
      requestedValue: reqForm.requestedValue,
      reason: reqForm.reason
    });

    setReqForm({ field: "Phone Number", requestedValue: "", reason: "" });
    setShowCorrectionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-brand-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-brand-blue-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={studentData.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"}
                  alt={studentData.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-red-600 text-white">
                      Student Portal
                    </span>
                    <span className="text-xs text-brand-blue-200">
                      Batch {studentData.batchYear} — Section {studentData.section}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold">{studentData.name}</h1>
                  <p className="text-xs text-brand-blue-200 font-mono mt-0.5">
                    Reg No: {studentData.regNo} • Roll: {studentData.rollNo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCorrectionModal(true)}
                className="px-3.5 py-2 bg-brand-red-600 hover:bg-brand-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Detail Update</span>
              </button>
            </div>
          </div>

          {/* Academic Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">Overall Attendance</span>
              <div className="text-2xl font-black text-emerald-600">
                {studentData.attendancePercentage}%
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Eligible for University Exam
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">Cumulative GPA</span>
              <div className="text-2xl font-black text-brand-blue-700">
                {studentData.cgpa}
              </div>
              <span className="text-[11px] text-brand-blue-600 font-semibold mt-1 block">
                First Class with Distinction
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">Blood Group</span>
              <div className="text-2xl font-black text-brand-red-700">
                {studentData.bloodGroup}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Verified Medical Record
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">Admission Quota</span>
              <div className="text-lg font-bold text-slate-800">
                {studentData.quota || "Govt"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                {studentData.hosteller ? "Hosteller" : "Day Scholar"}
              </span>
            </div>
          </div>

          {/* Information & Tutor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Student Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block mb-0.5">Department</span>
                  <span className="font-bold text-slate-800">{myDept?.name || "Computer Science"}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block mb-0.5">College Email</span>
                  <span className="font-mono text-slate-800">{studentData.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block mb-0.5">Mobile Contact</span>
                  <span className="font-mono text-slate-800">{studentData.phone}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block mb-0.5">Parent / Father Name</span>
                  <span className="font-bold text-slate-800">{studentData.fatherName || "Rajendran K."}</span>
                </div>
              </div>
            </div>

            {/* Class Tutor Contact */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Assigned Class Tutor
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-blue-50 border border-brand-blue-200 flex items-center justify-center text-brand-blue-700">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {assignedTutor ? assignedTutor.name : (studentData.tutorName || "Tutor Pending Appointment")}
                  </h4>
                  <p className="text-[11px] text-brand-blue-700 font-medium">
                    {assignedTutor ? assignedTutor.designation : "Assigned by Head of Department"}
                  </p>
                </div>
              </div>

              {assignedTutor ? (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{assignedTutor.email}</span>
                  </div>
                  {assignedTutor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{assignedTutor.phone}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                  No tutor assigned to your section yet.
                </div>
              )}

              <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                Class tutors review and approve all student profile correction requests before changes reflect in the master Google Sheet.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Class Tasks & Google Forms Tab */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Class Tasks & Google Forms</h3>
            <p className="text-xs text-slate-500">Announcements and Google Forms submitted by your class tutor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map(task => (
              <div key={task.taskId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200">
                      {task.taskId}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{task.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Open
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
                      className="px-3 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition text-xs"
                    >
                      <span>Open Google Form</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Correction Requests Tab */}
      {activeTab === "corrections" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Profile Correction & Detail Updates</h3>
              <p className="text-xs text-slate-500">
                Official change requests sent to your class tutor. Once approved, the Google Sheet is updated automatically.
              </p>
            </div>
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="px-3.5 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Correction Request</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Request ID</th>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Current Value</th>
                    <th className="px-4 py-3">Requested Update</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Reviewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRequests.map(req => (
                    <tr key={req.requestId} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-brand-blue-700">{req.requestId}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{req.field}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{req.currentValue}</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-emerald-700">{req.requestedValue}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">{req.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          req.status === "Approved" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                          req.status === "Rejected" ? "bg-brand-red-50 text-brand-red-800 border border-brand-red-200" :
                          "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 font-medium">
                        {req.reviewedBy || "Pending Review"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Batch Drive Space Info Tab */}
      {activeTab === "space_info" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-blue-50 border border-brand-blue-200 rounded-xl text-brand-blue-700">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Batch 2026 Dedicated Google Drive Space</h3>
              <p className="text-xs text-slate-500 font-mono">Account: {activeSpace?.accountEmail || "rvscse2026@gmail.com"}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <p>
              <strong>Why Decentralized Drive Storage?</strong> Your academic records, internal grades, and submitted certificates are stored directly in the department's dedicated Google Account (<code className="text-brand-blue-700 font-mono">rvscse2026@gmail.com</code>).
            </p>
            <p>
              This ensures that even if this ERP web portal ever goes offline or changes servers, your data remains 100% safe, untouched, and independently accessible inside that designated Google Drive!
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Free Tier Quota: 15 GB Free Storage</span>
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-brand-blue-600 hover:text-brand-blue-800 font-bold flex items-center gap-1"
            >
              <span>Visit Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Request Profile Detail Update</h3>
            <p className="text-xs text-slate-500">
              This request will be sent to your class tutor for verification and approval.
            </p>
            <form onSubmit={handleSubmitCorrection} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Field to Update *</label>
                <select
                  value={reqForm.field}
                  onChange={(e) => setReqForm({ ...reqForm, field: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Phone Number">Phone Number</option>
                  <option value="Email Address">Email Address</option>
                  <option value="Blood Group">Blood Group</option>
                  <option value="Father Name">Father Name</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Value *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98400 99999"
                  value={reqForm.requestedValue}
                  onChange={(e) => setReqForm({ ...reqForm, requestedValue: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Correction *</label>
                <textarea
                  rows="2"
                  placeholder="Changed my mobile operator / Updated family number"
                  value={reqForm.reason}
                  onChange={(e) => setReqForm({ ...reqForm, reason: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white text-xs font-bold rounded-lg"
                >
                  Submit to Class Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
