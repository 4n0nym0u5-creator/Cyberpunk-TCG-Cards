export function getOwn(ownership, cardId) {
  return ownership[cardId] || { copies: 0, iconic: false, price_override_usd: null };
}

export function computeProgress(cards, ownership, settings) {
  const mode = settings?.completion_mode || 'ms01';
  const pool =
    mode === 'everything_beta'
      ? cards
      : cards.filter((c) => c.set_code === 'MS01');

  const ms01 = cards.filter((c) => c.set_code === 'MS01');
  const iconicPool = ms01.filter((c) => c.has_iconic);

  let ownedBase = 0;
  let ownedIconic = 0;
  let ownedEverything = 0;

  for (const c of ms01) {
    const o = getOwn(ownership, c.id);
    if (o.copies > 0) ownedBase += 1;
    if (c.has_iconic && o.iconic) ownedIconic += 1;
  }

  for (const c of pool) {
    const o = getOwn(ownership, c.id);
    if (o.copies > 0) ownedEverything += 1;
  }

  const missing = ms01.filter((c) => getOwn(ownership, c.id).copies === 0);

  return {
    ms01Total: ms01.length,
    ms01Owned: ownedBase,
    iconicTotal: iconicPool.length,
    iconicOwned: ownedIconic,
    everythingTotal: pool.length,
    everythingOwned: ownedEverything,
    missing,
    setTotal: ms01.length + iconicPool.length,
    setOwned: ownedBase + ownedIconic,
  };
}

export function cardMarketUsd(card, ownership, pricesMap, settings) {
  const o = getOwn(ownership, card.id);
  if (o.copies <= 0 && !o.iconic) return 0;

  const p = pricesMap[card.id] || {};
  const baseUnit =
    o.price_override_usd != null ? Number(o.price_override_usd) : Number(p.base || 0);
  const iconicUnit = Number(p.iconic || 0);
  const mult = settings?.value_count_copies ? Math.max(o.copies, 0) : o.copies > 0 ? 1 : 0;

  let total = 0;
  if (o.copies > 0) total += baseUnit * mult;
  if (card.has_iconic && o.iconic) total += iconicUnit;
  return total;
}

export function computeValue(cards, ownership, pricesMap, settings) {
  let total = 0;
  let priced = 0;
  const lines = [];

  for (const c of cards) {
    const v = cardMarketUsd(c, ownership, pricesMap, settings);
    if (v > 0) {
      total += v;
      priced += 1;
      lines.push({ card: c, value: v, own: getOwn(ownership, c.id) });
    }
  }

  lines.sort((a, b) => b.value - a.value);
  return { total, priced, lines };
}

export function nextEmptySlot(cards, ownership) {
  const ms01 = cards
    .filter((c) => c.set_code === 'MS01' && c.sheet != null)
    .sort((a, b) => a.sort_order - b.sort_order);
  return ms01.find((c) => getOwn(ownership, c.id).copies === 0) || null;
}

const BAND_ORDER = [
  { id: 'red', label: 'Red', range: '001–035' },
  { id: 'yellow', label: 'Yellow', range: '036–070' },
  { id: 'green', label: 'Green', range: '071–105' },
  { id: 'blue', label: 'Blue', range: '106–140' },
];

/** Per colour-tree band: base owned (≥1 copy) and Iconic A owned. */
export function computeBandProgress(cards, ownership) {
  return BAND_ORDER.map((meta) => {
    const pool = cards.filter((c) => c.set_code === 'MS01' && c.band === meta.id);
    const iconicPool = pool.filter((c) => c.has_iconic);
    let owned = 0;
    let iconicOwned = 0;
    for (const c of pool) {
      const o = getOwn(ownership, c.id);
      if (o.copies > 0) owned += 1;
      if (c.has_iconic && o.iconic) iconicOwned += 1;
    }
    return {
      ...meta,
      total: pool.length,
      owned,
      pct: pool.length ? Math.round((owned / pool.length) * 100) : 0,
      iconicTotal: iconicPool.length,
      iconicOwned,
      iconicPct: iconicPool.length
        ? Math.round((iconicOwned / iconicPool.length) * 100)
        : 0,
    };
  });
}

/** MS01 cards that have an Iconic alt, collector order. */
export function listIconicCards(cards) {
  return cards
    .filter((c) => c.set_code === 'MS01' && c.has_iconic)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function formatUsd(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n || 0);
}

export function slotLabel(card) {
  if (!card.zone || card.sheet == null) return '—';
  const z = `${card.zone}${String(card.zone_slot ?? '').padStart(2, '0')}`;
  if (!card.face || !card.row_pos) return z;
  return `${z} s${card.sheet}${card.face}${card.row_pos}`;
}
