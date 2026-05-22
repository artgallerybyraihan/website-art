"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getPrimaryImage } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { trackEvent } from "@/lib/analytics";

export default function ArtworkCard({ artwork, index = 0, onClick }) {
  const { t, lang } = useLanguage();
  const primaryImage = getPrimaryImage(artwork);
  const imageCount = artwork.images?.length || 1;
  const title = artwork[`title_${lang}`] || artwork.title;

  const handleClick = () => {
    trackEvent("artwork_click", { artworkId: artwork.id, title });
    onClick?.(artwork);
  };


  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: (index % 4) * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group cursor-pointer card-hover-glow"
      onClick={handleClick}
      id={`artwork-card-${artwork.id}`}
    >
      {/* Image Container */}
      <div className="artwork-image-container relative bg-cream rounded-sm overflow-hidden">
        <img
          src={primaryImage}
          alt={`${title} by ${artwork.artist}, ${artwork.medium}`}
          className="w-full h-auto"
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Collected dim */}
        {artwork.status === "collected" && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-white font-medium tracking-[0.3em] uppercase text-[10px] border border-white/30 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-sm">
              {t("card.collected")}
            </span>
          </div>
        )}

        {/* View label */}
        {artwork.status !== "collected" && (
          <div className="absolute inset-0 flex items-end justify-start p-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-400">
            <span className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Artwork
            </span>
          </div>
        )}

        {/* Multiple images badge */}
        {imageCount > 1 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/45 backdrop-blur-sm text-white/90 text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {imageCount}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-3.5 space-y-0.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-wide text-foreground group-hover:text-maroon transition-colors duration-300 leading-snug">
            {title}
          </h3>
          {/* Available dot */}
          {artwork.status !== "collected" && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-maroon shrink-0 mt-1.5"
            />
          )}
        </div>
        <p className="text-xs text-warm-gray">{artwork.artist}</p>
        <p className="text-[11px] text-warm-gray/60">{artwork.medium}</p>
        {artwork.size && (
          <p className="text-[10px] text-warm-gray/40 font-medium">{artwork.size}</p>
        )}
      </div>
    </motion.article>
  );
}
