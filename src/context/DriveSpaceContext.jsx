import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  INITIAL_DRIVE_SPACES, 
  INITIAL_STUDENTS, 
  INITIAL_BATCHES,
  INITIAL_CLASSES,
  INITIAL_TUTORS,
  INITIAL_TASKS, 
  INITIAL_CORRECTION_REQUESTS,
  INITIAL_REGISTERED_FILES
} from "../data/mockDatabase";
import { DriveGatewayService } from "../services/driveGatewayService";
import { useAuth } from "./AuthContext";

const DriveSpaceContext = createContext(null);

const safeParseArray = (saved, fallback = []) => {
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const sanitizeDriveUrl = (url, email) => {
  const targetEmail = (email || "").trim();
  if (!url || typeof url !== "string") {
    return targetEmail && targetEmail.includes("@")
      ? `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(targetEmail)}&continue=${encodeURIComponent("https://drive.google.com/drive/my-drive")}`
      : "https://drive.google.com/drive/my-drive";
  }
  // Detect and repair broken /drive/u/email@domain.com patterns which return Google 404
  if (url.includes("/drive/u/") && url.includes("@")) {
    const match = url.match(/\/drive\/u\/([^/]+)/);
    const fallbackEmail = targetEmail || (match ? match[1] : "");
    return fallbackEmail && fallbackEmail.includes("@")
      ? `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(fallbackEmail)}&continue=${encodeURIComponent("https://drive.google.com/drive/my-drive")}`
      : "https://drive.google.com/drive/my-drive";
  }
  return url;
};

const safeParseSpaces = (saved) => {
  if (!saved) return INITIAL_DRIVE_SPACES;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(s => ({
        ...s,
        driveUrl: sanitizeDriveUrl(s.driveUrl, s.accountEmail)
      }));
    }
    return INITIAL_DRIVE_SPACES;
  } catch {
    return INITIAL_DRIVE_SPACES;
  }
};

const safeParseFiles = (saved) => {
  if (!saved) return INITIAL_REGISTERED_FILES;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(f => ({
        ...f,
        driveUrl: sanitizeDriveUrl(f.driveUrl, f.accountEmail)
      }));
    }
    return INITIAL_REGISTERED_FILES;
  } catch {
    return INITIAL_REGISTERED_FILES;
  }
};

