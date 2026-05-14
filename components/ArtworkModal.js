"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { getPrimaryImage } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TAB_KEYS = ["about", "details", "shipping"];

export default function ArtworkModal({ artwork, artworks = [], isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex]     = useState(0);
  const [direction, setDirection]       = useState(0);
  const [activeTab, setActiveTab]       = useState("about");
  const touchStartX = useRef(0);
  const touchEndX   = useRef(0);
  const { t } = useLanguage();

  const current       = artworks[currentIndex] || artwork;
  const currentImages = current?.images || [getPrimaryImage(current)];
  const totalImages   = currentImages.length;

  useEffect(() => {
    if (artwork && artworks.length > 0) {
      const idx = artworks.findIndex(a => a.id === artwork.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
    setImageIndex(0);
    setActiveTab("about");
  }, [artwork, artworks]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const goNext = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      setDirection(1); setImageIndex(0); setActiveTab("about");
      setCurrentIndex(p => p + 1);
    }
  }, [currentIndex, artworks.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1); setImageIndex(0); setActiveTab("about");
      setCurrentIndex(p => p - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const h = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowUp"   && imageIndex > 0)              setImageIndex(p => p - 1);
      if (e.key === "ArrowDown" && imageIndex < totalImages - 1) setImageIndex(p => p + 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose, goNext, goPrev, imageIndex, totalImages]);

  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove  = e => { touchEndX.current   = e.touches[0].clientX; };
  const handleTouchEnd   = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) { if (diff > 0) goNext(); else goPrev(); }
  };

  if (!current) return null;

  const whatsappLink = getWhatsAppLink(current.title, {
    medium: current.medium, size: current.size, artist: current.artist,
  });

  // ── Detail row helper ─────────────────────────────────────────────────────
  const Row = ({ label, value }) => value ? (
    <div className="flex gap-3 py-2.5 border-b border-white/6 last:border-0">
      <span className="w-32 shrink-0 text-xs font-semibold text-white/50">{label}:</span>
      <span className="text-xs text-white/75 leading-relaxed">{value}</span>
    </div>
  ) : null;

  // ── Tab content ───────────────────────────────────────────────────────────
  const TabContent = () => {
    if (activeTab === "about") return (
      <div className="space-y-4">
        {current.longDescription ? (
          <p className="text-sm text-white/60 leading-[1.8] whitespace-pre-line">{current.longDescription}</p>
        ) : current.description ? (
          <p className="text-sm text-white/60 leading-[1.8] italic">&ldquo;{current.description}&rdquo;</p>
        ) : (
          <p className="text-xs text-white/25 italic">{t("modal.noDescription")}</p>
        )}
        <div className="pt-2 space-y-0">
          <Row label={t("modal.yearCreated")} value={current.year} />
          <Row label={t("modal.medium")} value={current.medium} />
          <Row label={t("modal.category")} value={current.category === "calligraphy" ? t("collection.calligraphy") : t("collection.landscape")} />
        </div>
      </div>
    );

    if (activeTab === "details") return (
      <div className="space-y-0">
        <Row label={t("modal.medium")} value={current.medium} />
        <Row label={t("modal.size")} value={current.size} />
        {(current.sizeW || current.sizeH) && (
          <Row label={t("modal.dimensions")}
            value={[current.sizeW && `W: ${current.sizeW} cm`, current.sizeH && `H: ${current.sizeH} cm`, current.sizeD && `D: ${current.sizeD} cm`].filter(Boolean).join("  ·  ")} />
        )}
        <Row label={t("modal.rarityLabel")} value={t("modal.rarity")} />
        <Row label={t("modal.frame")} value={current.frame} />
        <Row label={t("modal.readyToHang")} value={current.readyToHang} />
        <Row label={t("modal.authenticity")} value={current.authenticity} />
        <Row label={t("modal.packaging")} value={current.packaging} />
        <div className="pt-5 text-[10px] text-white/25 tracking-wide">
          {t("modal.needMore")}{" "}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline text-maroon/60 hover:text-maroon">
            {t("modal.contactWa")}
          </a>
        </div>
      </div>
    );

    if (activeTab === "shipping") return (
      <div className="space-y-0">
        <Row label={t("modal.deliveryCost")} value={t("modal.deliveryCostVal")} />
        <Row label={t("modal.deliveryTime")} value={t("modal.deliveryTimeVal")} />
        <Row label={t("modal.returns")} value={t("modal.returnsVal")} />
        <Row label={t("modal.handling")} value={current.handling || t("modal.handlingVal")} />
        <Row label={t("modal.shipsFrom")} value={current.shipsFrom || "Indonesia"} />
        <Row label={t("modal.authenticity")} value={current.authenticity || "Certificate is Included"} />
        <div className="pt-5 text-[10px] text-white/25 tracking-wide">
          {t("modal.needMore")}{" "}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline text-maroon/60 hover:text-maroon">
            {t("modal.contactWa")}
          </a>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          id="artwork-modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/92 modal-backdrop"
            onClick={onClose}
          />

          {/* Close */}
          <button onClick={onClose}
            className="modal-close-btn absolute top-5 right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white"
            aria-label="Close" id="modal-close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          {artworks.length > 1 && (
            <div className="absolute top-5 left-5 z-30 flex items-center gap-2">
              <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase">{currentIndex + 1}</span>
              <div className="w-5 h-[1px] bg-white/20" />
              <span className="text-[10px] text-white/25 tracking-[0.2em] uppercase">{artworks.length}</span>
            </div>
          )}

          {/* ── LAYOUT ────────────────────────────────────────────────────── */}
          <div className="relative z-10 w-full h-full flex items-center justify-center px-2 sm:px-8 lg:px-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={{ enter: d => ({ x: d > 0 ? 60 : -60, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: d => ({ x: d > 0 ? -60 : 60, opacity: 0 }) }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 lg:gap-6"
                style={{ maxHeight: "90dvh" }}
              >
                {/* Thumbnail strip */}
                {totalImages > 1 && (
                  <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto shrink-0 order-2 lg:order-1 lg:max-h-[80dvh] pb-1 lg:pb-0">
                    {currentImages.map((img, idx) => (
                      <button key={idx} onClick={() => setImageIndex(idx)}
                        className={`relative shrink-0 rounded-sm overflow-hidden border-2 transition-all ${idx === imageIndex ? "border-maroon opacity-100" : "border-white/10 opacity-40 hover:opacity-70"}`}
                        style={{ width: 60, height: 60 }}
                        aria-label={`Photo ${idx + 1}`}>
                        <Image src={img} alt={`View ${idx + 1}`} fill sizes="60px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div
                  className="flex-1 relative flex items-center justify-center order-1 lg:order-2 max-h-[45dvh] lg:max-h-[80dvh]"
                  onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div key={`${current.id}-img-${imageIndex}`}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.28 }}
                      className="relative w-full h-full flex items-center justify-center">
                      <img src={currentImages[imageIndex]}
                        alt={`${current.title} by ${current.artist}`}
                        className={`max-w-full max-h-[45dvh] lg:max-h-[80dvh] object-contain rounded-sm ${current.status === "collected" ? "opacity-85" : ""}`}
                        style={{ boxShadow: "0 24px 60px -12px rgba(0,0,0,0.7)" }}
                      />
                      {current.status === "collected" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-white font-medium tracking-[0.35em] uppercase text-xs border border-white/30 px-6 py-2.5 bg-black/60 backdrop-blur-sm rounded-sm">{t("modal.collected")}</span>
                        </div>
                      )}
                      {totalImages > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                          {currentImages.map((_, idx) => (
                            <div key={idx} className={`rounded-full transition-all ${idx === imageIndex ? "w-4 h-1 bg-maroon" : "w-1 h-1 bg-white/30"}`} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {totalImages > 1 && (
                    <>
                      <button onClick={() => setImageIndex(p => Math.max(0, p-1))} disabled={imageIndex === 0}
                        className={`absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 hidden lg:flex items-center justify-center rounded-full bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition-all ${imageIndex === 0 ? "opacity-0 pointer-events-none" : ""}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                      </button>
                      <button onClick={() => setImageIndex(p => Math.min(totalImages-1, p+1))} disabled={imageIndex === totalImages-1}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 hidden lg:flex items-center justify-center rounded-full bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition-all ${imageIndex === totalImages-1 ? "opacity-0 pointer-events-none" : ""}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </button>
                    </>
                  )}
                </div>

                {/* ── Details Panel (right) ──────────────────────────────── */}
                <div className="order-3 lg:w-[300px] shrink-0 flex flex-col max-h-[40dvh] lg:max-h-[80dvh]">
                  {/* Status + Title (fixed top) */}
                  <div className="shrink-0 space-y-3 pb-3 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      {current.status === "collected" ? (
                        <><div className="w-1.5 h-1.5 rounded-full bg-white/25" /><span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">{t("modal.collected")}</span></>
                      ) : (
                        <><motion.div animate={{ scale:[1,1.4,1], opacity:[0.6,1,0.6] }} transition={{ duration:2, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-maroon" />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-maroon font-medium">{t("collection.statusAvailable")}</span></>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight tracking-tight">{current.title}</h2>
                      <p className="text-sm text-white/45 mt-1 font-medium">{current.artist}</p>
                    </div>
                    <div className="text-xs text-white/50">{current.medium}{current.size && ` · ${current.size}`}</div>
                  </div>

                  {/* Tabs */}
                  <div className="shrink-0 flex items-center gap-0 border-b border-white/8 mt-3">
                    {TAB_KEYS.map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors border-b-2 -mb-[1px] ${activeTab === tab ? "text-white border-maroon" : "text-white/30 border-transparent hover:text-white/60"}`}>
                        {tab === "about" ? t("modal.about") : tab === "details" ? t("modal.details") : t("modal.shipping")}
                      </button>
                    ))}
                  </div>

                  {/* Tab content (scrollable) */}
                  <div className="flex-1 overflow-y-auto mt-4 pr-1 scrollbar-thin space-y-2">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeTab}
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                        transition={{ duration:0.2 }}>
                        <TabContent />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* WhatsApp CTA (fixed bottom) */}
                  <div className="shrink-0 pt-4 space-y-2">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                      className="whatsapp-pulse inline-flex items-center justify-center gap-2.5 w-full px-5 py-3.5 bg-maroon hover:bg-maroon-dark text-white text-[10px] font-semibold tracking-[0.18em] uppercase rounded-sm transition-colors group"
                      id="modal-whatsapp-cta">
                      <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {current.status === "collected" ? t("modal.enquireSimilar") : t("modal.enquireWa")}
                    </a>
                    <p className="text-[10px] text-white/20 text-center tracking-[0.1em]">{t("modal.oneOfOne")}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Artwork prev/next */}
          {artworks.length > 1 && (
            <>
              <button onClick={goPrev} disabled={currentIndex === 0}
                className={`absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/40 hover:text-white hover:bg-white/12 transition-all ${currentIndex === 0 ? "opacity-0 pointer-events-none" : ""}`}
                aria-label="Previous artwork" id="modal-prev">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={goNext} disabled={currentIndex === artworks.length - 1}
                className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/40 hover:text-white hover:bg-white/12 transition-all ${currentIndex === artworks.length-1 ? "opacity-0 pointer-events-none" : ""}`}
                aria-label="Next artwork" id="modal-next">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/></svg>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
