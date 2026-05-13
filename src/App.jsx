import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import MobileNavBar from "./components/layout/MobileNavBar";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import CandidatesPage from "./pages/CandidatesPage";
import EmailPage from "./pages/EmailPage";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-slate-100 font-sans">
      <Sidebar />
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-16 lg:pb-0 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/email" element={<EmailPage />} />
          </Routes>
        </main>
      </div>
      <MobileNavBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProvider>
  );
}
