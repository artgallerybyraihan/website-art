"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { getPrimaryImage } from "@/lib/utils";

export default function ArtworkModal({
  artwork,
  artworks = [],
  isOpen,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);
  const [imageDirection, setImageDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const current = artworks[currentIndex] || artwork;
  const currentImages = current?.images || [getPrimaryImage(current)];
  const totalImages = currentImages.length;

  // Sync currentIndex when artwork prop changes
  useEffect(() => {
    if (artwork && artworks.length > 0) {
      const idx = artworks.findIndex((a) => a.id === artwork.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
    setImageIndex(0);
    setZoomed(false);
  }, [artwork, artworks]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const goNext = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      setDirection(1);
      setZoomed(false);
      setImageIndex(0);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, artworks.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setZoomed(false);
      setImageIndex(0);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goNextImage = useCallback(() => {
    if (imageIndex < totalImages - 1) {
      setImageDirection(1);
      setZoomed(false);
      setImageIndex((prev) => prev + 1);
    }
  }, [imageIndex, totalImages]);

  const goPrevImage = useCallback(() => {
    if (imageIndex > 0) {
      setImageDirection(-1);
      setZoomed(false);
      setImageIndex((prev) => prev - 1);
    }
  }, [imageIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        if (totalImages > 1 && imageIndex < totalImages - 1) goNextImage();
        else goNext();
      }
      if (e.key === "ArrowLeft") {
        if (totalImages > 1 && imageIndex > 0) goPrevImage();
        else goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, goNext, goPrev, goNextImage, goPrevImage, totalImages, imageIndex]);

  // Touch swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        if (totalImages > 1 && imageIndex < totalImages - 1) goNextImage();
        else goNext();
      } else {
        if (totalImages > 1 && imageIndex > 0) goPrevImage();
        else goPrev();
      }
    }
  };

  if (!current) return null;

  const whatsappLink = getWhatsAppLink(current.title, {
    medium: current.medium,
    size: current.size,
    artist: current.artist,
  });

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const imageSlideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          id="artwork-modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/88 modal-backdrop"
            onClick={onClose}
          />

          {/* Top bar: counter + close */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
            {artworks.length > 1 ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-medium">
                  {currentIndex + 1}
                </span>
                <svg className="w-3 h-[1px] text-white/20" viewBox="0 0 12 1" fill="none">
                  <line x1="0" y1="0.5" x2="12" y2="0.5" stroke="currentColor"/>
                </svg>
                <span className="text-[10px] text-white/25 tracking-[0.2em] uppercase font-medium">
                  {artworks.length}
                </span>
              </div>
            ) : (
              <div />
            )}

            <button
              onClick={onClose}
              className="modal-close-btn w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white"
              aria-label="Close modal"
              id="modal-close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 pt-16 pb-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-h-screen overflow-y-auto lg:overflow-visible">

            {/* ── Image Panel ── */}
            <div
              className="relative flex-1 w-full lg:w-auto"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait" custom={imageDirection}>
                <motion.div
                  key={`${current.id}-img-${imageIndex}`}
                  custom={imageDirection}
                  variants={imageSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`relative flex items-center justify-center max-h-[65vh] lg:max-h-[80vh] w-full modal-zoom-container ${zoomed ? "zoomed" : ""}`}
                  onClick={() => setZoomed(!zoomed)}
                >
                  <img
                    src={currentImages[imageIndex]}
                    alt={`${current.title} by ${current.artist}`}
                    className={`max-w-full max-h-full object-contain transition-transform duration-500 rounded-sm ${
                      zoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                    } ${current.status === "collected" ? "opacity-85" : ""}`}
                    style={{ boxShadow: "0 32px 64px -16px rgba(0,0,0,0.6)" }}
                  />

                  {/* Collected Overlay */}
                  {current.status === "collected" && !zoomed && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className="text-white font-medium tracking-[0.35em] uppercase text-xs border border-white/30 px-6 py-2.5 bg-black/60 backdrop-blur-sm rounded-sm">
                        Collected
                      </span>
                    </div>
                  )}

                  {/* Zoom hint */}
                  {!zoomed && (
                    <div className="absolute bottom-3 right-3 pointer-events-none opacity-0 group-hover:opacity-100">
                      <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Image dots / thumbnails */}
              {totalImages > 1 && (
                <>
                  <div className="flex items-center justify-center gap-2 mt-5">
                    {currentImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageDirection(idx > imageIndex ? 1 : -1);
                          setZoomed(false);
                          setImageIndex(idx);
                        }}
                        className={`relative transition-all duration-300 rounded-sm overflow-hidden border-2 ${
                          idx === imageIndex
                            ? "border-maroon opacity-100 scale-110 shadow-lg"
                            : "border-transparent opacity-40 hover:opacity-70 hover:scale-105"
                        }`}
                        aria-label={`View image ${idx + 1}`}
                        style={{ width: 44, height: 44 }}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Image arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrevImage(); }}
                    disabled={imageIndex === 0}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-all duration-300 ${
                      imageIndex === 0 ? "opacity-0 pointer-events-none" : ""
                    }`}
                    aria-label="Previous image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNextImage(); }}
                    disabled={imageIndex === totalImages - 1}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-all duration-300 ${
                      imageIndex === totalImages - 1 ? "opacity-0 pointer-events-none" : ""
                    }`}
                    aria-label="Next image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* ── Details Panel ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + "-details"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="lg:w-[320px] shrink-0 space-y-5 pb-8 lg:pb-0"
              >
                {/* Status badge */}
                <div className="flex items-center gap-2">
                  {current.status === "collected" ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">Collected</span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-maroon"
                      />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-maroon font-medium">Available</span>
                    </>
                  )}
                </div>

                {/* Title & Artist */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                    {current.title}
                  </h2>
                  <p className="text-sm text-white/45 mt-2 font-medium tracking-wider">
                    {current.artist}
                  </p>
                </div>

                {/* Separator */}
                <div className="w-10 h-[1px] bg-maroon/60" />

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-medium block mb-1">Medium</span>
                    <p className="text-xs text-white/65 leading-relaxed">{current.medium}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-medium block mb-1">Year</span>
                    <p className="text-xs text-white/65">{current.year}</p>
                  </div>
                  {current.size && (
                    <div className="col-span-2">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-medium block mb-1">Size</span>
                      <p className="text-xs text-white/65">{current.size}</p>
                    </div>
                  )}
                  {totalImages > 1 && (
                    <div className="col-span-2">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-medium block mb-1">Photos</span>
                      <p className="text-xs text-white/65">{imageIndex + 1} of {totalImages}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {current.description && (
                  <p className="text-sm leading-relaxed text-white/40 italic border-l border-white/10 pl-4">
                    &ldquo;{current.description}&rdquo;
                  </p>
                )}

                {/* WhatsApp CTA */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-pulse inline-flex items-center justify-center gap-2.5 w-full px-6 py-4 bg-maroon hover:bg-maroon-dark text-white text-xs font-semibold tracking-[0.18em] uppercase rounded-sm transition-colors duration-300 group"
                  id="modal-whatsapp-cta"
                >
                  <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {current.status === "collected"
                    ? "Enquire Similar Works"
                    : "Enquire via WhatsApp"}
                </a>

                {/* Collection note */}
                <p className="text-[10px] text-white/20 text-center tracking-[0.1em]">
                  Every piece is an original, one-of-one work
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Artwork Navigation Arrows (between artworks) */}
          {artworks.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/40 hover:text-white hover:bg-white/12 hover:border-white/20 transition-all duration-300 ${
                  currentIndex === 0 ? "opacity-0 pointer-events-none" : ""
                }`}
                aria-label="Previous artwork"
                id="modal-prev"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goNext}
                disabled={currentIndex === artworks.length - 1}
                className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/40 hover:text-white hover:bg-white/12 hover:border-white/20 transition-all duration-300 ${
                  currentIndex === artworks.length - 1 ? "opacity-0 pointer-events-none" : ""
                }`}
                aria-label="Next artwork"
                id="modal-next"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
