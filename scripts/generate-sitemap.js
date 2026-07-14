const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://the21stmemory.com';
const today = new Date().toISOString().split('T')[0];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function collectTopicIds(topics, ids = []) {
  for (const topic of topics) {
    ids.push(topic.id);
    if (topic.subtopics) {
      collectTopicIds(topic.subtopics, ids);
    }
  }
  return ids;
}

const entries = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/community.html', priority: '0.9', changefreq: 'monthly' },
  { path: '/codex.html', priority: '0.95', changefreq: 'weekly' },
  { path: '/topics.html', priority: '0.9', changefreq: 'weekly' },
  { path: '/deep-dive.html', priority: '0.9', changefreq: 'weekly' },
  { path: '/quiz/alice/nature-of-reality.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/essence-of-the-transmission.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/3rd-density-overlays.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/97-percent-population.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/4000-ancients.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/adrenochrome-trade.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/perception-solidity.html', priority: '0.75', changefreq: 'monthly' },
];

const sourcesPath = path.join(ROOT, 'data', 'sources.json');
const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

for (const source of sourcesData.sources) {
  entries.push({
    path: `/topics.html?source=${source.id}`,
    priority: '0.88',
    changefreq: 'weekly',
  });

  const indexPath = path.join(ROOT, 'data', `${source.id}-topics-index.json`);
  if (!fs.existsSync(indexPath)) {
    console.warn(`Skip topics for source "${source.id}": ${indexPath} not found`);
    continue;
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const topicIds = collectTopicIds(indexData.topics || []);

  for (const topicId of topicIds) {
    entries.push({
      path: `/deep-dive.html?source=${source.id}&topic=${encodeURIComponent(topicId)}`,
      priority: '0.7',
      changefreq: 'monthly',
    });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => urlEntry(`${BASE_URL}${e.path}`, e.priority, e.changefreq)).join('\n\n')}
</urlset>
`;

const outPath = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

const invalidLoc = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((loc) => /&(?!amp;|lt;|gt;|quot;|apos;)/.test(loc));

if (invalidLoc.length > 0) {
  console.error(`Invalid XML in sitemap: ${invalidLoc.length} <loc> entries contain unescaped ampersands`);
  console.error(invalidLoc.slice(0, 3).join('\n'));
  process.exitCode = 1;
}

console.log(`Sitemap written: ${entries.length} URLs → ${outPath}`);