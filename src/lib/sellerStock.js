import { supabase, isConfigured } from './supabase.js';
import { asset } from './assets.js';
import {
  COPY_SOURCE_LABELS,
  formatMoney,
  normalizeDisplayCurrency,
} from '../stats.js';
import {
  fetchLiveSellerStock,
  mergeMissingSellers,
  readLiveStockCache,
  writeLiveStockCache,
} from './liveSellerStock.js';

export const SELLER_META = {
  punkouter: {
    id: 'punkouter',
    name: 'PunkOuter',
    shipsToAu: true,
    currency: 'USD',
    collectionUrl:
      'https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock',
  },
  obsession: {
    id: 'obsession',
    name: 'Obsession Gaming',
    shipsToAu: true,
    currency: 'AUD',
    collectionUrl:
      'https://obsessiongaming.com.au/collections/cyberpunk-tcg-singles',
  },
  mint: {
    id: 'mint',
    name: 'Mint Collectables',
    shipsToAu: true,
    currency: 'AUD',
    collectionUrl: 'https://mintcollectables.com.au/collections/cyberpunk-tcg',
  },
};

const emptyStock = () => ({
  updatedAt: null,
  source: null,
  sellers: { ...SELLER_META },
  listings: [],
  from: 'empty',
});

function normalizePayload(data, from) {
  const sellers = { ...SELLER_META, ...(data.sellers || {}) };
  return {
    updatedAt: data.updatedAt || data.fetched_at || null,
    source: data.source || from,
    sellers,
    listings: Array.isArray(data.listings) ? data.listings : [],
    from,
  };
}

async function loadLocalStock() {
  try {
    const res = await fetch(`${asset('data/seller-stock.json')}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return emptyStock();
    const data = await res.json();
    return normalizePayload(data, 'local');
  } catch {
    return emptyStock();
  }
}

function rowsToPayload(rows) {
  if (!rows?.length) return emptyStock();
  let updatedAt = null;
  const listings = rows.map((r) => {
    if (r.fetched_at && (!updatedAt || r.fetched_at > updatedAt)) {
      updatedAt = r.fetched_at;
    }
    return {
      card_id: r.card_id,
      edition: r.edition,
      seller_id: r.seller_id,
      title: r.title,
      url: r.url,
      price: r.price != null ? Number(r.price) : null,
      currency: r.currency,
      available: Boolean(r.available),
    };
  });
  return {
    updatedAt,
    source: 'supabase',
    sellers: { ...SELLER_META },
    listings,
    from: 'supabase',
  };
}

/** Load seller stock: live cache → Supabase → shipped JSON. */
export async function loadSellerStock() {
  const cached = readLiveStockCache();
  if (cached?.listings?.length) return cached;

  if (isConfigured && supabase) {
    const { data, error } = await supabase
      .from('seller_stock')
      .select(
        'card_id, edition, seller_id, title, url, price, currency, available, fetched_at',
      );
    if (!error && data?.length) {
      return rowsToPayload(data);
    }
  }
  return loadLocalStock();
}

async function tryEdgeRefresh() {
  if (!isConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.functions.invoke('refresh-seller-stock', {
      body: {},
    });
    if (error) return { error: error.message || String(error) };
    if (data && data.ok === false) return { error: data.error || 'Refresh failed' };

    const { data: rows, error: readErr } = await supabase
      .from('seller_stock')
      .select(
        'card_id, edition, seller_id, title, url, price, currency, available, fetched_at',
      );
    if (readErr) return { error: readErr.message };
    if (!rows?.length) return { error: 'Edge Function ran but seller_stock is empty' };
    const warnings = Array.isArray(data?.warnings) ? data.warnings : null;
    return {
      stock: rowsToPayload(rows),
      warning: warnings?.length ? warnings.join('; ') : undefined,
    };
  } catch (err) {
    return { error: err.message || String(err) };
  }
}

const ALL_SELLER_IDS = Object.keys(SELLER_META);

/**
 * Refresh stock: Edge Function first (server can reach Obsession + Shopify),
 * then browser live pull as fallback when Edge is unavailable.
 * @param {Array} cards catalog rows for matching
 * @returns {{ stock: object, error?: string, warning?: string }}
 */
export async function refreshSellerStock(cards = []) {
  const previous =
    readLiveStockCache() ||
    (await loadLocalStock().catch(() => emptyStock()));

  // 1) Edge Function primary — server fetch for Shopify; Obsession snapshot if CF-blocked
  const edge = await tryEdgeRefresh();
  if (edge?.stock?.listings?.length) {
    writeLiveStockCache(edge.stock);
    return {
      stock: edge.stock,
      warning: edge.warning,
    };
  }

  // 2) Browser live fallback (Shopify may work via proxies; Obsession often blocked by CORS)
  try {
    const { stock, warnings, okSellers } = await fetchLiveSellerStock(cards);
    const missing = ALL_SELLER_IDS.filter((id) => !(okSellers || []).includes(id));
    let merged = stock;
    const notes = [...(warnings || [])];
    if (edge?.error) notes.push(`Edge: ${edge.error}`);

    if (missing.length) {
      merged = mergeMissingSellers(merged, previous, missing);
      writeLiveStockCache(merged);
      notes.push(`Kept prior ${missing.join(', ')} listings (browser blocked)`);
    }

    return {
      stock: merged,
      warning: notes.length ? `Partial: ${notes.join('; ')}` : undefined,
    };
  } catch (liveErr) {
    const stock = await loadSellerStock();
    const edgeHint = edge?.error || '';
    return {
      stock,
      error: `Stock refresh failed (${liveErr.message || liveErr})${
        edgeHint ? ` · Edge Function: ${edgeHint}` : ''
      }. Showing cached/snapshot stock.`,
    };
  }
}

/** Index listings by card_id|edition → offers[] */
export function indexOffers(listings) {
  const map = new Map();
  for (const row of listings || []) {
    const key = `${row.card_id}|${row.edition}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  for (const offers of map.values()) {
    offers.sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return (a.price ?? Infinity) - (b.price ?? Infinity);
    });
  }
  return map;
}

