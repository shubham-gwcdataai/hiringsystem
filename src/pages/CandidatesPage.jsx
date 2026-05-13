import React from "react";
import { Users, UserCheck, UserX } from "lucide-react";
import CandidateTable from "../components/candidates/CandidateTable";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function CandidatesPage() {
  const { candidates, stats, processingStatus } = useApp();
  const navigate = useNavigate();

  if (processingStatus === "idle" || candidates.length === 0) {
    return (
      <div className="page-transition p-6">
        <div className="rounded-2xl border border-dashed border-slate-700 p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-slate-600" />
          </div>
          <p className="text-slate-300 font-semibold text-lg">No candidates yet</p>
          <p className="text-slate-500 text-sm mt-1.5">
            {processingStatus === "processing"
              ? "Screening in progress — check back soon."
              : "Run a screening session to see candidate results here."}
          </p>
          {processingStatus !== "processing" && (
            <button
              onClick={() => navigate("/upload")}
              className="mt-5 px-5 py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-colors"
            >
              Start Screening
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition p-6 space-y-5">
      {/* Summary strip */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
          <Users size={14} className="text-slate-500" />
          <span className="text-sm font-mono text-slate-300">{candidates.length}</span>
          <span className="text-xs text-slate-500">total</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/5 border border-green-500/20">
          <UserCheck size={14} className="text-green-400" />
          <span className="text-sm font-mono text-green-400">{stats.selected}</span>
          <span className="text-xs text-slate-500">selected</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/20">
          <UserX size={14} className="text-red-400" />
          <span className="text-sm font-mono text-red-400">{stats.rejected}</span>
          <span className="text-xs text-slate-500">rejected</span>
        </div>
      </div>

      {/* Grid */}
      <CandidateTable />
    </div>
  );
}
