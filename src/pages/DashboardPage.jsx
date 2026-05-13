import React from "react";
import { FileText, Loader2, UserCheck, UserX, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/dashboard/StatCard";
import ProcessingProgressBar from "../components/dashboard/ProcessingProgressBar";
import { useApp } from "../context/AppContext";
import { useProcessingStatus } from "../hooks/useProcessingStatus";

function WaveformAnimation() {
  return (
    <div className="flex items-end gap-1 h-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{ height: `${20 + Math.random() * 12}px`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function SuccessAnimation() {
  return (
    <div className="flex items-center justify-center w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#22C55E" strokeWidth="3" />
        <polyline
          points="20,34 28,42 44,22"
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 40,
            strokeDashoffset: 0,
            animation: "checkmark 0.5s ease forwards",
          }}
        />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, processingStatus } = useApp();
  const { processed, total, percentage } = useProcessingStatus();
  const navigate = useNavigate();

  const isIdle = processingStatus === "idle";
  const isProcessing = processingStatus === "processing";
  const isComplete = processingStatus === "completed";

  return (
    <div className="page-transition p-6 space-y-6">
      <div className={`rounded-2xl p-5 border flex items-center gap-4 ${
        isComplete
          ? "bg-green-500/5 border-green-500/20"
          : isProcessing
          ? "bg-indigo-500/5 border-indigo-500/20"
          : "bg-slate-800/50 border-slate-700"
      }`}>
        {isComplete ? (
          <SuccessAnimation />
        ) : isProcessing ? (
          <WaveformAnimation />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            <FileText size={18} className="text-slate-400" />
          </div>
        )}
        <div>
          <h3 className={`font-semibold text-base ${isComplete ? "text-green-300" : isProcessing ? "text-indigo-300" : "text-slate-100"}`}>
            {isComplete ? "Screening Complete!" : isProcessing ? "AI Screening in Progress..." : "No Active Screening"}
          </h3>
          <p className="text-sm text-slate-100 mt-0.5">
            {isComplete
              ? `${total} resumes processed — ${stats.selected} selected, ${stats.rejected} rejected.`
              : isProcessing
              ? "Analysing resumes against job requirements and scoring candidates..."
              : "Upload your job description and resumes to begin."}
          </p>
        </div>
        {isComplete && (
          <button
            onClick={() => navigate("/candidates")}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
          >
            View Candidates
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Uploaded"
          value={stats.total}
          accentClass="text-indigo-400"
          bgClass="bg-indigo-500"
          iconBg="bg-indigo-500/10"
        />
        <StatCard
          icon={Loader2}
          label="Processing"
          value={stats.processing}
          accentClass="text-amber-400"
          bgClass="bg-amber-500"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          icon={UserCheck}
          label="Selected"
          value={stats.selected}
          accentClass="text-green-400"
          bgClass="bg-green-500"
          iconBg="bg-green-500/10"
        />
        <StatCard
          icon={UserX}
          label="Rejected"
          value={stats.rejected}
          accentClass="text-red-400"
          bgClass="bg-red-500"
          iconBg="bg-red-500/10"
        />
      </div>

      {/* Progress Bar */}
      <ProcessingProgressBar
        processed={processed}
        total={total}
        percentage={percentage}
      />

      {/* Activity Feed (mock) */}
      {(isProcessing || isComplete) && (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1E293B] p-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-300 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { name: "Arjun Mehta", score: 91, status: "Selected", time: "just now" },
              { name: "Priya Sharma", score: 76, status: "Selected", time: "2s ago" },
              { name: "Rahul Das", score: 42, status: "Rejected", time: "4s ago" },
              { name: "Sneha Iyer", score: 88, status: "Selected", time: "6s ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-400">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span
                    className={`ml-2 text-xs font-semibold px-1.5 py-0.5 rounded font-mono ${
                      item.status === "Selected" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.score}/100
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-mono flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isIdle && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0F172A] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FileText size={22} className="text-slate-500 dark:text-slate-400" />
          </div>
          <p className="text-slate-900 dark:text-slate-400 font-medium">No screening data yet</p>
          <p className="text-slate-600 dark:text-slate-500 text-sm mt-1">Go to Upload to start a new screening session</p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-4 px-4 py-2 text-sm font-medium text-indigo-400 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-colors"
          >
            Go to Upload
          </button>
        </div>
      )}
    </div>
  );
}
