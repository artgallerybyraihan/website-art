"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAnalytics } from "@/lib/analytics";
import OnboardingModal from "@/components/OnboardingModal";

function Shell({ children }) {
  const { dir, lang } = useLanguage();
  const pathname = usePathname();
  useAnalytics(); // auto-tracks pageview, time on page, exit page

  // Track self-exclusion state so button label renders correctly after hydration
  const [skipAnalytics, setSkipAnalytics] = useState(false);

  useEffect(() => {
    setSkipAnalytics(localStorage.getItem("artgallery_skip_analytics") === "1");
  }, []);

  // Update html attributes only on client to avoid hydration mismatch
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const toggleSkip = () => {
    const next = !skipAnalytics;
    localStorage.setItem("artgallery_skip_analytics", next ? "1" : "0");
    setSkipAnalytics(next);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <OnboardingModal />

      {/* Admin self-exclusion toggle — only visible on /admin pages */}
      {pathname?.startsWith("/admin") && (
        <div className="fixed top-4 right-4 z-50">
          <button
            type="button"
            onClick={toggleSkip}
            className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase border rounded-sm transition-all duration-300 ${
              skipAnalytics
                ? "bg-[#6B1C2A] text-white border-[#6B1C2A] hover:bg-[#4A0F1C]"
                : "bg-[#6B1C2A]/10 text-[#6B1C2A] border-[#6B1C2A]/30 hover:bg-[#6B1C2A]/20"
            }`}
          >
            {skipAnalytics ? "✓ My Actions Excluded" : "Exclude My Actions"}
          </button>
        </div>
      )}
    </>
  );
}

export default function LayoutShell({ children }) {
  return (
    <LanguageProvider>
      <Shell>{children}</Shell>
    </LanguageProvider>
  );
}
