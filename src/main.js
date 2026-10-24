import './styles.css';
import { supabase, isConfigured, getAuthRedirectUrl } from './lib/supabase.js';
import { asset } from './lib/assets.js';
import {
  loadCatalog,
  loadOwnership,
  loadPrices,
  loadSettings,
  saveSettings,
  upsertOwnership,
  schemaReady,
  schemaError,
} from './lib/ownership.js';
import {
  computeProgress,
  computeBandProgress,
  computeVaultProgress,
  computeValue,
  cardHome,
  formatUsd,
  getOwn,
  listIconicCards,
  listArtists,
  cardsByArtist,
  nextEmptySlot,
  slotLabel,
  MAX_COPIES,
  BINDER_PLAYSET,
  clampCopies,
} from './stats.js';
import {
  renderBinder,
  STREET_PAGES,
  VAULT_PAGES,
  listMs01Legends,
  sheetFaceToPage,
  vaultPageForExtra,
} from './binder.js';
import { loadCardImages, imageForCard } from './lib/cardImages.js';

const app = document.querySelector('#app');

const state = {
  session: null,
  user: null,
  cards: [],
  ownership: {},
  prices: {},
  pricesUpdatedAt: null,
  settings: { completion_mode: 'ms01', value_count_copies: true },
  view: 'dashboard',
  filter: {
    q: '',
    type: 'all',
    set: 'MS01',
    missing: false,
  },
  iconicFilter: 'all',
  opsReveal: null, // 'ms01' | 'iconics' | 'value' | 'vault' | 'artists' | band id
  opsArtist: null, // selected illustrator when opsReveal === 'artists'
  binderMode: 'vault',
  binderPage: 1,
  modalCardId: null,
  busy: false,
};

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ========== Auth ========== */

function renderAuth(message = '', isError = false, mode = 'signin') {
  const configured = isConfigured;
  const isSignUp = mode === 'signup';
  app.innerHTML = `
    <div class="auth-screen">
      <div class="auth-bg" aria-hidden="true">
        <img src="${asset('brand/wall-smasher.webp')}" alt="" class="auth-bg-img" />
        <div class="auth-bg-fade"></div>
      </div>
      <div class="auth-card">
        <img class="auth-logo" src="${asset('brand/logo-yellow.webp')}" alt="Cyberpunk TCG" width="320" height="80" />
        <img class="auth-set-logo" src="${asset('brand/logo-wtnc.webp')}" alt="Welcome to Night City" width="280" height="60" />
        <h1>Night City <span class="glitch">Binder</span></h1>
        <p>Fill your 3×3 binder. Track MS01 completion, Iconic alts, and live USD value — synced across every device you jack into.</p>
        ${
          configured
            ? `
          <form class="auth-form" id="auth-form">
            <label>
              Netrunner ID (email)
              <input type="email" name="email" required placeholder="you@night.city" autocomplete="username" />
            </label>
            <label>
              Access code (password)
              <input type="password" name="password" required minlength="6" placeholder="••••••••" autocomplete="${
                isSignUp ? 'new-password' : 'current-password'
              }" />
            </label>
            <button class="btn primary" type="submit">${isSignUp ? 'Create account' : 'Jack in'}</button>
            <button class="btn ghost" type="button" id="auth-mode-toggle">
              ${isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </button>
            <div class="auth-status ${isError ? 'error' : ''}" id="auth-status">${escapeHtml(message)}</div>
          </form>`
            : `
          <button class="btn primary" type="button" id="demo-enter">Enter Night City</button>
          <p class="demo-note">Supabase not linked yet — demo runs local-only.
            Copy <code>.env.example</code> → <code>.env</code>, run migration + seed, reload for cross-device sync.</p>
          <div class="auth-status ${isError ? 'error' : ''}">${escapeHtml(message)}</div>`
        }
      </div>
    </div>
  `;

  if (configured) {
    document.querySelector('#auth-mode-toggle')?.addEventListener('click', () => {
      renderAuth('', false, isSignUp ? 'signin' : 'signup');
    });
    document.querySelector('#auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');
      const status = document.querySelector('#auth-status');
      status.textContent = isSignUp ? 'Creating account…' : 'Jacking in…';
      status.classList.remove('error');

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: getAuthRedirectUrl() },
        });
        if (error) {
          status.textContent = error.message;
          status.classList.add('error');
          return;
        }
        if (data.session) {
          // Email confirmations disabled — session ready
          return;
        }
        status.textContent =
          'Account created. Check your email to confirm, then Jack in. If the link 404s, fix Supabase Site URL (see SETUP.md).';
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        status.textContent = error.message;
        status.classList.add('error');
      }
    });
  } else {
    document.querySelector('#demo-enter')?.addEventListener('click', () => {
      localStorage.setItem('ncb-demo', '1');
      state.user = { id: 'demo-local', email: 'demo@local' };
      bootApp();
    });
  }
}

/* ========== Data boot ========== */

