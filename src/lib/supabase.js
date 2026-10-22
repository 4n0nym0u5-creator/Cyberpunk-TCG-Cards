import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(
  url &&
    anon &&
    !url.includes('YOUR_PROJECT') &&
    !anon.includes('your_anon_key'),
);

/** Always send magic links to the published site (never localhost). */
export const PRODUCTION_APP_URL =
  'https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/';

/** Full app URL for auth redirects. */
export function appRedirectUrl() {
  return PRODUCTION_APP_URL;
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
