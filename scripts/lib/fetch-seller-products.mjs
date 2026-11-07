/**
 * Fetch raw product rows from AU-reachable Cyberpunk singles sellers.
 */

import { SELLERS } from './match-seller-listing.mjs';

const UA = 'NightCityBinder/1.0 (+https://github.com/4n0nym0u5-creator/Cyberpunk-TCG-Cards)';
const OBSESSION_ACTION_ID = '7c995eb9caaedae0dbc704d6f9c9a43e8a8001707e';
const HANDLE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

/** Paginate Shopify collection products.json (limit 250). */
export async function fetchShopifyCollection(productsJsonBase) {
  const out = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = `${productsJsonBase}?limit=250&page=${page}`;
    const data = await fetchJson(url);
    const products = data.products || [];
    if (!products.length) break;
    for (const p of products) {
      const variant = (p.variants || []).find((v) => v.available) || p.variants?.[0];
      const available = Boolean(variant?.available);
      const price = variant?.price != null ? Number(variant.price) : null;
      out.push({
        title: p.title,
        handle: p.handle,
        tags: p.tags || [],
        vendor: p.vendor || '',
        available,
        price: Number.isFinite(price) ? price : null,
        productUrl: null, // filled by caller with shop origin
      });
    }
    if (products.length < 250) break;
  }
  return out;
}

function unescapeRscString(s) {
  return String(s || '')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

function tagsFromRscArray(raw) {
  return [...String(raw || '').matchAll(/\\"([^\\"]+)\\"/g)].map((x) =>
    unescapeRscString(x[1]),
  );
}

function normalizeObsessionProduct(row) {
  const handle = String(row.handle || '').trim();
  if (!HANDLE_RE.test(handle)) return null;
  const price = Number(row.price);
  return {
    handle,
    title: row.title || handle.replace(/-/g, ' '),
    tags: Array.isArray(row.tags) ? row.tags : [],
    vendor: row.vendor || 'Obsession Gaming',
    available: Boolean(row.available),
    price: Number.isFinite(price) ? price : null,
    productUrl: `https://obsessiongaming.com.au/products/${handle}`,
  };
}

/**
 * Parse Obsession collection HTML (Next.js RSC + visible cards).
 * Returns first-page products plus pagination cursor when present.
 */
export function parseObsessionCollectionPage(html) {
  const byHandle = new Map();

  // Structured product objects embedded in RSC payloads
  const productRe =
    /\\"id\\":\\"gid:\/\/shopify\/Product\/\d+\\",\\"title\\":\\"((?:\\\\.|[^\\"])*)\\",\\"handle\\":\\"([a-z0-9-]+)\\",\\"vendor\\":\\"((?:\\\\.|[^\\"])*)\\",\\"description\\":\\"(?:\\\\.|[^\\"])*\\",\\"price\\":\\"([^\\"]*)\\",\\"compareAtPrice\\":\\"(?:\\\\.|[^\\"])*\\",\\"imageUrl\\":\\"(?:\\\\.|[^\\"])*\\",\\"images\\":\[[^\]]*\],\\"availableForSale\\":(true|false),\\"tags\\":\[([^\]]*)\]/g;
  let m;
  while ((m = productRe.exec(html))) {
    const row = normalizeObsessionProduct({
      title: unescapeRscString(m[1]),
      handle: m[2],
      vendor: unescapeRscString(m[3]) || 'Obsession Gaming',
      price: m[4],
      available: m[5] === 'true',
      tags: tagsFromRscArray(m[6]),
    });
    if (row) byHandle.set(row.handle, row);
  }

  // Fallback: looser handle/price/available/tags blocks
  if (!byHandle.size) {
    const looseRe =
      /handle\\":\\"([a-z0-9-]+)\\"[^\\]*(?:\\.|[^\\])*?price\\":\\"([^\\]*)\\"[^\\]*(?:\\.|[^\\])*?availableForSale\\":(true|false)[^\\]*(?:\\.|[^\\])*?tags\\":\[([^\]]*)\]/g;
    while ((m = looseRe.exec(html))) {
      const row = normalizeObsessionProduct({
        handle: m[1],
        price: m[2],
        available: m[3] === 'true',
        tags: tagsFromRscArray(m[4]),
      });
      if (row) byHandle.set(row.handle, row);
    }
  }

  // Visible card titles (never accept corrupted handles)
  const titleRe =
    /href="\/products\/([a-z0-9-]+)"[^>]*>[\s\S]*?(?:alt|title)="([^"]+)"/gi;
  let t;
  while ((t = titleRe.exec(html))) {
    const handle = t[1];
    if (!HANDLE_RE.test(handle)) continue;
    const title = unescapeRscString(t[2]).trim();
    if (!/(WNC-BETA|Welcome to Night City|Cyberpunk)/i.test(title)) continue;
    const prev = byHandle.get(handle);
    if (prev) {
      prev.title = title;
    } else {
      byHandle.set(
        handle,
        normalizeObsessionProduct({
          handle,
          title,
          tags: ['Cyberpunk TCG', 'Welcome to Night City - Beta'],
          available: true,
          price: null,
        }),
      );
    }
  }

  const cursorMatch = html.match(
    /initialEndCursor\\":\\"(eyJ[A-Za-z0-9_=+-]+)\\"/,
  );
  const hasNextMatch = html.match(/initialHasNextPage\\":(true|false)/);

  return {
    products: [...byHandle.values()].filter(Boolean),
    endCursor: cursorMatch?.[1] || null,
    hasNextPage: hasNextMatch ? hasNextMatch[1] === 'true' : Boolean(cursorMatch),
  };
}

