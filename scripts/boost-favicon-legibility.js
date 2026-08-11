/**
 * Re-export favicon assets with a tighter crop + higher contrast
 * so the "21" reads more clearly at 16–32px tab size.
 *
 * Source: images/favicon-source.webp (or Drive path fallback)
 * Run: node scripts/boost-favicon-legibility.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'images');
const SRC_CANDIDATES = [
  path.join(IMAGES, 'favicon-source.webp'),
  'G:/My Drive/CH21/Website Files/New Downloads/favicon.webp',
  path.join(IMAGES, 'favicon.webp'),
];

function findSrc() {
  for (const p of SRC_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('No favicon source found');
}

/**
 * @param {Buffer} input
 * @param {number} size output px
 * @param {object} opts
 */
async function processIcon(input, size, opts = {}) {
  const {
    zoom = 0.78, // fraction of source kept (lower = bigger 21)
    brightness = 1.28,
    saturation = 1.18,
    contrast = 1.22,
    offset = -12,
    sharpenSigma = size <= 32 ? 1.0 : 0.75,
  } = opts;

  const meta = await sharp(input, { failOn: 'none' }).metadata();
  const w = meta.width || 1408;
  const h = meta.height || 1408;
  const side = Math.min(w, h);
  const crop = Math.max(32, Math.round(side * zoom));
  const left = Math.round((w - crop) / 2);
  const top = Math.round((h - crop) / 2);

  return sharp(input, { failOn: 'none' })
    .extract({ left, top, width: crop, height: crop })
    .modulate({ brightness, saturation })
    .linear(contrast, offset)
    .resize(size, size, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: sharpenSigma, m1: 0.7, m2: 0.4 })
    .toBuffer();
}

async function main() {
  const srcPath = findSrc();
  console.log('Source:', srcPath);
  const input = fs.readFileSync(srcPath);

  // Backup current production favicon
  const outFav = path.join(IMAGES, 'favicon.webp');
  if (fs.existsSync(outFav)) {
    fs.copyFileSync(outFav, path.join(IMAGES, 'favicon.prev.webp'));
  }

  async function exportSize(size, zoom) {
    const meta = await sharp(input, { failOn: 'none' }).metadata();
    const side = Math.min(meta.width || 1408, meta.height || 1408);
    const crop = Math.round(side * zoom);
    const left = Math.round(((meta.width || side) - crop) / 2);
    const top = Math.round(((meta.height || side) - crop) / 2);
    return sharp(input, { failOn: 'none' })
      .extract({ left, top, width: crop, height: crop })
      .modulate({ brightness: 1.42, saturation: 1.15 })
      .gamma(1.15)
      .linear(1.35, -22)
      .resize(size, size, {
        fit: 'cover',
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({
        sigma: size <= 32 ? 1.2 : 0.95,
        m1: 0.85,
        m2: 0.45,
      })
      .toBuffer();
  }

  // Favicon 48 webp (primary) — tight crop + lifted midtones for tab legibility
  const buf48 = await exportSize(48, 0.66);
  await sharp(buf48)
    .webp({ quality: 96, alphaQuality: 100, effort: 6 })
    .toFile(outFav);

  const buf32 = await exportSize(32, 0.64);
  await sharp(buf32).png().toFile(path.join(IMAGES, 'favicon-32.png'));

  await sharp(buf48).png().toFile(path.join(IMAGES, 'favicon-48.png'));

  const buf180 = await exportSize(180, 0.74);
  await sharp(buf180).png().toFile(path.join(IMAGES, 'apple-touch-icon.png'));

  console.log('Wrote favicon.webp', fs.statSync(outFav).size);
  console.log('Wrote favicon-32/48.png + apple-touch-icon.png');
  console.log('Preview: images/favicon-preview-{16,32,64}.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
