import React, { useState } from "react";
import { X, Copy, Check, FileCode2, ExternalLink, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export const ScriptGuideModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptCode = `// =========================================================================
// STUDENT ERP SYSTEM - GOOGLE APPS SCRIPT DRIVE GATEWAY (ZERO-COST)
// Deploy inside your Space Gmail account (e.g. rvscse2026@gmail.com)
// =========================================================================

var SECRET_TOKEN = "RVS_ERP_SECURE_TOKEN_2026";

function doGet(e) {
  var action = (e && e.parameter) ? e.parameter.action : "ping";
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "ping") {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      account: Session.getActiveUser().getEmail(),
      sheetName: ss.getName(),
      status: "ONLINE"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "getStudents") {
    var sheet = ss.getSheetByName("Students");
    return jsonResponse(sheetToObjects(sheet));
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.token !== SECRET_TOKEN) {
    return jsonResponse({ success: false, error: "Unauthorized" });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (data.action === "addStudent") {
    var sheet = ss.getSheetByName("Students") || initializeSheet(ss);
    sheet.appendRow([
      data.student.regNo, data.student.name, data.student.email,
      data.student.department, data.student.batch, data.student.section,
      data.student.phone, data.student.bloodGroup, "Active", new Date().toISOString()
    ]);
    return jsonResponse({ success: true, message: "Recorded in Google Sheets" });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-blue-700 to-brand-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileCode2 className="w-5 h-5 text-brand-red-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Google Apps Script Drive Gateway (Zero Cost)</h3>
              <p className="text-xs text-brand-blue-200">How HODs connect dedicated Gmail accounts without a Python server</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Advantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-brand-blue-50 border border-brand-blue-200 rounded-xl">
              <span className="text-xs font-bold text-brand-blue-900 block mb-0.5">100% Free ₹0 Hosting</span>
              <p className="text-[11px] text-brand-blue-700">Runs directly on Google's cloud infrastructure at no cost.</p>
            </div>
            <div className="p-3 bg-brand-red-50 border border-brand-red-200 rounded-xl">
              <span className="text-xs font-bold text-brand-red-900 block mb-0.5">15 GB Storage / Account</span>
              <p className="text-[11px] text-brand-red-700">Common dept space & each batch space get separate 15GB pools.</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-900 block mb-0.5">Disaster Proof</span>
              <p className="text-[11px] text-emerald-700">If ERP website goes down, open the Gmail account to view sheets!</p>
            </div>
          </div>

          {/* 3 Step Setup Guide */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Simple 3-Step Setup for HOD:
            </h4>
            <ol className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <div>
                  <strong>Create Google Sheet:</strong> Open Google Drive in the space account (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">rvscse2026@gmail.com</code>) and create a sheet named <em>"ERP_Master_Database"</em>.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <div>
                  <strong>Paste Apps Script:</strong> In that sheet, click <strong>Extensions &gt; Apps Script</strong>. Replace the empty code with the script below.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <div>
                  <strong>Deploy as Web App:</strong> Click <strong>Deploy &gt; New Deployment</strong> &gt; Select <em>Web App</em> &gt; Set <em>Execute as: Me</em> &gt; <em>Access: Anyone</em> &gt; Copy the URL into ERP.
                </div>
              </li>
            </ol>
          </div>

          {/* Code Viewer */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">Google Apps Script Template (Code.js)</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-semibold rounded-lg transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 border border-slate-800">
              {scriptCode}
            </pre>
            <p className="text-[11px] text-slate-500 mt-1">
              Full version with automatic sheet formatting is saved in <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-blue-700 font-mono">google-apps-script/Code.js</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
