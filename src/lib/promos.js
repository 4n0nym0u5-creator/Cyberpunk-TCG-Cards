/**
 * Showcase promos / exclusives (set_code showcase) — KS Lucy & Rebecca,
 * Beta/Retail box-topper Nova Rares, Judge stamps, starter-deck exclusives.
 * Not MS01 or NCB (Minotaur lives under Brawl).
 */

/** @typedef {'ks' | 'topper_beta' | 'topper_retail' | 'judge' | 'starter'} PromoGroup */

export const PROMO_GROUP_LABELS = {
  ks: 'Kickstarter / Set 1 promos',
  topper_beta: 'Beta box toppers',
  topper_retail: 'Retail box toppers',
  judge: 'Judge promos',
  starter: 'Starter exclusives',
};

export const PROMO_GROUP_ORDER = [
  'ks',
  'topper_beta',
  'topper_retail',
  'judge',
  'starter',
];

export function isPromoCard(cardOrId) {
  if (typeof cardOrId === 'string') {
    return (
      cardOrId.startsWith('N001') ||
      cardOrId.startsWith('PRM') ||
      cardOrId.startsWith('BOXTOPPERS') ||
      cardOrId.startsWith('JUDGEPROMO') ||
      cardOrId.startsWith('SD0')
    );
  }
  return cardOrId?.set_code === 'showcase';
}

/** @returns {PromoGroup} */
export function promoGroup(card) {
  const id = card?.id || '';
  if (id.startsWith('BOXTOPPERS-BETA')) return 'topper_beta';
  if (id.startsWith('BOXTOPPERS-RETAIL')) return 'topper_retail';
  if (id.startsWith('JUDGEPROMO')) return 'judge';
  if (id.startsWith('SD0')) return 'starter';
  return 'ks';
}

export function listPromoCards(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/** `isOwned(own, card)` — typically `ownsCard` so Iconic-only toppers count. */
export function promoProgress(cards, ownership, isOwned, getOwn) {
  const list = listPromoCards(cards);
  let owned = 0;
  for (const c of list) {
    if (isOwned(getOwn(ownership, c.id), c)) owned += 1;
  }
  return { owned, total: list.length, cards: list };
}
