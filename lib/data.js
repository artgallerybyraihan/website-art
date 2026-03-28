export const artworks = [
  // Calligraphy works by Raihan
  {
    id: "cal-001",
    title: "Whispers of the Unseen",
    artist: "Raihan",
    category: "calligraphy",
    medium: "Ink & Gold Leaf on Textured Paper",
    size: '60 × 80 cm (23.6" × 31.5")',
    image: "/artworks/calligraphy-1.png",
    description:
      "A contemplative dialogue between form and void — layered calligraphic strokes emerge from silence, tracing the boundary between the spoken and the felt.",
    year: 2024,
  },
  {
    id: "cal-002",
    title: "Tides of Devotion",
    artist: "Raihan",
    category: "calligraphy",
    medium: "Indigo Ink & Silver on Canvas",
    size: '70 × 100 cm (27.6" × 39.4")',
    image: "/artworks/calligraphy-2.png",
    description:
      "An oceanic meditation rendered in deep indigo — each stroke a wave of intention rising and falling in rhythmic devotion.",
    year: 2024,
  },
  {
    id: "cal-003",
    title: "Letters from the Earth",
    artist: "Raihan",
    category: "calligraphy",
    medium: "Earth Pigment & Walnut Ink on Paper",
    size: '50 × 70 cm (19.7" × 27.6")',
    image: "/artworks/calligraphy-1.png",
    description:
      "Rooted in the warmth of earth tones — ancient letterforms reimagined through layers of translucent washes and deliberate mark-making.",
    year: 2023,
  },
  {
    id: "cal-004",
    title: "The Still Hours",
    artist: "Raihan",
    category: "calligraphy",
    medium: "Sumi Ink & Gouache on Washi",
    size: '45 × 60 cm (17.7" × 23.6")',
    image: "/artworks/calligraphy-2.png",
    description:
      "Created in the quietest moments before dawn — an intimate work where brushwork meets breath, each stroke a passage of time made visible.",
    year: 2024,
  },

  // Landscape works by Condro P.S.
  {
    id: "lan-001",
    title: "Morning Mist Over the Valley",
    artist: "Condro P.S.",
    category: "landscape",
    medium: "Oil on Canvas",
    size: '80 × 120 cm (31.5" × 47.2")',
    image: "/artworks/calligraphy-1.png",
    description:
      "Golden light breaks through veils of mist, revealing the lush valleys of Java in a moment of quiet revelation. The landscape breathes.",
    year: 2024,
  },
  {
    id: "lan-002",
    title: "Terraces at Dusk",
    artist: "Condro P.S.",
    category: "landscape",
    medium: "Oil on Canvas",
    size: '70 × 100 cm (27.6" × 39.4")',
    image: "/artworks/calligraphy-2.png",
    description:
      "As twilight settles, the ancient rice terraces transform into cascading geometries of shadow and amber. A meditation on land and time.",
    year: 2024,
  },
  {
    id: "lan-003",
    title: "The Volcanic Shore",
    artist: "Condro P.S.",
    category: "landscape",
    medium: "Oil on Linen",
    size: '90 × 130 cm (35.4" × 51.2")',
    image: "/artworks/calligraphy-1.png",
    description:
      "Raw power meets serenity — volcanic black sands meet the untamed ocean under skies heavy with atmosphere and the promise of storm.",
    year: 2023,
  },
  {
    id: "lan-004",
    title: "Emerald Canopy",
    artist: "Condro P.S.",
    category: "landscape",
    medium: "Oil on Canvas",
    size: '60 × 90 cm (23.6" × 35.4")',
    image: "/artworks/calligraphy-2.png",
    description:
      "An immersive journey into the tropical rainforest canopy — where light filters through a thousand shades of green, alive and breathing.",
    year: 2024,
  },
];

export function getArtworkById(id) {
  return artworks.find((artwork) => artwork.id === id);
}

export function getArtworksByCategory(category) {
  return artworks.filter((artwork) => artwork.category === category);
}

export function getFeaturedArtworks() {
  return [artworks[0], artworks[4], artworks[1], artworks[5]];
}

export const WHATSAPP_NUMBER = "6289529592261";

export function getWhatsAppLink(artworkTitle, { medium, size, artist } = {}) {
  const lines = [
    `Halo, saya tertarik dengan karya *"${artworkTitle}"*`,
    artist ? `oleh ${artist}` : "",
    medium ? `Medium: ${medium}` : "",
    size ? `Ukuran: ${size}` : "",
    "",
    "Boleh saya tahu detail harga dan ketersediaannya?",
    "",
    "Terima kasih 🙏",
    "— via artgallerybyraihan.com",
  ]
    .filter(Boolean)
    .join("\n");
  const message = encodeURIComponent(lines);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function getWhatsAppLinkGeneral() {
  const message = encodeURIComponent(
    "Halo, saya ingin mengetahui lebih lanjut tentang koleksi karya seni di Artgallery by Raihan. Terima kasih 🙏"
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
