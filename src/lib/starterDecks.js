/**
 * Official Welcome to Night City starter decklists (Kickstarter / retail).
 * Source: https://cyberpunktcg.com/blog/wnc-starter-decks
 * Exclusive printings use SD01/SD02 (and Minotaur showcase); shared cards use MS01.
 */

/** @typedef {{ id: string, qty: number, role: 'legend' | 'main' }} StarterEntry */

/** @type {{ id: string, name: string, subtitle: string, entries: StarterEntry[] }[]} */
export const STARTER_DECKS = [
  {
    id: 'heist',
    name: 'The Heist',
    subtitle: 'Yellow / Blue · Merc starter',
    entries: [
      { id: 'SD01-012', qty: 1, role: 'legend' },
      { id: 'SD01-001', qty: 1, role: 'legend' },
      { id: 'SD01-011', qty: 1, role: 'legend' },
      { id: 'SD01-002', qty: 2, role: 'main' },
      { id: 'MS01-047', qty: 2, role: 'main' },
      { id: 'MS01-051', qty: 2, role: 'main' },
      { id: 'MS01-053', qty: 2, role: 'main' },
      { id: 'MS01-055', qty: 2, role: 'main' },
      { id: 'MS01-061', qty: 3, role: 'main' },
      { id: 'MS01-062', qty: 3, role: 'main' },
      { id: 'MS01-064', qty: 3, role: 'main' },
      { id: 'MS01-065', qty: 2, role: 'main' },
      { id: 'MS01-112', qty: 3, role: 'main' },
      { id: 'MS01-113', qty: 3, role: 'main' },
      { id: 'SD01-015', qty: 2, role: 'main' },
      { id: 'MS01-124', qty: 2, role: 'main' },
      { id: 'MS01-128', qty: 2, role: 'main' },
      { id: 'MS01-130', qty: 2, role: 'main' },
      { id: 'MS01-132', qty: 3, role: 'main' },
      { id: 'MS01-136', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'embracing-power',
    name: 'Embracing Power',
    subtitle: 'Red / Green · Arasaka starter',
    entries: [
      { id: 'SD02-012', qty: 1, role: 'legend' },
      { id: 'SD02-001', qty: 1, role: 'legend' },
      { id: 'SD02-013', qty: 1, role: 'legend' },
      { id: 'MS01-008', qty: 2, role: 'main' },
      { id: 'NIGHTCITYBRAWL-S1-00', qty: 2, role: 'main' },
      { id: 'MS01-017', qty: 3, role: 'main' },
      { id: 'MS01-019', qty: 2, role: 'main' },
      { id: 'MS01-077', qty: 2, role: 'main' },
      { id: 'MS01-078', qty: 2, role: 'main' },
      { id: 'SD02-017', qty: 2, role: 'main' },
      { id: 'MS01-080', qty: 2, role: 'main' },
      { id: 'MS01-023', qty: 2, role: 'main' },
      { id: 'MS01-025', qty: 3, role: 'main' },
      { id: 'MS01-026', qty: 3, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
      { id: 'MS01-034', qty: 2, role: 'main' },
      { id: 'MS01-035', qty: 2, role: 'main' },
      { id: 'MS01-076', qty: 3, role: 'main' },
      { id: 'MS01-095', qty: 3, role: 'main' },
      { id: 'MS01-097', qty: 3, role: 'main' },
    ],
  },
];

export function starterExclusiveIds() {
  const ids = new Set();
  for (const deck of STARTER_DECKS) {
    for (const e of deck.entries) {
      if (e.id.startsWith('SD0') || e.id.startsWith('NIGHTCITYBRAWL')) ids.add(e.id);
    }
  }
  return [...ids];
}

/** Unique catalog ids across both starters (stable deck order). */
export function starterCardIds() {
  const seen = new Set();
  const ids = [];
  for (const deck of STARTER_DECKS) {
    for (const e of deck.entries) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      ids.push(e.id);
    }
  }
  return ids;
}

export function resolveStarterCards(cards) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return STARTER_DECKS.map((deck) => {
    const entries = deck.entries
      .map((e) => ({ ...e, card: byId.get(e.id) || null }))
      .filter((e) => e.card);
    return { ...deck, entries };
  });
}