export const DriveSpaceProvider = ({ children }) => {
  const { currentUser, logAudit, departments, assignTutorRole, authorizeNewUser } = useAuth();

  // 1. Drive Spaces
  const [spaces, setSpaces] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_spaces");
    return safeParseSpaces(saved);
  });

  // 2. Active Space
  const [activeSpaceId, setActiveSpaceId] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_active_space_id");
    return saved || (Array.isArray(INITIAL_DRIVE_SPACES) && INITIAL_DRIVE_SPACES[0]?.spaceId) || "space_rvs_master";
  });

  // 3. Students Master
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_students");
    return safeParseArray(saved, INITIAL_STUDENTS);
  });

  // 4. Batches Master
  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_batches");
    return safeParseArray(saved, INITIAL_BATCHES);
  });

  // 5. Classes Master
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_classes");
    return safeParseArray(saved, INITIAL_CLASSES);
  });

  // 6. Tutor Mappings
  const [tutorAssignments, setTutorAssignments] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_tutors");
    return safeParseArray(saved, INITIAL_TUTORS);
  });

  // 7. Tasks & Forms
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_tasks");
    return safeParseArray(saved, INITIAL_TASKS);
  });

  // 8. Correction Requests
  const [correctionRequests, setCorrectionRequests] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_corrections");
    return safeParseArray(saved, INITIAL_CORRECTION_REQUESTS);
  });

  // 9. Registered Files & Google Drive Documents
  const [registeredFiles, setRegisteredFiles] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_registered_files");
    return safeParseFiles(saved);
  });

  // 10. Staff Records stored in Master GSpace (Faculty.xlsx)
  const [staffRecords, setStaffRecords] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_staff_records");
    return safeParseArray(saved, []);
  });

  // 11. Autonomous Academic Exam Results (Semester_5_Results.xlsx)
  const [resultsRecords, setResultsRecords] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_results_records");
    return safeParseArray(saved, []);
  });

  // Persist all state to localStorage
  useEffect(() => {
    localStorage.setItem("rvs_erp_spaces", JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_active_space_id", activeSpaceId);
  }, [activeSpaceId]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_batches", JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_tutors", JSON.stringify(tutorAssignments));
  }, [tutorAssignments]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_corrections", JSON.stringify(correctionRequests));
  }, [correctionRequests]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_registered_files", JSON.stringify(registeredFiles));
  }, [registeredFiles]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_staff_records", JSON.stringify(staffRecords));
  }, [staffRecords]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_results_records", JSON.stringify(resultsRecords));
  }, [resultsRecords]);

  // Active space object (safe)
  const safeSpacesList = Array.isArray(spaces) && spaces.length > 0 ? spaces : INITIAL_DRIVE_SPACES;
  const activeSpace = safeSpacesList.find(s => s.spaceId === activeSpaceId) || safeSpacesList[0] || null;

  // Filter accessible spaces for current user role
  const getPermittedSpaces = () => {
    if (!currentUser) return [];
    const pool = Array.isArray(spaces) && spaces.length > 0 ? spaces : INITIAL_DRIVE_SPACES;

    if (currentUser.role === "admin") {
      return pool; // Admin can inspect all spaces
    }

    if (currentUser.role === "hod") {
      return pool.filter(s => s.departmentId === currentUser.departmentId);
    }

    if (currentUser.role === "staff") {
      if (currentUser.isTutor && currentUser.assignedClass) {
        return pool.filter(s => 
          s.spaceId === currentUser.assignedClass.spaceId || 
          (s.departmentId === currentUser.departmentId && s.type === "common")
        );
      }
      return pool.filter(s => s.departmentId === currentUser.departmentId && s.type === "common");
    }

    if (currentUser.role === "student") {
      return pool.filter(s => s.spaceId === currentUser.spaceId);
    }

    return [];
  };

  // Change active space
  const selectSpace = (spaceId) => {
    const pool = Array.isArray(spaces) && spaces.length > 0 ? spaces : INITIAL_DRIVE_SPACES;
    const target = pool.find(s => s.spaceId === spaceId);
    if (target) {
      setActiveSpaceId(spaceId);
      logAudit("SELECT_SPACE", `Active storage space changed to ${target.name} (${target.accountEmail})`);
    }
  };

  // Connect new Drive Space (e.g. HOD connects rvscse2027@gmail.com)
  const connectSpace = (spaceData) => {
    const newSpace = {
      spaceId: spaceData.spaceId || `${spaceData.departmentId}_${spaceData.type === 'common' ? 'common' : spaceData.batchYear || Date.now()}`,
      departmentId: spaceData.departmentId,
      name: spaceData.name,
      type: spaceData.type || "batch",
      batchYear: spaceData.batchYear ? parseInt(spaceData.batchYear) : null,
      accountEmail: spaceData.accountEmail,
      webAppUrl: spaceData.webAppUrl || "",
      folderId: spaceData.folderId || `folder_${Date.now()}`,
      sheetId: spaceData.sheetId || `sheet_${Date.now()}`,
      usedStorageGB: 0.1,
      totalStorageGB: 15.0,
      driveUrl: spaceData.driveUrl || (spaceData.accountEmail ? `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(spaceData.accountEmail.trim())}&continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fmy-drive` : "https://drive.google.com/drive/my-drive"),
      status: "connected",
      connectedBy: currentUser?.email || "Admin",
      connectedAt: new Date().toISOString().split("T")[0],
      description: spaceData.description || "Connected Google Drive Space for ERP Data"
    };

    setSpaces(prev => {
      const filtered = prev.filter(s => s.spaceId !== newSpace.spaceId);
      return [...filtered, newSpace];
    });

    if (!activeSpaceId) {
      setActiveSpaceId(newSpace.spaceId);
    }

    logAudit("CONNECT_SPACE", `Connected ${newSpace.type.toUpperCase()} Drive Space: ${newSpace.accountEmail}`);
    return newSpace;
  };

  // Delete Drive Space
  const deleteSpace = (spaceId) => {
    setSpaces(prev => prev.filter(s => s.spaceId !== spaceId));
    logAudit("DELETE_SPACE", `Deleted Drive Space ID: ${spaceId}`);
  };

  // Add Student
  const addStudent = async (studentData) => {
    const newStudent = {
      regNo: studentData.regNo,
      name: studentData.name,
      departmentId: studentData.departmentId || "cse",
      batch: studentData.batch || "2026-2030",
      section: studentData.section || "A",
      email: studentData.email || `${studentData.regNo}@rvs.edu`,
      phone: studentData.phone || "+91 90000 00000",
      cgpa: studentData.cgpa || "0.00",
      attendancePercentage: studentData.attendancePercentage ? parseFloat(studentData.attendancePercentage) : 100.0,
      status: studentData.status || "Active",
      spaceId: studentData.spaceId || activeSpace?.spaceId || "default_space",
      enrolledAt: new Date().toISOString().split("T")[0]
    };

    setStudents(prev => {
      const filtered = prev.filter(s => s.regNo !== newStudent.regNo);
      return [newStudent, ...filtered];
    });

    // Update Students.xlsx registered file record count
    setRegisteredFiles(prev => prev.map(f => {
      if (f.id === "file_students_master") {
        return {
          ...f,
          recordsCount: (f.recordsCount || 0) + 1,
          sizeKB: Math.round((f.sizeKB || 30) + 1.5),
          lastSynced: new Date().toISOString().split("T")[0]
        };
      }
      return f;
    }));

    logAudit("ADD_STUDENT", `Added student ${newStudent.name} (Reg: ${newStudent.regNo}, Dept: ${newStudent.departmentId.toUpperCase()})`);
    return newStudent;
  };

  // Delete Student
  const deleteStudent = (regNo) => {
    setStudents(prev => prev.filter(s => s.regNo !== regNo));
    logAudit("DELETE_STUDENT", `Removed student record: ${regNo}`);
  };

  // Add Batch
  const addBatch = (batchData) => {
    const newBatch = {
      id: `batch_${Date.now()}`,
      name: batchData.name || `${batchData.startYear}-${batchData.endYear}`,
      batch: `${batchData.startYear}-${batchData.endYear}`,
      regulation: batchData.regulation || "2021 Autonomous",
      startYear: batchData.startYear,
      endYear: batchData.endYear,
      departmentId: batchData.departmentId || "cse",
      sections: typeof batchData.sections === "string" ? batchData.sections.split(",").map(s => s.trim()) : (batchData.sections || ["A"]),
      accountEmail: batchData.accountEmail || "",
      studentCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setBatches(prev => [newBatch, ...prev]);
    logAudit("CREATE_BATCH", `Created Batch ${newBatch.batch} for ${newBatch.departmentId.toUpperCase()}`);
    return newBatch;
  };

  // Delete Batch
  const deleteBatch = (id) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    logAudit("DELETE_BATCH", `Deleted batch ID: ${id}`);
  };

  // Add Class
  const addClass = (classData) => {
    const newClass = {
      id: `class_${Date.now()}`,
      name: classData.name,
      departmentId: classData.departmentId,
      batch: classData.batch,
      section: classData.section,
      tutorName: classData.tutorName || "Not Assigned",
      tutorEmail: classData.tutorEmail || "",
      room: classData.room || "LH-101",
      studentCount: classData.studentCount || 0,
      attendancePercent: classData.attendancePercent || 100.0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setClasses(prev => [newClass, ...prev]);
    logAudit("CREATE_CLASS", `Created class: ${newClass.name} (${newClass.departmentId.toUpperCase()} Sec ${newClass.section})`);
    return newClass;
  };

  // Delete Class
  const deleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    logAudit("DELETE_CLASS", `Deleted class ID: ${id}`);
  };

  // Assign Tutor
  const assignTutor = (tutorData) => {
    const newMapping = {
      id: `tutor_${Date.now()}`,
      departmentId: tutorData.departmentId,
      batch: tutorData.batch,
      section: tutorData.section,
      tutorName: tutorData.tutorName,
      tutorEmail: tutorData.tutorEmail,
      studentCount: tutorData.studentCount || 0,
      assignedAt: new Date().toISOString().split("T")[0]
    };

    setTutorAssignments(prev => {
      const filtered = prev.filter(t => !(t.batch === newMapping.batch && t.section === newMapping.section && t.departmentId === newMapping.departmentId));
      return [newMapping, ...filtered];
    });

    // Also update class if class matches
    setClasses(prev => prev.map(c => {
      if (c.batch === tutorData.batch && c.section === tutorData.section && c.departmentId === tutorData.departmentId) {
        return { ...c, tutorName: tutorData.tutorName, tutorEmail: tutorData.tutorEmail };
      }
      return c;
    }));

    logAudit("ASSIGN_TUTOR", `Assigned ${tutorData.tutorName} as Class Tutor for ${tutorData.departmentId.toUpperCase()} ${tutorData.batch} Sec ${tutorData.section}`);
    return newMapping;
  };

  // Update Student
  const updateStudent = async (regNo, updates) => {
    setStudents(prev => prev.map(s => s.regNo === regNo ? { ...s, ...updates } : s));
    logAudit("UPDATE_STUDENT", `Updated record for ${regNo}`);
  };

  // Add Task or Form announcement
  const addTask = async (taskData) => {
    const newTask = {
      taskId: `TASK-${Date.now().toString().slice(-4)}`,
      ...taskData,
      spaceId: activeSpace?.spaceId || "default",
      createdBy: currentUser?.name || "Admin",
      creatorEmail: currentUser?.email || "Admin",
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setTasks(prev => [newTask, ...prev]);
    logAudit("ADD_TASK", `Created class task: "${newTask.title}"`);
    return newTask;
  };

  // Google Drive URL Resolution helper (uses official Google AccountChooser to eliminate 404s)
  const getDriveUrlForSpace = (space) => {
    if (!space) return "https://drive.google.com/drive/my-drive";
    const email = (space.accountEmail || "").trim();
    let destination = "https://drive.google.com/drive/my-drive";

    // If space has a valid folderId (and not a dummy placeholder)
    if (space.folderId && space.folderId !== "root" && !space.folderId.startsWith("folder_")) {
      destination = `https://drive.google.com/drive/folders/${space.folderId}`;
    } else if (space.driveUrl && !space.driveUrl.includes("/drive/u/") && space.driveUrl.startsWith("http")) {
      destination = space.driveUrl;
    }

    if (email && email.includes("@")) {
      return `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(email)}&continue=${encodeURIComponent(destination)}`;
    }

    return destination;
  };

  // Direct redirection to Google Drive for a Space, File, or Account Email
  const openInGoogleDrive = (target) => {
    let url = "https://drive.google.com/drive/my-drive";

    if (typeof target === "string") {
      if (target.startsWith("http")) {
        // Sanitize old invalid /drive/u/<email> paths that return Google 404
        if (target.includes("/drive/u/") && target.includes("@")) {
          const match = target.match(/\/drive\/u\/([^/]+)/);
          const email = match ? match[1] : "";
          url = email && email.includes("@")
            ? `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(email)}&continue=${encodeURIComponent("https://drive.google.com/drive/my-drive")}`
            : "https://drive.google.com/drive/my-drive";
        } else {
          url = target;
        }
      } else if (target.includes("@")) {
        // Target is an email address
        url = `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(target.trim())}&continue=${encodeURIComponent("https://drive.google.com/drive/my-drive")}`;
      } else {
        // Target is a spaceId
        const pool = Array.isArray(spaces) && spaces.length > 0 ? spaces : INITIAL_DRIVE_SPACES;
        const found = pool.find(s => s.spaceId === target || s.accountEmail === target);
        url = found ? getDriveUrlForSpace(found) : "https://drive.google.com/drive/my-drive";
      }
    } else if (target && typeof target === "object") {
      url = getDriveUrlForSpace(target);
    }

    window.open(url, "_blank", "noopener,noreferrer");
    if (logAudit) {
      const label = typeof target === "string" ? target : (target.name || target.accountEmail || "Drive");
      logAudit("OPEN_GOOGLE_DRIVE", `Opened Google Drive redirect for ${label}`);
    }
  };

  // Store Staff in Master GSpace (erprvs@gmail.com -> Faculty.xlsx)
  const addStaffToGSpace = (staffData) => {
    const newStaff = {
      id: `staff_${Date.now()}`,
      empId: staffData.empId || `EMP-${Date.now().toString().slice(-4)}`,
      name: staffData.name,
      email: staffData.email.trim().toLowerCase(),
      departmentId: staffData.departmentId || "cse",
      designation: staffData.designation || "Assistant Professor",
      qualification: staffData.qualification || "M.E., Ph.D.",
      phone: staffData.phone || "+91 90000 00000",
      joiningDate: staffData.joiningDate || new Date().toISOString().split("T")[0],
      spaceId: "space_rvs_master",
      accountEmail: "erprvs@gmail.com",
      status: "Active"
    };

    setStaffRecords(prev => {
      const filtered = prev.filter(s => s.email !== newStaff.email);
      return [newStaff, ...filtered];
    });

    // Auto-authorize in AuthContext so the staff member can sign in
    if (authorizeNewUser) {
      authorizeNewUser({
        name: newStaff.name,
        email: newStaff.email,
        password: staffData.password || "staff123",
        role: staffData.role || "staff",
        departmentId: newStaff.departmentId,
        designation: newStaff.designation,
        phone: newStaff.phone
      });
    }

    // Update Faculty.xlsx registered file record count
    setRegisteredFiles(prev => prev.map(f => {
      if (f.id === "file_faculty_master") {
        return {
          ...f,
          recordsCount: (f.recordsCount || 0) + 1,
          sizeKB: Math.round((f.sizeKB || 24) + 1.2),
          lastSynced: new Date().toISOString().split("T")[0]
        };
      }
      return f;
    }));

    logAudit(
      "GSPACE_STORE_STAFF",
      `Stored staff record for ${newStaff.name} (${newStaff.empId}) in erprvs@gmail.com GSpace (Faculty.xlsx)`
    );

    return newStaff;
  };

  // Delete Staff from Master GSpace
  const deleteStaffFromGSpace = (empIdOrEmail) => {
    setStaffRecords(prev => prev.filter(s => s.empId !== empIdOrEmail && s.email !== empIdOrEmail));
    logAudit("GSPACE_DELETE_STAFF", `Deleted staff record ${empIdOrEmail} from erprvs@gmail.com GSpace (Faculty.xlsx)`);
  };

  // Add / Update Academic Result in Semester_5_Results.xlsx
  const addOrUpdateResult = (resultData) => {
    const cs501 = parseInt(resultData.cs501 || 0);
    const cs502 = parseInt(resultData.cs502 || 0);
    const cs503 = parseInt(resultData.cs503 || 0);
    const gpaVal = resultData.gpa ? parseFloat(resultData.gpa) : parseFloat(((cs501 + cs502 + cs503) / 30).toFixed(2));
    const isPass = cs501 >= 50 && cs502 >= 50 && cs503 >= 50;

    const newResult = {
      id: resultData.id || `res_${Date.now()}`,
      regNo: resultData.regNo,
      studentName: resultData.studentName,
      departmentId: resultData.departmentId || "cse",
      batch: resultData.batch || "2026-2030",
      semester: parseInt(resultData.semester || 5),
      cs501,
      cs502,
      cs503,
      gpa: gpaVal,
      status: isPass ? "PASS" : "RA",
      updatedAt: new Date().toISOString().split("T")[0]
    };

    setResultsRecords(prev => {
      const filtered = prev.filter(r => r.regNo !== newResult.regNo);
      return [newResult, ...filtered];
    });

    // Update Semester_5_Results.xlsx row count
    setRegisteredFiles(prev => prev.map(f => {
      if (f.id === "file_sem5_results") {
        return {
          ...f,
          recordsCount: (f.recordsCount || 0) + 1,
          lastSynced: new Date().toISOString().split("T")[0]
        };
      }
      return f;
    }));

    logAudit("ACADEMIC_RESULTS_SYNC", `Updated Semester 5 Result for ${newResult.studentName} (${newResult.regNo}) in Semester_5_Results.xlsx`);
    return newResult;
  };

  // Delete Result Record
  const deleteResult = (idOrRegNo) => {
    setResultsRecords(prev => prev.filter(r => r.id !== idOrRegNo && r.regNo !== idOrRegNo));
    logAudit("ACADEMIC_RESULTS_DELETE", `Removed exam result record for ${idOrRegNo}`);
  };

  // Register New File / Document to Drive Space
  const registerNewFile = (fileData) => {
    const newFile = {
      id: fileData.id || `file_${Date.now()}`,
      name: fileData.name,
      spaceId: fileData.spaceId || activeSpace?.spaceId || "space_rvs_master",
      accountEmail: fileData.accountEmail || activeSpace?.accountEmail || "erprvs@gmail.com",
      path: fileData.path || `/${fileData.name}`,
      mimeType: fileData.mimeType || "application/octet-stream",
      sizeKB: fileData.sizeKB || 15,
      recordsCount: fileData.recordsCount || 0,
      category: fileData.category || "General Document",
      status: "Synchronized",
      lastSynced: new Date().toISOString().split("T")[0],
      driveUrl: fileData.driveUrl || (activeSpace ? getDriveUrlForSpace(activeSpace) : "https://drive.google.com"),
      columns: fileData.columns || []
    };

    setRegisteredFiles(prev => [newFile, ...prev]);
    logAudit("REGISTER_DRIVE_FILE", `Registered file ${newFile.name} in ${newFile.accountEmail} Drive`);
    return newFile;
  };

  // Manual Sync File with Google Drive
  const syncFileWithDrive = (fileId) => {
    setRegisteredFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          status: "Synchronized",
          lastSynced: new Date().toISOString().split("T")[0]
        };
      }
      return f;
    }));
    logAudit("SYNC_DRIVE_FILE", `Manually synchronized file ID: ${fileId} with Google Drive`);
  };

  // Test / Ping Connection for a Google Drive Space
  const testSpaceConnection = async (spaceId) => {
    const space = spaces.find(s => s.spaceId === spaceId);
    if (!space) return { success: false, error: "Drive Space not found" };

    // Realistic delay simulating Apps Script ping
    await new Promise(r => setTimeout(r, 600));
    logAudit("PING_GSPACE", `Connection verified for Google Drive Space: ${space.accountEmail} (Master Registry OK)`);
    return {
      success: true,
      accountEmail: space.accountEmail,
      latencyMs: Math.floor(Math.random() * 80) + 110,
      status: "connected",
      storageAvailable: `${(space.totalStorageGB - (space.usedStorageGB || 0.1)).toFixed(1)} GB free`
    };
  };

  // Export Space Data as CSV
  const exportSpaceDataAsCSV = (spaceId) => {
    const pool = Array.isArray(spaces) && spaces.length > 0 ? spaces : INITIAL_DRIVE_SPACES;
    const target = pool.find(s => s.spaceId === spaceId) || activeSpace;
    if (!target) return;
    const studentList = Array.isArray(students) ? students : [];
    const relatedStudents = studentList.filter(s => s.spaceId === target.spaceId || s.departmentId === target.departmentId);
    const header = "RegNo,Name,Department,Batch,Section,Email,Phone,CGPA,Attendance,Status\n";
    const rows = relatedStudents.map(s => `${s.regNo},"${s.name}",${s.departmentId},${s.batch},${s.section},${s.email},${s.phone},${s.cgpa || "0.00"},${s.attendancePercentage || 100},${s.status || "Active"}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${target.name.replace(/\s+/g, "_")}_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAudit("EXPORT_SPACE_CSV", `Exported CSV archive for Drive Space: ${target.name}`);
  };

  return (
    <DriveSpaceContext.Provider value={{
      spaces: Array.isArray(spaces) ? spaces : INITIAL_DRIVE_SPACES,
      activeSpace,
      activeSpaceId,
      selectSpace,
      connectSpace,
      deleteSpace,
      getPermittedSpaces,
      exportSpaceDataAsCSV,
      students: Array.isArray(students) ? students : [],
      addStudent,
      updateStudent,
      deleteStudent,
      batches: Array.isArray(batches) ? batches : [],
      addBatch,
      deleteBatch,
      classes: Array.isArray(classes) ? classes : [],
      addClass,
      deleteClass,
      tutorAssignments: Array.isArray(tutorAssignments) ? tutorAssignments : [],
      assignTutor,
      tasks: Array.isArray(tasks) ? tasks : [],
      addTask,
      correctionRequests: Array.isArray(correctionRequests) ? correctionRequests : [],
      registeredFiles: Array.isArray(registeredFiles) ? registeredFiles : INITIAL_REGISTERED_FILES,
      registerNewFile,
      syncFileWithDrive,
      staffRecords: Array.isArray(staffRecords) ? staffRecords : [],
      addStaffToGSpace,
      deleteStaffFromGSpace,
      resultsRecords: Array.isArray(resultsRecords) ? resultsRecords : [],
      addOrUpdateResult,
      deleteResult,
      openInGoogleDrive,
      getDriveUrlForSpace,
      testSpaceConnection
    }}>
      {children}
    </DriveSpaceContext.Provider>
  );
};

export const useDriveSpace = () => useContext(DriveSpaceContext);
