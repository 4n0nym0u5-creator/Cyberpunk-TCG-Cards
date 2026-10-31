import { getOwn, ownedBaseCount, slotLabel } from './stats.js';
import { imageForCard } from './lib/cardImages.js';

/** Street: third-party 3×3 · 864 pockets · 48 double-sided sheets */
export const STREET_SHEETS = 48;
/** Vault: third-party 2×2 toploader · 144 pockets · 18 double-sided sheets */
export const VAULT_SHEETS = 18;
/** Sequential binder pages (each physical sheet face = one page). */
export const STREET_PAGES = STREET_SHEETS * 2;
export const VAULT_PAGES = VAULT_SHEETS * 2;

/** @deprecated use STREET_SHEETS */
export const BINDER_SHEETS = STREET_SHEETS;

/** 1-based page → physical sheet + face (odd = Front, even = Back). */
export function pageToSheetFace(page) {
  const p = Math.max(1, Number(page) || 1);
  return {
    sheet: Math.floor((p - 1) / 2) + 1,
    face: p % 2 === 1 ? 'F' : 'B',
  };
}

/** Physical sheet + face → 1-based sequential page. */
export function sheetFaceToPage(sheet, face) {
  const s = Math.max(1, Number(sheet) || 1);
  return (s - 1) * 2 + (face === 'B' ? 2 : 1);
}

