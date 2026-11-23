/**
 * Showcase promos / exclusives (set_code showcase) — KS Lucy & Rebecca,
 * Judge stamped Units, and starter-deck exclusives. Not MS01 or NCB.
 */

/** @typedef {'ks' | 'judge' | 'starter'} PromoGroup */

export const PROMO_GROUP_LABELS = {
  ks: 'Kickstarter / box toppers',
  judge: 'Judge promos',
  starter: 'Starter exclusives',
};

export function isPromoCard(cardOrId) {
  if (typeof cardOrId === 'string') {
    return (
      cardOrId.startsWith('N001') ||
      cardOrId.startsWith('PRM') ||
      cardOrId.startsWith('JUDGEPROMO') ||
      cardOrId.startsWith('SD0')
    );
  }
  return cardOrId?.set_code === 'showcase';
}

/** @returns {PromoGroup} */
export function promoGroup(card) {
  const id = card?.id || '';
  if (id.startsWith('JUDGEPROMO')) return 'judge';
  if (id.startsWith('SD0')) return 'starter';
  return 'ks';
}

export function listPromoCards(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export function promoProgress(cards, ownership, ownedBaseCount, getOwn) {
  const list = listPromoCards(cards);
  let owned = 0;
  for (const c of list) {
    if (ownedBaseCount(getOwn(ownership, c.id)) > 0) owned += 1;
  }
  return { owned, total: list.length, cards: list };
}
