/**
 * Generate a high-legibility favicon badge from the site mark.
 * - Opaque rounded tile (reads on light + dark browser chrome)
 * - Tight, brightened "21" so it holds up at 16–32px
 * - Distinct from the soft transparent nav mark
 *
 * Run: node scripts/generate-favicon.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'images');
const MARK = path.join(IMAGES, '21st-mark.webp');
const SOURCE = path.join(IMAGES, '21st-mark-source.webp');
const OUT_FAVICON = path.join(IMAGES, 'favicon.webp');
const OUT_APPLE = path.join(IMAGES, 'apple-touch-icon.png');

async function roundedMask(size, radius) {
  const svg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`
  );
  return sharp(svg).png().toBuffer();
}

async function makeBadge(size, markPct, radius, borderW, { brightness, saturation, linear }) {
  const markSrc = fs.existsSync(MARK) ? MARK : SOURCE;
  const markSize = Math.round(size * markPct);
  const pad = Math.round((size - markSize) / 2);

  let mark = sharp(markSrc).ensureAlpha();
  try {
    mark = mark.trim({ threshold: 18 });
  } catch (_) {
    /* keep full canvas */
  }
  const markBuf = await mark
    .resize(markSize, markSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .modulate({ brightness, saturation })
    .linear(linear[0], linear[1])
    .png()
    .toBuffer();

  const plateSvg = Buffer.from(
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#341B5C"/>
      <stop offset="100%" stop-color="#10081F"/>
    </linearGradient>
    <radialGradient id="glow" cx="48%" cy="36%" r="55%">
      <stop offset="0%" stop-color="#DDD6FE" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#DDD6FE" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#g)"/>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#glow)"/>
  <rect x="${borderW / 2}" y="${borderW / 2}" width="${size - borderW}" height="${size - borderW}"
        rx="${Math.max(0, radius - borderW / 2)}" ry="${Math.max(0, radius - borderW / 2)}"
        fill="none" stroke="#F5F3FF" stroke-opacity="0.92" stroke-width="${borderW}"/>
</svg>`
  );

  const plate = await sharp(plateSvg).png().toBuffer();
  const composed = await sharp(plate)
    .composite([{ input: markBuf, top: pad, left: pad }])
    .png()
    .toBuffer();
  const mask = await roundedMask(size, radius);
  return sharp(composed)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(MARK) && !fs.existsSync(SOURCE)) {
    throw new Error('No mark source found (images/21st-mark.webp)');
  }

  if (fs.existsSync(OUT_FAVICON)) {
    fs.copyFileSync(OUT_FAVICON, path.join(IMAGES, 'favicon.prev.webp'));
  }

  // High-res master for clean downscale
  const master = await makeBadge(256, 0.84, 56, 8, {
    brightness: 1.4,
    saturation: 1.28,
    linear: [1.15, 8],
  });

  // Site favicon (48 webp) — sharpen after resize for tab legibility
  await sharp(master)
    .resize(48, 48, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.9, m1: 0.6, m2: 0.35 })
    .webp({ quality: 95, alphaQuality: 100, effort: 6 })
    .toFile(OUT_FAVICON);

  // Visual QA previews (not wired into site)
  for (const s of [16, 32, 64]) {
    await sharp(master)
      .resize(s, s, { kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: s <= 16 ? 1.1 : 0.85, m1: 0.7, m2: 0.4 })
      .png()
      .toFile(path.join(IMAGES, `favicon-preview-${s}.png`));
  }

  // Apple home-screen icon — same badge language
  const apple = await makeBadge(180, 0.8, 40, 5, {
    brightness: 1.22,
    saturation: 1.16,
    linear: [1.08, 4],
  });
  await sharp(apple)
    .flatten({ background: { r: 16, g: 8, b: 31 } })
    .png()
    .toFile(OUT_APPLE);

  console.log(`Wrote ${path.relative(ROOT, OUT_FAVICON)} (${fs.statSync(OUT_FAVICON).size} bytes)`);
  console.log(`Wrote ${path.relative(ROOT, OUT_APPLE)} (${fs.statSync(OUT_APPLE).size} bytes)`);
  console.log('Preview: images/favicon-preview-{16,32,64}.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
