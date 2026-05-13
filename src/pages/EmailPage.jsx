import React from "react";
import { Mail } from "lucide-react";
import EmailActionsPanel from "../components/email/EmailActionsPanel";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function EmailPage() {
  const { processingStatus } = useApp();
  const navigate = useNavigate();

  if (processingStatus !== "completed") {
    return (
      <div className="page-transition p-6">
        <div className="rounded-2xl border border-dashed border-slate-700 p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-slate-600" />
          </div>
          <p className="text-slate-300 font-semibold text-lg">No screening results yet</p>
          <p className="text-slate-500 text-sm mt-1.5">
            Complete a screening session before sending emails to candidates.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-5 px-5 py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-colors"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Email Actions</h2>
        <p className="text-sm text-slate-400 mt-1">
          Send automated emails to shortlisted and rejected candidates.
        </p>
      </div>
      <EmailActionsPanel />
    </div>
  );
}