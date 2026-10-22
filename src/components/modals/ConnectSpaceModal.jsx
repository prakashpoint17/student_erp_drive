import React, { useState } from "react";
import { 
  X, 
  HardDrive, 
  Check, 
  AlertCircle, 
  Mail, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  FileCode2,
  ChevronRight,
  Database
} from "lucide-react";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { useAuth } from "../../context/AuthContext";
import { DriveGatewayService } from "../../services/driveGatewayService";

export const ConnectSpaceModal = ({ isOpen, onClose }) => {
  const { connectSpace } = useDriveSpace();
  const { departments, currentUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Space Details, 2: Apps Script & Test

  const [formData, setFormData] = useState({
    name: "",
    departmentId: currentUser?.departmentId || "cse",
    type: "batch", // "batch" or "common"
    batchYear: "2028",
    accountEmail: "",
    webAppUrl: "",
    folderId: "",
    sheetId: "",
    description: ""
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  if (!isOpen) return null;

  // Auto-fill suggested name and email based on department and batch
  const handleTypeChange = (newType) => {
    const dept = formData.departmentId.toLowerCase();
    const isBatch = newType === "batch";
    setFormData({
      ...formData,
      type: newType,
      name: isBatch ? `${dept.toUpperCase()} Batch ${formData.batchYear} Space` : `${dept.toUpperCase()} Common Space`,
      accountEmail: isBatch ? `rvs${dept}${formData.batchYear}@gmail.com` : `rvs${dept}.dept@gmail.com`
    });
  };

  const handleDeptOrBatchChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    const dept = updated.departmentId.toLowerCase();
    const isBatch = updated.type === "batch";
    updated.name = isBatch ? `${dept.toUpperCase()} Batch ${updated.batchYear} Space` : `${dept.toUpperCase()} Common Space`;
    updated.accountEmail = isBatch ? `rvs${dept}${updated.batchYear}@gmail.com` : `rvs${dept}.dept@gmail.com`;
    setFormData(updated);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await DriveGatewayService.pingSpace(formData.webAppUrl);
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.accountEmail) {
      alert("Please provide the Space Name and Account Email.");
      return;
    }

    connectSpace({
      ...formData,
      status: "connected",
      folderId: formData.folderId || `folder_${Date.now()}`,
      sheetId: formData.sheetId || `sheet_${Date.now()}`
    });

    onClose();
    setStep(1);
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-blue-800 to-brand-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-brand-red-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Add Dedicated Google Drive Space</h3>
              <p className="text-xs text-brand-blue-200">15 GB Free Storage per Department or Batch Account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={`font-bold flex items-center gap-1.5 ${step === 1 ? 'text-brand-blue-700' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white text-[10px] flex items-center justify-center">1</span>
              Mail & Space Setup
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className={`font-bold flex items-center gap-1.5 ${step === 2 ? 'text-brand-blue-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center ${step === 2 ? 'bg-brand-blue-600' : 'bg-slate-300'}`}>2</span>
              Apps Script Gateway & Test
            </span>
          </div>
          <span className="text-[11px] text-brand-red-700 font-bold bg-brand-red-50 px-2 py-0.5 rounded border border-brand-red-200">
            ₹0 Cost Architecture
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 && (
            <>
              {/* Space Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Space Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => handleTypeChange("batch")}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                      formData.type === "batch"
                        ? "bg-brand-blue-50/70 border-brand-blue-400 ring-1 ring-brand-blue-400"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Batch-Specific Space</span>
                      {formData.type === "batch" && <Check className="w-3.5 h-3.5 text-brand-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Isolated student master, marks, class forms, and student certificates.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleTypeChange("common")}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                      formData.type === "common"
                        ? "bg-brand-red-50/70 border-brand-red-400 ring-1 ring-brand-red-400"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Department Common Space</span>
                      {formData.type === "common" && <Check className="w-3.5 h-3.5 text-brand-red-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Staff master directory, HOD administrative circulars, and policies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Department & Batch Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  {departments.length === 0 ? (
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={formData.departmentId}
                      onChange={(e) => handleDeptOrBatchChange("departmentId", e.target.value.toLowerCase())}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono uppercase"
                    />
                  ) : (
                    <select
                      value={formData.departmentId}
                      onChange={(e) => handleDeptOrBatchChange("departmentId", e.target.value)}
                      disabled={currentUser?.role === "hod"}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-500 font-semibold"
                    >
                      {departments.map(d => (
                        <option key={d.deptId} value={d.deptId}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  )}
                  {currentUser?.role === "hod" && (
                    <p className="text-[10px] text-blue-600 mt-1 font-medium">HOD authority scoped to your department.</p>
                  )}
                </div>

                {formData.type === "batch" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Batch Year</label>
                    <select
                      value={formData.batchYear}
                      onChange={(e) => handleDeptOrBatchChange("batchYear", e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="2025">Batch 2025 (Final Year)</option>
                      <option value="2026">Batch 2026 (3rd Year)</option>
                      <option value="2027">Batch 2027 (2nd Year)</option>
                      <option value="2028">Batch 2028 (1st Year)</option>
                      <option value="2029">Batch 2029</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Scope</label>
                    <div className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      Institution Department Master
                    </div>
                  </div>
                )}
              </div>

              {/* Space Name & Gmail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Space Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g. CSE Batch 2028 Space"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dedicated Space Gmail Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="rvscse2028@gmail.com"
                    value={formData.accountEmail}
                    onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 font-mono text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard format: <code className="bg-slate-100 px-1 py-0.2 rounded font-mono text-brand-blue-700">rvs[dept][batch]@gmail.com</code> (15 GB free Drive storage).
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Next: Configure Gateway & Test</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Google Apps Script Web App URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={formData.webAppUrl}
                    onChange={(e) => setFormData({ ...formData, webAppUrl: e.target.value })}
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 font-mono text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition shrink-0"
                  >
                    {testing ? "Testing..." : "Test Ping"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Deployed as Web App inside <strong className="text-slate-800">{formData.accountEmail || "the Gmail account"}</strong>.
                </p>
              </div>

              {/* Test Connection Output Badge */}
              {testResult && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                  testResult.success 
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200" 
                    : "bg-brand-red-50 text-brand-red-900 border border-brand-red-200"
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-brand-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {testResult.success ? "Drive Space Gateway Verified!" : "Verification Failed"}
                    </div>
                    <div className="text-[11px] mt-0.5 opacity-90">
                      {testResult.message || testResult.error}
                    </div>
                  </div>
                </div>
              )}

              {/* Folder and Sheet IDs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Drive Folder ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="1DriveFolderIdExample2028"
                    value={formData.folderId}
                    onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Sheet ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="1SheetIdExample2028"
                    value={formData.sheetId}
                    onChange={(e) => setFormData({ ...formData, sheetId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-700"
                  />
                </div>
              </div>

              {/* Disaster Recovery Note */}
              <div className="p-3 bg-brand-blue-50 border border-brand-blue-200 rounded-xl text-xs text-brand-blue-900">
                <span className="font-bold block mb-0.5">Independent Disaster Recovery:</span>
                <p className="text-[11px] text-brand-blue-800">
                  Because this space writes directly to <strong>{formData.accountEmail}</strong>, authorized department staff can open that Gmail account in Google Drive at any time to retrieve spreadsheets even if this website is lost!
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
                >
                  Back
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                  >
                    Register Drive Space
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
