import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const configs = {
  Selected: {
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  Processing: {
    icon: Clock,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse",
  },
};

export default function StatusBadge({ status }) {
  const config = configs[status] || configs.Processing;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}
