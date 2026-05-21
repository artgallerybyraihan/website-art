import fs from "fs";
import path from "path";

// ─── Helper: Parse info.txt into a JS object ───────────────────────────────
function parseInfoTxt(txt) {
  const lines = txt.split(/\r?\n/);
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    // A new key starts at "KeyName:"
    const keyMatch = line.match(/^([A-Za-z_]+):\s*(.*)/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      data[currentKey] = keyMatch[2].trim();
    } else if (currentKey && currentKey.startsWith("LongDescription")) {
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

    const artwork = {
      id: folder.name,
      title: info.Title || formattedTitle || "Untitled",
      artist: info.Artist || "Art Gallery by Raihan",
      category: category,
      medium: info.Medium || "Mixed Media",
      size: info.Size || "",
      sizeW: info.SizeW || "",
      sizeH: info.SizeH || "",
      sizeD: info.SizeD || "",
      year: parseInt(info.Year) || new Date().getFullYear(),
      status: status,
      frame: info.Frame || "Not Framed",
      readyToHang: info.ReadyToHang || "No",
      authenticity: info.Authenticity || "Certificate is Included",
      packaging: info.Packaging || "",
      handling: info.Handling || "",
      shipsFrom: info.ShipsFrom || "Indonesia",
      description: info.Description || "",
      longDescription: info.LongDescription || info.Description || "",
      images,
    };

    // Attach localized fields
    const langs = ['id', 'ar', 'tr', 'de', 'es'];
    for (const l of langs) {
      if (info[`Title_${l}`]) artwork[`title_${l}`] = info[`Title_${l}`];
      if (info[`Description_${l}`]) artwork[`description_${l}`] = info[`Description_${l}`];
      if (info[`LongDescription_${l}`]) artwork[`longDescription_${l}`] = info[`LongDescription_${l}`];
    }

    result.push(artwork);
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

// ─── Admin helpers ──────────────────────────────────────────────────────────

/**
 * Returns ALL artworks including drafts (folders with _ prefix).
 * Used by admin panel to manage all artworks.
 */
export function getAllArtworksIncludingDrafts() {
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
    const isDraft = folder.name.startsWith("_") || folder.name.toLowerCase().includes("draft");
    const folderPath = path.join(artworksDir, folder.name);
    const infoPath = path.join(folderPath, "info.txt");

    // Collect images
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

    let info = {};
    if (fs.existsSync(infoPath)) {
      const raw = fs.readFileSync(infoPath, "utf8");
      info = parseInfoTxt(raw);
    } else if (imageFiles.length === 0) {
      continue;
    }

    const isSoldFromName = folder.name.toLowerCase().includes("sold") || folder.name.toLowerCase().includes("collected");
    const cleanTitle = folder.name
      .replace(/^_/, "")
      .replace(/\[sold\]|\(sold\)|-?\s*sold/gi, "")
      .replace(/\[collected\]|\(collected\)|-?\s*collected/gi, "")
      .replace(/[-_]/g, " ")
      .trim();
    const formattedTitle = cleanTitle.replace(/\b\w/g, l => l.toUpperCase());

    const images = imageFiles.map((f) => `/artworks/${folder.name}/${f}`);

    let status = (info.Status || "available").toLowerCase();
    if (isSoldFromName) {
      status = "collected";
    } else if (status === "sold") {
      status = "collected";
    }

    let category = (info.Category || "").toLowerCase();
    if (!category) {
      if (folder.name.toLowerCase().includes("lan")) category = "landscape";
      else category = "calligraphy";
    }

    const artwork = {
      id: folder.name,
      title: info.Title || formattedTitle || "Untitled",
      artist: info.Artist || "Art Gallery by Raihan",
      category: category,
      medium: info.Medium || "Mixed Media",
      size: info.Size || "",
      sizeW: info.SizeW || "",
      sizeH: info.SizeH || "",
      sizeD: info.SizeD || "",
      year: parseInt(info.Year) || new Date().getFullYear(),
      status: status,
      frame: info.Frame || "Not Framed",
      readyToHang: info.ReadyToHang || "No",
      authenticity: info.Authenticity || "Certificate is Included",
      packaging: info.Packaging || "",
      handling: info.Handling || "",
      shipsFrom: info.ShipsFrom || "Indonesia",
      description: info.Description || "",
      longDescription: info.LongDescription || info.Description || "",
      images,
      isDraft,
    };

    const langs = ['id', 'ar', 'tr', 'de', 'es'];
    for (const l of langs) {
      if (info[`Title_${l}`]) artwork[`title_${l}`] = info[`Title_${l}`];
      if (info[`Description_${l}`]) artwork[`description_${l}`] = info[`Description_${l}`];
      if (info[`LongDescription_${l}`]) artwork[`longDescription_${l}`] = info[`LongDescription_${l}`];
    }

    result.push(artwork);
  }

  return result.sort((a, b) => b.year - a.year);
}

export function getArtworkFolderPath(id) {
  return path.join(process.cwd(), "public", "artworks", id);
}

export function buildInfoTxt(data) {
  return [
    `Title: ${data.title || "Untitled"}`,
    `Artist: ${data.artist || "Art Gallery by Raihan"}`,
    `Category: ${data.category || "calligraphy"}`,
    `Medium: ${data.medium || "Mixed Media"}`,
    `Size: ${data.size || ""}`,
    `SizeW: ${data.sizeW || ""}`,
    `SizeH: ${data.sizeH || ""}`,
    `SizeD: ${data.sizeD || ""}`,
    `Year: ${data.year || new Date().getFullYear()}`,
    `Status: ${data.status || "available"}`,
    `Frame: ${data.frame || "Not Framed"}`,
    `ReadyToHang: ${data.readyToHang || "No"}`,
    `Authenticity: ${data.authenticity || "Certificate is Included"}`,
    `Packaging: ${data.packaging || ""}`,
    `Handling: ${data.handling || ""}`,
    `ShipsFrom: ${data.shipsFrom || "Indonesia"}`,
    `Description: ${data.description || ""}`,
    `LongDescription:`,
    data.longDescription || data.description || "",
  ].join("\n");
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
