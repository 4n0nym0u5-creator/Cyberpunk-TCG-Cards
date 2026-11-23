/**
 * Fetch classification tags from ripperdeck.gg and map onto our catalog ids.
 * Writes data/card-tags.json + public/data/card-tags.json.
 *
 *   node scripts/build-card-tags.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cards = JSON.parse(readFileSync(join(root, 'data/cards.json'), 'utf8'));

const API = 'https://ripperdeck.gg/api/cards';

function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[:'']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normNum(n) {
  return String(n || '')
    .replace(/^[βß]/i, '')
    .replace(/^0+/, '')
    .toLowerCase();
}

function uniqTags(list) {
  const seen = new Set();
  const out = [];
  for (const t of list || []) {
    const tag = String(t || '').trim();
    if (!tag) continue;
    const key = tag.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

const res = await fetch(API, {
  headers: { Accept: 'application/json', 'User-Agent': 'NightCityBinder/1.0' },
});
if (!res.ok) throw new Error(`ripperdeck ${res.status}`);
const rows = await res.json();
if (!Array.isArray(rows)) throw new Error('unexpected ripperdeck payload');

/** Prefer EN retail/current printings. */
function scoreRow(r) {
  let s = 0;
  const set = r.set_code || '';
  if (set === 'welcometonightcityretail') s += 50;
  else if (set === 'welcometonightcitybeta') s += 40;
  else if (set === 'theheistretailstarterdeck') s += 45;
  else if (set === 'embracingpowerretailstarterdeck') s += 45;
  else if (set === 'boxtoppersbeta') s += 48;
  else if (set === 'boxtoppersretail') s += 48;
  else if (set === 'nightcitybrawls1') s += 35;
  else if (set === 'judgepromos') s += 40;
  else if (set === 'PRM01' || set === 'PROMO') s += 30;
  if (r.is_default_printing) s += 5;
  if (r.is_current) s += 3;
  if (/-fr$/i.test(set) || set.endsWith('-FR')) s -= 20;
  return s;
}

const bySetNum = new Map(); // `${set}|${num}` → best row
const byName = new Map(); // normName → best row

for (const r of rows) {
  const tags = uniqTags(r.classification);
  if (!tags.length) continue;
  const set = r.set_code || '';
  const num = normNum(r.card_number);
  const sc = scoreRow(r);
  if (set && num) {
    const key = `${set}|${num}`;
    const prev = bySetNum.get(key);
    if (!prev || sc > prev.score) bySetNum.set(key, { row: r, tags, score: sc });
  }
  const nk = normName(r.name);
  if (nk) {
    const prev = byName.get(nk);
    if (!prev || sc > prev.score) byName.set(nk, { row: r, tags, score: sc });
  }
}

function pick(...candidates) {
  let best = null;
  for (const c of candidates) {
    if (!c) continue;
    if (!best || c.score > best.score) best = c;
  }
  return best?.tags || [];
}

function fromSet(set, num) {
  return bySetNum.get(`${set}|${normNum(num)}`);
}

const tagsById = {};
let hit = 0;

for (const c of cards) {
  let tags = [];
  if (c.set_code === 'MS01') {
    const num = String(c.number || '').replace(/^MS01-/, '');
    tags = pick(
      fromSet('welcometonightcityretail', num),
      fromSet('welcometonightcitybeta', num),
      byName.get(normName(c.name)),
    );
  } else if (c.id.startsWith('SD01-')) {
    const num = c.id.replace('SD01-', '');
    tags = pick(
      fromSet('theheistretailstarterdeck', num),
      fromSet('theheistbetastarterdeck', num),
      byName.get(normName(c.name)),
    );
  } else if (c.id.startsWith('SD02-')) {
    const num = c.id.replace('SD02-', '');
    tags = pick(
      fromSet('embracingpowerretailstarterdeck', num),
      fromSet('embracingpowerbetastarterdeck', num),
      byName.get(normName(c.name)),
    );
  } else if (c.id === 'N001' || /lucyna|lucy/i.test(c.name)) {
    tags = pick(
      fromSet('PRM01', '004a'),
      fromSet('PRM01', '004b'),
      fromSet('PRM01', '004'),
      byName.get(normName('Lucyna Kushinada Fresh Beginnings')),
      byName.get(normName(c.name)),
    );
  } else if (c.id === 'PRM01-005' || /rebecca/i.test(c.name)) {
    tags = pick(fromSet('PRM01', '005'), byName.get(normName(c.name)));
  } else if (c.id.startsWith('BOXTOPPERS-BETA')) {
    const num = String(c.number || '').replace(/^β/i, '');
    tags = pick(
      fromSet('boxtoppersbeta', `β${num}`),
      fromSet('boxtoppersbeta', num),
      byName.get(normName(c.name)),
    );
  } else if (c.id.startsWith('BOXTOPPERS-RETAIL')) {
    const num = String(c.number || '').replace(/^0+/, '');
    tags = pick(
      fromSet('boxtoppersretail', num),
      fromSet('boxtoppersretail', String(c.number)),
      byName.get(normName(c.name)),
    );
  } else if (c.id.startsWith('JUDGEPROMO')) {
    const num = c.id.replace('JUDGEPROMOS-', '');
    tags = pick(fromSet('judgepromos', num), byName.get(normName(c.name)));
  } else if (c.set_code === 'NCB') {
    tags = pick(byName.get(normName(c.name)), fromSet('nightcitybrawls1', c.number));
  } else {
    tags = pick(byName.get(normName(c.name)));
  }

  tags = uniqTags(tags);
  if (tags.length) {
    tagsById[c.id] = tags;
    hit += 1;
  }
}

const payload = {
  updatedAt: new Date().toISOString(),
  source: 'ripperdeck.gg/api/cards',
  tagged: hit,
  total: cards.length,
  tags: tagsById,
};

mkdirSync(join(root, 'public/data'), { recursive: true });
const path = join(root, 'data/card-tags.json');
writeFileSync(path, JSON.stringify(payload, null, 2));
copyFileSync(path, join(root, 'public/data/card-tags.json'));

const allTags = new Set();
for (const list of Object.values(tagsById)) for (const t of list) allTags.add(t);
console.log(
  JSON.stringify(
    {
      tagged: hit,
      total: cards.length,
      uniqueTags: allTags.size,
      sample: {
        'MS01-001': tagsById['MS01-001'],
        'MS01-072': tagsById['MS01-072'],
        'MS01-075': tagsById['MS01-075'],
        N001: tagsById.N001,
        'NIGHTCITYBRAWL-S1-00': tagsById['NIGHTCITYBRAWL-S1-00'],
      },
      path,
    },
    null,
    2,
  ),
);
