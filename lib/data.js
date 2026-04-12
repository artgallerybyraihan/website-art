import fs from "fs";
import path from "path";

// ─── Helper: Parse info.txt into a JS object ───────────────────────────────
function parseInfoTxt(txt) {
  const lines = txt.split(/\r?\n/);
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    // A new key starts at "KeyName:"
    const keyMatch = line.match(/^([A-Za-z]+):\s*(.*)/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      data[currentKey] = keyMatch[2].trim();
    } else if (currentKey === "LongDescription") {
      // Accumulate multi-line long description
      data[currentKey] = ((data[currentKey] || "") + "\n" + line).trimStart();
    }
  }

  return data;
}

// ─── Core: Read artworks from public/artworks/* folders ────────────────────
export function getArtworksData() {
  const artworksDir = path.join(process.cwd(), "public", "artworks");

  if (!fs.existsSync(artworksDir)) return [];

  const folders = fs
    .readdirSync(artworksDir, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        d.name !== "calligraphy" &&
        d.name !== "landscape"
    );

  const result = [];

  for (const folder of folders) {
    // 1. FITUR DRAFT: Jika nama folder diawali '_' atau mengandung kata 'draft', di-skip (tidak akan tampil)
    const isDraft = folder.name.startsWith("_") || folder.name.toLowerCase().includes("draft");
    if (isDraft) continue;

    const folderPath = path.join(artworksDir, folder.name);
    const infoPath = path.join(folderPath, "info.txt");

    // Collect images — main.jpg/main.png first, rest alphabetically
    let imageFiles = [];
    try {
      imageFiles = fs
        .readdirSync(folderPath)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
        .sort((a, b) => {
          const aLow = a.toLowerCase();
          const bLow = b.toLowerCase();
          if (aLow.startsWith("main")) return -1;
          if (bLow.startsWith("main")) return 1;
          return aLow.localeCompare(bLow);
        });
    } catch(e) {}

    // Parse info.txt if exists
    let info = {};
    if (fs.existsSync(infoPath)) {
      const raw = fs.readFileSync(infoPath, "utf8");
      info = parseInfoTxt(raw);
    } else if (imageFiles.length === 0) {
      // Skip if folder has no images AND no info.txt
      continue;
    }

    // 2. FITUR SOLD: Deteksi kata 'sold' dari nama folder
    const isSoldFromName = folder.name.toLowerCase().includes("sold") || folder.name.toLowerCase().includes("collected");

    // Membersihkan nama folder untuk dijadikan fallback judul (Title) jika info.txt tidak ada
    const cleanTitle = folder.name
      .replace(/\[sold\]|\(sold\)|-?\s*sold/gi, "")
      .replace(/\[collected\]|\(collected\)|-?\s*collected/gi, "")
      .replace(/[-_]/g, " ")
      .trim();
    
    // Capitalize first letters for fallback title
    const formattedTitle = cleanTitle.replace(/\b\w/g, l => l.toUpperCase());

    const images = imageFiles.map((f) => `/artworks/${folder.name}/${f}`);

    // Menentukan Status
    let status = (info.Status || "available").toLowerCase();
    if (isSoldFromName) {
      status = "collected"; // akan me-override menjadi collected/sold
    } else if (status === "sold") {
      status = "collected"; // normalisasi
    }

    // Fallback Kategori
    let category = (info.Category || "").toLowerCase();
    if (!category) {
      if (folder.name.toLowerCase().includes("lan")) category = "landscape";
      else category = "calligraphy"; // default fallback
    }

    result.push({
      id: folder.name,
      title: info.Title || formattedTitle || "Untitled",
      artist: info.Artist || "Art Gallery by Raihan",
      category: category,
      medium: info.Medium || "Mixed Media",
      size: info.Size || "",
      year: parseInt(info.Year) || new Date().getFullYear(),
      status: status,
      description: info.Description || "",
      longDescription: info.LongDescription || info.Description || "",
      images,
    });
  }

  // Newest first by default
  return result.sort((a, b) => b.year - a.year);
}

// ─── Derived helpers ────────────────────────────────────────────────────────
export function getFeaturedArtworks() {
  const all = getArtworksData();
  // Return up to 4 artworks featuring both categories
  const calligraphy = all.filter((a) => a.category === "calligraphy");
  const landscape = all.filter((a) => a.category === "landscape");
  return [
    calligraphy[0],
    landscape[0],
    calligraphy[1],
    landscape[1],
  ].filter(Boolean);
}

export function getArtworkById(id) {
  return getArtworksData().find((a) => a.id === id);
}

export function getArtworksByCategory(category) {
  return getArtworksData().filter((a) => a.category === category);
}

export function getPrimaryImage(artwork) {
  if (!artwork) return "/placeholder.jpg";
  if (artwork.images && artwork.images.length > 0) return artwork.images[0];
  return artwork.image || "/placeholder.jpg";
}

export function getRelatedArtworks(artworkId, limit = 3) {
  const all = getArtworksData();
  const current = all.find((a) => a.id === artworkId);
  if (!current) return [];
  return all
    .filter((a) => a.category === current.category && a.id !== artworkId)
    .slice(0, limit);
}

// ─── WhatsApp ───────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "6289529592251";

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
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
}

export function getWhatsAppLinkGeneral() {
  const msg =
    "Halo, saya ingin mengetahui lebih lanjut tentang koleksi karya seni di Art Gallery by Raihan. Terima kasih 🙏";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
