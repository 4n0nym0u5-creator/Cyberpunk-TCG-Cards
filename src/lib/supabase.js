import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(
  url &&
    anon &&
    !url.includes('YOUR_PROJECT') &&
    !anon.includes('your_anon_key'),
);

/** Full app origin including Vite base path (needed for GitHub Pages). */
export function appRedirectUrl() {
  const base = import.meta.env.BASE_URL || '/';
  return new URL(base, window.location.origin).href.replace(/\/?$/, '/');
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
