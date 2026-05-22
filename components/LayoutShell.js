"use client";
import { useEffect } from "react";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAnalytics } from "@/lib/analytics";

function Shell({ children }) {
  const { dir, lang } = useLanguage();
  useAnalytics(); // auto-tracks pageview, time on page, exit page

  // Update html attributes only on client to avoid hydration mismatch
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
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
