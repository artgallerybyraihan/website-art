import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata = {
  title: "The Artists — Artgallery by Raihan",
  description:
    "Meet Raihan (contemporary calligraphy) and Condro P.S. (landscape painting) — a father-and-son art house creating original handmade art from Indonesia.",
};

export default function ArtistPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
              The Artists
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Behind Every Stroke,
              <br />
              <span className="text-charcoal/60">a Story</span>
            </h1>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
          </AnimatedSection>
        </div>
      </section>

      {/* Family Story */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection delay={0.2}>
            <p className="text-base sm:text-lg text-warm-gray leading-relaxed text-center">
              Artgallery by Raihan is a family art house born from a shared
              devotion to art. Rooted in Indonesia, our studio bridges
              generations — a father&apos;s atmospheric landscapes meet a
              son&apos;s contemporary calligraphic abstractions. Together, we
              create original works that speak to the soul, crafted not for the
              market, but for the collector who seeks meaning in beauty.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────── RAIHAN ──────── */}
      <section
        className="py-20 lg:py-28 px-6 bg-gradient-to-b from-background to-cream"
        id="artist-raihan"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <AnimatedSection direction="left">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden artwork-image-container">
                <Image
                  src="/artworks/calligraphy-1.png"
                  alt="Contemporary calligraphy artwork by Raihan — ink and gold leaf on textured paper"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            {/* Bio */}
            <AnimatedSection direction="right" delay={0.15}>
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
                    Artist
                  </span>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    Raihan
                  </h2>
                  <p className="text-sm text-warm-gray font-medium mt-1 tracking-wider uppercase">
                    Contemporary Calligraphy
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-gold" />

                <div className="space-y-4 text-sm text-warm-gray leading-relaxed">
                  <p>
                    Raihan&apos;s work exists at the intersection of tradition
                    and abstraction. Drawing from the rich lineage of
                    calligraphic art, he transforms letterforms into layered
                    compositions of movement and meaning — each stroke a
                    meditation, each layer a conversation between ink and
                    surface.
                  </p>
                  <p>
                    His materials are deliberate: sumi ink, gold leaf, walnut
                    ink, and earth pigments applied on textured paper, washi,
                    and canvas. The result is work that feels both ancient and
                    unmistakably contemporary — art that rewards slow looking.
                  </p>
                  <p>
                    Each piece is a one-of-one creation, impossible to
                    replicate. Raihan believes that the imperfections born from
                    the hand are what give art its soul.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-gold/60" />
                  <span className="text-[11px] tracking-[0.12em] uppercase text-warm-gray/50 font-medium">
                    Ink · Gold Leaf · Earth Pigments
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────── CONDRO P.S. ──────── */}
      <section
        className="py-20 lg:py-28 px-6 bg-gradient-to-b from-cream to-background"
        id="artist-condro"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Bio (left on desktop) */}
            <AnimatedSection direction="left" delay={0.15} className="order-2 lg:order-1">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
                    Artist
                  </span>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    Condro P.S.
                  </h2>
                  <p className="text-sm text-warm-gray font-medium mt-1 tracking-wider uppercase">
                    Landscape Painting
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-gold" />

                <div className="space-y-4 text-sm text-warm-gray leading-relaxed">
                  <p>
                    Condro P.S. paints the Indonesian landscape not as it
                    appears, but as it <em>feels</em>. His oil paintings capture
                    the atmosphere of a place — the weight of mist over volcanic
                    valleys, the amber glow of terraces at dusk, the raw energy
                    of a storm approaching a black-sand shore.
                  </p>
                  <p>
                    With decades of practice, his brushwork balances precision
                    and spontaneity. Each canvas is a window into a moment —
                    fleeting, atmospheric, alive. He works exclusively in oil on
                    canvas and linen, building depth through layered glazes and
                    textured impasto.
                  </p>
                  <p>
                    His paintings are for those who understand that a landscape
                    is never just a view — it is an experience, a memory, a
                    feeling made visible.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-gold/60" />
                  <span className="text-[11px] tracking-[0.12em] uppercase text-warm-gray/50 font-medium">
                    Oil on Canvas · Oil on Linen
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* Image */}
            <AnimatedSection direction="right" className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden artwork-image-container">
                <Image
                  src="/artworks/calligraphy-2.png"
                  alt="Atmospheric landscape painting by Condro P.S. — oil on canvas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 px-6" id="artist-cta">
        <AnimatedSection className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Discover Their Work
          </h2>
          <p className="mt-3 text-sm text-warm-gray max-w-md mx-auto">
            Explore the full collection of original artworks by Raihan and
            Condro P.S.
          </p>
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background text-xs font-medium tracking-[0.2em] uppercase hover:bg-charcoal transition-colors duration-300 rounded-sm"
              id="artist-explore-cta"
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
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
