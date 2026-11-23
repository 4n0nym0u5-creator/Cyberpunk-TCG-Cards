/**
 * Kickstarter Beta Box + Beta Booster Display card pools.
 *
 * Beta Box (Netrunner+ reward): 1 booster + playmat + all stretch-goal Legends.
 * Final campaign put every MS01 Legend into the box (V Streetkid a/b, Judy, etc.).
 * https://cyberpunktcg.com/faq
 *
 * Box toppers: one random alt-art per Kickstarter Beta Booster Display from a
 * pool of six starter-deck Legends (same identities as SD exclusives).
 * https://cyberpunk-tcg-news.de/2026/08/08/cyberpunk-tcg-das-sind-die-sechs-box-topper-karten/
 */

/** Guaranteed Legends shipped in the Kickstarter Beta Box (MS01 printings). */
export const BETA_BOX_LEGEND_IDS = [
  'MS01-001', // Adam Smasher: Ender of Legends
  'MS01-002', // Dexter DeShawn: Off the Grid
  'MS01-003', // Johnny Silverhand: Rocking Renegade
  'MS01-004', // Royce: Psycho on the Edge
  'MS01-005a', // V: Streetkid (a)
  'MS01-005b', // V: Streetkid (b)
  'MS01-036', // Dum Dum: Maelstrom Triggerman
  'MS01-037', // Kerry Eurodyne: Axe, Attitude, Audience
  'MS01-038', // Muamar Reyes: El Capitán
  'MS01-039', // River Ward: Detective on the Hunt
  'MS01-040', // Rogue Amendiares: Preem Solo
  'MS01-071', // Goro Takemura: Vengeful Bodyguard
  'MS01-072', // Hanako Arasaka: Daughter of the Emperor
  'MS01-073', // Jackie Welles: Mama's Favorite
  'MS01-074', // Padre: Man of the Cross
  'MS01-075', // Panam Palmer: Nomad Cavalry
  'MS01-106', // Alt Cunningham: Soulkiller Architect
  'MS01-107', // Evelyn Parker: Beautiful Enigma
  'MS01-108', // Judy Álvarez: Braindance Maestro
  'MS01-109', // Sasha Yakovleva: Won't Let You Down
  'MS01-110', // Wakako Okada: Peace and Harmony
];

/**
 * Kickstarter / Wave 2 promo cards often collected with Beta Box fulfillment
 * (not sealed inside the Beta Box pack insert, but KS-adjacent chase cards).
 */
export const BETA_BOX_PROMO_IDS = [
  'N001', // Lucyna Kushinada: Fresh Beginnings (pre-launch foil Lucy)
  'PRM01-005', // Rebecca: Having a Moment
  'NIGHTCITYBRAWL-S1-00', // Minotaur (NCB Season 1 Nova · BRAWL ownership)
];

/** Six Beta Booster Display Nova Rare box toppers (alt-art · β001–β006). */
export const BOX_TOPPER_BETA_IDS = [
  'BOXTOPPERS-BETA-B001', // Yorinobu Arasaka: Embracing Destruction
  'BOXTOPPERS-BETA-B002', // Viktor Vektor: Sit Down and Relax
  'BOXTOPPERS-BETA-B003', // Goro Takemura: Hands Unclean
  'BOXTOPPERS-BETA-B004', // Saburo Arasaka: Stubborn Patriarch
  'BOXTOPPERS-BETA-B005', // Jackie Welles: Pour One Out For Me
  'BOXTOPPERS-BETA-B006', // V: Corporate Exile
];

/** Six retail Booster Display Nova Rare box toppers (001–006). */
export const BOX_TOPPER_RETAIL_IDS = [
  'BOXTOPPERS-RETAIL-001',
  'BOXTOPPERS-RETAIL-002',
  'BOXTOPPERS-RETAIL-003',
  'BOXTOPPERS-RETAIL-004',
  'BOXTOPPERS-RETAIL-005',
  'BOXTOPPERS-RETAIL-006',
];

/** All box-topper printings (Beta + Retail). */
export const BOX_TOPPER_IDS = [...BOX_TOPPER_BETA_IDS, ...BOX_TOPPER_RETAIL_IDS];

export function resolveCardIds(cards, ids) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}