export function offersFor(offerIndex, cardId, edition) {
  return offerIndex.get(`${cardId}|${edition}`) || [];
}

/** Format a seller listing price into the UI display currency. */
export function formatListingPrice(listing, displayCurrency = 'USD', usdToAud = 1) {
  if (listing?.price == null || !Number.isFinite(Number(listing.price))) {
    return '—';
  }
  const price = Number(listing.price);
  const from = listing.currency === 'AUD' ? 'AUD' : 'USD';
  const to = normalizeDisplayCurrency(displayCurrency);
  const rate = Number(usdToAud) > 0 ? Number(usdToAud) : 1.55;

  let usd = price;
  if (from === 'AUD') usd = price / rate;

  if (to === 'AUD') {
    const aud = from === 'AUD' ? price : price * rate;
    const body = new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(aud);
    return `A$${body}`;
  }
  return formatMoney(usd, 'USD');
}

export function editionBadge(edition) {
  return COPY_SOURCE_LABELS[edition] || edition;
}

export function joinWantedWithOffers(
  wantedRows,
  offerIndex,
  { inStockOnly = false, sellerId = 'all' } = {},
) {
  return wantedRows
    .map((row) => {
      let offers = offersFor(offerIndex, row.card.id, row.edition);
      if (sellerId && sellerId !== 'all') {
        offers = offers.filter((o) => o.seller_id === sellerId);
      }
      const inStock = offers.filter((o) => o.available);
      return {
        ...row,
        offers,
        inStock,
        best: inStock[0] || offers[0] || null,
      };
    })
    .filter((row) => !inStockOnly || row.inStock.length > 0);
}
