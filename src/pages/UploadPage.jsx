import React from "react";
import { FileText, Tag, Archive, Rocket, Loader2 } from "lucide-react";
import JobDescriptionUpload from "../components/upload/JobDescriptionUpload";
import SkillsCriteriaInput from "../components/upload/SkillsCriteriaInput";
import ResumeZipUpload from "../components/upload/ResumeZipUpload";
import { useUpload } from "../hooks/useUpload";

function StepLabel({ number, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
        <span className="text-xs font-bold font-mono text-indigo-400">{number}</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-slate-400" />
        <span className="text-sm font-semibold text-slate-200">{title}</span>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const { uploadData, setJD, setSkills, setResumeZip, canStart, isLoading, handleStartScreening } = useUpload();

  return (
    <div className="page-transition min-h-full py-8 px-4">
      <div className="max-w-[860px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Configure AI Screening</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Provide the job description, required skills, and candidate resumes to begin automated screening.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1E293B] p-6">
            <StepLabel number="01" title="Job Description" icon={FileText} />
            <JobDescriptionUpload value={uploadData.jd} onChange={setJD} />
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1E293B] p-6">
            <StepLabel number="02" title="Required Skills & Criteria" icon={Tag} />
            <SkillsCriteriaInput value={uploadData.skills} onChange={setSkills} />
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1E293B] p-6">
            <StepLabel number="03" title="Candidate Resumes (ZIP)" icon={Archive} />
            <ResumeZipUpload value={uploadData.resumeZip} onChange={setResumeZip} />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <button
            onClick={handleStartScreening}
            disabled={!canStart || isLoading}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-semibold transition-all duration-200 ${
              canStart && !isLoading
                ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            aria-disabled={!canStart || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Starting Screening...
              </>
            ) : (
              <>
                <Rocket size={18} />
                Start AI Screening
              </>
            )}
          </button>

          {!canStart && !isLoading && (
            <p className="text-center text-xs text-slate-500 mt-3">
              Complete all three steps above to begin screening
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
