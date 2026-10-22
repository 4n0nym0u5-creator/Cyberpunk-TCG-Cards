(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e;(function(e){e.Any=`any`,e.ApNortheast1=`ap-northeast-1`,e.ApNortheast2=`ap-northeast-2`,e.ApSouth1=`ap-south-1`,e.ApSoutheast1=`ap-southeast-1`,e.ApSoutheast2=`ap-southeast-2`,e.CaCentral1=`ca-central-1`,e.EuCentral1=`eu-central-1`,e.EuWest1=`eu-west-1`,e.EuWest2=`eu-west-2`,e.EuWest3=`eu-west-3`,e.SaEast1=`sa-east-1`,e.UsEast1=`us-east-1`,e.UsWest1=`us-west-1`,e.UsWest2=`us-west-2`})(e||={});var t;(function(e){e.abstime=`abstime`,e.bool=`bool`,e.date=`date`,e.daterange=`daterange`,e.float4=`float4`,e.float8=`float8`,e.int2=`int2`,e.int4=`int4`,e.int4range=`int4range`,e.int8=`int8`,e.int8range=`int8range`,e.json=`json`,e.jsonb=`jsonb`,e.money=`money`,e.numeric=`numeric`,e.oid=`oid`,e.reltime=`reltime`,e.text=`text`,e.time=`time`,e.timestamp=`timestamp`,e.timestamptz=`timestamptz`,e.timetz=`timetz`,e.tsrange=`tsrange`,e.tstzrange=`tstzrange`})(t||={});var n=(e,n)=>{if(e.charAt(0)===`_`)return s(n,e.slice(1,e.length));switch(e){case t.bool:return i(n);case t.float4:case t.float8:case t.int2:case t.int4:case t.int8:case t.numeric:case t.oid:return a(n);case t.json:case t.jsonb:return o(n);case t.timestamp:return c(n);case t.abstime:case t.date:case t.daterange:case t.int4range:case t.int8range:case t.money:case t.reltime:case t.text:case t.time:case t.timestamptz:case t.timetz:case t.tsrange:case t.tstzrange:return r(n);default:return r(n)}},r=e=>e,i=e=>{switch(e){case`t`:return!0;case`f`:return!1;default:return e}},a=e=>{if(typeof e==`string`){let t=parseFloat(e);if(!Number.isNaN(t))return t}return e},o=e=>{if(typeof e==`string`)try{return JSON.parse(e)}catch{return e}return e},s=(e,t)=>{if(typeof e!=`string`)return e;let r=e.length-1,i=e[r];if(e[0]===`{`&&i===`}`){let i,a=e.slice(1,r);try{i=JSON.parse(`[`+a+`]`)}catch{i=a?a.split(`,`):[]}return i.map(e=>n(t,e))}return e},c=e=>typeof e==`string`?e.replace(` `,`T`):e,l;(function(e){e.SYNC=`sync`,e.JOIN=`join`,e.LEAVE=`leave`})(l||={});var ee;(function(e){e.ALL=`*`,e.INSERT=`INSERT`,e.UPDATE=`UPDATE`,e.DELETE=`DELETE`})(ee||={});var te;(function(e){e.BROADCAST=`broadcast`,e.PRESENCE=`presence`,e.POSTGRES_CHANGES=`postgres_changes`,e.SYSTEM=`system`})(te||={});var ne;(function(e){e.SUBSCRIBED=`SUBSCRIBED`,e.TIMED_OUT=`TIMED_OUT`,e.CLOSED=`CLOSED`,e.CHANNEL_ERROR=`CHANNEL_ERROR`})(ne||={});function u(e){"@babel/helpers - typeof";return u=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},u(e)}function d(e,t){if(u(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(u(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function re(e){var t=d(e,`string`);return u(t)==`symbol`?t:t+``}function ie(e,t,n){return(t=re(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?f(Object(n),!0).forEach(function(t){ie(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var m=class extends Error{constructor(e,t=`storage`,n,r){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t===`vectors`?`StorageVectorsError`:`StorageError`,this.status=n,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}},h=class extends m{constructor(e,t,n,r=`storage`,i){super(e,r,t,n),this.name=r===`vectors`?`StorageVectorsApiError`:`StorageApiError`,this.status=t,this.statusCode=n,this.code=i}toJSON(){return p(p({},super.toJSON()),{},{code:this.code})}},ae=class extends m{constructor(e,t,n=`storage`){super(e,n),this.name=n===`vectors`?`StorageVectorsUnknownError`:`StorageUnknownError`,this.originalError=t}};function oe(e,t,n){let r=p({},e),i=t.toLowerCase();for(let e of Object.keys(r))e.toLowerCase()===i&&delete r[e];return r[i]=n,r}var se=e=>{if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},g=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error;if(typeof t.error==`object`&&t.error!==null){let e=t.error;if(typeof e.message==`string`)return e.message}}return JSON.stringify(e)},ce=async(e,t,n,r)=>{if(typeof e==`object`&&e&&`json`in e&&typeof e.json==`function`){let n=e,i=parseInt(String(n.status),10);Number.isFinite(i)||(i=500),n.json().then(e=>{let n=e?.statusCode||e?.code||i+``;t(new h(g(e),i,n,r,e?.code))}).catch(()=>{let e=i+``;t(new h(n.statusText||`HTTP ${i} error`,i,e,r))})}else t(new ae(g(e),e,r))},le=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};if(e===`GET`||e===`HEAD`||!r)return p(p({},i),n);if(se(r)){let e=t?.headers||{},n;for(let[t,r]of Object.entries(e))t.toLowerCase()===`content-type`&&(n=r);i.headers=oe(e,`Content-Type`,n??`application/json`),i.body=JSON.stringify(r)}else i.body=r;return t?.duplex&&(i.duplex=t.duplex),p(p({},i),n)};async function _(e,t,n,r,i,a,o){return new Promise((s,c)=>{e(n,le(t,r,i,a)).then(e=>{if(!e.ok)throw e;if(r?.noResolveJson)return e;if(o===`vectors`){let t=e.headers.get(`content-type`);if(e.headers.get(`content-length`)===`0`||e.status===204||!t||!t.includes(`application/json`))return{}}return e.json()}).then(e=>s(e)).catch(e=>ce(e,c,r,o))})}function ue(e=`storage`){return{get:async(t,n,r,i)=>_(t,`GET`,n,r,i,void 0,e),post:async(t,n,r,i,a)=>_(t,`POST`,n,i,a,r,e),put:async(t,n,r,i,a)=>_(t,`PUT`,n,i,a,r,e),head:async(t,n,r,i)=>_(t,`HEAD`,n,p(p({},r),{},{noResolveJson:!0}),i,void 0,e),remove:async(t,n,r,i,a)=>_(t,`DELETE`,n,i,a,r,e)}}var{get:de,post:fe,put:pe,head:me,remove:he}=ue(`storage`),ge=`2.118.0`,v=3e4;3*v,2*v,`${ge}`;var y=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(``),b=` 	
\r=`.split(``);(()=>{let e=Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<b.length;t+=1)e[b[t].charCodeAt(0)]=-2;for(let t=0;t<y.length;t+=1)e[y[t].charCodeAt(0)]=t;return e})();var _e=()=>typeof window<`u`&&typeof document<`u`,x={tested:!1,writable:!1};globalThis&&(()=>{if(!_e())return!1;try{if(typeof globalThis.localStorage!=`object`)return!1}catch{return!1}if(x.tested)return x.writable;let e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),x.tested=!0,x.writable=!0}catch{x.tested=!0,x.writable=!1}return x.writable})()&&globalThis.localStorage&&globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`);function ve(){if(typeof globalThis!=`object`)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<`u`&&(self.globalThis=self)}}new class{createNewAbortSignal(){if(this.controller){let e=Error(`Cancelling existing WebAuthn API call for new one`);e.name=`AbortError`,this.controller.abort(e)}let e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){let e=Error(`Manually cancelling existing WebAuthn API call`);e.name=`AbortError`,this.controller.abort(e),this.controller=void 0}}},ve();var S=`2.118.0`,C=``,w;if(typeof Deno<`u`)C=`deno`,w=Deno.version?.deno;else if(typeof document<`u`)C=`web`;else if(typeof navigator<`u`&&navigator.product===`ReactNative`)C=`react-native`;else{var T;C=`node`;let e=globalThis.process;w=e==null||(T=e.version)==null?void 0:T.replace(/^v/,``)}var E=[`runtime=${C}`];w&&E.push(`runtime-version=${w}`),`${S}${E.join(`; `)}`;function ye(){if(typeof window<`u`||globalThis.Deno!==void 0)return!1;let e=globalThis.process;if(!e)return!1;let t=e.version;if(t==null)return!1;let n=t.match(/^v(\d+)\./);return n?parseInt(n[1],10)<=20:!1}ye()&&console.warn(`⚠️  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715`);var be=!1,D=null;function O(e){return`/Cyberpunk-TCG-Cards/${String(e).replace(/^\//,``)}`}var k=`ncb-ownership`,A=`ncb-settings`;function j(){try{return JSON.parse(localStorage.getItem(k)||`{}`)}catch{return{}}}function M(e){localStorage.setItem(k,JSON.stringify(e))}function N(){return{completion_mode:`ms01`,value_count_copies:!1}}async function P(e){return j()}async function F(e,t,n){let r={copies:n.copies??0,iconic:!!n.iconic,price_override_usd:n.price_override_usd===void 0?null:n.price_override_usd};{let e=j();return e[t]=r,M(e),r}}async function xe(e){try{return{...N(),...JSON.parse(localStorage.getItem(A)||`{}`)}}catch{return N()}}async function I(e,t){let n={...N(),...t};return localStorage.setItem(A,JSON.stringify(n)),n}async function L(){let e=await fetch(O(`data/cards.json`));if(!e.ok)throw Error(`Failed to load card catalog`);return e.json()}async function Se(){return{map:{},updatedAt:null}}function R(e,t){return e[t]||{copies:0,iconic:!1,price_override_usd:null}}function Ce(e,t,n){let r=(n?.completion_mode||`ms01`)===`everything_beta`?e:e.filter(e=>e.set_code===`MS01`),i=e.filter(e=>e.set_code===`MS01`),a=i.filter(e=>e.has_iconic),o=0,s=0,c=0;for(let e of i){let n=R(t,e.id);n.copies>0&&(o+=1),e.has_iconic&&n.iconic&&(s+=1)}for(let e of r)R(t,e.id).copies>0&&(c+=1);let l=i.filter(e=>R(t,e.id).copies===0);return{ms01Total:i.length,ms01Owned:o,iconicTotal:a.length,iconicOwned:s,everythingTotal:r.length,everythingOwned:c,missing:l,setTotal:i.length+a.length,setOwned:o+s}}function we(e,t,n,r){let i=R(t,e.id);if(i.copies<=0&&!i.iconic)return 0;let a=n[e.id]||{},o=i.price_override_usd==null?Number(a.base||0):Number(i.price_override_usd),s=Number(a.iconic||0),c=r?.value_count_copies?Math.max(i.copies,0):+(i.copies>0),l=0;return i.copies>0&&(l+=o*c),e.has_iconic&&i.iconic&&(l+=s),l}function z(e,t,n,r){let i=0,a=0,o=[];for(let s of e){let e=we(s,t,n,r);e>0&&(i+=e,a+=1,o.push({card:s,value:e,own:R(t,s.id)}))}return o.sort((e,t)=>t.value-e.value),{total:i,priced:a,lines:o}}function Te(e,t){return e.filter(e=>e.set_code===`MS01`&&e.sheet!=null).sort((e,t)=>e.sort_order-t.sort_order).find(e=>R(t,e.id).copies===0)||null}function B(e){return new Intl.NumberFormat(`en-US`,{style:`currency`,currency:`USD`,maximumFractionDigits:2}).format(e||0)}function V(e){if(!e.zone||e.sheet==null)return`—`;let t=`${e.zone}${String(e.zone_slot??``).padStart(2,`0`)}`;return!e.face||!e.row_pos?t:`${t} s${e.sheet}${e.face}${e.row_pos}`}function Ee(e,t,n){let r=e.filter(e=>e.sheet===t&&e.face===n&&e.row_pos).sort((e,t)=>e.row_pos-t.row_pos||e.sort_order-t.sort_order),i=[];for(let e=1;e<=3;e+=1)for(let t=1;t<=3;t+=1)i.push({index:(e-1)*3+t,row:e,col:t,card:null});for(let e of r){let t=e.row_pos;t>=1&&t<=3&&(i[t-1].card=e)}return i}function De(e){return e<=2?`Showcase`:e<=7?`Legends`:e<=20?`Units`:e<=23?`Gear`:e<=29?`Programs`:`Spare`}function Oe(e,t,n){let{cards:r,ownership:i,binderSheet:a,binderFace:o}=t,s=a,c=o,l=Ee(r,s,c);e.innerHTML=`
    <section class="panel binder-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">3×3 · 48 sheets double-sided</p>
          <h2>Sheet ${s} · ${c===`F`?`Front`:`Back`}</h2>
          <p class="muted">${De(s)} zone · Night City run</p>
        </div>
        <div class="binder-controls">
          <button type="button" class="btn ghost" data-binder="prev" ${s<=1?`disabled`:``}>←</button>
          <label class="sheet-jump">
            <span class="sr-only">Sheet</span>
            <input type="number" min="1" max="48" value="${s}" data-binder="jump" />
          </label>
          <button type="button" class="btn ghost" data-binder="next" ${s>=48?`disabled`:``}>→</button>
          <button type="button" class="btn" data-binder="flip">${c===`F`?`Flip to Back`:`Flip to Front`}</button>
        </div>
      </header>

      <div class="binder-page" data-face="${c}">
        <div class="binder-grid">
          ${l.map(e=>{if(!e.card)return`<div class="pocket empty" title="Spare pocket"><span class="pocket-idx">${e.index}</span><span class="pocket-spare">spare</span></div>`;let t=R(i,e.card.id),n=t.copies>0,r=t.copies>=3;return`
                <button type="button" class="pocket ${n?`owned`:``} ${r?`complete`:``} ${t.iconic?`has-iconic`:``}"
                  data-card-id="${e.card.id}" title="${e.card.name}">
                  <span class="pocket-idx">${e.index}</span>
                  <span class="pocket-num">${e.card.number}</span>
                  <span class="pocket-name">${ke(e.card.name)}</span>
                  <span class="pocket-meta">${e.card.rarity} · ${t.copies}/3${e.card.has_iconic?t.iconic?` · A`:` · —`:``}</span>
                  <span class="pocket-slot">${V(e.card)}</span>
                </button>`}).join(``)}
        </div>
      </div>

      <p class="hint">F1–F3 / B1–B3 fill the top row left→right; middle and bottom pockets are spare. Work the checklist in collector order and the binder fills itself.</p>
    </section>
  `,e.querySelector(`[data-binder="prev"]`)?.addEventListener(`click`,()=>n.setSheet(Math.max(1,s-1))),e.querySelector(`[data-binder="next"]`)?.addEventListener(`click`,()=>n.setSheet(Math.min(48,s+1))),e.querySelector(`[data-binder="flip"]`)?.addEventListener(`click`,()=>n.setFace(c===`F`?`B`:`F`)),e.querySelector(`[data-binder="jump"]`)?.addEventListener(`change`,e=>{let t=Math.min(48,Math.max(1,Number(e.target.value)||1));n.setSheet(t)}),e.querySelectorAll(`.pocket[data-card-id]`).forEach(e=>{e.addEventListener(`click`,()=>n.openCard(e.dataset.cardId))})}function ke(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var H=document.querySelector(`#app`),U={session:null,user:null,cards:[],ownership:{},prices:{},pricesUpdatedAt:null,settings:{completion_mode:`ms01`,value_count_copies:!1},view:`dashboard`,filter:{q:``,type:`all`,set:`MS01`,missing:!1},binderSheet:3,binderFace:`F`,modalCardId:null,busy:!1};function W(e){let t=document.querySelector(`.toast`);t||(t=document.createElement(`div`),t.className=`toast`,document.body.appendChild(t)),t.textContent=e,t.classList.add(`show`),clearTimeout(W._t),W._t=setTimeout(()=>t.classList.remove(`show`),2200)}function G(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function K(e=``,t=!1){let n=be;H.innerHTML=`
    <div class="auth-screen">
      <div class="auth-bg" aria-hidden="true">
        <img src="${O(`brand/wall-smasher.webp`)}" alt="" class="auth-bg-img" />
        <div class="auth-bg-fade"></div>
      </div>
      <div class="auth-card">
        <img class="auth-logo" src="${O(`brand/logo-yellow.webp`)}" alt="Cyberpunk TCG" width="320" height="80" />
        <img class="auth-set-logo" src="${O(`brand/logo-wtnc.webp`)}" alt="Welcome to Night City" width="280" height="60" />
        <h1>Night City <span class="glitch">Binder</span></h1>
        <p>Fill your 3×3 binder. Track MS01 completion, Iconic alts, and live USD value — synced across every device you jack into.</p>
        ${n?`
          <form class="auth-form" id="auth-form">
            <label>
              Netrunner ID (email)
              <input type="email" name="email" required placeholder="you@night.city" autocomplete="email" />
            </label>
            <button class="btn primary" type="submit">Send magic link</button>
            <div class="auth-status ${t?`error`:``}" id="auth-status">${G(e)}</div>
          </form>`:`
          <button class="btn primary" type="button" id="demo-enter">Enter Night City</button>
          <p class="demo-note">Supabase not linked yet — demo runs local-only.
            Copy <code>.env.example</code> → <code>.env</code>, run migration + seed, reload for cross-device sync.</p>
          <div class="auth-status ${t?`error`:``}">${G(e)}</div>`}
      </div>
    </div>
  `,n?document.querySelector(`#auth-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=new FormData(e.target).get(`email`),n=document.querySelector(`#auth-status`);n.textContent=`Sending…`,n.classList.remove(`error`);let{error:r}=await D.auth.signInWithOtp({email:String(t),options:{emailRedirectTo:window.location.origin}});r?(n.textContent=r.message,n.classList.add(`error`)):n.textContent=`Check your email for the magic link.`}):document.querySelector(`#demo-enter`)?.addEventListener(`click`,()=>{localStorage.setItem(`ncb-demo`,`1`),U.user={id:`demo-local`,email:`demo@local`},q()})}async function q(){H.innerHTML=`<div class="loading">Jacking in // NC</div>`;try{let[e,t,n,r]=await Promise.all([L(),P(U.user?.id),Se(),xe(U.user?.id)]);if(U.cards=e,U.ownership=t,U.prices=n.map,U.pricesUpdatedAt=n.updatedAt,U.settings=r,!Object.keys(U.prices).length){let t={Common:.12,Uncommon:.2,Rare:.45,Epic:4.5,Secret:22,Promo:8,Nova:80},n={Common:3,Uncommon:4,Rare:8,Epic:12,Secret:35,Promo:5,Nova:10};for(let r of e){let e=t[r.rarity]??.25;U.prices[r.id]={base:e},r.has_iconic&&(U.prices[r.id].iconic=e*(n[r.rarity]??10))}U.pricesUpdatedAt=`estimate (refresh via npm run prices)`}J()}catch(e){console.error(e),H.innerHTML=`<div class="loading">Failed to load: ${G(e.message)}</div>`}}function J(){H.innerHTML=`
    <div class="app-shell">
      <header class="topbar no-print">
        <div class="brand">
          <a class="brand-lockup" href="#" data-view-home="dashboard" title="Night City Binder">
            <img class="brand-logo" src="${O(`brand/logo-yellow.webp`)}" alt="Cyberpunk TCG" width="160" height="40" />
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
          <span>${G(U.user?.email||`collector`)}</span>
          <span class="badge" style="background:var(--cp-danger);color:#fff">DEMO</span>
        </div>
      </header>
      <main class="main" id="view"></main>
      <footer class="app-foot no-print">
        <span>Fan collection tool · Art &amp; logos © CD PROJEKT / R. Talsorian / Cyberpunk TCG</span>
      </footer>
    </div>
    <div id="modal-root"></div>
  `,document.querySelector(`[data-view-home]`)?.addEventListener(`click`,e=>{e.preventDefault(),U.view=`dashboard`,J()}),document.querySelectorAll(`#nav [data-view]`).forEach(e=>{e.addEventListener(`click`,()=>{U.view=e.dataset.view,J()}),e.dataset.view===U.view&&e.classList.add(`active`)}),document.querySelector(`#sign-out`)?.addEventListener(`click`,async()=>{await D.auth.signOut(),U.user=null,U.session=null,K()}),Y()}function Y(){let e=document.querySelector(`#view`);e&&(U.view===`dashboard`?je(e):U.view===`checklist`?Q(e):U.view===`binder`?Ne(e):U.view===`value`&&Pe(e),$())}async function X(e,t){let n={...R(U.ownership,e),copies:t};U.ownership={...U.ownership,[e]:n},Y();try{await F(U.user?.id,e,n)}catch(e){W(e.message)}}async function Z(e){if(!U.cards.find(t=>t.id===e)?.has_iconic)return;let t=R(U.ownership,e),n={...t,iconic:!t.iconic};U.ownership={...U.ownership,[e]:n},Y();try{await F(U.user?.id,e,n)}catch(e){W(e.message)}}async function Ae(e,t){let n={...R(U.ownership,e),price_override_usd:t===``||t==null?null:Number(t)};U.ownership={...U.ownership,[e]:n};try{await F(U.user?.id,e,n),W(`Price override saved`)}catch(e){W(e.message)}Y()}function je(e){let t=Ce(U.cards,U.ownership,U.settings),n=z(U.cards,U.ownership,U.prices,U.settings),r=Te(U.cards,U.ownership),i=t.ms01Total?Math.round(t.ms01Owned/t.ms01Total*100):0,a=t.iconicTotal?Math.round(t.iconicOwned/t.iconicTotal*100):0;e.innerHTML=`
    <section class="hero-strip">
      <div class="hero-media" aria-hidden="true">
        <img src="${O(`brand/banner.webp`)}" alt="" class="hero-banner" />
        <div class="hero-fade"></div>
      </div>
      <div class="hero-copy">
        <img class="hero-set-logo" src="${O(`brand/logo-wtnc.webp`)}" alt="Welcome to Night City" width="340" height="72" />
        <p class="eyebrow">Collector ops · Beta set MS01</p>
        <h1>Build the binder. Own the street.</h1>
        <p>20 Legends · 69 Units · 17 Gear · 34 Programs — fill the binder in collector order.</p>
      </div>
      <div class="hero-product no-print" aria-hidden="true">
        <img src="${O(`brand/box.webp`)}" alt="" class="hero-box" />
        <img src="${O(`brand/booster.webp`)}" alt="" class="hero-booster" />
      </div>
    </section>

    <section class="cast-rail no-print" aria-label="Night City cast">
      ${[[`wall-jackie.webp`,`Jackie`],[`wall-lucy.webp`,`Lucy`],[`wall-smasher.webp`,`Adam Smasher`],[`wall-hanako.webp`,`Hanako`],[`wall-dumdum.webp`,`Dum Dum`]].map(([e,t])=>`
        <figure class="cast-card">
          <img src="${O(`brand/${e}`)}" alt="${t}" loading="lazy" />
          <figcaption>${t}</figcaption>
        </figure>`).join(``)}
    </section>

    <section class="dash-grid">
      <article class="stat-card">
        <h3>MS01 base</h3>
        <div class="value">${t.ms01Owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${t.ms01Total}</span></div>
        <div class="sub">${i}% · colour tree complete</div>
        <div class="progress-track"><div class="progress-fill" style="width:${i}%"></div></div>
      </article>
      <article class="stat-card">
        <h3>Iconic alts</h3>
        <div class="value">${t.iconicOwned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${t.iconicTotal}</span></div>
        <div class="sub">${a}% · 140 + 31 = 171</div>
        <div class="progress-track"><div class="progress-fill" style="width:${a}%;background:var(--cp-danger)"></div></div>
      </article>
      <article class="stat-card">
        <h3>Market value</h3>
        <div class="value">${B(n.total)}</div>
        <div class="sub">${n.priced} lines · USD</div>
      </article>
      <article class="stat-card">
        <h3>Set run</h3>
        <div class="value">${t.setOwned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${t.setTotal}</span></div>
        <div class="sub">Base + Iconic</div>
      </article>
    </section>

    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Next empty slot</p>
          <h2>${r?G(r.name):`Binder locked — complete`}</h2>
          <p class="muted">${r?`${r.number} · ${V(r)} · ${r.type}`:`All MS01 slots owned at least once. Preem work, choom.`}</p>
        </div>
        ${r?`<div class="no-print" style="display:flex;gap:0.45rem;flex-wrap:wrap">
                <button type="button" class="btn primary" id="goto-next">Open checklist</button>
                <button type="button" class="btn" id="goto-binder">Show binder</button>
              </div>`:``}
      </header>
      <div class="settings-row no-print">
        <label>
          Completion mode
          <select id="completion-mode">
            <option value="ms01" ${U.settings.completion_mode===`ms01`?`selected`:``}>MS01 only (140)</option>
            <option value="everything_beta" ${U.settings.completion_mode===`everything_beta`?`selected`:``}>Everything Beta</option>
          </select>
        </label>
        <label>
          <input type="checkbox" id="count-copies" ${U.settings.value_count_copies?`checked`:``} />
          Value counts all copies
        </label>
      </div>
      ${U.settings.completion_mode===`everything_beta`?`<p class="hint">Everything Beta includes showcase promos, Nova toppers, and starter-deck exclusives. Rebecca / Minotaur do not count toward MS01.</p>`:`<p class="hint">Colour tree bands: <span style="color:var(--tree-red)">Red 001–035</span> · <span style="color:var(--tree-yellow)">Yellow 036–070</span> · <span style="color:var(--tree-green)">Green 071–105</span> · <span style="color:var(--tree-blue)">Blue 106–140</span>. Inside each: Legends → Units → Gear → Programs.</p>`}
    </section>
  `,document.querySelector(`#goto-next`)?.addEventListener(`click`,()=>{U.view=`checklist`,U.filter.q=r?.number||``,J()}),document.querySelector(`#goto-binder`)?.addEventListener(`click`,()=>{r&&(U.view=`binder`,U.binderSheet=r.sheet||3,U.binderFace=r.face||`F`,J())}),document.querySelector(`#completion-mode`)?.addEventListener(`change`,async e=>{U.settings=await I(U.user?.id,{...U.settings,completion_mode:e.target.value}),Y()}),document.querySelector(`#count-copies`)?.addEventListener(`change`,async e=>{U.settings=await I(U.user?.id,{...U.settings,value_count_copies:e.target.checked}),Y()})}function Me(){let{q:e,type:t,set:n,missing:r}=U.filter,i=e.trim().toLowerCase();return U.cards.filter(e=>n===`MS01`&&e.set_code!==`MS01`||n===`showcase`&&e.set_code!==`showcase`||t!==`all`&&e.type!==t||r&&R(U.ownership,e.id).copies>0?!1:!i||e.name.toLowerCase().includes(i)||e.number.toLowerCase().includes(i)||e.id.toLowerCase().includes(i)||V(e).toLowerCase().includes(i))}function Q(e){let t=Me(),n=null,r=null,i=[];for(let e of t){e.set_code===`showcase`&&r!==`showcase`?(i.push(`<div class="band-header showcase">Showcase · extras (not MS01)</div>`),r=`showcase`,n=null):e.set_code===`MS01`&&e.band&&e.band!==n&&(i.push(`<div class="band-header ${e.band}">${{red:`Red band · 001–035`,yellow:`Yellow band · 036–070`,green:`Green band · 071–105`,blue:`Blue band · 106–140`}[e.band]}</div>`),n=e.band,r=`MS01`);let t=R(U.ownership,e.id),a=t.copies>=3,o=U.prices[e.id]||{},s=t.price_override_usd==null?o.base:t.price_override_usd;i.push(`
      <div class="card-row ${a?`complete`:``}" data-id="${e.id}">
        <div class="copy-toggles">
          ${[1,2,3].map(e=>`<button type="button" class="copy-btn ${t.copies>=e?`on`:``}" data-copy="${e}" title="Copy ${e}">${e}</button>`).join(``)}
          <button type="button" class="iconic-btn ${t.iconic?`on`:``}" data-iconic="1"
            ${e.has_iconic?``:`disabled`} title="Iconic alt art">A</button>
        </div>
        <div class="card-id">${G(e.number)}</div>
        <div class="card-main">
          <div class="name">${G(e.name)}${e.notes?` <span class="notes-flag" title="`+G(e.notes)+`">*</span>`:``}</div>
          <div class="meta">${e.type} · ${e.rarity}${e.eurodollars==null?``:` · E$${e.eurodollars}`}</div>
        </div>
        <div class="card-side">
          <span class="price">${s==null?`—`:B(s)}</span>
          <span>${V(e)}</span>
        </div>
      </div>
    `)}e.innerHTML=`
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
        <input type="search" id="filter-q" placeholder="Search name, number, slot…" value="${G(U.filter.q)}" />
        <select id="filter-type">
          <option value="all">All types</option>
          ${[`Legend`,`Unit`,`Gear`,`Program`].map(e=>`<option value="${e}" ${U.filter.type===e?`selected`:``}>${e}</option>`).join(``)}
        </select>
        <select id="filter-set">
          <option value="MS01" ${U.filter.set===`MS01`?`selected`:``}>MS01 set</option>
          <option value="showcase" ${U.filter.set===`showcase`?`selected`:``}>Showcase extras</option>
          <option value="all" ${U.filter.set===`all`?`selected`:``}>All cards</option>
        </select>
        <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.85rem;color:var(--muted)">
          <input type="checkbox" id="filter-missing" ${U.filter.missing?`checked`:``} />
          Missing only
        </label>
      </div>

      <div class="checklist-body">${i.join(``)||`<p class="muted">No cards match.</p>`}</div>
    </section>
  `;let a=()=>{U.filter.q=document.querySelector(`#filter-q`)?.value||``,U.filter.type=document.querySelector(`#filter-type`)?.value||`all`,U.filter.set=document.querySelector(`#filter-set`)?.value||`MS01`,U.filter.missing=!!document.querySelector(`#filter-missing`)?.checked,Q(e)};document.querySelector(`#filter-q`)?.addEventListener(`input`,()=>{U.filter.q=document.querySelector(`#filter-q`).value,Q(e);let t=document.querySelector(`#filter-q`);t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))}),document.querySelector(`#filter-type`)?.addEventListener(`change`,a),document.querySelector(`#filter-set`)?.addEventListener(`change`,a),document.querySelector(`#filter-missing`)?.addEventListener(`change`,a),document.querySelector(`#print-btn`)?.addEventListener(`click`,()=>window.print()),e.querySelectorAll(`.card-row`).forEach(e=>{let t=e.dataset.id;e.querySelectorAll(`[data-copy]`).forEach(e=>{e.addEventListener(`click`,()=>{let n=Number(e.dataset.copy),r=R(U.ownership,t).copies===n?n-1:n;X(t,r)})}),e.querySelector(`[data-iconic]`)?.addEventListener(`click`,()=>Z(t)),e.querySelector(`.card-main`)?.addEventListener(`click`,()=>{U.modalCardId=t,$()})})}function Ne(e){Oe(e,U,{setSheet:e=>{U.binderSheet=e,Y()},setFace:e=>{U.binderFace=e,Y()},openCard:e=>{U.modalCardId=e,$()}})}function Pe(e){let t=z(U.cards,U.ownership,U.prices,U.settings),n=U.pricesUpdatedAt?typeof U.pricesUpdatedAt==`string`&&U.pricesUpdatedAt.includes(`estimate`)?U.pricesUpdatedAt:new Date(U.pricesUpdatedAt).toLocaleString():`unknown`;e.innerHTML=`
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Street value · USD</p>
          <h2>${B(t.total)}</h2>
          <p class="muted">Prices as of ${G(String(n))} · ${t.priced} owned lines</p>
        </div>
      </header>
      <p class="hint no-print">Default: one market price per owned base + Iconic if A is checked. Toggle “Value counts all copies” on Ops to multiply by 1–3. Per-card overrides in card detail. Refresh shared prices with <code>npm run prices</code>.</p>
      <table class="value-table">
        <thead>
          <tr><th>Card</th><th>Owned</th><th>Value</th></tr>
        </thead>
        <tbody>
          ${t.lines.slice(0,80).map(({card:e,value:t,own:n})=>`
            <tr>
              <td>
                <strong>${G(e.name)}</strong><br/>
                <span class="muted" style="font-family:var(--font-mono);font-size:0.75rem">${G(e.number)}</span>
              </td>
              <td class="muted">${n.copies}/3${n.iconic?` +A`:``}</td>
              <td class="num">${B(t)}</td>
            </tr>`).join(``)||`<tr><td colspan="3" class="muted">Own some cards to see value.</td></tr>`}
        </tbody>
      </table>
    </section>
  `}function $(){let e=document.querySelector(`#modal-root`);if(!e)return;if(!U.modalCardId){e.innerHTML=``;return}let t=U.cards.find(e=>e.id===U.modalCardId);if(!t){e.innerHTML=``;return}let n=R(U.ownership,t.id),r=U.prices[t.id]||{},i=`https://www.tcgplayer.com/search/cyberpunk-tcg/product?productLineName=cyberpunk-tcg&q=${encodeURIComponent(t.name.split(`:`)[0])}`;e.innerHTML=`
    <div class="modal-backdrop" id="modal-bg">
      <div class="modal" role="dialog" aria-modal="true">
        <p class="eyebrow">${G(t.id)}</p>
        <h3>${G(t.name)}</h3>
        <p class="muted">${t.type} · ${t.rarity}${t.eurodollars==null?``:` · E$${t.eurodollars}`} · ${V(t)}</p>
        ${t.notes?`<p class="hint">${G(t.notes)}</p>`:``}
        <div class="settings-row">
          <div class="copy-toggles">
            ${[1,2,3].map(e=>`<button type="button" class="copy-btn ${n.copies>=e?`on`:``}" data-mcopy="${e}">${e}</button>`).join(``)}
            <button type="button" class="iconic-btn ${n.iconic?`on`:``}" data-miconic="1" ${t.has_iconic?``:`disabled`}>A</button>
          </div>
        </div>
        <label style="display:grid;gap:0.35rem;margin-top:1rem;font-size:0.8rem;color:var(--muted)">
          Price override (USD)
          <input type="number" step="0.01" min="0" id="override-input"
            placeholder="${r.base==null?`market`:r.base}"
            value="${n.price_override_usd==null?``:n.price_override_usd}" />
        </label>
        <p class="hint">Market base ${B(r.base||0)}${t.has_iconic?` · Iconic ${B(r.iconic||0)}`:``}</p>
        <div class="actions">
          <button type="button" class="btn primary" id="save-override">Save override</button>
          <a class="btn" href="${i}" target="_blank" rel="noopener">TCGPlayer</a>
          <button type="button" class="btn ghost" id="close-modal">Close</button>
        </div>
      </div>
    </div>
  `;let a=()=>{U.modalCardId=null,$()};document.querySelector(`#modal-bg`)?.addEventListener(`click`,e=>{e.target.id===`modal-bg`&&a()}),document.querySelector(`#close-modal`)?.addEventListener(`click`,a),document.querySelectorAll(`[data-mcopy]`).forEach(e=>{e.addEventListener(`click`,()=>{let n=Number(e.dataset.mcopy),r=R(U.ownership,t.id).copies;X(t.id,r===n?n-1:n)})}),document.querySelector(`[data-miconic]`)?.addEventListener(`click`,()=>Z(t.id)),document.querySelector(`#save-override`)?.addEventListener(`click`,()=>{let e=document.querySelector(`#override-input`)?.value;Ae(t.id,e)})}async function Fe(){localStorage.getItem(`ncb-demo`)===`1`?(U.user={id:`demo-local`,email:`demo@local`},await q()):K()}Fe();