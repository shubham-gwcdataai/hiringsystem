import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Archive, X, CheckCircle, FileArchive } from "lucide-react";

async function countResumesInZip(zipFile) {
  try {
    const buffer = await zipFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let count = 0;
    for (let i = 0; i < bytes.length - 4; i++) {
      if (
        bytes[i] === 0x50 &&
        bytes[i + 1] === 0x4b &&
        bytes[i + 2] === 0x03 &&
        bytes[i + 3] === 0x04
      ) {
        const nameLen = bytes[i + 26] | (bytes[i + 27] << 8);
        const extraLen = bytes[i + 28] | (bytes[i + 29] << 8);
        const nameBytes = bytes.slice(i + 30, i + 30 + nameLen);
        const name = String.fromCharCode(...nameBytes);
        if (
          !name.endsWith("/") &&
          !name.startsWith("__MACOSX") &&
          !name.includes("/.") &&
          name.trim() !== ""
        ) {
          count++;
        }
        const compressedSize =
          bytes[i + 18] | (bytes[i + 19] << 8) | (bytes[i + 20] << 16) | (bytes[i + 21] << 24);
        i += 30 + nameLen + extraLen + compressedSize - 1;
      }
    }
    return Math.max(count, 1);
  } catch {
    return Math.max(1, Math.round(zipFile.size / (100 * 1024)));
  }
}

export default function ResumeZipUpload({ value, onChange }) {
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    if (!value) { setResumeCount(0); return; }
    countResumesInZip(value).then(setResumeCount);
  }, [value]);

  const onDrop = useCallback(
    (accepted, rejected) => {
      if (rejected.length > 0) return;
      if (accepted[0]) onChange(accepted[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/zip": [".zip"], "application/x-zip-compressed": [".zip"] },
    maxFiles: 1,
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (value) {
    return (
      <div className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <FileArchive size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{value.name}</p>
            <p className="text-xs text-slate-500 font-mono">
              {formatSize(value.size)} · {resumeCount > 0 ? `${resumeCount} resumes detected` : "Counting..."}
            </p>
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
          ? "border-amber-500 bg-amber-500/5"
          : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/40"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDragActive ? "bg-amber-500/20" : "bg-slate-800"}`}>
          <Archive size={22} className={isDragActive ? "text-amber-400" : "text-slate-500"} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-300">
            {isDragActive ? "Drop ZIP file here" : "Drag & Drop or Click to Upload"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Accepts .zip files only</p>
        </div>
      </div>
    </div>
  );
}
