import React from "react";

export default function ProcessingProgressBar({ processed, total, percentage }) {
  const getColor = () => {
    if (percentage >= 80) return "from-indigo-500 to-green-500";
    if (percentage >= 50) return "from-indigo-500 to-indigo-400";
    return "from-indigo-600 to-indigo-500";
  };

  return (
    <div className="rounded-xl p-5 border border-slate-800 bg-navy-900 dark:bg-[#1E293B]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-300">
          Processing Progress
        </span>
        <span className="text-sm font-mono text-slate-400">
          {processed} <span className="text-slate-600">/</span> {total || "—"} resumes
        </span>
      </div>

      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColor()} rounded-full progress-fill`}
          style={{ width: `${percentage}%` }}
        />
        {percentage > 0 && percentage < 100 && (
          <div className="absolute inset-0 animate-shimmer" />
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500">
          {percentage === 0 ? "Waiting..." : percentage === 100 ? "Complete!" : "Processing..."}
        </span>
        <span className="text-xs font-mono font-semibold text-indigo-400">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