export function listMs01Legends(cards) {
  return cards
    .filter((c) => c.set_code === 'MS01' && c.type === 'Legend')
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** MS01 Units / Gear / Programs for Street (showcase Units live in Vault). */
export function listStreetCards(cards) {
  return cards.filter((c) => c.set_code === 'MS01' && c.type !== 'Legend');
}

/** Street binder order: MS01 colour-tree, starting at 6th Street Recruits. */
export function listStreetBinderCards(cards) {
  return listStreetCards(cards).sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * 1-based Street page + top-row pocket (1–3) for a card column.
 * Each page holds 3 cards × playset rows (1/3, 2/3, 3/3).
 */
export function streetPageForCard(cards, cardId) {
  const list = listStreetBinderCards(cards);
  const ei = list.findIndex((c) => c.id === cardId);
  if (ei < 0) return { page: 1, pocket: 1 };
  const col = ei % 3;
  return {
    page: Math.floor(ei / 3) + 1,
    pocket: col + 1,
  };
}

/** Last Street page that still has a card (rest = spare overflow). */
export function streetLastFilledPage(cards) {
  return Math.max(1, Math.ceil(listStreetBinderCards(cards).length / 3));
}

/** Showcase Legends packed into Vault after MS01 Legends + street Iconics. */
export function listVaultExtras(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase' && c.type === 'Legend')
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** Showcase Units / promos — Vault tail after Mantis B. */
export function listVaultShowcaseStreet(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase' && c.type !== 'Legend')
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** Street cards with Beta Event B stamps (Mantis Blades) — Vault B playset after Saburo. */
export function listVaultStreetBstamps(cards) {
  return cards
    .filter((c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.has_bstamp)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Vault extras: showcase Legends (base + Iconic A), then Mantis Blades B playset,
 * then showcase Units/promos at the very back.
 */
export function listVaultExtraSlots(cards) {
  const slots = [];
  for (const card of listVaultExtras(cards)) {
    slots.push({ card, kind: 'extra' });
    if (card.has_iconic) slots.push({ card, kind: 'iconic' });
  }
  for (const card of listVaultStreetBstamps(cards)) {
    for (let n = 1; n <= 3; n += 1) {
      slots.push({ card, kind: 'bstamp', copyNeed: n });
    }
  }
  for (const card of listVaultShowcaseStreet(cards)) {
    slots.push({ card, kind: 'extra' });
  }
  return slots;
}

/** MS01 Units / Gear / Programs that have an Iconic alt — Vault Iconic A pockets. */
export function listVaultStreetIconics(cards) {
  return cards
    .filter((c) => c.set_code === 'MS01' && c.type !== 'Legend' && c.has_iconic)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** How many vault faces are reserved for MS01 Legends (one legend per face). */
export function vaultLegendFaceCount(cards) {
  return listMs01Legends(cards).length;
}

export function vaultStreetIconicFaceCount(cards) {
  return Math.ceil(listVaultStreetIconics(cards).length / 4);
}

export function vaultExtraFaceCount(cards) {
  return Math.ceil(listVaultExtraSlots(cards).length / 4);
}

function vaultExtrasStartPage(cards) {
  return vaultLegendFaceCount(cards) + vaultStreetIconicFaceCount(cards) + 1;
}

/** 1-based Vault page for a showcase / Kickstarter extra (base or Iconic A). */
export function vaultPageForExtra(cards, cardId, { iconic = false } = {}) {
  const start = vaultExtrasStartPage(cards);
  const slots = listVaultExtraSlots(cards);
  const want = iconic ? 'iconic' : 'extra';
  let ei = slots.findIndex((s) => s.card.id === cardId && s.kind === want);
  if (ei < 0) ei = slots.findIndex((s) => s.card.id === cardId);
  ei = Math.max(0, ei);
  return start + Math.floor(ei / 4);
}

/** 1-based Vault page for a non-Legend MS01 Iconic A. */
export function vaultPageForStreetIconic(cards, cardId) {
  const legendFaces = vaultLegendFaceCount(cards);
  const list = listVaultStreetIconics(cards);
  const ei = Math.max(0, list.findIndex((c) => c.id === cardId));
  return legendFaces + Math.floor(ei / 4) + 1;
}

/** Last 1-based Vault page that still has a card pocket (after that = spare overflow). */
export function vaultLastFilledPage(cards) {
  const legendFaces = vaultLegendFaceCount(cards);
  const streetFaces = vaultStreetIconicFaceCount(cards);
  const extrasFaces = vaultExtraFaceCount(cards);
  return Math.max(1, legendFaces + streetFaces + extrasFaces);
}

/**
 * Where a card lives in the binders (may be multiple: Street base + Vault Iconic A).
 * @returns {{ binder: 'vault'|'street', page: number, pocket: number|null, role: string, label: string }[]}
 */
export function binderLocationsForCard(cards, card) {
  if (!card) return [];
  const locs = [];

  if (card.set_code === 'showcase') {
    const slots = listVaultExtraSlots(cards);
    const start = vaultExtrasStartPage(cards);
    slots.forEach((slot, ei) => {
      if (slot.card.id !== card.id) return;
      const page = start + Math.floor(ei / 4);
      const pocket = (ei % 4) + 1;
      const isA = slot.kind === 'iconic';
      locs.push({
        binder: 'vault',
        page,
        pocket,
        role: isA ? 'iconic' : 'extra',
        label: isA
          ? `Vault · page ${page} · pocket ${pocket} · Iconic A`
          : `Vault · page ${page} · pocket ${pocket} · base`,
      });
    });
    return locs;
  }

  if (card.set_code === 'MS01' && card.type === 'Legend') {
    const legends = listMs01Legends(cards);
    const idx = legends.findIndex((c) => c.id === card.id);
    if (idx >= 0) {
      const page = idx + 1;
      locs.push({
        binder: 'vault',
        page,
        pocket: null,
        role: 'legend',
        label: (() => {
          const stamps = [
            card.has_bstamp ? 'B stamps' : null,
            card.has_prstamp ? 'WTNC W stamps' : null,
          ]
            .filter(Boolean)
            .join(' + ');
          return stamps
            ? `Vault · page ${page} · playset 1–3 + Iconic A · ${stamps} tracked here`
            : `Vault · page ${page} · playset 1–3 + Iconic A`;
        })(),
      });
    }
  } else if (card.set_code === 'MS01' && card.type !== 'Legend') {
    {
      const { page, pocket } = streetPageForCard(cards, card.id);
      locs.push({
        binder: 'street',
        page,
        pocket,
        role: 'street',
        label: `Street · page ${page} · column ${pocket} · playset 1–3${
          card.sheet != null && card.face ? ` · ${slotLabel(card)}` : ''
        }`,
      });
    }
    if (card.has_iconic) {
      const list = listVaultStreetIconics(cards);
      const ei = list.findIndex((c) => c.id === card.id);
      if (ei >= 0) {
        const page = vaultPageForStreetIconic(cards, card.id);
        const pocket = (ei % 4) + 1;
        locs.push({
          binder: 'vault',
          page,
          pocket,
          role: 'iconic',
          label: `Vault · page ${page} · pocket ${pocket} · Iconic A`,
        });
      }
    }
    if (card.has_bstamp) {
      const slots = listVaultExtraSlots(cards);
      const start = vaultExtrasStartPage(cards);
      slots.forEach((slot, ei) => {
        if (slot.card.id !== card.id || slot.kind !== 'bstamp') return;
        const page = start + Math.floor(ei / 4);
        const pocket = (ei % 4) + 1;
        locs.push({
          binder: 'vault',
          page,
          pocket,
          role: 'bstamp',
          label: `Vault · page ${page} · pocket ${pocket} · B ${slot.copyNeed}/3`,
        });
      });
    }
  }

  return locs;
}

/**
 * Face index 0..35 across 18 sheets × F/B.
 * Early faces: one MS01 Legend each — pockets = copy1, copy2, copy3, Iconic A.
 *   (Beta B + Pre-release WTNC W stamps fill those playset pockets via bstamp/prstamp.)
 * Next: non-Legend MS01 Iconic alts, 4 per face.
 * Remaining: showcase Legends (base + A), Mantis B, then showcase Units at the back.
 */
export function buildVaultFace(cards, sheet, face) {
  const faceIndex = (sheet - 1) * 2 + (face === 'B' ? 1 : 0);
  const pockets = [1, 2, 3, 4].map((pos) => ({
    index: pos,
    pos,
    card: null,
    kind: null, // 'copy' | 'iconic' | 'extra' | 'bstamp'
    copyNeed: null,
    streetPlayset: false,
  }));

  const legends = listMs01Legends(cards);
  const legendFaces = legends.length;

  if (faceIndex < legendFaces) {
    const legend = legends[faceIndex] || null;
    if (!legend) return pockets;
    for (let i = 0; i < 3; i += 1) {
      pockets[i].card = legend;
      pockets[i].kind = 'copy';
      pockets[i].copyNeed = i + 1;
    }
    pockets[3].card = legend;
    pockets[3].kind = 'iconic';
    pockets[3].copyNeed = null;
    return pockets;
  }

  const streetIconics = listVaultStreetIconics(cards);
  const streetFaces = Math.ceil(streetIconics.length / 4);
  if (faceIndex < legendFaces + streetFaces) {
    const start = (faceIndex - legendFaces) * 4;
    for (let i = 0; i < 4; i += 1) {
      const card = streetIconics[start + i] || null;
      if (!card) continue;
      pockets[i].card = card;
      pockets[i].kind = 'iconic';
    }
    return pockets;
  }

  const slots = listVaultExtraSlots(cards);
  const start = (faceIndex - legendFaces - streetFaces) * 4;
  for (let i = 0; i < 4; i += 1) {
    const slot = slots[start + i] || null;
    if (!slot) continue;
    pockets[i].card = slot.card;
    pockets[i].kind = slot.kind;
    pockets[i].copyNeed = slot.copyNeed ?? null;
  }
  return pockets;
}

/**
 * Street 3×3 — three MS01 cards across the top; rows below are copies 2/3 and 3/3.
 * Starts at 6th Street Recruits. Showcase Units / Iconic A / Mantis B → Vault.
 */
export function buildStreetFace(cards, sheet, face) {
  return buildStreetPage(cards, sheetFaceToPage(sheet, face));
}

/** @param {number} page 1-based sequential Street page */
export function buildStreetPage(cards, page) {
  const list = listStreetBinderCards(cards);
  const start = (Math.max(1, Number(page) || 1) - 1) * 3;
  const pockets = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const card = list[start + col] || null;
      pockets.push({
        index: row * 3 + col + 1,
        row: row + 1,
        col: col + 1,
        card,
        kind: card ? 'copy' : null,
        copyNeed: card ? row + 1 : null,
        streetPlayset: Boolean(card),
      });
    }
  }
  return pockets;
}

/** @deprecated */
export function buildFaceGrid(cards, sheet, face) {
  return buildStreetFace(cards, sheet, face);
}

export function streetZoneName(sheet, face = 'F', cards = []) {
  const page = sheetFaceToPage(sheet, face);
  const onPage = [
    ...new Map(
      buildStreetPage(cards, page)
        .filter((p) => p.card)
        .map((p) => [p.card.id, p.card]),
    ).values(),
  ];
  if (!onPage.length) return 'Overflow';
  const types = [...new Set(onPage.map((c) => c.type))];
  const bands = [...new Set(onPage.map((c) => c.band).filter(Boolean))];
  const typeLabel =
    types.length === 1 ? `${types[0]}s` : types.map((t) => `${t}s`).join(' / ');
  const bandLabel = bands.length ? ` · ${bands.join('/')}` : '';
  return `MS01 ${typeLabel}${bandLabel} · playset columns`;
}

export function vaultZoneName(sheet, face = 'F', cards = []) {
  const faceIndex = (sheet - 1) * 2 + (face === 'B' ? 1 : 0);
  const legendFaces = vaultLegendFaceCount(cards);
  if (faceIndex < legendFaces) {
    return 'MS01 Legends · playset + A';
  }
  const streetFaces = vaultStreetIconicFaceCount(cards);
  if (faceIndex < legendFaces + streetFaces) {
    return 'MS01 Iconic alts · Units / Gear / Programs';
  }
  const extrasStart = legendFaces + streetFaces;
  const extrasFaces = vaultExtraFaceCount(cards);
  if (faceIndex < extrasStart + extrasFaces) {
    const slots = listVaultExtraSlots(cards);
    const start = (faceIndex - extrasStart) * 4;
    const faceSlots = slots.slice(start, start + 4);
    if (faceSlots.some((s) => s.kind === 'bstamp')) {
      return 'Beta Event · Mantis Blades B stamps';
    }
    if (faceSlots.some((s) => s.card?.set_code === 'showcase' && s.card?.type !== 'Legend')) {
      return 'Showcase Units / promos · back of Vault';
    }
    return 'Showcase / Kickstarter · base + Iconic A';
  }
  return 'Overflow';
}

/**
 * @returns {{ filled: boolean, complete: boolean, showIconicArt: boolean, isBstamp: boolean }}
 */
function pocketFilled(ownership, pocket) {
  if (!pocket.card) {
    return { filled: false, complete: false, showIconicArt: false, isBstamp: false };
  }
  const o = getOwn(ownership, pocket.card.id);
  const total = ownedBaseCount(o);
  if (pocket.kind === 'iconic') {
    const filled = (o.iconic_copies || 0) > 0;
    return {
      filled,
      complete: filled,
      showIconicArt: true,
      isBstamp: false,
      isPrstamp: false,
    };
  }
  if (pocket.kind === 'copy') {
    // Street playset columns use regular copies only (Mantis B lives in Vault).
    if (pocket.streetPlayset) {
      const n = o.copies || 0;
      return {
        filled: n >= pocket.copyNeed,
        complete: n >= 3,
        showIconicArt: false,
        isBstamp: false,
        isPrstamp: false,
      };
    }
    const filled = total >= pocket.copyNeed;
    // Legend Vault: regulars → B stamps → WTNC W stamps.
    const afterRegular = o.copies || 0;
    const afterB = afterRegular + (o.bstamp_copies || 0);
    const isBstamp =
      filled &&
      pocket.copyNeed > afterRegular &&
      pocket.copyNeed <= afterB;
    const isPrstamp =
      filled &&
      pocket.copyNeed > afterB &&
      pocket.copyNeed <= afterB + (o.prstamp_copies || 0);
    return {
      filled,
      complete: total >= 3,
      showIconicArt: false,
      isBstamp,
      isPrstamp,
    };
  }
  if (pocket.kind === 'extra') {
    return {
      filled: total > 0,
      complete: total >= 3,
      showIconicArt: false,
      isBstamp: false,
      isPrstamp: false,
    };
  }
  if (pocket.kind === 'bstamp') {
    const need = pocket.copyNeed || 1;
    const filled = (o.bstamp_copies || 0) >= need;
    return {
      filled,
      complete: (o.bstamp_copies || 0) >= 3,
      showIconicArt: false,
      isBstamp: filled,
      isPrstamp: false,
    };
  }
  return {
    filled: total > 0,
    complete: total >= 3,
    showIconicArt: false,
    isBstamp: false,
    isPrstamp: false,
  };
}

export function renderBinder(root, state, handlers) {
  const mode = state.binderMode === 'vault' ? 'vault' : 'street';
  const { cards, ownership } = state;
  const maxPages = mode === 'vault' ? VAULT_PAGES : STREET_PAGES;
  const page = Math.min(Math.max(1, state.binderPage || 1), maxPages);
  const { sheet, face } = pageToSheetFace(page);

  const pockets =
    mode === 'vault' ? buildVaultFace(cards, sheet, face) : buildStreetFace(cards, sheet, face);

  const gridClass = mode === 'vault' ? 'binder-grid binder-grid-2x2' : 'binder-grid binder-grid-3x3';
  const legendFaces = mode === 'vault' ? vaultLegendFaceCount(cards) : 0;
  const lastFilled =
    mode === 'vault' ? vaultLastFilledPage(cards) : streetLastFilledPage(cards);
  const zone =
    mode === 'vault'
      ? vaultZoneName(sheet, face, cards)
      : streetZoneName(sheet, face, cards);
  const eyebrow =
    mode === 'vault'
      ? `Vault · 2×2 toploader · 144 pockets · ${VAULT_PAGES} pages · cards through p${lastFilled}`
      : `Street · 3×3 · 864 pockets · ${STREET_PAGES} pages · cards through p${lastFilled}`;

  root.innerHTML = `
    <section class="panel binder-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h2>Page ${page}</h2>
          <p class="muted">${escapeHtml(zone)}${
            page > lastFilled
              ? ` · spare overflow (last cards on page ${lastFilled})`
              : ''
          }</p>
        </div>
        <div class="binder-controls">
          <div class="seg" role="group" aria-label="Binder">
            <button type="button" class="seg-btn ${mode === 'street' ? 'on' : ''}" data-binder-mode="street">Street</button>
            <button type="button" class="seg-btn ${mode === 'vault' ? 'on' : ''}" data-binder-mode="vault">Vault</button>
          </div>
          <button type="button" class="btn ghost" data-binder="prev" ${page <= 1 ? 'disabled' : ''}>←</button>
          <label class="sheet-jump">
            <span class="sr-only">Page</span>
            <input type="number" min="1" max="${maxPages}" value="${page}" data-binder="jump" />
          </label>
          <button type="button" class="btn ghost" data-binder="next" ${page >= maxPages ? 'disabled' : ''}>→</button>
        </div>
      </header>

      <div class="binder-page" data-page="${page}" data-mode="${mode}">
        <div class="${gridClass}">
          ${pockets
            .map((p) => {
              if (!p.card) {
                return `<div class="pocket empty" title="Spare pocket"><span class="pocket-idx">${p.index}</span><span class="pocket-spare">spare</span></div>`;
              }
              const { filled, complete, showIconicArt, isBstamp, isPrstamp } =
                pocketFilled(ownership, p);
              const wantIconic = p.kind === 'iconic' || showIconicArt;
              const art =
                imageForCard(p.card.id, { iconic: wantIconic }) ||
                (wantIconic ? null : imageForCard(p.card.id, { iconic: false }));
              const artUrl = art?.url || '';
              const stampSuffix = isBstamp ? 'B' : isPrstamp ? 'W' : '';
              const roleLabel =
                p.kind === 'iconic'
                  ? 'A'
                  : p.kind === 'copy'
                    ? `${p.copyNeed}/3${stampSuffix}`
                    : p.kind === 'bstamp'
                      ? `B ${p.copyNeed}/3`
                      : p.kind === 'extra'
                        ? 'base'
                        : slotLabel(p.card);
              const stampTitle = isBstamp
                ? ' · B stamp owned'
                : isPrstamp
                  ? ' · WTNC W stamp owned'
                  : '';
              const stampClass = isBstamp
                ? 'is-bstamp has-bstamp-flag'
                : isPrstamp
                  ? 'is-prstamp has-prstamp-flag'
                  : '';
              return `
                <button type="button" class="pocket ${filled ? 'owned' : 'missing'} ${complete ? 'complete' : ''} ${p.kind === 'iconic' && filled ? 'has-iconic' : ''} ${stampClass} ${artUrl ? 'has-art' : ''}"
                  data-card-id="${p.card.id}" data-art="${wantIconic ? 'iconic' : 'base'}" title="${escapeHtml(p.card.name)} (${escapeHtml(roleLabel)}${stampTitle})">
                  ${
                    artUrl
                      ? `<img class="pocket-art" src="${artUrl}" alt="${escapeHtml(p.card.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
                      : `<span class="pocket-art-fallback" aria-hidden="true">${escapeHtml(p.card.name.slice(0, 1))}</span>`
                  }
                  <span class="pocket-overlay">
                    <span class="pocket-idx">${p.index} · ${roleLabel}</span>
                    <span class="pocket-num">${escapeHtml(p.card.number)}</span>
                    <span class="pocket-name">${escapeHtml(p.card.name)}</span>
                    <span class="pocket-meta">${escapeHtml(p.card.rarity)}${art?.tcgNumber ? ` · ${escapeHtml(art.tcgNumber)}` : ''}</span>
                  </span>
                </button>`;
            })
            .join('')}
        </div>
      </div>

      <p class="hint">${
        mode === 'vault'
          ? `Vault: Legends on pages 1–${legendFaces} (B + WTNC W stamps fill playset pockets), then MS01 Iconic alts, showcase Legends, Mantis Blades B, then showcase Units/promos through page ${lastFilled}. Pages ${lastFilled + 1}–${VAULT_PAGES} are spare overflow.`
          : `Street: three MS01 cards across (from 6th Street Recruits), with copy 2/3 and 3/3 in the rows below — through page ${lastFilled}. Showcase Units, Iconic alts, and Mantis B live in Vault.`
      }</p>    </section>
  `;

  root.querySelectorAll('[data-binder-mode]').forEach((btn) => {
    btn.addEventListener('click', () => handlers.setMode(btn.dataset.binderMode));
  });
  root.querySelector('[data-binder="prev"]')?.addEventListener('click', () =>
    handlers.setPage(Math.max(1, page - 1)),
  );
  root.querySelector('[data-binder="next"]')?.addEventListener('click', () =>
    handlers.setPage(Math.min(maxPages, page + 1)),
  );
  root.querySelector('[data-binder="jump"]')?.addEventListener('change', (e) => {
    const n = Math.min(maxPages, Math.max(1, Number(e.target.value) || 1));
    handlers.setPage(n);
  });
  root.querySelectorAll('.pocket[data-card-id]').forEach((el) => {
    el.addEventListener('click', () =>
      handlers.openCard(el.dataset.cardId, { preferIconic: el.dataset.art === 'iconic' }),
    );
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
