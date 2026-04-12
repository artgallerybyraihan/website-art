"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import CustomDropdown from "@/components/CustomDropdown";

const categories = [
  { key: "all", label: "All Works" },
  { key: "calligraphy", label: "Calligraphy" },
  { key: "landscape", label: "Landscape" },
];

export default function ProductsClient({ artworks }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = artworks;

    if (activeCategory !== "all") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) =>
        statusFilter === "collected"
          ? a.status === "collected"
          : a.status !== "collected"
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [artworks, activeCategory, statusFilter, sortBy]);

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-maroon">
              Curated Collection
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              The Collection
            </h1>
            <p className="mt-4 text-sm text-warm-gray max-w-md mx-auto leading-relaxed">
              Original works by Raihan and Condro P.S. — each piece a singular
              expression, handmade with intention.
            </p>
            <div className="w-12 h-[1px] bg-maroon mx-auto mt-6" />
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8 relative z-40">
        <div className="max-w-7xl mx-auto border-b border-warm-gray/10 pb-6">
          <AnimatedSection
            delay={0.2}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Category Tabs */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-5 py-2.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm ${
                    activeCategory === cat.key
                      ? "text-foreground"
                      : "text-warm-gray hover:text-foreground"
                  }`}
                  id={`filter-${cat.key}`}
                >
                  {cat.label}
                  {activeCategory === cat.key && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-maroon rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Status & Sort dropdowns */}
            <div className="flex items-center gap-6">
              <CustomDropdown
                options={[
                  { value: "all", label: "All" },
                  { value: "available", label: "Available" },
                  { value: "collected", label: "Collected" },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                labelPrefix="Status: "
              />
              <CustomDropdown
                options={[
                  { value: "newest", label: "Release" },
                  { value: "a-z", label: "A-Z" },
                ]}
                value={sortBy}
                onChange={setSortBy}
                labelPrefix="Sort: "
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Artwork Grid */}
      <section className="px-6 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-8 lg:gap-10 space-y-8 lg:space-y-10"
            >
              {filtered.map((artwork, index) => (
                <div key={artwork.id} className="break-inside-avoid mb-8 lg:mb-10">
                  <ArtworkCard
                    artwork={artwork}
                    index={index}
                    onClick={openModal}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-sm text-warm-gray">
                No artworks match your filters.
              </p>
            </div>
          )}
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
