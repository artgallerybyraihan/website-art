"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomDropdown({ options, value, onChange, labelPrefix = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] uppercase rounded-sm transition-all duration-300 border ${
          isOpen
            ? "border-maroon/40 bg-maroon/5 text-foreground"
            : "border-warm-gray/15 bg-white hover:border-maroon/30 hover:bg-maroon/3 text-foreground"
        }`}
      >
        {labelPrefix && (
          <span className="text-warm-gray/50">{labelPrefix}</span>
        )}
        <span className="font-semibold">{selectedOption?.label}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-3 h-3 ml-0.5 text-warm-gray/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-full left-0 mt-2 min-w-[160px] bg-white border border-warm-gray/10 shadow-2xl rounded-sm z-50 overflow-hidden"
            style={{ boxShadow: "0 16px 40px -8px rgba(0,0,0,0.14)" }}
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt.value}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-200 flex items-center gap-2 ${
                  value === opt.value
                    ? "bg-maroon/6 text-maroon"
                    : "text-warm-gray hover:bg-warm-gray/5 hover:text-foreground"
                }`}
              >
                {value === opt.value && (
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
                <span className={value === opt.value ? "" : "ml-5"}>{opt.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
