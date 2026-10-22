/**
 * =========================================================================
 * STUDENT ERP SYSTEM - ZERO-COST GOOGLE APPS SCRIPT DRIVE GATEWAY
 * =========================================================================
 * Deploy this script inside the designated Department or Batch Gmail account
 * (e.g., rvscse.dept@gmail.com or rvscse2026@gmail.com)
 * 
 * Deployment Instructions:
 * 1. Open Google Drive in the space's Gmail account (e.g. rvscse2026@gmail.com).
 * 2. Create a new Google Sheet named "ERP_Master_Database".
 * 3. In the Sheet, click Extensions > Apps Script.
 * 4. Paste this complete file into Code.gs.
 * 5. Run the function `initializeERPDatabase()` once to create all sheets & columns.
 * 6. Click Deploy > New Deployment:
 *    - Select type: "Web App"
 *    - Execute as: "Me (rvscse2026@gmail.com)"
 *    - Who has access: "Anyone"
 * 7. Copy the generated Web App URL and paste it into the ERP HOD Dashboard!
 * =========================================================================
 */

// Shared API Key for security (match this in your ERP Space config)
var SECRET_TOKEN = "RVS_ERP_SECURE_TOKEN_2026";

/**
 * Handle GET requests - Ping, check health, and fetch records
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "ping";
    var token = params.token;

    if (token !== SECRET_TOKEN && action !== "ping") {
      return jsonResponse({ success: false, error: "Unauthorized: Invalid Secret Token" }, 401);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "ping") {
      return jsonResponse({
        success: true,
        message: "Drive Space Gateway Online",
        accountEmail: Session.getActiveUser().getEmail(),
        spreadsheetName: ss.getName(),
        spreadsheetId: ss.getId(),
        timestamp: new Date().toISOString()
      });
    }

    if (action === "getStudents") {
      var sheet = ss.getSheetByName("Students");
      if (!sheet) return jsonResponse({ success: false, error: "Students sheet not found" }, 404);
      var data = sheetToObjects(sheet);
      return jsonResponse({ success: true, count: data.length, data: data });
    }

    if (action === "getStaff") {
      var staffSheet = ss.getSheetByName("Staff");
      if (!staffSheet) return jsonResponse({ success: false, error: "Staff sheet not found" }, 404);
      var staffData = sheetToObjects(staffSheet);
      return jsonResponse({ success: true, count: staffData.length, data: staffData });
    }

    if (action === "getTasks") {
      var taskSheet = ss.getSheetByName("Tasks");
      if (!taskSheet) return jsonResponse({ success: false, error: "Tasks sheet not found" }, 404);
      var taskData = sheetToObjects(taskSheet);
      return jsonResponse({ success: true, count: taskData.length, data: taskData });
    }

    return jsonResponse({ success: false, error: "Unknown action: " + action }, 400);

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}

/**
 * Handle POST requests - Create, update, and manage records
 */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      return jsonResponse({ success: false, error: "Missing POST request body" }, 400);
    }

    var token = body.token;
    if (token !== SECRET_TOKEN) {
      return jsonResponse({ success: false, error: "Unauthorized: Invalid Secret Token" }, 401);
    }

    var action = body.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. ADD NEW STUDENT
    if (action === "addStudent") {
      var student = body.student;
      if (!student || !student.regNo || !student.name) {
        return jsonResponse({ success: false, error: "Missing required student details" }, 400);
      }

      var sheet = ss.getSheetByName("Students");
      if (!sheet) sheet = initializeStudentsSheet(ss);

      // Check duplicate RegNo
      var existing = sheetToObjects(sheet);
      for (var i = 0; i < existing.length; i++) {
        if (existing[i].RegNo === student.regNo) {
          return jsonResponse({ success: false, error: "Student with RegNo " + student.regNo + " already exists" }, 409);
        }
      }

      sheet.appendRow([
        student.regNo,
        student.name,
        student.email || "",
        student.department || "",
        student.batch || "",
        student.section || "A",
        student.phone || "",
        student.bloodGroup || "",
        student.status || "Active",
        new Date().toISOString()
      ]);

      logAudit(ss, body.actorEmail, "ADD_STUDENT", "Added student " + student.regNo + " (" + student.name + ")");
      return jsonResponse({ success: true, message: "Student record saved successfully" });
    }

    // 2. UPDATE STUDENT
    if (action === "updateStudent") {
      var studentUpdate = body.student;
      var sheet = ss.getSheetByName("Students");
      if (!sheet) return jsonResponse({ success: false, error: "Students sheet not found" }, 404);

      var data = sheet.getDataRange().getValues();
      var rowIndex = -1;
      for (var r = 1; r < data.length; r++) {
        if (String(data[r][0]) === String(studentUpdate.regNo)) {
          rowIndex = r + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        return jsonResponse({ success: false, error: "Student not found with RegNo " + studentUpdate.regNo }, 404);
      }

      // Update fields
      if (studentUpdate.name) sheet.getRange(rowIndex, 2).setValue(studentUpdate.name);
      if (studentUpdate.email) sheet.getRange(rowIndex, 3).setValue(studentUpdate.email);
      if (studentUpdate.section) sheet.getRange(rowIndex, 6).setValue(studentUpdate.section);
      if (studentUpdate.phone) sheet.getRange(rowIndex, 7).setValue(studentUpdate.phone);
      if (studentUpdate.bloodGroup) sheet.getRange(rowIndex, 8).setValue(studentUpdate.bloodGroup);
      if (studentUpdate.status) sheet.getRange(rowIndex, 9).setValue(studentUpdate.status);

      logAudit(ss, body.actorEmail, "UPDATE_STUDENT", "Updated student " + studentUpdate.regNo);
      return jsonResponse({ success: true, message: "Student updated successfully" });
    }

    // 3. ADD CLASS TASK / ANNOUNCEMENT / GOOGLE FORM LINK
    if (action === "addTask") {
      var task = body.task;
      var taskSheet = ss.getSheetByName("Tasks");
      if (!taskSheet) taskSheet = initializeTasksSheet(ss);

      var taskId = "TASK-" + Utilities.getUuid().substring(0, 8).toUpperCase();
      taskSheet.appendRow([
        taskId,
        task.title,
        task.description || "",
        task.batch || "",
        task.section || "All",
        task.deadline || "",
        task.formLink || "",
        body.actorEmail || "Tutor",
        new Date().toISOString()
      ]);

      logAudit(ss, body.actorEmail, "ADD_TASK", "Created task: " + task.title);
      return jsonResponse({ success: true, message: "Task posted successfully", taskId: taskId });
    }

    // 4. SUBMIT STUDENT TASK RESPONSE
    if (action === "submitTaskResponse") {
      var sub = body.submission;
      var subSheet = ss.getSheetByName("Submissions");
      if (!subSheet) subSheet = initializeSubmissionsSheet(ss);

      var subId = "SUB-" + Utilities.getUuid().substring(0, 8).toUpperCase();
      subSheet.appendRow([
        subId,
        sub.taskId,
        sub.regNo,
        sub.studentName,
        sub.responseUrl || sub.comment || "",
        "Submitted",
        new Date().toISOString()
      ]);

      return jsonResponse({ success: true, message: "Response submitted successfully", submissionId: subId });
    }

    return jsonResponse({ success: false, error: "Unsupported POST action: " + action }, 400);

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}

