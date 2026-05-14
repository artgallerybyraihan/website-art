import { NextResponse } from "next/server";
import { getAllArtworksIncludingDrafts } from "@/lib/data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raihan2026";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artworks = getAllArtworksIncludingDrafts();

    return NextResponse.json({ artworks });
  } catch (err) {
    console.error("Admin artworks GET error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + err.message },
      { status: 500 }
    );
  }
}
