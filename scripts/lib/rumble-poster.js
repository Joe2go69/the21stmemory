/**
 * Fetch Rumble oEmbed thumbnail URLs for click-to-play posters.
 * Browser CORS blocks oEmbed; Node can call it at install/backfill time.
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

async function fetchRumblePosterUrl(embedUrl, { timeoutMs = 12000 } = {}) {
  const canonical = canonicalRumbleEmbedUrl(embedUrl);
  if (!canonical) return '';

  const endpoint = `https://rumble.com/api/Media/oembed.json?url=${encodeURIComponent(canonical)}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      signal: ac.signal,
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return '';
    const data = await res.json();
    const thumb = String(data.thumbnail_url || '').trim();
    if (!/^https:\/\//i.test(thumb)) return '';
    return thumb;
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
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
    const url = await fetchRumblePosterUrl(video.embed_url);
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
