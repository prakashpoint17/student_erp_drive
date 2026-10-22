// Student ERP Database - Real-Time Pure Clean State
// Initialized with ONLY 1 Super Admin: erprvs@gmail.com
// Initialized with 1 Institutional Master Google Drive Space for erprvs@gmail.com (15 GB)
// 0 Departments, 0 Faculty, 0 Batches, 0 Classes, 0 Tutors, 0 Students.
// Everything is created dynamically by the Admin through the portal in real-time.

export const INITIAL_DEPARTMENTS = [];

export const INITIAL_DRIVE_SPACES = [
  {
    spaceId: "space_rvs_master",
    departmentId: "admin",
    name: "RVS Institutional Master Drive Space",
    type: "master",
    batchYear: null,
    accountEmail: "erprvs@gmail.com",
    webAppUrl: "https://script.google.com/macros/s/AKfycbz_RVS_ERP_MASTER_GAS/exec",
    folderId: "folder_rvs_erp_master_root",
    driveUrl: "https://accounts.google.com/AccountChooser?Email=erprvs@gmail.com&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive",
    sheetId: "sheet_rvs_erp_master_registry",
    usedStorageGB: 0.1,
    totalStorageGB: 15.0,
    status: "connected",
    connectedBy: "erprvs@gmail.com",
    connectedAt: "2026-10-21",
    description: "Central Institutional Google Drive Space for Super Admin (erprvs@gmail.com) storing staff master, policies, and file registry."
  }
];

export const INITIAL_USERS = [
  {
    uid: "usr_admin",
    name: "RVS ERP (Super Admin)",
    email: "erprvs@gmail.com",
    role: "admin",
    password: "admin",
    designation: "Principal & Super Administrator",
    departmentId: null,
    phone: "+91 94433 11223",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isActive: true
  }
];

export const INITIAL_STUDENTS = [];
export const INITIAL_BATCHES = [];
export const INITIAL_CLASSES = [];
export const INITIAL_TUTORS = [];
export const INITIAL_TASKS = [];
export const INITIAL_CORRECTION_REQUESTS = [];

export const INITIAL_REGISTERED_FILES = [
  {
    id: "file_faculty_master",
    name: "Faculty.xlsx",
    spaceId: "space_rvs_master",
    accountEmail: "erprvs@gmail.com",
    path: "/RVS_Master/Faculty.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeKB: 24,
    recordsCount: 0,
    category: "Staff Registry",
    status: "Synchronized",
    lastSynced: "2026-10-21",
    driveUrl: "https://accounts.google.com/AccountChooser?Email=erprvs@gmail.com&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive",
    columns: ["Emp_ID", "Faculty_Name", "Email", "Department", "Designation", "Qualification", "Phone", "Status"]
  },
  {
    id: "file_students_master",
    name: "Students.xlsx",
    spaceId: "space_rvs_master",
    accountEmail: "erprvs@gmail.com",
    path: "/RVS_Master/Students.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeKB: 38,
    recordsCount: 0,
    category: "Student Registry",
    status: "Synchronized",
    lastSynced: "2026-10-21",
    driveUrl: "https://accounts.google.com/AccountChooser?Email=erprvs@gmail.com&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive",
    columns: ["Reg_No", "Student_Name", "Department", "Batch", "Section", "CGPA", "Attendance_%", "Email", "Status"]
  },
  {
    id: "file_sem5_results",
    name: "Semester_5_Results.xlsx",
    spaceId: "space_rvs_master",
    accountEmail: "erprvs@gmail.com",
    path: "/RVS_Master/Academics/Semester_5_Results.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeKB: 18,
    recordsCount: 0,
    category: "Autonomous Grades",
    status: "Synchronized",
    lastSynced: "2026-10-21",
    driveUrl: "https://accounts.google.com/AccountChooser?Email=erprvs@gmail.com&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive",
    columns: ["Reg_No", "Student_Name", "CS501_DS", "CS502_DBMS", "CS503_ML", "GPA", "Status"]
  },
  {
    id: "file_attendance_master",
    name: "Attendance_2026.xlsx",
    spaceId: "space_rvs_master",
    accountEmail: "erprvs@gmail.com",
    path: "/RVS_Master/Attendance/Attendance_2026.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeKB: 32,
    recordsCount: 0,
    category: "Attendance Logs",
    status: "Synchronized",
    lastSynced: "2026-10-21",
    driveUrl: "https://accounts.google.com/AccountChooser?Email=erprvs@gmail.com&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive",
    columns: ["Date", "Department", "Batch", "Section", "Total_Present", "Total_Absent", "Logged_By"]
  },
  {
    id: "file_regulation_2021",
    name: "Regulation_2021_Autonomous.pdf",
    spaceId: "space_rvs_master",
    accountEmail: "erprvs@gmail.com",
    path: "/RVS_Master/Curriculum/Regulation_2021_Autonomous.pdf",
    mimeType: "application/pdf",
    sizeKB: 1420,
    recordsCount: 1,
    category: "Curriculum Policy",
    status: "Verified",
    lastSynced: "2026-10-21",
    driveUrl: "https://accounts.google.com/AccountChooser?Email=erprvs@gmail.com&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive",
    columns: ["Regulation", "Credits", "Evaluation_Scheme"]
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-001",
    actor: "erprvs@gmail.com",
    action: "SYSTEM_INITIALIZED",
    details: "Super Admin erprvs@gmail.com connected Institutional Master Drive Space (15 GB). Ready to store staff records.",
    timestamp: new Date().toISOString()
  }
];
