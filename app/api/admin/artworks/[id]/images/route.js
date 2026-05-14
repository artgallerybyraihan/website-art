import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { getArtworkFolderPath } from "@/lib/data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raihan2026";

// ── POST: Upload / replace images for an artwork ─────────────────────────────
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folderPath = getArtworkFolderPath(id);
    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });
    }

    const replaceAll = formData.get("replaceAll") === "true";

    // If replaceAll, remove all existing image files
    if (replaceAll) {
      const existingFiles = fs.readdirSync(folderPath)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
      for (const file of existingFiles) {
        fs.unlinkSync(path.join(folderPath, file));
      }
    }

    const files = formData.getAll("files");
    let savedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name).toLowerCase() || ".webp";

      let fileName;
      if (file.name.toLowerCase().includes("mock")) {
        fileName = `mock up${ext}`;
      } else if (i === 0 && replaceAll) {
        fileName = `main${ext}`;
      } else {
        fileName = `photo-${Date.now()}-${i + 1}${ext}`;
      }

      await writeFile(path.join(folderPath, fileName), buffer);
      savedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `${savedCount} gambar berhasil ${replaceAll ? "diganti" : "ditambahkan"}.`,
    });
  } catch (err) {
    console.error("Admin image upload error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}

// ── DELETE: Remove a specific image from artwork ─────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");
    const fileName = searchParams.get("file");

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!fileName) {
      return NextResponse.json({ error: "Nama file tidak diberikan." }, { status: 400 });
    }

    const folderPath = getArtworkFolderPath(id);
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: `File "${fileName}" berhasil dihapus.`,
    });
  } catch (err) {
    console.error("Admin image DELETE error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
