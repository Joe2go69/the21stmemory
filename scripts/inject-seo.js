/**
 * Injects shared SEO meta tags + JSON-LD from assets/data/seo.json into root HTML files.
 *
 * WORKFLOW:
 *   1. Edit assets/data/seo.json
 *   2. Run: npm run build:seo   (or full npm run build before deploy)
 *   3. Commit the updated HTML files
 *
 * Placeholder: <!-- SEO-HEAD -->
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SEO_MARKER = '    <!-- SEO-HEAD -->';
// Match title through the first closing </script> (JSON-LD). Blank line after is optional.
const SEO_REGEX = /\r?\n(?:    )+<title>[\s\S]*?<\/script>(?:\r?\n)*/;

const seo = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/seo.json'), 'utf8')
);

const { baseUrl, brand } = seo;
const orgId = `${baseUrl}/#organization`;
const websiteId = `${baseUrl}/#website`;
const ogImage = brand.defaultImage || brand.logo;
const ogWidth = brand.defaultImageWidth || 1200;
const ogHeight = brand.defaultImageHeight || 630;
const themeColor = brand.themeColor || '#0F0A1F';
const appleTouch = `${baseUrl}/images/apple-touch-icon.png`;
const favicon = `${baseUrl}/images/favicon.webp`;

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function buildJsonLd(page) {
  const alternateNames = Array.isArray(brand.alternateNames)
    ? brand.alternateNames
    : [brand.shortName].filter(Boolean);

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: brand.name,
      alternateName: alternateNames,
      url: baseUrl,
      description: brand.description,
      logo: brand.logo,
      image: ogImage,
      sameAs: brand.sameAs,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: baseUrl,
      name: brand.name,
      alternateName: alternateNames,
      description: brand.description,
      publisher: { '@id': orgId },
      inLanguage: 'en-US',
    },
  ];

  if (page.searchAction) {
    graph[1].potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/codex.html?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  if (page.webPage) {
    const pageUrl = `${baseUrl}${page.path}`;
    graph.push({
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': orgId },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: ogImage,
        width: ogWidth,
        height: ogHeight,
      },
    });
  }

  if (page.collectionPage) {
    const pageUrl = `${baseUrl}${page.path}`;
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': orgId },
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function buildSeoHead(page) {
  const pageUrl = `${baseUrl}${page.path}`;
  const ogTitle = page.title;
  const homeLink = page.path === '/' ? '' : `    <link rel="home" href="${baseUrl}/">\n`;
  const robots = page.noindex ? `    <meta name="robots" content="noindex">\n` : '';

  return `    <title>${escapeAttr(page.title)}</title>
    <meta name="description" content="${escapeAttr(page.description)}">
    <meta name="application-name" content="${escapeAttr(brand.name)}">
    <meta name="theme-color" content="${escapeAttr(themeColor)}">
    <link rel="canonical" href="${pageUrl}">
${homeLink}${robots}    <link rel="icon" href="${favicon}" type="image/webp">
    <link rel="apple-touch-icon" href="${appleTouch}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:site_name" content="${escapeAttr(brand.name)}">
    <meta property="og:locale" content="en_US">
    <meta property="og:title" content="${escapeAttr(ogTitle)}">
    <meta property="og:description" content="${escapeAttr(page.description)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="${ogWidth}">
    <meta property="og:image:height" content="${ogHeight}">
    <meta property="og:image:alt" content="${escapeAttr(brand.shortName || brand.name)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(ogTitle)}">
    <meta name="twitter:description" content="${escapeAttr(page.description)}">
    <meta name="twitter:image" content="${ogImage}">

<script type="application/ld+json">
${buildJsonLd(page)}
</script>

`;
}

function injectSeo(html, seoHead) {
  if (html.includes(SEO_MARKER)) {
    return html.replace(SEO_MARKER, seoHead.trimEnd());
  }
  if (SEO_REGEX.test(html)) {
    return html.replace(SEO_REGEX, `\n${seoHead}`);
  }
  return null;
}

/**
 * Remove duplicate icon / theme-color tags that live outside the SEO block
 * (older pages often had them after stylesheets).
 */
function dedupeHeadTags(html) {
  let seenIcon = false;
  let seenTheme = false;
  let seenApple = false;

  return html
    .replace(/<link\s+rel="icon"[^>]*>\s*/gi, (match) => {
      if (seenIcon) return '';
      seenIcon = true;
      return match;
    })
    .replace(/<meta\s+name="theme-color"[^>]*>\s*/gi, (match) => {
      if (seenTheme) return '';
      seenTheme = true;
      return match;
    })
    .replace(/<link\s+rel="apple-touch-icon"[^>]*>\s*/gi, (match) => {
      if (seenApple) return '';
      seenApple = true;
      return match;
    });
}

let updated = 0;
let skipped = 0;

// Thin redirect shells — never overwrite with full SEO chrome
const SKIP_FILES = new Set(['community.html']);

for (const [file, page] of Object.entries(seo.pages)) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip ${file}: file not found`);
    skipped++;
    continue;
  }
  if (SKIP_FILES.has(file)) {
    console.log(`Skip ${file}: redirect shell (manual SEO)`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const seoHead = buildSeoHead(page);
  const result = injectSeo(html, seoHead);

  if (!result) {
    console.warn(`Skip ${file}: SEO block not found (add ${SEO_MARKER})`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, dedupeHeadTags(result), 'utf8');
  console.log(`SEO injected → ${file}`);
  updated++;
}

console.log(`build:seo complete — ${updated} updated, ${skipped} skipped`);
// community.html is a noindex redirect shell — skip is expected, not a hard failure
const unexpectedSkips = skipped > 0 && !fs.existsSync(path.join(ROOT, 'community.html'));
if (unexpectedSkips) {
  process.exitCode = 1;
}
