const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok: !!ok, detail });
}

const live = fs.readFileSync(
  path.join(ROOT, 'dive', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const stub = fs.readFileSync(
  path.join(ROOT, 'dive', 'breakdown', 'ai-shells.html'),
  'utf8'
);
const about = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const dd = fs.readFileSync(path.join(ROOT, 'assets/js/deep-dive.js'), 'utf8');

check('live continue block', live.includes('dive-continue') && live.includes('Continue the remembering'));
check('live network CTA', live.includes('network.html') && live.includes('Thalon Thor Network'));
check('live quiz CTA end', live.includes('Take the') && live.includes('Quiz'));
check('live AI disclaimer', live.includes('AI may miss') || live.includes('AI-assisted bridge'));
check('live updated stamp', /Updated \d{4}-\d{2}-\d{2}/.test(live));
check('live no noindex', !live.includes('noindex'));
check('stub noindex', stub.includes('noindex'));
check('stub coming soon label', stub.includes('Coming soon'));
check('stub browse ready', stub.includes('Browse ready topics'));
check('stub not in sitemap', !sm.includes('/dive/breakdown/ai-shells.html'));
check('live in sitemap', sm.includes('/dive/alice/nature-of-reality.html'));
check('about no process line', !about.includes('How this archive works'));
check('about AI bridge', about.includes('AI is a bridge, not the source'));
check('about AI note', about.includes('about-banner-footnote') || about.includes('about-ai-note'));
check('about network link', about.includes('network.html'));
check('SPA continue helper', dd.includes('renderContinueLearning'));
check('SPA network in hero', dd.includes('href="network.html"'));

// Count sitemap live dives vs manifest
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/dive-manifest.json'), 'utf8'));
const liveCount = manifest.pages.filter((p) => p.live).length;
const smDive = (sm.match(/\/dive\//g) || []).length;
check('sitemap dive count matches live', smDive === liveCount, `${smDive} vs ${liveCount}`);

let failed = 0;
for (const c of checks) {
  console.log(c.ok ? 'OK  ' : 'FAIL', c.name, c.detail || '');
  if (!c.ok) failed += 1;
}
console.log(failed ? `\n${failed} failed` : `\nAll ${checks.length} checks passed`);
process.exitCode = failed ? 1 : 0;
