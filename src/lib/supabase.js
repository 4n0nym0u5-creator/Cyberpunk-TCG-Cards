import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(
  url &&
    anon &&
    !url.includes('YOUR_PROJECT') &&
    !anon.includes('your_anon_key'),
);

export const PRODUCTION_APP_URL =
  'https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/';

/** Where auth emails (confirm / recovery) must return — project Pages path, not user root. */
export function getAuthRedirectUrl() {
  if (typeof window === 'undefined') return PRODUCTION_APP_URL;
  const base = import.meta.env.BASE_URL || '/';
  return new URL(base, window.location.origin).href;
}

export const supabase = isConfigured
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;
