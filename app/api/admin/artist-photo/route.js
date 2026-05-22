import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

    // Ensure artists directory exists
    const artistsDir = path.join(process.cwd(), "public", "artists");
    await mkdir(artistsDir, { recursive: true });

    // Convert to webp safely
    let finalBuffer = buffer;
    let fileName = `${artistKey}.webp`;

    try {
      const sharp = (await import("sharp")).default;
      finalBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpErr) {
      // Fallback: save original format if sharp fails
      console.warn("Sharp conversion failed, saving original:", sharpErr.message);
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      fileName = `${artistKey}${ext}`;
    }

    const filePath = path.join(artistsDir, fileName);
    await writeFile(filePath, finalBuffer);

    return NextResponse.json({
      success: true,
      message: `Foto ${artistKey} berhasil diperbarui!`,
      path: `/artists/${fileName}`,
    });
  } catch (err) {
    console.error("Artist photo upload error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
