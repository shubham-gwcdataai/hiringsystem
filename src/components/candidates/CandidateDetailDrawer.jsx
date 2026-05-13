import React, { useEffect } from "react";
import { X, CheckCircle, XCircle, BookOpen, GraduationCap, Briefcase } from "lucide-react";
import StatusBadge from "./StatusBadge";

function ScoreRing({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} stroke="#1E293B" strokeWidth="8" fill="none" />
        <circle
          cx="48" cy="48" r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono" style={{ color }}>{score}</span>
        <span className="text-[10px] text-slate-500 font-mono">/100</span>
      </div>
    </div>
  );
}

export default function CandidateDetailDrawer({ candidate, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!candidate) return null;
  const matchedSkills = candidate.matchedSkills || [];
  const missingRequirements = candidate.missingRequirements || [];
  const experienceAnalysis = candidate.experienceAnalysis || "No analysis available.";
  const educationMatch = candidate.educationMatch || "Not assessed.";

  return (
    <>

      <div
        className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-[#1E293B] border-l border-slate-200 dark:border-slate-700 z-50 overflow-y-auto animate-slideInRight"
        role="dialog"
        aria-modal="true"
        aria-label={`Candidate details for ${candidate.name}`}
      >
        <div className="sticky top-0 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{candidate.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.role}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close drawer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Score + Status */}
          <div className="flex items-center gap-6">
            <ScoreRing score={candidate.score} />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">AI Screening Status</p>
              <StatusBadge status={candidate.status} />
              <p className="text-xs text-slate-500 mt-3">Match Score (AI evaluated)</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-green-400" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Matched Skills
                <span className="ml-2 text-xs font-normal text-slate-500">({matchedSkills.length} found)</span>
              </h3>
            </div>
            {matchedSkills.length > 0 ? (
              <div className="space-y-2">
                {matchedSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5 px-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                    <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No matching skills identified.</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={14} className="text-red-400" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Missing Requirements
                <span className="ml-2 text-xs font-normal text-slate-500">({missingRequirements.length} gaps)</span>
              </h3>
            </div>
            {missingRequirements.length > 0 ? (
              <div className="space-y-2">
                {missingRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5 px-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <XCircle size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{req}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No major gaps identified.</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={14} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Experience Analysis</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              {experienceAnalysis}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={14} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Education Match</h3>
            </div>
            <div className="flex items-center gap-2.5 py-2 px-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <GraduationCap size={12} className="text-amber-400 flex-shrink-0" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{educationMatch}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <p className="text-xs text-slate-500">Evaluated by Claude AI against your JD & skills criteria</p>
          </div>
        </div>
      </div>
    </>
  );
}
