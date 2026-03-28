"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import { artworks } from "@/lib/data";

const categories = [
  { key: "all", label: "All Works" },
  { key: "calligraphy", label: "Calligraphy" },
  { key: "landscape", label: "Landscape" },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return artworks;
    return artworks.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

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
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
              Curated Collection
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              The Collection
            </h1>
            <p className="mt-4 text-sm text-warm-gray max-w-md mx-auto leading-relaxed">
              Original works by Raihan and Condro P.S. — each piece a
              singular expression, handmade with intention.
            </p>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
          </AnimatedSection>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection delay={0.2}>
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
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Artwork Grid */}
      <section className="px-6 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {filtered.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                index={index}
                onClick={openModal}
              />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-warm-gray">
                No artworks found in this category.
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
