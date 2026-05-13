import React, { useEffect, useRef, useState } from "react";

function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const from = 0;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

export default function StatCard({ icon: Icon, label, value, accentClass, bgClass, iconBg }) {
  const displayValue = useCountUp(value);

  return (
    <div className={`relative rounded-xl p-5 border border-slate-800 bg-navy-900 dark:bg-[#1E293B] overflow-hidden group hover:border-slate-700 transition-colors`}>
      {/* Background accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-10 ${bgClass}`} />

      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={accentClass} />
        </div>
      </div>

      <div className="mt-4">
        <p
          className={`text-3xl font-bold font-mono ${accentClass}`}
          aria-live="polite"
          aria-label={`${label}: ${displayValue}`}
        >
          {displayValue}
        </p>
        <p className="text-sm text-slate-400 mt-1 font-sans">{label}</p>
      </div>
    </div>
  );
}
