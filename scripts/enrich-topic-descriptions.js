/**
 * Replaces boilerplate "Exploration of..." topic descriptions with
 * overview excerpts from reports, or cleaner fallback copy.
 *
 * Run: node scripts/enrich-topic-descriptions.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCES = ['alice', 'breakdown'];
const MAX_DESC = 200;

function isBoilerplate(description) {
  const text = String(description || '').trim();
  if (!text) return true;
  if (/^Exploration of/i.test(text)) return true;
  return false;
}

function cleanMarkdown(text) {
  return String(text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractOverview(report) {
  if (!report || report.includes('TODO') || report.length < 400) return null;

  const overviewMatch = report.match(/##\s*Overview\s*\n+([\s\S]*?)(?=\n##\s|\n#|$)/i);
  let paragraph = '';

  if (overviewMatch) {
    paragraph = overviewMatch[1].split(/\n\n+/)[0];
  } else {
    paragraph = report.replace(/^#[^\n]+\n+/, '').split(/\n\n+/)[0];
  }

  const cleaned = cleanMarkdown(paragraph.replace(/\n/g, ' '));
  return cleaned || null;
}

function truncateDescription(text) {
  if (text.length <= MAX_DESC) return text;

  const slice = text.slice(0, MAX_DESC);
  const period = slice.lastIndexOf('.');
  if (period >= MAX_DESC * 0.55) return slice.slice(0, period + 1);

  const space = slice.lastIndexOf(' ');
  if (space >= MAX_DESC * 0.55) return `${slice.slice(0, space)}…`;
  return `${slice}…`;
}

function loadReport(sourceId, topic, contentDir) {
  if (topic.report) return topic.report;

  const filePath = path.join(contentDir, `${topic.id}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return content.report || null;
  } catch {
    return null;
  }
}

function buildFallback(topic, source) {
  if (topic.is_placeholder) {
    return `Archive entry for ${topic.title} — report, media, and infographics coming soon.`;
  }

  return `Decoded analysis of ${topic.title} within the ${source.title} transmission.`;
}

function enrichTopic(topic, source, contentDir, stats) {
  if (!isBoilerplate(topic.description)) return;

  const report = loadReport(source.id, topic, contentDir);
  const overview = extractOverview(report);
  const nextDescription = overview
    ? truncateDescription(overview)
    : buildFallback(topic, source);

  if (nextDescription !== topic.description) {
    topic.description = nextDescription;
    stats.updated += 1;
  }
}

function walkTopics(topics, source, contentDir, stats, fn) {
  for (const topic of topics || []) {
    fn(topic, source, contentDir, stats);
    if (topic.subtopics?.length) walkTopics(topic.subtopics, source, contentDir, stats, fn);
  }
}

function enrichSource(sourceId) {
  const sourcePath = path.join(ROOT, 'data', `${sourceId}-topics.json`);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skip ${sourceId}: monolith not found`);
    return null;
  }

  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const contentDir = path.join(ROOT, 'data', `${sourceId}-topics`);
  const stats = { updated: 0, scanned: 0 };

  walkTopics(source.topics, source, contentDir, stats, (topic) => {
    stats.scanned += 1;
    enrichTopic(topic, source, contentDir, stats);
  });

  fs.writeFileSync(sourcePath, `${JSON.stringify(source, null, 2)}\n`, 'utf8');
  return stats;
}

function main() {
  let totalUpdated = 0;

  for (const sourceId of SOURCES) {
    const stats = enrichSource(sourceId);
    if (!stats) continue;
    totalUpdated += stats.updated;
    console.log(`${sourceId}: updated ${stats.updated} of ${stats.scanned} topics`);
  }

  if (totalUpdated > 0) {
    require('./split-topics-data.js');
    console.log('Regenerated topic index files via split-topics-data.js');
  } else {
    console.log('No descriptions needed updating.');
  }
}

main();