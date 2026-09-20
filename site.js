/* TinyHarvest - page logic: data render, cart, scroll choreography, 3D sprout and tray. Classic script (runs from file:// too). */
(() => {
const D = window.TH_DATA;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = c => new Intl.NumberFormat(D.locale, { style: 'currency', currency: D.currency }).format(c / 100);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const products = [...D.kits, ...D.addons];
const byId = id => products.find(p => p.id === id);
const hasGsap = !!(window.gsap && window.ScrollTrigger);
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
const motion = hasGsap && !reduced;

const ICON = {
  fan: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="30" r="3"/><path d="M32 27c-2-9 3-16 9-16 4 0 4 8-2 13M29 31c-9-1-15 5-14 11 1 4 8 3 12-3M35 32c8 4 9 12 5 16-3 3-9-1-10-8"/><path d="M26 54h12M32 40v14M20 52c0-6 3-9 12-9s12 3 12 9"/></svg>',
  light: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="48" height="10" rx="5"/><path d="M14 30v6M32 30v9M50 30v6M23 30v4M41 30v4M18 14V8h28v6"/></svg>',
  drop: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8c9 12 16 21 16 30a16 16 0 0 1-32 0c0-9 7-18 16-30z"/><path d="M24 40a8 8 0 0 0 6 8"/></svg>',
  tick: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>'
};
const art = (p, cls) => p.image ? `<img class="${cls}" src="${p.image}" alt="${p.name}">` : `<span class="${cls}" aria-hidden="true">${ICON[p.icon]}</span>`;

/* ---------- Render from data.js ---------- */
$('[data-strip]').innerHTML = D.kits.map(k => `<a href="#kits"><span>${k.name}</span><b>${money(k.priceCents)}</b></a>`).join('');

const LEAF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21V11"/><path d="M12 13c-6 0-9-4-9-9 5 0 9 4 9 9z"/></svg>';
const varieties = k => +(k.includes[0].match(/(\d+) variet/) || [0, 1])[1];
$('[data-kits]').innerHTML = D.kits.map((k, i) => `
  <article class="kit kit--${k.id}" data-tilt>
    ${k.popular ? '<span class="kit__pop">Most popular</span>' : k.tag ? `<span class="kit__pop kit__pop--quiet">${k.tag}</span>` : ''}
    <span class="kit__size" aria-hidden="true">0${i + 1}</span>
    <div class="kit__photo"><img src="${k.image}" alt="${k.name} on a kitchen windowsill" width="1200" height="900" loading="${i < 2 ? 'eager' : 'lazy'}"></div>
    <span class="kit__shine" aria-hidden="true"></span>
    <div class="kit__body">
      <div class="kit__cap"><h3>${k.name}</h3><span class="kit__price">${money(k.priceCents)}</span></div>
      <p class="kit__meta"><i>${LEAF.repeat(varieties(k))}</i>${varieties(k)} variet${varieties(k) === 1 ? 'y' : 'ies'} <span aria-hidden="true">&middot;</span> 7 to 10 days</p>
      <p class="kit__line">${k.line}</p>
      <div class="kit__act"><button class="btn btn--magnet" type="button" data-add="${k.id}">Add to cart</button></div>
      <details><summary>What's in the box</summary><ul>${k.includes.map(i => `<li>${i}</li>`).join('')}</ul></details>
    </div>
  </article>`).join('');

$('[data-stages]').innerHTML = D.stages.map((s, i) => `
  <li class="stage" data-at="${s.at}" data-index="${i}" tabindex="0" role="button" aria-label="Jump to ${s.name}"><span class="stage__day">${s.day}</span><div><h3>${s.name}</h3><p>${s.text}</p></div></li>`).join('');

$('[data-addons]').innerHTML = D.addons.map(a => `
  <li class="addon" data-reveal="up">
    <div class="addon__art">${art(a, '')}</div>
    <h3>${a.name}</h3>
    <span class="addon__price">${money(a.priceCents)}</span>
    <p>${a.line}</p>
    <button class="btn btn--ghost btn--small" type="button" data-add="${a.id}">Add to cart</button>
  </li>`).join('');

$('[data-claims]').innerHTML = D.claims.map(c => `<li class="claim"><h3>${c.name}</h3><p>${c.text}</p></li>`).join('');
$('[data-faq]').innerHTML = D.faq.map(f => `<details name="faq" data-reveal="up"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('');
$$('.section__head .lead, .growth__text h2').forEach(el => el.setAttribute('data-reveal', 'up'));
$('[data-days-ticks]').innerHTML = Array.from({ length: 11 }, (_, d) => { const st = D.stages.find(s => Math.round(s.at * 10) === d); return `<li style="left:${d * 10}%"><b>${d === 0 ? 'Sow' : 'Day ' + d}</b>${st ? `<span>${st.name}</span>` : ''}</li>`; }).join('');
// drifting leaves behind the kits, footer sprouts, footer word letters
$('[data-leaves]').innerHTML = Array.from({ length: 14 }, (_, i) => `<span class="leaf" style="left:${(i * 7.3 + 3) % 100}%;--d:${14 + (i * 3.7) % 12}s;--delay:-${(i * 2.9) % 16}s;--x:${(i % 3 - 1) * 60}px;--r:${240 + (i * 47) % 200}deg">${LEAF}</span>`).join('');
$('[data-sprouts]').innerHTML = Array.from({ length: 12 }, (_, i) => `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--i:${i}"><path d="M20 38V${18 + (i % 3) * 4}"/><path d="M20 ${22 + (i % 3) * 4}c-8 0-12-5-12-12 7 0 12 5 12 12z"/><path d="M20 ${18 + (i % 3) * 4}c8 0 12-5 12-12-7 0-12 5-12 12z"/></svg>`).join('');
$('[data-word]').innerHTML = [...$('[data-word]').textContent].map(ch => `<span>${ch}</span>`).join('');

/* ---------- Cart (localStorage) ---------- */
const cartEl = $('.cart'), overlay = $('.cart-overlay'), items = $('[data-cart-items]'), toast = $('[data-toast]'), cartBtn = $('.nav__cart'), fly = $('[data-fly]');
let cart = load();
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(D.cartKey) || '[]');
    return raw.filter(l => byId(l.id)).map(l => ({ id: l.id, qty: Math.min(99, Math.max(1, l.qty | 0)) }));
  } catch { return []; }
}
const save = () => localStorage.setItem(D.cartKey, JSON.stringify(cart));
const count = () => cart.reduce((n, l) => n + l.qty, 0);
const subtotal = () => cart.reduce((n, l) => n + byId(l.id).priceCents * l.qty, 0);