async function bootApp() {
  app.innerHTML = `<div class="loading">Jacking in // NC</div>`;
  try {
    const [cards, ownership, pricePack, settings] = await Promise.all([
      loadCatalog(),
      loadOwnership(state.user?.id),
      loadPrices(),
      loadSettings(state.user?.id),
      loadCardImages(),
    ]);
    state.cards = cards;
    state.ownership = ownership;
    state.prices = pricePack.map;
    state.pricesUpdatedAt = pricePack.updatedAt;
    state.settings = settings;

    // Seed demo prices from rarity if empty
    if (!Object.keys(state.prices).length) {
      const base = {
        Common: 0.12,
        Uncommon: 0.2,
        Rare: 0.45,
        Epic: 4.5,
        Secret: 22,
        Promo: 8,
        Nova: 80,
      };
      const mult = { Common: 3, Uncommon: 4, Rare: 8, Epic: 12, Secret: 35, Promo: 5, Nova: 10 };
      for (const c of cards) {
        const b = base[c.rarity] ?? 0.25;
        state.prices[c.id] = { base: b };
        if (c.has_iconic) state.prices[c.id].iconic = b * (mult[c.rarity] ?? 10);
      }
      state.pricesUpdatedAt = 'estimate (refresh via npm run prices)';
    }

    renderShell();
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="loading">Failed to load: ${escapeHtml(err.message)}</div>`;
  }
}

/* ========== Shell ========== */

function renderShell() {
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar no-print">
        <div class="brand">
          <a class="brand-lockup" href="#" data-view-home="dashboard" title="Night City Binder">
            <img class="brand-logo" src="${asset('brand/logo-yellow.webp')}" alt="Cyberpunk TCG" width="160" height="40" />
          </a>
          <div class="brand-text">
            <div class="logo-row">
              <strong>Night City Binder</strong>
              <span class="badge">MS01</span>
            </div>
            <span>Welcome to Night City · Beta</span>
          </div>
        </div>
        <nav class="nav" id="nav">
          <button type="button" data-view="dashboard">Ops</button>
          <button type="button" data-view="checklist">Checklist</button>
          <button type="button" data-view="binder">Binders</button>
          <button type="button" data-view="iconics">Iconics</button>
          <button type="button" data-view="value">Eddies</button>
        </nav>
        <div class="user-chip">
          <span>${escapeHtml(state.user?.email || 'collector')}</span>
          ${
            isConfigured
              ? `<button type="button" class="btn ghost" id="sign-out">Jack out</button>`
              : `<span class="badge" style="background:var(--cp-danger);color:#fff">DEMO</span>`
          }
        </div>
      </header>
      ${
        !schemaReady
          ? `<div class="schema-banner no-print">
              <strong>Database tables missing.</strong>
              Sign-in worked, but Supabase has no <code>cards</code> / <code>ownership</code> tables yet — sync is off until you run the setup SQL.
              <a href="https://supabase.com/dashboard/project/orrxumsntcbuqjzldmos/sql/new" target="_blank" rel="noopener">Open SQL editor</a>
              → paste <code>supabase/setup-all.sql</code> from the repo → Run.
              ${schemaError ? `<span class="schema-err">${escapeHtml(schemaError)}</span>` : ''}
            </div>`
          : ''
      }
      <main class="main" id="view"></main>
      <footer class="app-foot no-print">
        <span>Fan collection tool · Art &amp; logos © CD PROJEKT / R. Talsorian / Cyberpunk TCG</span>
      </footer>
    </div>
    <div id="modal-root"></div>
  `;

  document.querySelector('[data-view-home]')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.view = 'dashboard';
    renderShell();
  });

  document.querySelectorAll('#nav [data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      renderShell();
    });
    if (btn.dataset.view === state.view) btn.classList.add('active');
  });

  document.querySelector('#sign-out')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    state.user = null;
    state.session = null;
    renderAuth();
  });

  renderView();
}

function renderView() {
  const root = document.querySelector('#view');
  if (!root) return;
  if (state.view === 'dashboard') renderDashboard(root);
  else if (state.view === 'checklist') renderChecklist(root);
  else if (state.view === 'binder') renderBinderView(root);
  else if (state.view === 'iconics') renderIconics(root);
  else if (state.view === 'value') renderValue(root);
  renderModal();
}

/* ========== Ownership mutations ========== */

async function setCopies(cardId, copies) {
  const prev = getOwn(state.ownership, cardId);
  const next = { ...prev, copies: clampCopies(copies) };
  state.ownership = { ...state.ownership, [cardId]: next };
  renderView();
  try {
    await upsertOwnership(state.user?.id, cardId, next);
  } catch (err) {
    toast(err.message);
  }
}

/** Binder 1–3 quick toggles + total owned stepper (0–MAX_COPIES). */
function htmlCopyControls(card, ownership, { prefix = 'copy' } = {}) {
  const o = getOwn(ownership, card.id);
  const playset = Array.from({ length: BINDER_PLAYSET }, (_, i) => i + 1)
    .map(
      (n) =>
        `<button type="button" class="copy-btn ${o.copies >= n ? 'on' : ''}" data-${prefix}="${n}" title="Set binder copies to ${n}">${n}</button>`,
    )
    .join('');
  return `
    <div class="copy-toggles">
      ${playset}
      <div class="copy-stepper" title="Total owned (up to ${MAX_COPIES})">
        <button type="button" class="copy-step" data-${prefix}-delta="-1" ${o.copies <= 0 ? 'disabled' : ''} aria-label="Fewer copies">−</button>
        <span class="copy-count">${o.copies}</span>
        <button type="button" class="copy-step" data-${prefix}-delta="1" ${o.copies >= MAX_COPIES ? 'disabled' : ''} aria-label="More copies">+</button>
      </div>
      <button type="button" class="iconic-btn ${o.iconic ? 'on' : ''}" data-${prefix === 'mcopy' ? 'miconic' : 'iconic'}="1"
        ${card.has_iconic ? '' : 'disabled'} title="Iconic alt art">A</button>
    </div>
  `;
}

function bindCopyControls(root, { prefix = 'copy', onChanged } = {}) {
  root.querySelectorAll(`[data-${prefix}]`).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('[data-id]')?.dataset.id || state.modalCardId;
      if (!id) return;
      const n = Number(btn.dataset[prefix]);
      const cur = getOwn(state.ownership, id).copies;
      setCopies(id, cur === n ? n - 1 : n);
      onChanged?.();
    });
  });
  root.querySelectorAll(`[data-${prefix}-delta]`).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('[data-id]')?.dataset.id || state.modalCardId;
      if (!id) return;
      const delta = Number(btn.dataset[`${prefix}Delta`] || btn.getAttribute(`data-${prefix}-delta`));
      const cur = getOwn(state.ownership, id).copies;
      setCopies(id, cur + delta);
      onChanged?.();
    });
  });
}

async function toggleIconic(cardId) {
  const card = state.cards.find((c) => c.id === cardId);
  if (!card?.has_iconic) return;
  const prev = getOwn(state.ownership, cardId);
  const next = { ...prev, iconic: !prev.iconic };
  state.ownership = { ...state.ownership, [cardId]: next };
  renderView();
  try {
    await upsertOwnership(state.user?.id, cardId, next);
  } catch (err) {
    toast(err.message);
  }
}

