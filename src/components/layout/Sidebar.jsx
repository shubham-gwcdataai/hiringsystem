import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Upload, LayoutDashboard, Users, Mail,
  Sparkles, Settings, ChevronRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const navItems = [
  { to: "/upload", icon: Upload, label: "Upload" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/candidates", icon: Users, label: "Candidates" },
  { to: "/email", icon: Mail, label: "Email Actions" },
];

export default function Sidebar() {
  const { isDark } = useApp();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 z-30 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="font-sans font-700 text-lg text-slate-900 dark:text-white tracking-tight">
          Hire<span className="text-indigo-400">IQ</span>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 pl-[10px]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"} />
                <span>{label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto text-indigo-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            HR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">HR Manager</p>
            <p className="text-xs text-slate-500 truncate">hr@company.com</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Settings">
            <Settings size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
