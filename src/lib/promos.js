/**
 * Showcase extras gallery — KS Lucy & Rebecca, Beta/Retail box-topper Nova Rares,
 * Judge stamps, starter-deck exclusives, and Night City Brawl Season 1.
 * Not MS01 (Legends live under Legends / Vault).
 */

import { ownsCard } from '../stats.js';
import {
  isNcbCard,
  listNcbCards,
  ownedBrawlLaneCount,
} from './nightCityBrawl.js';

/** @typedef {'ks' | 'topper_beta' | 'topper_retail' | 'judge' | 'starter' | 'brawl'} PromoGroup */

export const PROMO_GROUP_LABELS = {
  ks: 'Kickstarter / Set 1 promos',
  topper_beta: 'Beta box toppers',
  topper_retail: 'Retail box toppers',
  judge: 'Judge promos',
  starter: 'Starter exclusives',
  brawl: 'Night City Brawl · Season 1',
};

export const PROMO_GROUP_ORDER = [
  'ks',
  'topper_beta',
  'topper_retail',
  'judge',
  'starter',
  'brawl',
];

export function isPromoCard(cardOrId) {
  if (typeof cardOrId === 'string') {
    return (
      cardOrId.startsWith('N001') ||
      cardOrId.startsWith('PRM') ||
      cardOrId.startsWith('BOXTOPPERS') ||
      cardOrId.startsWith('JUDGEPROMO') ||
      cardOrId.startsWith('SD0') ||
      cardOrId.startsWith('NIGHTCITYBRAWL')
    );
  }
  return cardOrId?.set_code === 'showcase' || cardOrId?.set_code === 'NCB';
}

/** @returns {PromoGroup} */
export function promoGroup(card) {
  const id = card?.id || '';
  if (isNcbCard(card) || card?.set_code === 'NCB') return 'brawl';
  if (id.startsWith('BOXTOPPERS-BETA')) return 'topper_beta';
  if (id.startsWith('BOXTOPPERS-RETAIL')) return 'topper_retail';
  if (id.startsWith('JUDGEPROMO')) return 'judge';
  if (id.startsWith('SD0')) return 'starter';
  return 'ks';
}

/** Showcase exclusives only (no NCB). */
export function listShowcasePromoCards(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/** Full Promos gallery pool: showcase + Night City Brawl. */
export function listPromoCards(cards) {
  return [...listShowcasePromoCards(cards), ...listNcbCards(cards)];
}

/** Brawl uses BRAWL/CHAMP/JUDGE lanes; showcase uses β/R (+ Iconic). */
export function promoOwned(own, card) {
  if (promoGroup(card) === 'brawl') return ownedBrawlLaneCount(own) > 0;
  return ownsCard(own, card);
}

export function promoProgress(cards, ownership, getOwn) {
  const list = listPromoCards(cards);
  let owned = 0;
  for (const c of list) {
    if (promoOwned(getOwn(ownership, c.id), c)) owned += 1;
  }
  return { owned, total: list.length, cards: list };
}
