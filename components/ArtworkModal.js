"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppLink } from "@/lib/data";

export default function ArtworkModal({
  artwork,
  artworks = [],
  isOpen,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const current = artworks[currentIndex] || artwork;

  // Sync currentIndex when artwork prop changes
  useEffect(() => {
    if (artwork && artworks.length > 0) {
      const idx = artworks.findIndex((a) => a.id === artwork.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [artwork, artworks]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goNext = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      setDirection(1);
      setZoomed(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, artworks.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setZoomed(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, goNext, goPrev]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  if (!current) return null;

  const whatsappLink = getWhatsAppLink(current.title, {
    medium: current.medium,
    size: current.size,
    artist: current.artist,
  });

  // Slide variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          id="artwork-modal"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
            id="modal-close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Counter */}
          {artworks.length > 1 && (
            <div className="absolute top-7 left-6 z-10 text-xs text-white/40 font-medium tracking-wider">
              {currentIndex + 1} / {artworks.length}
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-h-[90vh] overflow-y-auto lg:overflow-visible">
            {/* Image */}
            <div
              className="relative flex-1 w-full lg:w-auto"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4] max-h-[60vh] lg:max-h-[75vh] w-full modal-zoom-container ${
                    zoomed ? "zoomed" : ""
                  }`}
                  onClick={() => setZoomed(!zoomed)}
                >
                  <Image
                    src={current.image}
                    alt={`${current.title} — ${current.medium} by ${current.artist}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-contain transition-transform duration-500 ${
                      zoomed ? "scale-150" : "scale-100"
                    }`}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Details panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + "-details"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="lg:w-[340px] shrink-0 space-y-6 pb-8 lg:pb-0"
              >
                {/* Title & Artist */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
                    {current.title}
                  </h2>
                  <p className="text-sm text-white/50 mt-1 font-medium">
                    {current.artist}
                  </p>
                </div>

                {/* Gold separator */}
                <div className="w-12 h-[1px] bg-[#B8976A]" />

                {/* Metadata */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium">
                      Medium
                    </span>
                    <p className="text-sm text-white/70 mt-0.5">
                      {current.medium}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium">
                      Size
                    </span>
                    <p className="text-sm text-white/70 mt-0.5">
                      {current.size}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium">
                      Year
                    </span>
                    <p className="text-sm text-white/70 mt-0.5">
                      {current.year}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-white/50 italic">
                  &ldquo;{current.description}&rdquo;
                </p>

                {/* Original Work badge */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B8976A]" />
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[#B8976A] font-medium">
                    Original Work — One of One
                  </span>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-pulse inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 bg-[#B8976A] hover:bg-[#A07F56] text-white text-xs font-medium tracking-[0.15em] uppercase rounded-sm transition-colors duration-300"
                  id="modal-whatsapp-cta"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enquire via WhatsApp
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          {artworks.length > 1 && (
            <>
              {/* Previous */}
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 ${
                  currentIndex === 0
                    ? "opacity-20 pointer-events-none"
                    : ""
                }`}
                aria-label="Previous artwork"
                id="modal-prev"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={goNext}
                disabled={currentIndex === artworks.length - 1}
                className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 ${
                  currentIndex === artworks.length - 1
                    ? "opacity-20 pointer-events-none"
                    : ""
                }`}
                aria-label="Next artwork"
                id="modal-next"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
