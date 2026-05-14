import React, { useState, useRef } from "react";
import { X, Plus } from "lucide-react";

export default function SkillsCriteriaInput({ value, onChange }) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const tags = value ? value.split(", ").filter(Boolean) : [];

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(", "));
    setInputVal("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag).join(", "));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill (e.g. Python, AWS, React...)"
          className="flex-1 h-10 px-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={() => addTag(inputVal)}
          disabled={!inputVal.trim()}
          className="h-10 px-3 flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-indigo-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500">Press Enter to add a skill</p>
    </div>
  );
}
