import { supabase, isConfigured } from './supabase.js';
import { asset } from './assets.js';
import {
  COPY_SOURCE_LABELS,
  formatMoney,
  normalizeDisplayCurrency,
} from '../stats.js';

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
    const res = await fetch(asset('data/seller-stock.json'), { cache: 'no-store' });
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

/** Load seller stock: Supabase cache first, then shipped JSON snapshot. */
export async function loadSellerStock() {
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

/**
 * Invoke Edge Function to refresh seller_stock, then reload.
 * @returns {{ stock: object, error?: string }}
 */
export async function refreshSellerStock() {
  if (!isConfigured || !supabase) {
    const stock = await loadLocalStock();
    return {
      stock,
      error:
        'Live refresh needs Supabase + the refresh-seller-stock Edge Function. Showing local snapshot — run npm run stock:fetch to update the file.',
    };
  }

  const { data, error } = await supabase.functions.invoke('refresh-seller-stock', {
    method: 'POST',
    body: {},
  });

  if (error) {
    const stock = await loadSellerStock();
    return {
      stock,
      error: `Refresh failed: ${error.message}. Deploy supabase/functions/refresh-seller-stock or run npm run stock:fetch.`,
    };
  }
  if (data && data.ok === false) {
    const stock = await loadSellerStock();
    return {
      stock,
      error: data.error || 'Refresh failed',
    };
  }

  // Prefer DB after successful refresh
  const { data: rows, error: readErr } = await supabase
    .from('seller_stock')
    .select(
      'card_id, edition, seller_id, title, url, price, currency, available, fetched_at',
    );
  if (readErr || !rows?.length) {
    const stock = await loadLocalStock();
    return {
      stock: rowsToPayload(rows) || stock,
      error: readErr?.message,
    };
  }
  return { stock: rowsToPayload(rows) };
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

export function joinWantedWithOffers(wantedRows, offerIndex, { inStockOnly = false, sellerId = 'all' } = {}) {
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
