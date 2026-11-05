/**
 * Map Shopify / seller product titles to catalog card_id + edition (beta|retail|iconic).
 * Shared by stock:fetch and the Edge Function (Deno-compatible ES module).
 */

const ICONIC_RE =
  /\b(?:IO|ILegend|Iconic(?:\s+Other)?)\b|\(IO\)|\(Iconic\)|Iconic\s*A\b/i;
const SEALED_RE =
  /\b(?:booster\s*box|starter\s*deck|preorder|sealed|case\b|display)\b/i;
const RETAIL_RE = /\bretail\b/i;
const BETA_RE =
  /\bbeta\b|\bpre-?release\b|\bprr\b|\bwnc-beta\b|\bms01b\b|\bwelcome to night city\s*[-–—]?\s*beta\b/i;

/** B001, B005a, #B073, [B011 - Epic], Number: B120 */
const CARD_NUM_RE =
  /(?:^|[^A-Za-z0-9])(?:#|\[)?B0*(\d{1,3}[a-z]?)\b|\bNumber:\s*B0*(\d{1,3}[a-z]?)\b/i;
/** PRR - 006 / PRR-008 */
const PRR_RE = /\bPRR\s*[-–—]?\s*0*(\d{1,3})\b/i;

/**
 * Build lookup maps from catalog cards.
 * @param {Array<{ id: string, number: string, name?: string }>} cards
 */
export function buildCatalogIndex(cards) {
  const byNumber = new Map();
  const byId = new Map();
  for (const c of cards) {
    byId.set(c.id, c);
    const n = normalizeNumber(c.number);
    if (n) {
      if (!byNumber.has(n)) byNumber.set(n, []);
      byNumber.get(n).push(c);
    }
    // MS01-001 → 001
    const idTail = c.id.includes('-') ? c.id.split('-').pop() : null;
    if (idTail) {
      const t = normalizeNumber(idTail);
      if (t && t !== n) {
        if (!byNumber.has(t)) byNumber.set(t, []);
        byNumber.get(t).push(c);
      }
    }
  }
  return { byNumber, byId };
}

export function normalizeNumber(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  s = s.replace(/^B/i, '').replace(/^MS01-?/i, '');
  s = s.replace(/^0+(\d)/, '$1'); // keep letter suffix; strip leading zeros carefully
  // "005a" → keep as 5a after strip? Prefer zero-padded 3 for digits-only.
  const m = s.match(/^0*(\d+)([a-z]?)$/i);
  if (!m) return s.toLowerCase() || null;
  const digits = m[1];
  const letter = (m[2] || '').toLowerCase();
  if (letter) return `${digits}${letter}`;
  return digits.padStart(3, '0');
}

export function extractCardNumber(title, tags = []) {
  const blob = [title, ...(tags || [])].filter(Boolean).join(' | ');
  const prr = blob.match(PRR_RE);
  if (prr) return normalizeNumber(prr[1]);
  const m = blob.match(CARD_NUM_RE);
  if (m) return normalizeNumber(m[1] || m[2]);
  return null;
}

export function detectEdition(title, tags = [], vendor = '') {
  const blob = [title, vendor, ...(tags || [])].filter(Boolean).join(' | ');
  if (SEALED_RE.test(blob) && !/\bsingles?\b/i.test(blob)) return null;
  const isIconic = ICONIC_RE.test(blob);
  const isRetail = RETAIL_RE.test(blob) && !BETA_RE.test(blob);
  const isBeta = BETA_RE.test(blob);
  if (isIconic) {
    if (isRetail) return 'retail_iconic';
    return 'beta_iconic'; // Beta cue or default (current market is beta-heavy)
  }
  if (isRetail) return 'retail';
  if (isBeta) return 'beta';
  // Default Cyberpunk singles without retail cue → treat as beta (current market is beta-heavy)
  if (/\bcyberpunk\b/i.test(blob) || /\bwelcome to night city\b/i.test(blob)) {
    return 'beta';
  }
  return null;
}

function titleTokens(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9:]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !/^(the|and|for|with|from|beta|foil|near|mint|epic|rare|common|secret|nova|unit|legend|gear|program|welcome|night|city|wnc|ilegend|iconic)$/.test(t));
}

function nameScore(title, card) {
  const hay = titleTokens(title);
  if (!hay.length) return 0;
  const needle = titleTokens(card.name);
  if (!needle.length) return 0;
  let hit = 0;
  for (const t of needle) {
    if (hay.includes(t)) hit += 1;
  }
  return hit / needle.length;
}

