# One-time Supabase setup

Your project URL works. **Tables were never created** — that is why you saw  
`Could not find the table 'public.ownership'`.

## 1. Run the SQL (required)

1. Open: https://supabase.com/dashboard/project/orrxumsntcbuqjzldmos/sql/new  
2. Sign in (Continue with GitHub is fine).  
3. Open this file in the repo: [`supabase/setup-all.sql`](supabase/setup-all.sql)  
4. Select all → copy → paste into the SQL editor → click **Run**.  
5. You should see success (no red errors).  

That creates `cards`, `card_prices`, `ownership`, `user_settings` and seeds the catalog.

## 2. Auth URLs (stops localhost redirects)

https://supabase.com/dashboard/project/orrxumsntcbuqjzldmos/auth/url-configuration

- **Site URL:** `https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/`
- **Redirect URLs:**  
  `https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/**`

Delete `http://localhost:3000` if it is listed.

## 3. Sign in again

1. Open https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/  
2. Request a **new** magic link (old emails may still point at localhost).  
3. After SQL is run, the red “tables missing” banner should disappear and ownership syncs across devices.
