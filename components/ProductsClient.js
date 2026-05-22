"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import CustomDropdown from "@/components/CustomDropdown";
import { useLanguage } from "@/lib/i18n/LanguageContext";



export default function ProductsClient({ artworks }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [
    { key: "all", label: t("collection.allWorks") },
    { key: "calligraphy", label: t("collection.calligraphy") },
    { key: "landscape", label: t("collection.landscape") },
  ];

  const filtered = useMemo(() => {
    let result = artworks;

    if (activeCategory !== "all") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) =>
        statusFilter === "collected" ? a.status === "collected" : a.status !== "collected"
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      return 0;
    });

    // Always put collected artworks at the bottom
    result = [
      ...result.filter(a => a.status !== "collected"),
      ...result.filter(a => a.status === "collected"),
    ];

    return result;
  }, [artworks, activeCategory, statusFilter, sortBy]);

  const availableCount = filtered.filter((a) => a.status !== "collected").length;
  const totalCount = filtered.length;

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <>
      {/* ── Header ── */}
      <section className="pt-28 pb-10 px-6 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/40 to-transparent" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-maroon/30" />
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon/60">
                {t("collection.label")}
              </span>
              <div className="w-6 h-[1px] bg-maroon/30" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {t("collection.title")}
            </h1>
            <p className="mt-5 text-sm text-warm-gray max-w-sm mx-auto leading-relaxed">
              {t("collection.subtitle")}
            </p>

            {/* Live count */}
            <div className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-warm-gray/50">
              <span className="font-semibold text-foreground/50">{availableCount}</span>
              <span>{t("collection.available")}</span>
              <span className="opacity-30">·</span>
              <span className="font-semibold text-foreground/50">{totalCount}</span>
              <span>{t("collection.total")}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="px-4 sm:px-6 pb-10 relative z-40 sticky top-16 md:top-20 bg-background/90 backdrop-blur-xl border-b border-warm-gray/8">
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex flex-col items-center gap-4 sm:gap-5 sm:flex-row sm:justify-between">

            {/* Category tabs */}
            <div className="flex items-center gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`filter-tab relative px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm whitespace-nowrap ${
                    activeCategory === cat.key
                      ? "text-foreground"
                      : "text-warm-gray hover:text-foreground"
                  } ${activeCategory === cat.key ? "active" : ""}`}
                  id={`filter-${cat.key}`}
                >
                  {cat.label}
                  {activeCategory === cat.key && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-maroon rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3">
              <CustomDropdown
                options={[
                  { value: "all", label: t("collection.statusAll") },
                  { value: "available", label: t("collection.statusAvailable") },
                  { value: "collected", label: t("collection.statusCollected") },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                labelPrefix={t("collection.statusPrefix")}
              />
              <CustomDropdown
                options={[
                  { value: "newest", label: t("collection.sortNewest") },
                  { value: "a-z", label: t("collection.sortAZ") },
                ]}
                value={sortBy}
                onChange={setSortBy}
                labelPrefix={t("collection.sortPrefix")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Artwork Grid ── */}
      <section className="px-6 py-12 pb-28 lg:pb-36">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeCategory + statusFilter + sortBy}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="columns-2 sm:columns-2 lg:columns-3 gap-4 sm:gap-8 lg:gap-10"
              >
                {filtered.map((artwork, index) => (
                  <div key={artwork.id} className="break-inside-avoid mb-8 lg:mb-10">
                    <ArtworkCard artwork={artwork} index={index} onClick={openModal} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-28"
              >
                <div className="w-12 h-12 rounded-full bg-warm-gray/8 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-warm-gray/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-warm-gray/50">{t("collection.noResults")}</p>
                <button
                  onClick={() => { setActiveCategory("all"); setStatusFilter("all"); }}
                  className="mt-4 text-xs text-maroon/70 hover:text-maroon tracking-[0.1em] uppercase font-medium underline underline-offset-4 transition-colors"
                >
                  {t("collection.clearFilters")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        artworks={filtered}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
