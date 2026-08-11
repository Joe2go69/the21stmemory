/**
 * Generates brand share assets from images/21st-mark.webp:
 *   images/og-default.webp (1200x630)
 *   images/apple-touch-icon.png (180x180)
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
const OUT_OG = path.join(ROOT, 'images', 'og-default.webp');
const OUT_APPLE = path.join(ROOT, 'images', 'apple-touch-icon.png');

const DEEP_BG = { r: 15, g: 10, b: 31 };

async function main() {
  if (!fs.existsSync(LOGO)) {
    throw new Error(`Logo not found: ${LOGO}`);
  }

  // Soft-edged mark — keep alpha, mild brightness for small sizes
  const logo200 = await sharp(LOGO)
    .resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .modulate({ brightness: 1.06, saturation: 1.05 })
    .png()
    .toBuffer();

  const logo168 = await sharp(LOGO)
    .resize(168, 168, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .modulate({ brightness: 1.08, saturation: 1.06 })
    .png()
    .toBuffer();

  const ogSvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0A1F"/>
      <stop offset="55%" stop-color="#1A0F2E"/>
      <stop offset="100%" stop-color="#1E1135"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="48" y="48" width="1104" height="534" rx="28" fill="none" stroke="#7C3AED" stroke-opacity="0.35" stroke-width="2"/>
  <text x="600" y="360" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="700" fill="#F8FAFC" letter-spacing="4">21ST MEMORY</text>
  <text x="600" y="420" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="500" fill="#C4B5FD">AI-Decoded Living Archive</text>
  <text x="600" y="480" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#A78BFA">21stmemory · 21stmemory.com</text>
  <text x="600" y="535" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#6B5B95">No religion · No finance · No gatekeeping</text>
</svg>`);

  // Mark sits above the wordmark with room for the energy trail
  await sharp(ogSvg)
    .composite([{ input: logo200, top: 78, left: 500 }])
    .webp({ quality: 88 })
    .toFile(OUT_OG);

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

  console.log(`Wrote ${path.relative(ROOT, OUT_OG)} (${fs.statSync(OUT_OG).size} bytes)`);
  console.log(`Wrote ${path.relative(ROOT, OUT_APPLE)} (${fs.statSync(OUT_APPLE).size} bytes)`);
  console.log(`Site deep bg reference: #0F0A1F rgb(${DEEP_BG.r},${DEEP_BG.g},${DEEP_BG.b})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
