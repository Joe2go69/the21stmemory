'use strict';
/**
 * Structured data for quiz pages: Organization + WebSite + WebPage + BreadcrumbList
 * (Home › Codex › Series › Topic › Quiz). Replaces the first JSON-LD block in <head>.
 *
 * Used by sync-quiz-chrome.js (every quiz page, every build) and by
 * quiz-pipeline.renderQuizHtml (new installs). quiz/_template.html keeps the
 * __PLACEHOLDER__ form so a copy of the template already has the right shape.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const BASE_URL = 'https://21stmemory.com';
const LD_RE = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;

const seriesTitles = new Map();
function seriesTitle(source) {
  if (seriesTitles.has(source)) return seriesTitles.get(source);
  let title = source;
  try {
    title = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', `${source}-topics-index.json`), 'utf8')).title || source;
  } catch (_) { /* placeholder or unknown series */ }
  seriesTitles.set(source, title);
  return title;
}

function decode(s) {
  return String(s || '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function buildGraph({ source, topicId, topicTitle, description, series }) {
  const quizUrl = `${BASE_URL}/quiz/${source}/${topicId}.html`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: '21st Memory',
        url: BASE_URL,
        logo: `${BASE_URL}/images/21st-mark.webp`
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: '21st Memory',
        publisher: { '@id': `${BASE_URL}/#organization` }
      },
      {
        '@type': 'WebPage',
        '@id': `${quizUrl}#webpage`,
        url: quizUrl,
        name: `${topicTitle} Quiz`,
        ...(description ? { description } : {}),
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/dive/${source}/${topicId}.html#article` },
        breadcrumb: { '@id': `${quizUrl}#breadcrumb` },
        inLanguage: 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${quizUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Codex', item: `${BASE_URL}/codex.html` },
          { '@type': 'ListItem', position: 3, name: series, item: `${BASE_URL}/series-${source}.html` },
          { '@type': 'ListItem', position: 4, name: topicTitle, item: `${BASE_URL}/dive/${source}/${topicId}.html` },
          { '@type': 'ListItem', position: 5, name: `${topicTitle} Quiz`, item: quizUrl }
        ]
      }
    ]
  };
}

/**
 * @param {string} html  quiz page (or the template)
 * @param {{source:string, topicId:string}} ids
 */
function applyQuizJsonLd(html, { source, topicId }) {
  if (!LD_RE.test(html)) return html;
  const isTemplate = source === '__SOURCE__';
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const topicTitle = decode(titleMatch ? titleMatch[1] : topicId).replace(/\s+Quiz\s*\|\s*21st Memory\s*$/, '').trim();
  const descMatch = html.match(/<meta name="description" content="([^"]*)">/);
  const description = decode(descMatch ? descMatch[1] : '');
  const graph = buildGraph({
    source,
    topicId,
    topicTitle,
    description,
    series: isTemplate ? '__SERIES_TITLE__' : seriesTitle(source)
  });
  const json = JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
  return html.replace(LD_RE, () => `<script type="application/ld+json">\n${json}\n</script>`);
}

module.exports = { applyQuizJsonLd, seriesTitle };
