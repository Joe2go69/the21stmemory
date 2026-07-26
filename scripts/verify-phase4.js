const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok: !!ok, detail });
}

const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
check('page-home class', index.includes('class="cosmic-bg font-sans page-home"') || index.includes('page-home'));
check('page-hero', index.includes('page-hero'));
check('section-eyebrow', index.includes('section-eyebrow'));
check('no home rumble iframe', !/rumble\.com\/embed[^"]+"[^>]*>\s*<\/iframe>/i.test(index.replace(/data-rumble-embed="[^"]+"/g, '')));
check('rumble facades', index.includes('data-rumble-embed='));
check('home media panel', index.includes('home-media-panel'));
check('full-width mobile CTAs', index.includes('w-full sm:w-auto'));

const homeJs = fs.readFileSync(path.join(ROOT, 'assets/js/home.js'), 'utf8');
check('home click-to-play', homeJs.includes('setupClickToPlayVideos'));

const render = fs.readFileSync(path.join(ROOT, 'assets/js/render-utils.js'), 'utf8');
check('source plain labels', render.includes('Foundational rabbit-hole') && render.includes('Final-stage'));

const css = fs.readFileSync(path.join(ROOT, 'assets/css/main.css'), 'utf8');
check('safe-area navbar', css.includes('safe-area-inset-top'));
check('page-hero-title', css.includes('.page-hero-title'));
check('min 44px controls', css.includes('min-height: 44px'));
check('report measure', /max-width:\s*(70|58|52|48|42)ch/.test(css));
check('chip scroll mobile', css.includes('scroll-snap-type'));

const interior = ['codex.html', 'quizzes.html', 'network.html', 'topics.html', 'deep-dive.html', '404.html'];
for (const f of interior) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  check(`${f} page-interior`, html.includes('page-interior'));
}

const dive = fs.readFileSync(path.join(ROOT, 'dive/alice/nature-of-reality.html'), 'utf8');
check('dive page-interior', dive.includes('page-interior'));
check('dive no giant iframe load', !dive.includes('<iframe src="https://rumble.com'));

let failed = 0;
for (const c of checks) {
  console.log(c.ok ? 'OK  ' : 'FAIL', c.name, c.detail || '');
  if (!c.ok) failed += 1;
}
console.log(failed ? `\n${failed} failed` : `\nAll ${checks.length} checks passed`);
process.exitCode = failed ? 1 : 0;
