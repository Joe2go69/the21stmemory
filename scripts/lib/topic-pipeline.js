/**
 * Shared topic add/update pipeline.
 * Used by scripts/apply-topic.js. Do not copy into per-topic scripts.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { attachRumblePosters } = require('./rumble-poster');

const ROOT = path.join(__dirname, '..', '..');

const TOPIC_MAX_EDGE = 1400;
const TOPIC_QUALITY = 80;
const INFOGRAPHIC_QUALITY = 85;
const PDF_QUALITY = 82;

const REQUIRED_SECTIONS = [
  '## Overview',
  '## Key Terminology',
  '## Core Revelations',
  '## Detailed Mechanics and Key Elements',
  '## Broader Context and Interconnections',
  '## Strategic Implications'
];

function toKebab(filename) {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  return (
    base
      .replace(/[()]/g, '')
      .replace(/_/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() + ext.toLowerCase()
  );
}

function imageDir(source) {
  return path.join(ROOT, 'images', source);
}

function webPath(source, name) {
  return `images/${source}/${name}`;
}

function normalizeImage(source, sourceName, preferredTarget) {
  const dir = imageDir(source);
  const src = path.join(dir, sourceName);
  if (!fs.existsSync(src)) {
    if (preferredTarget) {
      const pref = path.join(dir, preferredTarget);
      if (fs.existsSync(pref)) {
        console.log(`OK (already normalized): ${preferredTarget}`);
        return webPath(source, preferredTarget);
      }
    }
    const kebab = toKebab(sourceName);
    const kebabFull = path.join(dir, kebab);
    if (fs.existsSync(kebabFull)) {
      console.log(`OK (already normalized): ${kebab}`);
      return webPath(source, kebab);
    }
    throw new Error(`Source image missing: ${webPath(source, sourceName)}`);
  }

  let targetName = preferredTarget || toKebab(sourceName);
  let n = 2;
  while (true) {
    const dest = path.join(dir, targetName);
    if (path.resolve(src) === path.resolve(dest)) {
      return webPath(source, targetName);
    }
    if (!fs.existsSync(dest)) break;
    const fromStat = fs.statSync(src);
    const toStat = fs.statSync(dest);
    if (fromStat.size === toStat.size) {
      fs.unlinkSync(src);
      console.log(`Removed duplicate source (same size as ${targetName}): ${sourceName}`);
      return webPath(source, targetName);
    }
    const ext = path.extname(preferredTarget || toKebab(sourceName));
    const stem = path.basename(preferredTarget || toKebab(sourceName), ext);
    targetName = `${stem}-${n}${ext}`;
    n += 1;
  }

  fs.renameSync(src, path.join(dir, targetName));
  console.log(`Renamed: ${sourceName} → ${targetName}`);
  return webPath(source, targetName);
}

async function compressImage(relPath, { maxEdge = null, quality = 80 } = {}) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image for compress: ${relPath}`);
  }
  const before = fs.statSync(full).size;
  const input = fs.readFileSync(full);
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (!w || !h) {
    console.warn(`Skip compress (no dimensions): ${relPath}`);
    return;
  }

  let pipeline = sharp(input, { failOn: 'none' });
  if (maxEdge) {
    const long = Math.max(w, h);
    if (long > maxEdge) {
      if (w >= h) pipeline = pipeline.resize({ width: maxEdge, withoutEnlargement: true });
      else pipeline = pipeline.resize({ height: maxEdge, withoutEnlargement: true });
    }
  }

  const outBuf = await pipeline.webp({ quality, alphaQuality: 90, effort: 5 }).toBuffer();

  if (outBuf.length >= before * 0.97) {
    console.log(
      `Compress skip (no gain): ${path.basename(relPath)} ${Math.round(before / 1024)}KB`
    );
    return;
  }

  fs.writeFileSync(full, outBuf);
  const afterMeta = await sharp(outBuf, { failOn: 'none' }).metadata();
  console.log(
    `Compressed: ${path.basename(relPath)} ${Math.round(before / 1024)}→${Math.round(outBuf.length / 1024)}KB ` +
      `(${w}x${h}→${afterMeta.width}x${afterMeta.height}, q=${quality})`
  );
}

function findNode(topics, id) {
  for (const t of topics) {
    if (t.id === id) return t;
    if (t.subtopics) {
      const found = findNode(t.subtopics, id);
      if (found) return found;
    }
  }
  return null;
}

function findAndUpdate(topics, topicId, next) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === topicId) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...next };
      if (existingSubtopics) topics[i].subtopics = existingSubtopics;
      if (existingQuiz) topics[i].quiz = existingQuiz;
      return true;
    }
    if (topics[i].subtopics && findAndUpdate(topics[i].subtopics, topicId, next)) {
      return true;
    }
  }
  return false;
}

function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

function assertKebabWebp(rel) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing image file: ${rel}`);
  const base = path.basename(rel);
  if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
    throw new Error(`Image path not normalized kebab-case: ${rel}`);
  }
}

async function applyTopic(payload) {
  const source = payload.source;
  const topicId = payload.id;
  if (!source || !topicId || !payload.title || !payload.report) {
    throw new Error('Payload needs source, id, title, report');
  }
  if (!['alice', 'breakdown'].includes(source)) {
    throw new Error(`Unknown source: ${source}`);
  }

  const imgs = payload.images || {};
  if (!imgs.topic || !imgs.pdfPreview || !imgs.infographic) {
    throw new Error('Payload.images needs topic, pdfPreview, infographic ({ source, target })');
  }

  const topicImage = normalizeImage(source, imgs.topic.source, imgs.topic.target);
  const pdfPreview = normalizeImage(source, imgs.pdfPreview.source, imgs.pdfPreview.target);
  const infographic = normalizeImage(
    source,
    imgs.infographic.source,
    imgs.infographic.target
  );

  await compressImage(topicImage, { maxEdge: TOPIC_MAX_EDGE, quality: TOPIC_QUALITY });
  await compressImage(pdfPreview, { maxEdge: null, quality: PDF_QUALITY });
  await compressImage(infographic, { maxEdge: null, quality: INFOGRAPHIC_QUALITY });

  const videos = payload.rumble_videos || [];
  if (!videos.length) throw new Error('Need at least 1 rumble video');
  if (!payload.slide_deck_pdf_url) throw new Error('Missing slide_deck_pdf_url');

  const posterStats = await attachRumblePosters(videos);
  if (Array.isArray(payload.video_languages)) {
    for (const lang of payload.video_languages) {
      if (Array.isArray(lang?.videos)) await attachRumblePosters(lang.videos);
    }
  }

  const next = {
    id: topicId,
    title: payload.title,
    description: payload.description || '',
    topic_image: topicImage,
    report: payload.report,
    infographic_image: infographic,
    pdf_preview_image: pdfPreview,
    slide_deck_pdf_url: payload.slide_deck_pdf_url,
    rumble_videos: videos,
    is_placeholder: false
  };

  const sourceFile = path.join(ROOT, 'data', `${source}-topics.json`);
  const tree = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

  const beforeOthers = collectImageFields(tree.topics)
    .filter((e) => e.id !== topicId)
    .map((e) => `${e.id}|${e.key}|${e.path}`)
    .sort();

  if (!findAndUpdate(tree.topics, topicId, next)) {
    throw new Error(
      `${topicId} not found in data/${source}-topics.json. Stop — do not invent a parent.`
    );
  }

  const afterOthers = collectImageFields(tree.topics)
    .filter((e) => e.id !== topicId)
    .map((e) => `${e.id}|${e.key}|${e.path}`)
    .sort();
  if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
    throw new Error('Safety check failed: another topic image path was modified');
  }

  const ours = new Set([topicImage, infographic, pdfPreview]);
  const collisions = collectImageFields(tree.topics).filter(
    (e) => e.id !== topicId && ours.has(e.path)
  );
  if (collisions.length) {
    throw new Error(
      'Image path collision with other topics:\n' +
        collisions.map((c) => `${c.id}.${c.key} = ${c.path}`).join('\n')
    );
  }

  fs.writeFileSync(sourceFile, JSON.stringify(tree, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', `${source}-topics`, `${topicId}.json`);
  const heavy = {
    id: topicId,
    report: next.report,
    infographic_image: next.infographic_image,
    pdf_preview_image: next.pdf_preview_image,
    slide_deck_pdf_url: next.slide_deck_pdf_url,
    rumble_videos: next.rumble_videos
  };
  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(tree.topics, topicId);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [topicImage, infographic, pdfPreview]) assertKebabWebp(rel);

  const updated = findNode(
    JSON.parse(fs.readFileSync(sourceFile, 'utf8')).topics,
    topicId
  );
  const missing = REQUIRED_SECTIONS.filter((h) => !updated.report.includes(h));
  if (missing.length) throw new Error(`Missing report sections: ${missing.join(', ')}`);
  if (updated.is_placeholder) throw new Error('Topic still marked as placeholder');
  if ((updated.topic_image || '').includes('placeholder')) {
    throw new Error('topic_image still points at placeholder');
  }
  if (updated.report.includes('TODO')) throw new Error('Report still contains TODO');

  console.log('Updated', topicId);
  console.log('  topic_image:', topicImage);
  console.log('  pdf_preview_image:', pdfPreview);
  console.log('  infographic_image:', infographic);
  console.log('  videos:', videos.length);
  console.log(
    '  posters:',
    `${posterStats.attached} fetched, ${posterStats.skipped} kept, ${posterStats.failed} missing`
  );
  console.log('  PDF:', payload.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  return { topicImage, pdfPreview, infographic, videos: videos.length };
}

function patchIndexNode(topics, topicId, patch) {
  for (const t of topics || []) {
    if (t.id === topicId) {
      Object.assign(t, patch);
      return true;
    }
    if (t.subtopics && patchIndexNode(t.subtopics, topicId, patch)) return true;
  }
  return false;
}

function countIndexStats(topics) {
  let live = 0;
  let total = 0;
  const walk = (items) => {
    for (const item of items || []) {
      total += 1;
      if (!item.is_placeholder) live += 1;
      if (item.subtopics) walk(item.subtopics);
    }
  };
  walk(topics);
  return { live, total };
}

/** Update this topic's index/stats only. Does not rewrite sibling topic JSON files. */
function refreshTopicIndex(source, topicId) {
  const sourceFile = path.join(ROOT, 'data', `${source}-topics.json`);
  const tree = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const node = findNode(tree.topics, topicId);
  if (!node) {
    throw new Error(`${topicId} not found in data/${source}-topics.json`);
  }

  const indexPath = path.join(ROOT, 'data', `${source}-topics-index.json`);
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing ${path.relative(ROOT, indexPath)}`);
  }
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const ok = patchIndexNode(index.topics, topicId, {
    title: node.title,
    description: node.description || '',
    topic_image: node.topic_image || '',
    is_placeholder: !!node.is_placeholder
  });
  if (!ok) {
    throw new Error(`${topicId} not found in data/${source}-topics-index.json`);
  }
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

  const stats = countIndexStats(index.topics);
  const statsPath = path.join(ROOT, 'data', `${source}-stats.json`);
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2) + '\n', 'utf8');

  const sourcesPath = path.join(ROOT, 'data', 'sources.json');
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  let live = 0;
  let total = 0;
  for (const s of sources.sources || []) {
    const p = path.join(ROOT, 'data', `${s.id}-stats.json`);
    if (!fs.existsSync(p)) continue;
    const st = JSON.parse(fs.readFileSync(p, 'utf8'));
    live += st.live || 0;
    total += st.total || 0;
  }
  const archive = {
    sources: (sources.sources || []).length,
    live,
    total
  };
  fs.writeFileSync(
    path.join(ROOT, 'data', 'archive-stats.json'),
    JSON.stringify(archive, null, 2) + '\n',
    'utf8'
  );
  console.log(
    `Index/stats refreshed for ${topicId} (${stats.live}/${stats.total} live in ${source})`
  );
  return { stats, archive };
}

module.exports = {
  ROOT,
  toKebab,
  normalizeImage,
  compressImage,
  findNode,
  applyTopic,
  refreshTopicIndex,
  TOPIC_MAX_EDGE,
  TOPIC_QUALITY,
  INFOGRAPHIC_QUALITY,
  PDF_QUALITY,
  REQUIRED_SECTIONS
};
