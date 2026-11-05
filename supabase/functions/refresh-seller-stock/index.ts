/**
 * Pull Cyberpunk TCG singles from AU-reachable shops and upsert seller_stock.
 * Invoke: POST /functions/v1/refresh-seller-stock
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const UA = 'NightCityBinder/1.0';

const SELLERS = {
  punkouter: {
    id: 'punkouter',
    currency: 'USD',
    productsJsonBase:
      'https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock/products.json',
    productOrigin: 'https://punkouter.com',
  },
  mint: {
    id: 'mint',
    currency: 'AUD',
    productsJsonBase:
      'https://mintcollectables.com.au/collections/cyberpunk-tcg/products.json',
    productOrigin: 'https://mintcollectables.com.au',
  },
  obsession: {
    id: 'obsession',
    currency: 'AUD',
    collectionUrl:
      'https://obsessiongaming.com.au/collections/cyberpunk-tcg-singles',
  },
} as const;

const ICONIC_RE =
  /\b(?:IO|ILegend|Iconic(?:\s+Other)?)\b|\(IO\)|\(Iconic\)|Iconic\s*A\b/i;
const SEALED_RE =
  /\b(?:booster\s*box|starter\s*deck|preorder|sealed|case\b|display)\b/i;
const RETAIL_RE = /\bretail\b/i;
const BETA_RE =
  /\bbeta\b|\bpre-?release\b|\bprr\b|\bwnc-beta\b|\bms01b\b|\bwelcome to night city\s*[-–—]?\s*beta\b/i;
const CARD_NUM_RE =
  /(?:^|[^A-Za-z0-9])(?:#|\[)?B0*(\d{1,3}[a-z]?)\b|\bNumber:\s*B0*(\d{1,3}[a-z]?)\b/i;
const PRR_RE = /\bPRR\s*[-–—]?\s*0*(\d{1,3})\b/i;

type Card = { id: string; number: string; name: string; set_code: string; sort_order: number };

function normalizeNumber(raw: string | null | undefined) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/^B/i, '').replace(/^MS01-?/i, '');
  const m = s.match(/^0*(\d+)([a-z]?)$/i);
  if (!m) return s.toLowerCase() || null;
  const digits = m[1];
  const letter = (m[2] || '').toLowerCase();
  if (letter) return `${digits}${letter}`;
  return digits.padStart(3, '0');
}

function buildCatalogIndex(cards: Card[]) {
  const byNumber = new Map<string, Card[]>();
  const byId = new Map<string, Card>();
  for (const c of cards) {
    byId.set(c.id, c);
    const n = normalizeNumber(c.number);
    if (n) {
      if (!byNumber.has(n)) byNumber.set(n, []);
      byNumber.get(n)!.push(c);
    }
    const idTail = c.id.includes('-') ? c.id.split('-').pop() : null;
    if (idTail) {
      const t = normalizeNumber(idTail);
      if (t && t !== n) {
        if (!byNumber.has(t)) byNumber.set(t, []);
        byNumber.get(t)!.push(c);
      }
    }
  }
  return { byNumber, byId };
}

function extractCardNumber(title: string, tags: string[] = []) {
  const blob = [title, ...tags].filter(Boolean).join(' | ');
  const prr = blob.match(PRR_RE);
  if (prr) return normalizeNumber(prr[1]);
  const m = blob.match(CARD_NUM_RE);
  if (m) return normalizeNumber(m[1] || m[2]);
  return null;
}

function detectEdition(title: string, tags: string[] = [], vendor = '') {
  const blob = [title, vendor, ...tags].filter(Boolean).join(' | ');
  if (SEALED_RE.test(blob) && !/\bsingles?\b/i.test(blob)) return null;
  if (ICONIC_RE.test(blob)) return 'iconic';
  if (RETAIL_RE.test(blob) && !BETA_RE.test(blob)) return 'retail';
  if (BETA_RE.test(blob)) return 'beta';
  if (/\bcyberpunk\b/i.test(blob) || /\bwelcome to night city\b/i.test(blob)) {
    return 'beta';
  }
  return null;
}

function titleTokens(title: string) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9:]+/g, ' ')
    .split(/\s+/)
    .filter(
      (t) =>
        t.length > 2 &&
        !/^(the|and|for|with|from|beta|foil|near|mint|epic|rare|common|secret|nova|unit|legend|gear|program|welcome|night|city|wnc|ilegend|iconic)$/.test(
          t,
        ),
    );
}

function nameScore(title: string, card: Card) {
  const hay = titleTokens(title);
  if (!hay.length) return 0;
  const needle = titleTokens(card.name);
  if (!needle.length) return 0;
  let hit = 0;
  for (const t of needle) if (hay.includes(t)) hit += 1;
  return hit / needle.length;
}

function matchListing(
  catalogIndex: ReturnType<typeof buildCatalogIndex>,
  { title, tags = [], vendor = '' }: { title: string; tags?: string[]; vendor?: string },
) {
  if (!title) return null;
  const edition = detectEdition(title, tags, vendor);
  if (!edition) return null;
  const blob = [title, ...tags].join(' ');
  const isBoxTopper = /\bbox\s*toppers?\b/i.test(blob);
  const num = extractCardNumber(title, tags);
  let candidates: Card[] = num ? [...(catalogIndex.byNumber.get(num) || [])] : [];

  if (isBoxTopper || candidates.length === 0) {
    const scored = [...catalogIndex.byId.values()]
      .map((c) => ({ c, s: nameScore(title, c) }))
      .filter((x) => x.s >= 0.5)
      .sort((a, b) => b.s - a.s || a.c.sort_order - b.c.sort_order);
    if (scored.length) return { card_id: scored[0].c.id, edition };
    if (isBoxTopper) return null;
  }

  if (!candidates.length) {
    const scored = [...catalogIndex.byId.values()]
      .filter((c) => c.set_code === 'MS01')
      .map((c) => ({ c, s: nameScore(title, c) }))
      .filter((x) => x.s >= 0.6)
      .sort((a, b) => b.s - a.s);
    if (!scored.length) return null;
    return { card_id: scored[0].c.id, edition };
  }

  if (candidates.length === 1) {
    const only = candidates[0];
    if (nameScore(title, only) < 0.35 && titleTokens(title).length >= 2) {
      const scored = [...catalogIndex.byId.values()]
        .map((c) => ({ c, s: nameScore(title, c) }))
        .filter((x) => x.s >= 0.5)
        .sort((a, b) => b.s - a.s);
      if (scored.length) return { card_id: scored[0].c.id, edition };
      return null;
    }
    return { card_id: only.id, edition };
  }

  candidates.sort((a, b) => {
    const ds = nameScore(title, b) - nameScore(title, a);
    if (Math.abs(ds) > 0.05) return ds;
    if (a.set_code === 'MS01' && b.set_code !== 'MS01') return -1;
    if (b.set_code === 'MS01' && a.set_code !== 'MS01') return 1;
    return 0;
  });
  const top = candidates[0];
  if (nameScore(title, top) < 0.35) return null;
  return { card_id: top.id, edition };
}

async function fetchShopify(productsJsonBase: string, origin: string, sellerId: string, currency: string) {
  const out: Array<Record<string, unknown>> = [];
  for (let page = 1; page <= 20; page += 1) {
    const res = await fetch(`${productsJsonBase}?limit=250&page=${page}`, {
      headers: { Accept: 'application/json', 'User-Agent': UA },
    });
    if (!res.ok) throw new Error(`${sellerId} shopify ${res.status}`);
    const data = await res.json();
    const products = data.products || [];
    if (!products.length) break;
    for (const p of products) {
      const variant = (p.variants || []).find((v: { available: boolean }) => v.available) ||
        p.variants?.[0];
      out.push({
        seller_id: sellerId,
        currency,
        title: p.title,
        handle: p.handle,
        tags: p.tags || [],
        vendor: p.vendor || '',
        available: Boolean(variant?.available),
        price: variant?.price != null ? Number(variant.price) : null,
        productUrl: `${origin}/products/${p.handle}`,
      });
    }
    if (products.length < 250) break;
  }
  return out;
}

function parseObsessionHtml(html: string) {
  const byHandle = new Map<string, Record<string, unknown>>();
  const re =
    /handle\\":\\"([^\\]+)\\"[^\\]*(?:\\.|[^\\])*?price\\":\\"([^\\]*)\\"[^\\]*(?:\\.|[^\\])*?availableForSale\\":(true|false)[^\\]*(?:\\.|[^\\])*?tags\\":\[([^\]]*)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const handle = m[1];
    const price = Number(m[2]);
    byHandle.set(handle, {
      handle,
      title: null,
      tags: [...m[4].matchAll(/\\"([^\\]+)\\"/g)].map((x) => x[1]),
      vendor: 'Obsession Gaming',
      available: m[3] === 'true',
      price: Number.isFinite(price) ? price : null,
      productUrl: `https://obsessiongaming.com.au/products/${handle}`,
      seller_id: 'obsession',
      currency: 'AUD',
    });
  }
  const titleRe =
    /href="(\/products\/([^"]+))"[^>]*>[\s\S]*?>([^<]*(?:WNC-BETA|Welcome to Night City|Cyberpunk)[^<]*)</g;
  let t: RegExpExecArray | null;
  while ((t = titleRe.exec(html))) {
    const handle = t[2];
    const title = t[3]
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
    const row = byHandle.get(handle) || {
      handle,
      tags: ['Cyberpunk TCG', 'Welcome to Night City - Beta'],
      vendor: 'Obsession Gaming',
      available: true,
      price: null,
      productUrl: `https://obsessiongaming.com.au/products/${handle}`,
      seller_id: 'obsession',
      currency: 'AUD',
    };
    row.title = title;
    byHandle.set(handle, row);
  }
  return [...byHandle.values()].map((row) => ({
    ...row,
    title: (row.title as string) || String(row.handle).replace(/-/g, ' '),
  }));
}

async function fetchAllProducts() {
  const punk = await fetchShopify(
    SELLERS.punkouter.productsJsonBase,
    SELLERS.punkouter.productOrigin,
    'punkouter',
    'USD',
  );
  const mint = await fetchShopify(
    SELLERS.mint.productsJsonBase,
    SELLERS.mint.productOrigin,
    'mint',
    'AUD',
  );
  const res = await fetch(SELLERS.obsession.collectionUrl, {
    headers: { Accept: 'text/html', 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`obsession ${res.status}`);
  const obsession = parseObsessionHtml(await res.text());
  return [...punk, ...mint, ...obsession];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: cards, error: cardsErr } = await admin
      .from('cards')
      .select('id, number, name, set_code, sort_order');
    if (cardsErr) throw cardsErr;
    if (!cards?.length) throw new Error('cards table empty — seed catalog first');

    const catalogIndex = buildCatalogIndex(cards as Card[]);
    const raw = await fetchAllProducts();
    const fetchedAt = new Date().toISOString();
    const best = new Map<string, Record<string, unknown>>();

    for (const p of raw) {
      const hit = matchListing(catalogIndex, {
        title: String(p.title || ''),
        tags: (p.tags as string[]) || [],
        vendor: String(p.vendor || ''),
      });
      if (!hit) continue;
      const row = {
        card_id: hit.card_id,
        edition: hit.edition,
        seller_id: p.seller_id,
        title: p.title,
        url: p.productUrl,
        price: p.price,
        currency: p.currency,
        available: Boolean(p.available),
        fetched_at: fetchedAt,
      };
      const key = `${row.card_id}|${row.edition}|${row.seller_id}`;
      const prev = best.get(key);
      if (!prev) {
        best.set(key, row);
        continue;
      }
      if (row.available && !prev.available) {
        best.set(key, row);
        continue;
      }
      if (row.available === prev.available) {
        const a = (row.price as number) ?? Infinity;
        const b = (prev.price as number) ?? Infinity;
        if (a < b) best.set(key, row);
      }
    }

    const rows = [...best.values()];
    // Replace snapshot: delete all then upsert
    const { error: delErr } = await admin.from('seller_stock').delete().neq('card_id', '');
    if (delErr) throw delErr;
    if (rows.length) {
      const { error: upErr } = await admin.from('seller_stock').upsert(rows);
      if (upErr) throw upErr;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        updatedAt: fetchedAt,
        raw: raw.length,
        listings: rows.length,
        available: rows.filter((r) => r.available).length,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
