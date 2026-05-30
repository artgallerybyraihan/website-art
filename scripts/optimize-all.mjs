/**
 * optimize-all.mjs
 * 1. Deletes _lan-senandung-hijau-teratai-3369 folder
 * 2. Re-encodes ALL images under public/artworks as WebP (quality 72)
 *    and resizes so the longest edge ≤ 1800px
 *
 * Strategy: write to a UNIQUE temp file first, then rename over original.
 * This avoids Windows EBUSY errors from Next.js image cache.
 */
import sharp from "sharp";
import { readdir, rm, stat, rename } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTWORKS_DIR = path.join(__dirname, "..", "public", "artworks");

// Kill Next.js processes that might be locking files
try {
  if (process.platform === 'win32') {
    execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq next-dev" 2>nul || true');
  } else {
    execSync("pkill -f 'next' 2>/dev/null || true");
  }
} catch (e) {}

// ── 1. Delete the target folder ──────────────────────────────────────────────
const TARGET = path.join(ARTWORKS_DIR, "_lan-senandung-hijau-teratai-3369");
try {
  await rm(TARGET, { recursive: true, force: true });
  console.log(`🗑️  Deleted: _lan-senandung-hijau-teratai-3369`);
} catch (e) {
  console.warn("Could not delete target folder:", e.message);
}

// ── 2. Walk and optimize all images ──────────────────────────────────────────
const IMAGE_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);
const MAX_EDGE   = 1800;
const QUALITY    = 72;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(full));
    } else if (IMAGE_EXTS.has(path.extname(e.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

const allImages = await walk(ARTWORKS_DIR);
let saved = 0;
let skipped = 0;
let totalBefore = 0;
let totalAfter  = 0;

for (const imgPath of allImages) {
  const outPath = imgPath.replace(/\.[^.]+$/, ".webp");
  // Use a random suffix so the temp file never conflicts with anything
  const tmpPath = outPath + "." + crypto.randomBytes(4).toString("hex") + ".tmp";

  try {
    const before = (await stat(imgPath)).size;
    totalBefore += before;

    const img  = sharp(imgPath);
    const meta = await img.metadata();

    const isLandscape = (meta.width || 0) >= (meta.height || 0);
    const resizeOpts = isLandscape
      ? { width: MAX_EDGE, withoutEnlargement: true }
      : { height: MAX_EDGE, withoutEnlargement: true };

    // 1. Write to temp (different name → no lock conflict)
    await img.resize(resizeOpts).webp({ quality: QUALITY }).toFile(tmpPath);

    // 2. Delete original (skip error if same path and locked)
    if (imgPath !== outPath) {
      try { await rm(imgPath, { force: true }); } catch (_) {}
    }

    // 3. Rename temp → final (overwrites if same path)
    await rename(tmpPath, outPath);

    const after = (await stat(outPath)).size;
    totalAfter += after;
    const pct = (((before - after) / before) * 100).toFixed(1);
    console.log(`  ✓ ${path.relative(ARTWORKS_DIR, outPath).padEnd(62)} ${(before/1024).toFixed(0).padStart(5)}KB → ${(after/1024).toFixed(0).padStart(5)}KB  (-${pct}%)`);
    saved++;
  } catch (e) {
    try { await rm(tmpPath, { force: true }); } catch (_) {}
    console.warn(`  ✗ ${path.relative(ARTWORKS_DIR, imgPath)}: ${e.message}`);
    skipped++;
  }
}

console.log(`\n✅ Done! Optimised ${saved}/${allImages.length} images  (skipped ${skipped})`);
console.log(`   Total before : ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Total after  : ${(totalAfter  / 1024 / 1024).toFixed(2)} MB`);
if (totalBefore > 0) console.log(`   Saved        : ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB  (${(((totalBefore-totalAfter)/totalBefore)*100).toFixed(1)}%)`);
