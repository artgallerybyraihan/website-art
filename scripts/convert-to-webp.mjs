/**
 * convert-to-webp.mjs
 * 
 * Converts all JPG/JPEG/PNG images in the public/ directory to WebP format,
 * then removes the original files. This significantly reduces file sizes
 * for faster loading and lower bandwidth usage.
 * 
 * Usage: node scripts/convert-to-webp.mjs
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

// WebP quality setting (80 is a good balance of quality vs file size for art)
const WEBP_QUALITY = 82;

// Recursively find all image files
function findImages(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findImages(fullPath));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const images = findImages(PUBLIC);
  
  if (images.length === 0) {
    console.log("No JPG/JPEG/PNG images found to convert.");
    return;
  }

  console.log(`\n🖼️  Found ${images.length} images to convert to WebP\n`);

  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let converted = 0;
  let failed = 0;

  for (const imgPath of images) {
    const relativePath = path.relative(PUBLIC, imgPath);
    const ext = path.extname(imgPath);
    const webpPath = imgPath.replace(/\.(jpe?g|png)$/i, ".webp");
    
    // Skip if WebP already exists
    if (fs.existsSync(webpPath)) {
      console.log(`  ⏭️  Skip (webp exists): ${relativePath}`);
      continue;
    }

    try {
      const originalStats = fs.statSync(imgPath);
      totalOriginalSize += originalStats.size;

      await sharp(imgPath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);

      const webpStats = fs.statSync(webpPath);
      totalWebpSize += webpStats.size;

      const reduction = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
      const origMB = (originalStats.size / 1024 / 1024).toFixed(2);
      const webpMB = (webpStats.size / 1024 / 1024).toFixed(2);

      console.log(`  ✅ ${relativePath}`);
      console.log(`     ${origMB}MB → ${webpMB}MB (${reduction}% smaller)`);

      // Delete original file after successful conversion
      fs.unlinkSync(imgPath);
      console.log(`     🗑️  Deleted original ${ext} file`);

      converted++;
    } catch (err) {
      console.error(`  ❌ Failed: ${relativePath} — ${err.message}`);
      failed++;
    }
  }

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("📊 CONVERSION SUMMARY");
  console.log("═".repeat(60));
  console.log(`  Total converted: ${converted} files`);
  if (failed > 0) console.log(`  Failed: ${failed} files`);
  console.log(`  Original total:  ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  WebP total:      ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Space saved:     ${((totalOriginalSize - totalWebpSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Reduction:       ${((1 - totalWebpSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log("═".repeat(60));
  console.log("\n✨ Done! All images are now in WebP format.\n");
}

main().catch(console.error);
