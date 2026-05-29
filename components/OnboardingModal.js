"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

// ── Constants ─────────────────────────────────────────────────────────────────
const LS_KEY = "artgallery_onboarded";
const TOTAL_STEPS = 5;

const INTENT_OPTIONS = [
  "Looking for artwork",
  "Art collector",
  "Exploring art",
  "Custom artwork",
  "Interior project",
  "Just browsing",
];

const COLLECTION_OPTIONS = [
  "Calligraphy",
  "Landscape",
  "Both",
  "Custom",
];

const ROLE_OPTIONS = [
  "Collector",
  "Interior Designer",
  "Home Owner",
  "Architect",
  "Business Owner",
  "Art Enthusiast",
  "First-time Buyer",
];

const AGE_OPTIONS = [
  "Under 25",
  "25–34",
  "35–44",
  "45–54",
  "55+",
];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium",
  "Bolivia","Bosnia and Herzegovina","Brazil","Brunei","Bulgaria","Cambodia",
  "Cameroon","Canada","Chile","China","Colombia","Costa Rica","Croatia","Cuba",
  "Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt",
  "Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece",
  "Guatemala","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia",
  "Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan",
  "Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Libya","Lithuania",
  "Luxembourg","Macau","Malaysia","Maldives","Malta","Mexico","Moldova","Mongolia",
  "Montenegro","Morocco","Myanmar","Nepal","Netherlands","New Zealand","Nigeria",
  "North Macedonia","Norway","Oman","Pakistan","Palestine","Panama","Paraguay",
  "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia",
  "South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden",
  "Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Tunisia",
  "Turkey","Turkmenistan","UAE","Uganda","Ukraine","United Kingdom",
  "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zimbabwe",
];

// ── Shared animation config ──────────────────────────────────────────────────
const EASE = [0.25, 0.46, 0.45, 0.94];

const stepVariants = {
  enter:  { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -16 },
};

// ── Pill selection button ────────────────────────────────────────────────────
function Pill({ label, selected, onClick, delay = 0 }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: EASE }}
      className={`px-4 py-2.5 text-[11px] font-medium tracking-[0.08em] rounded-sm border transition-all duration-300 cursor-pointer ${
        selected
          ? "border-[#6B1C2A] bg-[#6B1C2A]/6 text-[#6B1C2A] font-semibold"
          : "border-[#E8E0D6] bg-white text-[#9C9588] hover:border-[#6B1C2A]/30 hover:text-[#1A1A1A]"
      }`}
    >
      {label}
    </motion.button>
  );
}

