/**
 * Upsert USD market prices into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run prices
 *
 * Optional: pass a JSON file path of { "MS01-001": { "base": 0.77, "iconic": 12.5 }, ... }
 *   npm run prices -- ./data/prices-manual.json
 *
 * Without a file, seeds modest placeholder estimates so the Value view works offline.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { buildCards } from '../data/cards-raw.mjs';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const manualPath = process.argv[2];
let manual = {};
if (manualPath) {
  manual = JSON.parse(readFileSync(manualPath, 'utf8'));
}

/** Rough rarity baselines when no manual price — better than zeros for UX */
const BASE_BY_RARITY = {
  Common: 0.12,
  Uncommon: 0.2,
  Rare: 0.45,
  Epic: 4.5,
  Secret: 22,
  Promo: 8,
  Nova: 80,
};

const ICONIC_MULT = {
  Common: 3,
  Uncommon: 4,
  Rare: 8,
  Epic: 12,
  Secret: 35,
  Promo: 5,
  Nova: 10,
};

const cards = buildCards();
const rows = [];
const now = new Date().toISOString();

for (const c of cards) {
  const m = manual[c.id] || {};
  const base =
    m.base ?? BASE_BY_RARITY[c.rarity] ?? 0.25;
  rows.push({ card_id: c.id, variant: 'base', usd: Number(base), updated_at: now });
  if (c.has_iconic) {
    const iconic =
      m.iconic ?? Number(base) * (ICONIC_MULT[c.rarity] ?? 10);
    rows.push({
      card_id: c.id,
      variant: 'iconic',
      usd: Number(iconic),
      updated_at: now,
    });
  }
}

const supabase = createClient(url, key);
const chunk = 100;
for (let i = 0; i < rows.length; i += chunk) {
  const slice = rows.slice(i, i + chunk);
  const { error } = await supabase.from('card_prices').upsert(slice);
  if (error) {
    console.error(error);
    process.exit(1);
  }
}

console.log(`Upserted ${rows.length} price rows at ${now}`);
