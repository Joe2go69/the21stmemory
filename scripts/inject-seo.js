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
const SEO_REGEX = /\r?\n(?:    )+<title>[\s\S]*?<\/script>\r?\n\r?\n/;

const seo = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/seo.json'), 'utf8')
);

const { baseUrl, brand } = seo;
const orgId = `${baseUrl}/#organization`;
const websiteId = `${baseUrl}/#website`;

function buildJsonLd(page) {
  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: brand.name,
      alternateName: brand.alternateNames,
      url: baseUrl,
      description: brand.description,
      logo: brand.logo,
      sameAs: brand.sameAs,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: baseUrl,
      name: brand.name,
      alternateName: brand.shortName,
      publisher: { '@id': orgId },
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
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function buildSeoHead(page) {
  const pageUrl = `${baseUrl}${page.path}`;
  const ogTitle = page.title;
  const homeLink = page.path === '/' ? '' : `    <link rel="home" href="${baseUrl}/">\n`;

  return `    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="application-name" content="${brand.name}">
    <link rel="canonical" href="${pageUrl}">
${homeLink}    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:site_name" content="${brand.name}">
    <meta property="og:locale" content="en_US">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:image" content="${brand.defaultImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${ogTitle}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${brand.defaultImage}">

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

let updated = 0;
let skipped = 0;

for (const [file, page] of Object.entries(seo.pages)) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip ${file}: file not found`);
    skipped++;
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

  fs.writeFileSync(filePath, result, 'utf8');
  console.log(`SEO injected → ${file}`);
  updated++;
}

console.log(`build:seo complete — ${updated} updated, ${skipped} skipped`);
if (skipped > 0) {
  process.exitCode = 1;
}