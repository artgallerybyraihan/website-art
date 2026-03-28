"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ArtworkCard({ artwork, index = 0, onClick }) {
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
      <div className="artwork-image-container relative aspect-[4/5] bg-cream rounded-sm overflow-hidden">
        <Image
          src={artwork.image}
          alt={`${artwork.title} — ${artwork.medium} by ${artwork.artist}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* View label on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-white text-xs font-medium tracking-[0.2em] uppercase bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            View Artwork
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-semibold tracking-wide text-foreground group-hover:text-gold transition-colors duration-300">
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

      {/* Original work label */}
      <div className="mt-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
        <span className="text-[10px] tracking-[0.1em] uppercase text-warm-gray/50 font-medium">
          Original Work
        </span>
      </div>
    </motion.article>
  );
}
