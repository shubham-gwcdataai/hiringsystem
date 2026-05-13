import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

const DEMO_CREDENTIALS = [
  { email: "demo@hireiq.com", password: "password", name: "HR Manager", initials: "HM" },
  { email: "alice@hireiq.com", password: "password", name: "Alice Chen", initials: "AC" },
  { email: "bob@hireiq.com", password: "password", name: "Bob Kumar", initials: "BK" },
];

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("hireiq-theme");
    return stored ? stored === "dark" : false;
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("hireiq-user");
    return stored ? JSON.parse(stored) : null;
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

  useEffect(() => {
    if (user) {
      localStorage.setItem("hireiq-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hireiq-user");
    }
  }, [user]);

  const toggleTheme = () => setIsDark((d) => !d);

  const login = useCallback((email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const match = DEMO_CREDENTIALS.find(
          (c) => c.email === email.toLowerCase() && c.password === password
        );
        if (match) {
          setUser({ email: match.email, name: match.name, initials: match.initials });
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

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
        user, login, logout,
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