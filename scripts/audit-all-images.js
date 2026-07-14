/**
 * Full-site image path audit: exact + case-insensitive checks.
 * Run: node scripts/audit-all-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGE_EXT = /\.(webp|png|jpe?g|gif|svg|ico)$/i;
const SCAN_DIRS = ['data', 'assets/data', 'assets/js', 'assets/css'];
const SCAN_ROOT_FILES = ['index.html', 'codex.html', 'topics.html', 'deep-dive.html', 'network.html', 'community.html', '404.html'];
const IMAGE_KEYS = ['image', 'topic_image', 'infographic_image', 'pdf_preview_image', 'logo', 'thumbnail', 'src'];

const REF_PATTERNS = [
  /(?:src|href|content)=["']((?:images|assets\/images)\/[^"'#?]+)["']/gi,
  /["']((?:images|assets\/images)\/[^"']+\.(?:webp|png|jpe?g|gif|svg))["']/gi,
  /url\(["']?((?:\.\.\/)?(?:images|assets\/images)\/[^"')]+)["']?\)/gi
];

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

function collectFromJson(obj, file, refs) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(item => collectFromJson(item, file, refs));
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && IMAGE_KEYS.includes(key) && value.match(/^(\.\.\/)?(images|assets\/images)\//)) {
      refs.push({ file, path: value.replace(/\\/g, '/').replace(/^\.\.\//, '') });
    } else if (value && typeof value === 'object') {
      collectFromJson(value, file, refs);
    }
  }
}

function collectFromText(text, file, refs) {
  for (const pattern of REF_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      let p = match[1].replace(/\\/g, '/').replace(/^\.\.\//, '');
      if (p.startsWith('assets/') || p.startsWith('images/')) {
        refs.push({ file, path: p });
      }
    }
  }
}

function resolveOnDisk(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const exact = path.join(ROOT, ...normalized.split('/'));
  if (fs.existsSync(exact)) {
    const stat = fs.statSync(exact);
    if (stat.isFile()) return { status: 'ok', actual: normalized };
  }

  const parts = normalized.split('/');
  const fileName = parts.pop();
  const dir = path.join(ROOT, ...parts);
  if (!fs.existsSync(dir)) return { status: 'missing' };

  const names = fs.readdirSync(dir);
  const caseMatch = names.find(n => n.toLowerCase() === fileName.toLowerCase());
  if (caseMatch) {
    return { status: 'case', actual: [...parts, caseMatch].join('/') };
  }
  return { status: 'missing' };
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function main() {
  const files = new Set();
  for (const f of SCAN_ROOT_FILES) {
    const fp = path.join(ROOT, f);
    if (fs.existsSync(fp)) files.add(fp);
  }
  for (const dir of SCAN_DIRS) {
    listFiles(path.join(ROOT, dir)).forEach(f => files.add(f));
  }

  const refs = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    try {
      if (file.endsWith('.json')) collectFromJson(JSON.parse(raw), rel(file), refs);
    } catch {
      /* non-json */
    }
    collectFromText(raw, rel(file), refs);
  }

  const seen = new Set();
  const unique = refs.filter(ref => {
    const key = `${ref.file}|${ref.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return !ref.path.includes('PLACEHOLDER');
  });

  const ok = [];
  const caseIssues = [];
  const missing = [];

  for (const ref of unique) {
    const result = resolveOnDisk(ref.path);
    if (result.status === 'ok') ok.push(ref);
    else if (result.status === 'case') caseIssues.push({ ...ref, actual: result.actual });
    else missing.push(ref);
  }

  console.log(`Scanned ${files.size} files`);
  console.log(`Unique image refs: ${unique.length}`);
  console.log(`OK (exact match): ${ok.length}`);
  console.log(`Case mismatches: ${caseIssues.length}`);
  console.log(`Missing: ${missing.length}`);

  if (caseIssues.length) {
    console.log('\n=== CASE MISMATCHES (break on Linux) ===');
    for (const item of caseIssues) {
      console.log(`- ${item.path}`);
      console.log(`  actual: ${item.actual}`);
      console.log(`  ref in: ${item.file}`);
    }
  }

  if (missing.length) {
    console.log('\n=== MISSING FILES ===');
    for (const item of missing) {
      console.log(`- ${item.path} (${item.file})`);
    }
  }

  if (caseIssues.length || missing.length) process.exitCode = 1;
}

if (require.main === module) {
  main();
} else {
  module.exports = { main };
}