import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "packing"; // "packing" | "customer"

  const subDir = type === "customer" ? "customer" : "packing";
  const dirPath = path.join(process.cwd(), "public", "packaging", subDir);

  try {
    const files = await readdir(dirPath);
    const photos = files
      .filter((f) => VALID_EXT.has(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => `/packaging/${subDir}/${f}`);

    return NextResponse.json({ photos });
  } catch {
    // Directory doesn't exist yet — return empty
    return NextResponse.json({ photos: [] });
  }
}
