import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raihan2026";

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
    // Build combined size string: "100 x 150 cm" or with depth
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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === "string") continue;

      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext    = path.extname(file.name).toLowerCase() || ".webp";

      let fileName;
      if (file.name.toLowerCase().includes("mock")) {
        fileName = `mock up${ext}`;
      } else if (!mainSaved && i === 0) {
        fileName  = `main${ext}`;
        mainSaved = true;
      } else {
        fileName = `photo-${i + 1}${ext}`;
      }

      await writeFile(path.join(folderPath, fileName), buffer);
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
    ].join("\n");

    await writeFile(path.join(folderPath, "info.txt"), infoContent, "utf8");

    return NextResponse.json({
      success: true,
      id: folderId,
      message: `Karya berhasil disimpan di folder: ${folderId}`,
    });
  } catch (err) {
    console.error("Admin upload error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