function render() {
  $$('[data-cart-count]').forEach(el => el.textContent = count());
  $('[data-cart-heading]').textContent = cart.length ? `${count()} item${count() === 1 ? '' : 's'} in your tray` : 'Nothing in your tray yet.';
  $('[data-cart-subtotal]').textContent = money(subtotal());
  $('[data-checkout]').disabled = !cart.length;
  items.innerHTML = cart.length ? cart.map(l => { const p = byId(l.id); return `
    <article class="line" data-line="${p.id}">
      ${art(p, 'line__art')}
      <div>
        <div class="line__top"><span>${p.name}</span><span>${money(p.priceCents * l.qty)}</span></div>
        <div class="line__each">${money(p.priceCents)} each</div>
        <div class="line__ctl">
          <div class="qty" aria-label="Quantity for ${p.name}"><button type="button" data-qty="-1" aria-label="One fewer">-</button><span>${l.qty}</span><button type="button" data-qty="1" aria-label="One more">+</button></div>
          <button class="line__remove" type="button" data-remove>Remove</button>
        </div>
      </div>
    </article>`; }).join('')
  : '<div class="cart-empty"><strong>Your tray is empty</strong><p>Add a kit and it lands here. It stays saved on this device.</p></div>';
}
function setQty(id, qty) {
  qty = Math.max(0, Math.min(99, qty));
  cart = qty ? cart.map(l => l.id === id ? { ...l, qty } : l) : cart.filter(l => l.id !== id);
  save(); render();
}
function add(id, from) {
  const line = cart.find(l => l.id === id);
  line ? setQty(id, line.qty + 1) : (cart.push({ id, qty: 1 }), save(), render());
  say(`${byId(id).name} added`);
  if (motion && from) flyToCart(from); else openCart();
}
function flyToCart(from) {
  const a = from.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
  gsap.fromTo(fly, { x: a.left + a.width / 2, y: a.top + a.height / 2, opacity: 1, scale: 1 },
    { x: b.left + b.width / 2, y: b.top + b.height / 2, scale: .4, duration: .7, ease: 'power2.in', onComplete() {
      gsap.set(fly, { opacity: 0 }); cartBtn.classList.add('is-bumped'); setTimeout(() => cartBtn.classList.remove('is-bumped'), 400); openCart();
    } });
}
function say(msg) {
  toast.textContent = msg; toast.classList.add('is-on');
  clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('is-on'), 2200);
}
function openCart() {
  cartEl.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false');
  overlay.hidden = false; requestAnimationFrame(() => overlay.style.opacity = 1);
  lenis?.stop(); $('.cart__close').focus({ preventScroll: true });
  if (motion && cart.length) gsap.fromTo('.line', { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .5, stagger: .06, ease: 'power3.out', delay: .15, clearProps: 'all' });
}
function closeCart() {
  cartEl.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true');
  overlay.style.opacity = 0; setTimeout(() => overlay.hidden = true, 300);
  lenis?.start();
}
document.addEventListener('click', e => {
  const t = e.target;
  const addBtn = t.closest('[data-add]');
  if (addBtn) {
    add(addBtn.dataset.add, addBtn);
    if (!addBtn.classList.contains('is-added')) {
      const label = addBtn.innerHTML; addBtn.classList.add('is-added'); addBtn.innerHTML = ICON.tick + ' Added';
      setTimeout(() => { addBtn.classList.remove('is-added'); addBtn.innerHTML = label; }, 1600);
    }
    return;
  }
  if (t.closest('[data-cart-open]')) return openCart();
  if (t.closest('[data-cart-close]')) return closeCart();
  const line = t.closest('[data-line]');
  if (line) {
    const id = line.dataset.line, l = cart.find(x => x.id === id);
    if (t.closest('[data-remove]')) setQty(id, 0);
    else if (t.closest('[data-qty]')) setQty(id, l.qty + +t.closest('[data-qty]').dataset.qty);
  }
  if (t.closest('[data-checkout]')) { $('[data-checkout-note]').textContent = 'Checkout is not open yet. Your cart stays saved here; subscribe in the footer and we email you the day it opens.'; say('Checkout opens soon'); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && cartEl.classList.contains('is-open')) closeCart(); });
