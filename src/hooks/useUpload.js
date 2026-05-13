import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Count files inside a ZIP by scanning the local file directory
async function countResumesInZip(zipFile) {
  try {
    const buffer = await zipFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // ZIP local file headers start with signature 0x504B0304
    let count = 0;
    for (let i = 0; i < bytes.length - 4; i++) {
      if (
        bytes[i] === 0x50 &&
        bytes[i + 1] === 0x4b &&
        bytes[i + 2] === 0x03 &&
        bytes[i + 3] === 0x04
      ) {
        // Read filename length at offset +26 (2 bytes, little-endian)
        const nameLen = bytes[i + 26] | (bytes[i + 27] << 8);
        // Read extra field length at offset +28
        const extraLen = bytes[i + 28] | (bytes[i + 29] << 8);
        // Get the filename
        const nameBytes = bytes.slice(i + 30, i + 30 + nameLen);
        const name = String.fromCharCode(...nameBytes);
        // Count only actual files (not directories, not __MACOSX junk)
        if (
          !name.endsWith("/") &&
          !name.startsWith("__MACOSX") &&
          !name.includes("/.") &&
          name.trim() !== ""
        ) {
          count++;
        }
        // Jump past this entry to avoid false positives inside file data
        const compressedSize = bytes[i + 18] | (bytes[i + 19] << 8) | (bytes[i + 20] << 16) | (bytes[i + 21] << 24);
        i += 30 + nameLen + extraLen + compressedSize - 1;
      }
    }
    return Math.max(count, 1);
  } catch {
    // Fallback: estimate from file size (~100KB per resume)
    return Math.max(1, Math.round(zipFile.size / (100 * 1024)));
  }
}

export function useUpload() {
  const { uploadData, setUploadData, startScreening } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setJD = (file) => setUploadData((d) => ({ ...d, jd: file }));
  const setSkills = (skills) => setUploadData((d) => ({ ...d, skills }));
  const setResumeZip = (file) => setUploadData((d) => ({ ...d, resumeZip: file }));

  const canStart = uploadData.jd && uploadData.skills.trim() && uploadData.resumeZip;

  const handleStartScreening = async () => {
    if (!canStart) return;
    setIsLoading(true);
    try {
      // Count actual resumes in the ZIP
      const resumeCount = await countResumesInZip(uploadData.resumeZip);

      await new Promise((r) => setTimeout(r, 1200)); // Simulate network
      startScreening(resumeCount);
      toast.success(`Screening started! ${resumeCount} resumes detected.`, {
        style: { background: "#1E293B", color: "#E2E8F0", border: "1px solid #6366F1" },
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Upload failed. Please try again.", {
        style: { background: "#1E293B", color: "#E2E8F0", border: "1px solid #EF4444" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadData, setJD, setSkills, setResumeZip, canStart, isLoading, handleStartScreening };
}
