"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const useLight = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Collection" },
    { href: "/artist", label: "Artists" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#FAFAF8]/90 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="group focus:outline-none" id="nav-logo">
              <div className="flex flex-col leading-none">
                <span className={`text-sm font-bold tracking-[0.25em] uppercase transition-colors duration-500 ${useLight ? "text-white" : "text-[#1A1A1A]"}`}>
                  Artgallery
                </span>
                <span className={`text-[9px] tracking-[0.2em] uppercase font-medium transition-colors duration-500 mt-0.5 ${useLight ? "text-white/60" : "text-maroon"}`}>
                  by Raihan
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={`nav-${link.label.toLowerCase()}`}
                    className={`nav-link text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
                      useLight
                        ? isActive ? "text-white" : "text-white/60 hover:text-white"
                        : isActive ? "text-[#1A1A1A]" : "text-[#9C9588] hover:text-[#1A1A1A]"
                    } ${isActive ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* CTA WhatsApp pill */}
              <a
                href="https://wa.me/6289529592251"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${
                  useLight
                    ? "border-white/30 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/50"
                    : "border-maroon/25 text-maroon hover:bg-maroon hover:text-white"
                }`}
                id="nav-whatsapp"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire
              </a>
            </div>

            {/* Mobile Burger */}
            <button
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-5 h-[1.5px] origin-center rounded-full transition-colors duration-500 ${useLight ? "bg-white" : "bg-[#1A1A1A]"}`}
              />
              <motion.span
                animate={isMobileOpen ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`block w-5 h-[1.5px] rounded-full transition-colors duration-500 ${useLight ? "bg-white" : "bg-[#1A1A1A]"}`}
              />
              <motion.span
                animate={isMobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-5 h-[1.5px] origin-center rounded-full transition-colors duration-500 ${useLight ? "bg-white" : "bg-[#1A1A1A]"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Full-screen Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(250,250,248,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Brand in mobile */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="absolute top-0 left-6 h-20 flex items-center"
            >
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-[0.25em] uppercase text-[#1A1A1A]">Artgallery</span>
                <span className="text-[9px] tracking-[0.2em] uppercase font-medium mt-0.5 text-maroon">by Raihan</span>
              </div>
            </motion.div>

            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href={link.href}
                    className={`text-3xl font-bold tracking-[0.05em] uppercase transition-colors duration-300 ${
                      pathname === link.href
                        ? "text-maroon"
                        : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute bottom-10"
            >
              <a
                href="https://wa.me/6289529592251"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-maroon"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire via WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
