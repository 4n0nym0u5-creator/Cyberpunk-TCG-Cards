import { asset } from './assets.js';

/** @type {{ profiles: Record<string, { links: { label: string, url: string }[] }>, aliases: Record<string, string> } | null} */
let cache = null;

export async function loadArtistProfiles() {
  if (cache) return cache;
  try {
    const res = await fetch(asset('data/artist-profiles.json'));
    if (!res.ok) throw new Error(String(res.status));
    cache = await res.json();
  } catch {
    cache = { profiles: {}, aliases: {} };
  }
  return cache;
}

function canonicalName(name, data = cache) {
  const raw = (name && String(name).trim()) || '';
  if (!raw) return '';
  const aliases = data?.aliases || {};
  return aliases[raw] || raw;
}

/** Curated profile links for an illustrator credit (empty if unknown). */
export function profileLinksForArtist(name) {
  const data = cache;
  if (!data) return [];
  const key = canonicalName(name, data);
  const entry = data.profiles?.[key];
  return Array.isArray(entry?.links) ? entry.links.filter((l) => l?.url) : [];
}

export function hasCuratedProfile(name) {
  return profileLinksForArtist(name).length > 0;
}

/** Always-available discovery link (ArtStation search). */
export function artistSearchUrl(name) {
  const q = encodeURIComponent((name && String(name).trim()) || '');
  return `https://www.artstation.com/search?sort_by=relevance&query=${q}`;
}

/** Curated links plus a Search fallback so every artist has at least one outbound. */
export function artistOutboundLinks(name) {
  const curated = profileLinksForArtist(name);
  if (curated.length) return curated;
  const n = (name && String(name).trim()) || '';
  if (!n || n === 'Unknown') return [];
  return [{ label: 'Search', url: artistSearchUrl(n) }];
}
