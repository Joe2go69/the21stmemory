/**
 * One-shot SEO pass: ensure quiz + dive meta/OG/Twitter descriptions
 * include "21st Memory". Does not change visible body copy.
 *
 *   node scripts/patch-meta-brand.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SUFFIX = ' — from the 21st Memory archive.';
const META_RE =
  /(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")(.*?)(")/gi;
const JSON_DESC_RE = /("description"\s*:\s*")((?:\\.|[^"\\])*)(")/g;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function hasBrand(s) {
  return /21st Memory/i.test(s);
}

function brandify(content) {
  if (!content || hasBrand(content)) return content;
  return content.replace(/\s+$/, '') + SUFFIX;
}

let updated = 0;
let scanned = 0;
let unchanged = 0;

const files = ['quiz', 'dive'].flatMap((d) => walk(path.join(ROOT, d)));

for (const file of files) {
  scanned++;
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  html = html.replace(META_RE, (full, open, content, close) => {
    const next = brandify(content);
    if (next === content) return full;
    changed = true;
    return open + next + close;
  });

  // JSON-LD description fields (Article / WebPage) when brand is missing
  html = html.replace(JSON_DESC_RE, (full, open, content, close) => {
    if (!content.trim() || hasBrand(content)) return full;
    // Skip organization/site boilerplate that already brands via name
    if (content.length < 12) return full;
    changed = true;
    return open + brandify(content) + close;
  });

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    updated++;
  } else {
    unchanged++;
  }
}

console.log(
  `patch-meta-brand: scanned=${scanned} updated=${updated} unchanged=${unchanged}`
);
