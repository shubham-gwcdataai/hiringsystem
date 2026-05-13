/**
 * AI Screening Engine
 * Reads real resume files from the ZIP, calls Claude API to score each
 * candidate against the actual JD and skills criteria.
 */

// ─── ZIP Parser ───────────────────────────────────────────────────────────────
// Returns array of { name, text } for each file in the ZIP
async function extractFilesFromZip(zipFile) {
  const buffer = await zipFile.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const files = [];

  let i = 0;
  while (i < bytes.length - 4) {
    // Local file header signature
    if (
      bytes[i] === 0x50 && bytes[i + 1] === 0x4b &&
      bytes[i + 2] === 0x03 && bytes[i + 3] === 0x04
    ) {
      const compression  = bytes[i + 8]  | (bytes[i + 9]  << 8);
      const compSize     = bytes[i + 18] | (bytes[i + 19] << 8) | (bytes[i + 20] << 16) | (bytes[i + 21] << 24);
      const uncompSize   = bytes[i + 22] | (bytes[i + 23] << 8) | (bytes[i + 24] << 16) | (bytes[i + 25] << 24);
      const nameLen      = bytes[i + 26] | (bytes[i + 27] << 8);
      const extraLen     = bytes[i + 28] | (bytes[i + 29] << 8);
      const nameBytes    = bytes.slice(i + 30, i + 30 + nameLen);
      const name         = new TextDecoder().decode(nameBytes);
      const dataStart    = i + 30 + nameLen + extraLen;

      if (
        !name.endsWith("/") &&
        !name.startsWith("__MACOSX") &&
        !name.includes("/.") &&
        name.trim() !== ""
      ) {
        const fileData = bytes.slice(dataStart, dataStart + compSize);
        let text = "";

        try {
          if (compression === 0) {
            // Stored (no compression)
            text = new TextDecoder("utf-8", { fatal: false }).decode(fileData);
          } else if (compression === 8) {
            // Deflate — use DecompressionStream if available
            if (typeof DecompressionStream !== "undefined") {
              const ds = new DecompressionStream("deflate-raw");
              const writer = ds.writable.getWriter();
              const reader = ds.readable.getReader();
              writer.write(fileData);
              writer.close();
              const chunks = [];
              let done = false;
              while (!done) {
                const { value, done: d } = await reader.read();
                if (value) chunks.push(value);
                done = d;
              }
              const merged = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
              let off = 0;
              for (const c of chunks) { merged.set(c, off); off += c.length; }
              text = new TextDecoder("utf-8", { fatal: false }).decode(merged);
            }
          }
        } catch (e) {
          text = "";
        }

        // Strip non-printable characters, keep readable text
        text = text.replace(/[^\x09\x0a\x0d\x20-\x7e\u00a0-\ufffd]/g, " ").replace(/\s+/g, " ").trim();

        if (text.length > 50) {
          files.push({ name: name.split("/").pop(), text: text.slice(0, 6000) });
        } else {
          // File had binary content (PDF etc.) — use filename as placeholder
          files.push({ name: name.split("/").pop(), text: `Resume file: ${name.split("/").pop()} (binary format — name used for screening)` });
        }
      }

      i = dataStart + compSize;
    } else {
      i++;
    }
  }
  return files;
}

// ─── JD Text Extractor ────────────────────────────────────────────────────────
async function extractJDText(jdFile) {
  try {
    if (jdFile.type === "text/plain") {
      return await jdFile.text();
    }
    // For PDF/DOCX — read as text (works for text-based PDFs and DOCX XML)
    const buffer = await jdFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    // Strip binary/XML noise, keep readable words
    text = text.replace(/<[^>]+>/g, " ").replace(/[^\x20-\x7e\n\r]/g, " ").replace(/\s+/g, " ").trim();
    return text.slice(0, 4000) || jdFile.name;
  } catch {
    return jdFile.name;
  }
}

// ─── Claude Screening Call ────────────────────────────────────────────────────
async function screenCandidateWithAI(resumeText, resumeName, jdText, skillsCriteria) {
  const prompt = `You are an expert technical recruiter and HR screening AI.

JOB DESCRIPTION:
${jdText.slice(0, 2000)}

REQUIRED SKILLS & CRITERIA:
${skillsCriteria}

RESUME (${resumeName}):
${resumeText.slice(0, 3000)}

Evaluate this candidate strictly against the job description and required skills. Be rigorous — not everyone should be selected.

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "name": "<full name from resume, or derive from filename if not found>",
  "role": "<job role they are applying for, inferred from JD>",
  "score": <integer 0-100, strictly based on match quality>,
  "status": "<'Selected' if score >= 65, else 'Rejected'>",
  "matchedSkills": ["<specific skill/experience matched>", ...],
  "missingRequirements": ["<specific missing skill or gap>", ...],
  "experienceAnalysis": "<2-3 sentence honest assessment of their experience fit>",
  "educationMatch": "<education qualification assessment>"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const raw = data.content?.find(b => b.type === "text")?.text || "{}";

  // Parse JSON — strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Main Export ──────────────────────────────────────────────────────────────
/**
 * screenAllCandidates
 * @param {File} zipFile - the uploaded ZIP of resumes
 * @param {File} jdFile  - the uploaded JD file
 * @param {string} skillsCriteria - the skills/criteria text
 * @param {function} onProgress - called with (processed, total) after each resume
 * @returns {Promise<Array>} array of screened candidate objects
 */
export async function screenAllCandidates(zipFile, jdFile, skillsCriteria, onProgress) {
  const [files, jdText] = await Promise.all([
    extractFilesFromZip(zipFile),
    extractJDText(jdFile),
  ]);

  const results = [];
  let processed = 0;

  for (const file of files) {
    try {
      const result = await screenCandidateWithAI(
        file.text,
        file.name,
        jdText,
        skillsCriteria
      );

      results.push({
        id: processed + 1,
        name: result.name || file.name.replace(/\.(pdf|docx|txt)$/i, ""),
        role: result.role || "Applicant",
        score: Math.min(100, Math.max(0, Number(result.score) || 50)),
        status: result.status === "Selected" ? "Selected" : "Rejected",
        email: `${(result.name || file.name).toLowerCase().replace(/\s+/g, ".")}@candidate.com`,
        matchedSkills: Array.isArray(result.matchedSkills) ? result.matchedSkills : [],
        missingRequirements: Array.isArray(result.missingRequirements) ? result.missingRequirements : [],
        experienceAnalysis: result.experienceAnalysis || "No analysis available.",
        educationMatch: result.educationMatch || "Not assessed.",
      });
    } catch (err) {
      console.error(`Failed to screen ${file.name}:`, err);
      // Fallback candidate entry on error
      results.push({
        id: processed + 1,
        name: file.name.replace(/\.(pdf|docx|txt)$/i, ""),
        role: "Applicant",
        score: 0,
        status: "Rejected",
        email: `candidate${processed + 1}@candidate.com`,
        matchedSkills: [],
        missingRequirements: ["Could not process resume"],
        experienceAnalysis: "Resume could not be parsed for AI screening.",
        educationMatch: "Not assessed.",
      });
    }

    processed++;
    if (onProgress) onProgress(processed, files.length);
  }

  return results;
}
