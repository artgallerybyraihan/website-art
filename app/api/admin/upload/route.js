import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raihan2026";

// Safe translate — never throws, returns "" on failure
async function safeTranslate(text, lang) {
  if (!text || !text.trim()) return "";
  try {
    const { default: translate } = await import("google-translate-api-x");
    const res = await translate(text, { to: lang });
    return res.text || "";
  } catch (err) {
    console.warn(`Translation to ${lang} failed (non-fatal):`, err.message);
    return "";
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Validate password
    const password = formData.get("password");
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Core fields ────────────────────────────────────────────────────────────
    const title       = formData.get("title")?.trim()       || "Untitled";
    const category    = formData.get("category")            || "calligraphy";
    const artist      = formData.get("artist")?.trim()      || "Art Gallery by Raihan";
    const medium      = formData.get("medium")              || "Acrylic on Canvas";
    const year        = formData.get("year")?.trim()        || String(new Date().getFullYear());
    const status      = formData.get("status")              || "available";

    // ── Size / Dimension fields ────────────────────────────────────────────────
    const sizeW       = formData.get("sizeW")?.trim()       || "";
    const sizeH       = formData.get("sizeH")?.trim()       || "";
    const sizeD       = formData.get("sizeD")?.trim()       || "";
    const sizeParts   = [sizeW, sizeH, sizeD].filter(Boolean);
    const size        = sizeParts.length >= 2 ? sizeParts.join(" x ") + " cm" : "";

    // ── Details & Dimensions ───────────────────────────────────────────────────
    const frame           = formData.get("frame")       || "Not Framed";
    const readyToHang     = formData.get("readyToHang") || "No";
    const authenticity    = formData.get("authenticity")|| "Certificate is Included";
    const packaging       = formData.get("packaging")?.trim() || "";
    const handling        = formData.get("handling")?.trim() || "";
    const shipsFrom       = formData.get("shipsFrom")   || "Indonesia";

    // ── Descriptions ──────────────────────────────────────────────────────────
    const description     = formData.get("description")?.trim()     || "";
    const longDescription = formData.get("longDescription")?.trim() || "";

    // ── Generate folder ID ─────────────────────────────────────────────────────
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 30);
    const prefix    = category === "landscape" ? "lan" : "cal";
    const timestamp = Date.now().toString().slice(-4);
    const folderId  = `${prefix}-${slug}-${timestamp}`;

    // ── Create folder ──────────────────────────────────────────────────────────
    const artworksDir = path.join(process.cwd(), "public", "artworks");
    const folderPath  = path.join(artworksDir, folderId);
    await mkdir(folderPath, { recursive: true });

    // ── Save image files ───────────────────────────────────────────────────────
    const files = formData.getAll("files");
    let mainSaved = false;
    let savedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === "string") continue;

      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext    = ".webp";

      let fileName;
      if (file.name.toLowerCase().includes("mock")) {
        fileName = `mock up${ext}`;
      } else if (!mainSaved && i === 0) {
        fileName  = `main${ext}`;
        mainSaved = true;
      } else {
        fileName = `photo-${i + 1}${ext}`;
      }

      // Convert to WebP safely
      try {
        const sharp = (await import("sharp")).default;
        const webpBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
        await writeFile(path.join(folderPath, fileName), webpBuffer);
      } catch (sharpErr) {
        // Fallback: save original buffer if sharp fails
        console.warn("Sharp conversion failed, saving original:", sharpErr.message);
        const fallbackName = fileName.replace(".webp", path.extname(file.name).toLowerCase() || ".jpg");
        await writeFile(path.join(folderPath, fallbackName), buffer);
      }
      savedCount++;
    }

    if (savedCount === 0) {
      // Clean up empty folder
      const { rmdir } = await import("fs/promises");
      try { await rmdir(folderPath); } catch (_) {}
      return NextResponse.json({ error: "Tidak ada foto yang valid untuk disimpan." }, { status: 400 });
    }

    // ── Translate content (non-blocking, failures are OK) ─────────────────────
    const targetLangs = ['id', 'ar', 'tr', 'de', 'es'];
    const translatedLines = [];

    try {
      for (const lang of targetLangs) {
        if (title) {
          const transTitle = await safeTranslate(title, lang);
          if (transTitle) translatedLines.push(`Title_${lang}: ${transTitle}`);
        }
        if (description) {
          const transDesc = await safeTranslate(description, lang);
          if (transDesc) translatedLines.push(`Description_${lang}: ${transDesc}`);
        }
        if (longDescription) {
          const transLong = await safeTranslate(longDescription, lang);
          if (transLong) {
            translatedLines.push(`LongDescription_${lang}:`);
            translatedLines.push(transLong);
          }
        }
      }
    } catch (translateErr) {
      // Translation entirely failed — that's OK, just skip
      console.warn("Translation batch failed (non-fatal):", translateErr.message);
    }

    // ── Write info.txt ─────────────────────────────────────────────────────────
    const infoContent = [
      `Title: ${title}`,
      `Artist: ${artist}`,
      `Category: ${category}`,
      `Medium: ${medium}`,
      `Size: ${size}`,
      `SizeW: ${sizeW}`,
      `SizeH: ${sizeH}`,
      `SizeD: ${sizeD}`,
      `Year: ${year}`,
      `Status: ${status}`,
      `Frame: ${frame}`,
      `ReadyToHang: ${readyToHang}`,
      `Authenticity: ${authenticity}`,
      `Packaging: ${packaging}`,
      `Handling: ${handling}`,
      `ShipsFrom: ${shipsFrom}`,
      `Description: ${description}`,
      `LongDescription:`,
      longDescription,
      ...translatedLines
    ].join("\n");

    await writeFile(path.join(folderPath, "info.txt"), infoContent, "utf8");

    return NextResponse.json({
      success: true,
      id: folderId,
      message: `Karya "${title}" berhasil disimpan (${savedCount} foto).`,
    });
  } catch (err) {
    console.error("Admin upload error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
