"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getWhatsAppLinkGeneral } from "@/lib/whatsapp";

// Packaging steps icons as SVG
const StepIcon = ({ step }) => {
  const icons = {
    1: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    2: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    3: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    4: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  };
  return icons[step] || null;
};

// Trust badge icons
const TrustIcon = ({ type }) => {
  const icons = {
    delivery: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    certificate: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    return: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    artist: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };
  return icons[type] || null;
};

function PackagingPhotoGallery() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Try to load photos from /public/packaging/ directory via API
    fetch("/api/packaging-photos")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setLoaded(true);
      })
      .catch(() => {
        setPhotos([]);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-[#F5F0EB] animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 bg-[#F5F0EB] rounded-sm text-center">
        <svg className="w-12 h-12 text-[#C4B5A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-[#9C9588] font-medium">{t("packaging.noPhotos")}</p>
        <a
          href="https://wa.me/6289529592251"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-maroon font-semibold tracking-wide hover:underline"
        >
          {t("packaging.uploadCta")}
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {photos.map((src, i) => (
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          className="relative aspect-square overflow-hidden rounded-sm bg-[#F5F0EB] group cursor-pointer"
        >
          <Image
            src={src}
            alt={`Packaging photo ${i + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function PackagingPage() {
  const { t } = useLanguage();

  const steps = [
    { num: 1, title: t("packaging.step1Title"), desc: t("packaging.step1Desc") },
    { num: 2, title: t("packaging.step2Title"), desc: t("packaging.step2Desc") },
    { num: 3, title: t("packaging.step3Title"), desc: t("packaging.step3Desc") },
    { num: 4, title: t("packaging.step4Title"), desc: t("packaging.step4Desc") },
  ];

  const trustItems = [
    { type: "delivery", title: t("packaging.trust1Title"), desc: t("packaging.trust1Desc") },
    { type: "certificate", title: t("packaging.trust2Title"), desc: t("packaging.trust2Desc") },
    { type: "return", title: t("packaging.trust3Title"), desc: t("packaging.trust3Desc") },
    { type: "artist", title: t("packaging.trust4Title"), desc: t("packaging.trust4Desc") },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* ── Hero ── */}
      <section className="relative bg-[#F5F0EB] overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 px-6">
        {/* Background dot texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #9C9588 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        {/* Maroon glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-maroon/10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon mb-4"
          >
            {t("packaging.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t("packaging.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-base text-[#9C9588] leading-relaxed max-w-2xl mx-auto"
          >
            {t("packaging.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* ── How We Pack Steps ── */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon mb-3">
              Process
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
              {t("packaging.packagingTitle")}
            </h2>
            <p className="text-[#9C9588] text-sm max-w-xl mx-auto leading-relaxed">
              {t("packaging.packagingSubtitle")}
            </p>
          </motion.div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative group"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+12px)] w-6 h-px bg-[#E8E0D6] z-10" />
                )}
                <div className="bg-[#FAFAF8] border border-[#E8E0D6] rounded-sm p-6 h-full hover:border-maroon/30 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-maroon/8 flex items-center justify-center text-maroon group-hover:bg-maroon group-hover:text-white transition-all duration-300">
                      <StepIcon step={step.num} />
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4B5A5]">
                      Step {step.num.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#9C9588] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packaging Photo Gallery ── */}
      <section className="py-20 px-6 lg:px-12 bg-[#F5F0EB]/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon mb-3">
              Documentation
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
                  {t("packaging.packagingTitle")}
                </h2>
                <p className="text-[#9C9588] text-sm max-w-xl leading-relaxed">
                  {t("packaging.packagingSubtitle")}
                </p>
              </div>
              <a
                href={getWhatsAppLinkGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-maroon/25 text-maroon text-xs font-semibold tracking-[0.15em] uppercase rounded-full hover:bg-maroon hover:text-white transition-all duration-300 whitespace-nowrap"
                id="packaging-wa-cta"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("packaging.uploadCta")}
              </a>
            </div>
          </motion.div>

          <PackagingPhotoGallery />
        </div>
      </section>

      {/* ── Customer Preview Gallery ── */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon mb-3">
              In Their Homes
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
                  {t("packaging.galleryTitle")}
                </h2>
                <p className="text-[#9C9588] text-sm max-w-xl leading-relaxed">
                  {t("packaging.gallerySubtitle")}
                </p>
              </div>
              <a
                href="https://instagram.com/artgalleryby_raihan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#E8E0D6] text-[#9C9588] text-xs font-semibold tracking-[0.15em] uppercase rounded-full hover:border-maroon/30 hover:text-[#1A1A1A] transition-all duration-300 whitespace-nowrap"
                id="packaging-ig-cta"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @artgalleryby_raihan
              </a>
            </div>
          </motion.div>

          {/* Customer photos placeholder */}
          <CustomerPhotoGallery t={t} />
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="py-20 px-6 lg:px-12 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-maroon/10 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon mb-3">
              Our Commitment
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t("packaging.trustTitle")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/5 border border-white/8 rounded-sm p-6 hover:bg-white/8 hover:border-maroon/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-maroon/15 flex items-center justify-center text-maroon mb-4 group-hover:bg-maroon group-hover:text-white transition-all duration-300">
                  <TrustIcon type={item.type} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center bg-[#FAFAF8]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-maroon mb-4">
            Ready?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
            {t("packaging.ctaTitle")}
          </h2>
          <p className="text-[#9C9588] text-sm mb-8 leading-relaxed">
            {t("packaging.ctaSubtitle")}
          </p>
          <Link
            href="/products"
            id="packaging-explore-cta"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-maroon transition-all duration-300"
          >
            {t("packaging.ctaButton")}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

// Customer photo gallery component — reads from /public/packaging/customer/
function CustomerPhotoGallery({ t }) {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/packaging-photos?type=customer")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setLoaded(true);
      })
      .catch(() => {
        setPhotos([]);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/3] bg-[#F5F0EB] animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 bg-[#F5F0EB] rounded-sm text-center">
        <svg className="w-12 h-12 text-[#C4B5A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-sm text-[#9C9588] font-medium">{t("packaging.noPhotos")}</p>
        <a
          href="https://wa.me/6289529592251"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-maroon font-semibold tracking-wide hover:underline"
        >
          {t("packaging.uploadCta")}
        </a>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 gap-3 space-y-3">
      {photos.map((src, i) => (
        <motion.div
          key={src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="relative overflow-hidden rounded-sm bg-[#F5F0EB] group break-inside-avoid"
        >
          <Image
            src={src}
            alt={`Customer preview ${i + 1}`}
            width={600}
            height={400}
            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
      ))}
    </div>
  );
}
