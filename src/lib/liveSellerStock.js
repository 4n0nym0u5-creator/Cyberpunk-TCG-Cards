/**
 * Browser live pull of AU singles stock (no Edge Function required).
 * Tries direct fetch, then public CORS proxies — Shopify blocks browser CORS.
 */

import {
  SELLERS,
  buildCatalogIndex,
  matchListing,
} from '../../scripts/lib/match-seller-listing.mjs';
import { parseObsessionCollectionPage } from '../../scripts/lib/fetch-seller-products.mjs';

const CACHE_KEY = 'ncb-seller-stock-live';
const CACHE_MS = 12 * 60 * 60 * 1000;

async function fetchText(url) {
  const attempts = [
    url,
    // corsproxy.io now requires an API key for the legacy form; try url= param too
    `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  ];
  let lastErr = null;
  for (const u of attempts) {
    try {
      const res = await fetch(u, {
        headers: { Accept: '*/*' },
        cache: 'no-store',
      });
      if (!res.ok) {
        lastErr = new Error(`${u} → ${res.status}`);
        continue;
      }
      const text = await res.text();
      // allorigins /get wraps contents in JSON
      if (u.includes('allorigins.win/get?')) {
        try {
          const wrapped = JSON.parse(text);
          if (typeof wrapped?.contents === 'string') return wrapped.contents;
        } catch {
          /* fall through */
        }
      }
      // Cloudflare / proxy interstitial pages are not usable product HTML/JSON
      if (
        /Just a moment\.\.\.|cf-challenge|keyless_legacy_url|Attention Required/i.test(
          text,
        )
      ) {
        lastErr = new Error(`${u} → blocked interstitial`);
        continue;
      }
      return text;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error(`Failed to fetch ${url}`);
}

async function fetchJson(url) {
  const text = await fetchText(url);
  return JSON.parse(text);
}

async function fetchShopifyCollection(productsJsonBase) {
  const out = [];
  for (let page = 1; page <= 20; page += 1) {
    const data = await fetchJson(`${productsJsonBase}?limit=250&page=${page}`);
    const products = data.products || [];
    if (!products.length) break;
    for (const p of products) {
      const variant =
        (p.variants || []).find((v) => v.available) || p.variants?.[0];
      const price = variant?.price != null ? Number(variant.price) : null;
      out.push({
        title: p.title,
        handle: p.handle,
        tags: p.tags || [],
        vendor: p.vendor || '',
        available: Boolean(variant?.available),
        price: Number.isFinite(price) ? price : null,
      });
    }
    if (products.length < 250) break;
  }
  return out;
}

async function fetchAllRaw() {
  const results = [];
  const errors = [];
  const okSellers = new Set();

  try {
    const seller = SELLERS.punkouter;
    const products = await fetchShopifyCollection(seller.productsJsonBase);
    for (const p of products) {
      results.push({
        ...p,
        seller_id: seller.id,
        currency: seller.currency,
        productUrl: `https://punkouter.com/products/${p.handle}`,
      });
    }
    if (products.length) okSellers.add(seller.id);
    else errors.push('PunkOuter: no products returned');
  } catch (err) {
    errors.push(`PunkOuter: ${err.message || err}`);
  }

  try {
    const seller = SELLERS.mint;
    const products = await fetchShopifyCollection(seller.productsJsonBase);
    for (const p of products) {
      results.push({
        ...p,
        seller_id: seller.id,
        currency: seller.currency,
        productUrl: `https://mintcollectables.com.au/products/${p.handle}`,
      });
    }
    if (products.length) okSellers.add(seller.id);
    else errors.push('Mint: no products returned');
  } catch (err) {
    errors.push(`Mint: ${err.message || err}`);
  }

  try {
    const seller = SELLERS.obsession;
    const html = await fetchText(seller.collectionUrl);
    const page = parseObsessionCollectionPage(html);
    if (!page.products.length) {
      throw new Error(
        'HTML returned but no products parsed (CORS proxy/challenge or layout change)',
      );
    }
    for (const p of page.products) {
      results.push({
        ...p,
        seller_id: seller.id,
        currency: seller.currency,
      });
    }
    okSellers.add(seller.id);
    if (page.hasNextPage) {
      errors.push(
        'Obsession: first page only in browser (pagination needs server refresh)',
      );
    }
  } catch (err) {
    errors.push(`Obsession: ${err.message || err}`);
  }

  return { results, errors, okSellers };
}

function buildPayload(cards, raw, { source = 'browser-live' } = {}) {
  const catalogIndex = buildCatalogIndex(cards);
  const best = new Map();
  for (const p of raw) {
    const hit = matchListing(catalogIndex, {
      title: p.title,
      tags: p.tags,
      vendor: p.vendor,
    });
    if (!hit) continue;
    const row = {
      card_id: hit.card_id,
      edition: hit.edition,
      seller_id: p.seller_id,
      title: p.title,
      url: p.productUrl,
      price: p.price,
      currency: p.currency,
      available: Boolean(p.available),
    };
    const key = `${row.card_id}|${row.edition}|${row.seller_id}`;
    const prev = best.get(key);
    if (!prev) {
      best.set(key, row);
      continue;
    }
    if (row.available && !prev.available) {
      best.set(key, row);
      continue;
    }
    if (row.available === prev.available) {
      const a = row.price ?? Infinity;
      const b = prev.price ?? Infinity;
      if (a < b) best.set(key, row);
    }
  }
  return {
    updatedAt: new Date().toISOString(),
    source,
    sellers: Object.fromEntries(
      Object.values(SELLERS).map((s) => [
        s.id,
        {
          id: s.id,
          name: s.name,
          shipsToAu: s.shipsToAu,
          currency: s.currency,
          collectionUrl: s.collectionUrl,
        },
      ]),
    ),
    listings: [...best.values()],
    from: 'live',
  };
}

/** Keep listings for sellers missing from `primary`, taken from `fallback`. */
export function mergeMissingSellers(primary, fallback, sellerIds) {
  if (!primary) return fallback;
  if (!fallback?.listings?.length || !sellerIds?.length) return primary;
  const keep = new Set(sellerIds);
  const without = (primary.listings || []).filter((l) => !keep.has(l.seller_id));
  const fromFallback = (fallback.listings || []).filter((l) =>
    keep.has(l.seller_id),
  );
  if (!fromFallback.length) return primary;
  return {
    ...primary,
    listings: [...without, ...fromFallback],
    source: `${primary.source || 'live'}+merged`,
  };
}

export function readLiveStockCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!raw?.payload?.listings || !raw.at) return null;
    if (Date.now() - raw.at > CACHE_MS) return null;
    return raw.payload;
  } catch {
    return null;
  }
}

export function writeLiveStockCache(payload) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ at: Date.now(), payload }),
    );
  } catch {
    /* quota */
  }
}

/**
 * Pull live singles from AU shops in the browser.
 * @param {Array} cards catalog
 */
export async function fetchLiveSellerStock(cards) {
  if (!cards?.length) throw new Error('Catalog not loaded');
  const { results, errors, okSellers } = await fetchAllRaw();
  if (!results.length) {
    throw new Error(
      errors.length
        ? `Could not reach sellers (${errors.join('; ')})`
        : 'No seller products returned',
    );
  }
  const payload = buildPayload(cards, results);
  writeLiveStockCache(payload);
  return {
    stock: payload,
    warnings: errors.length ? errors : null,
    okSellers: [...okSellers],
  };
}
