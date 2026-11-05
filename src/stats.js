import { BETA_BOX_PROMO_IDS } from './lib/betaBox.js';

/** Max tracked copies per card (binder playset still fills from the first 3). */
export const MAX_COPIES = 25;
/** Binder playset pockets / “complete” threshold. */
export const BINDER_PLAYSET = 3;

export const COPY_SOURCES = ['beta', 'retail'];
export const COPY_SOURCE_LABELS = {
  beta: 'β',
  retail: 'R',
};
export const COPY_SOURCE_TITLES = {
  beta: 'Beta collection',
  retail: 'Retail / kit',
};
/** Longer hover copy for card-view source steppers. */
export const COPY_SOURCE_HINTS = {
  beta: 'Beta collection — Welcome to Night City Beta printings. Counts toward binder playset.',
  retail:
    'Retail / kit — normal MS01 printings from retail packs or Pre-release kit boosters (not the WTNC Nova Rare W stamp). Counts toward Street/Legend regular playset.',
};

/** Iconic print sources (Aβ / AR), mirrored from β / R. */
export const ICONIC_SOURCES = ['beta', 'retail'];
export const ICONIC_SOURCE_LABELS = {
  beta: 'Aβ',
  retail: 'AR',
};
export const ICONIC_SOURCE_TITLES = {
  beta: 'Beta Iconic A',
  retail: 'Retail Iconic A',
};
export const ICONIC_SOURCE_HINTS = {
  beta: 'Beta Iconic A — alternate art from Welcome to Night City Beta. Separate from regular β copies; has its own binder pocket.',
  retail:
    'Retail Iconic A — alternate art from retail / kit printings. Separate from regular R copies; shares the Iconic binder pocket with Aβ.',
};

export function normalizeCopySource(source) {
  // Legacy 'prerelease' folded into retail (kit packs are not unique printings).
  if (source === 'prerelease') return 'retail';
  return COPY_SOURCES.includes(source) ? source : 'beta';
}

export function normalizeIconicSource(source) {
  return ICONIC_SOURCES.includes(source) ? source : 'beta';
}

export function sourceCopiesKey(source) {
  return `${normalizeCopySource(source)}_copies`;
}

export function iconicSourceCopiesKey(source) {
  return `${normalizeIconicSource(source)}_iconic_copies`;
}

function emptyOwn() {
  return {
    copies: 0,
    beta_copies: 0,
    prerelease_copies: 0,
    retail_copies: 0,
    iconic_copies: 0,
    beta_iconic_copies: 0,
    retail_iconic_copies: 0,
    bstamp_copies: 0,
    prstamp_copies: 0,
    price_override_usd: null,
  };
}

/** Cap beta iconic + retail iconic ≤ MAX_COPIES. */
function clampIconicPair(betaIconic, retailIconic) {
  let b = clampCopies(betaIconic);
  let r = clampCopies(retailIconic);
  let overflow = b + r - MAX_COPIES;
  if (overflow > 0) {
    const cutR = Math.min(r, overflow);
    r -= cutR;
    overflow -= cutR;
  }
  if (overflow > 0) {
    b = Math.max(0, b - overflow);
  }
  return {
    beta_iconic_copies: b,
    retail_iconic_copies: r,
    iconic_copies: b + r,
  };
}

/** Cap beta + retail ≤ MAX_COPIES. Legacy PR counts are folded into retail first. */
function clampSourcePair(beta, retail, legacyPrerelease = 0) {
  let b = clampCopies(beta);
  let r = clampCopies(clampCopies(retail) + clampCopies(legacyPrerelease));
  let overflow = b + r - MAX_COPIES;
  if (overflow > 0) {
    const cutR = Math.min(r, overflow);
    r -= cutR;
    overflow -= cutR;
  }
  if (overflow > 0) {
    b = Math.max(0, b - overflow);
  }
  return { beta_copies: b, prerelease_copies: 0, retail_copies: r };
}

function withSources(own, sources) {
  const s = clampSourcePair(
    sources.beta_copies,
    sources.retail_copies,
    sources.prerelease_copies,
  );
  return {
    ...own,
    ...s,
    copies: s.beta_copies + s.retail_copies,
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
    ? clampSourcePair(
        raw.beta_copies ?? 0,
        raw.retail_copies ?? 0,
        raw.prerelease_copies ?? 0,
      )
    : clampSourcePair(raw.copies ?? 0, 0, 0);

  const bstampCopies =
    raw.bstamp_copies != null ? raw.bstamp_copies : raw.bstamp ? 1 : 0;
  const prstampCopies = raw.prstamp_copies != null ? raw.prstamp_copies : 0;
  const legacyIconic =
    raw.iconic_copies != null ? raw.iconic_copies : raw.iconic ? 1 : 0;
  const hasIconicSources =
    raw.beta_iconic_copies != null || raw.retail_iconic_copies != null;
  const iconicSources = hasIconicSources
    ? clampIconicPair(raw.beta_iconic_copies ?? 0, raw.retail_iconic_copies ?? 0)
    : clampIconicPair(legacyIconic ?? 0, 0);
  return {
    copies: sources.beta_copies + sources.retail_copies,
    ...sources,
    ...iconicSources,
    bstamp_copies: bstampCopies ?? 0,
    prstamp_copies: prstampCopies ?? 0,
    price_override_usd:
      raw.price_override_usd === undefined ? null : raw.price_override_usd,
  };
}

export function clampCopies(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_COPIES, Math.trunc(v)));
}

