/**
 * Static per-series landing pages: series-{id}.html
 *
 * Each page is topics.html (chrome + SEO already inlined) with its own
 * <title>, description, canonical, Open Graph / Twitter tags, JSON-LD and a
 * pre-rendered hero, so link previews (Facebook, Telegram, X, iMessage) and
 * search engines see the right series without running JavaScript.
 * topics.js reads <html data-series-id> and renders the same topics UI.
 *
 * Old links (topics.html?source={id}) redirect here from topics.html.
 *
 * Run after inline-chrome + inject-seo (part of `npm run build`):
 *   node scripts/build-series-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const seo = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/seo.json'), 'utf8'));
const { baseUrl, brand } = seo;

const SERIES_LABELS = {
  alice: 'Foundational rabbit-hole series',
  breakdown: 'Final-stage Great Awakening notes',
  ascension: 'EMF ascension process',
  revelations: 'Six-part revelations synopsis'
};

// Matches topics.html head SEO block: <title> … first </script> (JSON-LD)
const SEO_REGEX = /(\r?\n)(?:    )+<title>[\s\S]*?<\/script>/;
const REDIRECT_REGEX = /\s*<!-- series-redirect:start -->[\s\S]*?<!-- series-redirect:end -->/;
const SHELF_SCRIPT_REGEX = /<script>if\(\/\[\?&\]source=\/\.test\(location\.search\)\)document\.documentElement\.classList\.add\('has-source-shelf'\);<\/script>/;

function seriesPath(id) {
  return `/series-${id}.html`;
}

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** First sentence(s) up to ~160 chars, cut on a word boundary. */
function metaDescription(text, max = 160) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out = (out + s).trim() + ' ';
  }
  out = out.trim();
  if (out.length >= 80) return out;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]+$/, '')}…`;
}

function ogImageFor(id) {
  const rel = `images/og/series-${id}.jpg`;
  if (fs.existsSync(path.join(ROOT, rel))) {
    return { url: `${baseUrl}/${rel}`, width: 1200, height: 630, type: 'image/jpeg' };
  }
  const fallback = `images/${id}-codex-card-960.webp`;
  if (fs.existsSync(path.join(ROOT, fallback))) {
    return { url: `${baseUrl}/${fallback}`, width: 960, height: 524, type: 'image/webp' };
  }
  return {
    url: brand.defaultImage,
    width: brand.defaultImageWidth || 1200,
    height: brand.defaultImageHeight || 630,
    type: 'image/webp'
  };
}

function loadSeries() {
  const { sources } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
  return sources.map((s) => {
    const indexPath = path.join(ROOT, 'data', `${s.id}-topics-index.json`);
    const index = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : {};
    return {
      id: s.id,
      title: index.title || s.title,
      subtitle: index.subtitle || '',
      description: index.description || ''
    };
  });
}

function buildHead(series) {
  const url = `${baseUrl}${seriesPath(series.id)}`;
  const title = `${series.title} | ${brand.name}`;
  // No live counts in static meta: installs don't rebuild these pages, so counts would go stale.
  const description = metaDescription(series.description || `${series.title} — topics from the ${brand.name} Codex.`);
  const ogDescription = metaDescription(series.description || description, 200);
  const img = ogImageFor(series.id);
  const iconV = '20260811b';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: brand.name,
        url: baseUrl,
        logo: brand.logo
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: brand.name,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'en-US'
      },
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: series.title,
        description,
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: { '@id': `${baseUrl}/#organization` },
        primaryImageOfPage: { '@type': 'ImageObject', url: img.url, width: img.width, height: img.height },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Codex', item: `${baseUrl}/codex.html` },
          { '@type': 'ListItem', position: 2, name: series.title, item: url }
        ]
      }
    ]
  };

  return `
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="application-name" content="${escapeAttr(brand.name)}">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="${escapeAttr(brand.themeColor || '#0F0A1F')}">
    <link rel="canonical" href="${url}">
    <link rel="home" href="${baseUrl}/">
    <link rel="icon" href="${baseUrl}/images/favicon.webp?v=${iconV}" type="image/webp">
    <link rel="icon" href="${baseUrl}/images/favicon-48.png?v=${iconV}" type="image/png" sizes="48x48">
    <link rel="apple-touch-icon" href="${baseUrl}/images/apple-touch-icon.png?v=${iconV}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="${escapeAttr(brand.name)}">
    <meta property="og:locale" content="en_US">
    <meta property="og:title" content="${escapeAttr(series.title)}">
    <meta property="og:description" content="${escapeAttr(ogDescription)}">
    <meta property="og:image" content="${img.url}">
    <meta property="og:image:type" content="${img.type}">
    <meta property="og:image:width" content="${img.width}">
    <meta property="og:image:height" content="${img.height}">
    <meta property="og:image:alt" content="${escapeAttr(series.title)} — ${escapeAttr(brand.name)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(series.title)}">
    <meta name="twitter:description" content="${escapeAttr(ogDescription)}">
    <meta name="twitter:image" content="${img.url}">
    <meta name="twitter:image:alt" content="${escapeAttr(series.title)} — ${escapeAttr(brand.name)}">

<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;
}

/** Same markup topics.js paints first (paintSourceHeroShell), with the title filled in. */
function buildHeroShell(series) {
  const label = SERIES_LABELS[series.id] || 'Transmission archive';
  const image = `images/${series.id}-codex-card.webp`;
  const hasImage = fs.existsSync(path.join(ROOT, image));
  return `<div id="source-header" class="source-hero-host mb-0" aria-busy="true">
    <article class="source-hero" aria-busy="true" style="background-color:#0F0A1F">
      <div class="source-hero-grid">
        <div class="source-hero-copy">
          <p class="source-hero-eyebrow">${escapeAttr(label)}</p>
          <h1 id="source-hero-title" class="source-hero-title">${escapeAttr(series.title)}</h1>
        </div>
        <div class="source-hero-media" style="background-color:#0F0A1F">
          ${hasImage ? `<img src="${image}" alt="" class="source-hero-img" width="640" height="800" decoding="async" fetchpriority="high" style="background-color:#0F0A1F">` : ''}
          <span class="source-hero-media-fade" aria-hidden="true"></span>
        </div>
      </div>
    </article>
  </div>`;
}

function buildSeriesPage(template, series) {
  let html = template;
  if (!SEO_REGEX.test(html)) throw new Error('topics.html: SEO block not found');
  html = html.replace(SEO_REGEX, (m, nl) => `${nl}${buildHead(series).replace(/^\n/, '')}`);
  html = html.replace(REDIRECT_REGEX, '');
  html = html.replace(
    SHELF_SCRIPT_REGEX,
    "<script>document.documentElement.classList.add('has-source-shelf');</script>"
  );
  html = html.replace(/<html lang="en"/, `<html lang="en" data-series-id="${escapeAttr(series.id)}"`);
  html = html.replace(
    /<div id="source-header" class="source-hero-host mb-0" aria-busy="true"><\/div>/,
    buildHeroShell(series)
  );
  return html;
}

function buildSeriesPages() {
  const template = fs.readFileSync(path.join(ROOT, 'topics.html'), 'utf8');
  const series = loadSeries();
  const written = [];
  for (const s of series) {
    const out = path.join(ROOT, `series-${s.id}.html`);
    const html = buildSeriesPage(template, s);
    const prev = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    if (prev !== html) fs.writeFileSync(out, html, 'utf8');
    written.push(path.basename(out));
  }
  console.log(`Series pages: ${written.join(', ')}`);
  return written;
}

module.exports = { buildSeriesPages, seriesPath };

if (require.main === module) buildSeriesPages();
