/**
 * Standard constructed top-10 gallery (performance-ranked snapshot).
 * Sources: TCG Contender Standard meta, ripperdeck popularity, cyberpunk-tcg-news guides.
 * Snapshot as of ~2026-11-07 — sanctioned Night City Showdowns begin 2026-11-13.
 */

/** @typedef {{ id: string, qty: number, role: 'legend' | 'main' | 'side' }} MetaEntry */
/** @typedef {{ label: string, url: string, asOf: string }} MetaSource */

/**
 * @typedef {object} MetaDeck
 * @property {string} id
 * @property {number} rank
 * @property {1|2|3|4|5} tier
 * @property {number} score
 * @property {number} share
 * @property {string} name
 * @property {string} archetype
 * @property {string[]} colors
 * @property {string} why
 * @property {string} plan
 * @property {'full'|'core'} listStatus
 * @property {MetaSource[]} sources
 * @property {MetaEntry[]} entries
 */

const SRC_CONTENDER = {
  label: 'TCG Contender Standard',
  url: 'https://tcgcontender.com/cyberpunk/meta/standard',
  asOf: '2026-11-07',
};
const SRC_RIPPER = {
  label: 'ripperdeck meta',
  url: 'https://ripperdeck.gg/meta',
  asOf: '2026-11-08',
};
const SRC_BBG = {
  label: 'BBG Control guide',
  url: 'https://cyberpunk-tcg-news.de/2026/10/14/bbg-control-deck-guide-alt-hanako-jackie/',
  asOf: '2026-10-14',
};
const SRC_RRY = {
  label: 'RRY Aggro guide',
  url: 'https://cyberpunk-tcg-news.de/2026/10/15/rry-deck-guide-adam-smasher-dum-dum-and-v/',
  asOf: '2026-10-14',
};
const SRC_META = {
  label: 'Pre-tournament meta overview',
  url: 'https://cyberpunk-tcg-news.de/2026/10/15/cyberpunk-tcg-meta-before-the-first-tournaments/',
  asOf: '2026-10-14',
};

/** Prefer face-a Streetkid when decks name V: Streetkid. */
const STREETKID = 'MS01-005a';

