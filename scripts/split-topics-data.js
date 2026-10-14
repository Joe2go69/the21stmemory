/**
 * Splits data/{source}-topics.json into a lightweight index + per-topic content files.
 * Run: node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { execFileSync } = require('child_process');

// added = first commit of the series data file, updated = latest commit.
// Falls back to values already in the stats file (e.g. shallow CI clones).
function gitSeriesDates(sourceId, previous) {
  const rel = `data/${sourceId}-topics.json`;
  const run = (args) => {
    try {
      return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (_) {
      return '';
    }
  };
  const shallow = run(['rev-parse', '--is-shallow-repository']) === 'true';
  const updated = run(['log', '-1', '--format=%cI', '--', rel]) || previous.updated || '';
  const addedLog = shallow ? '' : run(['log', '--diff-filter=A', '--format=%cI', '--', rel]).split('\n').filter(Boolean).pop();
  const added = addedLog || previous.added || '';
  return { ...(added ? { added } : {}), ...(updated ? { updated } : {}) };
}
const HEAVY_KEYS = [
  'report',
  'infographic_image',
  'pdf_preview_image',
  'slide_deck_pdf_url',
  'rumble_videos',
  'video_languages',
  'quiz'
];

function isPlaceholder(item) {
  if (item.is_placeholder != null) return !!item.is_placeholder;
  return !item.report ||
    (item.report && item.report.includes('TODO')) ||
    (item.topic_image || '').includes('PLACEHOLDER');
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
  if (node.added) light.added = node.added;
  if (node.is_main_root) light.is_main_root = true;
  if (node.video_language_count) light.video_language_count = node.video_language_count;

  if (node.subtopics?.length) {
    light.subtopics = node.subtopics.map(child => stripTopic(child, outDir, written));
  }

  return light;
}

function countTopicStats(topics) {
  let live = 0;
  let total = 0;

  const walk = (items) => {
    for (const item of items) {
      total++;
      if (!item.is_placeholder) live++;
      if (item.subtopics?.length) walk(item.subtopics);
    }
  };

  walk(topics || []);
  return { live, total };
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
    ...(raw.source_url ? { source_url: raw.source_url } : {}),
    ...(raw.source_url_label ? { source_url_label: raw.source_url_label } : {}),
    ...(raw.playlist_url ? { playlist_url: raw.playlist_url } : {}),
    ...(raw.playlist_label ? { playlist_label: raw.playlist_label } : {}),
    description: raw.description || '',
    total_topics: raw.total_topics || 0,
    topics: (raw.topics || []).map(topic => stripTopic(topic, outDir, written))
  };

  const indexPath = path.join(ROOT, 'data', `${sourceId}-topics-index.json`);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

  const statsPath = path.join(ROOT, 'data', `${sourceId}-stats.json`);
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(statsPath, 'utf8')); } catch (_) {}
  const stats = { ...countTopicStats(index.topics), ...gitSeriesDates(sourceId, previous) };
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2) + '\n', 'utf8');

  console.log(`${sourceId}: index → ${path.relative(ROOT, indexPath)} (${written.length} topic files)`);
  console.log(`${sourceId}: stats → ${path.relative(ROOT, statsPath)} (${stats.live}/${stats.total} live)`);
  return stats;
}

function splitAll() {
  const sourcesPath = path.join(ROOT, 'data', 'sources.json');
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const archiveTotals = { sources: sources.sources.length, live: 0, total: 0 };

  for (const source of sources.sources) {
    const stats = splitSource(source.id);
    if (stats) {
      archiveTotals.live += stats.live;
      archiveTotals.total += stats.total;
    }
  }

  const archiveStatsPath = path.join(ROOT, 'data', 'archive-stats.json');
  fs.writeFileSync(archiveStatsPath, JSON.stringify(archiveTotals, null, 2) + '\n', 'utf8');
  console.log(`archive-stats → ${path.relative(ROOT, archiveStatsPath)} (${archiveTotals.live}/${archiveTotals.total} live)`);
  return archiveTotals;
}

if (require.main === module) {
  splitAll();
}

module.exports = { splitAll, splitSource, countTopicStats };