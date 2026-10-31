import { asset } from './assets.js';

let map = null;
let loadPromise = null;

/** Bump when card-images.json mapping changes so Pages/CDN clients refetch. */
const CARD_IMAGES_VERSION = '2026-10-31-gorilla-arms-pr';

export async function loadCardImages() {
  if (map) return map;
  if (!loadPromise) {
    const url = `${asset('data/card-images.json')}?v=${encodeURIComponent(CARD_IMAGES_VERSION)}`;
    loadPromise = fetch(url, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load card images');
        return r.json();
      })
      .then((data) => {
        map = data;
        return map;
      });
  }
  return loadPromise;
}

function resolveImageUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return asset(url);
}

function resolveEntry(entry) {
  if (!entry) return null;
  return {
    ...entry,
    url: resolveImageUrl(entry.url),
    urlHi: resolveImageUrl(entry.urlHi || entry.url),
  };
}

/** Prefer Iconic art when requested and we have that printing; never fall back to Iconic for base. */
export function imageForCard(cardId, { iconic = false } = {}) {
  const entry = map?.[cardId];
  if (!entry) return null;
  if (iconic) {
    if (entry.iconic) return resolveEntry(entry.iconic);
    return null;
  }
  return resolveEntry(entry.base) || null;
}

/** Base + Iconic entries when both exist (for detail views). */
export function imagesForCard(cardId) {
  const entry = map?.[cardId];
  if (!entry) return { base: null, iconic: null };
  return {
    base: resolveEntry(entry.base) || null,
    iconic: resolveEntry(entry.iconic) || null,
  };
}
