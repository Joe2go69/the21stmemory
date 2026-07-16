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
  { path: '/network.html', priority: '0.9', changefreq: 'monthly' },
  { path: '/codex.html', priority: '0.95', changefreq: 'weekly' },
  { path: '/topics.html', priority: '0.9', changefreq: 'weekly' },
  { path: '/deep-dive.html', priority: '0.9', changefreq: 'weekly' },
  { path: '/quiz/alice/nature-of-reality.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/essence-of-the-transmission.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/3rd-density-overlays.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/97-percent-population.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/4000-ancients.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/adrenochrome-trade.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/amnesia-vortex.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/antiquity-technology.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/anunnaki.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/ascension-event.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/atmospheric-condensers.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/control-mechanisms.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/cosmology.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/culling-survivors.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/custodians.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/density-suppression.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/ebs-disclosure.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/eliminating-old-knowledge.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/emf-white-flash.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/evidence-of-resets.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/fake-alien-invasion.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/fake-linear-time.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/false-history.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/finance-fake-money.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/firmament.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/flat-earth.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/free-energy-architecture.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/freemasonry.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/frequency-fences.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/gateway-10-system.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/giant-skeletons.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/grey-ets.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/holographic-projection-dome.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/ice-wall.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/inversion-tactics.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/loosh-harvesting.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/lucifer-light-bearer.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/moon-et-space-station.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/mud-floods.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/negative-entities.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/non-player-characters.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/npc-population.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/oopa-artifacts.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/orphan-trains.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/parasitic-takeover.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/perceived-knowledge-lies.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/recycled-souls.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/religion-false-gods.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/reptilians.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/resets-hidden-history.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/3-strings-of-attachment.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/simulation-reality.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/sol-soul-portal.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/soul-family.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/spiritual-awakening.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/star-seeds.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/sun-and-moon.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/tartaria.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/twin-flames.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/alice/world-war-i.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/perception-solidity.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/matrix-scaffolding.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/the-cube-system.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/essence-of-the-transmission.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/phase-one-three.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/targeting-parasites.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/eight-domes.html', priority: '0.75', changefreq: 'monthly' },
  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },
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