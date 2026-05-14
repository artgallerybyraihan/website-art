"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import { getWhatsAppLinkGeneral } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HomeClient({ featuredArtworks }) {
  const { t } = useLanguage();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <>
      {/* ──────── HERO ──────── */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        id="hero"
      >
        {/* Rich layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] via-[#F5F0EB] to-[#EDE5DC]" />

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Decorative geometric accents */}
        <div className="absolute top-20 left-8 w-[1px] h-40 bg-gradient-to-b from-transparent via-maroon/15 to-transparent hidden lg:block" />
        <div className="absolute top-1/3 right-12 w-[1px] h-28 bg-gradient-to-b from-transparent via-gold/12 to-transparent hidden lg:block" />
        <div className="absolute bottom-40 left-1/4 w-16 h-[1px] bg-gradient-to-r from-transparent via-maroon/10 to-transparent hidden lg:block" />

        {/* Large faint number accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] font-black text-black/[0.02] leading-none select-none pointer-events-none hidden xl:block">
          01
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-6 h-[1px] bg-maroon/40" />
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-maroon/70">
              {t("hero.label")}
            </span>
            <div className="w-6 h-[1px] bg-maroon/40" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]"
          >
            {t("hero.title1")}
            <br />
            <span className="text-charcoal/40 font-light italic">{t("hero.title2")}</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-lg text-warm-gray max-w-xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/products"
              className="btn-primary"
              id="hero-cta"
            >
              {t("hero.cta")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/artist"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground border border-foreground/12 hover:border-foreground/25 rounded-sm transition-all duration-300"
              id="hero-artist-cta"
            >
              {t("hero.ctaArtist")}
            </Link>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-12 sm:mt-16 flex items-center justify-center gap-6 sm:gap-8 lg:gap-12"
          >
            {[
              { num: "100+", label: t("hero.stat1") },
              { num: "25+", label: t("hero.stat2") },
              { num: "2", label: t("hero.stat3") },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-foreground/80 tracking-tight">{stat.num}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-warm-gray/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <span className="text-[9px] tracking-[0.25em] uppercase text-warm-gray">{t("hero.scroll")}</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-warm-gray to-transparent" />
          </div>
        </div>
      </section>

      {/* ──────── FEATURED ARTWORKS ──────── */}
      <section className="py-24 lg:py-36 px-6" id="featured-artworks">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-maroon/30" />
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon/60">{t("featured.label")}</span>
              <div className="w-6 h-[1px] bg-maroon/30" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {t("featured.title")}
            </h2>
            <p className="mt-4 text-sm text-warm-gray/70 max-w-sm mx-auto">
              {t("featured.subtitle")}
            </p>
          </AnimatedSection>

          <div className="columns-2 lg:columns-4 gap-6 lg:gap-8 space-y-6 lg:space-y-0">
            {featuredArtworks.map((artwork, index) => (
              <div key={artwork.id} className="break-inside-avoid mb-8">
                <ArtworkCard artwork={artwork} index={index} onClick={openModal} />
              </div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16" delay={0.3}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-maroon transition-colors duration-300 group"
              id="view-all-collection"
            >
              {t("featured.viewAll")}
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────── BRAND STORY ──────── */}
      <section
        className="py-24 lg:py-36 px-6 bg-gradient-to-b from-cream/60 to-background relative overflow-hidden"
        id="brand-story"
      >
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-maroon/8 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-maroon/30" />
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon/60">{t("story.label")}</span>
              <div className="w-6 h-[1px] bg-maroon/30" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {t("story.title")}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mt-10 text-center">
            <p className="text-base sm:text-lg text-warm-gray leading-relaxed max-w-2xl mx-auto">
              {t("story.text")}
            </p>
          </AnimatedSection>

          {/* Artist photos */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
            <AnimatedSection delay={0.1} direction="left">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden artwork-image-container group">
                <Image
                  src="/artists/raihan.webp"
                  alt="Raihan Mohammad, Abstract Calligraphy Artist"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-base font-bold text-white tracking-wide">Raihan Mohammad</h3>
                  <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase mt-1">{t("story.raihanRole")}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="right">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden artwork-image-container group">
                <Image
                  src="/artists/condro.webp"
                  alt="Condro Puspitosari, Landscape Painter"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-base font-bold text-white tracking-wide">Condro Puspitosari</h3>
                  <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase mt-1">{t("story.condroRole")}</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.3}>
            <Link
              href="/artist"
              className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-maroon transition-colors duration-300 group"
              id="meet-artists-cta"
            >
              {t("story.meetArtists")}
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────── WHATSAPP CTA BANNER ──────── */}
      <section
        className="relative py-24 lg:py-32 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)" }}
        id="cta-banner"
      >
        {/* Decorative maroon glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-96 h-96 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: "radial-gradient(circle, #6B1C2A, transparent)" }}
          />
        </div>

        {/* Top & bottom lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-maroon/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-maroon/20 to-transparent" />

        <AnimatedSection className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-6 h-[1px] bg-maroon/50" />
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon/80">
              {t("cta.label")}
            </span>
            <div className="w-6 h-[1px] bg-maroon/50" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {t("cta.title")}
          </h2>
          <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-md mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="mt-10">
            <a
              href={getWhatsAppLinkGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-pulse inline-flex items-center gap-3 px-8 py-4 bg-maroon hover:bg-maroon-dark text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-sm transition-colors duration-300 group"
              id="home-whatsapp-cta"
            >
              <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("cta.button")}
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
