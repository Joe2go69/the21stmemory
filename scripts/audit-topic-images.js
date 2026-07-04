/**
 * Validates topic image paths referenced in data files exist on disk.
 * Run: node scripts/audit-topic-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGE_KEYS = ['image', 'topic_image', 'infographic_image', 'pdf_preview_image'];
const SOURCES = ['alice', 'breakdown'];

function walk(items, fn) {
  for (const item of items || []) {
    fn(item);
    if (item.subtopics?.length) walk(item.subtopics, fn);
  }
}

function collect(node, sourceId, topicId, topicTitle, refs) {
  for (const key of IMAGE_KEYS) {
    const value = node[key];
    if (!value || typeof value !== 'string') continue;
    refs.push({
      sourceId,
      topicId,
      topicTitle,
      field: key,
      path: value.replace(/\\/g, '/')
    });
  }
}

function existsExact(relPath) {
  return fs.existsSync(path.join(ROOT, ...relPath.split('/')));
}

function existsCaseInsensitive(relPath) {
  const parts = relPath.split('/');
  const fileName = parts.pop();
  const dir = path.join(ROOT, ...parts);
  if (!fs.existsSync(dir)) return false;
  const match = fs.readdirSync(dir).find(name => name.toLowerCase() === fileName.toLowerCase());
  return match ? { actual: [...parts, match].join('/') } : false;
}

function main() {
  const refs = [];
  const seen = new Set();

  for (const sourceId of SOURCES) {
    const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', `${sourceId}-topics-index.json`), 'utf8'));
    if (index.image) collect(index, sourceId, '(source)', index.title, refs);
    walk(index.topics, topic => collect(topic, sourceId, topic.id, topic.title, refs));

    const contentDir = path.join(ROOT, 'data', `${sourceId}-topics`);
    if (fs.existsSync(contentDir)) {
      for (const file of fs.readdirSync(contentDir).filter(name => name.endsWith('.json'))) {
        const content = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'));
        collect(content, sourceId, content.id || file.replace('.json', ''), content.id || file, refs);
      }
    }
  }

  const unique = refs.filter(ref => {
    const key = [ref.sourceId, ref.topicId, ref.field, ref.path].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const missing = [];
  const caseMismatches = [];
  const placeholders = unique.filter(ref => ref.path.includes('PLACEHOLDER'));

  for (const ref of unique) {
    if (ref.path.includes('PLACEHOLDER')) continue;
    if (existsExact(ref.path)) continue;

    const loose = existsCaseInsensitive(ref.path);
    if (loose) {
      caseMismatches.push({ ...ref, actual: loose.actual });
      continue;
    }

    missing.push(ref);
  }

  console.log(`Checked ${unique.length} image references`);
  console.log(`Missing files: ${missing.length}`);
  console.log(`Case mismatches: ${caseMismatches.length}`);
  console.log(`Placeholder refs: ${placeholders.length}`);

  if (caseMismatches.length) {
    console.log('\nCase mismatches (break on Linux deploys):');
    for (const ref of caseMismatches) {
      console.log(`- [${ref.sourceId}] ${ref.topicId} (${ref.topicTitle}) ${ref.field} -> ${ref.path} (actual: ${ref.actual})`);
    }
  }

  if (missing.length) {
    console.log('\nMissing:');
    for (const ref of missing) {
      console.log(`- [${ref.sourceId}] ${ref.topicId} (${ref.topicTitle}) ${ref.field} -> ${ref.path}`);
    }
  }

  if (missing.length || caseMismatches.length) {
    process.exitCode = 1;
  }
}

main();