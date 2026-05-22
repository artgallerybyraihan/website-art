import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artworksDir = path.join(__dirname, '../public/artworks');

async function processImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processImages(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        try {
          // Read to buffer first to prevent file lock on Windows
          const fileBuffer = await fs.readFile(fullPath);
          const image = sharp(fileBuffer);
          const metadata = await image.metadata();

          let resizedImage = image;
          if (metadata.width > 1080 || metadata.height > 1080) {
            resizedImage = image.resize({
              width: 1080,
              height: 1080,
              fit: 'inside',
              withoutEnlargement: true
            });
          }

          const webpBuffer = await resizedImage
            .webp({ quality: 70 }) // reduced quality for smaller size
            .toBuffer();

          const baseName = path.basename(entry.name, ext);
          const newPath = path.join(dir, `${baseName}.webp`);

          // Write the new webp file
          await fs.writeFile(newPath, webpBuffer);
          console.log(`Processed: ${newPath} (was ${ext})`);

          // Delete original if it had a different extension
          if (ext !== '.webp') {
            await fs.unlink(fullPath);
            console.log(`Deleted original: ${fullPath}`);
          }
        } catch (err) {
          console.error(`Error processing ${fullPath}:`, err.message);
        }
      }
    }
  }
}

processImages(artworksDir)
  .then(() => console.log('All images processed successfully.'))
  .catch((err) => console.error('Script failed:', err));
