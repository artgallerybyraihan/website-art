import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brainDir = "C:\\Users\\MSI KATANA 15\\.gemini\\antigravity\\brain\\ea6122d4-394b-4932-92f7-de31607d3dfe";

// Packing process photos (newly uploaded)
const packingSources = [
  "media__1779438289892.jpg",
  "media__1779438289895.jpg",
  "media__1779438289907.jpg",
  "media__1779438289908.jpg",
];

const packingDestDir = path.join(__dirname, '../public/packaging/packing');

async function convertBatch(sources, destDir, prefix, startIndex = 1) {
  await fs.mkdir(destDir, { recursive: true });
  for (let i = 0; i < sources.length; i++) {
    const src = path.join(brainDir, sources[i]);
    const destName = `${prefix}-${String(startIndex + i).padStart(2, '0')}.webp`;
    const dest = path.join(destDir, destName);
    try {
      const buf = await fs.readFile(src);
      await sharp(buf)
        .resize({ width: 1080, height: 1080, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(dest);
      console.log(`✓ ${destName}`);
    } catch (err) {
      console.error(`✗ ${sources[i]}:`, err.message);
    }
  }
}

async function run() {
  console.log('=== Converting more packing photos ===');
  // We already have packing-01 through packing-04, so start at 5
  await convertBatch(packingSources, packingDestDir, 'packing', 5);
  console.log('\nAll done!');
}

run();
