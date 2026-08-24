/**
 * Attach Rumble oEmbed poster_url onto existing topic videos, then rebuild dives.
 * Run: node scripts/backfill-rumble-posters.js
 */
const fs = require('fs');
const path = require('path');
const { attachRumblePosters, collectVideoLists, fetchRumblePosterUrl } = require('./lib/rumble-poster');
const { buildDives } = require('./build-static-dives');

const ROOT = path.join(__dirname, '..');
const SOURCES = ['breakdown', 'alice'];
const DELAY_MS = 40;

function walkTopics(topics, fn) {
  for (const t of topics || []) {
    fn(t);
    if (t.subtopics) walkTopics(t.subtopics, fn);
  }
}

function patchHomeFeatured(posterUrl) {
  const indexPath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(indexPath) || !posterUrl) return false;
  let html = fs.readFileSync(indexPath, 'utf8');
  const wrapRe =
    /(<div class="video-poster-wrap absolute inset-0 cursor-pointer"\s+data-rumble-embed="https:\/\/rumble\.com\/embed\/v7bz6xu\/[^"]*")/;
  if (!wrapRe.test(html)) return false;
  if (/data-poster-url="/.test(html.match(/id="home-rumble-grid"[\s\S]*?<\/article>/)?.[0] || '')) {
    html = html.replace(
      /(id="home-rumble-grid"[\s\S]*?data-rumble-embed="[^"]*"\s+)data-poster-url="[^"]*"/,
      `$1data-poster-url="${posterUrl}"`
    );
  } else {
    html = html.replace(wrapRe, `$1\n                                             data-poster-url="${posterUrl}"`);
  }
  html = html.replace(
    /(id="home-rumble-grid"[\s\S]*?<img src=")[^"]+(")/,
    `$1${posterUrl}$2`
  );
  fs.writeFileSync(indexPath, html, 'utf8');
  return true;
}

async function backfillSource(source) {
  const sourceFile = path.join(ROOT, 'data', `${source}-topics.json`);
  const tree = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const totals = { attached: 0, skipped: 0, failed: 0, topics: 0 };

  const nodes = [];
  walkTopics(tree.topics, (node) => nodes.push(node));

  for (const node of nodes) {
    const lists = collectVideoLists(node);
    if (!lists.length) continue;
    totals.topics += 1;
    for (const list of lists) {
      const stats = await attachRumblePosters(list, { delayMs: DELAY_MS });
      totals.attached += stats.attached;
      totals.skipped += stats.skipped;
      totals.failed += stats.failed;
    }

    const heavyPath = path.join(ROOT, 'data', `${source}-topics`, `${node.id}.json`);
    if (fs.existsSync(heavyPath)) {
      const heavy = JSON.parse(fs.readFileSync(heavyPath, 'utf8'));
      if (node.rumble_videos) heavy.rumble_videos = node.rumble_videos;
      if (node.video_languages) heavy.video_languages = node.video_languages;
      fs.writeFileSync(heavyPath, JSON.stringify(heavy, null, 2) + '\n', 'utf8');
    }
  }

  fs.writeFileSync(sourceFile, JSON.stringify(tree, null, 2) + '\n', 'utf8');
  console.log(
    `${source}: ${totals.topics} topics, ${totals.attached} posters fetched, ${totals.skipped} kept, ${totals.failed} missing`
  );
  return totals;
}

async function main() {
  for (const source of SOURCES) {
    const sourceFile = path.join(ROOT, 'data', `${source}-topics.json`);
    if (!fs.existsSync(sourceFile)) continue;
    await backfillSource(source);
  }

  const homePoster = await fetchRumblePosterUrl('https://rumble.com/embed/v7bz6xu/');
  if (homePoster && patchHomeFeatured(homePoster)) {
    console.log('Home featured poster:', homePoster);
  } else {
    console.log('Home featured poster unchanged');
  }

  buildDives();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
