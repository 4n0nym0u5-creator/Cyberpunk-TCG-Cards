import { getOwn, slotLabel } from './stats.js';
import { imageForCard } from './lib/cardImages.js';

export const BINDER_SHEETS = 48;

/** Build a 3×3 pocket grid for one face of a sheet.
 *  Slot codes like s3F1 / s3F2 / s3F3 are the three columns of the filled row
 *  (top row). Middle and bottom rows stay spare — matches the MS01 layout.
 */
export function buildFaceGrid(cards, sheet, face) {
  const onFace = cards
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
      });
    }
  }

  for (const c of onFace) {
    const col = c.row_pos;
    if (col >= 1 && col <= 3) {
      // Top row only (indices 0–2)
      pockets[col - 1].card = c;
    }
  }
  return pockets;
}

export function zoneName(sheet) {
  if (sheet <= 2) return 'Showcase';
  if (sheet <= 7) return 'Legends';
  if (sheet <= 20) return 'Units';
  if (sheet <= 23) return 'Gear';
  if (sheet <= 29) return 'Programs';
  return 'Spare';
}

export function renderBinder(root, state, handlers) {
  const { cards, ownership, binderSheet, binderFace } = state;
  const sheet = binderSheet;
  const face = binderFace;
  const pockets = buildFaceGrid(cards, sheet, face);

  root.innerHTML = `
    <section class="panel binder-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">3×3 · 48 sheets double-sided</p>
          <h2>Sheet ${sheet} · ${face === 'F' ? 'Front' : 'Back'}</h2>
          <p class="muted">${zoneName(sheet)} zone · Night City run</p>
        </div>
        <div class="binder-controls">
          <button type="button" class="btn ghost" data-binder="prev" ${sheet <= 1 ? 'disabled' : ''}>←</button>
          <label class="sheet-jump">
            <span class="sr-only">Sheet</span>
            <input type="number" min="1" max="48" value="${sheet}" data-binder="jump" />
          </label>
          <button type="button" class="btn ghost" data-binder="next" ${sheet >= BINDER_SHEETS ? 'disabled' : ''}>→</button>
          <button type="button" class="btn" data-binder="flip">${face === 'F' ? 'Flip to Back' : 'Flip to Front'}</button>
        </div>
      </header>

      <div class="binder-page" data-face="${face}">
        <div class="binder-grid">
          ${pockets
            .map((p) => {
              if (!p.card) {
                return `<div class="pocket empty" title="Spare pocket"><span class="pocket-idx">${p.index}</span><span class="pocket-spare">spare</span></div>`;
              }
              const o = getOwn(ownership, p.card.id);
              const filled = o.copies > 0;
              const complete = o.copies >= 3;
              const art = imageForCard(p.card.id, { iconic: o.iconic });
              const artUrl = art?.url || '';
              return `
                <button type="button" class="pocket ${filled ? 'owned' : 'missing'} ${complete ? 'complete' : ''} ${o.iconic ? 'has-iconic' : ''} ${artUrl ? 'has-art' : ''}"
                  data-card-id="${p.card.id}" title="${escapeHtml(p.card.name)}">
                  ${
                    artUrl
                      ? `<img class="pocket-art" src="${artUrl}" alt="${escapeHtml(p.card.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
                      : ''
                  }
                  <span class="pocket-overlay">
                    <span class="pocket-idx">${p.index}</span>
                    <span class="pocket-num">${escapeHtml(p.card.number)}</span>
                    <span class="pocket-name">${escapeHtml(p.card.name)}</span>
                    <span class="pocket-meta">${escapeHtml(p.card.rarity)} · ${o.copies}/3${art?.tcgNumber ? ` · ${escapeHtml(art.tcgNumber)}` : ''}${o.iconic ? ' · A' : ''}</span>
                  </span>
                </button>`;
            })
            .join('')}
        </div>
      </div>

      <p class="hint">Card art from TCGPlayer product photos (matched by collector # B###). Iconic A swaps to the Iconic printing when owned. F1–F3 fill the top row; spare pockets stay empty.</p>
    </section>
  `;

  root.querySelector('[data-binder="prev"]')?.addEventListener('click', () =>
    handlers.setSheet(Math.max(1, sheet - 1)),
  );
  root.querySelector('[data-binder="next"]')?.addEventListener('click', () =>
    handlers.setSheet(Math.min(BINDER_SHEETS, sheet + 1)),
  );
  root.querySelector('[data-binder="flip"]')?.addEventListener('click', () =>
    handlers.setFace(face === 'F' ? 'B' : 'F'),
  );
  root.querySelector('[data-binder="jump"]')?.addEventListener('change', (e) => {
    const n = Math.min(BINDER_SHEETS, Math.max(1, Number(e.target.value) || 1));
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
