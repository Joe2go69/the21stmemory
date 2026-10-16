/**
 * Link-preview images for series pages: images/og/series-{id}.jpg (1200×630 JPEG).
 * Built from the same card art the homepage / Codex series cards use
 * (images/{id}-codex-card-960.webp). JPEG so every share target (Facebook,
 * WhatsApp, iMessage, LinkedIn, Telegram, X) renders it.
 *
 * Skips images that already exist; pass --force to rebuild.
 * Run: node scripts/generate-series-og.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'images', 'og');
const force = process.argv.includes('--force');

async function main() {
  const { sources } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { id } of sources) {
    const out = path.join(OUT_DIR, `series-${id}.jpg`);
    if (fs.existsSync(out) && !force) continue;
    const candidates = [`images/${id}-codex-card-960.webp`, `images/${id}-codex-card.webp`, `images/${id}.webp`];
    const src = candidates.map((c) => path.join(ROOT, c)).find((c) => fs.existsSync(c));
    if (!src) {
      console.warn(`No card art for ${id}; series page will fall back to the default image`);
      continue;
    }
    await sharp(fs.readFileSync(src))
      .resize(1200, 630, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
      .jpeg({ quality: 84, mozjpeg: true, progressive: true })
      .toFile(out);
    console.log(`OG image → ${path.relative(ROOT, out)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
