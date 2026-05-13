import React from "react";
import { NavLink } from "react-router-dom";
import { Upload, LayoutDashboard, Users, Mail } from "lucide-react";

const navItems = [
  { to: "/upload", icon: Upload, label: "Upload" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/candidates", icon: Users, label: "Candidates" },
  { to: "/email", icon: Mail, label: "Email" },
];

export default function MobileNavBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 flex">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-indigo-400" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={18} className={isActive ? "text-indigo-400" : "text-slate-500"} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
