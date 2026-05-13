import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { screenAllCandidates } from "../utils/screeningEngine";
import toast from "react-hot-toast";

export function useProcessingStatus() {
  const {
    processingStatus,
    setProcessingStatus,
    setStats,
    setCandidates,
    stats,
    uploadData,
  } = useApp();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (processingStatus !== "processing") {
      hasStarted.current = false;
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;

    const total = stats.total;

    const run = async () => {
      try {
        const results = await screenAllCandidates(
          uploadData.resumeZip,
          uploadData.jd,
          uploadData.skills,
          (processed, t) => {
            const selected = results ? results.filter(r => r.status === "Selected").length : 0;
            const rejected = processed - selected;
            setStats({
              total: t,
              processing: t - processed,
              selected,
              rejected,
            });
          }
        );

        const finalSelected = results.filter(r => r.status === "Selected").length;
        const finalRejected = results.length - finalSelected;

        setProcessingStatus("completed");
        setCandidates(results);
        setStats({
          total: results.length,
          processing: 0,
          selected: finalSelected,
          rejected: finalRejected,
        });

        toast.success(
          ` Screening Complete! ${results.length} resumes processed — ${finalSelected} selected, ${finalRejected} rejected.`,
          {
            duration: 6000,
            style: { background: "#1E293B", color: "#E2E8F0", border: "1px solid #22C55E" },
          }
        );
      } catch (err) {
        console.error("Screening failed:", err);
        setProcessingStatus("idle");
        toast.error("Screening failed. Check your API key or network and try again.", {
          style: { background: "#1E293B", color: "#E2E8F0", border: "1px solid #EF4444" },
        });
      }
    };

    run();
  }, [processingStatus]);

  const processed = stats.total - stats.processing;
  const percentage = stats.total > 0 ? Math.round((processed / stats.total) * 100) : 0;

  return { processingStatus, processed, total: stats.total, percentage };
}
