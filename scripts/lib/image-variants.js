/**
 * Small display copies of topic art for places that show it small
 * (category thumbnails, home shelf cards, Codex search, the dive hero on
 * phones) plus portrait copies of the series card art for the series hero.
 *
 *   images/alice/foo.webp  →  images/thumbs/alice/foo-320.webp, -640, -960
 *   images/alice-codex-card.webp → images/thumbs/series/alice-codex-card-480.webp, -800
 *
 * Originals are never touched. Slide-deck previews and lightbox/zoom images
 * always use the original full-resolution file. Infographics get one lighter
 * copy for the in-page frame only (see infographicDisplay below).
 * Every width is always written (an image narrower than a width is copied at
 * its own size) so browser srcset never points at a missing file.
 */
const fs = require('fs');
const path = require('path');
// sharp is loaded lazily so build scripts that only read srcsets stay light.
const sharp = (...args) => require('sharp')(...args);

const ROOT = path.join(__dirname, '..', '..');
const TOPIC_WIDTHS = [320, 640, 960];
const SERIES_WIDTHS = [480, 800];
const QUALITY = 74;

function topicVariantRel(rel, width) {
  const clean = String(rel).replace(/\\/g, '/').replace(/^\.?\//, '');
  const m = /^images\/([\w-]+)\/(.+)\.webp$/i.exec(clean);
  if (!m) return null;
  return `images/thumbs/${m[1]}/${m[2]}-${width}.webp`;
}

function seriesVariantRel(id, width) {
  return `images/thumbs/series/${id}-codex-card-${width}.webp`;
}

/** True when every topic-size variant exists on disk. */
function hasTopicVariants(rel) {
  return TOPIC_WIDTHS.every((w) => {
    const v = topicVariantRel(rel, w);
    return v && fs.existsSync(path.join(ROOT, v));
  });
}

/** srcset for a topic image (variants + original), or '' if variants are missing. */
function topicSrcset(rel, encode = (p) => p, originalWidth = 1400) {
  if (!hasTopicVariants(rel)) return '';
  const parts = TOPIC_WIDTHS.map((w) => `${encode(topicVariantRel(rel, w))} ${w}w`);
  parts.push(`${encode(rel)} ${originalWidth}w`);
  return parts.join(', ');
}

async function writeVariant(input, outRel, width, force) {
  const out = path.join(ROOT, outRel);
  if (!force && fs.existsSync(out)) return false;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const buf = await sharp(input, { failOn: 'none' })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toBuffer();
  fs.writeFileSync(out, buf);
  return true;
}

async function ensureTopicVariants(rel, { force = false } = {}) {
  const full = path.join(ROOT, rel);
  if (!topicVariantRel(rel, TOPIC_WIDTHS[0]) || !fs.existsSync(full)) return 0;
  const missing = force || !hasTopicVariants(rel);
  if (!missing) return 0;
  const input = fs.readFileSync(full);
  let n = 0;
  for (const w of TOPIC_WIDTHS) {
    if (await writeVariant(input, topicVariantRel(rel, w), w, force)) n += 1;
  }
  return n;
}

async function ensureSeriesVariants(id, { force = false } = {}) {
  const rel = `images/${id}-codex-card.webp`;
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) return 0;
  const input = fs.readFileSync(full);
  let n = 0;
  for (const w of SERIES_WIDTHS) {
    if (await writeVariant(input, seriesVariantRel(id, w), w, force)) n += 1;
  }
  return n;
}

/** Every topic_image referenced by the topic indexes (placeholders skipped). */
function collectTopicImages() {
  const { sources } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
  const set = new Set();
  const walk = (items) => {
    for (const t of items || []) {
      const img = String(t.topic_image || '').replace(/\\/g, '/');
      if (img && !/placeholder/i.test(img)) set.add(img);
      walk(t.subtopics);
    }
  };
  for (const { id } of sources) {
    const p = path.join(ROOT, 'data', `${id}-topics-index.json`);
    if (fs.existsSync(p)) walk(JSON.parse(fs.readFileSync(p, 'utf8')).topics);
  }
  return { images: [...set].sort(), sourceIds: sources.map((s) => s.id) };
}

/* ---------------------------------------------------------------------------
 * Infographic display copies (in-page plate frame only)
 *
 *   images/alice/foo-infographic.webp → images/thumbs/infographics/alice/foo-infographic-1024.webp
 *   images/bar.webp                   → images/thumbs/infographics/_root/bar-1024.webp
 *
 * The dive page frame shows the 1024px copy (srcset with the original as the
 * 1536w option for big/retina screens). The lightbox / zoom always opens the
 * full original. Originals are never touched.
 * images/thumbs/infographics/manifest.json remembers which original each copy
 * was made from (sha1), so a re-exported original gets a fresh copy.
 * Originals at or below 1100px wide get no copy: the frame uses them as is.
 * ------------------------------------------------------------------------- */
