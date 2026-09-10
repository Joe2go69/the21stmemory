/**
 * Fetch Rumble thumbnail URLs for click-to-play posters.
 * Browser CORS blocks oEmbed; Node can call it at install/backfill time.
 * Fresh uploads often miss oEmbed for a few seconds; fall back to the embed
 * page and retry with backoff before giving up.
 */
function canonicalRumbleEmbedUrl(embedUrl) {
  const raw = String(embedUrl || '').trim();
  const match = raw.match(/https?:\/\/(?:www\.)?rumble\.com\/embed\/([^/?#]+)/i);
  if (!match) return '';
  return `https://rumble.com/embed/${match[1]}/`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const POSTER_IN_HTML_RE =
  /https:\/\/hugh\.cdn\.rumble\.cloud\/video\/[A-Za-z0-9/._-]+\.(?:jpe?g|webp|png)/i;
const RETRY_DELAYS_MS = [0, 2000, 6000];

async function fetchText(url, { timeoutMs = 12000, accept = '*/*' } = {}) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { Accept: accept }
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

async function fetchOembedPoster(canonical, timeoutMs) {
  const endpoint = `https://rumble.com/api/Media/oembed.json?url=${encodeURIComponent(canonical)}`;
  const raw = await fetchText(endpoint, { timeoutMs, accept: 'application/json' });
  if (!raw) return '';
  try {
    const data = JSON.parse(raw);
    const thumb = String(data.thumbnail_url || '').trim();
    return /^https:\/\//i.test(thumb) ? thumb : '';
  } catch {
    return '';
  }
}

function posterFromEmbedHtml(html) {
  const match = String(html || '').match(POSTER_IN_HTML_RE);
  return match ? match[0] : '';
}

async function fetchEmbedPagePoster(canonical, timeoutMs) {
  const html = await fetchText(canonical, { timeoutMs, accept: 'text/html' });
  return posterFromEmbedHtml(html);
}

async function fetchRumblePosterUrl(embedUrl, { timeoutMs = 12000 } = {}) {
  const canonical = canonicalRumbleEmbedUrl(embedUrl);
  if (!canonical) return '';
  const fromOembed = await fetchOembedPoster(canonical, timeoutMs);
  if (fromOembed) return fromOembed;
  return fetchEmbedPagePoster(canonical, timeoutMs);
}

async function attachRumblePosters(videos, { force = false, delayMs = 0 } = {}) {
  const list = Array.isArray(videos) ? videos : [];
  let attached = 0;
  let skipped = 0;
  let failed = 0;
  for (const video of list) {
    if (!video || !video.embed_url) continue;
    if (!force && video.poster_url) {
      skipped += 1;
      continue;
    }
    let url = '';
    for (let i = 0; i < RETRY_DELAYS_MS.length; i += 1) {
      const wait = RETRY_DELAYS_MS[i];
      if (wait) await sleep(Math.max(wait, delayMs));
      url = await fetchRumblePosterUrl(video.embed_url);
      if (url) break;
    }
    if (url) {
      video.poster_url = url;
      attached += 1;
    } else {
      failed += 1;
    }
    if (delayMs) await sleep(delayMs);
  }
  return { attached, skipped, failed };
}

function collectVideoLists(node) {
  const lists = [];
  if (Array.isArray(node?.rumble_videos) && node.rumble_videos.length) {
    lists.push(node.rumble_videos);
  }
  if (Array.isArray(node?.video_languages)) {
    for (const lang of node.video_languages) {
      if (Array.isArray(lang?.videos) && lang.videos.length) lists.push(lang.videos);
    }
  }
  return lists;
}

module.exports = {
  canonicalRumbleEmbedUrl,
  fetchRumblePosterUrl,
  attachRumblePosters,
  collectVideoLists
};