/** Decrease order for regular sources: preferred first, then the other. */
function decreaseSourceOrder(preferred) {
  const first = normalizeCopySource(preferred);
  return [first, ...COPY_SOURCES.filter((s) => s !== first)];
}

/** Set absolute count for one product source; total stays ≤ MAX_COPIES. */
export function withSourceCount(own, source, count) {
  const key = sourceCopiesKey(source);
  const next = {
    beta_copies: own?.beta_copies || 0,
    prerelease_copies: 0,
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

/** Set absolute count for one Iconic source; Aβ+AR stays ≤ MAX_COPIES. */
export function withIconicSourceCount(own, source, count) {
  const key = iconicSourceCopiesKey(source);
  const base = own || emptyOwn();
  const next = clampIconicPair(
    key === 'beta_iconic_copies' ? count : base.beta_iconic_copies || 0,
    key === 'retail_iconic_copies' ? count : base.retail_iconic_copies || 0,
  );
  return { ...base, ...next };
}

/** Adjust one Iconic source by delta; keep Aβ+AR ≤ MAX_COPIES. */
export function withIconicSourceDelta(own, source, delta) {
  const key = iconicSourceCopiesKey(source);
  const base = own || emptyOwn();
  const cur = base[key] || 0;
  const others = (base.iconic_copies || 0) - cur;
  const room = Math.max(0, MAX_COPIES - others);
  const nextCount = Math.max(0, Math.min(room, cur + Number(delta || 0)));
  return withIconicSourceCount(base, source, nextCount);
}

/**
 * Move regular total toward `target` using `defaultSource` for adds;
 * removes from default first, then beta → retail.
 */
export function withRegularTotal(own, targetRaw, defaultSource = 'beta') {
  const base = own || emptyOwn();
  const target = clampCopies(targetRaw);
  let beta = base.beta_copies || 0;
  let retail = base.retail_copies || 0;
  let total = beta + retail;
  const preferred = normalizeCopySource(defaultSource);

  if (target > total) {
    const bucket = { beta, retail };
    const room = MAX_COPIES - total;
    const add = Math.min(target - total, room);
    bucket[preferred] += add;
    return withSources(base, {
      beta_copies: bucket.beta,
      prerelease_copies: 0,
      retail_copies: bucket.retail,
    });
  }

  if (target < total) {
    let drop = total - target;
    const bucket = { beta, retail };
    for (const src of decreaseSourceOrder(preferred)) {
      if (drop <= 0) break;
      const take = Math.min(bucket[src], drop);
      bucket[src] -= take;
      drop -= take;
    }
    return withSources(base, {
      beta_copies: bucket.beta,
      prerelease_copies: 0,
      retail_copies: bucket.retail,
    });
  }

  return withSources(base, {
    beta_copies: beta,
    prerelease_copies: 0,
    retail_copies: retail,
  });
}

/** Regular + B-stamp + WTNC W-stamp copies (binder playset / “owned base”). */
export function ownedBaseCount(own) {
  return Math.max(
    0,
    (own?.copies || 0) + (own?.bstamp_copies || 0) + (own?.prstamp_copies || 0),
  );
}

export function ownedIconicCount(own) {
  const o = own || emptyOwn();
  if (o.beta_iconic_copies != null || o.retail_iconic_copies != null) {
    return Math.max(
      0,
      (o.beta_iconic_copies || 0) + (o.retail_iconic_copies || 0),
    );
  }
  return Math.max(0, o.iconic_copies || 0);
}

export const WANTED_EDITIONS = [
  'beta',
  'retail',
  'beta_iconic',
  'retail_iconic',
  'bstamp',
  'prstamp',
  'ks_promo',
];
export const WANTED_EDITION_LABELS = {
  beta: 'β',
  retail: 'R',
  beta_iconic: 'Aβ',
  retail_iconic: 'AR',
  bstamp: 'B',
  prstamp: 'W',
  ks_promo: 'KS',
};
export const WANTED_EDITION_TITLES = {
  beta: 'Beta collection',
  retail: 'Retail / kit',
  beta_iconic: 'Beta Iconic A',
  retail_iconic: 'Retail Iconic A',
  bstamp: 'Beta Event Nova Rare B-stamp',
  prstamp: 'Pre-release WTNC 2026 W-stamp',
  ks_promo: 'Kickstarter promo',
};

const WANTED_EDITION_ORDER = {
  beta: 0,
  retail: 1,
  beta_iconic: 2,
  retail_iconic: 3,
  bstamp: 4,
  prstamp: 5,
  ks_promo: 6,
};

const KS_PROMO_IDS = new Set(BETA_BOX_PROMO_IDS);

export function isKsPromoCard(card) {
  return Boolean(card?.id && KS_PROMO_IDS.has(card.id));
}

/**
 * Per-edition shortfalls. `threshold` is exclusive — count < threshold counts as wanted
 * (1 = missing, 3 = under playset, 6 = under six).
 */
export function editionGaps(own, card = null, { threshold = 1 } = {}) {
  const o = own || emptyOwn();
  const t = Math.max(1, Number(threshold) || 1);
  const hasIconic = Boolean(card?.has_iconic);
  const ks = isKsPromoCard(card);
  return {
    // KS promos use the dedicated KS lane instead of β/R clutter
    beta: !ks && (o.beta_copies || 0) < t,
    retail: !ks && (o.retail_copies || 0) < t,
    beta_iconic: hasIconic && (o.beta_iconic_copies || 0) < t,
    retail_iconic: hasIconic && (o.retail_iconic_copies || 0) < t,
    bstamp: Boolean(card?.has_bstamp) && (o.bstamp_copies || 0) < t,
    prstamp: Boolean(card?.has_prstamp) && (o.prstamp_copies || 0) < t,
    ks_promo: ks && (o.beta_copies || 0) + (o.retail_copies || 0) < t,
  };
}

/**
 * One row per shortfall: { card, edition, own }.
 * Pool = completion_mode pool, always including Kickstarter promo cards.
 */
export function computeWanted(cards, ownership, settings, { threshold = 1 } = {}) {
  const mode = settings?.completion_mode || 'ms01';
  const basePool =
    mode === 'everything_beta'
      ? cards
      : cards.filter((c) => c.set_code === 'MS01');
  const byId = new Map(basePool.map((c) => [c.id, c]));
  for (const c of cards) {
    if (isKsPromoCard(c)) byId.set(c.id, c);
  }
  const pool = [...byId.values()];

  const rows = [];
  for (const card of pool) {
    const own = getOwn(ownership, card.id);
    const gaps = editionGaps(own, card, { threshold });
    for (const edition of WANTED_EDITIONS) {
      if (gaps[edition]) rows.push({ card, edition, own });
    }
  }
  rows.sort((a, b) => {
    const so = (a.card.sort_order ?? 0) - (b.card.sort_order ?? 0);
    if (so !== 0) return so;
    return (WANTED_EDITION_ORDER[a.edition] ?? 9) - (WANTED_EDITION_ORDER[b.edition] ?? 9);
  });
  return rows;
}

function hasNonBetaSources(o) {
  return (o.retail_copies || 0) > 0;
}

function formatSourceParts(o) {
  const parts = [];
  if ((o.beta_copies || 0) > 0) parts.push(`×${o.beta_copies}${COPY_SOURCE_LABELS.beta}`);
  if ((o.retail_copies || 0) > 0) {
    parts.push(`×${o.retail_copies}${COPY_SOURCE_LABELS.retail}`);
  }
  return parts;
}

/** Compact ownership label e.g. "×1 · ×2B · ×1A" or "×2β · ×1R". */
export function formatOwnShort(own) {
  const o = own || {};
  const parts = [];
  if (hasNonBetaSources(o)) {
    parts.push(...formatSourceParts(o));
  } else if (o.copies > 0) {
    parts.push(`×${o.copies}`);
  }
  if (o.bstamp_copies > 0) parts.push(`×${o.bstamp_copies}B`);
  if (o.prstamp_copies > 0) parts.push(`×${o.prstamp_copies}W`);
  if ((o.beta_iconic_copies || 0) > 0 || (o.retail_iconic_copies || 0) > 0) {
    if ((o.beta_iconic_copies || 0) > 0) {
      parts.push(`×${o.beta_iconic_copies}${ICONIC_SOURCE_LABELS.beta}`);
    }
    if ((o.retail_iconic_copies || 0) > 0) {
      parts.push(`×${o.retail_iconic_copies}${ICONIC_SOURCE_LABELS.retail}`);
    }
  } else if (o.iconic_copies > 0) {
    parts.push(`×${o.iconic_copies}A`);
  }
  return parts.join(' · ') || '—';
}

/** Value-table style: "2/25 +2B +1A" or "2/25 (2β·1R) +1A". */
export function formatOwnOwnedCell(own) {
  const o = own || {};
  let s = `${o.copies || 0}/${MAX_COPIES}`;
  if (hasNonBetaSources(o)) {
    const src = formatSourceParts(o).map((p) => p.replace(/^×/, '')).join('·');
    if (src) s += ` (${src})`;
  }
  if (o.bstamp_copies > 0) s += ` +${o.bstamp_copies}B`;
  if (o.prstamp_copies > 0) s += ` +${o.prstamp_copies}W`;
  if ((o.beta_iconic_copies || 0) > 0) {
    s += ` +${o.beta_iconic_copies}${ICONIC_SOURCE_LABELS.beta}`;
  }
  if ((o.retail_iconic_copies || 0) > 0) {
    s += ` +${o.retail_iconic_copies}${ICONIC_SOURCE_LABELS.retail}`;
  } else if (
    !(o.beta_iconic_copies || 0) &&
    (o.iconic_copies || 0) > 0
  ) {
    s += ` +${o.iconic_copies}A`;
  }
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

/** Physical pieces owned (regular + B/W stamps + Iconic A) and unique identities. */
export function computeCollectionCount(cards, ownership) {
  let copies = 0;
  let uniqueOwned = 0;
  for (const c of cards) {
    const o = getOwn(ownership, c.id);
    const base = ownedBaseCount(o);
    const iconic = c.has_iconic ? ownedIconicCount(o) : 0;
    copies += base + iconic;
    if (base > 0 || iconic > 0) uniqueOwned += 1;
  }
  return {
    copies,
    uniqueOwned,
    uniqueTotal: cards.length,
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
  // B / W stamps use the same base/override unit until separate stamp market feeds exist.
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
  // Gorilla Arms (street WTNC W-stamp) — 3 Vault pockets after Mantis B.
  const streetPrstamps = cards.filter(
    (c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.has_prstamp,
  );
  let gorillaWSlots = 0;
  let gorillaWOwned = 0;
  for (const c of streetPrstamps) {
    const o = getOwn(ownership, c.id);
    gorillaWSlots += 3;
    gorillaWOwned += Math.min(3, Math.max(0, o.prstamp_copies || 0));
  }
  const legendPockets = baseSlots + legends.length; // e.g. 63 + 21 = 84 with Streetkid a/b
  const legendFilled = baseOwned + iconicOwned;
  const extrasPockets = extras.length + extrasIconicTotal; // base + A when present
  const vaultPockets =
    legendPockets +
    streetIconics.length +
    extrasPockets +
    mantisBSlots +
    gorillaWSlots;
  const vaultFilled =
    legendFilled +
    streetIconicOwned +
    extrasOwned +
    extrasIconicOwned +
    mantisBOwned +
    gorillaWOwned;
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
    gorillaWSlots,
    gorillaWOwned,
    vaultCapacity: 144,
  };
}

/** Home binder: Legends + all showcase → Vault; MS01 Units/Gear/Programs → Street. */
export function cardHome(card) {
  if (card?.type === 'Legend' || card?.set_code === 'showcase') return 'vault';
  return 'street';
}

export const DISPLAY_CURRENCIES = ['USD', 'AUD'];

export function normalizeDisplayCurrency(code) {
  return code === 'AUD' ? 'AUD' : 'USD';
}

/** Convert a USD market amount into the chosen display currency. */
export function convertFromUsd(usdAmount, currency = 'USD', usdToAud = 1) {
  const n = Number(usdAmount) || 0;
  if (normalizeDisplayCurrency(currency) === 'AUD') {
    const rate = Number(usdToAud);
    return n * (Number.isFinite(rate) && rate > 0 ? rate : 1);
  }
  return n;
}

/** Format a USD market amount for display (optionally converted to AUD). */
export function formatMoney(usdAmount, currency = 'USD', usdToAud = 1) {
  const code = normalizeDisplayCurrency(currency);
  const n = convertFromUsd(usdAmount, code, usdToAud);
  if (code === 'AUD') {
    // en-AU often renders AUD as "$" — use A$ so it can't be confused with USD.
    const body = new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
    return `A$${body}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatUsd(n) {
  return formatMoney(n, 'USD');
}

export function slotLabel(card) {
  if (!card.zone || card.sheet == null) return '—';
  const z = `${card.zone}${String(card.zone_slot ?? '').padStart(2, '0')}`;
  if (!card.face || !card.row_pos) return z;
  return `${z} s${card.sheet}${card.face}${card.row_pos}`;
}
