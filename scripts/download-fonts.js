/**
 * Download Inter + Space Grotesk woff2 and write assets/css/fonts.css
 * Run: node scripts/download-fonts.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const OUT_CSS = path.join(ROOT, 'assets', 'css', 'fonts.css');
const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return get(res.headers.location).then(resolve, reject);
          }
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        }
      )
      .on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(FONT_DIR, { recursive: true });
  let css = (await get(CSS_URL)).toString('utf8');

  // Keep only latin faces (English site) — drop cyrillic/greek/vietnamese/latin-ext bulk
  const faces = css.match(/\/\* [^*]+ \*\/\s*@font-face\s*\{[\s\S]*?\}/g) || [];
  const latinFaces = faces.filter((block) => /\/\* latin \*\//.test(block));
  css =
    '/* Self-hosted type — latin only (from Google Fonts download) */\n\n' +
    (latinFaces.length ? latinFaces.join('\n\n') : css) +
    '\n';

  const re = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
  const urls = [...css.matchAll(re)].map((m) => m[1]);
  console.log(`Found ${urls.length} latin font files`);

  // Clear unused subset files so the fonts folder stays lean
  for (const name of fs.readdirSync(FONT_DIR)) {
    if (name.endsWith('.woff2')) fs.unlinkSync(path.join(FONT_DIR, name));
  }

  for (const url of urls) {
    const file = url.split('/').pop().split('?')[0];
    const out = path.join(FONT_DIR, file);
    if (!fs.existsSync(out)) {
      const data = await get(url);
      fs.writeFileSync(out, data);
      console.log(`  wrote ${file} (${Math.round(data.length / 1024)} KB)`);
    } else {
      console.log(`  exists ${file}`);
    }
    css = css.split(url).join(`../fonts/${file}`);
  }

  if (!/font-display\s*:/.test(css)) {
    css = css.replace(/@font-face\s*\{/g, '@font-face {\n  font-display: swap;');
  }

  fs.writeFileSync(OUT_CSS, css, 'utf8');
  console.log(`Wrote assets/css/fonts.css (${fs.statSync(OUT_CSS).size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
