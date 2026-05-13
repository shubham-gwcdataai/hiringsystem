import React, { useState, useRef } from "react";
import { X, Tag } from "lucide-react";

export default function SkillsCriteriaInput({ value, onChange }) {
  const [inputVal, setInputVal] = useState("");
  const [tags, setTags] = useState([]);
  const [mode, setMode] = useState("tags"); // 'tags' | 'text'
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const newTags = [...tags, trimmed];
    setTags(newTags);
    onChange(newTags.join(", "));
    setInputVal("");
  };

  const removeTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onChange(newTags.join(", "));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  if (mode === "text") {
    return (
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="e.g., 5+ years Python, AWS experience, strong ML background, B.Tech in CS or related field..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={() => setMode("tags")}
          className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Switch to tag input
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className="min-h-[80px] bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 flex flex-wrap gap-2 items-start cursor-text focus-within:border-indigo-500 transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-xs font-medium text-indigo-300"
          >
            <Tag size={10} />
            {tag}
            <button
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="text-indigo-400 hover:text-red-400 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Type a skill and press Enter (e.g., Python, AWS, 5+ years ML...)" : "Add more..."}
          className="flex-1 min-w-[180px] bg-transparent text-sm text-slate-100 placeholder-slate-100 outline-none"
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-slate-500">Press Enter or comma to add a skill tag</p>
        <button
          onClick={() => setMode("text")}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Switch to text input
        </button>
      </div>
    </div>
  );
}
