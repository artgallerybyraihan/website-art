"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getPrimaryImage } from "@/lib/utils";

export default function ArtworkCard({ artwork, index = 0, onClick }) {
  const primaryImage = getPrimaryImage(artwork);
  const imageCount = artwork.images?.length || 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group cursor-pointer"
      onClick={() => onClick?.(artwork)}
      id={`artwork-card-${artwork.id}`}
    >
      {/* Image */}
      <div className="artwork-image-container relative bg-cream rounded-sm overflow-hidden">
        <img
          src={primaryImage}
          alt={`${artwork.title} ${artwork.medium} by ${artwork.artist}`}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Collected Overlay */}
        {artwork.status === "collected" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 transition-opacity duration-500">
            <span className="text-white font-medium tracking-[0.3em] uppercase text-[10px] border border-white/40 px-4 py-2 bg-black/50">
              Collected
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* View label on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-white text-xs font-medium tracking-[0.2em] uppercase bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            View Artwork
          </span>
        </div>

        {/* Multiple images badge */}
        {imageCount > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white/90 text-[10px] font-medium tracking-wider px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {imageCount}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-semibold tracking-wide text-foreground group-hover:text-maroon transition-colors duration-300">
          {artwork.title}
        </h3>
        <p className="text-xs text-warm-gray font-medium">
          {artwork.artist}
        </p>
        <p className="text-xs text-warm-gray/70">
          {artwork.medium}
        </p>
        <p className="text-[11px] text-warm-gray/50">
          {artwork.size}
        </p>
      </div>

      {/* Status label */}
      <div className="mt-3 flex items-center gap-1.5">
        {artwork.status === "collected" ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-warm-gray/40" />
            <span className="text-[10px] tracking-[0.1em] uppercase text-warm-gray/50 font-medium">
              Collected
            </span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-maroon/60" />
            <span className="text-[10px] tracking-[0.1em] uppercase text-maroon/60 font-medium">
              Available
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
}
