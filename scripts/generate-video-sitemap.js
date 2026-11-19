/**
 * Video sitemap generator.
 *
 * Full rebuild:  node scripts/generate-video-sitemap.js
 *                (or: npm run build:video-sitemap)
 *
 * Builds sitemap-video.xml from the per-topic data files
 * (data/{source}-topics/{id}.json, rumble_videos entries), limited to
 * pages marked live in data/dive-manifest.json. Uses the Rumble embed
 * URL as player_loc and the Rumble poster as thumbnail_loc.
 *
 * Re-run after adding topics or videos; the file is committed.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://21stmemory.com';
const OUT_PATH = path.join(ROOT, 'sitemap-video.xml');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateVideoSitemap() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data', 'dive-manifest.json'), 'utf8')
  );
  const livePages = new Set(
    (manifest.pages || []).filter((p) => p.live && p.path).map((p) => p.path)
  );

  const entries = [];
  let skipped = 0;
  const topicsRoot = path.join(ROOT, 'data');
  for (const dir of fs.readdirSync(topicsRoot)) {
    if (!dir.endsWith('-topics')) continue;
    const sourceId = dir.slice(0, -'-topics'.length);
    const dirPath = path.join(topicsRoot, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    for (const file of fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'))) {
      const topicId = file.replace(/\.json$/, '');
      const pagePath = `/dive/${sourceId}/${topicId}.html`;
      if (!livePages.has(pagePath)) continue;
      const topic = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
      const videos = Array.isArray(topic.rumble_videos) ? topic.rumble_videos : [];
      const loc = `${BASE_URL}${pagePath}`;
      for (const video of videos) {
        if (!video.title || !video.embed_url || !video.poster_url) {
          skipped += 1;
          continue;
        }
        entries.push({
          loc,
          title: video.title,
          // Description is required by Google; fall back to the title when the
          // topic data has none.
          description: video.description || video.title,
          thumbnail: video.poster_url,
          player: video.embed_url,
        });
      }
    }
  }

  // Group videos by page: one <url> per page, multiple <video:video> children
  // (Google ignores duplicate <loc> entries, so repeating the page per video
  // would drop videos).
  const byPage = new Map();
  for (const e of entries) {
    if (!byPage.has(e.loc)) byPage.set(e.loc, []);
    byPage.get(e.loc).push(e);
  }
  const pages = [...byPage.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n` +
    pages
      .map(
        ([loc, videos]) =>
          `  <url>\n` +
          `    <loc>${escapeXml(loc)}</loc>\n` +
          videos
            .map(
              (e) =>
                `    <video:video>\n` +
                `      <video:thumbnail_loc>${escapeXml(e.thumbnail)}</video:thumbnail_loc>\n` +
                `      <video:title>${escapeXml(e.title)}</video:title>\n` +
                `      <video:description>${escapeXml(e.description)}</video:description>\n` +
                `      <video:player_loc>${escapeXml(e.player)}</video:player_loc>\n` +
                `      <video:family_friendly>yes</video:family_friendly>\n` +
                `    </video:video>`
            )
            .join('\n') +
          `\n  </url>`
      )
      .join('\n\n') +
    `\n</urlset>\n`;

  fs.writeFileSync(OUT_PATH, xml, 'utf8');
  console.log(
    `Video sitemap written: ${entries.length} videos across ${pages.length} pages, ${skipped} skipped (missing title/embed/poster) → ${OUT_PATH}`
  );
  return { count: entries.length, pages: pages.length, skipped, path: OUT_PATH };
}

if (require.main === module) {
  generateVideoSitemap();
}

module.exports = { generateVideoSitemap };
