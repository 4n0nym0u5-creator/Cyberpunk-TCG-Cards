import './styles.css';
import { supabase, isConfigured, appRedirectUrl } from './lib/supabase.js';
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
  computeValue,
  formatUsd,
  getOwn,
  nextEmptySlot,
  slotLabel,
} from './stats.js';
import { renderBinder } from './binder.js';

const app = document.querySelector('#app');

const state = {
  session: null,
  user: null,
  cards: [],
  ownership: {},
  prices: {},
  pricesUpdatedAt: null,
  settings: { completion_mode: 'ms01', value_count_copies: false },
  view: 'dashboard',
  filter: {
    q: '',
    type: 'all',
    set: 'MS01',
    missing: false,
  },
  binderSheet: 3,
  binderFace: 'F',
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

function renderAuth(message = '', isError = false) {
  const configured = isConfigured;
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
              <input type="email" name="email" required placeholder="you@night.city" autocomplete="email" />
            </label>
            <button class="btn primary" type="submit">Send magic link</button>
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
    document.querySelector('#auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = new FormData(e.target).get('email');
      const status = document.querySelector('#auth-status');
      status.textContent = 'Sending…';
      status.classList.remove('error');
      const redirectTo = appRedirectUrl();
      const { error } = await supabase.auth.signInWithOtp({
        email: String(email),
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        status.textContent = error.message;
        status.classList.add('error');
        return;
      }
      status.textContent =
        'Check your email for the magic link. It opens the live site (GitHub Pages) — ignore any localhost links from older emails.';
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
          <button type="button" data-view="binder">Binder</button>
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
  else if (state.view === 'value') renderValue(root);
  renderModal();
}

/* ========== Ownership mutations ========== */

async function setCopies(cardId, copies) {
  const prev = getOwn(state.ownership, cardId);
  const next = { ...prev, copies };
  state.ownership = { ...state.ownership, [cardId]: next };
  renderView();
  try {
    await upsertOwnership(state.user?.id, cardId, next);
  } catch (err) {
    toast(err.message);
  }
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

function renderDashboard(root) {
  const progress = computeProgress(state.cards, state.ownership, state.settings);
  const value = computeValue(state.cards, state.ownership, state.prices, state.settings);
  const next = nextEmptySlot(state.cards, state.ownership);
  const ms01Pct = progress.ms01Total
    ? Math.round((progress.ms01Owned / progress.ms01Total) * 100)
    : 0;
  const iconicPct = progress.iconicTotal
    ? Math.round((progress.iconicOwned / progress.iconicTotal) * 100)
    : 0;

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
        <p>20 Legends · 69 Units · 17 Gear · 34 Programs — fill the binder in collector order.</p>
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
      <article class="stat-card">
        <h3>MS01 base</h3>
        <div class="value">${progress.ms01Owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${progress.ms01Total}</span></div>
        <div class="sub">${ms01Pct}% · colour tree complete</div>
        <div class="progress-track"><div class="progress-fill" style="width:${ms01Pct}%"></div></div>
      </article>
      <article class="stat-card">
        <h3>Iconic alts</h3>
        <div class="value">${progress.iconicOwned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${progress.iconicTotal}</span></div>
        <div class="sub">${iconicPct}% · 140 + 31 = 171</div>
        <div class="progress-track"><div class="progress-fill" style="width:${iconicPct}%;background:var(--cp-danger)"></div></div>
      </article>
      <article class="stat-card">
        <h3>Market value</h3>
        <div class="value">${formatUsd(value.total)}</div>
        <div class="sub">${value.priced} lines · USD</div>
      </article>
      <article class="stat-card">
        <h3>Set run</h3>
        <div class="value">${progress.setOwned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${progress.setTotal}</span></div>
        <div class="sub">Base + Iconic</div>
      </article>
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
            <option value="ms01" ${state.settings.completion_mode === 'ms01' ? 'selected' : ''}>MS01 only (140)</option>
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

  document.querySelector('#goto-next')?.addEventListener('click', () => {
    state.view = 'checklist';
    state.filter.q = next?.number || '';
    renderShell();
  });
  document.querySelector('#goto-binder')?.addEventListener('click', () => {
    if (!next) return;
    state.view = 'binder';
    state.binderSheet = next.sheet || 3;
    state.binderFace = next.face || 'F';
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
      rows.push(`<div class="band-header showcase">Showcase · extras (not MS01)</div>`);
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
    const complete = o.copies >= 3;
    const p = state.prices[c.id] || {};
    const price = o.price_override_usd != null ? o.price_override_usd : p.base;

    rows.push(`
      <div class="card-row ${complete ? 'complete' : ''}" data-id="${c.id}">
        <div class="copy-toggles">
          ${[1, 2, 3]
            .map(
              (n) =>
                `<button type="button" class="copy-btn ${o.copies >= n ? 'on' : ''}" data-copy="${n}" title="Copy ${n}">${n}</button>`,
            )
            .join('')}
          <button type="button" class="iconic-btn ${o.iconic ? 'on' : ''}" data-iconic="1"
            ${c.has_iconic ? '' : 'disabled'} title="Iconic alt art">A</button>
        </div>
        <div class="card-id">${escapeHtml(c.number)}</div>
        <div class="card-main">
          <div class="name">${escapeHtml(c.name)}${c.notes ? ' <span class="notes-flag" title="' + escapeHtml(c.notes) + '">*</span>' : ''}</div>
          <div class="meta">${c.type} · ${c.rarity}${c.eurodollars != null ? ` · E$${c.eurodollars}` : ''}</div>
        </div>
        <div class="card-side">
          <span class="price">${price != null ? formatUsd(price) : '—'}</span>
          <span>${slotLabel(c)}</span>
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
          <p class="muted print-only">CYBERPUNK TCG — Welcome to Night City (Beta) · MS01-001 to MS01-140 · 1 2 3 = copies · A = Iconic</p>
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

  root.querySelectorAll('.card-row').forEach((row) => {
    const id = row.dataset.id;
    row.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const n = Number(btn.dataset.copy);
        const cur = getOwn(state.ownership, id).copies;
        // tap same number to clear down to n-1; tap higher to set
        const next = cur === n ? n - 1 : n;
        setCopies(id, next);
      });
    });
    row.querySelector('[data-iconic]')?.addEventListener('click', () => toggleIconic(id));
    row.querySelector('.card-main')?.addEventListener('click', () => {
      state.modalCardId = id;
      renderModal();
    });
  });
}

/* ========== Binder ========== */

function renderBinderView(root) {
  renderBinder(root, state, {
    setSheet: (n) => {
      state.binderSheet = n;
      renderView();
    },
    setFace: (f) => {
      state.binderFace = f;
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
  const updated = state.pricesUpdatedAt
    ? typeof state.pricesUpdatedAt === 'string' && state.pricesUpdatedAt.includes('estimate')
      ? state.pricesUpdatedAt
      : new Date(state.pricesUpdatedAt).toLocaleString()
    : 'unknown';

  root.innerHTML = `
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Street value · USD</p>
          <h2>${formatUsd(value.total)}</h2>
          <p class="muted">Prices as of ${escapeHtml(String(updated))} · ${value.priced} owned lines</p>
        </div>
      </header>
      <p class="hint no-print">Default: one market price per owned base + Iconic if A is checked. Toggle “Value counts all copies” on Ops to multiply by 1–3. Per-card overrides in card detail. Refresh shared prices with <code>npm run prices</code>.</p>
      <table class="value-table">
        <thead>
          <tr><th>Card</th><th>Owned</th><th>Value</th></tr>
        </thead>
        <tbody>
          ${value.lines
            .slice(0, 80)
            .map(
              ({ card, value: v, own }) => `
            <tr>
              <td>
                <strong>${escapeHtml(card.name)}</strong><br/>
                <span class="muted" style="font-family:var(--font-mono);font-size:0.75rem">${escapeHtml(card.number)}</span>
              </td>
              <td class="muted">${own.copies}/3${own.iconic ? ' +A' : ''}</td>
              <td class="num">${formatUsd(v)}</td>
            </tr>`,
            )
            .join('') || `<tr><td colspan="3" class="muted">Own some cards to see value.</td></tr>`}
        </tbody>
      </table>
    </section>
  `;
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
  const tcgUrl = `https://www.tcgplayer.com/search/cyberpunk-tcg/product?productLineName=cyberpunk-tcg&q=${encodeURIComponent(c.name.split(':')[0])}`;

  root.innerHTML = `
    <div class="modal-backdrop" id="modal-bg">
      <div class="modal" role="dialog" aria-modal="true">
        <p class="eyebrow">${escapeHtml(c.id)}</p>
        <h3>${escapeHtml(c.name)}</h3>
        <p class="muted">${c.type} · ${c.rarity}${c.eurodollars != null ? ` · E$${c.eurodollars}` : ''} · ${slotLabel(c)}</p>
        ${c.notes ? `<p class="hint">${escapeHtml(c.notes)}</p>` : ''}
        <div class="settings-row">
          <div class="copy-toggles">
            ${[1, 2, 3]
              .map(
                (n) =>
                  `<button type="button" class="copy-btn ${o.copies >= n ? 'on' : ''}" data-mcopy="${n}">${n}</button>`,
              )
              .join('')}
            <button type="button" class="iconic-btn ${o.iconic ? 'on' : ''}" data-miconic="1" ${c.has_iconic ? '' : 'disabled'}>A</button>
          </div>
        </div>
        <label style="display:grid;gap:0.35rem;margin-top:1rem;font-size:0.8rem;color:var(--muted)">
          Price override (USD)
          <input type="number" step="0.01" min="0" id="override-input"
            placeholder="${p.base != null ? p.base : 'market'}"
            value="${o.price_override_usd != null ? o.price_override_usd : ''}" />
        </label>
        <p class="hint">Market base ${formatUsd(p.base || 0)}${c.has_iconic ? ` · Iconic ${formatUsd(p.iconic || 0)}` : ''}</p>
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
  document.querySelectorAll('[data-mcopy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = Number(btn.dataset.mcopy);
      const cur = getOwn(state.ownership, c.id).copies;
      setCopies(c.id, cur === n ? n - 1 : n);
    });
  });
  document.querySelector('[data-miconic]')?.addEventListener('click', () => toggleIconic(c.id));
  document.querySelector('#save-override')?.addEventListener('click', () => {
    const v = document.querySelector('#override-input')?.value;
    setOverride(c.id, v);
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