/** @type {MetaDeck[]} */
export const META_DECKS = [
  {
    id: 'smasher-dumdum-streetkid',
    rank: 1,
    tier: 1,
    score: 64,
    share: 0.16,
    name: 'Adam Smasher / Dum Dum / V: Streetkid',
    archetype: 'Aggro-Tempo Gear Rush (RRY)',
    colors: ['red', 'yellow'],
    plan: 'Eddie ramp into Yorinobu on 4 and Smasher on 6; Gear pushes 10+ power swings.',
    why: 'TCG Contender #1 (score 64, ~16% share). Community “first answer to BBG”: big midrange bodies, Go Solo Smasher removal, Streetkid Braindance recursion, Dum Dum draw/Gear pumps. Cheapest Tier-1 shell in published guides.',
    listStatus: 'full',
    sources: [SRC_CONTENDER, SRC_RRY, SRC_META],
    entries: [
      { id: 'MS01-001', qty: 1, role: 'legend' },
      { id: STREETKID, qty: 1, role: 'legend' },
      { id: 'MS01-036', qty: 1, role: 'legend' },
      { id: 'MS01-043', qty: 3, role: 'main' },
      { id: 'MS01-006', qty: 3, role: 'main' },
      { id: 'MS01-052', qty: 3, role: 'main' },
      { id: 'MS01-007', qty: 3, role: 'main' },
      { id: 'MS01-022', qty: 3, role: 'main' },
      { id: 'MS01-025', qty: 3, role: 'main' },
      { id: 'MS01-026', qty: 3, role: 'main' },
      { id: 'MS01-064', qty: 3, role: 'main' },
      { id: 'MS01-027', qty: 3, role: 'main' },
      { id: 'MS01-033', qty: 3, role: 'main' },
      { id: 'MS01-028', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 3, role: 'main' },
      { id: 'MS01-034', qty: 3, role: 'main' },
      { id: 'MS01-030', qty: 3, role: 'main' },
    ],
  },
  {
    id: 'dexter-muamar-streetkid',
    rank: 2,
    tier: 1,
    score: 59,
    share: 0.091,
    name: 'Dexter DeShawn / Muamar Reyes / V: Streetkid',
    archetype: 'Aggro-Midrange Gig Race',
    colors: ['red', 'yellow'],
    plan: 'Race Gigs with mid Units + cheap Gear; Streetkid recycles Braindance programs.',
    why: 'Tier 1 on Contender (score 59). RareTotem’s preferred RRY-adjacent Gig-race shell: Fixer Legends (Dexter/Muamar) plus Streetkid engine. Same axis as River Gear but pressures with Streetkid tempo instead of River’s free Gear.',
    listStatus: 'core',
    sources: [SRC_CONTENDER, SRC_META, SRC_RIPPER],
    entries: [
      { id: 'MS01-002', qty: 1, role: 'legend' },
      { id: 'MS01-038', qty: 1, role: 'legend' },
      { id: STREETKID, qty: 1, role: 'legend' },
      { id: 'MS01-043', qty: 3, role: 'main' },
      { id: 'MS01-014', qty: 2, role: 'main' },
      { id: 'MS01-052', qty: 2, role: 'main' },
      { id: 'MS01-054', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-059', qty: 3, role: 'main' },
      { id: 'MS01-060', qty: 3, role: 'main' },
      { id: 'MS01-064', qty: 3, role: 'main' },
      { id: 'MS01-061', qty: 2, role: 'main' },
      { id: 'MS01-062', qty: 2, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 2, role: 'main' },
      { id: 'MS01-067', qty: 2, role: 'main' },
      { id: 'MS01-065', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'smasher-saburo-streetkid',
    rank: 3,
    tier: 1,
    score: 57,
    share: 0.031,
    name: 'Adam Smasher / Saburo Arasaka / V: Streetkid',
    archetype: 'Midrange-Control (Smasher / Arasaka)',
    colors: ['red', 'green'],
    plan: 'Arasaka value + Streetkid recursion; Smasher as late Go Solo finisher.',
    why: 'Tier 1 Contender shell pairing Smasher’s board wipe/attack with Saburo’s Arasaka package and Streetkid card advantage. Lower share than #1–2 but strong score; plays the midrange-control lane instead of pure Gear rush.',
    listStatus: 'core',
    sources: [SRC_CONTENDER, SRC_META],
    entries: [
      { id: 'MS01-001', qty: 1, role: 'legend' },
      { id: 'SD02-013', qty: 1, role: 'legend' },
      { id: STREETKID, qty: 1, role: 'legend' },
      { id: 'MS01-022', qty: 3, role: 'main' },
      { id: 'MS01-014', qty: 2, role: 'main' },
      { id: 'MS01-019', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-023', qty: 2, role: 'main' },
      { id: 'MS01-025', qty: 3, role: 'main' },
      { id: 'MS01-026', qty: 3, role: 'main' },
      { id: 'MS01-095', qty: 2, role: 'main' },
      { id: 'MS01-033', qty: 3, role: 'main' },
      { id: 'MS01-029', qty: 2, role: 'main' },
      { id: 'MS01-030', qty: 2, role: 'main' },
      { id: 'MS01-097', qty: 2, role: 'main' },
      { id: 'MS01-101', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'bbg-alt-hanako-jackie',
    rank: 4,
    tier: 1,
    score: 55,
    share: 0.1,
    name: 'Alt / Hanako / Jackie: Pour One Out For Me',
    archetype: 'BBG Control (Blue / Green)',
    colors: ['blue', 'green'],
    plan: 'Bottom-deck removal + Hanako pair draws; grind out late with Programs.',
    why: 'Tier 1 Contender (~10% share) and pre-retail consensus “deck to beat”. Alt/Jackie supply Blue RAM 4 for Towerfall/Les Élémens; Hanako converts Gig pairs into cards. Most published full netdeck in the format.',
    listStatus: 'full',
    sources: [SRC_CONTENDER, SRC_BBG, SRC_META, SRC_RIPPER],
    entries: [
      { id: 'MS01-106', qty: 1, role: 'legend' },
      { id: 'MS01-072', qty: 1, role: 'legend' },
      { id: 'SD01-011', qty: 1, role: 'legend' },
      { id: 'MS01-115', qty: 3, role: 'main' },
      { id: 'MS01-086', qty: 3, role: 'main' },
      { id: 'MS01-117', qty: 2, role: 'main' },
      { id: 'MS01-118', qty: 3, role: 'main' },
      { id: 'MS01-132', qty: 2, role: 'main' },
      { id: 'MS01-101', qty: 3, role: 'main' },
      { id: 'MS01-139', qty: 3, role: 'main' },
      { id: 'MS01-103', qty: 2, role: 'main' },
      { id: 'MS01-137', qty: 3, role: 'main' },
      { id: 'MS01-131', qty: 3, role: 'main' },
      { id: 'MS01-134', qty: 3, role: 'main' },
      { id: 'MS01-135', qty: 3, role: 'main' },
      { id: 'MS01-100', qty: 2, role: 'main' },
      { id: 'MS01-133', qty: 3, role: 'main' },
      { id: 'MS01-138', qty: 2, role: 'main' },
      { id: 'MS01-120', qty: 2, role: 'side' },
      { id: 'MS01-123', qty: 2, role: 'side' },
      { id: 'MS01-094', qty: 3, role: 'side' },
    ],
  },
  {
    id: 'smasher-judy-streetkid',
    rank: 5,
    tier: 2,
    score: 57,
    share: 0.015,
    name: 'Adam Smasher / Judy Álvarez / V: Streetkid',
    archetype: 'Aggro-Tempo Gig Race',
    colors: ['red', 'blue'],
    plan: 'Streetkid + Judy Braindance engine; Smasher closes once Gigs are contested.',
    why: 'High Contender score but held to Tier 2 by the ~2% share floor. Mixes red finisher pressure with Judy’s Braindance midrange tools — a Gig-race hybrid rather than pure RRY.',
    listStatus: 'core',
    sources: [SRC_CONTENDER, SRC_META],
    entries: [
      { id: 'MS01-001', qty: 1, role: 'legend' },
      { id: 'MS01-108', qty: 1, role: 'legend' },
      { id: STREETKID, qty: 1, role: 'legend' },
      { id: 'MS01-116', qty: 2, role: 'main' },
      { id: 'MS01-117', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-022', qty: 2, role: 'main' },
      { id: 'MS01-025', qty: 2, role: 'main' },
      { id: 'MS01-026', qty: 2, role: 'main' },
      { id: 'MS01-131', qty: 3, role: 'main' },
      { id: 'MS01-139', qty: 3, role: 'main' },
      { id: 'MS01-134', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 2, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
      { id: 'MS01-138', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'jackie-mama-johnny-streetkid',
    rank: 6,
    tier: 2,
    score: 56,
    share: 0.011,
    name: "Jackie: Mama's Favorite / Johnny / V: Streetkid",
    archetype: 'Red-heavy Aggro-Midrange',
    colors: ['red', 'green'],
    plan: 'Gig pressure with Johnny/Jackie bodies; Streetkid keeps programs flowing.',
    why: 'Tier 2 Contender shell emphasizing red Gig theft and midrange Units. Lower share, but the Legend trio is a clean “attack for Gigs” plan versus Blue’s bottom-deck removal.',
    listStatus: 'core',
    sources: [SRC_CONTENDER],
    entries: [
      { id: 'MS01-073', qty: 1, role: 'legend' },
      { id: 'MS01-003', qty: 1, role: 'legend' },
      { id: STREETKID, qty: 1, role: 'legend' },
      { id: 'MS01-011', qty: 3, role: 'main' },
      { id: 'MS01-006', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-019', qty: 2, role: 'main' },
      { id: 'MS01-025', qty: 3, role: 'main' },
      { id: 'MS01-026', qty: 2, role: 'main' },
      { id: 'MS01-060', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 3, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
      { id: 'MS01-034', qty: 2, role: 'main' },
      { id: 'MS01-030', qty: 2, role: 'main' },
      { id: 'MS01-101', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'smasher-alt-streetkid',
    rank: 7,
    tier: 2,
    score: 55,
    share: 0.034,
    name: 'Adam Smasher / Alt Cunningham / V: Streetkid',
    archetype: 'Midrange-Control hybrid',
    colors: ['red', 'blue'],
    plan: 'Blue disruption early; Smasher as the mid/late hammer once Gigs stall.',
    why: 'Dropped Contender Tier 1→2 but remains a high-value hybrid: Alt’s removal suite plus Streetkid recursion, with Smasher as the game-ender Contender still rates highly on score-per-dollar.',
    listStatus: 'core',
    sources: [SRC_CONTENDER, SRC_META],
    entries: [
      { id: 'MS01-001', qty: 1, role: 'legend' },
      { id: 'MS01-106', qty: 1, role: 'legend' },
      { id: STREETKID, qty: 1, role: 'legend' },
      { id: 'MS01-115', qty: 2, role: 'main' },
      { id: 'MS01-117', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-022', qty: 2, role: 'main' },
      { id: 'MS01-025', qty: 2, role: 'main' },
      { id: 'MS01-139', qty: 3, role: 'main' },
      { id: 'MS01-131', qty: 3, role: 'main' },
      { id: 'MS01-135', qty: 2, role: 'main' },
      { id: 'MS01-138', qty: 2, role: 'main' },
      { id: 'MS01-133', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 2, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'alt-jackie-judy',
    rank: 8,
    tier: 2,
    score: 55,
    share: 0.054,
    name: 'Alt / Jackie: Pour One Out / Judy Álvarez',
    archetype: 'Blue Midrange-Control (BBB lean)',
    colors: ['blue'],
    plan: 'Bottom-deck removal into big blue Units; Judy Unit needs Blue RAM 5+.',
    why: 'Tier 2 Contender with solid share. Same Alt/Jackie spine as BBG but swaps Hanako for Judy — mono-blue-leaning control that wins with Judy Álvarez: Nothing to Doubt and Placide-sized finishers instead of Hanako pair draws.',
    listStatus: 'core',
    sources: [SRC_CONTENDER, SRC_META],
    entries: [
      { id: 'MS01-106', qty: 1, role: 'legend' },
      { id: 'SD01-011', qty: 1, role: 'legend' },
      { id: 'MS01-108', qty: 1, role: 'legend' },
      { id: 'MS01-115', qty: 3, role: 'main' },
      { id: 'MS01-116', qty: 2, role: 'main' },
      { id: 'MS01-117', qty: 2, role: 'main' },
      { id: 'MS01-118', qty: 3, role: 'main' },
      { id: 'MS01-124', qty: 2, role: 'main' },
      { id: 'MS01-123', qty: 2, role: 'main' },
      { id: 'MS01-139', qty: 3, role: 'main' },
      { id: 'MS01-131', qty: 3, role: 'main' },
      { id: 'MS01-134', qty: 3, role: 'main' },
      { id: 'MS01-135', qty: 3, role: 'main' },
      { id: 'MS01-138', qty: 2, role: 'main' },
      { id: 'MS01-133', qty: 2, role: 'main' },
      { id: 'MS01-132', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'smasher-dexter-hanako',
    rank: 9,
    tier: 2,
    score: 55,
    share: 0.015,
    name: 'Adam Smasher / Dexter DeShawn / Hanako Arasaka',
    archetype: 'Aggro-Midrange',
    colors: ['red', 'green'],
    plan: 'Dexter Fixer midrange into Hanako value; Smasher as the closer.',
    why: 'Climbed into Contender Tier 2. Unusual red/green mix: Dexter’s Off the Grid toolkit plus Hanako’s draw engine, with Smasher as the shared finisher across many T2 lists.',
    listStatus: 'core',
    sources: [SRC_CONTENDER],
    entries: [
      { id: 'MS01-001', qty: 1, role: 'legend' },
      { id: 'MS01-002', qty: 1, role: 'legend' },
      { id: 'MS01-072', qty: 1, role: 'legend' },
      { id: 'MS01-014', qty: 2, role: 'main' },
      { id: 'MS01-086', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-022', qty: 2, role: 'main' },
      { id: 'MS01-025', qty: 2, role: 'main' },
      { id: 'MS01-026', qty: 2, role: 'main' },
      { id: 'MS01-101', qty: 3, role: 'main' },
      { id: 'MS01-103', qty: 2, role: 'main' },
      { id: 'MS01-097', qty: 2, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 2, role: 'main' },
      { id: 'MS01-100', qty: 2, role: 'main' },
    ],
  },
  {
    id: 'smasher-dexter-muamar',
    rank: 10,
    tier: 2,
    score: 55,
    share: 0.015,
    name: 'Adam Smasher / Dexter DeShawn / Muamar Reyes',
    archetype: 'Aggro-Midrange (accessible Smasher)',
    colors: ['red', 'yellow'],
    plan: 'Fixer midrange Gear race; Smasher as the shared late bomb.',
    why: 'Contender Tier 2 climber and Contender’s “beginner” Smasher shell: Dexter + Muamar Fixers do the midgame work while Smasher remains the format’s most familiar closer. Same RYY color spine as popular Gear lists.',
    listStatus: 'core',
    sources: [SRC_CONTENDER, SRC_RIPPER],
    entries: [
      { id: 'MS01-001', qty: 1, role: 'legend' },
      { id: 'MS01-002', qty: 1, role: 'legend' },
      { id: 'MS01-038', qty: 1, role: 'legend' },
      { id: 'MS01-043', qty: 2, role: 'main' },
      { id: 'MS01-054', qty: 2, role: 'main' },
      { id: 'MS01-014', qty: 2, role: 'main' },
      { id: 'MS01-007', qty: 2, role: 'main' },
      { id: 'MS01-059', qty: 3, role: 'main' },
      { id: 'MS01-060', qty: 3, role: 'main' },
      { id: 'MS01-064', qty: 3, role: 'main' },
      { id: 'MS01-025', qty: 2, role: 'main' },
      { id: 'MS01-026', qty: 2, role: 'main' },
      { id: 'MS01-067', qty: 2, role: 'main' },
      { id: 'MS01-033', qty: 2, role: 'main' },
      { id: 'MS01-029', qty: 2, role: 'main' },
    ],
  },
];

export const META_SNAPSHOT = {
  asOf: '2026-11-07',
  caveat:
    'Ranking blends community/simulator results and meta share (TCG Contender). Sanctioned Night City Showdowns begin 13 Nov 2026. Core shells are staple packages, not invented full 40s.',
  popularNote:
    'ripperdeck’s most-built shell lately is Dum Dum / River / Royce (Gear popularity) — strong presence, not Contender top-10 by results score.',
};

export function metaDeckById(id) {
  return META_DECKS.find((d) => d.id === id) || null;
}

export function resolveMetaDecks(cards) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return META_DECKS.map((deck) => {
    const entries = deck.entries
      .map((e) => ({ ...e, card: byId.get(e.id) || null }))
      .filter((e) => e.card);
    const missingIds = deck.entries.filter((e) => !byId.has(e.id)).map((e) => e.id);
    return { ...deck, entries, missingIds };
  });
}

export function metaEntryGroups(entries) {
  const legends = entries.filter((e) => e.role === 'legend');
  const main = entries.filter((e) => e.role === 'main');
  const side = entries.filter((e) => e.role === 'side');
  const byType = (list) => {
    const order = ['Unit', 'Gear', 'Program', 'Legend'];
    const map = new Map();
    for (const e of list) {
      const t = e.card?.type || 'Other';
      if (!map.has(t)) map.set(t, []);
      map.get(t).push(e);
    }
    return order
      .filter((t) => map.has(t))
      .map((t) => ({ type: t, entries: map.get(t) }))
      .concat(
        [...map.keys()]
          .filter((t) => !order.includes(t))
          .map((t) => ({ type: t, entries: map.get(t) })),
      );
  };
  return { legends, main, side, mainByType: byType(main), sideByType: byType(side) };
}
