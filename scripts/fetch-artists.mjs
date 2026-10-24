/**
 * Pull illustrator credits from Fixer Datapad and map onto our catalog IDs.
 *   node scripts/fetch-artists.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCards } from '../data/cards-raw.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cards = buildCards();

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const res = await fetch('https://fixer-datapad.com/api/cards', {
  headers: { Accept: 'application/json', 'User-Agent': 'NightCityBinder/1.0' },
});
if (!res.ok) throw new Error(`Fixer Datapad ${res.status}`);
const fixer = await res.json();

const byNum = new Map();
const byName = new Map();
for (const c of fixer) {
  byNum.set(String(c.number).toLowerCase(), c);
  byName.set(norm(c.name), c);
}

const artists = {};
const missing = [];
for (const c of cards) {
  let f = null;
  if (c.set_code === 'MS01') f = byNum.get(String(c.number).toLowerCase()) || null;
  if (!f) f = byName.get(norm(c.name)) || null;
  if (!f) {
    f =
      byName.get(norm(c.name.replace(/\s*\((a|b|judge promo)\)/gi, ''))) || null;
  }
  if (f?.artist) artists[c.id] = String(f.artist).trim();
  else missing.push(c.id);
}

mkdirSync(join(root, 'data'), { recursive: true });
writeFileSync(join(root, 'data/card-artists.json'), JSON.stringify(artists, null, 2) + '\n');
console.log(
  JSON.stringify(
    { mapped: Object.keys(artists).length, missing, unique: new Set(Object.values(artists)).size },
    null,
    2,
  ),
);