/** Back-compat: products only. */
export function parseObsessionHtml(html) {
  return parseObsessionCollectionPage(html).products;
}

function parseObsessionActionPayload(text) {
  const lines = String(text || '').split('\n');
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const body = line.slice(colon + 1);
    try {
      const data = JSON.parse(body);
      if (data && Array.isArray(data.products)) return data;
    } catch {
      /* keep scanning */
    }
  }
  return null;
}

async function fetchObsessionPage(cursor) {
  const res = await fetch(SELLERS.obsession.collectionUrl, {
    method: 'POST',
    headers: {
      Accept: 'text/x-component',
      'Content-Type': 'text/plain;charset=UTF-8',
      'Next-Action': OBSESSION_ACTION_ID,
      'User-Agent': UA,
    },
    body: JSON.stringify([
      'collection',
      'cyberpunk-tcg-singles',
      cursor,
      null,
      'default',
    ]),
  });
  if (!res.ok) throw new Error(`obsession loadMore → ${res.status}`);
  const data = parseObsessionActionPayload(await res.text());
  if (!data) throw new Error('obsession loadMore: empty payload');
  const products = [];
  for (const p of data.products || []) {
    const row = normalizeObsessionProduct({
      handle: p.handle,
      title: p.title,
      vendor: p.vendor,
      price: p.price,
      available: p.availableForSale,
      tags: p.tags || [],
    });
    if (row) products.push(row);
  }
  return {
    products,
    endCursor: data.endCursor || null,
    hasNextPage: Boolean(data.hasNextPage),
  };
}

/**
 * Obsession Gaming is a Next.js headless storefront.
 * First page comes from collection HTML; remaining pages via loadMoreProducts.
 */
export async function fetchObsessionCollection() {
  const url = SELLERS.obsession.collectionUrl;
  const res = await fetch(url, {
    headers: { Accept: 'text/html', 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const html = await res.text();
  const first = parseObsessionCollectionPage(html);
  if (!first.products.length) {
    throw new Error('Obsession HTML contained no products (blocked or layout changed)');
  }

  const byHandle = new Map(first.products.map((p) => [p.handle, p]));
  let cursor = first.endCursor;
  let hasNext = first.hasNextPage && Boolean(cursor);

  for (let page = 0; page < 20 && hasNext; page += 1) {
    const next = await fetchObsessionPage(cursor);
    for (const p of next.products) byHandle.set(p.handle, p);
    cursor = next.endCursor;
    hasNext = next.hasNextPage && Boolean(cursor);
    if (!next.products.length && !hasNext) break;
  }

  return [...byHandle.values()];
}

export async function fetchAllSellerProducts() {
  const results = [];

  // PunkOuter
  {
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
  }

  // Mint Collectables
  {
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
  }

  // Obsession Gaming
  {
    const seller = SELLERS.obsession;
    const products = await fetchObsessionCollection();
    for (const p of products) {
      results.push({
        ...p,
        seller_id: seller.id,
        currency: seller.currency,
      });
    }
  }

  return results;
}
