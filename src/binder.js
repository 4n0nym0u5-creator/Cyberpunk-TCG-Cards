import { getOwn, slotLabel } from './stats.js';
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

export function listStreetCards(cards) {
  return cards.filter((c) => c.set_code === 'MS01' && c.type !== 'Legend');
}

/** Showcase / extras packed into Vault after Legends + street Iconics */
export function listVaultExtras(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase')
    .sort((a, b) => a.sort_order - b.sort_order);
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

/** 1-based Vault page for a showcase / Kickstarter extra. */
export function vaultPageForExtra(cards, cardId) {
  const legendFaces = vaultLegendFaceCount(cards);
  const streetFaces = vaultStreetIconicFaceCount(cards);
  const extras = listVaultExtras(cards);
  const ei = Math.max(0, extras.findIndex((c) => c.id === cardId));
  return legendFaces + streetFaces + Math.floor(ei / 4) + 1;
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
  const extrasFaces = Math.ceil(listVaultExtras(cards).length / 4);
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
    const extras = listVaultExtras(cards);
    const ei = extras.findIndex((c) => c.id === card.id);
    if (ei >= 0) {
      const page = vaultPageForExtra(cards, card.id);
      const pocket = (ei % 4) + 1;
      locs.push({
        binder: 'vault',
        page,
        pocket,
        role: 'extra',
        label: `Vault · page ${page} · pocket ${pocket}`,
      });
    }
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
        label: `Vault · page ${page} · playset 1–3 + Iconic A`,
      });
    }
    return locs;
  }

  if (card.set_code === 'MS01' && card.type !== 'Legend') {
    if (card.sheet != null && card.face) {
      const page = sheetFaceToPage(card.sheet, card.face);
      const pocket = card.row_pos || null;
      locs.push({
        binder: 'street',
        page,
        pocket,
        role: 'street',
        label: pocket
          ? `Street · page ${page} · pocket ${pocket}`
          : `Street · page ${page}`,
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
  }

  return locs;
}

/**
 * Face index 0..35 across 18 sheets × F/B.
 * Early faces: one MS01 Legend each — pockets = copy1, copy2, copy3, Iconic A.
 * Next: non-Legend MS01 Iconic alts, 4 per face.
 * Remaining faces: showcase extras, 4 cards per face.
 * With Streetkid (a)+(b): 21 legend faces, then street Iconics, then extras.
 */
export function buildVaultFace(cards, sheet, face) {
  const faceIndex = (sheet - 1) * 2 + (face === 'B' ? 1 : 0);
  const pockets = [1, 2, 3, 4].map((pos) => ({
    index: pos,
    pos,
    card: null,
    kind: null, // 'copy' | 'iconic' | 'extra'
    copyNeed: null,
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

  const extras = listVaultExtras(cards);
  const start = (faceIndex - legendFaces - streetFaces) * 4;
  for (let i = 0; i < 4; i += 1) {
    const card = extras[start + i] || null;
    if (!card) continue;
    pockets[i].card = card;
    pockets[i].kind = 'extra';
  }
  return pockets;
}

/** Street 3×3 — Units / Gear / Programs only (Legends live in Vault). */
export function buildStreetFace(cards, sheet, face) {
  const onFace = listStreetCards(cards)
    .filter((c) => c.sheet === sheet && c.face === face && c.row_pos)
    .sort((a, b) => a.row_pos - b.row_pos || a.sort_order - b.sort_order);

  const pockets = [];
  for (let row = 1; row <= 3; row += 1) {
    for (let col = 1; col <= 3; col += 1) {
      pockets.push({
        index: (row - 1) * 3 + col,
        row,
        col,
        card: null,
        kind: 'street',
        copyNeed: null,
      });
    }
  }

  for (const c of onFace) {
    const col = c.row_pos;
    if (col >= 1 && col <= 3) pockets[col - 1].card = c;
  }
  return pockets;
}

/** @deprecated */
export function buildFaceGrid(cards, sheet, face) {
  return buildStreetFace(cards, sheet, face);
}

export function streetZoneName(sheet) {
  if (sheet <= 2) return 'Spare (was showcase)';
  if (sheet <= 7) return 'Spare (Legends → Vault)';
  if (sheet <= 20) return 'Units';
  if (sheet <= 23) return 'Gear';
  if (sheet <= 29) return 'Programs';
  return 'Spare';
}

export function vaultZoneName(sheet, face = 'F', cards = []) {
  const faceIndex = (sheet - 1) * 2 + (face === 'B' ? 1 : 0);
  const legendFaces = vaultLegendFaceCount(cards);
  if (faceIndex < legendFaces) return 'MS01 Legends · playset + A';
  const streetFaces = vaultStreetIconicFaceCount(cards);
  if (faceIndex < legendFaces + streetFaces) {
    return 'MS01 Iconic alts · Units / Gear / Programs';
  }
  const extrasStart = legendFaces + streetFaces;
  const extrasFaces = Math.ceil(listVaultExtras(cards).length / 4);
  if (faceIndex < extrasStart + extrasFaces) return 'Showcase / Kickstarter extras';
  return 'Overflow';
}

function pocketFilled(ownership, pocket) {
  if (!pocket.card) return { filled: false, complete: false, showIconicArt: false };
  const o = getOwn(ownership, pocket.card.id);
  if (pocket.kind === 'iconic') {
    return { filled: Boolean(o.iconic), complete: Boolean(o.iconic), showIconicArt: true };
  }
  if (pocket.kind === 'copy') {
    const filled = o.copies >= pocket.copyNeed;
    return { filled, complete: o.copies >= 3, showIconicArt: false };
  }
  // street / extra — owned if any copy
  return {
    filled: o.copies > 0,
    complete: o.copies >= 3,
    showIconicArt: Boolean(o.iconic),
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
  const lastFilled = mode === 'vault' ? vaultLastFilledPage(cards) : 0;
  const zone =
    mode === 'vault' ? vaultZoneName(sheet, face, cards) : streetZoneName(sheet);
  const eyebrow =
    mode === 'vault'
      ? `Vault · 2×2 toploader · 144 pockets · ${VAULT_PAGES} pages · cards through p${lastFilled}`
      : `Street · 3×3 · 864 pockets · ${STREET_PAGES} pages`;

  root.innerHTML = `
    <section class="panel binder-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h2>Page ${page}</h2>
          <p class="muted">${escapeHtml(zone)}${
            mode === 'vault' && page > lastFilled
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
              const { filled, complete, showIconicArt } = pocketFilled(ownership, p);
              const art = imageForCard(p.card.id, { iconic: showIconicArt || p.kind === 'iconic' });
              const artUrl = art?.url || '';
              const roleLabel =
                p.kind === 'iconic'
                  ? 'A'
                  : p.kind === 'copy'
                    ? `${p.copyNeed}/3`
                    : slotLabel(p.card);
              return `
                <button type="button" class="pocket ${filled ? 'owned' : 'missing'} ${complete ? 'complete' : ''} ${p.kind === 'iconic' && filled ? 'has-iconic' : ''} ${artUrl ? 'has-art' : ''}"
                  data-card-id="${p.card.id}" title="${escapeHtml(p.card.name)} (${escapeHtml(roleLabel)})">
                  ${
                    artUrl
                      ? `<img class="pocket-art" src="${artUrl}" alt="${escapeHtml(p.card.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
                      : ''
                  }
                  <span class="pocket-overlay">
                    <span class="pocket-idx">${p.index}${p.kind === 'copy' || p.kind === 'iconic' ? ` · ${roleLabel}` : ''}</span>
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
          ? `Vault: Legends on pages 1–${legendFaces}, then MS01 Iconic alts, then showcase / Kickstarter extras through page ${lastFilled}. Pages ${lastFilled + 1}–${VAULT_PAGES} are spare overflow. Street keeps base Units, Gear, and Programs.`
          : 'Street is the 3×3 colour-tree binder for Units / Gear / Programs. All Legends and every Iconic alt live in Vault.'
      }</p>
    </section>
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
    el.addEventListener('click', () => handlers.openCard(el.dataset.cardId));
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
