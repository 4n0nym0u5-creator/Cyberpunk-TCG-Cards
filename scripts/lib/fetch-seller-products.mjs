/**
 * Fetch raw product rows from AU-reachable Cyberpunk singles sellers.
 */

import { SELLERS } from './match-seller-listing.mjs';

const UA = 'NightCityBinder/1.0 (+https://github.com/4n0nym0u5-creator/Cyberpunk-TCG-Cards)';

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

/**
 * Obsession Gaming is a Next.js headless storefront — scrape collection HTML
 * for embedded product payloads (availableForSale, price, handle, tags).
 */
export async function fetchObsessionCollection() {
  const url = SELLERS.obsession.collectionUrl;
  const res = await fetch(url, {
    headers: { Accept: 'text/html', 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const html = await res.text();
  return parseObsessionHtml(html);
}

export function parseObsessionHtml(html) {
  const byHandle = new Map();
  // Escaped RSC JSON fragments
  const re =
    /handle\\":\\"([^\\]+)\\"[^\\]*(?:\\.|[^\\])*?price\\":\\"([^\\]*)\\"[^\\]*(?:\\.|[^\\])*?availableForSale\\":(true|false)[^\\]*(?:\\.|[^\\])*?tags\\":\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(html))) {
    const handle = m[1];
    const price = Number(m[2]);
    const available = m[3] === 'true';
    const tagsRaw = m[4];
    const tags = [...tagsRaw.matchAll(/\\"([^\\]+)\\"/g)].map((x) => x[1]);
    byHandle.set(handle, {
      handle,
      title: null,
      tags,
      vendor: 'Obsession Gaming',
      available,
      price: Number.isFinite(price) ? price : null,
      productUrl: `https://obsessiongaming.com.au/products/${handle}`,
    });
  }

  // Visible titles on the page
  const titleRe =
    /href="(\/products\/([^"]+))"[^>]*>[\s\S]*?>([^<]*(?:WNC-BETA|Welcome to Night City|Cyberpunk)[^<]*)</g;
  let t;
  while ((t = titleRe.exec(html))) {
    const handle = t[2];
    let title = t[3]
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
    const row = byHandle.get(handle) || {
      handle,
      tags: ['Cyberpunk TCG', 'Welcome to Night City - Beta'],
      vendor: 'Obsession Gaming',
      available: true,
      price: null,
      productUrl: `https://obsessiongaming.com.au/products/${handle}`,
    };
    row.title = title;
    byHandle.set(handle, row);
  }

  // Fallback: decode titles from handle when HTML title miss
  const out = [];
  for (const row of byHandle.values()) {
    if (!row.title) {
      row.title = row.handle.replace(/-/g, ' ');
    }
    out.push(row);
  }
  return out;
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
