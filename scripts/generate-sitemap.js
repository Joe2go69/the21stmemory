/**
 * Sitemap generator.
 *
 * Full rebuild:  node scripts/generate-sitemap.js
 * Install patch: patchSitemap(['/dive/breakdown/foo.html', '/quiz/breakdown/foo.html'])
 *
 * lastmod is preserved from the existing sitemap unless the on-disk file is newer.
 * New URLs get the file date (or today). Unrelated URLs are not restamped.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://21stmemory.com';
const OUT_PATH = path.join(ROOT, 'sitemap.xml');

function todayStamp() {
  return new Date().toISOString().split('T')[0];
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, priority, changefreq, lastmod) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function collectTopicIds(topics, ids = []) {
  for (const topic of topics) {
    ids.push(topic.id);
    if (topic.subtopics) collectTopicIds(topic.subtopics, ids);
  }
  return ids;
}

function parseExistingLastmods(xml) {
  const map = new Map();
  if (!xml) return map;
  const re = /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
  let m;
  while ((m = re.exec(xml))) {
    map.set(m[1], m[2]);
  }
  return map;
}

function sitePathToFile(urlPath) {
  const clean = String(urlPath || '').split('?')[0];
  if (clean === '/' || clean === '') return path.join(ROOT, 'index.html');
  return path.join(ROOT, clean.replace(/^\//, '').replace(/\//g, path.sep));
}

function fileStamp(urlPath) {
  const full = sitePathToFile(urlPath);
  if (!fs.existsSync(full)) return null;
  return fs.statSync(full).mtime.toISOString().slice(0, 10);
}

function lastmodFor(urlPath, existing, loc) {
  const stored = existing.get(loc);
  const fileDate = fileStamp(urlPath);
  if (fileDate && stored) return fileDate > stored ? fileDate : stored;
  if (fileDate) return fileDate;
  if (stored) return stored;
  return todayStamp();
}

function collectQuizEntries() {
  const entries = [];
  const quizzesDir = path.join(ROOT, 'data', 'quizzes');
  if (!fs.existsSync(quizzesDir)) return entries;
  for (const sourceId of fs.readdirSync(quizzesDir)) {
    const dir = path.join(quizzesDir, sourceId);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const id = file.replace(/\.json$/, '');
      entries.push({
        path: `/quiz/${sourceId}/${id}.html`,
        priority: '0.75',
        changefreq: 'monthly'
      });
    }
  }
  entries.sort((a, b) => a.path.localeCompare(b.path));
  return entries;
}

function staticEntries() {
  return [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/network.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/codex.html', priority: '0.95', changefreq: 'weekly' },
    { path: '/topics.html', priority: '0.9', changefreq: 'weekly' },
    { path: '/deep-dive.html', priority: '0.9', changefreq: 'weekly' },
    { path: '/quizzes.html', priority: '0.92', changefreq: 'weekly' },
    { path: '/support.html', priority: '0.85', changefreq: 'monthly' }
  ];
}

function diveEntries() {
  const entries = [];
  const sourcesPath = path.join(ROOT, 'data', 'sources.json');
  const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  for (const source of sourcesData.sources) {
    entries.push({
      path: `/topics.html?source=${source.id}`,
      priority: '0.88',
      changefreq: 'weekly'
    });
  }

  const manifestPath = path.join(ROOT, 'data', 'dive-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const page of manifest.pages || []) {
      if (!page.live || !page.path) continue;
      entries.push({ path: page.path, priority: '0.8', changefreq: 'monthly' });
    }
    return entries;
  }

  for (const source of sourcesData.sources) {
    const indexPath = path.join(ROOT, 'data', `${source.id}-topics-index.json`);
    if (!fs.existsSync(indexPath)) continue;
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const topicId of collectTopicIds(indexData.topics || [])) {
      entries.push({
        path: `/dive/${source.id}/${encodeURIComponent(topicId)}.html`,
        priority: '0.7',
        changefreq: 'monthly'
      });
    }
  }
  return entries;
}

function generateSitemap() {
  const existingXml = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : '';
  const existing = parseExistingLastmods(existingXml);
  const entries = [...staticEntries(), ...collectQuizEntries(), ...diveEntries()];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => {
    const loc = `${BASE_URL}${e.path}`;
    return urlEntry(loc, e.priority, e.changefreq, lastmodFor(e.path, existing, loc));
  })
  .join('\n\n')}
</urlset>
`;

  fs.writeFileSync(OUT_PATH, xml, 'utf8');

  const invalidLoc = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((loc) => /&(?!amp;|lt;|gt;|quot;|apos;)/.test(loc));
  if (invalidLoc.length > 0) {
    console.error(`Invalid XML in sitemap: ${invalidLoc.length} <loc> entries contain unescaped ampersands`);
    console.error(invalidLoc.slice(0, 3).join('\n'));
    process.exitCode = 1;
  }

  console.log(`Sitemap written: ${entries.length} URLs → ${OUT_PATH}`);
  return { count: entries.length, path: OUT_PATH };
}

function patchSitemap(urlPaths) {
  const paths = [...new Set((urlPaths || []).filter(Boolean))];
  if (!paths.length) return { updated: 0, added: 0 };
  if (!fs.existsSync(OUT_PATH)) {
    generateSitemap();
    return { updated: 0, added: paths.length };
  }

  let xml = fs.readFileSync(OUT_PATH, 'utf8');
  const stamp = todayStamp();
  let updated = 0;
  let added = 0;

  for (const urlPath of paths) {
    const loc = `${BASE_URL}${urlPath}`;
    const locEsc = escapeXml(loc);
    const locRe = locEsc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lastmodRe = new RegExp(`(<loc>${locRe}</loc>\\s*<lastmod>)[^<]+(</lastmod>)`);
    if (lastmodRe.test(xml)) {
      xml = xml.replace(lastmodRe, `$1${stamp}$2`);
      updated += 1;
      continue;
    }
    const priority = urlPath.includes('/quiz/') ? '0.75' : urlPath.includes('/dive/') ? '0.8' : '0.7';
    const entry = urlEntry(loc, priority, 'monthly', stamp);
    if (!xml.includes('</urlset>')) {
      throw new Error('sitemap.xml missing </urlset>');
    }
    xml = xml.replace('</urlset>', `${entry}\n</urlset>`);
    added += 1;
  }

  fs.writeFileSync(OUT_PATH, xml, 'utf8');
  console.log(`Sitemap patched: ${updated} updated, ${added} added`);
  return { updated, added };
}

if (require.main === module) {
  generateSitemap();
}

module.exports = {
  ROOT,
  generateSitemap,
  patchSitemap,
  collectQuizEntries
};
