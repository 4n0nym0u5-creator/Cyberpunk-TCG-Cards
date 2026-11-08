(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e;(function(e){e.Any=`any`,e.ApNortheast1=`ap-northeast-1`,e.ApNortheast2=`ap-northeast-2`,e.ApSouth1=`ap-south-1`,e.ApSoutheast1=`ap-southeast-1`,e.ApSoutheast2=`ap-southeast-2`,e.CaCentral1=`ca-central-1`,e.EuCentral1=`eu-central-1`,e.EuWest1=`eu-west-1`,e.EuWest2=`eu-west-2`,e.EuWest3=`eu-west-3`,e.SaEast1=`sa-east-1`,e.UsEast1=`us-east-1`,e.UsWest1=`us-west-1`,e.UsWest2=`us-west-2`})(e||={});var t;(function(e){e.abstime=`abstime`,e.bool=`bool`,e.date=`date`,e.daterange=`daterange`,e.float4=`float4`,e.float8=`float8`,e.int2=`int2`,e.int4=`int4`,e.int4range=`int4range`,e.int8=`int8`,e.int8range=`int8range`,e.json=`json`,e.jsonb=`jsonb`,e.money=`money`,e.numeric=`numeric`,e.oid=`oid`,e.reltime=`reltime`,e.text=`text`,e.time=`time`,e.timestamp=`timestamp`,e.timestamptz=`timestamptz`,e.timetz=`timetz`,e.tsrange=`tsrange`,e.tstzrange=`tstzrange`})(t||={});var n=(e,n)=>{if(e.charAt(0)===`_`)return s(n,e.slice(1,e.length));switch(e){case t.bool:return i(n);case t.float4:case t.float8:case t.int2:case t.int4:case t.int8:case t.numeric:case t.oid:return a(n);case t.json:case t.jsonb:return o(n);case t.timestamp:return c(n);case t.abstime:case t.date:case t.daterange:case t.int4range:case t.int8range:case t.money:case t.reltime:case t.text:case t.time:case t.timestamptz:case t.timetz:case t.tsrange:case t.tstzrange:return r(n);default:return r(n)}},r=e=>e,i=e=>{switch(e){case`t`:return!0;case`f`:return!1;default:return e}},a=e=>{if(typeof e==`string`){let t=parseFloat(e);if(!Number.isNaN(t))return t}return e},o=e=>{if(typeof e==`string`)try{return JSON.parse(e)}catch{return e}return e},s=(e,t)=>{if(typeof e!=`string`)return e;let r=e.length-1,i=e[r];if(e[0]===`{`&&i===`}`){let i,a=e.slice(1,r);try{i=JSON.parse(`[`+a+`]`)}catch{i=a?a.split(`,`):[]}return i.map(e=>n(t,e))}return e},c=e=>typeof e==`string`?e.replace(` `,`T`):e,l;(function(e){e.SYNC=`sync`,e.JOIN=`join`,e.LEAVE=`leave`})(l||={});var u;(function(e){e.ALL=`*`,e.INSERT=`INSERT`,e.UPDATE=`UPDATE`,e.DELETE=`DELETE`})(u||={});var d;(function(e){e.BROADCAST=`broadcast`,e.PRESENCE=`presence`,e.POSTGRES_CHANGES=`postgres_changes`,e.SYSTEM=`system`})(d||={});var f;(function(e){e.SUBSCRIBED=`SUBSCRIBED`,e.TIMED_OUT=`TIMED_OUT`,e.CLOSED=`CLOSED`,e.CHANNEL_ERROR=`CHANNEL_ERROR`})(f||={});function p(e){"@babel/helpers - typeof";return p=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},p(e)}function m(e,t){if(p(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(p(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function h(e){var t=m(e,`string`);return p(t)==`symbol`?t:t+``}function g(e,t,n){return(t=h(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?_(Object(n),!0).forEach(function(t){g(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var y=class extends Error{constructor(e,t=`storage`,n,r){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t===`vectors`?`StorageVectorsError`:`StorageError`,this.status=n,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}},b=class extends y{constructor(e,t,n,r=`storage`,i){super(e,r,t,n),this.name=r===`vectors`?`StorageVectorsApiError`:`StorageApiError`,this.status=t,this.statusCode=n,this.code=i}toJSON(){return v(v({},super.toJSON()),{},{code:this.code})}},x=class extends y{constructor(e,t,n=`storage`){super(e,n),this.name=n===`vectors`?`StorageVectorsUnknownError`:`StorageUnknownError`,this.originalError=t}};function ee(e,t,n){let r=v({},e),i=t.toLowerCase();for(let e of Object.keys(r))e.toLowerCase()===i&&delete r[e];return r[i]=n,r}var te=e=>{if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},ne=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error;if(typeof t.error==`object`&&t.error!==null){let e=t.error;if(typeof e.message==`string`)return e.message}}return JSON.stringify(e)},re=async(e,t,n,r)=>{if(typeof e==`object`&&e&&`json`in e&&typeof e.json==`function`){let n=e,i=parseInt(String(n.status),10);Number.isFinite(i)||(i=500),n.json().then(e=>{let n=e?.statusCode||e?.code||i+``;t(new b(ne(e),i,n,r,e?.code))}).catch(()=>{let e=i+``;t(new b(n.statusText||`HTTP ${i} error`,i,e,r))})}else t(new x(ne(e),e,r))},ie=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};if(e===`GET`||e===`HEAD`||!r)return v(v({},i),n);if(te(r)){let e=t?.headers||{},n;for(let[t,r]of Object.entries(e))t.toLowerCase()===`content-type`&&(n=r);i.headers=ee(e,`Content-Type`,n??`application/json`),i.body=JSON.stringify(r)}else i.body=r;return t?.duplex&&(i.duplex=t.duplex),v(v({},i),n)};async function ae(e,t,n,r,i,a,o){return new Promise((s,c)=>{e(n,ie(t,r,i,a)).then(e=>{if(!e.ok)throw e;if(r?.noResolveJson)return e;if(o===`vectors`){let t=e.headers.get(`content-type`);if(e.headers.get(`content-length`)===`0`||e.status===204||!t||!t.includes(`application/json`))return{}}return e.json()}).then(e=>s(e)).catch(e=>re(e,c,r,o))})}function oe(e=`storage`){return{get:async(t,n,r,i)=>ae(t,`GET`,n,r,i,void 0,e),post:async(t,n,r,i,a)=>ae(t,`POST`,n,i,a,r,e),put:async(t,n,r,i,a)=>ae(t,`PUT`,n,i,a,r,e),head:async(t,n,r,i)=>ae(t,`HEAD`,n,v(v({},r),{},{noResolveJson:!0}),i,void 0,e),remove:async(t,n,r,i,a)=>ae(t,`DELETE`,n,i,a,r,e)}}var{get:se,post:ce,put:le,head:ue,remove:de}=oe(`storage`),fe=`2.118.0`,pe=3e4;3*pe,2*pe,`${fe}`;var me=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(``),he=` 	
\r=`.split(``);(()=>{let e=Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<he.length;t+=1)e[he[t].charCodeAt(0)]=-2;for(let t=0;t<me.length;t+=1)e[me[t].charCodeAt(0)]=t;return e})();var ge=()=>typeof window<`u`&&typeof document<`u`,S={tested:!1,writable:!1};globalThis&&(()=>{if(!ge())return!1;try{if(typeof globalThis.localStorage!=`object`)return!1}catch{return!1}if(S.tested)return S.writable;let e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),S.tested=!0,S.writable=!0}catch{S.tested=!0,S.writable=!1}return S.writable})()&&globalThis.localStorage&&globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`);function _e(){if(typeof globalThis!=`object`)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<`u`&&(self.globalThis=self)}}new class{createNewAbortSignal(){if(this.controller){let e=Error(`Cancelling existing WebAuthn API call for new one`);e.name=`AbortError`,this.controller.abort(e)}let e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){let e=Error(`Manually cancelling existing WebAuthn API call`);e.name=`AbortError`,this.controller.abort(e),this.controller=void 0}}},_e();var ve=`2.118.0`,ye=``,be;if(typeof Deno<`u`)ye=`deno`,be=Deno.version?.deno;else if(typeof document<`u`)ye=`web`;else if(typeof navigator<`u`&&navigator.product===`ReactNative`)ye=`react-native`;else{var xe;ye=`node`;let e=globalThis.process;be=e==null||(xe=e.version)==null?void 0:xe.replace(/^v/,``)}var Se=[`runtime=${ye}`];be&&Se.push(`runtime-version=${be}`),`${ve}${Se.join(`; `)}`;function Ce(){if(typeof window<`u`||globalThis.Deno!==void 0)return!1;let e=globalThis.process;if(!e)return!1;let t=e.version;if(t==null)return!1;let n=t.match(/^v(\d+)\./);return n?parseInt(n[1],10)<=20:!1}Ce()&&console.warn(`⚠️  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715`);var we=!1,Te=`https://4n0nym0u5-creator.github.io/Cyberpunk-TCG-Cards/`;function Ee(){return typeof window>`u`?Te:new URL(`/Cyberpunk-TCG-Cards/`,window.location.origin).href}var C=null;function w(e){return`/Cyberpunk-TCG-Cards/${String(e).replace(/^\//,``)}`}var De=`ncb-ownership`,Oe=`ncb-settings`,ke=25,Ae=[`beta`,`retail`],je=!0;function T(e){let t=Number(e);return Number.isFinite(t)?Math.max(0,Math.min(ke,Math.trunc(t))):0}function Me(e){return e===`prerelease`?`retail`:Ae.includes(e)?e:`beta`}function Ne(e,t,n=0){let r=T(e),i=T(T(t)+T(n)),a=r+i-ke;if(a>0){let e=Math.min(i,a);i-=e,a-=e}return a>0&&(r=Math.max(0,r-a)),{beta_copies:r,prerelease_copies:0,retail_copies:i}}function Pe(e={}){let t=e.beta_copies!=null||e.prerelease_copies!=null||e.retail_copies!=null,n;n=t?Ne(e.beta_copies??0,e.retail_copies??0,e.prerelease_copies??0):Ne(e.copies??0,0,0);let r=e.bstamp_copies;r==null&&e.bstamp!=null&&(r=+!!e.bstamp);let i=e.iconic_copies;i==null&&e.iconic!=null&&(i=+!!e.iconic);let a=e.beta_iconic_copies!=null||e.retail_iconic_copies!=null,o=e.beta_iconic_copies,s=e.retail_iconic_copies;a||(o=i??0,s=0),o=T(o??0),s=T(s??0);let c=o+s-ke;if(c>0){let e=Math.min(s,c);s-=e,c-=e}return c>0&&(o=Math.max(0,o-c)),{copies:n.beta_copies+n.retail_copies,...n,beta_iconic_copies:o,retail_iconic_copies:s,iconic_copies:o+s,bstamp_copies:T(r??0),prstamp_copies:T(e.prstamp_copies??0),price_override_usd:e.price_override_usd===null||e.price_override_usd===void 0?null:Number(e.price_override_usd)}}function Fe(){try{let e=JSON.parse(localStorage.getItem(De)||`{}`),t={};for(let[n,r]of Object.entries(e))t[n]=Pe(r);return t}catch{return{}}}function Ie(e){localStorage.setItem(De,JSON.stringify(e))}function Le(e){return e===`AUD`?`AUD`:`USD`}function Re(){return{completion_mode:`ms01`,value_count_copies:!0,default_copy_source:`beta`,display_currency:`USD`}}function ze(e={}){return{completion_mode:e.completion_mode===`everything_beta`?`everything_beta`:`ms01`,value_count_copies:!!(e.value_count_copies===void 0||e.value_count_copies),default_copy_source:Me(e.default_copy_source),display_currency:Le(e.display_currency)}}async function Be(e){return Fe()}async function Ve(e,t,n){let r=Pe(n),i=Fe();return i[t]=r,Ie(i),r}async function He(e){return(()=>{try{return ze({...Re(),...JSON.parse(localStorage.getItem(Oe)||`{}`)})}catch{return Re()}})()}async function Ue(e,t){let n=ze({...Re(),...t});return localStorage.setItem(Oe,JSON.stringify(n)),n}var We=`2026-10-31-nova-stamps`;async function Ge(){let e=await fetch(`${w(`data/cards.json`)}?v=${encodeURIComponent(We)}`,{cache:`no-store`});if(!e.ok)throw Error(`Failed to load card catalog`);return await e.json()}async function Ke(){try{let e=await fetch(w(`data/card-prices.json`));if(!e.ok)return{map:{},updatedAt:null};let t=await e.json();return{map:t.prices||{},updatedAt:t.updatedAt||null}}catch{return{map:{},updatedAt:null}}}async function qe(){return Ke()}var Je=[`MS01-001`,`MS01-002`,`MS01-003`,`MS01-004`,`MS01-005a`,`MS01-005b`,`MS01-036`,`MS01-037`,`MS01-038`,`MS01-039`,`MS01-040`,`MS01-071`,`MS01-072`,`MS01-073`,`MS01-074`,`MS01-075`,`MS01-106`,`MS01-107`,`MS01-108`,`MS01-109`,`MS01-110`],Ye=[`N001`,`PRM01-005`,`NIGHTCITYBRAWL-S1-00`],Xe=[`SD02-001`,`SD01-001`,`SD02-012`,`SD02-013`,`SD01-011`,`SD01-012`];function Ze(e,t){let n=new Map(e.map(e=>[e.id,e]));return t.map(e=>n.get(e)).filter(Boolean)}var Qe=[`beta`,`retail`],$e={beta:`β`,retail:`R`},et={beta:`Beta collection`,retail:`Retail / kit`},tt={beta:`Beta collection — Welcome to Night City Beta printings. Counts toward binder playset.`,retail:`Retail / kit — normal MS01 printings from retail packs or Pre-release kit boosters (not the WTNC Nova Rare W stamp). Counts toward Street/Legend regular playset.`},nt=[`beta`,`retail`],E={beta:`Aβ`,retail:`AR`},rt={beta:`Beta Iconic A`,retail:`Retail Iconic A`},it={beta:`Beta Iconic A — alternate art from Welcome to Night City Beta. Separate from regular β copies; has its own binder pocket.`,retail:`Retail Iconic A — alternate art from retail / kit printings. Separate from regular R copies; shares the Iconic binder pocket with Aβ.`};function D(e){return e===`prerelease`?`retail`:Qe.includes(e)?e:`beta`}function at(e){return nt.includes(e)?e:`beta`}function ot(e){return`${D(e)}_copies`}function st(e){return`${at(e)}_iconic_copies`}function O(){return{copies:0,beta_copies:0,prerelease_copies:0,retail_copies:0,iconic_copies:0,beta_iconic_copies:0,retail_iconic_copies:0,bstamp_copies:0,prstamp_copies:0,price_override_usd:null}}function ct(e,t){let n=A(e),r=A(t),i=n+r-25;if(i>0){let e=Math.min(r,i);r-=e,i-=e}return i>0&&(n=Math.max(0,n-i)),{beta_iconic_copies:n,retail_iconic_copies:r,iconic_copies:n+r}}function lt(e,t,n=0){let r=A(e),i=A(A(t)+A(n)),a=r+i-25;if(a>0){let e=Math.min(i,a);i-=e,a-=e}return a>0&&(r=Math.max(0,r-a)),{beta_copies:r,prerelease_copies:0,retail_copies:i}}function ut(e,t){let n=lt(t.beta_copies,t.retail_copies,t.prerelease_copies);return{...e,...n,copies:n.beta_copies+n.retail_copies}}function k(e,t){let n=e[t];if(!n)return O();let r=n.beta_copies!=null||n.prerelease_copies!=null||n.retail_copies!=null?lt(n.beta_copies??0,n.retail_copies??0,n.prerelease_copies??0):lt(n.copies??0,0,0),i=n.bstamp_copies==null?+!!n.bstamp:n.bstamp_copies,a=n.prstamp_copies==null?0:n.prstamp_copies,o=n.iconic_copies==null?+!!n.iconic:n.iconic_copies,s=n.beta_iconic_copies!=null||n.retail_iconic_copies!=null?ct(n.beta_iconic_copies??0,n.retail_iconic_copies??0):ct(o??0,0);return{copies:r.beta_copies+r.retail_copies,...r,...s,bstamp_copies:i??0,prstamp_copies:a??0,price_override_usd:n.price_override_usd===void 0?null:n.price_override_usd}}function A(e){let t=Number(e);return Number.isFinite(t)?Math.max(0,Math.min(25,Math.trunc(t))):0}function dt(e){let t=D(e);return[t,...Qe.filter(e=>e!==t)]}function ft(e,t,n){let r=ot(t),i={beta_copies:e?.beta_copies||0,prerelease_copies:0,retail_copies:e?.retail_copies||0,[r]:A(n)};return ut(e||O(),i)}function pt(e,t,n){let r=ot(t),i=e?.[r]||0,a=(e?.copies||0)-i,o=Math.max(0,25-a);return ft(e,t,Math.max(0,Math.min(o,i+Number(n||0))))}function mt(e,t,n){let r=st(t),i=e||O(),a=ct(r===`beta_iconic_copies`?n:i.beta_iconic_copies||0,r===`retail_iconic_copies`?n:i.retail_iconic_copies||0);return{...i,...a}}function ht(e,t,n){let r=st(t),i=e||O(),a=i[r]||0,o=(i.iconic_copies||0)-a,s=Math.max(0,25-o);return mt(i,t,Math.max(0,Math.min(s,a+Number(n||0))))}function gt(e,t,n=`beta`){let r=e||O(),i=A(t),a=r.beta_copies||0,o=r.retail_copies||0,s=a+o,c=D(n);if(i>s){let e={beta:a,retail:o},t=25-s,n=Math.min(i-s,t);return e[c]+=n,ut(r,{beta_copies:e.beta,prerelease_copies:0,retail_copies:e.retail})}if(i<s){let e=s-i,t={beta:a,retail:o};for(let n of dt(c)){if(e<=0)break;let r=Math.min(t[n],e);t[n]-=r,e-=r}return ut(r,{beta_copies:t.beta,prerelease_copies:0,retail_copies:t.retail})}return ut(r,{beta_copies:a,prerelease_copies:0,retail_copies:o})}function j(e){return Math.max(0,(e?.copies||0)+(e?.bstamp_copies||0)+(e?.prstamp_copies||0))}function _t(e,t){let n=0,r=0,i=[];for(let a of t||[]){let t=Math.max(0,Number(a.qty)||0);if(!a.id||t<=0)continue;let o=Math.max(0,j(k(e,a.id))),s=Math.min(o,t);n+=t,r+=s,i.push({id:a.id,qty:t,owned:o,applied:s,short:Math.max(0,t-o),role:a.role||`main`,card:a.card||null})}let a=i.filter(e=>e.short>0);return{required:n,owned:r,pct:n?Math.round(r/n*100):0,unique:i.length,uniqueComplete:i.filter(e=>e.short===0).length,missing:a,lines:i}}function M(e){let t=e||O();return t.beta_iconic_copies!=null||t.retail_iconic_copies!=null?Math.max(0,(t.beta_iconic_copies||0)+(t.retail_iconic_copies||0)):Math.max(0,t.iconic_copies||0)}var vt=[`beta`,`retail`,`beta_iconic`,`retail_iconic`,`bstamp`,`prstamp`,`ks_promo`],yt={beta:`β`,retail:`R`,beta_iconic:`Aβ`,retail_iconic:`AR`,bstamp:`B`,prstamp:`W`,ks_promo:`KS`},bt={beta:`Beta collection`,retail:`Retail / kit`,beta_iconic:`Beta Iconic A`,retail_iconic:`Retail Iconic A`,bstamp:`Beta Event Nova Rare B-stamp`,prstamp:`Pre-release WTNC 2026 W-stamp`,ks_promo:`Kickstarter promo`},xt={beta:0,retail:1,beta_iconic:2,retail_iconic:3,bstamp:4,prstamp:5,ks_promo:6},St=new Set(Ye);function Ct(e){return!!(e?.id&&St.has(e.id))}function wt(e,t=null,{threshold:n=1}={}){let r=e||O(),i=Math.max(1,Number(n)||1),a=!!t?.has_iconic,o=Ct(t);return{beta:!o&&(r.beta_copies||0)<i,retail:!o&&(r.retail_copies||0)<i,beta_iconic:a&&(r.beta_iconic_copies||0)<i,retail_iconic:a&&(r.retail_iconic_copies||0)<i,bstamp:!!t?.has_bstamp&&(r.bstamp_copies||0)<i,prstamp:!!t?.has_prstamp&&(r.prstamp_copies||0)<i,ks_promo:o&&(r.beta_copies||0)+(r.retail_copies||0)<i}}function Tt(e,t,n,{threshold:r=1}={}){let i=(n?.completion_mode||`ms01`)===`everything_beta`?e:e.filter(e=>e.set_code===`MS01`),a=new Map(i.map(e=>[e.id,e]));for(let t of e)Ct(t)&&a.set(t.id,t);let o=[...a.values()],s=[];for(let e of o){let n=k(t,e.id),i=wt(n,e,{threshold:r});for(let t of vt)i[t]&&s.push({card:e,edition:t,own:n})}return s.sort((e,t)=>{let n=(e.card.sort_order??0)-(t.card.sort_order??0);return n===0?(xt[e.edition]??9)-(xt[t.edition]??9):n}),s}function Et(e){return(e.retail_copies||0)>0}function Dt(e){let t=[];return(e.beta_copies||0)>0&&t.push(`×${e.beta_copies}${$e.beta}`),(e.retail_copies||0)>0&&t.push(`×${e.retail_copies}${$e.retail}`),t}function Ot(e){let t=e||{},n=[];return Et(t)?n.push(...Dt(t)):t.copies>0&&n.push(`×${t.copies}`),t.bstamp_copies>0&&n.push(`×${t.bstamp_copies}B`),t.prstamp_copies>0&&n.push(`×${t.prstamp_copies}W`),(t.beta_iconic_copies||0)>0||(t.retail_iconic_copies||0)>0?((t.beta_iconic_copies||0)>0&&n.push(`×${t.beta_iconic_copies}${E.beta}`),(t.retail_iconic_copies||0)>0&&n.push(`×${t.retail_iconic_copies}${E.retail}`)):t.iconic_copies>0&&n.push(`×${t.iconic_copies}A`),n.join(` · `)||`—`}function kt(e){let t=e||{},n=`${t.copies||0}/25`;if(Et(t)){let e=Dt(t).map(e=>e.replace(/^×/,``)).join(`·`);e&&(n+=` (${e})`)}return t.bstamp_copies>0&&(n+=` +${t.bstamp_copies}B`),t.prstamp_copies>0&&(n+=` +${t.prstamp_copies}W`),(t.beta_iconic_copies||0)>0&&(n+=` +${t.beta_iconic_copies}${E.beta}`),(t.retail_iconic_copies||0)>0?n+=` +${t.retail_iconic_copies}${E.retail}`:!t.beta_iconic_copies&&(t.iconic_copies||0)>0&&(n+=` +${t.iconic_copies}A`),n}function At(e){let t=new Map;for(let n of e){let e=n.artist&&String(n.artist).trim()||`Unknown`;t.has(e)||t.set(e,[]),t.get(e).push(n)}return[...t.entries()].map(([e,t])=>({name:e,cards:t.slice().sort((e,t)=>e.sort_order-t.sort_order),count:t.length})).sort((e,t)=>t.count-e.count||e.name.localeCompare(t.name))}function jt(e,t){let n=t&&String(t).trim()||`Unknown`;return e.filter(e=>(e.artist&&String(e.artist).trim()||`Unknown`)===n).sort((e,t)=>e.sort_order-t.sort_order)}function Mt(e,t,n){let r=(n?.completion_mode||`ms01`)===`everything_beta`?e:e.filter(e=>e.set_code===`MS01`),i=e.filter(e=>e.set_code===`MS01`),a=i.filter(e=>e.has_iconic),o=0,s=0,c=0;for(let e of i){let n=k(t,e.id);j(n)>0&&(o+=1),e.has_iconic&&M(n)>0&&(s+=1)}for(let e of r)j(k(t,e.id))>0&&(c+=1);let l=i.filter(e=>j(k(t,e.id))===0);return{ms01Total:i.length,ms01Owned:o,iconicTotal:a.length,iconicOwned:s,everythingTotal:r.length,everythingOwned:c,missing:l,setTotal:i.length+a.length,setOwned:o+s}}function Nt(e,t){let n=0,r=0;for(let i of e){let e=k(t,i.id),a=j(e),o=i.has_iconic?M(e):0;n+=a+o,(a>0||o>0)&&(r+=1)}return{copies:n,uniqueOwned:r,uniqueTotal:e.length}}function Pt(e,t,n,r){let i=k(t,e.id),a=j(i),o=e.has_iconic?M(i):0;if(a<=0&&o<=0)return 0;let s=n[e.id]||{},c=i.price_override_usd==null?Number(s.base||0):Number(i.price_override_usd),l=Number(s.iconic||0),u=r?.value_count_copies?Math.max(a,0):+(a>0),d=r?.value_count_copies?Math.max(o,0):+(o>0),f=0;return a>0&&(f+=c*u),o>0&&(f+=l*d),f}function Ft(e,t,n,r){let i=0,a=0,o=[];for(let s of e){let e=Pt(s,t,n,r);e>0&&(i+=e,a+=1,o.push({card:s,value:e,own:k(t,s.id)}))}return o.sort((e,t)=>t.value-e.value),{total:i,priced:a,lines:o}}function It(e,t){return e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.sheet!=null).sort((e,t)=>e.sort_order-t.sort_order).find(e=>j(k(t,e.id))===0)||e.filter(e=>e.set_code===`MS01`&&e.type===`Legend`).sort((e,t)=>e.sort_order-t.sort_order).find(e=>j(k(t,e.id))===0)||null}var Lt=[{id:`red`,label:`Red`,range:`001–035`},{id:`yellow`,label:`Yellow`,range:`036–070`},{id:`green`,label:`Green`,range:`071–105`},{id:`blue`,label:`Blue`,range:`106–140`}];function Rt(e,t){return Lt.map(n=>{let r=e.filter(e=>e.set_code===`MS01`&&e.band===n.id),i=r.filter(e=>e.has_iconic),a=0,o=0;for(let e of r){let n=k(t,e.id);j(n)>0&&(a+=1),e.has_iconic&&M(n)>0&&(o+=1)}return{...n,total:r.length,owned:a,pct:r.length?Math.round(a/r.length*100):0,iconicTotal:i.length,iconicOwned:o,iconicPct:i.length?Math.round(o/i.length*100):0}})}function zt(e){return e.filter(e=>e.set_code===`MS01`&&e.has_iconic).sort((e,t)=>e.sort_order-t.sort_order)}function Bt(e,t){let n=e.filter(e=>e.set_code===`MS01`&&e.type===`Legend`).sort((e,t)=>e.sort_order-t.sort_order),r=0,i=0,a=0;for(let e of n){let n=k(t,e.id);r+=3,i+=Math.min(3,Math.max(0,j(n))),e.has_iconic&&M(n)>0&&(a+=1)}let o=e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.has_iconic),s=0;for(let e of o)M(k(t,e.id))>0&&(s+=1);let c=e.filter(e=>e.set_code===`showcase`),l=0,u=0,d=0;for(let e of c){let n=k(t,e.id);j(n)>0&&(l+=1),e.has_iconic&&(u+=1,M(n)>0&&(d+=1))}let f=e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.has_bstamp),p=0,m=0;for(let e of f){let n=k(t,e.id);p+=3,m+=Math.min(3,Math.max(0,n.bstamp_copies||0))}let h=e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.has_prstamp),g=0,_=0;for(let e of h){let n=k(t,e.id);g+=3,_+=Math.min(3,Math.max(0,n.prstamp_copies||0))}let v=r+n.length,y=i+a,b=c.length+u,x=v+o.length+b+p+g,ee=y+s+l+d+m+_;return{legendTotal:n.length,baseSlots:r,baseOwned:i,iconicTotal:n.length,iconicOwned:a,legendPockets:v,legendFilled:y,legendPct:v?Math.round(y/v*100):0,streetIconicTotal:o.length,streetIconicOwned:s,vaultPockets:x,vaultFilled:ee,vaultPct:x?Math.round(ee/x*100):0,extrasTotal:c.length,extrasOwned:l,extrasIconicTotal:u,extrasIconicOwned:d,extrasPockets:b,mantisBSlots:p,mantisBOwned:m,gorillaWSlots:g,gorillaWOwned:_,vaultCapacity:144}}function Vt(e){return e?.type===`Legend`||e?.set_code===`showcase`?`vault`:`street`}var Ht=[`USD`,`AUD`];function N(e){return e===`AUD`?`AUD`:`USD`}function Ut(e,t=`USD`,n=1){let r=Number(e)||0;if(N(t)===`AUD`){let e=Number(n);return r*(Number.isFinite(e)&&e>0?e:1)}return r}function Wt(e,t=`USD`,n=1){let r=N(t),i=Ut(e,r,n);return r===`AUD`?`A$${new Intl.NumberFormat(`en-AU`,{minimumFractionDigits:2,maximumFractionDigits:2}).format(i)}`:new Intl.NumberFormat(`en-US`,{style:`currency`,currency:`USD`,maximumFractionDigits:2}).format(i)}function P(e){if(!e.zone||e.sheet==null)return`—`;let t=`${e.zone}${String(e.zone_slot??``).padStart(2,`0`)}`;return!e.face||!e.row_pos?t:`${t} s${e.sheet}${e.face}${e.row_pos}`}var Gt=/\b(?:IO|ILegend|Iconic(?:\s+Other)?)\b|\(IO\)|\(Iconic\)|Iconic\s*A\b/i,Kt=/\b(?:booster\s*box|starter\s*deck|preorder|sealed|case\b|display)\b/i,qt=/\bretail\b/i,Jt=/\bbeta\b|\bwnc-beta\b|\bms01b\b|\bwelcome to night city\s*[-–—]?\s*beta\b/i,Yt=/\bprr\b|\bpre-?release\b|\bw[\s-]?stamp\b|\bwtnc\s*(2026)?\s*stamp\b|\bnova\s*rare\s*w\b/i,Xt=/\bb[\s-]?stamp\b|\bbeta\s*event\b|\bnova\s*rare\s*b\b|\(b\)\s*stamp/i,Zt=/\bkickstarter\b|\bks\s*promo\b|\blucyna\b|\blucy\b.*\bfresh beginnings\b|\brebecca\b.*\bhaving a moment\b|\bminotaur\b/i,Qt=/(?:^|[^A-Za-z0-9])(?:#|\[)?B0*(\d{1,3}[a-z]?)\b|\bNumber:\s*B0*(\d{1,3}[a-z]?)\b/i,$t=/\bPRR\s*[-–—]?\s*0*(\d{1,3})\b/i;function en(e){let t=new Map,n=new Map;for(let r of e){n.set(r.id,r);let e=tn(r.number);e&&(t.has(e)||t.set(e,[]),t.get(e).push(r));let i=r.id.includes(`-`)?r.id.split(`-`).pop():null;if(i){let n=tn(i);n&&n!==e&&(t.has(n)||t.set(n,[]),t.get(n).push(r))}}return{byNumber:t,byId:n}}function tn(e){if(e==null)return null;let t=String(e).trim();t=t.replace(/^B/i,``).replace(/^MS01-?/i,``),t=t.replace(/^0+(\d)/,`$1`);let n=t.match(/^0*(\d+)([a-z]?)$/i);if(!n)return t.toLowerCase()||null;let r=n[1],i=(n[2]||``).toLowerCase();return i?`${r}${i}`:r.padStart(3,`0`)}function nn(e,t=[]){let n=[e,...t||[]].filter(Boolean).join(` | `),r=n.match($t);if(r)return tn(r[1]);let i=n.match(Qt);return i?tn(i[1]||i[2]):null}function rn(e,t=[],n=``){let r=[e,n,...t||[]].filter(Boolean).join(` | `);if(Kt.test(r)&&!/\bsingles?\b/i.test(r))return null;let i=Gt.test(r),a=qt.test(r)&&!Jt.test(r)&&!Yt.test(r),o=Jt.test(r);return i?a?`retail_iconic`:`beta_iconic`:Xt.test(r)&&!Yt.test(r)?`bstamp`:Yt.test(r)?`prstamp`:Zt.test(r)?`ks_promo`:a?`retail`:o||/\bcyberpunk\b/i.test(r)||/\bwelcome to night city\b/i.test(r)?`beta`:null}function an(e){return String(e||``).toLowerCase().replace(/[^a-z0-9:]+/g,` `).split(/\s+/).filter(e=>e.length>2&&!/^(the|and|for|with|from|beta|foil|near|mint|epic|rare|common|secret|nova|unit|legend|gear|program|welcome|night|city|wnc|ilegend|iconic)$/.test(e))}function F(e,t){let n=an(e);if(!n.length)return 0;let r=an(t.name);if(!r.length)return 0;let i=0;for(let e of r)n.includes(e)&&(i+=1);return i/r.length}function on(e){return e===`beta_iconic`||e===`retail_iconic`}function sn(e,t){return t===`bstamp`?!!e.has_bstamp:t===`prstamp`?!!e.has_prstamp:t!==`ks_promo`||e.id===`N001`||e.id===`PRM01-005`||e.id===`NIGHTCITYBRAWL-S1-00`}function cn(e,{title:t,tags:n=[],vendor:r=``}){if(!t)return null;let i=rn(t,n,r);if(!i)return null;let a=[t,...n||[]].join(` `),o=/\bbox\s*toppers?\b/i.test(a),s=nn(t,n),c=on(i),l=e=>c&&!e.has_iconic?!1:sn(e,i),u=[];if(s&&(u=[...e.byNumber.get(s)||[]].filter(l)),o||u.length===0){let n=[...e.byId.values()].filter(l).map(e=>({c:e,s:F(t,e)})).filter(e=>e.s>=.5).sort((e,t)=>t.s-e.s||e.c.sort_order-t.c.sort_order);if(n.length)return{card_id:n[0].c.id,edition:i};if(o)return null}if(!u.length){let n=[...e.byId.values()].filter(e=>l(e)&&(i===`ks_promo`||e.set_code===`MS01`||e.set_code===`showcase`)).map(e=>({c:e,s:F(t,e)})).filter(e=>e.s>=.6).sort((e,t)=>t.s-e.s);return n.length?{card_id:n[0].c.id,edition:i}:null}if(u.length===1){let n=u[0];if(F(t,n)<.35&&an(t).length>=2){let n=[...e.byId.values()].filter(l).map(e=>({c:e,s:F(t,e)})).filter(e=>e.s>=.5).sort((e,t)=>t.s-e.s);return n.length?{card_id:n[0].c.id,edition:i}:null}return{card_id:n.id,edition:i}}u.sort((e,n)=>{let r=F(t,n)-F(t,e);return Math.abs(r)>.05?r:c&&e.has_iconic!==n.has_iconic?e.has_iconic?-1:1:e.set_code===`MS01`&&n.set_code!==`MS01`?-1:+(n.set_code===`MS01`&&e.set_code!==`MS01`)});let d=u[0];return!d||F(t,d)<.35?null:{card_id:d.id,edition:i}}var ln={punkouter:{id:`punkouter`,name:`PunkOuter`,shipsToAu:!0,currency:`USD`,collectionUrl:`https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock`,productsJsonBase:`https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock/products.json`,kind:`shopify`},obsession:{id:`obsession`,name:`Obsession Gaming`,shipsToAu:!0,currency:`AUD`,collectionUrl:`https://obsessiongaming.com.au/collections/cyberpunk-tcg-singles`,kind:`obsession_html`},mint:{id:`mint`,name:`Mint Collectables`,shipsToAu:!0,currency:`AUD`,collectionUrl:`https://mintcollectables.com.au/collections/cyberpunk-tcg`,productsJsonBase:`https://mintcollectables.com.au/collections/cyberpunk-tcg/products.json`,kind:`shopify`}},un=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;function dn(e){return String(e||``).replace(/\\"/g,`"`).replace(/\\\\/g,`\\`).replace(/\\n/g,`
`).replace(/&#x27;/g,`'`).replace(/&amp;/g,`&`).replace(/&quot;/g,`"`)}function fn(e){return[...String(e||``).matchAll(/\\"([^\\"]+)\\"/g)].map(e=>dn(e[1]))}function pn(e){let t=String(e.handle||``).trim();if(!un.test(t))return null;let n=Number(e.price);return{handle:t,title:e.title||t.replace(/-/g,` `),tags:Array.isArray(e.tags)?e.tags:[],vendor:e.vendor||`Obsession Gaming`,available:!!e.available,price:Number.isFinite(n)?n:null,productUrl:`https://obsessiongaming.com.au/products/${t}`}}function mn(e){let t=new Map,n=/\\"id\\":\\"gid:\/\/shopify\/Product\/\d+\\",\\"title\\":\\"((?:\\\\.|[^\\"])*)\\",\\"handle\\":\\"([a-z0-9-]+)\\",\\"vendor\\":\\"((?:\\\\.|[^\\"])*)\\",\\"description\\":\\"(?:\\\\.|[^\\"])*\\",\\"price\\":\\"([^\\"]*)\\",\\"compareAtPrice\\":\\"(?:\\\\.|[^\\"])*\\",\\"imageUrl\\":\\"(?:\\\\.|[^\\"])*\\",\\"images\\":\[[^\]]*\],\\"availableForSale\\":(true|false),\\"tags\\":\[([^\]]*)\]/g,r;for(;r=n.exec(e);){let e=pn({title:dn(r[1]),handle:r[2],vendor:dn(r[3])||`Obsession Gaming`,price:r[4],available:r[5]===`true`,tags:fn(r[6])});e&&t.set(e.handle,e)}if(!t.size){let n=/handle\\":\\"([a-z0-9-]+)\\"[^\\]*(?:\\.|[^\\])*?price\\":\\"([^\\]*)\\"[^\\]*(?:\\.|[^\\])*?availableForSale\\":(true|false)[^\\]*(?:\\.|[^\\])*?tags\\":\[([^\]]*)\]/g;for(;r=n.exec(e);){let e=pn({handle:r[1],price:r[2],available:r[3]===`true`,tags:fn(r[4])});e&&t.set(e.handle,e)}}let i=/href="\/products\/([a-z0-9-]+)"[^>]*>[\s\S]*?(?:alt|title)="([^"]+)"/gi,a;for(;a=i.exec(e);){let e=a[1];if(!un.test(e))continue;let n=dn(a[2]).trim();if(!/(WNC-BETA|Welcome to Night City|Cyberpunk)/i.test(n))continue;let r=t.get(e);r?r.title=n:t.set(e,pn({handle:e,title:n,tags:[`Cyberpunk TCG`,`Welcome to Night City - Beta`],available:!0,price:null}))}let o=e.match(/initialEndCursor\\":\\"(eyJ[A-Za-z0-9_=+-]+)\\"/),s=e.match(/initialHasNextPage\\":(true|false)/);return{products:[...t.values()].filter(Boolean),endCursor:o?.[1]||null,hasNextPage:s?s[1]===`true`:!!o}}var hn=`ncb-seller-stock-live`,gn=432e5;async function _n(e){let t=[e,`https://corsproxy.io/?url=${encodeURIComponent(e)}`,`https://corsproxy.io/?${encodeURIComponent(e)}`,`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,`https://api.allorigins.win/get?url=${encodeURIComponent(e)}`],n=null;for(let e of t)try{let t=await fetch(e,{headers:{Accept:`*/*`},cache:`no-store`});if(!t.ok){n=Error(`${e} → ${t.status}`);continue}let r=await t.text();if(e.includes(`allorigins.win/get?`))try{let e=JSON.parse(r);if(typeof e?.contents==`string`)return e.contents}catch{}if(/Just a moment\.\.\.|cf-challenge|keyless_legacy_url|Attention Required/i.test(r)){n=Error(`${e} → blocked interstitial`);continue}return r}catch(e){n=e}throw n||Error(`Failed to fetch ${e}`)}async function vn(e){let t=await _n(e);return JSON.parse(t)}async function yn(e){let t=[];for(let n=1;n<=20;n+=1){let r=(await vn(`${e}?limit=250&page=${n}`)).products||[];if(!r.length)break;for(let e of r){let n=(e.variants||[]).find(e=>e.available)||e.variants?.[0],r=n?.price==null?null:Number(n.price);t.push({title:e.title,handle:e.handle,tags:e.tags||[],vendor:e.vendor||``,available:!!n?.available,price:Number.isFinite(r)?r:null})}if(r.length<250)break}return t}async function bn(){let e=[],t=[],n=new Set;try{let r=ln.punkouter,i=await yn(r.productsJsonBase);for(let t of i)e.push({...t,seller_id:r.id,currency:r.currency,productUrl:`https://punkouter.com/products/${t.handle}`});i.length?n.add(r.id):t.push(`PunkOuter: no products returned`)}catch(e){t.push(`PunkOuter: ${e.message||e}`)}try{let r=ln.mint,i=await yn(r.productsJsonBase);for(let t of i)e.push({...t,seller_id:r.id,currency:r.currency,productUrl:`https://mintcollectables.com.au/products/${t.handle}`});i.length?n.add(r.id):t.push(`Mint: no products returned`)}catch(e){t.push(`Mint: ${e.message||e}`)}try{let r=ln.obsession,i=mn(await _n(r.collectionUrl));if(!i.products.length)throw Error(`HTML returned but no products parsed (CORS proxy/challenge or layout change)`);for(let t of i.products)e.push({...t,seller_id:r.id,currency:r.currency});n.add(r.id),i.hasNextPage&&t.push(`Obsession: first page only in browser (pagination needs server refresh)`)}catch(e){t.push(`Obsession: ${e.message||e}`)}return{results:e,errors:t,okSellers:n}}function xn(e,t,{source:n=`browser-live`}={}){let r=en(e),i=new Map;for(let e of t){let t=cn(r,{title:e.title,tags:e.tags,vendor:e.vendor});if(!t)continue;let n={card_id:t.card_id,edition:t.edition,seller_id:e.seller_id,title:e.title,url:e.productUrl,price:e.price,currency:e.currency,available:!!e.available},a=`${n.card_id}|${n.edition}|${n.seller_id}`,o=i.get(a);o?(n.available&&!o.available||n.available===o.available&&(n.price??1/0)<(o.price??1/0))&&i.set(a,n):i.set(a,n)}return{updatedAt:new Date().toISOString(),source:n,sellers:Object.fromEntries(Object.values(ln).map(e=>[e.id,{id:e.id,name:e.name,shipsToAu:e.shipsToAu,currency:e.currency,collectionUrl:e.collectionUrl}])),listings:[...i.values()],from:`live`}}function Sn(e,t,n){if(!e)return t;if(!t?.listings?.length||!n?.length)return e;let r=new Set(n),i=(e.listings||[]).filter(e=>!r.has(e.seller_id)),a=(t.listings||[]).filter(e=>r.has(e.seller_id));return a.length?{...e,listings:[...i,...a],source:`${e.source||`live`}+merged`}:e}function Cn(){try{let e=JSON.parse(localStorage.getItem(hn)||`null`);return!e?.payload?.listings||!e.at||Date.now()-e.at>gn?null:e.payload}catch{return null}}function wn(e){try{localStorage.setItem(hn,JSON.stringify({at:Date.now(),payload:e}))}catch{}}async function Tn(e){if(!e?.length)throw Error(`Catalog not loaded`);let{results:t,errors:n,okSellers:r}=await bn();if(!t.length)throw Error(n.length?`Could not reach sellers (${n.join(`; `)})`:`No seller products returned`);let i=xn(e,t);return wn(i),{stock:i,warnings:n.length?n:null,okSellers:[...r]}}var I={punkouter:{id:`punkouter`,name:`PunkOuter`,shipsToAu:!0,currency:`USD`,collectionUrl:`https://punkouter.com/collections/cyberpunk-tcg-singles-in-stock`},obsession:{id:`obsession`,name:`Obsession Gaming`,shipsToAu:!0,currency:`AUD`,collectionUrl:`https://obsessiongaming.com.au/collections/cyberpunk-tcg-singles`},mint:{id:`mint`,name:`Mint Collectables`,shipsToAu:!0,currency:`AUD`,collectionUrl:`https://mintcollectables.com.au/collections/cyberpunk-tcg`}},En=()=>({updatedAt:null,source:null,sellers:{...I},listings:[],from:`empty`});function Dn(e,t){let n={...I,...e.sellers||{}};return{updatedAt:e.updatedAt||e.fetched_at||null,source:e.source||t,sellers:n,listings:Array.isArray(e.listings)?e.listings:[],from:t}}async function On(){try{let e=await fetch(`${w(`data/seller-stock.json`)}?t=${Date.now()}`,{cache:`no-store`});return e.ok?Dn(await e.json(),`local`):En()}catch{return En()}}async function kn(){let e=Cn();return e?.listings?.length?e:On()}async function An(){return null}var jn=Object.keys(I);async function Mn(e=[]){let t=Cn()||await On().catch(()=>En()),n=await An();if(n?.stock?.listings?.length)return wn(n.stock),{stock:n.stock,warning:n.warning};try{let{stock:r,warnings:i,okSellers:a}=await Tn(e),o=jn.filter(e=>!(a||[]).includes(e)),s=r,c=[...i||[]];return n?.error&&c.push(`Edge: ${n.error}`),o.length&&(s=Sn(s,t,o),wn(s),c.push(`Kept prior ${o.join(`, `)} listings (browser blocked)`)),{stock:s,warning:c.length?`Partial: ${c.join(`; `)}`:void 0}}catch(e){let t=await kn(),r=n?.error||``;return{stock:t,error:`Stock refresh failed (${e.message||e})${r?` · Edge Function: ${r}`:``}. Showing cached/snapshot stock.`}}}function Nn(e){let t=new Map;for(let n of e||[]){let e=`${n.card_id}|${n.edition}`;t.has(e)||t.set(e,[]),t.get(e).push(n)}for(let e of t.values())e.sort((e,t)=>e.available===t.available?(e.price??1/0)-(t.price??1/0):e.available?-1:1);return t}function Pn(e,t,n){return e.get(`${t}|${n}`)||[]}function Fn(e,t=`USD`,n=1){if(e?.price==null||!Number.isFinite(Number(e.price)))return`—`;let r=Number(e.price),i=e.currency===`AUD`?`AUD`:`USD`,a=N(t),o=Number(n)>0?Number(n):1.55,s=r;if(i===`AUD`&&(s=r/o),a===`AUD`){let e=i===`AUD`?r:r*o;return`A$${new Intl.NumberFormat(`en-AU`,{minimumFractionDigits:2,maximumFractionDigits:2}).format(e)}`}return Wt(s,`USD`)}function In(e,t,{inStockOnly:n=!1,sellerId:r=`all`}={}){return e.map(e=>{let n=Pn(t,e.card.id,e.edition);r&&r!==`all`&&(n=n.filter(e=>e.seller_id===r));let i=n.filter(e=>e.available);return{...e,offers:n,inStock:i,best:i[0]||n[0]||null}}).filter(e=>!n||e.inStock.length>0)}var L=null,Ln=null,Rn=`2026-10-31-gorilla-arms-pr`;async function zn(){if(L)return L;if(!Ln){let e=`${w(`data/card-images.json`)}?v=${encodeURIComponent(Rn)}`;Ln=fetch(e,{cache:`no-store`}).then(e=>{if(!e.ok)throw Error(`Failed to load card images`);return e.json()}).then(e=>(L=e,L))}return Ln}function Bn(e){return!e||/^https?:\/\//i.test(e)||e.startsWith(`data:`)?e:w(e)}function Vn(e){return e?{...e,url:Bn(e.url),urlHi:Bn(e.urlHi||e.url)}:null}function R(e,{iconic:t=!1}={}){let n=L?.[e];return n?t?n.iconic?Vn(n.iconic):null:Vn(n.base)||null:null}function Hn(e){let t=L?.[e];return t?{base:Vn(t.base)||null,iconic:Vn(t.iconic)||null}:{base:null,iconic:null}}function Un(e){let t=Math.max(1,Number(e)||1);return{sheet:Math.floor((t-1)/2)+1,face:t%2==1?`F`:`B`}}function Wn(e,t){return(Math.max(1,Number(e)||1)-1)*2+(t===`B`?2:1)}function Gn(e){return e.filter(e=>e.set_code===`MS01`&&e.type===`Legend`).sort((e,t)=>e.sort_order-t.sort_order)}function Kn(e){return e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`)}function qn(e){return Kn(e).sort((e,t)=>e.sort_order-t.sort_order)}function Jn(e,t){let n=qn(e).findIndex(e=>e.id===t);if(n<0)return{page:1,pocket:1};let r=n%3;return{page:Math.floor(n/3)+1,pocket:r+1}}function Yn(e){return Math.max(1,Math.ceil(qn(e).length/3))}function Xn(e){return e.filter(e=>e.set_code===`showcase`&&e.type===`Legend`).sort((e,t)=>e.sort_order-t.sort_order)}function Zn(e){return e.filter(e=>e.set_code===`showcase`&&e.type!==`Legend`).sort((e,t)=>e.sort_order-t.sort_order)}function Qn(e){return e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.has_bstamp).sort((e,t)=>e.sort_order-t.sort_order)}function $n(e){return e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.has_prstamp).sort((e,t)=>e.sort_order-t.sort_order)}function z(e){let t=[];for(let n of Xn(e))t.push({card:n,kind:`extra`}),n.has_iconic&&t.push({card:n,kind:`iconic`});for(let n of Qn(e))for(let e=1;e<=3;e+=1)t.push({card:n,kind:`bstamp`,copyNeed:e});for(;t.length%4!=0;)t.push({card:null,kind:`spare`});for(let n of $n(e))for(let e=1;e<=3;e+=1)t.push({card:n,kind:`prstamp`,copyNeed:e});for(let n of Zn(e))t.push({card:n,kind:`extra`});return t}function er(e){return e.filter(e=>e.set_code===`MS01`&&e.type!==`Legend`&&e.has_iconic).sort((e,t)=>e.sort_order-t.sort_order)}function B(e){return Gn(e).length}function tr(e){return Math.ceil(er(e).length/4)}function nr(e){return Math.ceil(z(e).length/4)}function rr(e){return B(e)+tr(e)+1}function ir(e,t,{iconic:n=!1}={}){let r=rr(e),i=z(e),a=n?`iconic`:`extra`,o=i.findIndex(e=>e.card?.id===t&&e.kind===a);return o<0&&(o=i.findIndex(e=>e.card?.id===t)),o=Math.max(0,o),r+Math.floor(o/4)}function ar(e,t){let n=B(e),r=er(e),i=Math.max(0,r.findIndex(e=>e.id===t));return n+Math.floor(i/4)+1}function or(e){let t=B(e),n=tr(e),r=nr(e);return Math.max(1,t+n+r)}function sr(e,t){if(!t)return[];let n=[];if(t.set_code===`showcase`){let r=z(e),i=rr(e);return r.forEach((e,r)=>{if(e.card?.id!==t.id)return;let a=i+Math.floor(r/4),o=r%4+1,s=e.kind===`iconic`;n.push({binder:`vault`,page:a,pocket:o,role:s?`iconic`:`extra`,label:s?`Vault · page ${a} · pocket ${o} · Iconic A`:`Vault · page ${a} · pocket ${o} · base`})}),n}if(t.set_code===`MS01`&&t.type===`Legend`){let r=Gn(e).findIndex(e=>e.id===t.id);if(r>=0){let e=r+1;n.push({binder:`vault`,page:e,pocket:null,role:`legend`,label:(()=>{let n=[t.has_bstamp?`Nova Rare B`:null,t.has_prstamp?`Nova Rare W`:null].filter(Boolean).join(` + `);return n?`Vault · page ${e} · normal 1–3 + Iconic A · ${n} stamps fill playset after regulars`:`Vault · page ${e} · playset 1–3 + Iconic A`})()})}}else if(t.set_code===`MS01`&&t.type!==`Legend`){{let{page:r,pocket:i}=Jn(e,t.id);n.push({binder:`street`,page:r,pocket:i,role:`street`,label:`Street · page ${r} · column ${i} · normal playset 1–3${t.sheet!=null&&t.face?` · ${P(t)}`:``}${t.has_bstamp||t.has_prstamp?` (stamped Nova Rare → Vault)`:``}`})}if(t.has_iconic){let r=er(e).findIndex(e=>e.id===t.id);if(r>=0){let i=ar(e,t.id),a=r%4+1;n.push({binder:`vault`,page:i,pocket:a,role:`iconic`,label:`Vault · page ${i} · pocket ${a} · Iconic A`})}}if(t.has_bstamp){let r=z(e),i=rr(e);r.forEach((e,r)=>{if(e.card?.id!==t.id||e.kind!==`bstamp`)return;let a=i+Math.floor(r/4),o=r%4+1;n.push({binder:`vault`,page:a,pocket:o,role:`bstamp`,label:`Vault · page ${a} · pocket ${o} · Nova Rare B ${e.copyNeed}/3`})})}if(t.has_prstamp){let r=z(e),i=rr(e);r.forEach((e,r)=>{if(e.card?.id!==t.id||e.kind!==`prstamp`)return;let a=i+Math.floor(r/4),o=r%4+1;n.push({binder:`vault`,page:a,pocket:o,role:`prstamp`,label:`Vault · page ${a} · pocket ${o} · Nova Rare W ${e.copyNeed}/3`})})}}return n}function cr(e,t,n){let r=(t-1)*2+ +(n===`B`),i=[1,2,3,4].map(e=>({index:e,pos:e,card:null,kind:null,copyNeed:null,streetPlayset:!1})),a=Gn(e),o=a.length;if(r<o){let e=a[r]||null;if(!e)return i;for(let t=0;t<3;t+=1)i[t].card=e,i[t].kind=`copy`,i[t].copyNeed=t+1;return i[3].card=e,i[3].kind=`iconic`,i[3].copyNeed=null,i}let s=er(e),c=Math.ceil(s.length/4);if(r<o+c){let e=(r-o)*4;for(let t=0;t<4;t+=1){let n=s[e+t]||null;n&&(i[t].card=n,i[t].kind=`iconic`)}return i}let l=z(e),u=(r-o-c)*4;for(let e=0;e<4;e+=1){let t=l[u+e]||null;t?.card&&(i[e].card=t.card,i[e].kind=t.kind,i[e].copyNeed=t.copyNeed??null)}return i}function lr(e,t,n){return ur(e,Wn(t,n))}function ur(e,t){let n=qn(e),r=(Math.max(1,Number(t)||1)-1)*3,i=[];for(let e=0;e<3;e+=1)for(let t=0;t<3;t+=1){let a=n[r+t]||null;i.push({index:e*3+t+1,row:e+1,col:t+1,card:a,kind:a?`copy`:null,copyNeed:a?e+1:null,streetPlayset:!!a})}return i}function dr(e,t=`F`,n=[]){let r=Wn(e,t),i=[...new Map(ur(n,r).filter(e=>e.card).map(e=>[e.card.id,e.card])).values()];if(!i.length)return`Overflow`;let a=[...new Set(i.map(e=>e.type))],o=[...new Set(i.map(e=>e.band).filter(Boolean))];return`MS01 ${a.length===1?`${a[0]}s`:a.map(e=>`${e}s`).join(` / `)}${o.length?` · ${o.join(`/`)}`:``} · playset columns`}function fr(e,t=`F`,n=[]){let r=(e-1)*2+ +(t===`B`),i=B(n);if(r<i)return`MS01 Legends · playset + A`;let a=tr(n);if(r<i+a)return`MS01 Iconic alts · Units / Gear / Programs`;let o=i+a;if(r<o+nr(n)){let e=z(n),t=(r-o)*4,i=e.slice(t,t+4);return i.some(e=>e.kind===`bstamp`)?`Beta Event · Mantis Blades Nova Rare B stamps`:i.some(e=>e.kind===`prstamp`)?`Pre-release · Gorilla Arms Nova Rare W stamps`:i.some(e=>e.card?.set_code===`showcase`&&e.card?.type!==`Legend`)?`Showcase Units / promos · back of Vault`:`Showcase / Kickstarter · base + Iconic A`}return`Overflow`}function pr(e,t){if(!t.card)return{filled:!1,complete:!1,showIconicArt:!1,isBstamp:!1};let n=k(e,t.card.id),r=j(n);if(t.kind===`iconic`){let e=(n.iconic_copies||0)>0;return{filled:e,complete:e,showIconicArt:!0,isBstamp:!1,isPrstamp:!1}}if(t.kind===`copy`){if(t.streetPlayset){let e=n.copies||0;return{filled:e>=t.copyNeed,complete:e>=3,showIconicArt:!1,isBstamp:!1,isPrstamp:!1}}let e=r>=t.copyNeed,i=n.copies||0,a=i+(n.bstamp_copies||0),o=e&&t.copyNeed>i&&t.copyNeed<=a,s=e&&t.copyNeed>a&&t.copyNeed<=a+(n.prstamp_copies||0);return{filled:e,complete:r>=3,showIconicArt:!1,isBstamp:o,isPrstamp:s}}if(t.kind===`extra`)return{filled:r>0,complete:r>=3,showIconicArt:!1,isBstamp:!1,isPrstamp:!1};if(t.kind===`bstamp`){let e=t.copyNeed||1,r=(n.bstamp_copies||0)>=e;return{filled:r,complete:(n.bstamp_copies||0)>=3,showIconicArt:!1,isBstamp:r,isPrstamp:!1}}if(t.kind===`prstamp`){let e=t.copyNeed||1,r=(n.prstamp_copies||0)>=e;return{filled:r,complete:(n.prstamp_copies||0)>=3,showIconicArt:!1,isBstamp:!1,isPrstamp:r}}return{filled:r>0,complete:r>=3,showIconicArt:!1,isBstamp:!1,isPrstamp:!1}}function mr(e,t,n){let r=t.binderMode===`vault`?`vault`:`street`,{cards:i,ownership:a}=t,o=r===`vault`?36:96,s=Math.min(Math.max(1,t.binderPage||1),o),{sheet:c,face:l}=Un(s),u=r===`vault`?cr(i,c,l):lr(i,c,l),d=r===`vault`?`binder-grid binder-grid-2x2`:`binder-grid binder-grid-3x3`,f=r===`vault`?B(i):0,p=r===`vault`?or(i):Yn(i),m=r===`vault`?fr(c,l,i):dr(c,l,i);e.innerHTML=`
    <section class="panel binder-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">${r===`vault`?`Vault · 2×2 toploader · 144 pockets · 36 pages · cards through p${p}`:`Street · 3×3 · 864 pockets · 96 pages · cards through p${p}`}</p>
          <h2>Page ${s}</h2>
          <p class="muted">${V(m)}${s>p?` · spare overflow (last cards on page ${p})`:``}</p>
        </div>
        <div class="binder-controls">
          <div class="seg" role="group" aria-label="Binder">
            <button type="button" class="seg-btn ${r===`street`?`on`:``}" data-binder-mode="street">Street</button>
            <button type="button" class="seg-btn ${r===`vault`?`on`:``}" data-binder-mode="vault">Vault</button>
          </div>
          <button type="button" class="btn ghost" data-binder="prev" ${s<=1?`disabled`:``}>←</button>
          <label class="sheet-jump">
            <span class="sr-only">Page</span>
            <input type="number" min="1" max="${o}" value="${s}" data-binder="jump" />
          </label>
          <button type="button" class="btn ghost" data-binder="next" ${s>=o?`disabled`:``}>→</button>
        </div>
      </header>

      <div class="binder-page" data-page="${s}" data-mode="${r}">
        <div class="${d}">
          ${u.map(e=>{if(!e.card)return`<div class="pocket empty" title="Spare pocket"><span class="pocket-idx">${e.index}</span><span class="pocket-spare">spare</span></div>`;let{filled:t,complete:n,showIconicArt:r,isBstamp:i,isPrstamp:o}=pr(a,e),s=e.kind===`iconic`||r,c=R(e.card.id,{iconic:s})||(s?null:R(e.card.id,{iconic:!1})),l=c?.url||``,u=i||o||e.kind===`bstamp`||e.kind===`prstamp`,d=i?`B`:o?`W`:``,f=e.kind===`iconic`?`A`:e.kind===`copy`?`${e.copyNeed}/3${d}`:e.kind===`bstamp`?`Nova B ${e.copyNeed}/3`:e.kind===`prstamp`?`Nova W ${e.copyNeed}/3`:e.kind===`extra`?`base`:P(e.card),p=i?` · Nova Rare B stamp`:o?` · Nova Rare WTNC W stamp`:e.kind===`bstamp`?` · Nova Rare B stamp pocket`:e.kind===`prstamp`?` · Nova Rare WTNC W stamp pocket`:``,m=i||e.kind===`bstamp`?`is-bstamp has-bstamp-flag`:o||e.kind===`prstamp`?`is-prstamp has-prstamp-flag`:``,h=u?`Nova Rare`:e.card.rarity;return`
                <button type="button" class="pocket ${t?`owned`:`missing`} ${n?`complete`:``} ${e.kind===`iconic`&&t?`has-iconic`:``} ${m} ${l?`has-art`:``}"
                  data-card-id="${e.card.id}" data-art="${s?`iconic`:`base`}" title="${V(e.card.name)} (${V(f)}${p})">
                  ${l?`<img class="pocket-art" src="${l}" alt="${V(e.card.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`:`<span class="pocket-art-fallback" aria-hidden="true">${V(e.card.name.slice(0,1))}</span>`}
                  <span class="pocket-overlay">
                    <span class="pocket-idx">${e.index} · ${f}</span>
                    <span class="pocket-num">${V(e.card.number)}</span>
                    <span class="pocket-name">${V(e.card.name)}</span>
                    <span class="pocket-meta">${V(h)}${c?.tcgNumber?` · ${V(c.tcgNumber)}`:``}</span>
                  </span>
                </button>`}).join(``)}
        </div>
      </div>

      <p class="hint">${r===`vault`?`Vault: Legends on pages 1–${f} (normal + Nova Rare B/W stamps), Iconic alts, showcase Legends, Mantis Nova B, Gorilla Arms Nova W, then showcase Units/promos through page ${p}. Pages ${p+1}–36 are spare overflow.`:`Street: normal MS01 Units / Gear / Programs only (playset columns) through page ${p}. Stamped Nova Rares (Mantis B, Gorilla Arms W), Iconic alts, and showcase live in Vault.`}</p>    </section>
  `,e.querySelectorAll(`[data-binder-mode]`).forEach(e=>{e.addEventListener(`click`,()=>n.setMode(e.dataset.binderMode))}),e.querySelector(`[data-binder="prev"]`)?.addEventListener(`click`,()=>n.setPage(Math.max(1,s-1))),e.querySelector(`[data-binder="next"]`)?.addEventListener(`click`,()=>n.setPage(Math.min(o,s+1))),e.querySelector(`[data-binder="jump"]`)?.addEventListener(`change`,e=>{let t=Math.min(o,Math.max(1,Number(e.target.value)||1));n.setPage(t)}),e.querySelectorAll(`.pocket[data-card-id]`).forEach(e=>{e.addEventListener(`click`,()=>n.openCard(e.dataset.cardId,{preferIconic:e.dataset.art===`iconic`}))})}function V(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var H=null;async function hr(){if(H)return H;try{let e=await fetch(w(`data/artist-profiles.json`));if(!e.ok)throw Error(String(e.status));H=await e.json()}catch{H={profiles:{},aliases:{}}}return H}function gr(e,t=H){let n=e&&String(e).trim()||``;return n?(t?.aliases||{})[n]||n:``}function _r(e){let t=H;if(!t)return[];let n=gr(e,t),r=t.profiles?.[n];return Array.isArray(r?.links)?r.links.filter(e=>e?.url):[]}function vr(e){return _r(e).length>0}function yr(e){return`https://www.artstation.com/search?sort_by=relevance&query=${encodeURIComponent(e&&String(e).trim()||``)}`}function br(e){let t=_r(e);if(t.length)return t;let n=e&&String(e).trim()||``;return!n||n===`Unknown`?[]:[{label:`Search`,url:yr(n)}]}var xr=`ncb-usd-aud`,Sr=864e5,Cr=1.55;function wr(){try{let e=JSON.parse(localStorage.getItem(xr)||`null`);return!e||!Number.isFinite(e.rate)||e.rate<=0?null:e}catch{return null}}async function Tr(){let e=wr();if(e&&e.at&&Date.now()-e.at<Sr)return{rate:e.rate,date:e.date||null,at:e.at,fallback:!!e.fallback};try{let e=await fetch(`https://api.frankfurter.dev/v2/rate/usd/aud`);if(!e.ok)throw Error(String(e.status));let t=await e.json(),n=Number(t.rate);if(!Number.isFinite(n)||n<=0)throw Error(`bad rate`);let r={rate:n,date:t.date||null,at:Date.now(),fallback:!1};return localStorage.setItem(xr,JSON.stringify(r)),r}catch{return e?.rate?{rate:e.rate,date:e.date||null,at:e.at||0,fallback:!0}:{rate:Cr,date:null,at:0,fallback:!0}}}var Er=[{id:`heist`,name:`The Heist`,subtitle:`Yellow / Blue · Merc starter`,entries:[{id:`SD01-012`,qty:1,role:`legend`},{id:`SD01-001`,qty:1,role:`legend`},{id:`SD01-011`,qty:1,role:`legend`},{id:`SD01-002`,qty:2,role:`main`},{id:`MS01-047`,qty:2,role:`main`},{id:`MS01-051`,qty:2,role:`main`},{id:`MS01-053`,qty:2,role:`main`},{id:`MS01-055`,qty:2,role:`main`},{id:`MS01-061`,qty:3,role:`main`},{id:`MS01-062`,qty:3,role:`main`},{id:`MS01-064`,qty:3,role:`main`},{id:`MS01-065`,qty:2,role:`main`},{id:`MS01-112`,qty:3,role:`main`},{id:`MS01-113`,qty:3,role:`main`},{id:`SD01-015`,qty:2,role:`main`},{id:`MS01-124`,qty:2,role:`main`},{id:`MS01-128`,qty:2,role:`main`},{id:`MS01-130`,qty:2,role:`main`},{id:`MS01-132`,qty:3,role:`main`},{id:`MS01-136`,qty:2,role:`main`}]},{id:`embracing-power`,name:`Embracing Power`,subtitle:`Red / Green · Arasaka starter`,entries:[{id:`SD02-012`,qty:1,role:`legend`},{id:`SD02-001`,qty:1,role:`legend`},{id:`SD02-013`,qty:1,role:`legend`},{id:`MS01-008`,qty:2,role:`main`},{id:`NIGHTCITYBRAWL-S1-00`,qty:2,role:`main`},{id:`MS01-017`,qty:3,role:`main`},{id:`MS01-019`,qty:2,role:`main`},{id:`MS01-077`,qty:2,role:`main`},{id:`MS01-078`,qty:2,role:`main`},{id:`SD02-017`,qty:2,role:`main`},{id:`MS01-080`,qty:2,role:`main`},{id:`MS01-023`,qty:2,role:`main`},{id:`MS01-025`,qty:3,role:`main`},{id:`MS01-026`,qty:3,role:`main`},{id:`MS01-033`,qty:2,role:`main`},{id:`MS01-034`,qty:2,role:`main`},{id:`MS01-035`,qty:2,role:`main`},{id:`MS01-076`,qty:3,role:`main`},{id:`MS01-095`,qty:3,role:`main`},{id:`MS01-097`,qty:3,role:`main`}]}];function Dr(){let e=new Set,t=[];for(let n of Er)for(let r of n.entries)e.has(r.id)||(e.add(r.id),t.push(r.id));return t}function Or(e){let t=new Map(e.map(e=>[e.id,e]));return Er.map(e=>{let n=e.entries.map(e=>({...e,card:t.get(e.id)||null})).filter(e=>e.card);return{...e,entries:n}})}var U={label:`TCG Contender Standard`,url:`https://tcgcontender.com/cyberpunk/meta/standard`,asOf:`2026-11-07`},kr={label:`ripperdeck meta`,url:`https://ripperdeck.gg/meta`,asOf:`2026-11-08`},Ar={label:`BBG Control guide`,url:`https://cyberpunk-tcg-news.de/2026/10/14/bbg-control-deck-guide-alt-hanako-jackie/`,asOf:`2026-10-14`},jr={label:`RRY Aggro guide`,url:`https://cyberpunk-tcg-news.de/2026/10/15/rry-deck-guide-adam-smasher-dum-dum-and-v/`,asOf:`2026-10-14`},W={label:`Pre-tournament meta overview`,url:`https://cyberpunk-tcg-news.de/2026/10/15/cyberpunk-tcg-meta-before-the-first-tournaments/`,asOf:`2026-10-14`},G=`MS01-005a`,Mr=[{id:`smasher-dumdum-streetkid`,rank:1,tier:1,score:64,share:.16,name:`Adam Smasher / Dum Dum / V: Streetkid`,archetype:`Aggro-Tempo Gear Rush (RRY)`,colors:[`red`,`yellow`],plan:`Eddie ramp into Yorinobu on 4 and Smasher on 6; Gear pushes 10+ power swings.`,why:`TCG Contender #1 (score 64, ~16% share). Community “first answer to BBG”: big midrange bodies, Go Solo Smasher removal, Streetkid Braindance recursion, Dum Dum draw/Gear pumps. Cheapest Tier-1 shell in published guides.`,listStatus:`full`,sources:[U,jr,W],entries:[{id:`MS01-001`,qty:1,role:`legend`},{id:G,qty:1,role:`legend`},{id:`MS01-036`,qty:1,role:`legend`},{id:`MS01-043`,qty:3,role:`main`},{id:`MS01-006`,qty:3,role:`main`},{id:`MS01-052`,qty:3,role:`main`},{id:`MS01-007`,qty:3,role:`main`},{id:`MS01-022`,qty:3,role:`main`},{id:`MS01-025`,qty:3,role:`main`},{id:`MS01-026`,qty:3,role:`main`},{id:`MS01-064`,qty:3,role:`main`},{id:`MS01-027`,qty:3,role:`main`},{id:`MS01-033`,qty:3,role:`main`},{id:`MS01-028`,qty:2,role:`main`},{id:`MS01-029`,qty:3,role:`main`},{id:`MS01-034`,qty:3,role:`main`},{id:`MS01-030`,qty:3,role:`main`}]},{id:`dexter-muamar-streetkid`,rank:2,tier:1,score:59,share:.091,name:`Dexter DeShawn / Muamar Reyes / V: Streetkid`,archetype:`Aggro-Midrange Gig Race`,colors:[`red`,`yellow`],plan:`Race Gigs with mid Units + cheap Gear; Streetkid recycles Braindance programs.`,why:`Tier 1 on Contender (score 59). RareTotem’s preferred RRY-adjacent Gig-race shell: Fixer Legends (Dexter/Muamar) plus Streetkid engine. Same axis as River Gear but pressures with Streetkid tempo instead of River’s free Gear.`,listStatus:`core`,sources:[U,W,kr],entries:[{id:`MS01-002`,qty:1,role:`legend`},{id:`MS01-038`,qty:1,role:`legend`},{id:G,qty:1,role:`legend`},{id:`MS01-043`,qty:3,role:`main`},{id:`MS01-014`,qty:2,role:`main`},{id:`MS01-052`,qty:2,role:`main`},{id:`MS01-054`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-059`,qty:3,role:`main`},{id:`MS01-060`,qty:3,role:`main`},{id:`MS01-064`,qty:3,role:`main`},{id:`MS01-061`,qty:2,role:`main`},{id:`MS01-062`,qty:2,role:`main`},{id:`MS01-033`,qty:2,role:`main`},{id:`MS01-029`,qty:2,role:`main`},{id:`MS01-067`,qty:2,role:`main`},{id:`MS01-065`,qty:2,role:`main`}]},{id:`smasher-saburo-streetkid`,rank:3,tier:1,score:57,share:.031,name:`Adam Smasher / Saburo Arasaka / V: Streetkid`,archetype:`Midrange-Control (Smasher / Arasaka)`,colors:[`red`,`green`],plan:`Arasaka value + Streetkid recursion; Smasher as late Go Solo finisher.`,why:`Tier 1 Contender shell pairing Smasher’s board wipe/attack with Saburo’s Arasaka package and Streetkid card advantage. Lower share than #1–2 but strong score; plays the midrange-control lane instead of pure Gear rush.`,listStatus:`core`,sources:[U,W],entries:[{id:`MS01-001`,qty:1,role:`legend`},{id:`SD02-013`,qty:1,role:`legend`},{id:G,qty:1,role:`legend`},{id:`MS01-022`,qty:3,role:`main`},{id:`MS01-014`,qty:2,role:`main`},{id:`MS01-019`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-023`,qty:2,role:`main`},{id:`MS01-025`,qty:3,role:`main`},{id:`MS01-026`,qty:3,role:`main`},{id:`MS01-095`,qty:2,role:`main`},{id:`MS01-033`,qty:3,role:`main`},{id:`MS01-029`,qty:2,role:`main`},{id:`MS01-030`,qty:2,role:`main`},{id:`MS01-097`,qty:2,role:`main`},{id:`MS01-101`,qty:2,role:`main`}]},{id:`bbg-alt-hanako-jackie`,rank:4,tier:1,score:55,share:.1,name:`Alt / Hanako / Jackie: Pour One Out For Me`,archetype:`BBG Control (Blue / Green)`,colors:[`blue`,`green`],plan:`Bottom-deck removal + Hanako pair draws; grind out late with Programs.`,why:`Tier 1 Contender (~10% share) and pre-retail consensus “deck to beat”. Alt/Jackie supply Blue RAM 4 for Towerfall/Les Élémens; Hanako converts Gig pairs into cards. Most published full netdeck in the format.`,listStatus:`full`,sources:[U,Ar,W,kr],entries:[{id:`MS01-106`,qty:1,role:`legend`},{id:`MS01-072`,qty:1,role:`legend`},{id:`SD01-011`,qty:1,role:`legend`},{id:`MS01-115`,qty:3,role:`main`},{id:`MS01-086`,qty:3,role:`main`},{id:`MS01-117`,qty:2,role:`main`},{id:`MS01-118`,qty:3,role:`main`},{id:`MS01-132`,qty:2,role:`main`},{id:`MS01-101`,qty:3,role:`main`},{id:`MS01-139`,qty:3,role:`main`},{id:`MS01-103`,qty:2,role:`main`},{id:`MS01-137`,qty:3,role:`main`},{id:`MS01-131`,qty:3,role:`main`},{id:`MS01-134`,qty:3,role:`main`},{id:`MS01-135`,qty:3,role:`main`},{id:`MS01-100`,qty:2,role:`main`},{id:`MS01-133`,qty:3,role:`main`},{id:`MS01-138`,qty:2,role:`main`},{id:`MS01-120`,qty:2,role:`side`},{id:`MS01-123`,qty:2,role:`side`},{id:`MS01-094`,qty:3,role:`side`}]},{id:`smasher-judy-streetkid`,rank:5,tier:2,score:57,share:.015,name:`Adam Smasher / Judy Álvarez / V: Streetkid`,archetype:`Aggro-Tempo Gig Race`,colors:[`red`,`blue`],plan:`Streetkid + Judy Braindance engine; Smasher closes once Gigs are contested.`,why:`High Contender score but held to Tier 2 by the ~2% share floor. Mixes red finisher pressure with Judy’s Braindance midrange tools — a Gig-race hybrid rather than pure RRY.`,listStatus:`core`,sources:[U,W],entries:[{id:`MS01-001`,qty:1,role:`legend`},{id:`MS01-108`,qty:1,role:`legend`},{id:G,qty:1,role:`legend`},{id:`MS01-116`,qty:2,role:`main`},{id:`MS01-117`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-022`,qty:2,role:`main`},{id:`MS01-025`,qty:2,role:`main`},{id:`MS01-026`,qty:2,role:`main`},{id:`MS01-131`,qty:3,role:`main`},{id:`MS01-139`,qty:3,role:`main`},{id:`MS01-134`,qty:2,role:`main`},{id:`MS01-029`,qty:2,role:`main`},{id:`MS01-033`,qty:2,role:`main`},{id:`MS01-138`,qty:2,role:`main`}]},{id:`jackie-mama-johnny-streetkid`,rank:6,tier:2,score:56,share:.011,name:`Jackie: Mama's Favorite / Johnny / V: Streetkid`,archetype:`Red-heavy Aggro-Midrange`,colors:[`red`,`green`],plan:`Gig pressure with Johnny/Jackie bodies; Streetkid keeps programs flowing.`,why:`Tier 2 Contender shell emphasizing red Gig theft and midrange Units. Lower share, but the Legend trio is a clean “attack for Gigs” plan versus Blue’s bottom-deck removal.`,listStatus:`core`,sources:[U],entries:[{id:`MS01-073`,qty:1,role:`legend`},{id:`MS01-003`,qty:1,role:`legend`},{id:G,qty:1,role:`legend`},{id:`MS01-011`,qty:3,role:`main`},{id:`MS01-006`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-019`,qty:2,role:`main`},{id:`MS01-025`,qty:3,role:`main`},{id:`MS01-026`,qty:2,role:`main`},{id:`MS01-060`,qty:2,role:`main`},{id:`MS01-029`,qty:3,role:`main`},{id:`MS01-033`,qty:2,role:`main`},{id:`MS01-034`,qty:2,role:`main`},{id:`MS01-030`,qty:2,role:`main`},{id:`MS01-101`,qty:2,role:`main`}]},{id:`smasher-alt-streetkid`,rank:7,tier:2,score:55,share:.034,name:`Adam Smasher / Alt Cunningham / V: Streetkid`,archetype:`Midrange-Control hybrid`,colors:[`red`,`blue`],plan:`Blue disruption early; Smasher as the mid/late hammer once Gigs stall.`,why:`Dropped Contender Tier 1→2 but remains a high-value hybrid: Alt’s removal suite plus Streetkid recursion, with Smasher as the game-ender Contender still rates highly on score-per-dollar.`,listStatus:`core`,sources:[U,W],entries:[{id:`MS01-001`,qty:1,role:`legend`},{id:`MS01-106`,qty:1,role:`legend`},{id:G,qty:1,role:`legend`},{id:`MS01-115`,qty:2,role:`main`},{id:`MS01-117`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-022`,qty:2,role:`main`},{id:`MS01-025`,qty:2,role:`main`},{id:`MS01-139`,qty:3,role:`main`},{id:`MS01-131`,qty:3,role:`main`},{id:`MS01-135`,qty:2,role:`main`},{id:`MS01-138`,qty:2,role:`main`},{id:`MS01-133`,qty:2,role:`main`},{id:`MS01-029`,qty:2,role:`main`},{id:`MS01-033`,qty:2,role:`main`}]},{id:`alt-jackie-judy`,rank:8,tier:2,score:55,share:.054,name:`Alt / Jackie: Pour One Out / Judy Álvarez`,archetype:`Blue Midrange-Control (BBB lean)`,colors:[`blue`],plan:`Bottom-deck removal into big blue Units; Judy Unit needs Blue RAM 5+.`,why:`Tier 2 Contender with solid share. Same Alt/Jackie spine as BBG but swaps Hanako for Judy — mono-blue-leaning control that wins with Judy Álvarez: Nothing to Doubt and Placide-sized finishers instead of Hanako pair draws.`,listStatus:`core`,sources:[U,W],entries:[{id:`MS01-106`,qty:1,role:`legend`},{id:`SD01-011`,qty:1,role:`legend`},{id:`MS01-108`,qty:1,role:`legend`},{id:`MS01-115`,qty:3,role:`main`},{id:`MS01-116`,qty:2,role:`main`},{id:`MS01-117`,qty:2,role:`main`},{id:`MS01-118`,qty:3,role:`main`},{id:`MS01-124`,qty:2,role:`main`},{id:`MS01-123`,qty:2,role:`main`},{id:`MS01-139`,qty:3,role:`main`},{id:`MS01-131`,qty:3,role:`main`},{id:`MS01-134`,qty:3,role:`main`},{id:`MS01-135`,qty:3,role:`main`},{id:`MS01-138`,qty:2,role:`main`},{id:`MS01-133`,qty:2,role:`main`},{id:`MS01-132`,qty:2,role:`main`}]},{id:`smasher-dexter-hanako`,rank:9,tier:2,score:55,share:.015,name:`Adam Smasher / Dexter DeShawn / Hanako Arasaka`,archetype:`Aggro-Midrange`,colors:[`red`,`green`],plan:`Dexter Fixer midrange into Hanako value; Smasher as the closer.`,why:`Climbed into Contender Tier 2. Unusual red/green mix: Dexter’s Off the Grid toolkit plus Hanako’s draw engine, with Smasher as the shared finisher across many T2 lists.`,listStatus:`core`,sources:[U],entries:[{id:`MS01-001`,qty:1,role:`legend`},{id:`MS01-002`,qty:1,role:`legend`},{id:`MS01-072`,qty:1,role:`legend`},{id:`MS01-014`,qty:2,role:`main`},{id:`MS01-086`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-022`,qty:2,role:`main`},{id:`MS01-025`,qty:2,role:`main`},{id:`MS01-026`,qty:2,role:`main`},{id:`MS01-101`,qty:3,role:`main`},{id:`MS01-103`,qty:2,role:`main`},{id:`MS01-097`,qty:2,role:`main`},{id:`MS01-033`,qty:2,role:`main`},{id:`MS01-029`,qty:2,role:`main`},{id:`MS01-100`,qty:2,role:`main`}]},{id:`smasher-dexter-muamar`,rank:10,tier:2,score:55,share:.015,name:`Adam Smasher / Dexter DeShawn / Muamar Reyes`,archetype:`Aggro-Midrange (accessible Smasher)`,colors:[`red`,`yellow`],plan:`Fixer midrange Gear race; Smasher as the shared late bomb.`,why:`Contender Tier 2 climber and Contender’s “beginner” Smasher shell: Dexter + Muamar Fixers do the midgame work while Smasher remains the format’s most familiar closer. Same RYY color spine as popular Gear lists.`,listStatus:`core`,sources:[U,kr],entries:[{id:`MS01-001`,qty:1,role:`legend`},{id:`MS01-002`,qty:1,role:`legend`},{id:`MS01-038`,qty:1,role:`legend`},{id:`MS01-043`,qty:2,role:`main`},{id:`MS01-054`,qty:2,role:`main`},{id:`MS01-014`,qty:2,role:`main`},{id:`MS01-007`,qty:2,role:`main`},{id:`MS01-059`,qty:3,role:`main`},{id:`MS01-060`,qty:3,role:`main`},{id:`MS01-064`,qty:3,role:`main`},{id:`MS01-025`,qty:2,role:`main`},{id:`MS01-026`,qty:2,role:`main`},{id:`MS01-067`,qty:2,role:`main`},{id:`MS01-033`,qty:2,role:`main`},{id:`MS01-029`,qty:2,role:`main`}]}],Nr={asOf:`2026-11-07`,caveat:`Ranking blends community/simulator results and meta share (TCG Contender). Sanctioned Night City Showdowns begin 13 Nov 2026. Core shells are staple packages, not invented full 40s.`,popularNote:`ripperdeck’s most-built shell lately is Dum Dum / River / Royce (Gear popularity) — strong presence, not Contender top-10 by results score.`};function Pr(e){let t=new Map(e.map(e=>[e.id,e]));return Mr.map(e=>{let n=e.entries.map(e=>({...e,card:t.get(e.id)||null})).filter(e=>e.card),r=e.entries.filter(e=>!t.has(e.id)).map(e=>e.id);return{...e,entries:n,missingIds:r}})}function Fr(e){let t=e.filter(e=>e.role===`legend`),n=e.filter(e=>e.role===`main`),r=e.filter(e=>e.role===`side`),i=e=>{let t=[`Unit`,`Gear`,`Program`,`Legend`],n=new Map;for(let t of e){let e=t.card?.type||`Other`;n.has(e)||n.set(e,[]),n.get(e).push(t)}return t.filter(e=>n.has(e)).map(e=>({type:e,entries:n.get(e)})).concat([...n.keys()].filter(e=>!t.includes(e)).map(e=>({type:e,entries:n.get(e)})))};return{legends:t,main:n,side:r,mainByType:i(n),sideByType:i(r)}}var Ir=document.querySelector(`#app`),K={session:null,user:null,cards:[],ownership:{},prices:{},pricesUpdatedAt:null,fx:{rate:Cr,date:null,fallback:!0},settings:{completion_mode:`ms01`,value_count_copies:!0,default_copy_source:`beta`,display_currency:`USD`},view:`dashboard`,filter:{q:``,type:`all`,set:`MS01`,missing:!1,underPlayset:!1,underSix:!1},iconicFilter:`all`,opsReveal:null,opsArtist:null,opsArtistQ:``,binderMode:`vault`,binderPage:1,modalCardId:null,modalPreferIconic:!1,busy:!1,sellerStock:{updatedAt:null,source:null,sellers:I,listings:[],from:`empty`},wantedFilter:{q:``,edition:`all`,inStockOnly:!1,underPlayset:!1,underSix:!1,seller:`all`},wantedFocusIds:null,wantedFocusLabel:null,selectedDeckId:null,stockRefreshing:!1};function q(e,{preferIconic:t=!1}={}){K.modalCardId=e,K.modalPreferIconic=!!t,Di()}function J(e){let t=document.querySelector(`.toast`);t||(t=document.createElement(`div`),t.className=`toast`,document.body.appendChild(t)),t.textContent=e,t.classList.add(`show`),clearTimeout(J._t),J._t=setTimeout(()=>t.classList.remove(`show`),2200)}function Y(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Lr(e){return e===`forgot`?`Enter your Netrunner ID. We will send a reset link to that inbox.`:e===`reset`?`Choose a new access code. After you save it, you are jacked back in.`:`Fill your 3×3 binder. Track MS01 completion, Iconic alts, and live USD value — synced across every device you jack into.`}function Rr(e=``,t=!1,n=`signin`){let r=we,i=n===`signup`,a=n===`forgot`,o=n===`reset`,s=!a,c=o?`Save new access code`:a?`Send reset link`:i?`Create account`:`Jack in`;Ir.innerHTML=`
    <div class="auth-screen">
      <div class="auth-bg" aria-hidden="true">
        <img src="${w(`brand/wall-smasher.webp`)}" alt="" class="auth-bg-img" />
        <div class="auth-bg-fade"></div>
      </div>
      <div class="auth-card">
        <img class="auth-logo" src="${w(`brand/logo-yellow.webp`)}" alt="Cyberpunk TCG" width="320" height="80" />
        <img class="auth-set-logo" src="${w(`brand/logo-wtnc.webp`)}" alt="Welcome to Night City" width="280" height="60" />
        <h1>Night City <span class="glitch">Binder</span></h1>
        <p>${Lr(n)}</p>
        ${r?`
          <form class="auth-form" id="auth-form">
            ${o?``:`<label>
              Netrunner ID (email)
              <input type="email" name="email" required placeholder="you@night.city" autocomplete="username" />
            </label>`}
            ${s?`<label>
              ${o?`New access code`:`Access code (password)`}
              <input type="password" name="password" required minlength="6" placeholder="••••••••" autocomplete="${i||o?`new-password`:`current-password`}" />
            </label>`:``}
            ${o?`<label>
              Confirm access code
              <input type="password" name="password_confirm" required minlength="6" placeholder="••••••••" autocomplete="new-password" />
            </label>`:``}
            <button class="btn primary" type="submit">${c}</button>
            ${n===`signin`?`<button class="btn ghost" type="button" id="auth-forgot">Forgot access code?</button>`:``}
            ${o?``:`<button class="btn ghost" type="button" id="auth-mode-toggle">
              ${a?`Back to sign in`:i?`Already have an account? Sign in`:`New here? Create an account`}
            </button>`}
            <div class="auth-status ${t?`error`:``}" id="auth-status">${Y(e)}</div>
          </form>`:`
          <button class="btn primary" type="button" id="demo-enter">Enter Night City</button>
          <p class="demo-note">Supabase not linked yet — demo runs local-only.
            Copy <code>.env.example</code> → <code>.env</code>, run migration + seed, reload for cross-device sync.</p>
          <div class="auth-status ${t?`error`:``}">${Y(e)}</div>`}
      </div>
    </div>
  `,r?(document.querySelector(`#auth-forgot`)?.addEventListener(`click`,()=>{Rr(``,!1,`forgot`)}),document.querySelector(`#auth-mode-toggle`)?.addEventListener(`click`,()=>{a||i?Rr(``,!1,`signin`):Rr(``,!1,`signup`)}),document.querySelector(`#auth-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=new FormData(e.target),n=String(t.get(`email`)||``).trim(),r=String(t.get(`password`)||``),s=String(t.get(`password_confirm`)||``),c=document.querySelector(`#auth-status`);if(c.classList.remove(`error`),a){c.textContent=`Sending reset link…`;let{error:e}=await C.auth.resetPasswordForEmail(n,{redirectTo:Ee()});if(e){c.textContent=e.message,c.classList.add(`error`);return}c.textContent=`If that inbox has an account, a reset link is on the way. Open it on this device, then set a new access code.`;return}if(o){if(r!==s){c.textContent=`Access codes do not match.`,c.classList.add(`error`);return}c.textContent=`Saving new access code…`;let{error:e}=await C.auth.updateUser({password:r});if(e){c.textContent=e.message,c.classList.add(`error`);return}K.cards.length||await Br();return}if(c.textContent=i?`Creating account…`:`Jacking in…`,i){let{data:e,error:t}=await C.auth.signUp({email:n,password:r,options:{emailRedirectTo:Ee()}});if(t){c.textContent=t.message,c.classList.add(`error`);return}if(e.session)return;c.textContent=`Account created. Check your email to confirm, then Jack in. If the link 404s, fix Supabase Site URL (see SETUP.md).`;return}let{error:l}=await C.auth.signInWithPassword({email:n,password:r});l&&(c.textContent=l.message,c.classList.add(`error`))})):document.querySelector(`#demo-enter`)?.addEventListener(`click`,()=>{localStorage.setItem(`ncb-demo`,`1`),K.user={id:`demo-local`,email:`demo@local`},Br()})}function X(e){return Wt(e,K.settings.display_currency,K.fx?.rate||1.55)}async function zr(e){let t=N(e);K.settings=await Ue(K.user?.id,{...K.settings,display_currency:t}),t===`AUD`&&K.fx?.fallback&&(K.fx=await Tr()),Q()}async function Br(){Ir.innerHTML=`<div class="loading">Jacking in // NC</div>`;try{let[e,t,n,r,i]=await Promise.all([Ge(),Be(K.user?.id),qe(),He(K.user?.id),kn(),zn(),hr()]);if(K.cards=e,K.ownership=t,K.prices=n.map,K.pricesUpdatedAt=n.updatedAt,K.settings=r,K.sellerStock=i,K.fx=await Tr(),!Object.keys(K.prices).length){let t={Common:.12,Uncommon:.2,Rare:.45,Epic:4.5,Secret:22,Promo:8,Nova:80},n={Common:3,Uncommon:4,Rare:8,Epic:12,Secret:35,Promo:5,Nova:10};for(let r of e){let e=t[r.rarity]??.25;K.prices[r.id]={base:e},r.has_iconic&&(K.prices[r.id].iconic=e*(n[r.rarity]??10))}K.pricesUpdatedAt=`estimate (refresh via npm run prices)`}Z()}catch(e){console.error(e),Ir.innerHTML=`<div class="loading">Failed to load: ${Y(e.message)}</div>`}}function Z(){Ir.innerHTML=`
    <div class="app-shell">
      <header class="topbar no-print">
        <div class="brand">
          <a class="brand-lockup" href="#" data-view-home="dashboard" title="Night City Binder">
            <img class="brand-logo" src="${w(`brand/logo-yellow.webp`)}" alt="Cyberpunk TCG" width="160" height="40" />
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
          <button type="button" data-view="decks">Decks</button>
          <button type="button" data-view="wanted">Wanted</button>
          <button type="button" data-view="binder">Binders</button>
          <button type="button" data-view="iconics">Iconics</button>
          <button type="button" data-view="value">Eddies</button>
        </nav>
        <div class="user-chip">
          <span>${Y(K.user?.email||`collector`)}</span>
          <span class="badge" style="background:var(--cp-danger);color:#fff">DEMO</span>
        </div>
      </header>
      ${je?``:`<div class="schema-banner no-print">
              <strong>Database tables missing.</strong>
              Sign-in worked, but Supabase has no <code>cards</code> / <code>ownership</code> tables yet — sync is off until you run the setup SQL.
              <a href="https://supabase.com/dashboard/project/orrxumsntcbuqjzldmos/sql/new" target="_blank" rel="noopener">Open SQL editor</a>
              → paste <code>supabase/setup-all.sql</code> from the repo → Run.
              
            </div>`}
      <main class="main" id="view"></main>
      <footer class="app-foot no-print">
        <span>Fan collection tool · Art &amp; logos © CD PROJEKT / R. Talsorian / Cyberpunk TCG</span>
      </footer>
    </div>
    <div id="modal-root"></div>
  `,document.querySelector(`[data-view-home]`)?.addEventListener(`click`,e=>{e.preventDefault(),K.view=`dashboard`,Z()}),document.querySelectorAll(`#nav [data-view]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.view;t===`decks`&&K.view===`decks`&&(K.selectedDeckId=null),K.view=t,Z()}),e.dataset.view===K.view&&e.classList.add(`active`)}),document.querySelector(`#sign-out`)?.addEventListener(`click`,async()=>{await C.auth.signOut(),K.user=null,K.session=null,Rr()}),Q()}function Q(){let e=document.querySelector(`#view`);e&&(K.view===`dashboard`?ui(e):K.view===`checklist`?pi(e):K.view===`decks`?xi(e):K.view===`wanted`?Si(e):K.view===`binder`?mi(e):K.view===`iconics`?di(e):K.view===`value`&&Ci(e),Di())}async function $(e,t){let n={...k(K.ownership,e),...t};K.ownership={...K.ownership,[e]:n},Q();try{await Ve(K.user?.id,e,n)}catch(e){J(e.message)}}async function Vr(e,t,n){await $(e,pt(k(K.ownership,e),t,n))}async function Hr(e,t){K.cards.find(t=>t.id===e)?.has_bstamp&&await $(e,{bstamp_copies:A(t)})}async function Ur(e,t){K.cards.find(t=>t.id===e)?.has_prstamp&&await $(e,{prstamp_copies:A(t)})}async function Wr(e,t,n){K.cards.find(t=>t.id===e)?.has_iconic&&await $(e,ht(k(K.ownership,e),t,n))}async function Gr(e,t,n){K.cards.find(t=>t.id===e)?.has_iconic&&await $(e,mt(k(K.ownership,e),t,n))}async function Kr(e,t){let n=K.cards.find(t=>t.id===e),r=k(K.ownership,e),i=A(t),a=j(r);if(i===a)return;let o=D(K.settings.default_copy_source),s={...r},c=r.bstamp_copies,l=r.prstamp_copies;if(i>a)s=gt(r,r.copies+(i-a),o);else{let e=a-i,t=Math.min(r.copies,e);if(s=gt(r,r.copies-t,o),e-=t,e>0&&n?.has_bstamp){let t=Math.min(c,e);c=Math.max(0,c-t),e-=t}e>0&&n?.has_prstamp&&(l=Math.max(0,l-e))}await $(e,{...s,bstamp_copies:n?.has_bstamp?c:0,prstamp_copies:n?.has_prstamp?l:0})}function qr(e,t,{prefix:n=`copy`}={}){let r=k(t,e.id),i=j(r),a=D(K.settings.default_copy_source),o=Array.from({length:3},(e,t)=>t+1).map(e=>`<button type="button" class="copy-btn ${i>=e?`on`:``}" data-${n}="${e}" title="Set binder playset to ${e} (regular + B + W · adds/removes ${et[a]})">${e}</button>`).join(``),s=!!e.has_bstamp,c=!!e.has_prstamp,l=!e.has_iconic,u=r.copies>=25,d=M(r)>=25,f=`Beta Event Nova Rare B-stamp — stamped promo printing (not the normal Common/Rare). Mantis Blades B lives in Vault; Legend B fills Vault playset after regulars.`,p=`Pre-release WTNC 2026 Nova Rare W-stamp — stamped promo printing (not the normal Common). Same idea as Mantis B. Gorilla Arms W lives in Vault after Mantis B; Legend W fills Vault playset after regulars/B. Use β/PR/R for normal copies.`,m=Qe.map(e=>{let t=ot(e),i=r[t]||0,a=$e[e],o=et[e],s=`${tt[e]} Owned: ${i}. Cap 25 across β+R.`;return`
      <div class="copy-stepper source-stepper source-${e}" title="${s}">
        <span class="copy-stepper-label" title="${s}">${a}</span>
        <button type="button" class="copy-step" data-${n}-source="${e}" data-${n}-source-delta="-1" ${i<=0?`disabled`:``} title="${s}" aria-label="Fewer ${o} copies">−</button>
        <span class="copy-count" title="${s}">${i}</span>
        <button type="button" class="copy-step" data-${n}-source="${e}" data-${n}-source-delta="1" ${u?`disabled`:``} title="${s}" aria-label="More ${o} copies">+</button>
      </div>`}).join(``),h=nt.map(e=>{let t=st(e),i=r[t]||0,a=E[e],o=rt[e],s=`${it[e]} Owned: ${i}. Cap 25 across Aβ+AR.`;return`
      <div class="copy-stepper iconic-stepper source-iconic-${e}" title="${s}">
        <span class="copy-stepper-label" title="${s}">${a}</span>
        <button type="button" class="copy-step" data-${n}-iconic-source="${e}" data-${n}-iconic-source-delta="-1" ${l||i<=0?`disabled`:``} title="${s}" aria-label="Fewer ${o} copies">−</button>
        <span class="copy-count" title="${s}">${i}</span>
        <button type="button" class="copy-step" data-${n}-iconic-source="${e}" data-${n}-iconic-source-delta="1" ${l||d?`disabled`:``} title="${s}" aria-label="More ${o} copies">+</button>
      </div>`}).join(``);return`
    <div class="copy-toggles">
      ${o}
      ${m}
      ${s?`<div class="copy-stepper bstamp-stepper" title="${f}">
        <span class="copy-stepper-label" title="${f}">B</span>
        <button type="button" class="copy-step" data-${n}-bstamp-delta="-1" ${r.bstamp_copies<=0?`disabled`:``} title="${f}" aria-label="Fewer B-stamp copies">−</button>
        <span class="copy-count" title="${f}">${r.bstamp_copies}</span>
        <button type="button" class="copy-step" data-${n}-bstamp-delta="1" ${r.bstamp_copies>=25?`disabled`:``} title="${f}" aria-label="More B-stamp copies">+</button>
      </div>`:``}
      ${c?`<div class="copy-stepper prstamp-stepper" title="${p}">
        <span class="copy-stepper-label" title="${p}">W</span>
        <button type="button" class="copy-step" data-${n}-prstamp-delta="-1" ${(r.prstamp_copies||0)<=0?`disabled`:``} title="${p}" aria-label="Fewer WTNC W-stamp copies">−</button>
        <span class="copy-count" title="${p}">${r.prstamp_copies||0}</span>
        <button type="button" class="copy-step" data-${n}-prstamp-delta="1" ${(r.prstamp_copies||0)>=25?`disabled`:``} title="${p}" aria-label="More WTNC W-stamp copies">+</button>
      </div>`:``}
      ${h}
    </div>
  `}function Jr(e,{prefix:t=`copy`,onChanged:n}={}){e.querySelectorAll(`.copy-btn[data-${t}]`).forEach(e=>{e.addEventListener(`click`,r=>{r.stopPropagation();let i=e.closest(`[data-id]`)?.dataset.id||K.modalCardId;if(!i)return;let a=Number(e.getAttribute(`data-${t}`)||e.dataset[t]);Kr(i,j(k(K.ownership,i))===a?a-1:a),n?.()})}),e.querySelectorAll(`[data-${t}-source-delta]`).forEach(e=>{e.addEventListener(`click`,r=>{r.stopPropagation();let i=e.closest(`[data-id]`)?.dataset.id||K.modalCardId;i&&(Vr(i,e.getAttribute(`data-${t}-source`)||e.dataset[`${t}Source`],Number(e.getAttribute(`data-${t}-source-delta`)||e.dataset[`${t}SourceDelta`])),n?.())})}),e.querySelectorAll(`[data-${t}-bstamp-delta]`).forEach(e=>{e.addEventListener(`click`,r=>{r.stopPropagation();let i=e.closest(`[data-id]`)?.dataset.id||K.modalCardId;if(!i)return;let a=Number(e.getAttribute(`data-${t}-bstamp-delta`)||e.dataset[`${t}BstampDelta`]),o=k(K.ownership,i).bstamp_copies;Hr(i,o+a),n?.()})}),e.querySelectorAll(`[data-${t}-prstamp-delta]`).forEach(e=>{e.addEventListener(`click`,r=>{r.stopPropagation();let i=e.closest(`[data-id]`)?.dataset.id||K.modalCardId;if(!i)return;let a=Number(e.getAttribute(`data-${t}-prstamp-delta`)||e.dataset[`${t}PrstampDelta`]);Number.isFinite(a)&&a!==0&&(Ur(i,(k(K.ownership,i).prstamp_copies||0)+a),n?.())})}),e.querySelectorAll(`[data-${t}-iconic-source-delta]`).forEach(e=>{e.addEventListener(`click`,r=>{r.stopPropagation();let i=e.closest(`[data-id]`)?.dataset.id||K.modalCardId;i&&(Wr(i,e.getAttribute(`data-${t}-iconic-source`)||e.dataset[`${t}IconicSource`],Number(e.getAttribute(`data-${t}-iconic-source-delta`)||e.dataset[`${t}IconicSourceDelta`])),n?.())})})}async function Yr(e){K.cards.find(t=>t.id===e)?.has_iconic&&await Gr(e,`beta`,(k(K.ownership,e).beta_iconic_copies||0)>0?0:1)}async function Xr(e,t){let n={...k(K.ownership,e),price_override_usd:t===``||t==null?null:Number(t)};K.ownership={...K.ownership,[e]:n};try{await Ve(K.user?.id,e,n),J(`Price override saved`)}catch(e){J(e.message)}Q()}var Zr=new Set([`ms01`,`iconics`,`value`,`vault`,`starters`,`betabox`,`boxtoppers`,`artists`]),Qr=new Set([`red`,`yellow`,`green`,`blue`]);function $r(e){let t=new Map(K.cards.map(e=>[e.id,e])),n=0,r=0;for(let i of e)t.has(i)&&(r+=1,j(k(K.ownership,i))>0&&(n+=1));return{owned:n,total:r}}function ei(){return $r(Dr())}function ti(){return $r([...Je,...Ye])}function ni(){return $r(Xe)}function ri(e){if(!e)return null;if(e===`artists`){let e=At(K.cards),t=K.opsArtist;if(t){let e=jt(K.cards,t),n=br(t);return{eyebrow:`Illustrators`,title:t,hint:`${e.length} card${e.length===1?``:`s`} · open profile · tap a card for detail`,preferIconic:!1,cards:e,artistBack:!0,artistLinks:n,artistName:t}}let n=(K.opsArtistQ||``).trim().toLowerCase(),r=n?e.filter(e=>e.name.toLowerCase().includes(n)):e;return{eyebrow:`Illustrators`,title:`${e.length} contributing artists`,hint:`Search · open an artist for their cards + profile links`,preferIconic:!1,cards:[],artists:r,artistTotal:e.length,artistFilter:K.opsArtistQ||``}}let t=K.cards.filter(e=>e.set_code===`MS01`).sort((e,t)=>e.sort_order-t.sort_order);if(e===`ms01`)return{eyebrow:`MS01 base`,title:`${t.filter(e=>j(k(K.ownership,e.id))>0).length} / ${t.length} base cards`,hint:`Tap a card for detail · mark copies & Iconic A in the modal`,preferIconic:!1,cards:t};if(e===`iconics`){let e=zt(K.cards);return{eyebrow:`Iconic alts`,title:`${e.filter(e=>M(k(K.ownership,e.id))>0).length} / ${e.length} Iconics`,hint:`Tap A to mark owned · card opens detail · full gallery also under Iconics`,preferIconic:!0,cards:e}}if(e===`value`){let{lines:e}=Ft(K.cards,K.ownership,K.prices,K.settings);return{eyebrow:`Market value`,title:`${e.length} valued lines`,hint:`Owned copies and Iconic A that contribute to eddies`,preferIconic:!1,cards:e.map(e=>e.card),values:Object.fromEntries(e.map(e=>[e.card.id,e.value]))}}if(e===`vault`){let e=t.filter(e=>e.type===`Legend`),n=t.filter(e=>e.type!==`Legend`&&e.has_iconic);return{eyebrow:`Vault`,title:`${e.filter(e=>j(k(K.ownership,e.id))>0).length} / ${e.length} Legends · ${n.filter(e=>M(k(K.ownership,e.id))>0).length} / ${n.length} street A`,hint:`Legends playset ×3 + A · all other MS01 Iconic alts in Vault`,preferIconic:!1,cards:[...e,...n]}}if(e===`starters`){let e=Or(K.cards),t=ei(),n=[];for(let t of e){let e=t.entries.filter(e=>e.role===`legend`),r=t.entries.filter(e=>e.role===`main`),i=t.entries.filter(e=>j(k(K.ownership,e.card.id))>0).length;n.push({title:`${t.name} · Legends`,subtitle:`${t.subtitle} · ${i} / ${t.entries.length} unique owned`,cards:e.map(e=>e.card),qtys:Object.fromEntries(e.map(e=>[e.card.id,e.qty]))}),n.push({title:`${t.name} · Main deck (40)`,subtitle:`Qty is copies in the sealed starter · ownership is still your collection`,cards:r.map(e=>e.card),qtys:Object.fromEntries(r.map(e=>[e.card.id,e.qty]))})}return{eyebrow:`Kickstarter / retail starters`,title:`${t.owned} / ${t.total} unique cards · ${Er.length} decks`,hint:`The Heist + Embracing Power · exclusives are SD01/SD02 (Minotaur showcase) · shared cards are MS01`,preferIconic:!1,cards:[],sections:n}}if(e===`betabox`){let e=Ze(K.cards,Je),t=Ze(K.cards,Ye),n=e.filter(e=>j(k(K.ownership,e.id))>0).length,r=t.filter(e=>j(k(K.ownership,e.id))>0).length,i=ti();return{eyebrow:`Kickstarter Beta Box`,title:`${i.owned} / ${i.total} card identities`,hint:`Guaranteed stretch-goal Legends + KS promos · each box also includes 1 random Beta booster (not listed) and a playmat`,preferIconic:!1,cards:[],sections:[{title:`Guaranteed Legends`,subtitle:`${n} / ${e.length} owned · final stretch goals put every MS01 Legend in the Beta Box`,cards:e},{title:`Kickstarter promos`,subtitle:`${r} / ${t.length} owned · Lucy / Rebecca / Minotaur shipped with KS fulfillment (Wave 2 / toppers)`,cards:t}]}}if(e===`boxtoppers`){let e=Ze(K.cards,Xe),t=ni();return{eyebrow:`Beta Booster Display`,title:`${t.owned} / ${t.total} topper identities`,hint:`One random alt-art Legend per Kickstarter Beta Booster Display · same card identities as starter exclusives`,preferIconic:!1,cards:[],sections:[{title:`Box topper pool (6)`,subtitle:`Yorinobu · Viktor · Goro Hands · Saburo · Jackie Pour · V Corporate Exile`,cards:e}]}}if(Qr.has(e)){let n=t.filter(t=>t.band===e),r=e.charAt(0).toUpperCase()+e.slice(1),i=n.filter(e=>j(k(K.ownership,e.id))>0).length;return{eyebrow:`${r} band`,title:`${i} / ${n.length} cards`,hint:`Base owned (≥1 copy) · tap card for detail`,preferIconic:!1,cards:n}}return null}function ii(e){if(!e?.cards?.length)return`<p class="hint">No cards in this section.</p>`;let t=e.qtys||null;return`
    <div class="iconic-grid ops-reveal-grid">
      ${e.cards.map(n=>{let r=k(K.ownership,n.id),i=!!(e.preferIconic&&n.has_iconic),a=i?M(r)>0:j(r)>0,o=(i&&R(n.id,{iconic:!0})||R(n.id,{iconic:!1}))?.url||``,s=n.band||``,c=e.values&&e.values[n.id]!=null?` · ${X(e.values[n.id])}`:``,l=i?``:` · ${Ot(r)}`,u=t?.[n.id],d=u==null?``:` · ×${u} in deck`,f=i?`${Y(n.rarity)} · ${Y(s)}`:`${Y(n.type)} · ${Y(n.rarity)}${l===` · —`?``:l}${c}${d}`,p=n.id.startsWith(`SD0`)||n.id.startsWith(`NIGHTCITYBRAWL`)?`exclusive`:``;return`
            <article class="iconic-tile ${a?`owned`:`missing`} band-${s} ${p}" data-card-id="${n.id}">
              <button type="button" class="iconic-tile-art" data-open="${n.id}" title="${Y(n.name)}">
                ${o?`<img src="${o}" alt="${Y(n.name)}${i?` (Iconic)`:``}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`:`<span class="iconic-tile-ph">No art</span>`}
                ${i?`<span class="iconic-tile-badge">IO</span>`:``}
                ${u==null?``:`<span class="iconic-tile-qty" title="${u} copies in starter">×${u}</span>`}
              </button>
              <div class="iconic-tile-meta">
                <span class="iconic-tile-num">${Y(n.number)}${n.id.startsWith(`SD0`)?` · excl`:``}</span>
                <span class="iconic-tile-name">${Y(n.name)}</span>
                <span class="iconic-tile-sub">${f}</span>
                ${n.has_iconic?`<button type="button" class="iconic-btn ${M(r)>0?`on`:``}" data-toggle-a="${n.id}" title="Toggle Beta Iconic Aβ (0↔1; use card detail for AR / more copies)">Aβ</button>`:``}
              </div>
            </article>`}).join(``)}
    </div>`}function ai(e){return e?.length?e.map(e=>`
    <div class="ops-section">
      <div class="ops-section-head">
        <h3>${Y(e.title)}</h3>
        ${e.subtitle?`<p class="muted">${Y(e.subtitle)}</p>`:``}
      </div>
      ${ii(e)}
    </div>`).join(``):`<p class="hint">No cards in this section.</p>`}function oi(e){return e?.length?`
    <div class="artist-profile-links">
      ${e.map(e=>`
        <a class="artist-profile-link" href="${Y(e.url)}" target="_blank" rel="noopener noreferrer">${Y(e.label)}</a>`).join(``)}
    </div>`:``}function si(e,{filter:t=``,total:n=0}={}){return`
    <div class="artist-explore">
      <label class="artist-search">
        <span class="sr-only">Search artists</span>
        <input type="search" id="ops-artist-q" placeholder="Search illustrators…" value="${Y(t)}" autocomplete="off" />
      </label>
      ${e?.length?`<p class="hint artist-explore-count">${e.length}${n&&e.length!==n?` / ${n}`:``} shown</p>
    <div class="artist-list">
      ${e.map(e=>{let t=vr(e.name);return`
        <button type="button" class="artist-row" data-ops-artist="${Y(e.name)}">
          <span class="artist-row-main">
            <span class="artist-name">${Y(e.name)}</span>
            ${t?`<span class="artist-profile-badge" title="Curated profile links">profile</span>`:``}
          </span>
          <span class="artist-count">${e.count} card${e.count===1?``:`s`}</span>
        </button>`}).join(``)}
    </div>`:`<p class="hint">${t.trim()?`No artists match that search.`:`No illustrator credits loaded yet.`}</p>`}
    </div>`}function ci(e){let t=ri(e);if(!t)return``;let n=t.artists?si(t.artists,{filter:t.artistFilter||``,total:t.artistTotal||t.artists.length}):`${t.artistLinks?oi(t.artistLinks):``}${t.sections?.length?ai(t.sections):ii(t)}`,r=t.artistBack?`All artists`:`Close`;return`
    <section class="panel ops-reveal" id="ops-reveal" data-ops-key="${Y(e)}">
      <header class="panel-head">
        <div>
          <p class="eyebrow">${Y(t.eyebrow)}</p>
          <h2>${Y(t.title)}</h2>
          <p class="muted">${Y(t.hint)}</p>
        </div>
        <button type="button" class="btn ghost no-print" data-ops-close>${r}</button>
      </header>
      ${n}
    </section>`}function li(e){let t=t=>{let n=t.target.closest(`[data-ops-artist]`);if(n&&e.contains(n)){K.opsReveal=`artists`,K.opsArtist=n.dataset.opsArtist||null,Q(),requestAnimationFrame(()=>{document.querySelector(`#ops-reveal`)?.scrollIntoView({behavior:`smooth`,block:`start`})});return}let r=t.target.closest(`[data-ops-close]`);if(r&&e.contains(r)){if(K.opsReveal===`artists`&&K.opsArtist){K.opsArtist=null,Q(),requestAnimationFrame(()=>{document.querySelector(`#ops-reveal`)?.scrollIntoView({behavior:`smooth`,block:`start`})});return}K.opsReveal=null,K.opsArtist=null,Q();return}let i=t.target.closest(`[data-open]`);if(i&&e.contains(i)){let e=!!(K.opsReveal===`iconics`||ri(K.opsReveal)?.preferIconic&&K.cards.find(e=>e.id===i.dataset.open)?.has_iconic);q(i.dataset.open,{preferIconic:e});return}let a=t.target.closest(`[data-toggle-a]`);if(a&&e.contains(a)){t.preventDefault(),Yr(a.dataset.toggleA);return}let o=t.target.closest(`[data-ops-reveal]`);if(!o||!e.contains(o))return;let s=o.dataset.opsReveal;s&&(K.opsReveal=K.opsReveal===s?null:s,K.opsArtist=null,Q(),K.opsReveal&&requestAnimationFrame(()=>{document.querySelector(`#ops-reveal`)?.scrollIntoView({behavior:`smooth`,block:`start`})}))},n=e.querySelector(`#ops-artist-q`);n&&n.addEventListener(`input`,()=>{K.opsArtistQ=n.value||``,Q(),requestAnimationFrame(()=>{let e=document.querySelector(`#ops-artist-q`);if(e){e.focus();let t=e.value.length;e.setSelectionRange(t,t)}})}),e._opsRevealClick&&e.removeEventListener(`click`,e._opsRevealClick),e._opsRevealClick=t,e.addEventListener(`click`,t)}function ui(e){let t=Mt(K.cards,K.ownership,K.settings),n=Nt(K.cards,K.ownership),r=Rt(K.cards,K.ownership),i=Bt(K.cards,K.ownership),a=Ft(K.cards,K.ownership,K.prices,K.settings),o=It(K.cards,K.ownership),s=t.ms01Total?Math.round(t.ms01Owned/t.ms01Total*100):0,c=t.iconicTotal?Math.round(t.iconicOwned/t.iconicTotal*100):0,l=Object.keys(K.prices).length,u=ei(),d=u.total?Math.round(u.owned/u.total*100):0,f=ti(),p=f.total?Math.round(f.owned/f.total*100):0,m=ni(),h=m.total?Math.round(m.owned/m.total*100):0,g=K.opsReveal,_=Zr.has(g)?g:null,v=Qr.has(g)?g:null;e.innerHTML=`
    <section class="hero-strip">
      <div class="hero-media" aria-hidden="true">
        <img src="${w(`brand/banner.webp`)}" alt="" class="hero-banner" />
        <div class="hero-fade"></div>
      </div>
      <div class="hero-copy">
        <img class="hero-set-logo" src="${w(`brand/logo-wtnc.webp`)}" alt="Welcome to Night City" width="340" height="72" />
        <p class="eyebrow">Collector ops · Beta set MS01</p>
        <h1>Build the binder. Own the street.</h1>
        <p>Vault holds Legends plus stamped Nova Rares (Mantis B, Gorilla Arms W) · Street holds normal MS01 Units / Gear / Programs. Use β/PR/R for normal copies; B/W for stamped Nova promos.</p>
      </div>
      <div class="hero-product no-print" aria-hidden="true">
        <img src="${w(`brand/box.webp`)}" alt="" class="hero-box" />
        <img src="${w(`brand/booster.webp`)}" alt="" class="hero-booster" />
      </div>
    </section>

    <section class="cast-rail no-print" aria-label="Night City cast">
      ${[[`wall-jackie.webp`,`Jackie`],[`wall-lucy.webp`,`Lucy`],[`wall-smasher.webp`,`Adam Smasher`],[`wall-hanako.webp`,`Hanako`],[`wall-dumdum.webp`,`Dum Dum`]].map(([e,t])=>`
        <figure class="cast-card">
          <img src="${w(`brand/${e}`)}" alt="${t}" loading="lazy" />
          <figcaption>${t}</figcaption>
        </figure>`).join(``)}
    </section>

    <section class="dash-grid">
      <div class="stat-card" title="All owned pieces across regular, B/W stamps, and Iconic A">
        <h3>Total cards</h3>
        <div class="value">${n.copies}</div>
        <div class="sub">${n.uniqueOwned} / ${n.uniqueTotal} unique owned</div>
      </div>
      <button type="button" class="stat-card stat-card-link ${g===`ms01`?`open`:``}" data-ops-reveal="ms01" aria-expanded="${g===`ms01`}" title="Reveal MS01 cards">
        <h3>MS01 base</h3>
        <div class="value">${t.ms01Owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${t.ms01Total}</span></div>
        <div class="sub">${s}% · tap to reveal</div>
        <div class="progress-track"><div class="progress-fill" style="width:${s}%"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`iconics`?`open`:``}" data-ops-reveal="iconics" aria-expanded="${g===`iconics`}" title="Reveal Iconic alts">
        <h3>Iconic alts</h3>
        <div class="value">${t.iconicOwned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${t.iconicTotal}</span></div>
        <div class="sub">${c}% · tap to reveal · ${t.setTotal} set</div>
        <div class="progress-track"><div class="progress-fill" style="width:${c}%;background:var(--cp-danger)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`value`?`open`:``}" data-ops-reveal="value" aria-expanded="${g===`value`}" title="Reveal valued cards">
        <h3>Market value</h3>
        <div class="value">${X(a.total)}</div>
        <div class="sub">${a.priced} lines · ${l} priced · tap to reveal</div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`vault`?`open`:``}" data-ops-reveal="vault" aria-expanded="${g===`vault`}" title="Reveal Vault pockets">
        <h3>Vault</h3>
        <div class="value">${i.vaultFilled}<span style="font-size:1rem;color:var(--cp-muted)"> / ${i.vaultPockets}</span></div>
        <div class="sub">${i.vaultPct}% · Legends + all Iconic A · ${i.vaultCapacity} cap</div>
        <div class="progress-track"><div class="progress-fill" style="width:${i.vaultPct}%;background:var(--tree-blue)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`starters`?`open`:``}" data-ops-reveal="starters" aria-expanded="${g===`starters`}" title="Reveal Kickstarter starter deck lists">
        <h3>Starter decks</h3>
        <div class="value">${u.owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${u.total}</span></div>
        <div class="sub">${d}% · Heist + Embracing Power · tap to reveal</div>
        <div class="progress-track"><div class="progress-fill" style="width:${d}%;background:var(--tree-green)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`betabox`?`open`:``}" data-ops-reveal="betabox" aria-expanded="${g===`betabox`}" title="Reveal Kickstarter Beta Box card contents">
        <h3>Beta Box</h3>
        <div class="value">${f.owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${f.total}</span></div>
        <div class="sub">${p}% · Legends + KS promos · tap to reveal</div>
        <div class="progress-track"><div class="progress-fill" style="width:${p}%;background:var(--tree-yellow)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`boxtoppers`?`open`:``}" data-ops-reveal="boxtoppers" aria-expanded="${g===`boxtoppers`}" title="Reveal Beta Booster Display box topper pool">
        <h3>Box toppers</h3>
        <div class="value">${m.owned}<span style="font-size:1rem;color:var(--cp-muted)"> / ${m.total}</span></div>
        <div class="sub">${h}% · display alt-art Legends · tap to reveal</div>
        <div class="progress-track"><div class="progress-fill" style="width:${h}%;background:var(--cp-cyan)"></div></div>
      </button>
      <button type="button" class="stat-card stat-card-link ${g===`artists`?`open`:``}" data-ops-reveal="artists" aria-expanded="${g===`artists`}" title="Browse illustrators and profiles">
        <h3>Artists</h3>
        <div class="value">${At(K.cards).length}</div>
        <div class="sub">illustrators · cards + profiles</div>
      </button>
    </section>
    ${_?ci(_):``}

    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Colour tree</p>
          <h2>Completeness by band</h2>
          <p class="muted">Tap a band to reveal its cards · base owned (≥1) · Iconic A per colour</p>
        </div>
      </header>
      <div class="band-breakdown">
        ${r.map(e=>`
          <button type="button" class="band-stat band-stat-link band-${e.id} ${g===e.id?`open`:``}" data-ops-reveal="${e.id}" aria-expanded="${g===e.id}" title="Reveal ${e.label} band">
            <div class="band-stat-head">
              <span class="band-stat-name">${e.label}</span>
              <span class="band-stat-range">${e.range}</span>
            </div>
            <div class="band-stat-counts">
              <strong>${e.owned}</strong><span> / ${e.total}</span>
              <em>${e.pct}%</em>
            </div>
            <div class="progress-track"><div class="progress-fill band-fill" style="width:${e.pct}%"></div></div>
            <div class="band-stat-iconic">
              Iconic A <strong>${e.iconicOwned}</strong> / ${e.iconicTotal}
              <span class="muted">(${e.iconicPct}%)</span>
            </div>
          </button>`).join(``)}
      </div>
      ${v?ci(v):``}
    </section>

    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Next empty slot</p>
          <h2>${o?Y(o.name):`Binder locked — complete`}</h2>
          <p class="muted">${o?`${o.number} · ${P(o)} · ${o.type}`:`All MS01 slots owned at least once. Preem work, choom.`}</p>
        </div>
        ${o?`<div class="no-print" style="display:flex;gap:0.45rem;flex-wrap:wrap">
                <button type="button" class="btn primary" id="goto-next">Open checklist</button>
                <button type="button" class="btn" id="goto-binder">Show binder</button>
              </div>`:``}
      </header>
      <div class="settings-row no-print">
        <label>
          Completion mode
          <select id="completion-mode">
            <option value="ms01" ${K.settings.completion_mode===`ms01`?`selected`:``}>MS01 only (${t.ms01Total})</option>
            <option value="everything_beta" ${K.settings.completion_mode===`everything_beta`?`selected`:``}>Everything Beta</option>
          </select>
        </label>
        <label>
          Default source (1 / 2 / 3)
          <select id="default-copy-source">
            ${Qe.map(e=>`<option value="${e}" ${D(K.settings.default_copy_source)===e?`selected`:``}>${et[e]}</option>`).join(``)}
          </select>
        </label>
        <label>
          Value currency
          <select id="display-currency">
            ${Ht.map(e=>`<option value="${e}" ${N(K.settings.display_currency)===e?`selected`:``}>${e}</option>`).join(``)}
          </select>
        </label>
        <label>
          <input type="checkbox" id="count-copies" ${K.settings.value_count_copies?`checked`:``} />
          Value counts all copies
        </label>
      </div>
      ${K.settings.completion_mode===`everything_beta`?`<p class="hint">Everything Beta includes showcase promos, Nova toppers, and starter-deck exclusives. Stamped Nova Rares: Mantis B and Gorilla Arms W on their MS01 cards (Vault). Rebecca / Minotaur are separate showcase cards.</p>`:`<p class="hint">Colour tree bands: <span style="color:var(--tree-red)">Red 001–035</span> · <span style="color:var(--tree-yellow)">Yellow 036–070</span> · <span style="color:var(--tree-green)">Green 071–105</span> · <span style="color:var(--tree-blue)">Blue 106–140</span>. Inside each: Legends → Units → Gear → Programs.</p>`}
    </section>
  `,li(e),document.querySelector(`#goto-next`)?.addEventListener(`click`,()=>{K.view=`checklist`,K.filter.q=o?.number||``,Z()}),document.querySelector(`#goto-binder`)?.addEventListener(`click`,()=>{if(!o)return;K.view=`binder`;let e=Vt(o);if(K.binderMode=e,e===`vault`&&o.set_code===`showcase`)K.binderPage=ir(K.cards,o.id);else if(e===`vault`&&o.type===`Legend`){let e=Gn(K.cards).findIndex(e=>e.id===o.id);K.binderPage=Math.max(0,e)+1}else K.binderPage=Jn(K.cards,o.id).page;Z()}),document.querySelector(`#completion-mode`)?.addEventListener(`change`,async e=>{K.settings=await Ue(K.user?.id,{...K.settings,completion_mode:e.target.value}),Q()}),document.querySelector(`#count-copies`)?.addEventListener(`change`,async e=>{K.settings=await Ue(K.user?.id,{...K.settings,value_count_copies:e.target.checked}),Q()}),document.querySelector(`#default-copy-source`)?.addEventListener(`change`,async e=>{K.settings=await Ue(K.user?.id,{...K.settings,default_copy_source:D(e.target.value)}),Q()}),document.querySelector(`#display-currency`)?.addEventListener(`change`,async e=>{await zr(e.target.value)})}function di(e){let t=Mt(K.cards,K.ownership,K.settings),n=zt(K.cards),r=K.iconicFilter||`all`,i=n.filter(e=>{let t=M(k(K.ownership,e.id))>0;return r===`owned`?t:r!==`missing`||!t}),a=t.iconicTotal?Math.round(t.iconicOwned/t.iconicTotal*100):0;e.innerHTML=`
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Iconic alt arts · MS01</p>
          <h2>${t.iconicOwned} / ${t.iconicTotal} Iconics</h2>
          <p class="muted">${a}% complete · ${i.length} shown · tap A for 0↔1 · open card to set A copy count</p>
        </div>
        <div class="progress-track iconic-head-track">
          <div class="progress-fill" style="width:${a}%;background:var(--cp-danger)"></div>
        </div>
      </header>
      <div class="toolbar no-print">
        <div class="seg" role="group" aria-label="Iconic filter">
          ${[`all`,`owned`,`missing`].map(e=>`<button type="button" class="seg-btn ${r===e?`on`:``}" data-iconic-filter="${e}">${e===`all`?`All`:e===`owned`?`Owned`:`Missing`}</button>`).join(``)}
        </div>
      </div>
      <div class="iconic-grid">
        ${i.map(e=>{let t=k(K.ownership,e.id),n=M(t)>0,r=(R(e.id,{iconic:!0})||R(e.id,{iconic:!1}))?.url||``,i=e.band||``;return`
              <article class="iconic-tile ${n?`owned`:`missing`} band-${i}" data-card-id="${e.id}">
                <button type="button" class="iconic-tile-art" data-open="${e.id}" title="${Y(e.name)}">
                  ${r?`<img src="${r}" alt="${Y(e.name)} (Iconic)" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`:`<span class="iconic-tile-ph">No art</span>`}
                  <span class="iconic-tile-badge">IO</span>
                </button>
                <div class="iconic-tile-meta">
                  <span class="iconic-tile-num">${Y(e.number)}</span>
                  <span class="iconic-tile-name">${Y(e.name)}</span>
                  <span class="iconic-tile-sub">${Y(e.rarity)} · ${Y(i)}${t.iconic_copies>1?` · ×${t.iconic_copies}A`:``}</span>
                  <button type="button" class="iconic-btn ${n?`on`:``}" data-toggle-a="${e.id}" title="Toggle Beta Iconic Aβ (0↔1; use card detail for AR / more copies)">Aβ</button>
                </div>
              </article>`}).join(``)}
      </div>
      ${i.length===0?`<p class="hint">No Iconics in this filter.</p>`:``}
    </section>
  `,e.querySelectorAll(`[data-iconic-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{K.iconicFilter=e.dataset.iconicFilter,Q()})}),e.querySelectorAll(`[data-open]`).forEach(e=>{e.addEventListener(`click`,()=>{q(e.dataset.open,{preferIconic:!0})})}),e.querySelectorAll(`[data-toggle-a]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),Yr(e.dataset.toggleA)})})}function fi(){let{q:e,type:t,set:n,missing:r,underPlayset:i,underSix:a}=K.filter,o=e.trim().toLowerCase();return K.cards.filter(e=>{if(n===`MS01`&&e.set_code!==`MS01`||n===`showcase`&&e.set_code!==`showcase`||t!==`all`&&e.type!==t)return!1;let s=j(k(K.ownership,e.id));return r&&s>0||i&&s>=3||a&&s>=6?!1:!o||e.name.toLowerCase().includes(o)||e.number.toLowerCase().includes(o)||e.id.toLowerCase().includes(o)||e.artist&&e.artist.toLowerCase().includes(o)||P(e).toLowerCase().includes(o)})}function pi(e){let t=fi(),n=null,r=null,i=[];for(let e of t){e.set_code===`showcase`&&r!==`showcase`?(i.push(`<div class="band-header showcase">Showcase extras · Kickstarter / promo / starter (not MS01)</div>`),r=`showcase`,n=null):e.set_code===`MS01`&&e.band&&e.band!==n&&(i.push(`<div class="band-header ${e.band}">${{red:`Red band · 001–035`,yellow:`Yellow band · 036–070`,green:`Green band · 071–105`,blue:`Blue band · 106–140`}[e.band]}</div>`),n=e.band,r=`MS01`);let t=k(K.ownership,e.id),a=j(t)>=3,o=K.prices[e.id]||{},s=t.price_override_usd==null?o.base:t.price_override_usd,c=Vt(e);i.push(`
      <div class="card-row ${a?`complete`:``}" data-id="${e.id}">
        ${qr(e,K.ownership,{prefix:`copy`})}
        <div class="card-id">${Y(e.number)}</div>
        <div class="card-main">
          <div class="name">${Y(e.name)}<span class="home-tag ${c}">${c}</span>${e.notes?` <span class="notes-flag" title="`+Y(e.notes)+`">*</span>`:``}</div>
          <div class="meta">${e.type} · ${e.rarity}${e.eurodollars==null?``:` · E$${e.eurodollars}`}${e.artist?` · ${Y(e.artist)}`:``}</div>
        </div>
        <div class="card-side">
          <span class="price">${s==null?`—`:X(s)}</span>
          <span>${c===`vault`&&e.type===`Legend`?`Vault playset`:P(e)}</span>
        </div>
      </div>
    `)}e.innerHTML=`
    <section class="panel checklist-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Collector order · colour tree</p>
          <h2>Set checklist</h2>
          <p class="muted print-only">CYBERPUNK TCG — Welcome to Night City (Beta) · MS01 checklist · 1–3 binder · regular + B up to 25 each · A = Iconic</p>
        </div>
        <div class="no-print" style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <button type="button" class="btn primary" id="print-btn">Print checklist</button>
        </div>
      </header>

      <div class="toolbar no-print">
        <input type="search" id="filter-q" placeholder="Search name, number, slot…" value="${Y(K.filter.q)}" />
        <select id="filter-type">
          <option value="all">All types</option>
          ${[`Legend`,`Unit`,`Gear`,`Program`].map(e=>`<option value="${e}" ${K.filter.type===e?`selected`:``}>${e}</option>`).join(``)}
        </select>
        <select id="filter-set">
          <option value="MS01" ${K.filter.set===`MS01`?`selected`:``}>MS01 set</option>
          <option value="showcase" ${K.filter.set===`showcase`?`selected`:``}>Showcase extras</option>
          <option value="all" ${K.filter.set===`all`?`selected`:``}>All cards</option>
        </select>
        <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.85rem;color:var(--muted)">
          <input type="checkbox" id="filter-missing" ${K.filter.missing?`checked`:``} />
          Missing only
        </label>
        <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.85rem;color:var(--muted)" title="Regular + B/W stamps under binder playset of 3">
          <input type="checkbox" id="filter-under-playset" ${K.filter.underPlayset?`checked`:``} />
          Under playset (&lt;3)
        </label>
        <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.85rem;color:var(--muted)" title="Regular + B/W stamps under 6 copies">
          <input type="checkbox" id="filter-under-six" ${K.filter.underSix?`checked`:``} />
          Under 6
        </label>
      </div>

      <div class="checklist-body">${i.join(``)||`<p class="muted">No cards match.</p>`}</div>
    </section>
  `;let a=()=>{K.filter.q=document.querySelector(`#filter-q`)?.value||``,K.filter.type=document.querySelector(`#filter-type`)?.value||`all`,K.filter.set=document.querySelector(`#filter-set`)?.value||`MS01`,K.filter.missing=!!document.querySelector(`#filter-missing`)?.checked,K.filter.underPlayset=!!document.querySelector(`#filter-under-playset`)?.checked,K.filter.underSix=!!document.querySelector(`#filter-under-six`)?.checked,pi(e)};document.querySelector(`#filter-q`)?.addEventListener(`input`,()=>{K.filter.q=document.querySelector(`#filter-q`).value,pi(e);let t=document.querySelector(`#filter-q`);t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))}),document.querySelector(`#filter-type`)?.addEventListener(`change`,a),document.querySelector(`#filter-set`)?.addEventListener(`change`,a),document.querySelector(`#filter-missing`)?.addEventListener(`change`,a),document.querySelector(`#filter-under-playset`)?.addEventListener(`change`,a),document.querySelector(`#filter-under-six`)?.addEventListener(`change`,a),document.querySelector(`#print-btn`)?.addEventListener(`click`,()=>window.print()),Jr(e,{prefix:`copy`}),e.querySelectorAll(`.card-row .card-main`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`[data-id]`)?.dataset.id;t&&q(t,{preferIconic:!1})})})}function mi(e){mr(e,K,{setMode:e=>{K.binderMode=e===`vault`?`vault`:`street`;let t=K.binderMode===`vault`?36:96;K.binderPage=K.binderMode===`vault`?Math.min(Math.max(1,K.binderPage||1),t):Math.min(t,Math.max(1,K.binderPage||1)),Q()},setPage:e=>{K.binderPage=e,Q()},openCard:(e,t={})=>q(e,t)})}function hi(e){return Fn(e,K.settings.display_currency,K.fx?.rate||1.55)}function gi(e){return e?.length?`<ul class="wanted-offers">${e.map(e=>{let t=I[e.seller_id]?.name||e.seller_id,n=e.available?`in stock`:`sold out`;return`<li class="${e.available?`wanted-offer`:`wanted-offer sold`}">
        <a href="${Y(e.url)}" target="_blank" rel="noopener" title="${Y(e.title)}">${Y(t)}</a>
        <span class="wanted-price">${hi(e)}</span>
        <span class="muted">${n}</span>
      </li>`}).join(``)}</ul>`:`<span class="muted wanted-none">No AU listing</span>`}async function _i(){if(!K.stockRefreshing){K.stockRefreshing=!0,Q(),J(`Refreshing AU singles stock…`);try{let{stock:e,error:t,warning:n}=await Mn(K.cards);if(K.sellerStock=e,t)J(t);else{let t=e.listings.filter(e=>e.available).length;J(n?`Stock updated · ${t} in stock · ${n}`:`Stock updated · ${t} in-stock listings`)}}catch(e){J(e.message||String(e))}finally{K.stockRefreshing=!1,Q()}}}function vi(e){let t=1;return e?.underPlayset&&(t=Math.max(t,3)),e?.underSix&&(t=Math.max(t,6)),t}function yi(e,t){let n=[...new Set((t||[]).map(e=>e.id).filter(Boolean))];K.wantedFocusIds=n.length?n:null,K.wantedFocusLabel=e?`${e.rank}. ${e.name} · ${n.length} card${n.length===1?``:`s`} short`:null,K.wantedFilter={...K.wantedFilter,q:``,edition:`all`,underPlayset:!0,underSix:!1,inStockOnly:!1},K.view=`wanted`,Z()}function bi(){K.wantedFocusIds=null,K.wantedFocusLabel=null,Q()}function xi(e){let t=Pr(K.cards),n=K.selectedDeckId?t.find(e=>e.id===K.selectedDeckId):null;if(n){let t=_t(K.ownership,n.entries),r=Fr(n.entries),i=n.listStatus===`full`?`Published full list`:`Core shell · staples + Legends (not a full invented 40)`,a=n.share?`${Math.round(n.share*1e3)/10}% share`:`share n/a`,o=(n.colors||[]).map(e=>`<span class="deck-color band-${Y(e)}">${Y(e)}</span>`).join(``),s=(e,t)=>{let n=e.card,r=t?.short||0,i=t?.owned||0,a=e.qty,o=r<=0,s=n.band||`neutral`,c=Hn(n.id),l=c.base||c.iconic||``;return`
        <article class="iconic-tile ${o?`owned`:`missing`} band-${s}" data-card-id="${n.id}">
          <button type="button" class="iconic-tile-art" data-open="${n.id}" title="${Y(n.name)}">
            ${l?`<img src="${Y(l)}" alt="" loading="lazy" />`:`<span class="iconic-tile-ph">No art</span>`}
            <span class="iconic-tile-qty" title="Need ${a} · own ${i}">${i}/${a}</span>
          </button>
          <div class="iconic-tile-meta">
            <span class="iconic-tile-num">${Y(n.number)}</span>
            <span class="iconic-tile-name">${Y(n.name)}</span>
            <span class="iconic-tile-sub">${Y(n.type)} · ${r>0?`need ${r} more`:`complete`}</span>
          </div>
        </article>`},c=Object.fromEntries(t.lines.map(e=>[e.id,e])),l=(e,t)=>t.length?`
        <div class="ops-section">
          <div class="ops-section-head">
            <h3>${Y(e)}</h3>
            <p class="muted">${t.length} card${t.length===1?``:`s`}</p>
          </div>
          <div class="iconic-grid ops-reveal-grid">
            ${t.map(e=>s(e,c[e.id])).join(``)}
          </div>
        </div>`:``;e.innerHTML=`
      <section class="panel decks-panel">
        <header class="panel-head">
          <div>
            <p class="eyebrow">Decks · #${n.rank} · Tier ${n.tier} · score ${n.score} · ${Y(a)}</p>
            <h2>${Y(n.name)}</h2>
            <p class="muted">${Y(n.archetype)} · ${Y(i)} · owned ${t.owned}/${t.required} (${t.pct}%)</p>
            <div class="deck-colors">${o}</div>
          </div>
          <div class="panel-head-actions no-print">
            <button type="button" class="btn ghost" id="decks-back">All decks</button>
            ${t.missing.length?`<button type="button" class="btn primary" id="deck-wanted">Find ${t.missing.length} gap${t.missing.length===1?``:`s`} in Wanted</button>`:`<button type="button" class="btn" disabled>List complete</button>`}
          </div>
        </header>
        <p class="deck-plan">${Y(n.plan)}</p>
        <p class="deck-why">${Y(n.why)}</p>
        <p class="hint no-print">Sources: ${(n.sources||[]).map(e=>`<a href="${Y(e.url)}" target="_blank" rel="noopener">${Y(e.label)}</a> (${Y(e.asOf)})`).join(` · `)}. Tap a card for ownership.</p>
        <div class="deck-progress">
          <div class="progress-track"><div class="progress-fill" style="width:${t.pct}%"></div></div>
          <span class="muted">${t.uniqueComplete}/${t.unique} unique lines filled · ${t.missing.reduce((e,t)=>e+t.short,0)} copies short</span>
        </div>
        ${l(`Legends`,r.legends)}
        ${r.mainByType.map(e=>l(`Main · ${e.type}`,e.entries)).join(``)}
        ${r.side.length?l(`Sideboard`,r.side):``}
      </section>
    `,document.querySelector(`#decks-back`)?.addEventListener(`click`,()=>{K.selectedDeckId=null,Q()}),document.querySelector(`#deck-wanted`)?.addEventListener(`click`,()=>{yi(n,t.missing)}),e.querySelectorAll(`[data-open]`).forEach(e=>{e.addEventListener(`click`,()=>q(e.dataset.open))});return}let r=t.slice().sort((e,t)=>e.rank-t.rank).map(e=>{let t=_t(K.ownership,e.entries),n=e.entries.filter(e=>e.role===`legend`).map(e=>e.card?.name||e.id).join(` · `),r=e.listStatus===`full`?`Full list`:`Core shell`,i=e.share?`${Math.round(e.share*1e3)/10}%`:`—`;return`
        <button type="button" class="deck-row" data-deck-id="${Y(e.id)}">
          <span class="deck-rank">#${e.rank}</span>
          <span class="deck-tier tier-${e.tier}">T${e.tier}</span>
          <span class="deck-main">
            <strong>${Y(e.name)}</strong>
            <span class="muted">${Y(e.archetype)} · ${Y(r)} · score ${e.score} · ${Y(i)} share</span>
            <span class="deck-plan-line">${Y(e.plan)}</span>
            <span class="deck-legends muted">${Y(n)}</span>
          </span>
          <span class="deck-pct">
            <span class="deck-pct-num">${t.pct}%</span>
            <span class="muted">${t.owned}/${t.required}</span>
            <span class="progress-track"><span class="progress-fill" style="width:${t.pct}%"></span></span>
          </span>
        </button>`}).join(``);e.innerHTML=`
    <section class="panel decks-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Decks · Standard top 10 · snapshot ${Y(Nr.asOf)}</p>
          <h2>Prebuilt gallery</h2>
          <p class="muted">${Mr.length} Contender-ranked shells · gallery only (no custom builder)</p>
        </div>
      </header>
      <p class="hint deck-caveat">${Y(Nr.caveat)}</p>
      <p class="hint muted">${Y(Nr.popularNote)}</p>
      <div class="deck-list ops-reveal">
        ${r}
      </div>
    </section>
  `,e.querySelectorAll(`[data-deck-id]`).forEach(e=>{e.addEventListener(`click`,()=>{K.selectedDeckId=e.dataset.deckId,Q()})})}function Si(e){let t=K.wantedFilter,n=vi(t),r=Tt(K.cards,K.ownership,K.settings,{threshold:n}),i=Nn(K.sellerStock.listings),a=In(r,i,{inStockOnly:t.inStockOnly,sellerId:t.seller});vt.includes(t.edition)&&(a=a.filter(e=>e.edition===t.edition));let o=Array.isArray(K.wantedFocusIds)?K.wantedFocusIds:null;if(o?.length){let e=new Set(o);a=a.filter(t=>e.has(t.card.id))}let s=t.q.trim().toLowerCase();s&&(a=a.filter(e=>`${e.card.name} ${e.card.number} ${e.card.id} ${e.card.rarity}`.toLowerCase().includes(s)));let c=e=>r.filter(t=>t.edition===e).length,l=c(`beta`),u=c(`retail`),d=c(`beta_iconic`),f=c(`retail_iconic`),p=c(`bstamp`),m=c(`prstamp`),h=c(`ks_promo`),g=In(r,i,{inStockOnly:!0}).length,_=N(K.settings.display_currency),v=K.sellerStock.updatedAt?(()=>{try{return new Date(K.sellerStock.updatedAt).toLocaleString()}catch{return String(K.sellerStock.updatedAt)}})():`no stock snapshot`,y=K.sellerStock.from===`supabase`?`live cache`:K.sellerStock.from===`local`?`local snapshot`:`empty`,b=n>1?` · under ${n} of that edition`:` · missing that edition`;e.innerHTML=`
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Wanted · β / R / Aβ / AR / B / W / KS · AU shipping</p>
          <h2>${a.length} gap${a.length===1?``:`s`}</h2>
          <p class="muted">${l} β · ${u} R · ${d} Aβ · ${f} AR · ${p} B · ${m} W · ${h} KS · ${g} with in-stock AU offer${b} · ${Y(y)} · ${Y(v)}</p>
        </div>
        <div class="panel-head-actions no-print">
          <button type="button" class="btn primary" id="refresh-stock" ${K.stockRefreshing?`disabled`:``}>
            ${K.stockRefreshing?`Refreshing…`:`Refresh stock`}
          </button>
        </div>
      </header>
      ${o?.length?`<p class="hint deck-wanted-focus no-print">Filtered to deck gaps: <strong>${Y(K.wantedFocusLabel||`${o.length} cards`)}</strong> · under-playset on · <button type="button" class="btn ghost" id="clear-wanted-focus">Clear deck filter</button></p>`:``}
      <p class="hint no-print">Shortfalls for <strong>β</strong>, <strong>R</strong>, <strong>Aβ</strong>/<strong>AR</strong> Iconics, <strong>B</strong>-stamp, <strong>W</strong> (WTNC) stamp, and <strong>KS</strong> promos (Lucy / Rebecca / Minotaur). Default is missing (0). Under playset / under 6 expand partial stacks. <strong>Refresh stock</strong> pulls live AU singles (cached ~12h).</p>
      <div class="toolbar wanted-filters no-print">
        <input type="search" id="wanted-q" placeholder="Search name, number…" value="${Y(t.q)}" />
        <select id="wanted-edition">
          <option value="all" ${t.edition===`all`?`selected`:``}>All editions</option>
          <option value="beta" ${t.edition===`beta`?`selected`:``}>β Beta</option>
          <option value="retail" ${t.edition===`retail`?`selected`:``}>R Retail</option>
          <option value="beta_iconic" ${t.edition===`beta_iconic`?`selected`:``}>Aβ Iconic Beta</option>
          <option value="retail_iconic" ${t.edition===`retail_iconic`?`selected`:``}>AR Iconic Retail</option>
          <option value="bstamp" ${t.edition===`bstamp`?`selected`:``}>B stamp</option>
          <option value="prstamp" ${t.edition===`prstamp`?`selected`:``}>W WTNC stamp</option>
          <option value="ks_promo" ${t.edition===`ks_promo`?`selected`:``}>KS Kickstarter promos</option>
        </select>
        <select id="wanted-seller">
          <option value="all" ${t.seller===`all`?`selected`:``}>All sellers</option>
          ${Object.values(I).map(e=>`<option value="${e.id}" ${t.seller===e.id?`selected`:``}>${Y(e.name)}</option>`).join(``)}
        </select>
        <label class="chk" title="Include editions with fewer than 3 copies">
          <input type="checkbox" id="wanted-under-playset" ${t.underPlayset?`checked`:``} />
          Under playset (&lt;3)
        </label>
        <label class="chk" title="Include editions with fewer than 6 copies">
          <input type="checkbox" id="wanted-under-six" ${t.underSix?`checked`:``} />
          Under 6
        </label>
        <label class="chk">
          <input type="checkbox" id="wanted-instock" ${t.inStockOnly?`checked`:``} />
          In stock only
        </label>
      </div>
      <div class="wanted-shops no-print">
        ${Object.values(I).map(e=>`<a class="btn ghost" href="${Y(e.collectionUrl)}" target="_blank" rel="noopener">${Y(e.name)} ↗</a>`).join(``)}
      </div>
      <table class="value-table wanted-table">
        <thead>
          <tr>
            <th></th>
            <th>Card</th>
            <th>Need</th>
            <th>Owned</th>
            <th>AU offers (${_})</th>
          </tr>
        </thead>
        <tbody>
          ${a.map(({card:e,edition:n,own:r,offers:i})=>{let a=n===`beta_iconic`||n===`retail_iconic`,o=R(e.id,{iconic:a}),s=yt[n]||n,c=t.seller===`all`?i:i.filter(e=>e.seller_id===t.seller);return`<tr data-open-wanted="${e.id}" data-prefer-iconic="${a?`1`:`0`}">
                  <td class="wanted-thumb">
                    ${o?.url?`<img src="${o.url}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`:``}
                  </td>
                  <td>
                    <button type="button" class="linkish wanted-name" data-open-wanted="${e.id}" data-prefer-iconic="${a?`1`:`0`}">${Y(e.name)}</button><br/>
                    <span class="muted" style="font-family:var(--font-mono);font-size:0.75rem">${Y(e.number)} · ${Y(e.rarity)}</span>
                  </td>
                  <td><span class="wanted-need" data-ed="${n}" title="${Y(bt[n]||``)}">${s}</span></td>
                  <td class="muted">${kt(r)}</td>
                  <td>${gi(c)}</td>
                </tr>`}).join(``)||`<tr><td colspan="5" class="muted">No gaps match these filters — either you meet the β / R / Aβ / AR / B / W / KS thresholds, or stock filters hid the rest.</td></tr>`}
        </tbody>
      </table>
    </section>
  `;let x=()=>{K.wantedFilter={q:document.querySelector(`#wanted-q`)?.value||``,edition:document.querySelector(`#wanted-edition`)?.value||`all`,seller:document.querySelector(`#wanted-seller`)?.value||`all`,underPlayset:!!document.querySelector(`#wanted-under-playset`)?.checked,underSix:!!document.querySelector(`#wanted-under-six`)?.checked,inStockOnly:!!document.querySelector(`#wanted-instock`)?.checked},Si(e)};document.querySelector(`#wanted-q`)?.addEventListener(`input`,()=>{K.wantedFilter.q=document.querySelector(`#wanted-q`).value,Si(e)}),document.querySelector(`#wanted-edition`)?.addEventListener(`change`,x),document.querySelector(`#wanted-seller`)?.addEventListener(`change`,x),document.querySelector(`#wanted-under-playset`)?.addEventListener(`change`,x),document.querySelector(`#wanted-under-six`)?.addEventListener(`change`,x),document.querySelector(`#wanted-instock`)?.addEventListener(`change`,x),document.querySelector(`#refresh-stock`)?.addEventListener(`click`,()=>_i()),document.querySelector(`#clear-wanted-focus`)?.addEventListener(`click`,()=>bi()),e.querySelectorAll(`[data-open-wanted]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),q(e.dataset.openWanted,{preferIconic:e.dataset.preferIconic===`1`})})})}function Ci(e){let t=Ft(K.cards,K.ownership,K.prices,K.settings),n=Object.keys(K.prices).length,r=N(K.settings.display_currency),i=K.fx?.rate||1.55,a=r===`AUD`?K.fx?.fallback?` · AUD ≈ ${i.toFixed(4)} × USD (fallback rate)`:` · AUD ${i.toFixed(4)} × USD${K.fx?.date?` · FX ${K.fx.date}`:``}`:``,o=K.pricesUpdatedAt?typeof K.pricesUpdatedAt==`string`&&K.pricesUpdatedAt.includes(`estimate`)?K.pricesUpdatedAt:(()=>{try{return new Date(K.pricesUpdatedAt).toLocaleString()}catch{return String(K.pricesUpdatedAt)}})():`no price file`;e.innerHTML=`
    <section class="panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Collection value · ${r}</p>
          <h2>${X(t.total)}</h2>
          <p class="muted">TCGPlayer market (USD source)${Y(a)} · ${Y(String(o))} · ${t.priced} owned lines · ${n} cards priced</p>
        </div>
        <div class="panel-head-actions no-print">
          <div class="currency-toggle" role="group" aria-label="Display currency">
            ${Ht.map(e=>`<button type="button" class="btn ${r===e?`primary`:``}" data-currency="${e}">${e}</button>`).join(``)}
          </div>
          <button type="button" class="btn" id="reload-prices">Reload prices</button>
        </div>
      </header>
      <p class="hint no-print">Uses TCGPlayer market prices from <code>data/card-prices.json</code> (or Supabase <code>card_prices</code> when seeded). Switch USD/AUD for display only — AUD uses a daily mid-market FX rate. With “Value counts all copies” on Ops, regular + B/W-stamp copies multiply base/override, and Iconic A copies multiply Iconic market. Overrides stay in USD. Refresh file: <code>npm run prices:fetch</code>.</p>
      <table class="value-table">
        <thead>
          <tr><th>Card</th><th>Home</th><th>Owned</th><th>Value (${r})</th></tr>
        </thead>
        <tbody>
          ${t.lines.slice(0,100).map(({card:e,value:t,own:n})=>`
            <tr>
              <td>
                <strong>${Y(e.name)}</strong><br/>
                <span class="muted" style="font-family:var(--font-mono);font-size:0.75rem">${Y(e.number)}</span>
              </td>
              <td class="muted">${Vt(e)}</td>
              <td class="muted">${kt(n)}</td>
              <td class="num">${X(t)}</td>
            </tr>`).join(``)||`<tr><td colspan="4" class="muted">Own some cards to see value — or reload prices if the table is empty.</td></tr>`}
        </tbody>
      </table>
    </section>
  `,e.querySelectorAll(`[data-currency]`).forEach(e=>{e.addEventListener(`click`,()=>zr(e.dataset.currency))}),document.querySelector(`#reload-prices`)?.addEventListener(`click`,async()=>{J(`Reloading prices…`);try{let e=await qe();K.prices=e.map,K.pricesUpdatedAt=e.updatedAt,K.fx=await Tr(),Object.keys(K.prices).length?J(`Loaded ${Object.keys(K.prices).length} card prices`):J(`No prices loaded — run npm run prices:fetch`),Q()}catch(e){J(e.message)}})}function wi(e){return String(e||``).split(`:`)[0].replace(/\s*\((Judge Promo|Pre-release)\)\s*/gi,``).trim().toLowerCase()}function Ti(e,t){let n=wi(t?.name);return n?e.filter(e=>e.id!==t.id&&wi(e.name)===n).sort((e,t)=>(e.sort_order??0)-(t.sort_order??0)):[]}function Ei(e,t,{showIconicArt:n,related:r}){let i=[];t.base?.url&&i.push({kind:`art`,art:`base`,label:`Base`,url:t.base.url,on:!n,title:`${e.name} · base`}),e.has_iconic&&t.iconic?.url&&i.push({kind:`art`,art:`iconic`,label:`Iconic A`,url:t.iconic.url,on:n,title:`${e.name} · Iconic A`});for(let e of r){let t=Hn(e.id);t.base?.url&&i.push({kind:`card`,id:e.id,iconic:!1,label:e.number,url:t.base.url,on:!1,title:e.name}),e.has_iconic&&t.iconic?.url&&i.push({kind:`card`,id:e.id,iconic:!0,label:`${e.number} A`,url:t.iconic.url,on:!1,title:`${e.name} · Iconic A`})}return i.length<2?``:`
    <div class="modal-variants" role="group" aria-label="Card variants">
      <p class="eyebrow">Variants</p>
      <div class="modal-variants-grid">
        ${i.map(e=>{let t=e.kind===`art`?`data-modal-art="${e.art}"`:`data-open-variant="${e.id}" data-prefer-iconic="${e.iconic?`1`:`0`}"`;return`<button type="button" class="modal-variant-tile ${e.on?`on`:``}" ${t} title="${Y(e.title)}">
              <img src="${e.url}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
              <span>${Y(e.label)}</span>
            </button>`}).join(``)}
      </div>
    </div>`}function Di(){let e=document.querySelector(`#modal-root`);if(!e)return;if(!K.modalCardId){e.innerHTML=``;return}let t=K.cards.find(e=>e.id===K.modalCardId);if(!t){e.innerHTML=``;return}let n=k(K.ownership,t.id),r=K.prices[t.id]||{},i=Hn(t.id),a=!!(t.has_iconic&&i.iconic&&K.modalPreferIconic),o=a?i.iconic:i.base,s=o?.urlHi||o?.url||``,c=t.name.split(`:`)[0].trim()||t.name,l=o?.productId?`https://www.tcgplayer.com/product/${o.productId}`:`https://www.tcgplayer.com/search/cyberpunk-tcg/product?productLineName=cyberpunk-tcg&q=${encodeURIComponent(c)}`,u=t.artist&&String(t.artist).trim()||null,d=u?jt(K.cards,u).filter(e=>e.id!==t.id):[],f=Ti(K.cards,t),p=sr(K.cards,t),m=Ei(t,i,{showIconicArt:a,related:f}),h=wt(n,t),g=Nn(K.sellerStock.listings),_=[];for(let e of vt){if(!h[e])continue;let n=Pn(g,t.id,e).filter(e=>e.available),r=yt[e];n.length?_.push(`<div class="modal-wanted-row"><span class="wanted-need" data-ed="${e}">Need ${r}</span> ${n.slice(0,3).map(e=>`<a class="btn ghost" href="${Y(e.url)}" target="_blank" rel="noopener">${Y(I[e.seller_id]?.name||e.seller_id)} ${hi(e)}</a>`).join(` `)}</div>`):_.push(`<div class="modal-wanted-row"><span class="wanted-need" data-ed="${e}">Need ${r}</span> <span class="muted">No AU in-stock listing</span></div>`)}e.innerHTML=`
    <div class="modal-backdrop" id="modal-bg">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-layout">
          <div class="modal-media">
            ${s?`<img class="modal-art" src="${s}" alt="${Y(t.name)}${a?` (Iconic)`:``}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`:``}
            ${m}
          </div>
          <div class="modal-body">
            <p class="eyebrow">${Y(t.id)}${o?.tcgNumber?` · ${Y(o.tcgNumber)}`:``}${a?` · Iconic A`:o?` · base`:``}</p>
            <h3>${Y(t.name)}</h3>
            <p class="muted">${t.type} · ${t.rarity}${t.eurodollars==null?``:` · E$${t.eurodollars}`} · ${P(t)}</p>
            ${p.length?`<div class="modal-binder-locs">
                    ${p.map((e,t)=>`
                      <button type="button" class="modal-binder-loc" data-goto-binder="${t}" title="Open ${Y(e.label)}">
                        <span class="modal-binder-loc-label">${Y(e.label)}</span>
                        <span class="modal-binder-loc-go">Show →</span>
                      </button>`).join(``)}
                  </div>`:``}
            ${u?`<div class="modal-artist">
                    <p>Illust · <button type="button" class="linkish" data-open-artist="${Y(u)}">${Y(u)}</button></p>
                    ${oi(br(u))}
                  </div>`:``}
            ${t.notes?`<p class="hint">${Y(t.notes)}</p>`:``}
            <div class="settings-row" data-id="${t.id}">
              ${qr(t,K.ownership,{prefix:`mcopy`})}
            </div>
            <p class="hint">Hover β / R / B / W / Aβ / AR for what each counter means. Playset 1–3 uses regular sources + B + W; Iconic Aβ/AR share the Iconic pocket. Cap 25 across β+R and separately across Aβ+AR (and for B / W). R = retail or Pre-release kit boosters · Aβ = Beta Iconic · AR = Retail Iconic · B = Beta Event stamp · W = Pre-release WTNC 2026 stamp.</p>
            <label style="display:grid;gap:0.35rem;margin-top:1rem;font-size:0.8rem;color:var(--muted)">
              Price override (USD)
              <input type="number" step="0.01" min="0" id="override-input"
                placeholder="${r.base==null?`market`:r.base}"
                value="${n.price_override_usd==null?``:n.price_override_usd}" />
            </label>
            <p class="hint">Market base ${X(r.base||0)}${t.has_iconic?` · Iconic ${X(r.iconic||0)}`:``}${(()=>{let e=j(n),i=M(n);if(!(K.settings.value_count_copies&&(e>1||i>1)))return j(n)+i>0?` · owned ${Ot(n)}`:``;let a=(n.price_override_usd==null?Number(r.base||0):Number(n.price_override_usd))*e+(t.has_iconic?Number(r.iconic||0)*i:0);return` · owned ${Ot(n)} · line ≈ ${X(a)}`})()}</p>
            ${_.length?`<div class="modal-wanted">
                    <p class="eyebrow">Wanted · AU singles</p>
                    ${_.join(``)}
                  </div>`:``}
            <div class="actions">
              <button type="button" class="btn primary" id="save-override">Save override</button>
              <a class="btn" href="${l}" target="_blank" rel="noopener">TCGPlayer</a>
              <button type="button" class="btn ghost" id="close-modal">Close</button>
            </div>
          </div>
        </div>
        ${d.length?`<div class="modal-related">
                <p class="eyebrow">Also by ${Y(u)}</p>
                <div class="modal-related-grid">
                  ${d.slice(0,12).map(e=>{let t=R(e.id,{iconic:!1});return`<button type="button" class="modal-related-tile" data-open-related="${e.id}" title="${Y(e.name)}">
                        ${t?.url?`<img src="${t.url}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`:``}
                        <span>${Y(e.number)}</span>
                      </button>`}).join(``)}
                </div>
                ${d.length>12?`<p class="hint">${d.length-12} more in Artists on Ops</p>`:``}
              </div>`:``}
      </div>
    </div>
  `;let v=()=>{K.modalCardId=null,K.modalPreferIconic=!1,Di()};document.querySelector(`#modal-bg`)?.addEventListener(`click`,e=>{e.target.id===`modal-bg`&&v()}),document.querySelector(`#close-modal`)?.addEventListener(`click`,v),Jr(e,{prefix:`mcopy`}),document.querySelectorAll(`[data-modal-art]`).forEach(e=>{e.addEventListener(`click`,()=>{K.modalPreferIconic=e.dataset.modalArt===`iconic`,Di()})}),document.querySelectorAll(`[data-open-variant]`).forEach(e=>{e.addEventListener(`click`,()=>{q(e.dataset.openVariant,{preferIconic:e.dataset.preferIconic===`1`})})}),document.querySelector(`#save-override`)?.addEventListener(`click`,()=>{let e=document.querySelector(`#override-input`)?.value;Xr(t.id,e)}),document.querySelector(`[data-open-artist]`)?.addEventListener(`click`,()=>{K.modalCardId=null,K.view=`dashboard`,K.opsReveal=`artists`,K.opsArtist=u,Z(),requestAnimationFrame(()=>{document.querySelector(`#ops-reveal`)?.scrollIntoView({behavior:`smooth`,block:`start`})})}),document.querySelectorAll(`[data-goto-binder]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=p[Number(e.dataset.gotoBinder)];t&&(K.modalCardId=null,K.modalPreferIconic=!1,K.view=`binder`,K.binderMode=t.binder,K.binderPage=t.page,Z())})}),document.querySelectorAll(`[data-open-related]`).forEach(e=>{e.addEventListener(`click`,()=>{q(e.dataset.openRelated,{preferIconic:!1})})})}async function Oi(){localStorage.getItem(`ncb-demo`)===`1`?(K.user={id:`demo-local`,email:`demo@local`},await Br()):Rr()}Oi();