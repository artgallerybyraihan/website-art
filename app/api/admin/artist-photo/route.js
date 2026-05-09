import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raihan2026";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const password = formData.get("password");
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artistKey = formData.get("artistKey"); // "raihan" or "condro"
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!["raihan", "condro"].includes(artistKey)) {
      return NextResponse.json({ error: "Invalid artist key" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const artistsDir = path.join(process.cwd(), "public", "artists");
    const filePath = path.join(artistsDir, `${artistKey}.webp`);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: `Foto ${artistKey} berhasil diperbarui!`,
      path: `/artists/${artistKey}.webp`,
    });
  } catch (err) {
    console.error("Artist photo upload error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