async function setOverride(cardId, value) {
  const prev = getOwn(state.ownership, cardId);
  const next = {
    ...prev,
    price_override_usd: value === '' || value == null ? null : Number(value),
  };
  state.ownership = { ...state.ownership, [cardId]: next };
  try {
    await upsertOwnership(state.user?.id, cardId, next);
    toast('Price override saved');
  } catch (err) {
    toast(err.message);
  }
  renderView();
}

/* ========== Dashboard ========== */

const OPS_DASH_KEYS = new Set(['ms01', 'iconics', 'value', 'vault', 'artists']);
const OPS_BAND_KEYS = new Set(['red', 'yellow', 'green', 'blue']);

function opsRevealSpec(key) {
  if (!key) return null;
  if (key === 'artists') {
    const artists = listArtists(state.cards);
    const selected = state.opsArtist;
    if (selected) {
      const cards = cardsByArtist(state.cards, selected);
      return {
        eyebrow: 'Illustrators',
        title: selected,
        hint: `${cards.length} card${cards.length === 1 ? '' : 's'} · tap a card for detail · back for all artists`,
        preferIconic: false,
        cards,
        artistBack: true,
      };
    }
    return {
      eyebrow: 'Illustrators',
      title: `${artists.length} contributing artists`,
      hint: 'Tap an artist to browse their cards',
      preferIconic: false,
      cards: [],
      artists,
    };
  }
  const ms01 = state.cards
    .filter((c) => c.set_code === 'MS01')
    .sort((a, b) => a.sort_order - b.sort_order);

  if (key === 'ms01') {
    return {
      eyebrow: 'MS01 base',
      title: `${ms01.filter((c) => getOwn(state.ownership, c.id).copies > 0).length} / ${ms01.length} base cards`,
      hint: 'Tap a card for detail · mark copies & Iconic A in the modal',
      preferIconic: false,
      cards: ms01,
    };
  }
  if (key === 'iconics') {
    const cards = listIconicCards(state.cards);
    const owned = cards.filter((c) => getOwn(state.ownership, c.id).iconic).length;
    return {
      eyebrow: 'Iconic alts',
      title: `${owned} / ${cards.length} Iconics`,
      hint: 'Tap A to mark owned · card opens detail · full gallery also under Iconics',
      preferIconic: true,
      cards,
    };
  }
  if (key === 'value') {
    const { lines } = computeValue(state.cards, state.ownership, state.prices, state.settings);
    return {
      eyebrow: 'Market value',
      title: `${lines.length} valued lines`,
      hint: 'Owned copies and Iconic A that contribute to eddies',
      preferIconic: false,
      cards: lines.map((l) => l.card),
      values: Object.fromEntries(lines.map((l) => [l.card.id, l.value])),
    };
  }
  if (key === 'vault') {
    const legends = ms01.filter((c) => c.type === 'Legend');
    const streetIconics = ms01.filter((c) => c.type !== 'Legend' && c.has_iconic);
    const filled = legends.filter((c) => getOwn(state.ownership, c.id).copies > 0).length;
    return {
      eyebrow: 'Vault',
      title: `${filled} / ${legends.length} Legends · ${streetIconics.filter((c) => getOwn(state.ownership, c.id).iconic).length} / ${streetIconics.length} street A`,
      hint: 'Legends playset ×3 + A · all other MS01 Iconic alts in Vault',
      preferIconic: false,
      cards: [...legends, ...streetIconics],
    };
  }
  if (OPS_BAND_KEYS.has(key)) {
    const cards = ms01.filter((c) => c.band === key);
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const owned = cards.filter((c) => getOwn(state.ownership, c.id).copies > 0).length;
    return {
      eyebrow: `${label} band`,
      title: `${owned} / ${cards.length} cards`,
      hint: 'Base owned (≥1 copy) · tap card for detail',
      preferIconic: false,
      cards,
    };
  }
  return null;
}

