/**
 * Phase 3 image pass:
 *  - Recompress large WebPs (resize max edge, quality target)
 *  - Generate responsive home-banner variants (*-640.webp, *-960.webp)
 *
 * Run: node scripts/optimize-images-phase3.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'images');

const MAX_EDGE = 1400;
const MAX_BYTES = 180 * 1024;
const QUALITY = 78;

const BANNER_SOURCES = [
  'about.webp',
  'codex-banner.webp',
  'oracle-banner.webp',
  'featured-transmissions-banner.webp',
];

async function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (/\.webp$/i.test(entry.name) && !entry.name.includes('.prev.')) list.push(full);
  }
  return list;
}

async function recompressIfNeeded(file) {
  const stat = fs.statSync(file);
  if (stat.size <= MAX_BYTES) return null;

  // Buffer I/O — more reliable on Windows/OneDrive than sharp(path) open
  const input = fs.readFileSync(file);
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (!w || !h) return null;

  let pipeline = sharp(input, { failOn: 'none' });
  const long = Math.max(w, h);
  if (long > MAX_EDGE) {
    if (w >= h) pipeline = pipeline.resize({ width: MAX_EDGE, withoutEnlargement: true });
    else pipeline = pipeline.resize({ height: MAX_EDGE, withoutEnlargement: true });
  }

  const outBuf = await pipeline
    .webp({ quality: QUALITY, alphaQuality: 85, effort: 4 })
    .toBuffer();

  // Only replace if we actually saved meaningful bytes
  if (outBuf.length >= stat.size * 0.95) return null;

  const rel = path.relative(ROOT, file);
  fs.writeFileSync(file, outBuf);
  return {
    file: rel,
    before: stat.size,
    after: outBuf.length,
  };
}

async function makeBannerVariants() {
  const results = [];
  for (const name of BANNER_SOURCES) {
    const src = path.join(IMAGES, name);
    if (!fs.existsSync(src)) continue;
    const base = name.replace(/\.webp$/i, '');
    for (const width of [640, 960]) {
      const out = path.join(IMAGES, `${base}-${width}.webp`);
      await sharp(src, { failOn: 'none' })
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, alphaQuality: 85, effort: 5 })
        .toFile(out);
      results.push({
        file: path.relative(ROOT, out),
        size: fs.statSync(out).size,
      });
    }
  }
  return results;
}

async function main() {
  const files = await walk(IMAGES);
  console.log(`Scanning ${files.length} webp files…`);
  const changed = [];
  for (const file of files) {
    // Skip generated responsive variants from recursive re-pass
    if (/-\d+\.webp$/i.test(path.basename(file))) continue;
    try {
      const r = await recompressIfNeeded(file);
      if (r) changed.push(r);
    } catch (err) {
      console.warn('skip', path.relative(ROOT, file), err.message);
    }
  }

  changed.sort((a, b) => b.before - a.before);
  let saved = 0;
  for (const r of changed.slice(0, 30)) {
    const kb = (n) => Math.round(n / 1024);
    console.log(`  ${r.file}: ${kb(r.before)} → ${kb(r.after)} KB`);
    saved += r.before - r.after;
  }
  if (changed.length > 30) console.log(`  … +${changed.length - 30} more`);
  console.log(`Recompressed ${changed.length} images, saved ~${Math.round(saved / 1024 / 1024 * 10) / 10} MB`);

  const variants = await makeBannerVariants();
  console.log(`Banner variants: ${variants.length}`);
  for (const v of variants) {
    console.log(`  ${v.file}: ${Math.round(v.size / 1024)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
