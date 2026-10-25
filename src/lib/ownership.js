import { supabase, isConfigured } from './supabase.js';
import { asset } from './assets.js';

const LOCAL_KEY = 'ncb-ownership';
const SETTINGS_KEY = 'ncb-settings';
const MAX_COPIES = 25;

/** Set when Supabase tables are missing (migration not run yet). */
export let schemaReady = true;
export let schemaError = null;

function isMissingTable(error) {
  if (!error) return false;
  const msg = String(error.message || '');
  return (
    error.code === 'PGRST205' ||
    msg.includes('schema cache') ||
    msg.includes('Could not find the table')
  );
}

function clampOwnCopies(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_COPIES, Math.trunc(v)));
}

/** Normalize a raw ownership row / local blob to the current shape. */
export function normalizeOwn(raw = {}) {
  const copies = clampOwnCopies(raw.copies ?? 0);
  let bstampCopies = raw.bstamp_copies;
  if (bstampCopies == null && raw.bstamp != null) {
    bstampCopies = raw.bstamp ? 1 : 0;
  }
  let iconicCopies = raw.iconic_copies;
  if (iconicCopies == null && raw.iconic != null) {
    iconicCopies = raw.iconic ? 1 : 0;
  }
  return {
    copies,
    iconic_copies: clampOwnCopies(iconicCopies ?? 0),
    bstamp_copies: clampOwnCopies(bstampCopies ?? 0),
    price_override_usd:
      raw.price_override_usd === null || raw.price_override_usd === undefined
        ? null
        : Number(raw.price_override_usd),
  };
}

function readLocalMap() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    const map = {};
    for (const [id, row] of Object.entries(raw)) {
      map[id] = normalizeOwn(row);
    }
    return map;
  } catch {
    return {};
  }
}

function writeLocalMap(map) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
}

export function defaultSettings() {
  return { completion_mode: 'ms01', value_count_copies: true };
}

async function mapRows(selectCols) {
  const { data, error } = await supabase.from('ownership').select(selectCols);
  return { data, error };
}

export async function loadOwnership(userId) {
  if (!isConfigured || !userId || userId === 'demo-local') {
    return readLocalMap();
  }

  let { data, error } = await mapRows(
    'card_id, copies, iconic_copies, bstamp_copies, price_override_usd',
  );

  if (error && String(error.message || '').includes('iconic_copies')) {
    ({ data, error } = await mapRows(
      'card_id, copies, iconic, bstamp_copies, price_override_usd',
    ));
  }
  if (error && String(error.message || '').includes('bstamp')) {
    ({ data, error } = await mapRows('card_id, copies, iconic, bstamp, price_override_usd'));
    if (error && String(error.message || '').includes('bstamp')) {
      ({ data, error } = await mapRows('card_id, copies, iconic, price_override_usd'));
    }
  }

  if (error) {
    if (isMissingTable(error)) {
      schemaReady = false;
      schemaError = error.message;
      return readLocalMap();
    }
    throw error;
  }

  schemaReady = true;
  schemaError = null;
  const map = {};
  for (const row of data || []) {
    map[row.card_id] = normalizeOwn(row);
  }
  return map;
}