function htmlOpsCardGrid(spec) {
  if (!spec?.cards?.length) {
    return `<p class="hint">No cards in this section.</p>`;
  }
  return `
    <div class="iconic-grid ops-reveal-grid">
      ${spec.cards
        .map((c) => {
          const o = getOwn(state.ownership, c.id);
          const preferIconic = Boolean(spec.preferIconic && c.has_iconic);
          const owned = preferIconic ? Boolean(o.iconic) : o.copies > 0;
          const art =
            imageForCard(c.id, { iconic: preferIconic }) ||
            imageForCard(c.id, { iconic: false });
          const artUrl = art?.url || '';
          const band = c.band || '';
          const valueNote =
            spec.values && spec.values[c.id] != null
              ? ` · ${formatUsd(spec.values[c.id])}`
              : '';
          const sub = preferIconic
            ? `${escapeHtml(c.rarity)} · ${escapeHtml(band)}`
            : `${escapeHtml(c.type)} · ${escapeHtml(c.rarity)}${o.copies ? ` · ×${o.copies}` : ''}${
                o.iconic ? ' · A' : ''
              }${valueNote}`;
          return `
            <article class="iconic-tile ${owned ? 'owned' : 'missing'} band-${band}" data-card-id="${c.id}">
              <button type="button" class="iconic-tile-art" data-open="${c.id}" title="${escapeHtml(c.name)}">
                ${
                  artUrl
                    ? `<img src="${artUrl}" alt="${escapeHtml(c.name)}${preferIconic ? ' (Iconic)' : ''}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
                    : `<span class="iconic-tile-ph">No art</span>`
                }
                ${preferIconic ? `<span class="iconic-tile-badge">IO</span>` : ''}
              </button>
              <div class="iconic-tile-meta">
                <span class="iconic-tile-num">${escapeHtml(c.number)}</span>
                <span class="iconic-tile-name">${escapeHtml(c.name)}</span>
                <span class="iconic-tile-sub">${sub}</span>
                ${
                  c.has_iconic
                    ? `<button type="button" class="iconic-btn ${o.iconic ? 'on' : ''}" data-toggle-a="${c.id}" title="Toggle Iconic owned">A</button>`
                    : ''
                }
              </div>
            </article>`;
        })
        .join('')}
    </div>`;
}

function htmlArtistList(artists) {
  if (!artists?.length) return `<p class="hint">No illustrator credits loaded yet.</p>`;
  return `
    <div class="artist-list">
      ${artists
        .map(
          (a) => `
        <button type="button" class="artist-row" data-ops-artist="${escapeHtml(a.name)}">
          <span class="artist-name">${escapeHtml(a.name)}</span>
          <span class="artist-count">${a.count} card${a.count === 1 ? '' : 's'}</span>
        </button>`,
        )
        .join('')}
    </div>`;
}

function htmlOpsRevealPanel(key) {
  const spec = opsRevealSpec(key);
  if (!spec) return '';
  const body = spec.artists
    ? htmlArtistList(spec.artists)
    : htmlOpsCardGrid(spec);
  const closeLabel = spec.artistBack ? 'All artists' : 'Close';
  return `
    <section class="panel ops-reveal" id="ops-reveal" data-ops-key="${escapeHtml(key)}">
      <header class="panel-head">
        <div>
          <p class="eyebrow">${escapeHtml(spec.eyebrow)}</p>
          <h2>${escapeHtml(spec.title)}</h2>
          <p class="muted">${escapeHtml(spec.hint)}</p>
        </div>
        <button type="button" class="btn ghost no-print" data-ops-close>${closeLabel}</button>
      </header>
      ${body}
    </section>`;
}

function bindOpsRevealControls(root) {
  const onClick = (e) => {
    const artistBtn = e.target.closest('[data-ops-artist]');
    if (artistBtn && root.contains(artistBtn)) {
      state.opsReveal = 'artists';
      state.opsArtist = artistBtn.dataset.opsArtist || null;
      renderView();
      requestAnimationFrame(() => {
        document.querySelector('#ops-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    const closeBtn = e.target.closest('[data-ops-close]');
    if (closeBtn && root.contains(closeBtn)) {
      if (state.opsReveal === 'artists' && state.opsArtist) {
        state.opsArtist = null;
        renderView();
        requestAnimationFrame(() => {
          document.querySelector('#ops-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
      state.opsReveal = null;
      state.opsArtist = null;
      renderView();
      return;
    }

    const openBtn = e.target.closest('[data-open]');
    if (openBtn && root.contains(openBtn)) {
      state.modalCardId = openBtn.dataset.open;
      renderModal();
      return;
    }

    const iconicBtn = e.target.closest('[data-toggle-a]');
    if (iconicBtn && root.contains(iconicBtn)) {
      e.preventDefault();
      toggleIconic(iconicBtn.dataset.toggleA);
      return;
    }

    const revealBtn = e.target.closest('[data-ops-reveal]');
    if (!revealBtn || !root.contains(revealBtn)) return;
    const key = revealBtn.dataset.opsReveal;
    if (!key) return;
    const next = state.opsReveal === key ? null : key;
    state.opsReveal = next;
    state.opsArtist = null;
    renderView();
    if (state.opsReveal) {
      requestAnimationFrame(() => {
        document.querySelector('#ops-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  // Replace prior delegated listener so re-renders never stack handlers.
  if (root._opsRevealClick) root.removeEventListener('click', root._opsRevealClick);
  root._opsRevealClick = onClick;
  root.addEventListener('click', onClick);
}

function renderDashboard(root) {
  const progress = computeProgress(state.cards, state.ownership, state.settings);
  const bands = computeBandProgress(state.cards, state.ownership);
  const vault = computeVaultProgress(state.cards, state.ownership);
  const value = computeValue(state.cards, state.ownership, state.prices, state.settings);
  const next = nextEmptySlot(state.cards, state.ownership);
  const ms01Pct = progress.ms01Total
    ? Math.round((progress.ms01Owned / progress.ms01Total) * 100)
    : 0;
  const iconicPct = progress.iconicTotal
    ? Math.round((progress.iconicOwned / progress.iconicTotal) * 100)
    : 0;
  const pricedCount = Object.keys(state.prices).length;
  const reveal = state.opsReveal;
  const dashReveal = OPS_DASH_KEYS.has(reveal) ? reveal : null;
  const bandReveal = OPS_BAND_KEYS.has(reveal) ? reveal : null;

  root.innerHTML = `
    <section class="hero-strip">
      <div class="hero-media" aria-hidden="true">
        <img src="${asset('brand/banner.webp')}" alt="" class="hero-banner" />
        <div class="hero-fade"></div>
      </div>
      <div class="hero-copy">
        <img class="hero-set-logo" src="${asset('brand/logo-wtnc.webp')}" alt="Welcome to Night City" width="340" height="72" />
        <p class="eyebrow">Collector ops · Beta set MS01</p>
        <h1>Build the binder. Own the street.</h1>
        <p>Vault (2×2) holds all Legends, every Iconic alt, and spares · Street (3×3) holds Units, Gear, Programs.</p>
      </div>
      <div class="hero-product no-print" aria-hidden="true">
        <img src="${asset('brand/box.webp')}" alt="" class="hero-box" />
        <img src="${asset('brand/booster.webp')}" alt="" class="hero-booster" />
      </div>
    </section>

    <section class="cast-rail no-print" aria-label="Night City cast">
      ${[
        ['wall-jackie.webp', 'Jackie'],
        ['wall-lucy.webp', 'Lucy'],
        ['wall-smasher.webp', 'Adam Smasher'],
        ['wall-hanako.webp', 'Hanako'],
        ['wall-dumdum.webp', 'Dum Dum'],
      ]
        .map(
          ([src, name]) => `
        <figure class="cast-card">
          <img src="${asset(`brand/${src}`)}" alt="${name}" loading="lazy" />
          <figcaption>${name}</figcaption>
        </figure>`,
        )
        .join('')}
    </section>

    <section class="dash-grid">
      <button type="button" class="stat-card stat-card-link ${reveal === 'ms01' ? 'open' : ''}" data-ops-reveal="ms01" aria-expanded="${reveal === 'ms01'}" title="Reveal MS01 cards">
        <h3>MS01 base</h3>
        <div class="value">${progress.ms01Owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${progress.ms01Total}</span></div>
        <div class="sub">${ms01Pct}% · tap to reveal</div>
        <div class="progress-track"><div class="progress-fill" style="width:${ms01Pct}%"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${reveal === 'iconics' ? 'open' : ''}" data-ops-reveal="iconics" aria-expanded="${reveal === 'iconics'}" title="Reveal Iconic alts">
        <h3>Iconic alts</h3>
        <div class="value">${progress.iconicOwned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${progress.iconicTotal}</span></div>
        <div class="sub">${iconicPct}% · tap to reveal · ${progress.setTotal} set</div>
        <div class="progress-track"><div class="progress-fill" style="width:${iconicPct}%;background:var(--cp-danger)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${reveal === 'value' ? 'open' : ''}" data-ops-reveal="value" aria-expanded="${reveal === 'value'}" title="Reveal valued cards">
        <h3>Market value</h3>
        <div class="value">${formatUsd(value.total)}</div>
        <div class="sub">${value.priced} lines · ${pricedCount} priced · tap to reveal</div>
      </button>
      <button type="button" class="stat-card stat-card-link ${reveal === 'vault' ? 'open' : ''}" data-ops-reveal="vault" aria-expanded="${reveal === 'vault'}" title="Reveal Vault pockets">
        <h3>Vault</h3>
        <div class="value">${vault.vaultFilled}<span style="font-size:1rem;color:var(--cp-muted)"> / ${vault.vaultPockets}</span></div>
        <div class="sub">${vault.vaultPct}% · Legends + all Iconic A · ${vault.vaultCapacity} cap</div>
        <div class="progress-track"><div class="progress-fill" style="width:${vault.vaultPct}%;background:var(--tree-blue)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${reveal === 'artists' ? 'open' : ''}" data-ops-reveal="artists" aria-expanded="${reveal === 'artists'}" title="Browse by illustrator">
        <h3>Artists</h3>
        <div class="value">${listArtists(state.cards).length}</div>
        <div class="sub">illustrators · tap to browse</div>
      </button>
    </section>
    ${dashReveal ? htmlOpsRevealPanel(dashReveal) : ''}

    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Colour tree</p>
          <h2>Completeness by band</h2>
          <p class="muted">Tap a band to reveal its cards · base owned (≥1) · Iconic A per colour</p>
        </div>
      </header>
      <div class="band-breakdown">
        ${bands
          .map(
            (b) => `
          <button type="button" class="band-stat band-stat-link band-${b.id} ${reveal === b.id ? 'open' : ''}" data-ops-reveal="${b.id}" aria-expanded="${reveal === b.id}" title="Reveal ${b.label} band">
            <div class="band-stat-head">
              <span class="band-stat-name">${b.label}</span>
              <span class="band-stat-range">${b.range}</span>
            </div>
            <div class="band-stat-counts">
              <strong>${b.owned}</strong><span> / ${b.total}</span>
              <em>${b.pct}%</em>
            </div>
            <div class="progress-track"><div class="progress-fill band-fill" style="width:${b.pct}%"></div></div>
            <div class="band-stat-iconic">
              Iconic A <strong>${b.iconicOwned}</strong> / ${b.iconicTotal}
              <span class="muted">(${b.iconicPct}%)</span>
            </div>
          </button>`,
          )
          .join('')}
      </div>
      ${bandReveal ? htmlOpsRevealPanel(bandReveal) : ''}
    </section>

    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Next empty slot</p>
          <h2>${next ? escapeHtml(next.name) : 'Binder locked — complete'}</h2>
          <p class="muted">${next ? `${next.number} · ${slotLabel(next)} · ${next.type}` : 'All MS01 slots owned at least once. Preem work, choom.'}</p>
        </div>
        ${
          next
            ? `<div class="no-print" style="display:flex;gap:0.45rem;flex-wrap:wrap">
                <button type="button" class="btn primary" id="goto-next">Open checklist</button>
                <button type="button" class="btn" id="goto-binder">Show binder</button>
              </div>`
            : ''
        }
      </header>
      <div class="settings-row no-print">
        <label>
          Completion mode
          <select id="completion-mode">
            <option value="ms01" ${state.settings.completion_mode === 'ms01' ? 'selected' : ''}>MS01 only (${progress.ms01Total})</option>
            <option value="everything_beta" ${state.settings.completion_mode === 'everything_beta' ? 'selected' : ''}>Everything Beta</option>
          </select>
        </label>
        <label>
          <input type="checkbox" id="count-copies" ${state.settings.value_count_copies ? 'checked' : ''} />
          Value counts all copies
        </label>
      </div>
      ${
        state.settings.completion_mode === 'everything_beta'
          ? `<p class="hint">Everything Beta includes showcase promos, Nova toppers, and starter-deck exclusives. Rebecca / Minotaur do not count toward MS01.</p>`
          : `<p class="hint">Colour tree bands: <span style="color:var(--tree-red)">Red 001–035</span> · <span style="color:var(--tree-yellow)">Yellow 036–070</span> · <span style="color:var(--tree-green)">Green 071–105</span> · <span style="color:var(--tree-blue)">Blue 106–140</span>. Inside each: Legends → Units → Gear → Programs.</p>`
      }
    </section>
  `;

  bindOpsRevealControls(root);

  document.querySelector('#goto-next')?.addEventListener('click', () => {
    state.view = 'checklist';
    state.filter.q = next?.number || '';
    renderShell();
  });
  document.querySelector('#goto-binder')?.addEventListener('click', () => {
    if (!next) return;
    state.view = 'binder';
    const home = cardHome(next);
    state.binderMode = home;
    if (home === 'vault' && next.type === 'Legend') {
      const legends = listMs01Legends(state.cards);
      const idx = legends.findIndex((c) => c.id === next.id);
      state.binderPage = Math.max(0, idx) + 1;
    } else if (home === 'vault' && next.set_code === 'showcase') {
      state.binderPage = vaultPageForExtra(state.cards, next.id);
    } else {
      state.binderPage = sheetFaceToPage(next.sheet || 8, next.face || 'F');
    }
    renderShell();
  });
  document.querySelector('#completion-mode')?.addEventListener('change', async (e) => {
    state.settings = await saveSettings(state.user?.id, {
      ...state.settings,
      completion_mode: e.target.value,
    });
    renderView();
  });
  document.querySelector('#count-copies')?.addEventListener('change', async (e) => {
    state.settings = await saveSettings(state.user?.id, {
      ...state.settings,
      value_count_copies: e.target.checked,
    });
    renderView();
  });
}

/* ========== Iconics gallery ========== */

function renderIconics(root) {
  const progress = computeProgress(state.cards, state.ownership, state.settings);
  const all = listIconicCards(state.cards);
  const filter = state.iconicFilter || 'all';
  const list = all.filter((c) => {
    const owned = getOwn(state.ownership, c.id).iconic;
    if (filter === 'owned') return owned;
    if (filter === 'missing') return !owned;
    return true;
  });
  const iconicPct = progress.iconicTotal
    ? Math.round((progress.iconicOwned / progress.iconicTotal) * 100)
    : 0;

  root.innerHTML = `
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Iconic alt arts · MS01</p>
          <h2>${progress.iconicOwned} / ${progress.iconicTotal} Iconics</h2>
          <p class="muted">${iconicPct}% complete · ${list.length} shown · tap A to mark owned · card opens detail</p>
        </div>
        <div class="progress-track iconic-head-track">
          <div class="progress-fill" style="width:${iconicPct}%;background:var(--cp-danger)"></div>
        </div>
      </header>
      <div class="toolbar no-print">
        <div class="seg" role="group" aria-label="Iconic filter">
          ${['all', 'owned', 'missing']
            .map(
              (f) =>
                `<button type="button" class="seg-btn ${filter === f ? 'on' : ''}" data-iconic-filter="${f}">${
                  f === 'all' ? 'All' : f === 'owned' ? 'Owned' : 'Missing'
                }</button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="iconic-grid">
        ${list
          .map((c) => {
            const o = getOwn(state.ownership, c.id);
            const art = imageForCard(c.id, { iconic: true }) || imageForCard(c.id, { iconic: false });
            const artUrl = art?.url || '';
            const band = c.band || '';
            return `
              <article class="iconic-tile ${o.iconic ? 'owned' : 'missing'} band-${band}" data-card-id="${c.id}">
                <button type="button" class="iconic-tile-art" data-open="${c.id}" title="${escapeHtml(c.name)}">
                  ${
                    artUrl
                      ? `<img src="${artUrl}" alt="${escapeHtml(c.name)} (Iconic)" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
                      : `<span class="iconic-tile-ph">No art</span>`
                  }
                  <span class="iconic-tile-badge">IO</span>
                </button>
                <div class="iconic-tile-meta">
                  <span class="iconic-tile-num">${escapeHtml(c.number)}</span>
                  <span class="iconic-tile-name">${escapeHtml(c.name)}</span>
                  <span class="iconic-tile-sub">${escapeHtml(c.rarity)} · ${escapeHtml(band)}</span>
                  <button type="button" class="iconic-btn ${o.iconic ? 'on' : ''}" data-toggle-a="${c.id}" title="Toggle Iconic owned">A</button>
                </div>
              </article>`;
          })
          .join('')}
      </div>
      ${list.length === 0 ? `<p class="hint">No Iconics in this filter.</p>` : ''}
    </section>
  `;

  root.querySelectorAll('[data-iconic-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.iconicFilter = btn.dataset.iconicFilter;
      renderView();
    });
  });
  root.querySelectorAll('[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.modalCardId = btn.dataset.open;
      renderModal();
    });
  });
  root.querySelectorAll('[data-toggle-a]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleIconic(btn.dataset.toggleA);
    });
  });
}

/* ========== Checklist ========== */

function filteredCards() {
  const { q, type, set, missing } = state.filter;
  const query = q.trim().toLowerCase();
  return state.cards.filter((c) => {
    if (set === 'MS01' && c.set_code !== 'MS01') return false;
    if (set === 'showcase' && c.set_code !== 'showcase') return false;
    if (type !== 'all' && c.type !== type) return false;
    if (missing && getOwn(state.ownership, c.id).copies > 0) return false;
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.number.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query) ||
      (c.artist && c.artist.toLowerCase().includes(query)) ||
      slotLabel(c).toLowerCase().includes(query)
    );
  });
}

function renderChecklist(root) {
  const list = filteredCards();
  let lastBand = null;
  let lastSet = null;
  const rows = [];

  for (const c of list) {
    if (c.set_code === 'showcase' && lastSet !== 'showcase') {
      rows.push(`<div class="band-header showcase">Vault extras · Kickstarter / promo / starter (not MS01)</div>`);
      lastSet = 'showcase';
      lastBand = null;
    } else if (c.set_code === 'MS01' && c.band && c.band !== lastBand) {
      const labels = {
        red: 'Red band · 001–035',
        yellow: 'Yellow band · 036–070',
        green: 'Green band · 071–105',
        blue: 'Blue band · 106–140',
      };
      rows.push(`<div class="band-header ${c.band}">${labels[c.band]}</div>`);
      lastBand = c.band;
      lastSet = 'MS01';
    }

    const o = getOwn(state.ownership, c.id);
    const complete = o.copies >= BINDER_PLAYSET;
    const p = state.prices[c.id] || {};
    const price = o.price_override_usd != null ? o.price_override_usd : p.base;
    const home = cardHome(c);

    rows.push(`
      <div class="card-row ${complete ? 'complete' : ''}" data-id="${c.id}">
        ${htmlCopyControls(c, state.ownership, { prefix: 'copy' })}
        <div class="card-id">${escapeHtml(c.number)}</div>
        <div class="card-main">
          <div class="name">${escapeHtml(c.name)}<span class="home-tag ${home}">${home}</span>${c.notes ? ' <span class="notes-flag" title="' + escapeHtml(c.notes) + '">*</span>' : ''}</div>
          <div class="meta">${c.type} · ${c.rarity}${c.eurodollars != null ? ` · E$${c.eurodollars}` : ''}${c.artist ? ` · ${escapeHtml(c.artist)}` : ''}</div>
        </div>
        <div class="card-side">
          <span class="price">${price != null ? formatUsd(price) : '—'}</span>
          <span>${home === 'vault' && c.type === 'Legend' ? 'Vault playset' : slotLabel(c)}</span>
        </div>
      </div>
    `);
  }

  root.innerHTML = `
    <section class="panel checklist-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Collector order · colour tree</p>
          <h2>Set checklist</h2>
          <p class="muted print-only">CYBERPUNK TCG — Welcome to Night City (Beta) · MS01 checklist · 1–3 binder · total owned up to ${MAX_COPIES} · A = Iconic</p>
        </div>
        <div class="no-print" style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <button type="button" class="btn primary" id="print-btn">Print checklist</button>
        </div>
      </header>

      <div class="toolbar no-print">
        <input type="search" id="filter-q" placeholder="Search name, number, slot…" value="${escapeHtml(state.filter.q)}" />
        <select id="filter-type">
          <option value="all">All types</option>
          ${['Legend', 'Unit', 'Gear', 'Program'].map((t) => `<option value="${t}" ${state.filter.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <select id="filter-set">
          <option value="MS01" ${state.filter.set === 'MS01' ? 'selected' : ''}>MS01 set</option>
          <option value="showcase" ${state.filter.set === 'showcase' ? 'selected' : ''}>Showcase extras</option>
          <option value="all" ${state.filter.set === 'all' ? 'selected' : ''}>All cards</option>
        </select>
        <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.85rem;color:var(--muted)">
          <input type="checkbox" id="filter-missing" ${state.filter.missing ? 'checked' : ''} />
          Missing only
        </label>
      </div>

      <div class="checklist-body">${rows.join('') || '<p class="muted">No cards match.</p>'}</div>
    </section>
  `;

  const syncFilters = () => {
    state.filter.q = document.querySelector('#filter-q')?.value || '';
    state.filter.type = document.querySelector('#filter-type')?.value || 'all';
    state.filter.set = document.querySelector('#filter-set')?.value || 'MS01';
    state.filter.missing = Boolean(document.querySelector('#filter-missing')?.checked);
    renderChecklist(root);
  };

  document.querySelector('#filter-q')?.addEventListener('input', () => {
    state.filter.q = document.querySelector('#filter-q').value;
    // debounce light: re-render on change end via input is fine for 150 cards
    renderChecklist(root);
    const input = document.querySelector('#filter-q');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });
  document.querySelector('#filter-type')?.addEventListener('change', syncFilters);
  document.querySelector('#filter-set')?.addEventListener('change', syncFilters);
  document.querySelector('#filter-missing')?.addEventListener('change', syncFilters);
  document.querySelector('#print-btn')?.addEventListener('click', () => window.print());

  bindCopyControls(root, { prefix: 'copy' });
  root.querySelectorAll('[data-iconic]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('[data-id]')?.dataset.id;
      if (id) toggleIconic(id);
    });
  });
  root.querySelectorAll('.card-row .card-main').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.closest('[data-id]')?.dataset.id;
      if (!id) return;
      state.modalCardId = id;
      renderModal();
    });
  });
}

