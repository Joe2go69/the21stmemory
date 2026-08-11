/**
 * Install a user-provided favicon into production assets.
 * Source default: G:/My Drive/CH21/Website Files/New Downloads/favicon.webp
 *
 * Run: node scripts/install-favicon-from-source.js [optional-path]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'images');
const DEFAULT_SRC =
  'G:/My Drive/CH21/Website Files/New Downloads/favicon.webp';
const SRC = path.resolve(process.argv[2] || DEFAULT_SRC);
const OUT_FAV = path.join(IMAGES, 'favicon.webp');
const OUT_APPLE = path.join(IMAGES, 'apple-touch-icon.png');
const OUT_SRC_COPY = path.join(IMAGES, 'favicon-source.webp');

async function main() {
  if (!fs.existsSync(SRC)) {
    throw new Error(`Source missing: ${SRC}`);
  }

  // Backup previous production favicon
  try {
    const prev = execSync('git show HEAD:images/favicon.webp', {
      maxBuffer: 5e6,
      cwd: ROOT,
    });
    fs.writeFileSync(path.join(IMAGES, 'favicon.prev.webp'), prev);
    console.log('Backed up HEAD favicon → images/favicon.prev.webp');
  } catch (_) {
    if (fs.existsSync(OUT_FAV)) {
      fs.copyFileSync(OUT_FAV, path.join(IMAGES, 'favicon.prev.webp'));
      console.log('Backed up current favicon.webp → favicon.prev.webp');
    }
  }

  fs.copyFileSync(SRC, OUT_SRC_COPY);
  const input = fs.readFileSync(SRC);
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  console.log(`Source: ${meta.width}x${meta.height} ${meta.format}`);

  // Site favicon (48 webp, matches existing convention)
  await sharp(input, { failOn: 'none' })
    .resize(48, 48, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.55, m1: 0.45, m2: 0.25 })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(OUT_FAV);

  // Apple home-screen icon
  await sharp(input, { failOn: 'none' })
    .resize(180, 180, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(OUT_APPLE);

  // Optional multi-size previews for visual check
  for (const s of [16, 32, 64]) {
    await sharp(input, { failOn: 'none' })
      .resize(s, s, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
      .png()
      .toFile(path.join(IMAGES, `favicon-preview-${s}.png`));
  }

  const favMeta = await sharp(OUT_FAV).metadata();
  console.log(
    `Wrote images/favicon.webp (${fs.statSync(OUT_FAV).size} bytes, ${favMeta.width}x${favMeta.height})`
  );
  console.log(
    `Wrote images/apple-touch-icon.png (${fs.statSync(OUT_APPLE).size} bytes)`
  );
  console.log('Kept full source as images/favicon-source.webp');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
