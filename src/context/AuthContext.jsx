import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_AUDIT_LOGS } from "../data/mockDatabase";
import { FirebaseAuthService, DEFAULT_ADMIN_EMAIL } from "../config/firebase";
import { SupabaseAuthService } from "../config/supabase";

const AuthContext = createContext(null);

// Database storage version - increments wipe old mock users from browser localStorage
const DB_VERSION = "rvs_erp_v12_drive_account_chooser";

const safeParseArray = (saved, fallback = []) => {
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

if (typeof window !== "undefined") {
  const currentVersion = localStorage.getItem("rvs_erp_version");
  if (currentVersion !== DB_VERSION) {
    localStorage.removeItem("rvs_erp_users");
    localStorage.removeItem("rvs_erp_students");
    localStorage.removeItem("rvs_erp_tasks");
    localStorage.removeItem("rvs_erp_corrections");
    localStorage.removeItem("rvs_erp_spaces");
    localStorage.removeItem("rvs_erp_departments");
    localStorage.removeItem("rvs_erp_batches");
    localStorage.removeItem("rvs_erp_classes");
    localStorage.removeItem("rvs_erp_tutors");
    localStorage.removeItem("rvs_erp_audit_logs");
    localStorage.removeItem("rvs_erp_registered_files");
    localStorage.removeItem("rvs_erp_staff_records");
    localStorage.removeItem("rvs_erp_results_records");
    localStorage.removeItem("rvs_firebase_config");
    localStorage.setItem("rvs_erp_version", DB_VERSION);
  }
}

export const AuthProvider = ({ children }) => {
  // Load or initialize users registry - ONLY erprvs@gmail.com is present initially
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_users");
    let list = safeParseArray(saved, [...INITIAL_USERS]);
    if (!Array.isArray(list) || list.length === 0) {
      list = [...INITIAL_USERS];
    }
    
    // Guarantee Super Admin is always configured as DEFAULT_ADMIN_EMAIL
    const adminIdx = list.findIndex(u => u.role === "admin" || u.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase());
    if (adminIdx >= 0) {
      list[adminIdx].email = list[adminIdx].email || DEFAULT_ADMIN_EMAIL;
      list[adminIdx].name = list[adminIdx].name || "RVS ERP (Super Admin)";
      if (!list[adminIdx].password) list[adminIdx].password = "admin";
    } else {
      list.unshift({
        uid: "usr_admin",
        name: "RVS ERP (Super Admin)",
        email: DEFAULT_ADMIN_EMAIL,
        password: "admin",
        role: "admin",
        designation: "Principal & Super Administrator",
        departmentId: null,
        phone: "+91 94433 11223",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isActive: true
      });
    }
    return list;
  });

  // Current logged in user (null by default so landing page is always the login page)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_current_user");
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && typeof parsed === "object" && parsed.role && parsed.email) ? parsed : null;
    } catch {
      return null;
    }
  });

  // Departments list
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_departments");
    return safeParseArray(saved, INITIAL_DEPARTMENTS);
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem("rvs_erp_audit_logs");
    return safeParseArray(saved, INITIAL_AUDIT_LOGS);
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("rvs_erp_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("rvs_erp_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("rvs_erp_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_departments", JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem("rvs_erp_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Log an audit event
  const logAudit = (action, details, actorOverride = null) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actor: actorOverride || currentUser?.email || "System",
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Login by Email & Password with Role validation
  const loginByEmailAndRole = (email, password = "", expectedRole = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      return {
        success: false,
        error: `The email "${cleanEmail}" is not authorized in the Student ERP. Only accounts added by the Super Admin (${DEFAULT_ADMIN_EMAIL}) or HOD can sign in.`
      };
    }

    if (!matchedUser.isActive) {
      return {
        success: false,
        error: "Your account is marked inactive. Please contact the Super Administrator."
      };
    }

    // Password verification
    if (matchedUser.password) {
      if (!password || matchedUser.password !== password.trim()) {
        return {
          success: false,
          error: `Incorrect password for "${cleanEmail}". (Default admin password is "admin").`
        };
      }
    }

    // Role-based validation
    if (expectedRole && expectedRole !== "all") {
      const userRoleNorm = matchedUser.role.toLowerCase();
      const expectedNorm = expectedRole.toLowerCase();

      // Normalize staff / tutor comparison
      const isRoleMismatch = (expectedNorm === "tutor" && !matchedUser.isTutor) ||
                             (expectedNorm !== "tutor" && userRoleNorm !== expectedNorm);

      if (isRoleMismatch) {
        const userLabel = matchedUser.isTutor ? "Class Tutor" : 
                          matchedUser.role === "admin" ? "Super Admin" :
                          matchedUser.role === "hod" ? "Head of Department" :
                          matchedUser.role === "staff" ? "Faculty" : "Student";
        return {
          success: false,
          error: `Role Mismatch: "${cleanEmail}" is authorized as ${userLabel}, not as ${expectedRole.toUpperCase()}. Please select the correct role above.`
        };
      }
    }

    setCurrentUser(matchedUser);
    logAudit("USER_LOGIN", `Authenticated as ${matchedUser.role.toUpperCase()} (${matchedUser.name})`, matchedUser.email);
    return { success: true, user: matchedUser };
  };

  // Live Google OAuth Login (Uses real Firebase Popup)
  const loginWithGoogleOAuth = async (selectedRole) => {
    try {
      // 1. Trigger live Firebase Google popup
      const fbRes = await FirebaseAuthService.signInWithGoogle();
      
      if (fbRes?.user?.email) {
        const googleEmail = fbRes.user.email.toLowerCase();

        // 1. Check if user is Super Admin or logging in under Admin role
        if (googleEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() || selectedRole === "admin" || !selectedRole) {
          let adminUser = users.find(u => u.email.toLowerCase() === googleEmail || u.role === "admin");
          if (adminUser) {
            // Update admin credentials with authenticated Google session details
            adminUser = {
              ...adminUser,
              name: fbRes.user.displayName || adminUser.name || "Super Admin",
              email: googleEmail,
              avatar: fbRes.user.photoURL || adminUser.avatar,
              role: "admin",
              isActive: true
            };
            setUsers(prev => prev.map(u => (u.uid === adminUser.uid || u.role === "admin") ? adminUser : u));
          } else {
            // Create new Super Admin profile for this authenticated Google user
            adminUser = {
              uid: `admin_${Date.now()}`,
              name: fbRes.user.displayName || "Super Admin",
              email: googleEmail,
              password: "admin",
              role: "admin",
              designation: "Principal & Super Administrator",
              departmentId: null,
              phone: fbRes.user.phoneNumber || "+91 94433 11223",
              avatar: fbRes.user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              isActive: true
            };
            setUsers(prev => [adminUser, ...prev]);
          }

          setCurrentUser(adminUser);
          logAudit("GOOGLE_OAUTH_LOGIN", `Super Admin authenticated via Live Google OAuth (${googleEmail})`, googleEmail);
          return { success: true, user: adminUser };
        }

        // 2. Check if email exists in authorized users registry
        const registeredUser = users.find(u => u.email.toLowerCase() === googleEmail);
        if (!registeredUser) {
          return {
            success: false,
            error: `Access Denied: The Google account "${googleEmail}" is not authorized in this ERP system. Please ask Super Admin (${DEFAULT_ADMIN_EMAIL}) to authorize your email first.`
          };
        }

        // 3. Check role match
        if (selectedRole && selectedRole !== "all") {
          const userRoleNorm = (registeredUser.role || "").toLowerCase();
          const expectedNorm = selectedRole.toLowerCase();
          const isMismatch = (expectedNorm === "tutor" && !registeredUser.isTutor) ||
                             (expectedNorm !== "tutor" && userRoleNorm !== expectedNorm);

          if (isMismatch) {
            const userLabel = registeredUser.isTutor ? "Class Tutor" :
                              registeredUser.role === "admin" ? "Super Admin" :
                              registeredUser.role === "hod" ? "Head of Department" :
                              registeredUser.role === "staff" ? "Faculty" : "Student";
            return {
              success: false,
              error: `Role Mismatch: Google account "${googleEmail}" is authorized as ${userLabel}, not as ${selectedRole.toUpperCase()}. Please switch role tab.`
            };
          }
        }

        setCurrentUser(registeredUser);
        logAudit("GOOGLE_OAUTH_LOGIN", `User authenticated via Live Google OAuth (${googleEmail})`, googleEmail);
        return { success: true, user: registeredUser };
      }

      return { success: false, error: "Google OAuth sign-in did not return an authorized email." };

    } catch (err) {
      console.error("Google OAuth Error:", err);
      return { 
        success: false, 
        error: err.message || "Google OAuth sign-in failed",
        code: err.code || "OAUTH_FAILED"
      };
    }
  };

  // Sign out cleanly back to the Login Page
  const logout = async () => {
    try {
      await FirebaseAuthService.signOut();
      await SupabaseAuthService.signOut();
    } catch (e) {
      // Silent error handling for signout
    }
    if (currentUser) {
      logAudit("USER_LOGOUT", `User ${currentUser.email} signed out`);
    }
    setCurrentUser(null);
    localStorage.removeItem("rvs_erp_current_user");
  };

  // Authorize / Add New User with specific role
  const authorizeNewUser = (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    const newUserObj = {
      uid: userData.uid || `usr_${userData.role}_${Date.now().toString().slice(-5)}`,
      name: userData.name,
      email: cleanEmail,
      password: userData.password || "welcome123",
      role: userData.role, // "admin" | "hod" | "staff" | "student"
      designation: userData.designation || (
        userData.role === "admin" ? "Institutional Administrator" :
        userData.role === "hod" ? `Head of Department (${userData.departmentId?.toUpperCase()})` :
        userData.role === "staff" ? "Assistant Professor" : "Student"
      ),
      departmentId: userData.departmentId || null,
      phone: userData.phone || "+91 90000 00000",
      qualification: userData.qualification || "",
      experience: userData.experience || "",
      regNo: userData.regNo || null,
      rollNo: userData.rollNo || null,
      batchYear: userData.batchYear ? parseInt(userData.batchYear) : null,
      section: userData.section || "A",
      isTutor: Boolean(userData.isTutor),
      assignedClass: userData.assignedClass || null,
      avatar: userData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*1000000)}?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      authorizedBy: currentUser?.email || "System",
      authorizedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setUsers(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], ...newUserObj };
        return copy;
      });
      logAudit("UPDATE_USER_ROLE", `Updated role for ${cleanEmail} to ${userData.role.toUpperCase()}`);
    } else {
      setUsers(prev => [...prev, newUserObj]);
      logAudit("AUTHORIZE_USER", `Authorized new ${userData.role.toUpperCase()}: ${userData.name} (${cleanEmail})`);
    }

    return newUserObj;
  };

  // Add new staff member (HOD operation)
  const addStaffMember = (staffData) => {
    return authorizeNewUser({
      ...staffData,
      role: "staff",
      password: staffData.password || "staff123",
      departmentId: staffData.departmentId || currentUser?.departmentId || "cse"
    });
  };

  // Assign staff member as Tutor / Class Incharge
  const assignTutorRole = (staffUid, classDetails) => {
    setUsers(prev => prev.map(user => {
      if (user.uid === staffUid) {
        return {
          ...user,
          isTutor: true,
          assignedClass: classDetails
        };
      }
      return user;
    }));

    const staff = users.find(u => u.uid === staffUid);
    logAudit("ASSIGN_TUTOR", `Assigned ${staff?.name} as Tutor for Batch ${classDetails.batchYear} Sec ${classDetails.section}`);
  };

  // Add new Department (Super Admin only)
  const addDepartment = (deptData) => {
    const newDept = {
      deptId: deptData.code.toLowerCase(),
      name: deptData.name,
      code: deptData.code.toUpperCase(),
      hodUid: deptData.hodUid || "",
      hodName: deptData.hodName || "Pending Appointment",
      hodEmail: deptData.hodEmail || "",
      commonSpaceEmail: deptData.commonSpaceEmail || `rvs${deptData.code.toLowerCase()}.dept@gmail.com`,
      activeBatches: [2024, 2025, 2026, 2027],
      createdAt: new Date().toISOString().split("T")[0]
    };

    setDepartments(prev => [...prev, newDept]);
    logAudit("CREATE_DEPARTMENT", `Created Department ${newDept.name} (${newDept.code})`);
    return newDept;
  };

  // Appoint HOD to Department
  const appointHOD = (deptId, hodData) => {
    const hodUser = authorizeNewUser({
      name: hodData.name,
      email: hodData.email,
      password: hodData.password || "hod123",
      role: "hod",
      designation: `Head of Department (${deptId.toUpperCase()})`,
      departmentId: deptId,
      phone: hodData.phone || "+91 98000 00000"
    });

    setDepartments(prev => prev.map(dept => {
      if (dept.deptId === deptId) {
        return {
          ...dept,
          hodUid: hodUser.uid,
          hodName: hodData.name,
          hodEmail: hodData.email
        };
      }
      return dept;
    }));

    logAudit("APPOINT_HOD", `Appointed ${hodData.name} as HOD for ${deptId.toUpperCase()}`);
  };

  // Delete Department
  const deleteDepartment = (deptId) => {
    setDepartments(prev => prev.filter(d => d.deptId !== deptId));
    logAudit("DELETE_DEPARTMENT", `Deleted Department ${deptId.toUpperCase()}`);
  };

  // Delete User
  const deleteUser = (uid) => {
    const target = users.find(u => u.uid === uid);
    if (target?.role === "admin" && target?.email === DEFAULT_ADMIN_EMAIL) {
      alert("Cannot delete primary Super Administrator.");
      return;
    }
    setUsers(prev => prev.filter(u => u.uid !== uid));
    logAudit("DELETE_USER", `Deleted user account: ${target?.name} (${target?.email})`);
  };

  // Toggle User Active Status
  const toggleUserStatus = (uid) => {
    setUsers(prev => prev.map(u => {
      if (u.uid === uid) {
        const nextState = !u.isActive;
        logAudit("USER_STATUS_CHANGE", `${nextState ? "Activated" : "Suspended"} account: ${u.email}`);
        return { ...u, isActive: nextState };
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users: Array.isArray(users) ? users : [],
      departments: Array.isArray(departments) ? departments : [],
      auditLogs: Array.isArray(auditLogs) ? auditLogs : [],
      loginByEmailAndRole,
      loginWithGoogleOAuth,
      logout,
      authorizeNewUser,
      deleteUser,
      toggleUserStatus,
      addStaffMember,
      assignTutorRole,
      addDepartment,
      deleteDepartment,
      appointHOD,
      logAudit,
      defaultAdminEmail: DEFAULT_ADMIN_EMAIL
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
