import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("hireiq-theme");
    return stored ? stored === "dark" : true;
  });
  const [processingStatus, setProcessingStatus] = useState("idle"); // idle | processing | completed
  const [stats, setStats] = useState({ total: 0, processing: 0, selected: 0, rejected: 0 });
  const [candidates, setCandidates] = useState([]);
  const [uploadData, setUploadData] = useState({ jd: null, skills: "", resumeZip: null });
  const [emailSentSelected, setEmailSentSelected] = useState(false);
  const [emailSentRejected, setEmailSentRejected] = useState(false);

  useEffect(() => {
    localStorage.setItem("hireiq-theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);
  const startScreening = (resumeCount = 0) => {
    setProcessingStatus("processing");
    setStats({ total: resumeCount, processing: resumeCount, selected: 0, rejected: 0 });
    setCandidates([]);
    setEmailSentSelected(false);
    setEmailSentRejected(false);
  };

  return (
    <AppContext.Provider
      value={{
        isDark, toggleTheme,
        processingStatus, setProcessingStatus,
        stats, setStats,
        candidates, setCandidates,
        uploadData, setUploadData,
        emailSentSelected, setEmailSentSelected,
        emailSentRejected, setEmailSentRejected,
        startScreening,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}