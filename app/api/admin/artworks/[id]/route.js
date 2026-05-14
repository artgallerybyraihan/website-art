import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getArtworkFolderPath, buildInfoTxt } from "@/lib/data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raihan2026";

// ── PUT: Update artwork info ──────────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folderPath = getArtworkFolderPath(id);
    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });
    }

    // Build and write info.txt
    const infoContent = buildInfoTxt(body);
    fs.writeFileSync(path.join(folderPath, "info.txt"), infoContent, "utf8");

    return NextResponse.json({
      success: true,
      message: `Karya "${body.title || id}" berhasil diperbarui.`,
    });
  } catch (err) {
    console.error("Admin artwork PUT error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}

// ── DELETE: Remove artwork folder entirely ────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folderPath = getArtworkFolderPath(id);
    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });
    }

    // Remove folder recursively
    fs.rmSync(folderPath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: `Karya "${id}" berhasil dihapus.`,
    });
  } catch (err) {
    console.error("Admin artwork DELETE error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}

// ── PATCH: Toggle draft (visibility) ─────────────────────────────────────────
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artworksDir = path.join(process.cwd(), "public", "artworks");
    const folderPath = path.join(artworksDir, id);
    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });
    }

    const isDraft = id.startsWith("_");
    let newId;

    if (isDraft) {
      // Remove _ prefix to make visible
      newId = id.slice(1);
    } else {
      // Add _ prefix to hide
      newId = `_${id}`;
    }

    const newFolderPath = path.join(artworksDir, newId);
    fs.renameSync(folderPath, newFolderPath);

    return NextResponse.json({
      success: true,
      newId,
      isDraft: !isDraft,
      message: isDraft
        ? `Karya "${newId}" sekarang ditampilkan di gallery.`
        : `Karya "${id}" disembunyikan dari gallery.`,
    });
  } catch (err) {
    console.error("Admin artwork PATCH error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
