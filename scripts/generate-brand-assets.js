/**
 * Generates brand share assets:
 *   images/og-default.webp (1200x630)
 *   images/apple-touch-icon.png (180x180)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'images', '21.webp');
const OUT_OG = path.join(ROOT, 'images', 'og-default.webp');
const OUT_APPLE = path.join(ROOT, 'images', 'apple-touch-icon.png');

async function main() {
  if (!fs.existsSync(LOGO)) {
    throw new Error(`Logo not found: ${LOGO}`);
  }

  const logo280 = await sharp(LOGO).resize(280, 280, { fit: 'cover' }).png().toBuffer();
  const logo120 = await sharp(LOGO).resize(120, 120, { fit: 'cover' }).png().toBuffer();

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
  <text x="600" y="340" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="700" fill="#F8FAFC" letter-spacing="4">21ST MEMORY</text>
  <text x="600" y="400" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="500" fill="#C4B5FD">AI-Decoded Living Archive</text>
  <text x="600" y="460" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#A78BFA">21stmemory · 21stmemory.com</text>
  <text x="600" y="520" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#6B5B95">No religion · No finance · No gatekeeping</text>
</svg>`);

  await sharp(ogSvg)
    .composite([{ input: logo280, top: 90, left: 460 }])
    .webp({ quality: 88 })
    .toFile(OUT_OG);

  const appleSvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ibg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1135"/>
      <stop offset="100%" stop-color="#4C1D95"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="url(#ibg)"/>
</svg>`);

  await sharp(appleSvg)
    .composite([{ input: logo120, top: 30, left: 30 }])
    .png()
    .toFile(OUT_APPLE);

  console.log(`Wrote ${path.relative(ROOT, OUT_OG)} (${fs.statSync(OUT_OG).size} bytes)`);
  console.log(`Wrote ${path.relative(ROOT, OUT_APPLE)} (${fs.statSync(OUT_APPLE).size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