render();

/* ---------- Nav, newsletter, cursor light ---------- */
const nav = $('[data-nav]');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY; nav.classList.toggle('is-scrolled', y > 8);
  // phones: nav slides away while scrolling down, comes back on the first scroll up
  if (matchMedia('(max-width: 900px)').matches && !nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > lastY && y > 120);
  lastY = y;
}, { passive: true });
$('[data-menu]').addEventListener('click', e => { const open = nav.classList.toggle('is-open'); e.currentTarget.setAttribute('aria-expanded', open); });
$$('.nav__links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));
$('[data-news]').addEventListener('submit', e => { e.preventDefault(); $('[data-news-note]').textContent = `Sign-up is not connected yet. Email ${D.email} and we add you by hand.`; });

const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 };
if (motion && finePointer) {
  const light = $('[data-light]');
  const lx = gsap.quickTo(light, 'x', { duration: .6, ease: 'power3' }), ly = gsap.quickTo(light, 'y', { duration: .6, ease: 'power3' });
  addEventListener('pointermove', e => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.nx = e.clientX / innerWidth * 2 - 1; pointer.ny = e.clientY / innerHeight * 2 - 1;
    lx(e.clientX); ly(e.clientY); document.body.classList.add('has-pointer');
  }, { passive: true });
  // magnetic buttons
  $$('.btn--magnet').forEach(btn => {
    const mx = gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3' }), my = gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3' });
    btn.addEventListener('pointermove', e => { const r = btn.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .25); my((e.clientY - r.top - r.height / 2) * .35); });
    btn.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
  // kit tilt + shine
  $$('[data-tilt]').forEach(card => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3' });
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * 6); ry((px - 0.5) * 6); card.style.setProperty('--mx', px * 100 + '%'); card.style.setProperty('--my', py * 100 + '%');
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ---------- Scroll: Lenis + ScrollTrigger ---------- */
let lenis = null;
if (motion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const stages = $$('.stage'), growth = $('.growth'), dayEl = $('[data-day]');
function setStage(p) {
  growth.style.setProperty('--p', p.toFixed(3));
  let active = 0; stages.forEach((s, i) => { if (p >= +s.dataset.at - 0.001) active = i; });
  stages.forEach((s, i) => s.classList.toggle('is-active', i === active));
  dayEl.textContent = Math.round(p * 10);
}
setStage(0);

/* ---------- Mist particles (2D canvas, hero only) ---------- */
if (motion) {
  const c = $('[data-mist]'), ctx = c.getContext('2d');
  let w = 0, h = 0, on = false, raf = 0;
  const dots = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, s: 0.02 + Math.random() * 0.05, o: 0.15 + Math.random() * 0.4, ph: Math.random() * 6.28 }));
  const size = () => { w = c.width = c.clientWidth; h = c.height = c.clientHeight; };
  new ResizeObserver(size).observe(c); size();
  const tick = t => {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      const y = ((d.y - t * 0.00002 * d.s * 40) % 1 + 1) % 1, x = d.x + Math.sin(t * 0.0004 + d.ph) * 0.01;
      ctx.beginPath(); ctx.arc(x * w, y * h, d.r, 0, 6.28); ctx.fillStyle = `rgba(243,227,184,${d.o * (0.6 + 0.4 * Math.sin(t * 0.001 + d.ph))})`; ctx.fill();
    }
    raf = on ? requestAnimationFrame(tick) : 0;
  };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); }).observe(c);
}

