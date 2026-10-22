# Night City Binder

Collection tracker for **Cyberpunk TCG — Welcome to Night City (Beta)**.

- MS01 checklist in collector order (140 cards + showcase extras)
- Copies **1 / 2 / 3** + Iconic **A** (31 Iconic Rares)
- 3×3 binder map from your slot codes (`L07 s4F1` → sheet 4 front row 1)
- USD market value (shared prices + per-card overrides)
- Cross-device sync via **Supabase** (Postgres + magic-link auth)

## Brand art

Official logos, banner, and wallpapers from [Cyberpunk TCG marketing materials](https://cyberpunktcg.com/marketing-materials) live in `public/brand/`. Fan tool only — trademarks belong to CD PROJEKT / R. Talsorian / the Cyberpunk TCG publishers.

## Live site

https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/

GitHub Pages deploys automatically from `main` via Actions (built Vite `dist/`). In repo **Settings → Pages**, set Source to **GitHub Actions**.

## Quick start (demo, no cloud)

```bash
npm install
npm run dev
```

Open the URL Vite prints, click **Enter demo mode**. Ownership saves in `localStorage` only.

## Cross-device setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run in order:
   - [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
   - [`supabase/seed.sql`](supabase/seed.sql)
3. Copy [`.env.example`](.env.example) → `.env` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Auth → URL configuration: add your local origin (e.g. `http://localhost:5173`) to redirect URLs.
5. `npm run dev` → sign in with email magic link on each device.

### Refresh USD prices

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_service_role \
npm run prices
```

Optional manual file: `npm run prices -- ./data/prices-manual.json`  
Format: `{ "MS01-001": { "base": 0.77, "iconic": 45.0 } }`.

### Regenerate catalog seed

After editing [`data/cards-raw.mjs`](data/cards-raw.mjs):

```bash
npm run seed:generate
```

Re-run `supabase/seed.sql` in the SQL editor (or truncate + seed).

## How to use

| Control | Meaning |
|--------|---------|
| **1 2 3** | Copies owned (row greys at 3/3) |
| **A** | Iconic alt art (dashed) |
| **Slot** | Binder coordinate — e.g. `L07 s4F1` = Legends #7, sheet 4, front, row 1 |
| **Print checklist** | Hides chrome; paper-friendly layout |

**Progress:** MS01 base **140** and Iconic **31** are tracked separately (171-card set).  
**Showcase** (sheets 1–2): promos, Nova toppers, starter-deck exclusives — not part of the 140. Toggle **Everything Beta** on the Dashboard to include them.  
**Judge promos** of Bombus / MaxTac Squadron / Delamain belong in showcase, not MS01.

## Binder zones

| Sheets | Zone |
|--------|------|
| 1–2 | Showcase |
| 3–7 | Legends (20) |
| 8–20 | Units (69) |
| 21–23 | Gear (17) |
| 24–29 | Programs (34) |
| 30–48 | Spare |

Colour bands: Red 001–035 · Yellow 036–070 · Green 071–105 · Blue 106–140.