/**
 * One-click initialization for Google Sheets tables
 */
function initializeERPDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  initializeStudentsSheet(ss);
  initializeStaffSheet(ss);
  initializeTasksSheet(ss);
  initializeSubmissionsSheet(ss);
  initializeAuditSheet(ss);
  Logger.log("All ERP sheets initialized successfully!");
}

function initializeStudentsSheet(ss) {
  var sheet = ss.getSheetByName("Students") || ss.insertSheet("Students");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["RegNo", "Name", "Email", "Department", "Batch", "Section", "Phone", "BloodGroup", "Status", "CreatedAt"]);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#1d4ed8").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function initializeStaffSheet(ss) {
  var sheet = ss.getSheetByName("Staff") || ss.insertSheet("Staff");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["StaffID", "Name", "Email", "Department", "Designation", "AssignedTutorRole", "Phone", "Status"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#dc2626").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function initializeTasksSheet(ss) {
  var sheet = ss.getSheetByName("Tasks") || ss.insertSheet("Tasks");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["TaskID", "Title", "Description", "Batch", "Section", "Deadline", "FormLink", "CreatedBy", "CreatedAt"]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#1e40af").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function initializeSubmissionsSheet(ss) {
  var sheet = ss.getSheetByName("Submissions") || ss.insertSheet("Submissions");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["SubmissionID", "TaskID", "RegNo", "StudentName", "ResponseUrlOrComment", "Status", "SubmittedAt"]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function initializeAuditSheet(ss) {
  var sheet = ss.getSheetByName("AuditLog") || ss.insertSheet("AuditLog");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "ActorEmail", "Action", "Details"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#475569").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function logAudit(ss, actor, action, details) {
  try {
    var sheet = ss.getSheetByName("AuditLog") || initializeAuditSheet(ss);
    sheet.appendRow([new Date().toISOString(), actor || "system", action, details]);
  } catch (e) {
    // Audit logging failure should not break the main transaction
  }
}

/**
 * Utility: Convert sheet rows into JSON objects
 */
function sheetToObjects(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  var headers = values[0];
  var results = [];
  for (var r = 1; r < values.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = values[r][c];
    }
    results.push(obj);
  }
  return results;
}

/**
 * Utility: Produce JSON HTTP response
 */
function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
