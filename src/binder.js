import { getOwn, slotLabel } from './stats.js';
import { imageForCard } from './lib/cardImages.js';

/** Street: third-party 3×3 · 864 pockets · 48 double-sided sheets */
export const STREET_SHEETS = 48;
/** Vault: third-party 2×2 toploader · 144 pockets · 18 double-sided sheets */
export const VAULT_SHEETS = 18;

/** @deprecated use STREET_SHEETS */
export const BINDER_SHEETS = STREET_SHEETS;

export function listMs01Legends(cards) {
  return cards
    .filter((c) => c.set_code === 'MS01' && c.type === 'Legend')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function listStreetCards(cards) {
  return cards.filter((c) => c.set_code === 'MS01' && c.type !== 'Legend');
}

/** Showcase / extras packed into Vault sheets 11–18 */
export function listVaultExtras(cards) {
  return cards
    .filter((c) => c.set_code === 'showcase')
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Face index 0..35 across 18 sheets × F/B.
 * Sheets 1–10 (faces 0–19): one MS01 Legend per face — pockets = copy1, copy2, copy3, Iconic A.
 * Sheets 11–18 (faces 20–35): showcase extras, 4 cards per face.
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

  if (sheet >= 1 && sheet <= 10) {
    const legends = listMs01Legends(cards);
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

  // Sheets 11–18: 16 faces × 4 = 64 slots for showcase extras
  const extras = listVaultExtras(cards);
  const start = (faceIndex - 20) * 4;
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

export function vaultZoneName(sheet) {
  if (sheet <= 10) return 'MS01 Legends · playset + A';
  if (sheet <= 15) return 'Showcase / Kickstarter extras';
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
  const { cards, ownership, binderFace } = state;
  const maxSheets = mode === 'vault' ? VAULT_SHEETS : STREET_SHEETS;
  const sheet = Math.min(Math.max(1, state.binderSheet || 1), maxSheets);
  const face = binderFace === 'B' ? 'B' : 'F';

  const pockets =
    mode === 'vault' ? buildVaultFace(cards, sheet, face) : buildStreetFace(cards, sheet, face);

  const gridClass = mode === 'vault' ? 'binder-grid binder-grid-2x2' : 'binder-grid binder-grid-3x3';
  const zone = mode === 'vault' ? vaultZoneName(sheet) : streetZoneName(sheet);
  const eyebrow =
    mode === 'vault'
      ? 'Vault · 2×2 toploader · 144 pockets · 18 sheets'
      : 'Street · 3×3 · 864 pockets · 48 sheets';

  root.innerHTML = `
    <section class="panel binder-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h2>Sheet ${sheet} · ${face === 'F' ? 'Front' : 'Back'}</h2>
          <p class="muted">${escapeHtml(zone)}</p>
        </div>
        <div class="binder-controls">
          <div class="seg" role="group" aria-label="Binder">
            <button type="button" class="seg-btn ${mode === 'street' ? 'on' : ''}" data-binder-mode="street">Street</button>
            <button type="button" class="seg-btn ${mode === 'vault' ? 'on' : ''}" data-binder-mode="vault">Vault</button>
          </div>
          <button type="button" class="btn ghost" data-binder="prev" ${sheet <= 1 ? 'disabled' : ''}>←</button>
          <label class="sheet-jump">
            <span class="sr-only">Sheet</span>
            <input type="number" min="1" max="${maxSheets}" value="${sheet}" data-binder="jump" />
          </label>
          <button type="button" class="btn ghost" data-binder="next" ${sheet >= maxSheets ? 'disabled' : ''}>→</button>
          <button type="button" class="btn" data-binder="flip">${face === 'F' ? 'Flip to Back' : 'Flip to Front'}</button>
        </div>
      </header>

      <div class="binder-page" data-face="${face}" data-mode="${mode}">
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
          ? 'Vault holds all Legends (base copies 1–3 + Iconic A per face on sheets 1–10) and showcase / Kickstarter extras on sheets 11+. Street is Units, Gear, and Programs only.'
          : 'Street is the 3×3 colour-tree binder for Units / Gear / Programs. All Legends (including spares) live in Vault.'
      }</p>
    </section>
  `;

  root.querySelectorAll('[data-binder-mode]').forEach((btn) => {
    btn.addEventListener('click', () => handlers.setMode(btn.dataset.binderMode));
  });
  root.querySelector('[data-binder="prev"]')?.addEventListener('click', () =>
    handlers.setSheet(Math.max(1, sheet - 1)),
  );
  root.querySelector('[data-binder="next"]')?.addEventListener('click', () =>
    handlers.setSheet(Math.min(maxSheets, sheet + 1)),
  );
  root.querySelector('[data-binder="flip"]')?.addEventListener('click', () =>
    handlers.setFace(face === 'F' ? 'B' : 'F'),
  );
  root.querySelector('[data-binder="jump"]')?.addEventListener('change', (e) => {
    const n = Math.min(maxSheets, Math.max(1, Number(e.target.value) || 1));
    handlers.setSheet(n);
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