export async function upsertOwnership(userId, cardId, patch) {
  const next = normalizeOwn(patch);

  // Always mirror locally so demo / missing-schema still works
  const map = readLocalMap();
  map[cardId] = next;
  writeLocalMap(map);

  if (!isConfigured || !userId || userId === 'demo-local' || !schemaReady) {
    return next;
  }

  const base = {
    user_id: userId,
    card_id: cardId,
    copies: next.copies,
    price_override_usd: next.price_override_usd,
  };
  let { error } = await supabase.from('ownership').upsert({
    ...base,
    iconic_copies: next.iconic_copies,
    bstamp_copies: next.bstamp_copies,
  });

  // Fall back only when the new columns are missing (pre-migration DBs).
  // Do not write legacy `iconic` after 005_iconic_copies has dropped it.
  if (error && /iconic_copies/i.test(String(error.message || ''))) {
    ({ error } = await supabase.from('ownership').upsert({
      ...base,
      iconic: next.iconic_copies > 0,
      bstamp_copies: next.bstamp_copies,
    }));
  }
  if (error && /bstamp_copies/i.test(String(error.message || ''))) {
    ({ error } = await supabase.from('ownership').upsert({
      ...base,
      iconic: next.iconic_copies > 0,
      bstamp: next.bstamp_copies > 0,
    }));
  }
  if (error && /bstamp/i.test(String(error.message || ''))) {
    ({ error } = await supabase.from('ownership').upsert({
      ...base,
      iconic: next.iconic_copies > 0,
    }));
  }

  if (error) {
    if (isMissingTable(error)) {
      schemaReady = false;
      schemaError = error.message;
      return next;
    }
    throw error;
  }
  return next;
}

export async function loadSettings(userId) {
  const local = () => {
    try {
      return {
        ...defaultSettings(),
        ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'),
      };
    } catch {
      return defaultSettings();
    }
  };

  if (!isConfigured || !userId || userId === 'demo-local') {
    return local();
  }
  const { data, error } = await supabase
    .from('user_settings')
    .select('completion_mode, value_count_copies')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    if (isMissingTable(error)) {
      schemaReady = false;
      schemaError = error.message;
      return local();
    }
    throw error;
  }
  if (!data) return defaultSettings();
  return {
    completion_mode: data.completion_mode || 'ms01',
    value_count_copies: Boolean(data.value_count_copies),
  };
}

export async function saveSettings(userId, settings) {
  const next = { ...defaultSettings(), ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));

  if (!isConfigured || !userId || userId === 'demo-local' || !schemaReady) {
    return next;
  }
  const { error } = await supabase.from('user_settings').upsert({
    user_id: userId,
    completion_mode: next.completion_mode,
    value_count_copies: next.value_count_copies,
  });
  if (error) {
    if (isMissingTable(error)) {
      schemaReady = false;
      schemaError = error.message;
      return next;
    }
    throw error;
  }
  return next;
}

export async function loadCatalog() {
  // Always use the shipped JSON so Vault/Street layout stays complete even if
  // the remote `cards` table is stale or truncated. Ownership/prices still sync.
  const res = await fetch(asset('data/cards.json'));
  if (!res.ok) throw new Error('Failed to load card catalog');
  const local = await res.json();

  if (isConfigured) {
    const { error } = await supabase.from('cards').select('id').limit(1);
    if (error) {
      if (isMissingTable(error)) {
        schemaReady = false;
        schemaError = error.message;
      }
      // Non-schema errors: keep local catalog; ownership load will surface issues.
    } else {
      schemaReady = true;
      schemaError = null;
    }
  }

  return local;
}

async function loadLocalPrices() {
  try {
    const res = await fetch(asset('data/card-prices.json'));
    if (!res.ok) return { map: {}, updatedAt: null };
    const data = await res.json();
    return {
      map: data.prices || {},
      updatedAt: data.updatedAt || null,
    };
  } catch {
    return { map: {}, updatedAt: null };
  }
}

export async function loadPrices() {
  if (isConfigured && schemaReady) {
    const { data, error } = await supabase
      .from('card_prices')
      .select('card_id, variant, usd, updated_at');
    if (error) {
      if (isMissingTable(error)) {
        schemaReady = false;
        schemaError = error.message;
        return loadLocalPrices();
      }
      throw error;
    }
    if (data?.length) {
      const map = {};
      let latest = null;
      for (const row of data) {
        if (!map[row.card_id]) map[row.card_id] = {};
        map[row.card_id][row.variant] = Number(row.usd);
        if (!latest || row.updated_at > latest) latest = row.updated_at;
      }
      return { map, updatedAt: latest };
    }
  }
  return loadLocalPrices();
}