/* ---------- 3D scenes ---------- */
const webgl = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
const useFrames = reduced || !webgl;
const ss = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };

function useStatic(sceneEl, stageFrames) {
  const img = sceneEl.querySelector('.scene__frame'); sceneEl.querySelector('canvas').remove(); img.src = img.dataset.src; img.hidden = false;
  return { set: p => { if (stageFrames) img.src = `assets/growth/stage-${D.stages.reduce((a, s, i) => p >= s.at - 0.001 ? i : a, 0)}.png`; } };
}

function makeRenderer(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  return renderer;
}
function greenhouseLights(THREE, scene) {
  const key = new THREE.DirectionalLight(0xffe9c4, 2.8); key.position.set(-1.6, 3.2, 2.2); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0008;
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 9 }); key.shadow.camera.updateProjectionMatrix();
  const rim = new THREE.DirectionalLight(0xe0b25c, 1.3); rim.position.set(2.5, 1.5, -2.5);
  scene.add(key, rim, new THREE.HemisphereLight(0x3a5a3a, 0x0a130e, 0.75));
  return key;
}
function loop(sceneEl, renderer, scene, camera, onFrame) {
  let visible = false, raf = 0; const t0 = performance.now();
  const size = () => { const w = sceneEl.clientWidth, h = sceneEl.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(sceneEl); size();
  const frame = now => { onFrame((now - t0) / 1000); renderer.render(scene, camera); raf = visible ? requestAnimationFrame(frame) : 0; };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: '80px' }).observe(sceneEl);
  return size;
}

