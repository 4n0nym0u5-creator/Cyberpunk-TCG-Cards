/**
 * Upsert the local card catalog (+ price placeholders) into Supabase.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/push-seed.mjs
 *
 * Reads VITE_SUPABASE_URL from .env if SUPABASE_URL is unset.
 * Safe to re-run: upserts cards; does NOT wipe ownership.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadDotEnv() {
  const path = join(root, '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i);
    const v = t.slice(i + 1);
    if (process.env[k] == null) process.env[k] = v;
  }
}

loadDotEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    'Missing credentials.\n' +
      'Set SUPABASE_SERVICE_ROLE_KEY (and optionally SUPABASE_URL) then re-run:\n' +
      '  SUPABASE_SERVICE_ROLE_KEY=... node scripts/push-seed.mjs\n\n' +
      'Or paste supabase/seed.sql in the SQL editor:\n' +
      '  https://supabase.com/dashboard/project/orrxumsntcbuqjzldmos/sql/new',
  );
  process.exit(1);
}

const cardsPath = join(root, 'data/cards.json');
if (!existsSync(cardsPath)) {
  console.error('Missing data/cards.json — run: npm run artists:fetch && npm run seed:generate');
  process.exit(1);
}
const cards = JSON.parse(readFileSync(cardsPath, 'utf8'));
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const chunk = 80;
console.log(`Upserting ${cards.length} cards…`);
for (let i = 0; i < cards.length; i += chunk) {
  const slice = cards.slice(i, i + chunk);
  const { error } = await supabase.from('cards').upsert(slice);
  if (error) {
    console.error('cards upsert failed:', error);
    process.exit(1);
  }
  console.log(`  cards ${Math.min(i + chunk, cards.length)}/${cards.length}`);
}

const now = new Date().toISOString();
const priceRows = [];
for (const c of cards) {
  priceRows.push({ card_id: c.id, variant: 'base', usd: 0, updated_at: now });
  if (c.has_iconic) {
    priceRows.push({ card_id: c.id, variant: 'iconic', usd: 0, updated_at: now });
  }
}

console.log(`Ensuring ${priceRows.length} price placeholders (do nothing if present)…`);
for (let i = 0; i < priceRows.length; i += chunk) {
  const slice = priceRows.slice(i, i + chunk);
  const { error } = await supabase.from('card_prices').upsert(slice, {
    onConflict: 'card_id,variant',
    ignoreDuplicates: true,
  });
  if (error) {
    console.error('card_prices upsert failed:', error);
    process.exit(1);
  }
}

// Overlay known market prices from local JSON when available
const pricesPath = join(root, 'data/card-prices.json');
if (existsSync(pricesPath)) {
  const payload = JSON.parse(readFileSync(pricesPath, 'utf8'));
  const map = payload.prices || payload;
  const marketRows = [];
  for (const [cardId, variants] of Object.entries(map)) {
    if (!variants || typeof variants !== 'object') continue;
    for (const [variant, usd] of Object.entries(variants)) {
      if (variant !== 'base' && variant !== 'iconic') continue;
      if (usd == null || Number.isNaN(Number(usd))) continue;
      marketRows.push({
        card_id: cardId,
        variant,
        usd: Number(usd),
        updated_at: payload.updatedAt || now,
      });
    }
  }
  console.log(`Upserting ${marketRows.length} market prices from card-prices.json…`);
  for (let i = 0; i < marketRows.length; i += chunk) {
    const slice = marketRows.slice(i, i + chunk);
    const { error } = await supabase.from('card_prices').upsert(slice);
    if (error) {
      console.error('market prices upsert failed:', error);
      process.exit(1);
    }
  }
}

const { count, error: countErr } = await supabase
  .from('cards')
  .select('id', { count: 'exact', head: true });
if (countErr) {
  console.error('verify failed:', countErr);
  process.exit(1);
}

const { data: streetkid, error: skErr } = await supabase
  .from('cards')
  .select('id, name, sort_order')
  .in('id', ['MS01-005a', 'MS01-005b'])
  .order('sort_order');
if (skErr) {
  console.error('streetkid verify failed:', skErr);
  process.exit(1);
}

console.log(JSON.stringify({ cardCount: count, streetkid }, null, 2));
console.log('Done.');
