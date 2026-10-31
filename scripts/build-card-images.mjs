/**
 * Map each catalog card to the correct TCGPlayer product image.
 * MS01 base: exact collector number (B001 → MS01-001, B005a → MS01-005a).
 * MS01 iconic: exact normalized name against Iconic Legend/Secret/Other printings.
 * Showcase: starter exclusives (SD*) use starter Epic as base + box-topper Nova as Iconic;
 *           promos / Nova toppers / judge stamps prefer their promo set art.
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cards = JSON.parse(readFileSync(join(root, 'data/cards.json'), 'utf8'));
const raw = JSON.parse(readFileSync(join(root, 'data/tcgplayer-beta-raw.json'), 'utf8'));
const extras = JSON.parse(readFileSync(join(root, 'data/tcgplayer-extras-raw.json'), 'utf8'));

function toOurNumber(tcgNum) {
  if (!tcgNum) return null;
  const m = String(tcgNum).match(/^B0*(\d+[A-Za-z]?)$/i);
  if (!m) return null;
  const rawN = m[1];
  const letter = (rawN.match(/[A-Za-z]$/) || [''])[0].toLowerCase();
  const digits = rawN.replace(/[A-Za-z]$/, '');
  return digits.padStart(3, '0') + letter;
}

function normName(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(
      /\((epic|secret|rare|uncommon|common|ilegend|isecret|io|nova|promo|iconic[^)]*|\d+)\)/gi,
      '',
    )
    .replace(/[:\-–—]/g, ' ')
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip gender / printing suffixes so Streetkid (a)/(b) share one Iconic art. */
function normNameForIconic(s) {
  return normName(s).replace(/\s+[ab]$/i, '').trim();
}

function img(productId, meta = {}) {
  return {
    productId,
    url: `https://product-images.tcgplayer.com/fit-in/437x437/${productId}.jpg`,
    urlHi: `https://product-images.tcgplayer.com/${productId}.jpg`,
    ...meta,
  };
}

function isStarterExclusive(cardId) {
  return String(cardId).startsWith('SD01') || String(cardId).startsWith('SD02');
}

/** Prefer starter-deck Epic for SD* base (not box-topper Nova / Iconic alt). */
function showcaseBaseScore(row, cardId) {
  let score = 0;
  const set = row.setName || '';
  const rarity = row.rarity || '';
  if (isStarterExclusive(cardId)) {
    if (/starter/i.test(set)) score += 100;
    if (cardId.startsWith('SD01') && /heist/i.test(set)) score += 40;
    if (cardId.startsWith('SD02') && /embracing/i.test(set)) score += 40;
    if (/epic/i.test(rarity)) score += 20;
    if (/uncommon|common/i.test(rarity)) score += 10;
    // Box-topper Nova is the Iconic alt — never use as base.
    if (/nova/i.test(rarity) || /box-toppers/i.test(set)) score -= 120;
    return score;
  }
  if (/nova/i.test(rarity)) score += 50;
  if (/box-toppers/i.test(set)) score += 40;
  if (/set-1-promos/i.test(set)) score += 40;
  if (/night-city-brawl/i.test(set)) score += 35;
  if (/pre-release-retail/i.test(set)) score += 45;
  if (/pre-release/i.test(set)) score += 10;
  if (/starter/i.test(set)) score -= 20;
  if (cardId.startsWith('PRM') && /promo|box-toppers/i.test(set)) score += 20;
  if (cardId.startsWith('NIGHTCITYBRAWL') && /brawl/i.test(set)) score += 30;
  if (cardId.startsWith('JUDGE') && /brawl|promo/i.test(set)) score += 15;
  if (cardId.startsWith('PRERELEASE') && /pre-release/i.test(set)) score += 40;
  return score;
}

/** Box-topper Nova Rare = Iconic alt for starter Legends. */
function showcaseIconicScore(row) {
  let score = 0;
  const set = row.setName || '';
  const rarity = row.rarity || '';
  if (/box-toppers/i.test(set)) score += 80;
  if (/nova/i.test(rarity)) score += 50;
  if (/starter/i.test(set)) score -= 100;
  return score;
}

const images = {};
const ms01 = cards.filter((c) => c.set_code === 'MS01');
const showcase = cards.filter((c) => c.set_code === 'showcase');

