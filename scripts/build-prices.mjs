/**
 * Fetch TCGPlayer market prices for every mapped card image product.
 * Writes data/card-prices.json + public/data/card-prices.json for the app fallback.
 *
 *   node scripts/build-prices.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const images = JSON.parse(readFileSync(join(root, 'data/card-images.json'), 'utf8'));

async function marketUsd(productId) {
  const res = await fetch(`https://mpapi.tcgplayer.com/v2/product/${productId}/pricepoints`, {
    headers: { Accept: 'application/json', 'User-Agent': 'NightCityBinder/1.0' },
  });
  if (!res.ok) return null;
  const rows = await res.json();
  // Prefer Foil market (TCG foils), then Normal, then listed median
  const foil = rows.find((r) => r.printingType === 'Foil');
  const normal = rows.find((r) => r.printingType === 'Normal');
  const pick = (row) =>
    row?.marketPrice ?? row?.listedMedianPrice ?? row?.buylistMarketPrice ?? null;
  return pick(foil) ?? pick(normal) ?? null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const out = {};
const ids = Object.keys(images);
let ok = 0;
let fail = 0;

for (let i = 0; i < ids.length; i += 1) {
  const id = ids[i];
  const entry = images[id];
  out[id] = {};
  if (entry.base?.productId) {
    const usd = await marketUsd(entry.base.productId);
    if (usd != null) {
      out[id].base = usd;
      ok += 1;
    } else fail += 1;
    await sleep(80);
  }
  if (entry.iconic?.productId) {
    const usd = await marketUsd(entry.iconic.productId);
    if (usd != null) {
      out[id].iconic = usd;
      ok += 1;
    } else fail += 1;
    await sleep(80);
  }
  if ((i + 1) % 25 === 0) console.log(`… ${i + 1}/${ids.length}`);
}

const payload = {
  updatedAt: new Date().toISOString(),
  source: 'tcgplayer-mpapi-pricepoints',
  prices: out,
};

mkdirSync(join(root, 'public/data'), { recursive: true });
const path = join(root, 'data/card-prices.json');
writeFileSync(path, JSON.stringify(payload, null, 2));
copyFileSync(path, join(root, 'public/data/card-prices.json'));
console.log(JSON.stringify({ cards: ids.length, pricedPoints: ok, missing: fail, path }, null, 2));
