import React, { useState } from "react";
import { useDriveSpace } from "../../context/DriveSpaceContext";
import { HardDrive, ChevronDown, Check, ExternalLink, ShieldCheck, Database, Layers } from "lucide-react";

export const DriveSpaceSelector = ({ onOpenConnectModal, onOpenScriptGuide }) => {
  const { activeSpace, spaces, selectSpace, getPermittedSpaces, exportSpaceDataAsCSV } = useDriveSpace();
  const [isOpen, setIsOpen] = useState(false);

  const permitted = getPermittedSpaces();

  const getUsagePercent = (used, total) => {
    return Math.min(100, Math.round((used / total) * 100));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition text-left"
        title="Select Active Google Drive Space"
      >
        <div className="w-8 h-8 rounded-lg bg-brand-blue-50 border border-brand-blue-200 flex items-center justify-center text-brand-blue-700">
          <HardDrive className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          {activeSpace ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">
                  {activeSpace.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  activeSpace.type === "common" 
                    ? "bg-brand-red-50 text-brand-red-700 border border-brand-red-200" 
                    : "bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200"
                }`}>
                  {activeSpace.type === "common" ? "Common Space" : `Batch ${activeSpace.batchYear || ""}`}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <span className="truncate max-w-[150px]">{activeSpace.accountEmail}</span>
                <span>•</span>
                <span className="text-slate-600 font-sans">{activeSpace.usedStorageGB || 0.1}GB / 15GB Free</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">
                  Drive Spaces
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  0 Connected
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Click to connect 15 GB space
              </div>
            </>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-brand-blue-600" />
                  Authorized Drive Spaces
                </h4>
                <p className="text-[11px] text-slate-500">Each space uses its own 15GB free Google Drive storage</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">{permitted.length} available</span>
            </div>

            <div className="max-h-72 overflow-y-auto p-1 space-y-1">
              {permitted.length === 0 && (
                <div className="py-6 px-4 text-center">
                  <HardDrive className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">No Drive Spaces Connected</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 mb-2">Connect a dedicated Gmail account with 15GB free storage.</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenConnectModal?.();
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                  >
                    + Connect Drive Space
                  </button>
                </div>
              )}
              {permitted.map(space => {
                const isSelected = space.spaceId === activeSpace?.spaceId;
                const percent = getUsagePercent(space.usedStorageGB, space.totalStorageGB);
                
                return (
                  <div
                    key={space.spaceId}
                    onClick={() => {
                      selectSpace(space.spaceId);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-lg cursor-pointer transition border text-left ${
                      isSelected
                        ? "bg-brand-blue-50/70 border-brand-blue-300 shadow-xs"
                        : "hover:bg-slate-50 border-transparent hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${
                          space.type === "common" 
                            ? "bg-brand-red-100 text-brand-red-700" 
                            : "bg-brand-blue-100 text-brand-blue-700"
                        }`}>
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                            {space.name}
                            {isSelected && <Check className="w-3.5 h-3.5 text-brand-blue-600 inline" />}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {space.accountEmail}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        space.type === "common" 
                          ? "bg-brand-red-50 text-brand-red-700" 
                          : "bg-brand-blue-50 text-brand-blue-700"
                      }`}>
                        {space.type === "common" ? "Dept Master" : `Batch ${space.batchYear}`}
                      </span>
                    </div>

                    {/* Storage Bar */}
                    <div className="mt-2 pl-8">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                        <span>Drive Storage</span>
                        <span className="font-medium text-slate-700">{space.usedStorageGB} GB used of 15.0 GB ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percent > 80 ? 'bg-brand-red-600' : 'bg-brand-blue-600'}`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="mt-2 pt-2 border-t border-slate-100 px-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenConnectModal?.();
                  }}
                  className="text-[11px] text-brand-red-600 hover:text-brand-red-700 font-bold flex items-center gap-1 py-1"
                >
                  <span>+ Add New Mail GSpace</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    exportSpaceDataAsCSV?.(activeSpace?.spaceId);
                  }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 py-1"
                  title="Download offline CSV backup of active space records"
                >
                  <span>Download CSV Backup</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenScriptGuide?.();
                  }}
                  className="text-brand-blue-700 hover:text-brand-blue-800 font-medium flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Apps Script Guide</span>
                </button>
                
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-800 flex items-center gap-1"
                  title="Open Google Drive directly to inspect sheets"
                >
                  <span>Direct Drive Access</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
