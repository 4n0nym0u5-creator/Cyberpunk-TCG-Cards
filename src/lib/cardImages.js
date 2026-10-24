import { asset } from './assets.js';

let map = null;
let loadPromise = null;

export async function loadCardImages() {
  if (map) return map;
  if (!loadPromise) {
    loadPromise = fetch(asset('data/card-images.json'))
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

/** Prefer Iconic art when A is checked and we have that printing. */
export function imageForCard(cardId, { iconic = false } = {}) {
  const entry = map?.[cardId];
  if (!entry) return null;
  if (iconic && entry.iconic) return resolveEntry(entry.iconic);
  return resolveEntry(entry.base) || null;
}
