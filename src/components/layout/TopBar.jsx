import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";
import { useApp } from "../../context/AppContext";

const pageTitles = {
  "/upload": "Upload & Configure",
  "/dashboard": "Live Dashboard",
  "/candidates": "Candidate Results",
  "/email": "Email Actions",
};

export default function TopBar() {
  const { isDark, toggleTheme, processingStatus } = useApp();
  const location = useLocation();
  const title = pageTitles[location.pathname] || "HireIQ";
  const hasNotification = processingStatus === "completed";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] lg:bg-white lg:dark:bg-[#1E293B] sticky top-0 z-20">
      <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          )}
        </button>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
