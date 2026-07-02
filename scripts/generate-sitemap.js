const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://the21stmemory.com';
const today = new Date().toISOString().split('T')[0];

function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const entries = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/community.html', priority: '0.9', changefreq: 'monthly' },
  { path: '/codex.html', priority: '0.95', changefreq: 'weekly' },
  { path: '/topics.html', priority: '0.9', changefreq: 'weekly' },
];

const sourcesPath = path.join(ROOT, 'data', 'sources.json');
const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

for (const source of sourcesData.sources) {
  entries.push({
    path: `/topics.html?source=${source.id}`,
    priority: '0.88',
    changefreq: 'weekly',
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => urlEntry(`${BASE_URL}${e.path}`, e.priority, e.changefreq)).join('\n\n')}
</urlset>
`;

const outPath = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Sitemap written: ${entries.length} URLs → ${outPath}`);