/**
 * Verifies site image paths return image/* on the live deploy.
 * Run: node scripts/verify-live-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = process.env.SITE_URL || 'https://the21stmemory.com';
const IMAGE_KEYS = ['image', 'topic_image', 'infographic_image', 'pdf_preview_image', 'logo', 'thumbnail', 'src'];
const SCAN_DIRS = ['data', 'assets/data', 'assets/js', 'assets/css'];
const SCAN_ROOT_FILES = ['index.html', 'codex.html', 'topics.html', 'deep-dive.html', 'network.html', 'community.html', '404.html'];
const REF_PATTERNS = [
  /(?:src|href|content)=["']((?:images|assets\/images)\/[^"'#?]+)["']/gi,
  /["']((?:images|assets\/images)\/[^"']+\.(?:webp|png|jpe?g|gif|svg))["']/gi
];

function encodeAssetPath(p) {
  return String(p || '').split('/').map((part, i) => (i === 0 ? part : encodeURIComponent(part))).join('/');
}

function listFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      listFiles(full, acc);
    } else if (/\.(json|js|css|html)$/i.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function collectFromJson(obj, refs) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(item => collectFromJson(item, refs));
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && IMAGE_KEYS.includes(key) && /^(\.\.\/)?(images|assets\/images)\//.test(value)) {
      refs.add(value.replace(/\\/g, '/').replace(/^\.\.\//, ''));
    } else if (value && typeof value === 'object') {
      collectFromJson(value, refs);
    }
  }
}

function collectFromText(text, refs) {
  for (const pattern of REF_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const p = match[1].replace(/\\/g, '/').replace(/^\.\.\//, '');
      if (p.startsWith('assets/') || p.startsWith('images/')) refs.add(p);
    }
  }
}

function collectRefs() {
  const refs = new Set();
  const files = new Set();
  for (const f of SCAN_ROOT_FILES) {
    const fp = path.join(ROOT, f);
    if (fs.existsSync(fp)) files.add(fp);
  }
  for (const dir of SCAN_DIRS) listFiles(path.join(ROOT, dir)).forEach(f => files.add(f));

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    try {
      if (file.endsWith('.json')) collectFromJson(JSON.parse(raw), refs);
    } catch {
      /* ignore */
    }
    collectFromText(raw, refs);
  }

  return [...refs]
    .filter(ref => !ref.includes('PLACEHOLDER'))
    .sort();
}

async function check(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const type = res.headers.get('content-type') || '';
    const isImage = type.startsWith('image/');
    return { status: res.status, type, ok: res.ok && isImage };
  } catch (err) {
    return { status: 0, type: '', ok: false, error: err.message };
  }
}

async function main() {
  const refs = collectRefs();
  const broken = [];
  const batch = 10;

  console.log(`Checking ${refs.length} live image URLs at ${BASE}...`);

  for (let i = 0; i < refs.length; i += batch) {
    const chunk = refs.slice(i, i + batch);
    const results = await Promise.all(chunk.map(async (ref) => {
      const url = `${BASE}/${encodeAssetPath(ref)}`;
      const result = await check(url);
      return { ref, url, ...result };
    }));

    for (const r of results) {
      if (!r.ok) broken.push(r);
    }
  }

  console.log(`Broken: ${broken.length}`);
  for (const item of broken) {
    console.log(`- [${item.status}] ${item.type || item.error || 'no type'} :: ${item.ref}`);
  }

  if (broken.length) process.exitCode = 1;
}

main();