// --- MS01 base by collector number ---
for (const r of raw.filter((x) => !/iconic/i.test(x.rarity))) {
  const n = toOurNumber(r.number);
  if (!n) continue;
  const id = `MS01-${n}`;
  if (!ms01.some((c) => c.id === id)) continue;
  images[id] = images[id] || {};
  images[id].base = img(r.productId, {
    tcgNumber: r.number,
    tcgName: r.name,
    rarity: r.rarity,
  });
}

// --- MS01 iconic by normalized name (a/b variants share one Iconic) ---
const byNorm = new Map();
for (const c of ms01) {
  const key = normNameForIconic(c.name);
  if (!byNorm.has(key)) byNorm.set(key, []);
  byNorm.get(key).push(c);
}
for (const r of raw.filter((x) => /iconic/i.test(x.rarity))) {
  const matches = byNorm.get(normNameForIconic(r.name)) || [];
  if (!matches.length) {
    console.warn('ICONIC UNMATCHED:', r.name);
    continue;
  }
  for (const card of matches) {
    images[card.id] = images[card.id] || {};
    images[card.id].iconic = img(r.productId, {
      tcgNumber: r.number,
      tcgName: r.name,
      rarity: r.rarity,
    });
  }
}

// --- Showcase: base (+ Iconic for starter Legends with alts) ---
for (const card of showcase) {
  const key = normName(
    card.name.replace(/\s*\((Judge Promo|Pre-release)\)\s*/i, ''),
  );
  const candidates = extras.filter((e) => normName(e.name) === key);
  if (!candidates.length) continue;
  candidates.sort(
    (a, b) => showcaseBaseScore(b, card.id) - showcaseBaseScore(a, card.id),
  );
  const best = candidates[0];
  images[card.id] = images[card.id] || {};
  images[card.id].base = img(best.productId, {
    tcgNumber: best.number,
    tcgName: best.name,
    rarity: best.rarity,
    setName: best.setName,
  });

  if (card.has_iconic && isStarterExclusive(card.id)) {
    const iconicCands = [...candidates].sort(
      (a, b) => showcaseIconicScore(b) - showcaseIconicScore(a),
    );
    const iconicBest = iconicCands[0];
    if (
      iconicBest &&
      showcaseIconicScore(iconicBest) > 0 &&
      iconicBest.productId !== best.productId
    ) {
      images[card.id].iconic = img(iconicBest.productId, {
        tcgNumber: iconicBest.number,
        tcgName: iconicBest.name,
        rarity: iconicBest.rarity,
        setName: iconicBest.setName,
      });
    }
  }
}

const missingBase = ms01.filter((c) => !images[c.id]?.base);
const missingShowcase = showcase.filter((c) => !images[c.id]?.base);
const iconicCount = Object.values(images).filter((v) => v.iconic).length;

console.log(
  JSON.stringify(
    {
      ms01Base: ms01.length - missingBase.length,
      iconic: iconicCount,
      showcase: showcase.length - missingShowcase.length,
      missingBase: missingBase.map((c) => c.id),
      missingShowcase: missingShowcase.map((c) => `${c.id} ${c.name}`),
      // sanity
      adamEnder: images['MS01-001']?.base?.tcgNumber,
      adamMetal: images['MS01-041']?.base?.tcgNumber,
      minotaur: images['NIGHTCITYBRAWL-S1-00']?.base,
      rebecca: images['PRM01-005']?.base?.tcgName,
      viktorBase: images['SD01-001']?.base,
      viktorIconic: images['SD01-001']?.iconic,
      vExileBase: images['SD01-012']?.base?.setName,
      vExileIconic: images['SD01-012']?.iconic?.setName,
      goroBase: images['SD02-012']?.base?.setName,
      goroIconic: images['SD02-012']?.iconic?.setName,
    },
    null,
    2,
  ),
);

if (missingBase.length) {
  console.error('FATAL: missing MS01 base images');
  process.exit(1);
}

mkdirSync(join(root, 'public/data'), { recursive: true });
const out = join(root, 'data/card-images.json');
writeFileSync(out, JSON.stringify(images, null, 2));
copyFileSync(out, join(root, 'public/data/card-images.json'));
console.log('Wrote data/card-images.json + public/data/card-images.json');
