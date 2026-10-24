/** Max tracked copies per card (binder playset still fills from the first 3). */
export const MAX_COPIES = 10;
/** Binder playset pockets / “complete” threshold. */
export const BINDER_PLAYSET = 3;

export function getOwn(ownership, cardId) {
  const raw = ownership[cardId];
  if (!raw) {
    return {
      copies: 0,
      iconic: false,
      bstamp_copies: 0,
      price_override_usd: null,
    };
  }
  const bstampCopies =
    raw.bstamp_copies != null ? raw.bstamp_copies : raw.bstamp ? 1 : 0;
  return {
    copies: raw.copies ?? 0,
    iconic: Boolean(raw.iconic),
    bstamp_copies: bstampCopies ?? 0,
    price_override_usd:
      raw.price_override_usd === undefined ? null : raw.price_override_usd,
  };
}

export function clampCopies(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_COPIES, Math.trunc(v)));
}

/** Regular + B-stamp copies (binder playset / “owned base”). */
export function ownedBaseCount(own) {
  return Math.max(0, (own?.copies || 0) + (own?.bstamp_copies || 0));
}

/** Compact ownership label e.g. "×1 · ×2B · A". */
export function formatOwnShort(own) {
  const o = own || {};
  const parts = [];
  if (o.copies > 0) parts.push(`×${o.copies}`);
  if (o.bstamp_copies > 0) parts.push(`×${o.bstamp_copies}B`);
  if (o.iconic) parts.push('A');
  return parts.join(' · ') || '—';
}

/** Value-table style: "2/10 +2B +A". */
export function formatOwnOwnedCell(own) {
  const o = own || {};
  let s = `${o.copies || 0}/${MAX_COPIES}`;
  if (o.bstamp_copies > 0) s += ` +${o.bstamp_copies}B`;
  if (o.iconic) s += ' +A';
  return s;
}

/** Group cards by illustrator credit (null/blank → Unknown). */
export function listArtists(cards) {
  const map = new Map();
  for (const c of cards) {
    const name = (c.artist && String(c.artist).trim()) || 'Unknown';
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(c);
  }
  return [...map.entries()]
    .map(([name, list]) => ({
      name,
      cards: list.slice().sort((a, b) => a.sort_order - b.sort_order),
      count: list.length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function cardsByArtist(cards, artist) {
  const key = (artist && String(artist).trim()) || 'Unknown';
  return cards
    .filter((c) => ((c.artist && String(c.artist).trim()) || 'Unknown') === key)
    .sort((a, b) => a.sort_order - b.sort_order);
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
    if (ownedBaseCount(o) > 0) ownedBase += 1;
    if (c.has_iconic && o.iconic) ownedIconic += 1;
  }

  for (const c of pool) {
    const o = getOwn(ownership, c.id);
    if (ownedBaseCount(o) > 0) ownedEverything += 1;
  }

  const missing = ms01.filter((c) => ownedBaseCount(getOwn(ownership, c.id)) === 0);

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
  const baseOwned = ownedBaseCount(o);
  if (baseOwned <= 0 && !o.iconic) return 0;

  const p = pricesMap[card.id] || {};
  const baseUnit =
    o.price_override_usd != null ? Number(o.price_override_usd) : Number(p.base || 0);
  const iconicUnit = Number(p.iconic || 0);
  // B stamps use the same base/override unit until a B-stamp market feed exists.
  const mult = settings?.value_count_copies
    ? Math.max(baseOwned, 0)
    : baseOwned > 0
      ? 1
      : 0;

  let total = 0;
  if (baseOwned > 0) total += baseUnit * mult;
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
  // Prefer next missing Street card; fall back to missing Legend for Vault.
  const street = cards
    .filter((c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.sheet != null)
    .sort((a, b) => a.sort_order - b.sort_order);
  const missingStreet = street.find(
    (c) => ownedBaseCount(getOwn(ownership, c.id)) === 0,
  );
  if (missingStreet) return missingStreet;
  const legends = cards
    .filter((c) => c.set_code === 'MS01' && c.type === 'Legend')
    .sort((a, b) => a.sort_order - b.sort_order);
  return legends.find((c) => ownedBaseCount(getOwn(ownership, c.id)) === 0) || null;
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
      if (ownedBaseCount(o) > 0) owned += 1;
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

/** Vault: Legend playsets + every MS01 Iconic A + showcase extras. */
export function computeVaultProgress(cards, ownership) {
  const legends = cards
    .filter((c) => c.set_code === 'MS01' && c.type === 'Legend')
    .sort((a, b) => a.sort_order - b.sort_order);
  let baseSlots = 0;
  let baseOwned = 0;
  let iconicOwned = 0;
  for (const c of legends) {
    const o = getOwn(ownership, c.id);
    baseSlots += 3;
    baseOwned += Math.min(3, Math.max(0, ownedBaseCount(o)));
    if (c.has_iconic && o.iconic) iconicOwned += 1;
  }
  const streetIconics = cards.filter(
    (c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.has_iconic,
  );
  let streetIconicOwned = 0;
  for (const c of streetIconics) {
    if (getOwn(ownership, c.id).iconic) streetIconicOwned += 1;
  }
  const extras = cards.filter((c) => c.set_code === 'showcase');
  let extrasOwned = 0;
  let extrasIconicTotal = 0;
  let extrasIconicOwned = 0;
  for (const c of extras) {
    const o = getOwn(ownership, c.id);
    if (ownedBaseCount(o) > 0) extrasOwned += 1;
    if (c.has_iconic) {
      extrasIconicTotal += 1;
      if (o.iconic) extrasIconicOwned += 1;
    }
  }
  const legendPockets = baseSlots + legends.length; // e.g. 63 + 21 = 84 with Streetkid a/b
  const legendFilled = baseOwned + iconicOwned;
  const extrasPockets = extras.length + extrasIconicTotal; // base + A when present
  const vaultPockets = legendPockets + streetIconics.length + extrasPockets;
  const vaultFilled = legendFilled + streetIconicOwned + extrasOwned + extrasIconicOwned;
  return {
    legendTotal: legends.length,
    baseSlots,
    baseOwned,
    iconicTotal: legends.length,
    iconicOwned,
    legendPockets,
    legendFilled,
    legendPct: legendPockets ? Math.round((legendFilled / legendPockets) * 100) : 0,
    streetIconicTotal: streetIconics.length,
    streetIconicOwned,
    vaultPockets,
    vaultFilled,
    vaultPct: vaultPockets ? Math.round((vaultFilled / vaultPockets) * 100) : 0,
    extrasTotal: extras.length,
    extrasOwned,
    extrasIconicTotal,
    extrasIconicOwned,
    extrasPockets,
    vaultCapacity: 144,
  };
}

/** Home binder for a card. */
export function cardHome(card) {
  if (card?.type === 'Legend' || card?.set_code === 'showcase') return 'vault';
  return 'street';
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