const INFOGRAPHIC_WIDTH = 1024;
const INFOGRAPHIC_MIN_SOURCE = 1100;
const INFOGRAPHIC_QUALITY = 80;
const INFOGRAPHIC_MANIFEST = 'images/thumbs/infographics/manifest.json';

function infographicVariantRel(rel) {
  const clean = String(rel).replace(/\\/g, '/').replace(/^\.?\//, '');
  const m = /^images\/(?:([\w-]+)\/)?([^/]+)\.webp$/i.exec(clean);
  if (!m) return null;
  return `images/thumbs/infographics/${m[1] || '_root'}/${m[2]}-${INFOGRAPHIC_WIDTH}.webp`;
}

let infographicManifest = null;
function readInfographicManifest() {
  if (infographicManifest) return infographicManifest;
  const p = path.join(ROOT, INFOGRAPHIC_MANIFEST);
  infographicManifest = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  return infographicManifest;
}

function writeInfographicManifest() {
  const m = readInfographicManifest();
  const sorted = Object.fromEntries(Object.keys(m).sort().map((k) => [k, m[k]]));
  const p = path.join(ROOT, INFOGRAPHIC_MANIFEST);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(sorted, null, 2)}\n`);
}

function sha1(buf) {
  return require('crypto').createHash('sha1').update(buf).digest('hex');
}

/**
 * Display srcset for an infographic plate, or null when there is no current
 * copy (small original, or the copy is out of date): then use the original.
 * Returns { src, srcset } with paths relative to the site root.
 */
function infographicDisplay(rel) {
  const clean = String(rel || '').replace(/\\/g, '/').replace(/^\.?\//, '');
  const entry = readInfographicManifest()[clean];
  const variant = infographicVariantRel(clean);
  if (!entry || !variant || !fs.existsSync(path.join(ROOT, variant))) return null;
  const full = path.join(ROOT, clean);
  if (!fs.existsSync(full) || sha1(fs.readFileSync(full)) !== entry.sha1) return null;
  return {
    src: variant,
    srcset: `${variant} ${INFOGRAPHIC_WIDTH}w, ${clean} ${entry.width}w`,
    width: INFOGRAPHIC_WIDTH,
    height: Math.round((entry.height / entry.width) * INFOGRAPHIC_WIDTH)
  };
}

async function ensureInfographicVariant(rel, { force = false } = {}) {
  const clean = String(rel || '').replace(/\\/g, '/').replace(/^\.?\//, '');
  const variant = infographicVariantRel(clean);
  const full = path.join(ROOT, clean);
  if (!variant || !fs.existsSync(full)) return 0;
  const input = fs.readFileSync(full);
  const hash = sha1(input);
  const manifest = readInfographicManifest();
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  if (meta.width <= INFOGRAPHIC_MIN_SOURCE) {
    if (manifest[clean]) {
      delete manifest[clean];
      fs.rmSync(path.join(ROOT, variant), { force: true });
    }
    return 0;
  }
  const out = path.join(ROOT, variant);
  if (!force && manifest[clean] && manifest[clean].sha1 === hash && fs.existsSync(out)) return 0;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const buf = await sharp(input, { failOn: 'none' })
    .resize({ width: INFOGRAPHIC_WIDTH, withoutEnlargement: true })
    .webp({ quality: INFOGRAPHIC_QUALITY, effort: 5 })
    .toBuffer();
  fs.writeFileSync(out, buf);
  manifest[clean] = { sha1: hash, width: meta.width, height: meta.height };
  return 1;
}

/** Every infographic_image referenced by a topic content file. */
function collectInfographicImages() {
  const { sources } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
  const set = new Set();
  for (const { id } of sources) {
    const dir = path.join(ROOT, 'data', `${id}-topics`);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        const img = String(t.infographic_image || '').replace(/\\/g, '/').trim();
        if (img && !/placeholder/i.test(img)) set.add(img);
      } catch {
        /* skip unreadable file */
      }
    }
  }
  return [...set].sort();
}

module.exports = {
  INFOGRAPHIC_WIDTH,
  infographicVariantRel,
  infographicDisplay,
  ensureInfographicVariant,
  collectInfographicImages,
  writeInfographicManifest,
  TOPIC_WIDTHS,
  SERIES_WIDTHS,
  topicVariantRel,
  seriesVariantRel,
  hasTopicVariants,
  topicSrcset,
  ensureTopicVariants,
  ensureSeriesVariants,
  collectTopicImages
};
