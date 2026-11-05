/**
 * Fetch AU-reachable Cyberpunk TCG singles stock and write seller-stock.json.
 *
 *   npm run stock:fetch
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SELLERS,
  buildCatalogIndex,
  matchListing,
} from './lib/match-seller-listing.mjs';
import { fetchAllSellerProducts } from './lib/fetch-seller-products.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cards = JSON.parse(readFileSync(join(root, 'data/cards.json'), 'utf8'));
const catalogIndex = buildCatalogIndex(cards);

const raw = await fetchAllSellerProducts();
const listings = [];
let matched = 0;
let skipped = 0;

for (const p of raw) {
  const hit = matchListing(catalogIndex, {
    title: p.title,
    tags: p.tags,
    vendor: p.vendor,
  });
  if (!hit) {
    skipped += 1;
    continue;
  }
  matched += 1;
  listings.push({
    card_id: hit.card_id,
    edition: hit.edition,
    seller_id: p.seller_id,
    title: p.title,
    url: p.productUrl,
    price: p.price,
    currency: p.currency,
    available: Boolean(p.available),
  });
}

// Deduplicate: keep cheapest available (else any) per card/edition/seller
const best = new Map();
for (const row of listings) {
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

const payload = {
  updatedAt: new Date().toISOString(),
  source: 'shopify+obsession',
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
  listings: [...best.values()].sort((a, b) =>
    a.card_id === b.card_id
      ? a.edition.localeCompare(b.edition) || a.seller_id.localeCompare(b.seller_id)
      : a.card_id.localeCompare(b.card_id),
  ),
};

mkdirSync(join(root, 'public/data'), { recursive: true });
mkdirSync(join(root, 'data'), { recursive: true });
const path = join(root, 'data/seller-stock.json');
writeFileSync(path, JSON.stringify(payload, null, 2));
copyFileSync(path, join(root, 'public/data/seller-stock.json'));
try {
  mkdirSync(join(root, 'docs/data'), { recursive: true });
  copyFileSync(path, join(root, 'docs/data/seller-stock.json'));
} catch {
  // docs/ is rebuilt from dist on deploy; ignore if missing
}

console.log(
  JSON.stringify(
    {
      raw: raw.length,
      matched,
      skipped,
      uniqueListings: payload.listings.length,
      available: payload.listings.filter((l) => l.available).length,
      path,
    },
    null,
    2,
  ),
);