function isIconicEdition(edition) {
  return edition === 'beta_iconic' || edition === 'retail_iconic';
}

/**
 * @returns {{ card_id: string, edition: 'beta'|'retail'|'beta_iconic'|'retail_iconic' } | null}
 */
export function matchListing(catalogIndex, { title, tags = [], vendor = '' }) {
  if (!title) return null;
  const edition = detectEdition(title, tags, vendor);
  if (!edition) return null;

  const blob = [title, ...(tags || [])].join(' ');
  const isBoxTopper = /\bbox\s*toppers?\b/i.test(blob);
  const num = extractCardNumber(title, tags);
  const wantIconic = isIconicEdition(edition);

  let candidates = [];
  if (num) candidates = [...(catalogIndex.byNumber.get(num) || [])];

  // Box toppers / starter exclusives reuse B### that collide with MS01 — prefer name match over number.
  if (isBoxTopper || candidates.length === 0) {
    const all = [...catalogIndex.byId.values()].filter((c) =>
      wantIconic ? c.has_iconic : true,
    );
    const scored = all
      .map((c) => ({ c, s: nameScore(title, c) }))
      .filter((x) => x.s >= 0.5)
      .sort((a, b) => b.s - a.s || a.c.sort_order - b.c.sort_order);
    if (scored.length) {
      const best = scored[0].c;
      // Box topper listings that matched a different set by name are fine.
      return { card_id: best.id, edition };
    }
    if (isBoxTopper) return null;
  }

  if (!candidates.length) {
    // Fallback: name-only against MS01 first
    const ms01 = [...catalogIndex.byId.values()].filter(
      (c) => c.set_code === 'MS01' && (wantIconic ? c.has_iconic : true),
    );
    const scored = ms01
      .map((c) => ({ c, s: nameScore(title, c) }))
      .filter((x) => x.s >= 0.6)
      .sort((a, b) => b.s - a.s);
    if (!scored.length) return null;
    return { card_id: scored[0].c.id, edition };
  }

  if (wantIconic) {
    candidates = candidates.filter((c) => c.has_iconic);
  }

  if (candidates.length === 1) {
    // Guard against B### collisions: require decent name overlap when title has a clear name
    const only = candidates[0];
    if (nameScore(title, only) < 0.35 && titleTokens(title).length >= 2) {
      const scored = [...catalogIndex.byId.values()]
        .filter((c) => (wantIconic ? c.has_iconic : true))
        .map((c) => ({ c, s: nameScore(title, c) }))
        .filter((x) => x.s >= 0.5)
        .sort((a, b) => b.s - a.s);
      if (scored.length) return { card_id: scored[0].c.id, edition };
      return null;
    }
    if (wantIconic && !only.has_iconic) return null;
    return { card_id: only.id, edition };
  }

  // Multiple number hits — pick best name, prefer MS01 on ties for non-toppers
  candidates.sort((a, b) => {
    const ds = nameScore(title, b) - nameScore(title, a);
    if (Math.abs(ds) > 0.05) return ds;
    if (wantIconic) {
      if (a.has_iconic !== b.has_iconic) return a.has_iconic ? -1 : 1;
    }
    if (a.set_code === 'MS01' && b.set_code !== 'MS01') return -1;
    if (b.set_code === 'MS01' && a.set_code !== 'MS01') return 1;
    return 0;
  });
  const top = candidates[0];
  if (!top || nameScore(title, top) < 0.35) return null;
  if (wantIconic && !top.has_iconic) return null;
  return { card_id: top.id, edition };
}

export const SELLERS = {
  punkouter: {
    id: 'punkouter',
    name: 'PunkOuter',
    shipsToAu: true,
    currency: 'USD',
    collectionUrl:
      'https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock',
    productsJsonBase:
      'https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock/products.json',
    kind: 'shopify',
  },
  obsession: {
    id: 'obsession',
    name: 'Obsession Gaming',
    shipsToAu: true,
    currency: 'AUD',
    collectionUrl:
      'https://obsessiongaming.com.au/collections/cyberpunk-tcg-singles',
    kind: 'obsession_html',
  },
  mint: {
    id: 'mint',
    name: 'Mint Collectables',
    shipsToAu: true,
    currency: 'AUD',
    collectionUrl: 'https://mintcollectables.com.au/collections/cyberpunk-tcg',
    productsJsonBase:
      'https://mintcollectables.com.au/collections/cyberpunk-tcg/products.json',
    kind: 'shopify',
  },
};
