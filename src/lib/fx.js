/** Cached USD→AUD mid-market rate for display conversion (TCGPlayer stays USD). */

const CACHE_KEY = 'ncb-usd-aud';
const DAY_MS = 24 * 60 * 60 * 1000;
/** Used when Frankfurter is unreachable. */
export const FALLBACK_USD_AUD = 1.55;

function readCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!raw || !Number.isFinite(raw.rate) || raw.rate <= 0) return null;
    return raw;
  } catch {
    return null;
  }
}

/**
 * @returns {Promise<{ rate: number, date: string|null, fallback?: boolean, at: number }>}
 */
export async function loadUsdToAud() {
  const cached = readCache();
  if (cached && cached.at && Date.now() - cached.at < DAY_MS) {
    return {
      rate: cached.rate,
      date: cached.date || null,
      at: cached.at,
      fallback: Boolean(cached.fallback),
    };
  }

  try {
    const res = await fetch('https://api.frankfurter.dev/v2/rate/usd/aud');
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const rate = Number(data.rate);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('bad rate');
    const pack = {
      rate,
      date: data.date || null,
      at: Date.now(),
      fallback: false,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(pack));
    return pack;
  } catch {
    if (cached?.rate) {
      return {
        rate: cached.rate,
        date: cached.date || null,
        at: cached.at || 0,
        fallback: true,
      };
    }
    return {
      rate: FALLBACK_USD_AUD,
      date: null,
      at: 0,
      fallback: true,
    };
  }
}
