/**
 * Night City Brawl Season 1 — Nova Rare collectables (TCGPlayer night-city-brawl-season-1).
 * Catalog ids use NIGHTCITYBRAWL-S1-##; Minotaur keeps legacy id …-S1-00 (collector #002).
 * Ownership uses the BRAWL copy source (separate from β / R).
 * Minotaur is also in Embracing Power starter — those copies live on β / R, not BRAWL.
 */

export const NCB_SET_CODE = 'NCB';

/** Judge-stamped promo is fixed to Maman Brigitte in NCB Judge packs. */
export const NCB_JUDGE_CARD_ID = 'NIGHTCITYBRAWL-S1-15';

/** Exclusive Unit also listed in Embracing Power (starter β/R vs event BRAWL). */
export const NCB_MINOTAUR_ID = 'NIGHTCITYBRAWL-S1-00';

export function hasBrawlChamp(cardOrId) {
  const card = typeof cardOrId === 'string' ? { id: cardOrId } : cardOrId;
  return Boolean(card?.set_code === NCB_SET_CODE || String(card?.id || '').startsWith('NIGHTCITYBRAWL'));
}

export function hasBrawlJudge(cardOrId) {
  const id = typeof cardOrId === 'string' ? cardOrId : cardOrId?.id;
  return id === NCB_JUDGE_CARD_ID;
}

export function isMinotaurCard(cardOrId) {
  const id = typeof cardOrId === 'string' ? cardOrId : cardOrId?.id;
  return id === NCB_MINOTAUR_ID;
}

/** Stable collector order (S1-01 … S1-18). */
export const NCB_CARD_IDS = [
  'NIGHTCITYBRAWL-S1-01', // Kerry Eurodyne: The Last Rockerboy
  NCB_MINOTAUR_ID, // Minotaur (legacy id; collector #002 · also Embracing Power)
  'NIGHTCITYBRAWL-S1-03', // Satori: Sword of Saburo
  'NIGHTCITYBRAWL-S1-04', // Jackie Welles: Ride or Die Choom
  'NIGHTCITYBRAWL-S1-05', // Secondhand Bombus
  'NIGHTCITYBRAWL-S1-06', // Mandibular Upgrade
  'NIGHTCITYBRAWL-S1-07', // Bootleg Black Sapphire Show
  'NIGHTCITYBRAWL-S1-08', // Cyberpsychosis
  'NIGHTCITYBRAWL-S1-09', // Corpo Security
  'NIGHTCITYBRAWL-S1-10', // MaxTac Squadron
  'NIGHTCITYBRAWL-S1-11', // Wraith Marauders
  'NIGHTCITYBRAWL-S1-12', // (Don't Fear) The Reaper
  'NIGHTCITYBRAWL-S1-13', // We Gotta Live Together
  'NIGHTCITYBRAWL-S1-14', // Delamain Cab
  'NIGHTCITYBRAWL-S1-15', // Maman Brigitte: Spirit of Death
  'NIGHTCITYBRAWL-S1-16', // Dying Night: V's Pistol
  'NIGHTCITYBRAWL-S1-17', // NetWatch Netdriver
  'NIGHTCITYBRAWL-S1-18', // Floor It
];

export function isNcbCard(cardOrId) {
  const id = typeof cardOrId === 'string' ? cardOrId : cardOrId?.id;
  return Boolean(id && String(id).startsWith('NIGHTCITYBRAWL'));
}

/** Brawl-section ownership: participation BRAWL + CHAMP/JUDGE stamps (not starter β/R). */
export function ownedBrawlLaneCount(own) {
  return Math.max(
    0,
    (own?.brawl_copies || 0) +
      (own?.brawl_champ_copies || 0) +
      (own?.brawl_judge_copies || 0),
  );
}

export function listNcbCards(cards) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return NCB_CARD_IDS.map((id) => byId.get(id)).filter(Boolean);
}

export function ncbProgress(cards, ownership, getOwn) {
  const list = listNcbCards(cards);
  let owned = 0;
  for (const c of list) {
    if (ownedBrawlLaneCount(getOwn(ownership, c.id)) > 0) owned += 1;
  }
  return { owned, total: list.length, cards: list };
}
