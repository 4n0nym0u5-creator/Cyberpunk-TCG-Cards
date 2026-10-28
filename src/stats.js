/** Max tracked copies per card (binder playset still fills from the first 3). */
export const MAX_COPIES = 25;
/** Binder playset pockets / “complete” threshold. */
export const BINDER_PLAYSET = 3;

export const COPY_SOURCES = ['beta', 'prerelease', 'retail'];
export const COPY_SOURCE_LABELS = {
  beta: 'β',
  prerelease: 'PR',
  retail: 'R',
};
export const COPY_SOURCE_TITLES = {
  beta: 'Beta collection',
  prerelease: 'Pre-release kit',
  retail: 'Retail booster',
};

export function normalizeCopySource(source) {
  return COPY_SOURCES.includes(source) ? source : 'beta';
}

export function sourceCopiesKey(source) {
  return `${normalizeCopySource(source)}_copies`;
}

function emptyOwn() {
  return {
    copies: 0,
    beta_copies: 0,
    prerelease_copies: 0,
    retail_copies: 0,
    iconic_copies: 0,
    bstamp_copies: 0,
    price_override_usd: null,
  };
}

function clampSourceTrio(beta, prerelease, retail) {
  let b = clampCopies(beta);
  let p = clampCopies(prerelease);
  let r = clampCopies(retail);
  let overflow = b + p + r - MAX_COPIES;
  if (overflow > 0) {
    const cutR = Math.min(r, overflow);
    r -= cutR;
    overflow -= cutR;
  }
  if (overflow > 0) {
    const cutP = Math.min(p, overflow);
    p -= cutP;
    overflow -= cutP;
  }
  if (overflow > 0) {
    b = Math.max(0, b - overflow);
  }
  return { beta_copies: b, prerelease_copies: p, retail_copies: r };
}

function withSources(own, sources) {
  const s = clampSourceTrio(
    sources.beta_copies,
    sources.prerelease_copies,
    sources.retail_copies,
  );
  return {
    ...own,
    ...s,
    copies: s.beta_copies + s.prerelease_copies + s.retail_copies,
  };
}

