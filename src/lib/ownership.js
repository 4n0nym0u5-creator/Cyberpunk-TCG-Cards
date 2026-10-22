import { supabase, isConfigured } from './supabase.js';
import { asset } from './assets.js';

const LOCAL_KEY = 'ncb-ownership';
const SETTINGS_KEY = 'ncb-settings';

function readLocalMap() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeLocalMap(map) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
}

export function defaultSettings() {
  return { completion_mode: 'ms01', value_count_copies: false };
}

export async function loadOwnership(userId) {
  if (!isConfigured || !userId) {
    return readLocalMap();
  }
  const { data, error } = await supabase
    .from('ownership')
    .select('card_id, copies, iconic, price_override_usd');
  if (error) throw error;
  const map = {};
  for (const row of data || []) {
    map[row.card_id] = {
      copies: row.copies ?? 0,
      iconic: Boolean(row.iconic),
      price_override_usd:
        row.price_override_usd === null || row.price_override_usd === undefined
          ? null
          : Number(row.price_override_usd),
    };
  }
  return map;
}

export async function upsertOwnership(userId, cardId, patch) {
  const next = {
    copies: patch.copies ?? 0,
    iconic: Boolean(patch.iconic),
    price_override_usd:
      patch.price_override_usd === undefined ? null : patch.price_override_usd,
  };

  if (!isConfigured || !userId) {
    const map = readLocalMap();
    map[cardId] = next;
    writeLocalMap(map);
    return next;
  }

  const { error } = await supabase.from('ownership').upsert({
    user_id: userId,
    card_id: cardId,
    copies: next.copies,
    iconic: next.iconic,
    price_override_usd: next.price_override_usd,
  });
  if (error) throw error;
  return next;
}

export async function loadSettings(userId) {
  if (!isConfigured || !userId) {
    try {
      return {
        ...defaultSettings(),
        ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'),
      };
    } catch {
      return defaultSettings();
    }
  }
  const { data, error } = await supabase
    .from('user_settings')
    .select('completion_mode, value_count_copies')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return defaultSettings();
  return {
    completion_mode: data.completion_mode || 'ms01',
    value_count_copies: Boolean(data.value_count_copies),
  };
}

export async function saveSettings(userId, settings) {
  const next = { ...defaultSettings(), ...settings };
  if (!isConfigured || !userId) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    return next;
  }
  const { error } = await supabase.from('user_settings').upsert({
    user_id: userId,
    completion_mode: next.completion_mode,
    value_count_copies: next.value_count_copies,
  });
  if (error) throw error;
  return next;
}

export async function loadCatalog() {
  if (isConfigured) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    if (data?.length) return data;
  }
  const res = await fetch(asset('data/cards.json'));
  if (!res.ok) throw new Error('Failed to load card catalog');
  return res.json();
}

export async function loadPrices() {
  if (isConfigured) {
    const { data, error } = await supabase
      .from('card_prices')
      .select('card_id, variant, usd, updated_at');
    if (error) throw error;
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
  return { map: {}, updatedAt: null };
}
