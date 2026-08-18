const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok: !!ok, detail });
}

const liveSample = path.join(ROOT, 'dive', 'alice', 'nature-of-reality.html');
const stubSample = path.join(ROOT, 'dive', 'breakdown', 'homecoming-path.html');
check('live sample exists', fs.existsSync(liveSample));
check('stub sample exists', fs.existsSync(stubSample));

if (fs.existsSync(liveSample)) {
  const h = fs.readFileSync(liveSample, 'utf8');
  check('live title', h.includes('Nature of Reality'));
  check('live report body', h.includes('Overview') || h.includes('report-prerendered'));
  check('live canonical', h.includes('https://21stmemory.com/dive/alice/nature-of-reality.html'));
  check('live Article schema', h.includes('"@type": "Article"'));
  check('live no noindex', !h.includes('noindex'));
  check('live copy link', h.includes('data-share-action="copy-link"') || h.includes('dive-copy-link'));
  check('live quiz path', h.includes('../../quiz/alice/nature-of-reality.html'));
  check('live asset base', h.includes('../../assets/css/main.css'));
}

if (fs.existsSync(stubSample)) {
  const s = fs.readFileSync(stubSample, 'utf8');
  check('stub noindex', s.includes('noindex'));
  check('stub coming soon', /continues to unfold|coming soon/i.test(s));
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'dive-manifest.json'), 'utf8')
);
const live = (manifest.pages || []).filter((p) => p.live);
const stubs = (manifest.pages || []).filter((p) => !p.live);
check('manifest live ~100', live.length >= 90 && live.length <= 120, String(live.length));
check('manifest stubs ~64', stubs.length >= 50, String(stubs.length));

const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
check('sitemap has dive url', sm.includes('/dive/alice/nature-of-reality.html'));
check('sitemap no query deep-dive', !sm.includes('deep-dive.html?'));
check('sitemap no stub homecoming-path', !sm.includes('/dive/breakdown/homecoming-path.html'));

const tu = fs.readFileSync(path.join(ROOT, 'assets/js/topics-utils.js'), 'utf8');
check('topics-utils diveUrl', tu.includes('diveUrl'));
const home = fs.readFileSync(path.join(ROOT, 'assets/js/home.js'), 'utf8');
check('home uses diveUrl', home.includes('diveUrl'));
const dd = fs.readFileSync(path.join(ROOT, 'assets/js/deep-dive.js'), 'utf8');
check('deep-dive redirect', dd.includes('maybeRedirectToStaticDive'));
const shell = fs.readFileSync(path.join(ROOT, 'deep-dive.html'), 'utf8');
check('shell redirect script', shell.includes("/dive/' + encodeURIComponent(source)"));

let failed = 0;
for (const c of checks) {
  console.log(c.ok ? 'OK  ' : 'FAIL', c.name, c.detail || '');
  if (!c.ok) failed += 1;
}
console.log(failed ? `\n${failed} failed` : `\nAll ${checks.length} checks passed`);
process.exitCode = failed ? 1 : 0;