/* Brand sprout: procedural model from the img2threejs spec (seed, S-curved tapered stem, two cupped teardrop leaves). */
function createSprout(THREE) {
  const g = new THREE.Group();
  const leafM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.5, metalness: 0, sheen: 0.3, sheenColor: 0xd6f2a8, side: THREE.DoubleSide });
  const stemM = new THREE.MeshPhysicalMaterial({ color: 0x93c950, roughness: 0.5, metalness: 0, sheen: 0.25, sheenColor: 0xd6f2a8 });
  const seedM = new THREE.MeshPhysicalMaterial({ color: 0x2f2f2f, roughness: 0.35, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.4 });
  const mesh = (geo, mat, rs = true) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = rs; return m; };
  const seed = mesh(new THREE.SphereGeometry(0.5, 40, 28), seedM); seed.scale.set(0.46, 0.29, 0.4); seed.position.set(-0.3, 0.145, 0); seed.rotation.z = -0.22;
  const lip = mesh(new THREE.TorusGeometry(0.085, 0.013, 10, 32, Math.PI * 1.25), seedM); lip.position.set(-0.13, 0.27, 0); lip.rotation.set(Math.PI / 2 + 0.25, 0, -0.4);
  const S = [[0, 0, 0, 0.07], [0.03, 0.1, 0, 0.052], [0.03, 0.26, 0.02, 0.044], [-0.02, 0.38, 0.03, 0.038], [-0.02, 0.45, 0.02, 0.032], [0.02, 0.5, 0, 0.016], [0.04, 0.51, 0, 0]];
  const stem = mesh(taperedSweep(THREE, S, 48, 12), stemM); stem.position.set(-0.1, 0.27, 0);
  const collar = mesh(new THREE.SphereGeometry(0.058, 20, 14), stemM); collar.position.set(-0.1, 0.27, 0); collar.scale.set(1.3, 0.9, 1.1);
  const node = mesh(new THREE.SphereGeometry(0.034, 16, 12), stemM); node.position.set(-0.12, 0.72, 0.02); node.scale.setScalar(1.1);
  const leafA = mesh(leafGeometry(THREE, 0.74, 20, 10), leafM, false); leafA.position.set(-0.12, 0.72, 0.02); leafA.rotation.set(0.15, 0, 0.95);
  const leafB = mesh(leafGeometry(THREE, 0.9, 20, 10), leafM, false); leafB.position.set(-0.1, 0.74, -0.02); leafB.rotation.set(-0.1, 0, -1.1);
  g.add(seed, lip, stem, collar, node, leafA, leafB);
  g.userData.parts = { seed, stem, leafA, leafB };
  return g;
}
function leafGeometry(THREE, len, cupDeg, recurveDeg) {
  // parametric grid (u across, v along) so the cupped blade shades smoothly
  const U = 10, V = 24, w = t => 0.31 * Math.pow(Math.sin(Math.PI * t), 0.85) * (1 - 0.32 * t);
  const cup = Math.tan(cupDeg * Math.PI / 180), rec = Math.tan(recurveDeg * Math.PI / 180);
  const c0 = new THREE.Color(0x6fa63a), c1 = new THREE.Color(0xa8d465), c = new THREE.Color();
  const verts = [], colors = [], idx = [];
  for (let i = 0; i <= V; i++) {
    const v = i / V, hw = w(v), y = v;
    for (let j = 0; j <= U; j++) {
      const u = j / U * 2 - 1, x = u * hw;
      verts.push(x * len, y * len, (cup * u * u * hw - rec * y * y * 0.6) * len);
      c.lerpColors(c0, c1, Math.min(1, v * 1.1)); colors.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < V; i++) for (let j = 0; j < U; j++) { const a = i * (U + 1) + j, b = a + U + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function taperedSweep(THREE, stations, segs, radial) {
  const curve = new THREE.CatmullRomCurve3(stations.map(s => new THREE.Vector3(s[0], s[1], s[2])));
  const radiusAt = t => { const k = t * (stations.length - 1), i = Math.min(stations.length - 2, Math.floor(k)), f = k - i; return stations[i][3] * (1 - f) + stations[i + 1][3] * f; };
  const P = [], N = [], B = []; let normal = new THREE.Vector3(1, 0, 0);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, p = curve.getPointAt(t), tan = curve.getTangentAt(t).normalize();
    if (i === 0) normal = new THREE.Vector3().crossVectors(tan, Math.abs(tan.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    else normal.sub(tan.clone().multiplyScalar(normal.dot(tan))).normalize();
    P.push(p); N.push(normal.clone()); B.push(new THREE.Vector3().crossVectors(tan, normal).normalize());
  }
  const verts = [], norms = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const r = radiusAt(i / segs);
    for (let j = 0; j <= radial; j++) {
      const a = j / radial * Math.PI * 2, n = N[i].clone().multiplyScalar(Math.cos(a)).add(B[i].clone().multiplyScalar(Math.sin(a) * 0.85)).normalize();
      verts.push(P[i].x + n.x * r, P[i].y + n.y * r, P[i].z + n.z * r); norms.push(n.x, n.y, n.z);
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) { const a = i * (radial + 1) + j, b = a + radial + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3)); geo.setIndex(idx);
  return geo;
}

async function sproutScene(sceneEl) {
  const THREE = await import('three');
  const renderer = makeRenderer(THREE, sceneEl.querySelector('canvas'));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20); camera.position.set(0.2, 0.9, 3.1); camera.lookAt(0, 0.55, 0);
  greenhouseLights(THREE, scene);
  const sprout = createSprout(THREE); sprout.position.set(0.1, 0, 0); scene.add(sprout);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.ShadowMaterial({ opacity: 0.35 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const { leafA, leafB, stem } = sprout.userData.parts;
  loop(sceneEl, renderer, scene, camera, t => {
    const tx = motion && finePointer ? pointer.nx : 0, ty = motion && finePointer ? pointer.ny : 0;
    sprout.rotation.y += ((0.35 * tx + Math.sin(t * 0.35) * 0.25) - sprout.rotation.y) * 0.04;
    sprout.rotation.x += ((0.12 * ty) - sprout.rotation.x) * 0.04;
    sprout.position.y = Math.sin(t * 0.9) * 0.02;
    leafA.rotation.z = 0.95 + Math.sin(t * 1.3) * 0.03; leafB.rotation.z = -1.1 + Math.sin(t * 1.1 + 1) * 0.03;
    stem.rotation.z = Math.sin(t * 0.8) * 0.015;
  });
  return { set() {} };
}

async function trayScene(sceneEl) {
  const THREE = await import('three');
  const renderer = makeRenderer(THREE, sceneEl.querySelector('canvas'));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 4 / 3, 0.1, 20); camera.position.set(1.3, 1.0, 2.6); camera.lookAt(0, 0.22, 0);
  greenhouseLights(THREE, scene);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.ShadowMaterial({ opacity: 0.45 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.001; ground.receiveShadow = true; scene.add(ground);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...extra });

  // hollow terracotta tray
  const W = 1.7, Dp = 1.1, H = 0.26;
  const rrect = (path, w, d, r) => {
    path.moveTo(-w / 2 + r, -d / 2); path.lineTo(w / 2 - r, -d / 2); path.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    path.lineTo(w / 2, d / 2 - r); path.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); path.lineTo(-w / 2 + r, d / 2);
    path.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); path.lineTo(-w / 2, -d / 2 + r); path.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    return path;
  };
  const rr = rrect(new THREE.Shape(), W, Dp, 0.12); rr.holes.push(rrect(new THREE.Path(), W - 0.1, Dp - 0.1, 0.08));
  const trayM = mat(0xc4835b, { roughness: 0.8 });
  const tray = new THREE.Mesh(new THREE.ExtrudeGeometry(rr, { depth: H, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 10 }), trayM);
  tray.rotation.x = -Math.PI / 2; tray.castShadow = tray.receiveShadow = true;
  const trayBase = new THREE.Mesh(new THREE.BoxGeometry(W - 0.08, 0.04, Dp - 0.08), trayM); trayBase.position.y = 0.02;
  scene.add(tray, trayBase);

  // coco coir slab plus crumbs
  const soilY = H - 0.06;
  const soil = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.16, Dp - 0.1), mat(0x3d2b1f, { roughness: 1 })); soil.position.y = soilY - 0.08; soil.receiveShadow = true; scene.add(soil);
  const crumbs = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.018), mat(0x56402d, { roughness: 1 }), 220);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  for (let i = 0; i < 220; i++) {
    v.set((Math.random() - 0.5) * (W - 0.18), soilY + 0.012, (Math.random() - 0.5) * (Dp - 0.18));
    q.setFromEuler(new THREE.Euler(Math.random() * 3, Math.random() * 3, 0)); sc.setScalar(0.6 + Math.random() * 0.9); m.compose(v, q, sc); crumbs.setMatrixAt(i, m);
  }
  crumbs.receiveShadow = true; scene.add(crumbs);

  // seedlings: seed, tapering stem, two cotyledons, three true leaves; one progress scalar drives all
  const cotGeo = leafGeometry(THREE, 0.1, 22, 8), trueGeo = leafGeometry(THREE, 0.14, 24, 10);
  const stemGeo = new THREE.CylinderGeometry(0.009, 0.015, 1, 8); stemGeo.translate(0, 0.5, 0);
  const seedGeo = new THREE.SphereGeometry(0.036, 12, 8); seedGeo.scale(1, 0.7, 1.3);
  const C = { stem0: new THREE.Color(0xe3e6b8), stem1: new THREE.Color(0x8fbf4a) };
  function plant(x, z, scale, delay) {
    const g = new THREE.Group(); g.position.set(x, soilY + 0.015, z); g.scale.setScalar(scale); g.rotation.y = Math.random() * 6.28;
    const stemM = mat(0xe3e6b8), leafM = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85, metalness: 0 });
    const seed = new THREE.Mesh(seedGeo, mat(0x8a6a3e)); seed.castShadow = true; g.add(seed);
    const stem = new THREE.Mesh(stemGeo, stemM); stem.castShadow = true; g.add(stem);
    const top = new THREE.Group(); g.add(top);
    const cots = [-1, 1].map(s => { const l = new THREE.Mesh(cotGeo, leafM); l.castShadow = true; l.rotation.set(0.2, 0, s * 1.05); top.add(l); return l; });
    const leaves = [0, 1, 2].map(i => { const h = new THREE.Group(); h.rotation.y = i * 2.094 + 0.5; const l = new THREE.Mesh(trueGeo, leafM); l.castShadow = true; l.rotation.z = -1.0; l.rotation.x = 0.15; h.add(l); top.add(h); return h; });
    const phase = Math.random() * 6.28, sway = 0.6 + Math.random() * 0.8;
    return { g, set(p, t) {
      const pp = Math.min(1, Math.max(0, (p - delay) / (1 - delay)));
      const sv = 1 - ss(0.14, 0.3, pp); seed.scale.setScalar(sv || 0.0001); seed.position.y = 0.02 - 0.05 * ss(0.04, 0.26, pp); seed.visible = sv > 0.01;
      const h = 0.04 * ss(0.1, 0.22, pp) + 0.3 * ss(0.18, 0.86, pp); stem.scale.y = Math.max(0.001, h); stem.visible = h > 0.005;
      stemM.color.lerpColors(C.stem0, C.stem1, ss(0.25, 0.65, pp));
      top.position.y = h; top.visible = h > 0.03;
      const c = ss(0.22, 0.5, pp); cots.forEach((l, i) => { l.scale.setScalar(Math.max(0.001, c)); l.rotation.z = (i ? 1 : -1) * (1.05 + 0.35 * ss(0.7, 1, pp)); });
      leaves.forEach((hd, i) => { const k = ss(0.5 + i * 0.1, 0.74 + i * 0.1, pp); hd.scale.setScalar(Math.max(0.001, k)); hd.position.y = -0.01 - i * 0.012; });
      g.rotation.z = Math.sin(t * sway + phase) * 0.035 * h; g.rotation.x = Math.cos(t * sway * 0.8 + phase) * 0.02 * h;
    } };
  }
  const plants = [], spots = [[0, 0.05, 1, 0]];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    const x = -0.66 + c * 0.22 + (Math.random() - 0.5) * 0.1, z = -0.36 + r * 0.24 + (Math.random() - 0.5) * 0.1;
    if (Math.hypot(x, z - 0.05) > 0.13) spots.push([x, z, 0.6 + Math.random() * 0.35, 0.02 + Math.random() * 0.12]);
  }
  spots.forEach(([x, z, s, d]) => { const p = plant(x, z, s, d); plants.push(p); scene.add(p.g); });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.004, 8, 40), new THREE.MeshBasicMaterial({ color: 0xe0b25c, transparent: true, opacity: 0 }));
  ring.rotation.x = Math.PI / 2; ring.position.set(0, soilY + 0.075, 0.05); scene.add(ring);

  let progress = 0;
  loop(sceneEl, renderer, scene, camera, t => { plants.forEach(p => p.set(progress, t)); ring.material.opacity = ss(0.88, 1, progress); });
  return { set: p => { progress = p; } };
}

