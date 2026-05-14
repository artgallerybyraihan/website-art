"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

import en from "./translations/en";
import id from "./translations/id";
import ar from "./translations/ar";
import tr from "./translations/tr";
import de from "./translations/de";
import es from "./translations/es";

const translations = { en, id, ar, tr, de, es };

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "id", label: "Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("artgallery-lang");
    if (saved && translations[saved]) setLangState(saved);
    setMounted(true);
  }, []);

  const setLang = useCallback((code) => {
    if (translations[code]) {
      setLangState(code);
      localStorage.setItem("artgallery-lang", code);
    }
  }, []);

  // Get nested translation key like "nav.home"
  const t = useCallback((key, fallback) => {
    const keys = key.split(".");
    let val = translations[lang];
    for (const k of keys) {
      if (val && typeof val === "object" && k in val) val = val[k];
      else { val = undefined; break; }
    }
    if (val !== undefined) return val;
    // Fallback to English
    let enVal = translations.en;
    for (const k of keys) {
      if (enVal && typeof enVal === "object" && k in enVal) enVal = enVal[k];
      else { enVal = undefined; break; }
    }
    return enVal ?? fallback ?? key;
  }, [lang]);

  const dir = LANGUAGES.find(l => l.code === lang)?.dir || "ltr";
  const isRTL = dir === "rtl";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, isRTL, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