export function getOwn(ownership, cardId) {
  const raw = ownership[cardId];
  if (!raw) return emptyOwn();

  const hasSourceFields =
    raw.beta_copies != null ||
    raw.prerelease_copies != null ||
    raw.retail_copies != null;
  const sources = hasSourceFields
    ? clampSourceTrio(
        raw.beta_copies ?? 0,
        raw.prerelease_copies ?? 0,
        raw.retail_copies ?? 0,
      )
    : clampSourceTrio(raw.copies ?? 0, 0, 0);

  const bstampCopies =
    raw.bstamp_copies != null ? raw.bstamp_copies : raw.bstamp ? 1 : 0;
  const iconicCopies =
    raw.iconic_copies != null ? raw.iconic_copies : raw.iconic ? 1 : 0;
  return {
    copies: sources.beta_copies + sources.prerelease_copies + sources.retail_copies,
    ...sources,
    iconic_copies: iconicCopies ?? 0,
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

/** Decrease order for regular sources: preferred first, then beta → PR → retail. */
function decreaseSourceOrder(preferred) {
  const first = normalizeCopySource(preferred);
  return [first, ...COPY_SOURCES.filter((s) => s !== first)];
}

/** Set absolute count for one product source; total stays ≤ MAX_COPIES. */
export function withSourceCount(own, source, count) {
  const key = sourceCopiesKey(source);
  const next = {
    beta_copies: own?.beta_copies || 0,
    prerelease_copies: own?.prerelease_copies || 0,
    retail_copies: own?.retail_copies || 0,
    [key]: clampCopies(count),
  };
  return withSources(own || emptyOwn(), next);
}

/** Adjust one source by delta; keep sum ≤ MAX_COPIES. */
export function withSourceDelta(own, source, delta) {
  const key = sourceCopiesKey(source);
  const cur = own?.[key] || 0;
  const others =
    (own?.copies || 0) - cur;
  const room = Math.max(0, MAX_COPIES - others);
  const nextCount = Math.max(0, Math.min(room, cur + Number(delta || 0)));
  return withSourceCount(own, source, nextCount);
}

/**
 * Move regular total toward `target` using `defaultSource` for adds;
 * removes from default first, then beta → PR → retail.
 */
export function withRegularTotal(own, targetRaw, defaultSource = 'beta') {
  const base = own || emptyOwn();
  const target = clampCopies(targetRaw);
  let beta = base.beta_copies || 0;
  let prerelease = base.prerelease_copies || 0;
  let retail = base.retail_copies || 0;
  let total = beta + prerelease + retail;
  const preferred = normalizeCopySource(defaultSource);

  if (target > total) {
    let need = target - total;
    const bucket = { beta, prerelease, retail };
    const key = preferred;
    const room = MAX_COPIES - total;
    const add = Math.min(need, room);
    bucket[key] += add;
    return withSources(base, {
      beta_copies: bucket.beta,
      prerelease_copies: bucket.prerelease,
      retail_copies: bucket.retail,
    });
  }

  if (target < total) {
    let drop = total - target;
    const bucket = { beta, prerelease, retail };
    for (const src of decreaseSourceOrder(preferred)) {
      if (drop <= 0) break;
      const take = Math.min(bucket[src], drop);
      bucket[src] -= take;
      drop -= take;
    }
    return withSources(base, {
      beta_copies: bucket.beta,
      prerelease_copies: bucket.prerelease,
      retail_copies: bucket.retail,
    });
  }

  return withSources(base, {
    beta_copies: beta,
    prerelease_copies: prerelease,
    retail_copies: retail,
  });
}

/** Regular + B-stamp copies (binder playset / “owned base”). */
export function ownedBaseCount(own) {
  return Math.max(0, (own?.copies || 0) + (own?.bstamp_copies || 0));
}

export function ownedIconicCount(own) {
  return Math.max(0, own?.iconic_copies || 0);
}

function hasNonBetaSources(o) {
  return (o.prerelease_copies || 0) > 0 || (o.retail_copies || 0) > 0;
}

function formatSourceParts(o) {
  const parts = [];
  if ((o.beta_copies || 0) > 0) parts.push(`×${o.beta_copies}${COPY_SOURCE_LABELS.beta}`);
  if ((o.prerelease_copies || 0) > 0) {
    parts.push(`×${o.prerelease_copies}${COPY_SOURCE_LABELS.prerelease}`);
  }
  if ((o.retail_copies || 0) > 0) {
    parts.push(`×${o.retail_copies}${COPY_SOURCE_LABELS.retail}`);
  }
  return parts;
}

/** Compact ownership label e.g. "×1 · ×2B · ×1A" or "×2β · ×1PR · ×1R". */
export function formatOwnShort(own) {
  const o = own || {};
  const parts = [];
  if (hasNonBetaSources(o)) {
    parts.push(...formatSourceParts(o));
  } else if (o.copies > 0) {
    parts.push(`×${o.copies}`);
  }
  if (o.bstamp_copies > 0) parts.push(`×${o.bstamp_copies}B`);
  if (o.iconic_copies > 0) parts.push(`×${o.iconic_copies}A`);
  return parts.join(' · ') || '—';
}

/** Value-table style: "2/25 +2B +1A" or "2/25 (2β·1PR) +1A". */
export function formatOwnOwnedCell(own) {
  const o = own || {};
  let s = `${o.copies || 0}/${MAX_COPIES}`;
  if (hasNonBetaSources(o)) {
    const src = formatSourceParts(o).map((p) => p.replace(/^×/, '')).join('·');
    if (src) s += ` (${src})`;
  }
  if (o.bstamp_copies > 0) s += ` +${o.bstamp_copies}B`;
  if (o.iconic_copies > 0) s += ` +${o.iconic_copies}A`;
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
    if (c.has_iconic && ownedIconicCount(o) > 0) ownedIconic += 1;
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
  const iconicOwned = card.has_iconic ? ownedIconicCount(o) : 0;
  if (baseOwned <= 0 && iconicOwned <= 0) return 0;

  const p = pricesMap[card.id] || {};
  const baseUnit =
    o.price_override_usd != null ? Number(o.price_override_usd) : Number(p.base || 0);
  const iconicUnit = Number(p.iconic || 0);
  // B stamps use the same base/override unit until a B-stamp market feed exists.
  const baseMult = settings?.value_count_copies
    ? Math.max(baseOwned, 0)
    : baseOwned > 0
      ? 1
      : 0;
  const iconicMult = settings?.value_count_copies
    ? Math.max(iconicOwned, 0)
    : iconicOwned > 0
      ? 1
      : 0;

  let total = 0;
  if (baseOwned > 0) total += baseUnit * baseMult;
  if (iconicOwned > 0) total += iconicUnit * iconicMult;
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
      if (c.has_iconic && ownedIconicCount(o) > 0) iconicOwned += 1;
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
    if (c.has_iconic && ownedIconicCount(o) > 0) iconicOwned += 1;
  }
  const streetIconics = cards.filter(
    (c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.has_iconic,
  );
  let streetIconicOwned = 0;
  for (const c of streetIconics) {
    if (ownedIconicCount(getOwn(ownership, c.id)) > 0) streetIconicOwned += 1;
  }
  // Vault extras = all showcase (Legends + Units/promos at the back).
  const extras = cards.filter((c) => c.set_code === 'showcase');
  let extrasOwned = 0;
  let extrasIconicTotal = 0;
  let extrasIconicOwned = 0;
  for (const c of extras) {
    const o = getOwn(ownership, c.id);
    if (ownedBaseCount(o) > 0) extrasOwned += 1;
    if (c.has_iconic) {
      extrasIconicTotal += 1;
      if (ownedIconicCount(o) > 0) extrasIconicOwned += 1;
    }
  }
  // Mantis Blades (street B-stamp) — 3 Vault pockets after Saburo.
  const streetBstamps = cards.filter(
    (c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.has_bstamp,
  );
  let mantisBSlots = 0;
  let mantisBOwned = 0;
  for (const c of streetBstamps) {
    const o = getOwn(ownership, c.id);
    mantisBSlots += 3;
    mantisBOwned += Math.min(3, Math.max(0, o.bstamp_copies || 0));
  }
  const legendPockets = baseSlots + legends.length; // e.g. 63 + 21 = 84 with Streetkid a/b
  const legendFilled = baseOwned + iconicOwned;
  const extrasPockets = extras.length + extrasIconicTotal; // base + A when present
  const vaultPockets =
    legendPockets + streetIconics.length + extrasPockets + mantisBSlots;
  const vaultFilled =
    legendFilled +
    streetIconicOwned +
    extrasOwned +
    extrasIconicOwned +
    mantisBOwned;
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
    mantisBSlots,
    mantisBOwned,
    vaultCapacity: 144,
  };
}

/** Home binder: Legends + all showcase → Vault; MS01 Units/Gear/Programs → Street. */
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