const scenes = {};
const bootScene = (el, name, make, stageFrames) => {
  const boot = () => { if (scenes[name]) return; scenes[name] = 'booting'; (useFrames ? Promise.resolve(useStatic(el, stageFrames)) : make(el).catch(() => useStatic(el, stageFrames))).then(s => { scenes[name] = s; s.set(+el.dataset.progress || 0); }); };
  if (useFrames) boot(); else new IntersectionObserver(([e], o) => { if (e.isIntersecting) { boot(); o.disconnect(); } }, { rootMargin: '300px' }).observe(el);
};
bootScene($('[data-sprout]'), 'sprout', sproutScene, false);
bootScene($('[data-scene="grow"]'), 'grow', trayScene, true);
window.__th = { scenes, useFrames };

/* ---------- Scroll choreography ---------- */
if (hasGsap) {
  // growth: pin, scrub, snap; stages are clickable
  const growST = ScrollTrigger.create({
    trigger: growth, start: 'top top', end: '+=250%', pin: true, scrub: 0.6,
    snap: { snapTo: [0, 0.3, 0.62, 1], duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power1.inOut' },
    onUpdate(self) { setStage(self.progress); if (scenes.grow?.set) scenes.grow.set(self.progress); }
  });
  const jump = i => { const target = [0, 0.3, 0.62, 1][i]; const y = growST.start + (growST.end - growST.start) * target; lenis ? lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' }); };
  stages.forEach(s => { s.addEventListener('click', () => jump(+s.dataset.index)); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(+s.dataset.index); } }); });

  // steps: gold line draws when the list enters
  ScrollTrigger.create({ trigger: '[data-steps]', start: 'top 75%', once: true, onEnter: () => $('[data-steps]').style.setProperty('--w', '1') });
  // ten-day timeline scrubs with scroll: fill, ticks and the sprout icon
  const ticks = $$('[data-days-ticks] li');
  gsap.to('[data-days-fill]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '[data-days]', start: 'top 80%', end: 'bottom 40%', scrub: 0.4, onUpdate(self) { ticks.forEach((t, i) => t.classList.toggle('is-on', self.progress * 10 >= i - 0.02)); } } });
  gsap.to('[data-days-sprout]', { left: '100%', ease: 'none', scrollTrigger: { trigger: '[data-days]', start: 'top 80%', end: 'bottom 40%', scrub: 0.4 } });
  // footer: sprouts grow in, the big word rises letter by letter
  ScrollTrigger.create({ trigger: '[data-sprouts]', start: 'top 92%', once: true, onEnter: () => $('[data-sprouts]').classList.add('is-in') });
  // nav: reading progress + active link
  gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  $$('.nav__links a').forEach(a => { const sec = $(a.getAttribute('href')); if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: self => a.classList.toggle('is-active', self.isActive) }); });
  addEventListener('load', () => ScrollTrigger.refresh());
}
if (motion) {
  document.documentElement.classList.add('js');
  // hero intro
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.roof', { opacity: 0, y: -40, duration: 1.4 }, 0)
    .from('.shaft', { opacity: 0, duration: 1.8, stagger: .2 }, 0.2)
    .from('[data-hero-kicker]', { y: 16, opacity: 0, duration: .7 }, 0.3)
    .from('[data-hero-title] span', { yPercent: 110, opacity: 0, duration: 1, stagger: .09 }, 0.4)
    .from('[data-hero-lead]', { y: 20, opacity: 0, duration: .8 }, 0.9)
    .from('[data-hero-actions] .btn', { y: 16, opacity: 0, duration: .7, stagger: .1 }, 1.05)
    .from('[data-hero-sprout]', { scale: .82, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.5)
    .from('.hero__strip a', { y: 14, opacity: 0, duration: .6, stagger: .06 }, 1.2);
  // hero parallax on scroll: sprout drifts up slower than the text
  gsap.to('[data-hero-sprout]', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.shaft--1, .shaft--2', { xPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  // marquee
  const track = $('[data-marquee]'); track.innerHTML += track.innerHTML;
  gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  // split headings: words rise with a stagger
  $$('[data-split]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(' ').map(w => `<span class="w">${w} </span>`).join('');
    gsap.from(el.querySelectorAll('.w'), { yPercent: 100, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  // section reveals
  ScrollTrigger.batch('[data-reveal]', { start: 'top 88%', once: true, onEnter: els => els.forEach((el, i) => setTimeout(() => el.classList.add('is-in'), i * 70)) });
  // kits: cards rise in sequence, photos parallax inside their frames
  gsap.from('.kit', { y: 48, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.kits__row', start: 'top 80%', once: true }, clearProps: 'transform,opacity' });
  $$('.kit__photo img').forEach(img => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.kit'), start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('[data-word] span', { yPercent: 100, opacity: 0, duration: 1.1, stagger: .04, ease: 'power3.out', scrollTrigger: { trigger: '[data-word]', start: 'top 95%', once: true } });
  // trust line glows in
  gsap.from('.claims .claim', { x: 40, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.claims', start: 'top 80%', once: true }, clearProps: 'transform' });
}
})();