// ── Country dropdown with search ─────────────────────────────────────────────
function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); }}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm border rounded-sm transition-all duration-300 ${
          open
            ? "border-[#6B1C2A]/40 bg-white"
            : "border-[#E8E0D6] bg-[#FAFAF8] hover:border-[#6B1C2A]/30"
        } ${value ? "text-[#1A1A1A]" : "text-[#9C9588]"}`}
      >
        <span>{value || "Select country..."}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-3.5 h-3.5 text-[#9C9588]"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E8E0D6] rounded-sm z-50 overflow-hidden"
            style={{ boxShadow: "0 16px 40px -8px rgba(0,0,0,0.12)" }}
          >
            <div className="p-2 border-b border-[#F0EBE3]">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-xs text-[#9C9588] italic">No results</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      value === c
                        ? "bg-[#6B1C2A]/5 text-[#6B1C2A] font-medium"
                        : "text-[#1A1A1A] hover:bg-[#F5F0EB]"
                    }`}
                  >
                    {c}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingModal() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [intent, setIntent] = useState("");
  const [collection, setCollection] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [ageRange, setAgeRange] = useState("");

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't show on admin pages
    if (pathname?.startsWith("/admin")) return;
    const done = localStorage.getItem(LS_KEY);
    if (!done) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  const submitData = useCallback(() => {
    const payload = {};
    if (intent) payload.intent = intent;
    if (collection) payload.collection = collection;
    if (country) payload.country = country;
    if (city) payload.city = city;
    if (role) payload.role = role;
    if (ageRange) payload.ageRange = ageRange;

    // Only send if at least one field is filled
    if (Object.keys(payload).length > 0) {
      trackEvent("visitor_onboarding", payload);
    }
  }, [intent, collection, country, city, role, ageRange]);

  const close = useCallback(() => {
    submitData();
    localStorage.setItem(LS_KEY, "1");
    setVisible(false);
  }, [submitData]);

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      close();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const skip = () => close();

  // Can we proceed? (optional — all steps are skippable, but we highlight when selected)
  const currentHasSelection = [intent, collection, country, role, ageRange][step];

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          id="onboarding-modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/55"
            style={{ backdropFilter: "blur(20px) saturate(120%)", WebkitBackdropFilter: "blur(20px) saturate(120%)" }}
            onClick={skip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-10 w-full max-w-[480px] bg-[#FAFAF8] rounded-sm overflow-hidden"
            style={{ boxShadow: "0 32px 80px -12px rgba(0,0,0,0.35)" }}
          >
            {/* Progress bar */}
            <div className="h-[2px] bg-[#E8E0D6]">
              <motion.div
                className="h-full bg-[#6B1C2A]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>

            {/* Header */}
            <div className="px-8 pt-8 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6B1C2A]" />
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#6B1C2A]/60">
                    Artgallery by Raihan
                  </span>
                </div>
                <button
                  onClick={skip}
                  className="text-[10px] tracking-[0.15em] uppercase text-[#9C9588] hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Step content */}
            <div className="px-8 pb-8 min-h-[320px] flex flex-col">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex-1 flex flex-col"
                >
                  {/* ── Step 0: Welcome + Intent ──────────────── */}
                  {step === 0 && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
                          Welcome to Artgallery
                          <br />
                          <span className="text-[#1A1A1A]/35 font-light italic">by Raihan</span>
                        </h2>
                        <p className="mt-3 text-sm text-[#9C9588] leading-relaxed">
                          Help us curate your gallery experience.
                        </p>
                      </div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-3">
                        What brings you here today?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INTENT_OPTIONS.map((opt, i) => (
                          <Pill
                            key={opt}
                            label={opt}
                            selected={intent === opt}
                            onClick={() => setIntent(intent === opt ? "" : opt)}
                            delay={i * 0.04}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── Step 1: Collection ────────────────────── */}
                  {step === 1 && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                          Your Preference
                        </h2>
                        <p className="mt-3 text-sm text-[#9C9588] leading-relaxed">
                          We present two distinct collections — each with its own soul.
                        </p>
                      </div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-3">
                        Which collection interests you most?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COLLECTION_OPTIONS.map((opt, i) => (
                          <Pill
                            key={opt}
                            label={opt}
                            selected={collection === opt}
                            onClick={() => setCollection(collection === opt ? "" : opt)}
                            delay={i * 0.04}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── Step 2: Location ──────────────────────── */}
                  {step === 2 && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                          Your Location
                        </h2>
                        <p className="mt-3 text-sm text-[#9C9588] leading-relaxed">
                          We ship original artworks worldwide from Indonesia.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-2">
                            Country
                          </label>
                          <CountrySelect value={country} onChange={setCountry} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-2">
                            City <span className="normal-case tracking-normal text-[#9C9588]/50">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Jakarta, London, Dubai..."
                            className="w-full px-4 py-3 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── Step 3: Role ──────────────────────────── */}
                  {step === 3 && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                          About You
                        </h2>
                        <p className="mt-3 text-sm text-[#9C9588] leading-relaxed">
                          This helps us understand our audience better.
                        </p>
                      </div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-3">
                        What best describes you?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ROLE_OPTIONS.map((opt, i) => (
                          <Pill
                            key={opt}
                            label={opt}
                            selected={role === opt}
                            onClick={() => setRole(role === opt ? "" : opt)}
                            delay={i * 0.04}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── Step 4: Age ───────────────────────────── */}
                  {step === 4 && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                          Almost Done
                        </h2>
                        <p className="mt-3 text-sm text-[#9C9588] leading-relaxed">
                          One last thing — this is completely optional.
                        </p>
                      </div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-3">
                        Age Range
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AGE_OPTIONS.map((opt, i) => (
                          <Pill
                            key={opt}
                            label={opt}
                            selected={ageRange === opt}
                            onClick={() => setAgeRange(ageRange === opt ? "" : opt)}
                            delay={i * 0.04}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#E8E0D6]/60">
                <div>
                  {step > 0 ? (
                    <button
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#9C9588] hover:text-[#1A1A1A] transition-colors font-medium"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#9C9588]/40 tracking-[0.1em]">
                      {step + 1} / {TOTAL_STEPS}
                    </span>
                  )}
                </div>

                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#6B1C2A] text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm transition-all duration-300"
                >
                  {step === TOTAL_STEPS - 1 ? (
                    <>
                      Explore Gallery
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Continue
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-500 ${
                      i === step
                        ? "w-5 h-1 bg-[#6B1C2A]"
                        : i < step
                        ? "w-1 h-1 bg-[#6B1C2A]/40"
                        : "w-1 h-1 bg-[#E8E0D6]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
