/**
 * Small display copies of topic art for places that show it small
 * (category thumbnails, home shelf cards, Codex search, the dive hero on
 * phones) plus portrait copies of the series card art for the series hero.
 *
 *   images/alice/foo.webp  →  images/thumbs/alice/foo-320.webp, -640, -960
 *   images/alice-codex-card.webp → images/thumbs/series/alice-codex-card-480.webp, -800
 *
 * Originals are never touched. Infographics, slide-deck previews and
 * lightbox/zoom images always use the original full-resolution file.
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

module.exports = {
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
