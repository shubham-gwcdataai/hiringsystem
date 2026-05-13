import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function EmailConfirmModal({ isOpen, onClose, onConfirm, count, type }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSelected = type === "selected";
  const color = isSelected ? "text-green-400" : "text-red-400";
  const borderColor = isSelected ? "border-green-500/20" : "border-red-500/20";
  const btnClass = isSelected
    ? "bg-green-500 hover:bg-green-400 text-white"
    : "bg-red-500 hover:bg-red-400 text-white";

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className={`bg-white dark:bg-[#1E293B] border ${borderColor} rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <AlertTriangle size={18} className={color} />
              </div>
              <h3 id="modal-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Confirm Bulk Email
              </h3>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            You are about to send{" "}
            <span className={`font-semibold ${color}`}>
              {type === "selected" ? "shortlisting" : "rejection"}
            </span>{" "}
            emails to{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{count} candidates</span>.{" "}
            This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-500 border border-slate-300 rounded-xl hover:border-slate-400 hover:text-slate-700 dark:text-slate-400 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${btnClass}`}
            >
              Confirm & Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
