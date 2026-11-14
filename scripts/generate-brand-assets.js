/**
 * Generates images/apple-touch-icon.png (180x180) from images/21st-mark.webp.
 *
 * The default share card (images/og-default.webp) and the per-topic cards are
 * built from site art by: python3 scripts/generate-share-cards.py
 *
 * Favicon (tab icon) is a separate high-contrast badge:
 *   node scripts/generate-favicon.js
 * (generate-favicon also refreshes apple-touch-icon.png)
 *
 * Mark is expected to be a soft-edged square with alpha that blends
 * into the deep-purple site background.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'images', '21st-mark.webp');
const OUT_APPLE = path.join(ROOT, 'images', 'apple-touch-icon.png');

const DEEP_BG = { r: 15, g: 10, b: 31 };

async function main() {
  if (!fs.existsSync(LOGO)) {
    throw new Error(`Logo not found: ${LOGO}`);
  }

  // Soft-edged mark — keep alpha, mild brightness for small sizes
  const logo168 = await sharp(LOGO)
    .resize(168, 168, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .modulate({ brightness: 1.08, saturation: 1.06 })
    .png()
    .toBuffer();

  // Opaque home-screen icon: deep violet plate + soft mark (already rounded)
  const appleBg = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 3,
      background: { r: 30, g: 16, b: 60 },
    },
  })
    .png()
    .toBuffer();

  await sharp(appleBg)
    .composite([{ input: logo168, top: 6, left: 6 }])
    .png()
    .toFile(OUT_APPLE);

  console.log(`Wrote ${path.relative(ROOT, OUT_APPLE)} (${fs.statSync(OUT_APPLE).size} bytes)`);
  console.log(`Site deep bg reference: #0F0A1F rgb(${DEEP_BG.r},${DEEP_BG.g},${DEEP_BG.b})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
