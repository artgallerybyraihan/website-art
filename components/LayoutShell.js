"use client";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Shell({ children }) {
  const { dir, lang } = useLanguage();
  // Update html attributes
  if (typeof document !== "undefined") {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }
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