/* ========== Binder ========== */

function renderBinderView(root) {
  renderBinder(root, state, {
    setMode: (mode) => {
      state.binderMode = mode === 'vault' ? 'vault' : 'street';
      const max = state.binderMode === 'vault' ? VAULT_PAGES : STREET_PAGES;
      if (state.binderMode === 'vault') {
        state.binderPage = Math.min(Math.max(1, state.binderPage || 1), max);
      } else {
        // Street units start around physical sheet 8 → page 15
        const streetStart = sheetFaceToPage(8, 'F');
        state.binderPage = Math.min(max, Math.max(streetStart, state.binderPage || streetStart));
      }
      renderView();
    },
    setPage: (n) => {
      state.binderPage = n;
      renderView();
    },
    openCard: (id) => {
      state.modalCardId = id;
      renderModal();
    },
  });
}

/* ========== Value ========== */

function renderValue(root) {
  const value = computeValue(state.cards, state.ownership, state.prices, state.settings);
  const pricedCount = Object.keys(state.prices).length;
  const updated = state.pricesUpdatedAt
    ? typeof state.pricesUpdatedAt === 'string' && state.pricesUpdatedAt.includes('estimate')
      ? state.pricesUpdatedAt
      : (() => {
          try {
            return new Date(state.pricesUpdatedAt).toLocaleString();
          } catch {
            return String(state.pricesUpdatedAt);
          }
        })()
    : 'no price file';

  root.innerHTML = `
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Collection value · USD</p>
          <h2>${formatUsd(value.total)}</h2>
          <p class="muted">TCGPlayer market · ${escapeHtml(String(updated))} · ${value.priced} owned lines · ${pricedCount} cards priced</p>
        </div>
        <button type="button" class="btn" id="reload-prices">Reload prices</button>
      </header>
      <p class="hint no-print">Uses TCGPlayer market prices from <code>data/card-prices.json</code> (or Supabase <code>card_prices</code> when seeded). With “Value counts all copies” on Ops, each of your 1–${MAX_COPIES} copies multiplies base value + Iconic A when checked. Overrides in card detail. Refresh file: <code>npm run prices:fetch</code>.</p>
      <table class="value-table">
        <thead>
          <tr><th>Card</th><th>Home</th><th>Owned</th><th>Value</th></tr>
        </thead>
        <tbody>
          ${value.lines
            .slice(0, 100)
            .map(
              ({ card, value: v, own }) => `
            <tr>
              <td>
                <strong>${escapeHtml(card.name)}</strong><br/>
                <span class="muted" style="font-family:var(--font-mono);font-size:0.75rem">${escapeHtml(card.number)}</span>
              </td>
              <td class="muted">${cardHome(card)}</td>
              <td class="muted">${own.copies}/${MAX_COPIES}${own.iconic ? ' +A' : ''}</td>
              <td class="num">${formatUsd(v)}</td>
            </tr>`,
            )
            .join('') || `<tr><td colspan="4" class="muted">Own some cards to see value — or reload prices if the table is empty.</td></tr>`}
        </tbody>
      </table>
    </section>
  `;

  document.querySelector('#reload-prices')?.addEventListener('click', async () => {
    toast('Reloading prices…');
    try {
      const pack = await loadPrices();
      state.prices = pack.map;
      state.pricesUpdatedAt = pack.updatedAt;
      if (!Object.keys(state.prices).length) {
        toast('No prices loaded — run npm run prices:fetch');
      } else {
        toast(`Loaded ${Object.keys(state.prices).length} card prices`);
      }
      renderView();
    } catch (err) {
      toast(err.message);
    }
  });
}

