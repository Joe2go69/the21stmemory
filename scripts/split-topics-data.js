/**
 * Splits data/{source}-topics.json into a lightweight index + per-topic content files.
 * Run: node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HEAVY_KEYS = [
  'report',
  'infographic_image',
  'pdf_preview_image',
  'slide_deck_pdf_url',
  'rumble_videos'
];

function isPlaceholder(item) {
  return !item.report ||
    (item.report && item.report.includes('TODO')) ||
    (item.topic_image || '').includes('PLACEHOLDER') ||
    (item.report && item.report.length < 400);
}

function stripTopic(node, outDir, written) {
  const heavy = { id: node.id };
  let hasHeavy = false;

  for (const key of HEAVY_KEYS) {
    if (node[key] != null && node[key] !== '') {
      heavy[key] = node[key];
      hasHeavy = true;
    }
  }

  if (hasHeavy) {
    const filePath = path.join(outDir, `${node.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(heavy, null, 2) + '\n', 'utf8');
    written.push(node.id);
  }

  const light = {
    id: node.id,
    title: node.title,
    description: node.description || '',
    topic_image: node.topic_image || '',
    is_placeholder: isPlaceholder(node)
  };

  if (node.subtopics?.length) {
    light.subtopics = node.subtopics.map(child => stripTopic(child, outDir, written));
  }

  return light;
}

function splitSource(sourceId) {
  const sourcePath = path.join(ROOT, 'data', `${sourceId}-topics.json`);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skip ${sourceId}: ${sourcePath} not found`);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const outDir = path.join(ROOT, 'data', `${sourceId}-topics`);
  fs.mkdirSync(outDir, { recursive: true });

  const written = [];
  const index = {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle || '',
    image: raw.image || '',
    pdf_url: raw.pdf_url || '',
    description: raw.description || '',
    total_topics: raw.total_topics || 0,
    topics: (raw.topics || []).map(topic => stripTopic(topic, outDir, written))
  };

  const indexPath = path.join(ROOT, 'data', `${sourceId}-topics-index.json`);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

  console.log(`${sourceId}: index → ${path.relative(ROOT, indexPath)} (${written.length} topic files)`);
}

const sourcesPath = path.join(ROOT, 'data', 'sources.json');
const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
for (const source of sources.sources) {
  splitSource(source.id);
}