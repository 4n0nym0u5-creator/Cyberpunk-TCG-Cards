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

/** Prefer Iconic art when A is checked and we have that printing. */
export function imageForCard(cardId, { iconic = false } = {}) {
  const entry = map?.[cardId];
  if (!entry) return null;
  if (iconic && entry.iconic) return entry.iconic;
  return entry.base || null;
}
