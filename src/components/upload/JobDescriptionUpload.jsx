import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud, X, CheckCircle } from "lucide-react";

export default function JobDescriptionUpload({ value, onChange }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted[0]) onChange(accepted[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "text/plain": [".txt"] },
    maxFiles: 1,
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (value) {
    return (
      <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <FileText size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value.name}</p>
            <p className="text-xs text-slate-500 font-mono">{formatSize(value.size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <button
            onClick={() => onChange(null)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? "border-indigo-500 bg-indigo-500/5"
          : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/40"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDragActive ? "bg-indigo-500/20" : "bg-slate-100 dark:bg-slate-800"}`}>
          <UploadCloud size={22} className={isDragActive ? "text-indigo-400" : "text-slate-500"} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isDragActive ? "Drop file here" : "Drag & Drop or Click to Upload"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Accepts .pdf, .docx, .txt</p>
        </div>
      </div>
    </div>
  );
}