import { asset } from './assets.js';

let cache = null;

/** @returns {Promise<{ tags: Record<string, string[]>, updatedAt: string|null }>} */
export async function loadCardTags() {
  if (cache) return cache;
  try {
    const res = await fetch(asset('data/card-tags.json'));
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    cache = {
      tags: data.tags || {},
      updatedAt: data.updatedAt || null,
    };
  } catch {
    cache = { tags: {}, updatedAt: null };
  }
  return cache;
}

/** Attach `tags: string[]` onto each catalog card (mutates). */
export function applyCardTags(cards, tagsById = {}) {
  for (const c of cards || []) {
    c.tags = Array.isArray(tagsById[c.id]) ? tagsById[c.id] : [];
  }
  return cards;
}

export function cardTags(card) {
  return Array.isArray(card?.tags) ? card.tags : [];
}

/** Case-insensitive: card has this classification tag. */
export function cardHasTag(card, tag) {
  const needle = String(tag || '').trim().toLowerCase();
  if (!needle) return false;
  return cardTags(card).some((t) => t.toLowerCase() === needle);
}

/**
 * Match name / number / id / any tag (substring on tags ok for search box).
 * Empty query matches everything.
 */
export function cardMatchesQuery(card, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  if (!card) return false;
  if (String(card.name || '').toLowerCase().includes(q)) return true;
  if (String(card.number || '').toLowerCase().includes(q)) return true;
  if (String(card.id || '').toLowerCase().includes(q)) return true;
  if (String(card.type || '').toLowerCase().includes(q)) return true;
  return cardTags(card).some((t) => t.toLowerCase().includes(q));
}

/** Unique tags across entries, frequency desc then alpha. */
export function tagsInEntries(entries) {
  const counts = new Map();
  for (const e of entries || []) {
    for (const t of cardTags(e.card || e)) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
}
