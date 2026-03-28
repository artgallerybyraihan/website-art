"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import { getFeaturedArtworks, getWhatsAppLinkGeneral } from "@/lib/data";

export default function Home() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const featuredArtworks = getFeaturedArtworks();

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <>
      {/* ──────── HERO ──────── */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6"
        id="hero"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-background to-off-white" />

        {/* Decorative lines */}
        <div className="absolute top-1/4 left-8 w-[1px] h-32 bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />
        <div className="absolute top-1/3 right-12 w-[1px] h-24 bg-gradient-to-b from-transparent via-gold/15 to-transparent hidden lg:block" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold mb-6 block">
              A Family Art House
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            Where Art Meets
            <br />
            <span className="text-charcoal/70">Devotion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-6 text-base sm:text-lg text-warm-gray max-w-xl mx-auto leading-relaxed"
          >
            Presenting original contemporary calligraphy &amp; atmospheric
            landscape paintings — handmade in Indonesia, curated for the
            discerning collector.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-10"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background text-xs font-medium tracking-[0.2em] uppercase hover:bg-charcoal transition-colors duration-300 rounded-sm"
              id="hero-cta"
            >
              Explore the Collection
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-warm-gray/50">
              Scroll
            </span>
            <svg
              className="w-4 h-4 text-warm-gray/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────── FEATURED ARTWORKS ──────── */}
      <section className="py-24 lg:py-32 px-6" id="featured-artworks">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
              Gallery
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Selected Works
            </h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {featuredArtworks.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                index={index}
                onClick={openModal}
              />
            ))}
          </div>

          <AnimatedSection
            className="text-center mt-16"
            delay={0.3}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:text-gold transition-colors duration-300 group"
              id="view-all-collection"
            >
              View Full Collection
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────── BRAND STORY ──────── */}
      <section
        className="py-24 lg:py-32 px-6 bg-gradient-to-b from-background to-cream"
        id="brand-story"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
              Our Story
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              A Family Art House
            </h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mt-12 text-center">
            <p className="text-base sm:text-lg text-warm-gray leading-relaxed max-w-2xl mx-auto">
              Born from a shared love of art, Artgallery by Raihan is a
              father-and-son studio rooted in Indonesia. Each piece — whether
              calligraphic abstraction or atmospheric landscape — is an
              original, handmade work of art created with intention, patience,
              and soul.
            </p>
          </AnimatedSection>

          {/* Artist cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            <AnimatedSection delay={0.1} direction="left">
              <div className="relative h-72 sm:h-80 rounded-sm overflow-hidden artwork-image-container">
                <Image
                  src="/artworks/calligraphy-1.png"
                  alt="Contemporary calligraphy artwork by Raihan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-lg font-semibold text-white">Raihan</h3>
                  <p className="text-xs text-white/60 tracking-wider uppercase mt-1">
                    Contemporary Calligraphy
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="right">
              <div className="relative h-72 sm:h-80 rounded-sm overflow-hidden artwork-image-container">
                <Image
                  src="/artworks/calligraphy-2.png"
                  alt="Landscape painting by Condro P.S."
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-lg font-semibold text-white">
                    Condro P.S.
                  </h3>
                  <p className="text-xs text-white/60 tracking-wider uppercase mt-1">
                    Landscape Painting
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.3}>
            <Link
              href="/artist"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:text-gold transition-colors duration-300 group"
              id="meet-artists-cta"
            >
              Meet the Artists
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────── WHATSAPP CTA BANNER ──────── */}
      <section className="py-24 lg:py-32 px-6 bg-charcoal" id="cta-banner">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold-light">
            Start Your Journey
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Begin Your Collection
          </h2>
          <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            Every artwork is one of a kind — reach out to discuss a piece that
            speaks to you.
          </p>
          <div className="mt-10">
            <a
              href={getWhatsAppLinkGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-pulse inline-flex items-center gap-2.5 px-8 py-4 bg-gold hover:bg-[#A07F56] text-white text-xs font-medium tracking-[0.2em] uppercase rounded-sm transition-colors duration-300"
              id="home-whatsapp-cta"
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
          </div>
        </AnimatedSection>
      </section>

      {/* Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        artworks={featuredArtworks}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