/* ========== Modal ========== */

function renderModal() {
  const root = document.querySelector('#modal-root');
  if (!root) return;
  if (!state.modalCardId) {
    root.innerHTML = '';
    return;
  }
  const c = state.cards.find((x) => x.id === state.modalCardId);
  if (!c) {
    root.innerHTML = '';
    return;
  }
  const o = getOwn(state.ownership, c.id);
  const p = state.prices[c.id] || {};
  const art = imageForCard(c.id, { iconic: o.iconic });
  const artUrl = art?.urlHi || art?.url || '';
  const tcgUrl = art?.productId
    ? `https://www.tcgplayer.com/product/${art.productId}`
    : `https://www.tcgplayer.com/search/cyberpunk-tcg/product?productLineName=cyberpunk-tcg&q=${encodeURIComponent(c.name.split(':')[0])}`;
  const artistName = (c.artist && String(c.artist).trim()) || null;
  const sameArtist = artistName
    ? cardsByArtist(state.cards, artistName).filter((x) => x.id !== c.id)
    : [];

  root.innerHTML = `
    <div class="modal-backdrop" id="modal-bg">
      <div class="modal" role="dialog" aria-modal="true">
        <p class="eyebrow">${escapeHtml(c.id)}${art?.tcgNumber ? ` · ${escapeHtml(art.tcgNumber)}` : ''}</p>
        <h3>${escapeHtml(c.name)}</h3>
        <p class="muted">${c.type} · ${c.rarity}${c.eurodollars != null ? ` · E$${c.eurodollars}` : ''} · ${slotLabel(c)}</p>
        ${
          artistName
            ? `<p class="modal-artist">Illust · <button type="button" class="linkish" data-open-artist="${escapeHtml(artistName)}">${escapeHtml(artistName)}</button></p>`
            : ''
        }
        ${
          artUrl
            ? `<img class="modal-art" src="${artUrl}" alt="${escapeHtml(c.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
            : ''
        }
        ${c.notes ? `<p class="hint">${escapeHtml(c.notes)}</p>` : ''}
        <div class="settings-row" data-id="${c.id}">
          ${htmlCopyControls(c, state.ownership, { prefix: 'mcopy' })}
        </div>
        <p class="hint">Binder playset uses copies 1–${BINDER_PLAYSET}; track up to ${MAX_COPIES} total for value.</p>
        <label style="display:grid;gap:0.35rem;margin-top:1rem;font-size:0.8rem;color:var(--muted)">
          Price override (USD)
          <input type="number" step="0.01" min="0" id="override-input"
            placeholder="${p.base != null ? p.base : 'market'}"
            value="${o.price_override_usd != null ? o.price_override_usd : ''}" />
        </label>
        <p class="hint">Market base ${formatUsd(p.base || 0)}${c.has_iconic ? ` · Iconic ${formatUsd(p.iconic || 0)}` : ''}${
          state.settings.value_count_copies && o.copies > 1
            ? ` · line ≈ ${formatUsd((o.price_override_usd != null ? Number(o.price_override_usd) : Number(p.base || 0)) * o.copies + (c.has_iconic && o.iconic ? Number(p.iconic || 0) : 0))}`
            : ''
        }</p>
        ${
          sameArtist.length
            ? `<div class="modal-related">
                <p class="eyebrow">Also by ${escapeHtml(artistName)}</p>
                <div class="modal-related-grid">
                  ${sameArtist
                    .slice(0, 12)
                    .map((x) => {
                      const xa = imageForCard(x.id, { iconic: false });
                      return `<button type="button" class="modal-related-tile" data-open-related="${x.id}" title="${escapeHtml(x.name)}">
                        ${xa?.url ? `<img src="${xa.url}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />` : ''}
                        <span>${escapeHtml(x.number)}</span>
                      </button>`;
                    })
                    .join('')}
                </div>
                ${sameArtist.length > 12 ? `<p class="hint">${sameArtist.length - 12} more in Artists on Ops</p>` : ''}
              </div>`
            : ''
        }
        <div class="actions">
          <button type="button" class="btn primary" id="save-override">Save override</button>
          <a class="btn" href="${tcgUrl}" target="_blank" rel="noopener">TCGPlayer</a>
          <button type="button" class="btn ghost" id="close-modal">Close</button>
        </div>
      </div>
    </div>
  `;

  const close = () => {
    state.modalCardId = null;
    renderModal();
  };
  document.querySelector('#modal-bg')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-bg') close();
  });
  document.querySelector('#close-modal')?.addEventListener('click', close);
  bindCopyControls(root, { prefix: 'mcopy' });
  document.querySelector('[data-miconic]')?.addEventListener('click', () => toggleIconic(c.id));
  document.querySelector('#save-override')?.addEventListener('click', () => {
    const v = document.querySelector('#override-input')?.value;
    setOverride(c.id, v);
  });
  document.querySelector('[data-open-artist]')?.addEventListener('click', () => {
    state.modalCardId = null;
    state.view = 'dashboard';
    state.opsReveal = 'artists';
    state.opsArtist = artistName;
    renderShell();
    requestAnimationFrame(() => {
      document.querySelector('#ops-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.querySelectorAll('[data-open-related]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.modalCardId = btn.dataset.openRelated;
      renderModal();
    });
  });
}

/* ========== Boot ========== */

async function init() {
  if (!isConfigured) {
    if (localStorage.getItem('ncb-demo') === '1') {
      state.user = { id: 'demo-local', email: 'demo@local' };
      await bootApp();
      return;
    }
    renderAuth();
    return;
  }

  const { data } = await supabase.auth.getSession();
  if (data.session) {
    state.session = data.session;
    state.user = data.session.user;
    await bootApp();
  } else {
    renderAuth();
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    state.session = session;
    state.user = session?.user || null;
    if (session?.user) {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (!state.cards.length) await bootApp();
      }
    } else if (event === 'SIGNED_OUT') {
      renderAuth();
    }
  });
}

init();
