import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata = {
  title: "The Artists Art Gallery by Raihan",
  description:
    "Meet Raihan Mohammad (abstract calligraphy) and Condro Puspitosari (landscape & nature painting) a mother-and-son art gallery creating original handmade art from Indonesia.",
};

export default function ArtistPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-maroon">
              The Artists
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Behind Every Stroke,
              <br />
              <span className="text-charcoal/60">a Story</span>
            </h1>
            <div className="w-12 h-[1px] bg-maroon mx-auto mt-6" />
          </AnimatedSection>
        </div>
      </section>

      {/* Family Story */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection delay={0.2}>
            <p className="text-base sm:text-lg text-warm-gray leading-relaxed text-center">
              Art Gallery by Raihan is a family art gallery shaped by two
              generations of devotion to art. Here, a mother and her son channel
              their faith, life experiences, and creative voices into original,
              handcrafted, one-of-one works unlike anything else in the world.
              More than a gallery this is a family legacy made visible.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────── RAIHAN MOHAMMAD ──────── */}
      <section
        className="py-20 lg:py-28 px-6 bg-gradient-to-b from-background to-cream"
        id="artist-raihan"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image */}
            <AnimatedSection direction="left">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden artwork-image-container">
                <Image
                  src="/artists/raihan.jpg"
                  alt="Raihan Mohammad Abstract Calligraphy Artist at Art Gallery by Raihan"
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
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-maroon">
                    Artist &amp; Founder
                  </span>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    Raihan Mohammad
                  </h2>
                  <p className="text-sm text-warm-gray font-medium mt-1 tracking-wider uppercase">
                    Abstract Calligraphy
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-maroon" />

                <div className="space-y-4 text-sm text-warm-gray leading-relaxed">
                  <p>
                    Raihan Mohammad is an abstract calligraphy artist and the
                    founder of Art Gallery by Raihan. A graduate of Visual
                    Communication Design (DKV) at Universitas Dian Nuswantoro
                    (Udinus), Semarang, Raihan brings a strong formal foundation
                    in visual arts one that found its truest expression when he
                    began painting abstract calligraphy in 2020.
                  </p>
                  <p>
                    His approach elevates Arabic letterforms beyond their written
                    function, transforming sacred script into living visual
                    elements layered with expressive texture, dramatic
                    contrast, and compositions that feel both powerful and deeply
                    personal.
                  </p>
                  <p>
                    Each work is born at the intersection of faith and creative
                    expression. For Raihan, painting is the most honest dialogue
                    between self, God, and canvas an unhurried process, because
                    every painting exists only once in the world.
                  </p>
                </div>

                {/* Exhibition History */}
                <div className="pt-4">
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-maroon mb-4">
                    Exhibition History
                  </h3>
                  <ul className="space-y-2 text-sm text-warm-gray">
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>Ikhtiart 2 Exhibition, Transmart Cirebon</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>IedulArt Exhibition, Yogya Mall Cirebon</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>Lintas Bebrayan, Brebes</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2025</span>
                      <span>YuhGen Exhibition, Brebes</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2026</span>
                      <span>Yogya Mall Painting Exhibition, Tegal</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-maroon/60" />
                  <span className="text-[11px] tracking-[0.12em] uppercase text-warm-gray/50 font-medium">
                    Abstract Calligraphy · Mixed Media on Canvas
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────── CONDRO PUSPITOSARI ──────── */}
      <section
        className="py-20 lg:py-28 px-6 bg-gradient-to-b from-cream to-background"
        id="artist-condro"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Bio (left on desktop) */}
            <AnimatedSection direction="left" delay={0.15} className="order-2 lg:order-1">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-maroon">
                    Artist
                  </span>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    Condro Puspitosari
                  </h2>
                  <p className="text-sm text-warm-gray font-medium mt-1 tracking-wider uppercase">
                    Landscape &amp; Nature Painting
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-maroon" />

                <div className="space-y-4 text-sm text-warm-gray leading-relaxed">
                  <p>
                    Condro P.S., born in 1973, is a visual artist whose
                    relationship with painting began long before it was a
                    conscious choice. From her elementary school years, her
                    natural gift for art was recognized she was regularly
                    selected by teachers to represent her school in painting
                    competitions, a journey that continued through high school.
                  </p>
                  <p>
                    Her first significant milestone as a painter came in 1992,
                    when she completed <em>Pasar Sekaten</em> an oil painting
                    that was exhibited at the Hotel Garuda, Yogyakarta. A
                    meaningful debut for a young woman who had already given her
                    heart to art.
                  </p>
                  <p>
                    After years devoted to family life as a homemaker and mother,
                    Condro returned to painting with full dedication in 2018 
                    and has remained actively present in the Indonesian art scene
                    ever since. Her specialization in lotus and landscape painting
                    produces works that radiate stillness, grace, and quiet
                    eloquence. The lotus she paints is never merely a flower it
                    is a symbol rendered with deep intention: purity, resilience,
                    and beauty that rises from depth.
                  </p>
                  <p>
                    As the mother of Raihan Mohammad, Condro&apos;s presence in
                    Art Gallery by Raihan is more than artistic she is the root
                    from which this gallery grows.
                  </p>
                </div>

                {/* Exhibition History */}
                <div className="pt-4">
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-maroon mb-4">
                    Exhibition History
                  </h3>
                  <ul className="space-y-2 text-sm text-warm-gray">
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">1992</span>
                      <span>Hotel Garuda Exhibition, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2020</span>
                      <span>PSLN 1, Rest Area Banjaratma KM 260B</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2020</span>
                      <span>National Women&apos;s Fine Art Exhibition, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2021</span>
                      <span>PSLN 2, Rest Area Banjaratma KM 260B</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2021</span>
                      <span>National Exhibition: Lintas Batas Komunitas 2, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2022</span>
                      <span>National Exhibition: Lintas Batas Komunitas 3, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2022</span>
                      <span>Gregah Exhibition, Purwokerto</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2022</span>
                      <span>63rd Anniversary Exhibition, Sanggar Bambu, TBJT Surakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>National Exhibition: Lintas Batas Komunitas 4, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>Gelitik Kecil 3 Exhibition, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>Ikhtiar 2 Exhibition, Transmart Cirebon</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>IedulArt Exhibition, Yogya Mall Tegal</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>National Exhibition: Ragam Pesona Nusantara 2, TBJT Surakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>Sandyakala Art Braga 2, Bandung</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2023</span>
                      <span>Lintas Bebrayan Exhibition, Brebes</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2024</span>
                      <span>National Exhibition: Lintas Batas Komunitas 5, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2024</span>
                      <span>&ldquo;Persembahan&rdquo; Exhibition, Museum Yogya Kembali, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2025</span>
                      <span>National Exhibition: Lintas Batas Komunitas 6, Yogyakarta</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2025</span>
                      <span>Indonesia Saklawase, Assomad International Art Gallery, Klaten</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-maroon font-medium shrink-0">2025</span>
                      <span>YuhGen Exhibition, Brebes</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-maroon/60" />
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
                  src="/artists/condro.jpg"
                  alt="Condro Puspitosari Landscape & Nature Painter at Art Gallery by Raihan"
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
            Explore the full collection of original artworks by Raihan Mohammad
            and Condro Puspitosari.
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
