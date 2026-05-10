/* ─────────────────────────────────────────────
   Love Compatibility — love.js
   ───────────────────────────────────────────── */

const STATE = {
  firstTestDone: false,
  currentVariant: 0,
  variantTimer: null,
  animFrameId: null,
  particles: null,
  heartPoints: null,
  fillParticles: null,
  variantStart: 0,
};

const VARIANT_LABELS = ['Classic', 'Beating Heart', 'Unbreakable Heart'];

// Cursor position (updated globally, used by Hearts variant)
const CURSOR = { x: -9999, y: -9999, px: -9999, py: -9999 };

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  createBgHearts();
  animateTitleSparkles();
  setupMatchmaker();
  setupDotNav();
  setupClickHearts();
  setupDraggableSherry();
  sizeCanvas();
  window.addEventListener('resize', onResize);
  document.getElementById('name1').readOnly = true;
  document.getElementById('name2').readOnly = true;

  document.addEventListener('mousemove', e => {
    CURSOR.px = CURSOR.x; CURSOR.py = CURSOR.y;
    CURSOR.x = e.clientX; CURSOR.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => { CURSOR.x = -9999; CURSOR.y = -9999; CURSOR.px = -9999; CURSOR.py = -9999; });
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    CURSOR.px = CURSOR.x; CURSOR.py = CURSOR.y;
    CURSOR.x = t.clientX; CURSOR.y = t.clientY;
  }, { passive: true });
  document.addEventListener('touchend', () => { CURSOR.x = -9999; CURSOR.y = -9999; CURSOR.px = -9999; CURSOR.py = -9999; });
});

/* ────────────────────────────────────────────
   CLICK / TAP → SPAWN HEART
───────────────────────────────────────────── */
function setupClickHearts() {
  function spawnClickHeart(x, y) {
    const el = document.createElement('div');
    el.className = 'chp';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.innerHTML = `
      <svg viewBox="0 0 100 88" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 80 C50 80 8 52 8 28 C8 14 18 6 28 6 C37 6 45 12 50 20 C55 12 63 6 72 6 C82 6 92 14 92 28 C92 52 50 80 50 80Z" fill="#ffccd9"/>
      </svg>
      <span class="chp-label">I love you</span>`;
    document.body.appendChild(el);

    gsap.fromTo(el,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2.5)',
        onComplete: () => gsap.to(el, {
          scale: 1.06, opacity: 0, y: -22, duration: 0.35, delay: 0.3, ease: 'power2.in',
          onComplete: () => el.remove()
        })
      }
    );
  }

  document.addEventListener('click', e => {
    if (e.target.closest('input, button, .dot')) return;
    spawnClickHeart(e.clientX, e.clientY);
  });
  document.addEventListener('touchstart', e => {
    if (e.target.closest('input, button, .dot')) return;
    const t = e.touches[0];
    spawnClickHeart(t.clientX, t.clientY);
  }, { passive: true });
}

/* ────────────────────────────────────────────
   TITLE SPARKLES
───────────────────────────────────────────── */
function animateTitleSparkles() {
  const container = document.getElementById('title-sparkles');
  if (!container) return;
  const stars  = ['✦', '✧', '✸', '✺', '⁕', '★'];
  const hearts = ['💕', '🩷', '❤️'];

  function spawnStar() {
    const el = document.createElement('span');
    el.className = 'spark';
    el.textContent = stars[Math.floor(Math.random() * stars.length)];
    const size = Math.random() * 10 + 8;
    el.style.cssText = `left:${Math.random()*110-5}%;top:${Math.random()*110-5}%;font-size:${size}px;color:hsl(${42+Math.random()*18},100%,${70+Math.random()*20}%);`;
    container.appendChild(el);
    gsap.fromTo(el, { opacity:0, scale:0, rotation:-30 }, {
      opacity:1, scale:1, rotation:Math.random()*30-15, duration:0.22, ease:'back.out(3)',
      onComplete: () => gsap.to(el, { opacity:0, scale:0.2, y:-6, duration:0.32, delay:0.25+Math.random()*0.5, ease:'power2.in',
        onComplete: () => { el.remove(); setTimeout(spawnStar, Math.random()*300+60); } })
    });
  }

  function spawnHeart() {
    const el = document.createElement('span');
    el.className = 'spark';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const size = (Math.random() * 10 + 12) * 0.3;
    el.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${size}px;`;
    container.appendChild(el);
    gsap.fromTo(el, { opacity:0, scale:0 }, {
      opacity:0.9, scale:1, duration:0.3, ease:'back.out(2)',
      onComplete: () => gsap.to(el, { opacity:0, y:-10, duration:0.4, delay:0.5+Math.random()*0.6, ease:'power2.in',
        onComplete: () => { el.remove(); setTimeout(spawnHeart, Math.random()*800+400); } })
    });
  }

  for (let i = 0; i < 6; i++) setTimeout(spawnStar, i * 160);
  for (let i = 0; i < 2; i++) setTimeout(spawnHeart, i * 600 + 300);
}

/* ────────────────────────────────────────────
   BACKGROUND HEARTS
───────────────────────────────────────────── */
function createBgHearts() {
  const container = document.getElementById('bg-hearts');
  const emojis = ['🫀', '💕', '💖', '💗', '💓'];
  for (let i = 0; i < 14; i++) {
    const span = document.createElement('span');
    span.className = 'fh';
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const dur = Math.random() * 7 + 9;
    const delay = -(Math.random() * dur);
    span.style.cssText = `left:${Math.random()*100}%;font-size:${Math.random()*20+10}px;opacity:${Math.random()*0.3+0.1};animation-delay:${delay}s;animation-duration:${dur}s;color:hsl(${330+Math.random()*30},90%,70%);`;
    container.appendChild(span);
  }
}

/* ────────────────────────────────────────────
   SCREEN TRANSITIONS
───────────────────────────────────────────── */
function transitionTo(screenId, onComplete) {
  const current = document.querySelector('section.active');
  const next = document.getElementById(screenId);
  if (!next || next === current) return;
  const tl = gsap.timeline();
  if (current) tl.to(current, { opacity:0, duration:0.5, ease:'power2.in', onComplete:()=>current.classList.remove('active') });
  tl.set(next, { opacity:0 }).call(()=>next.classList.add('active'))
    .to(next, { opacity:1, duration:0.6, ease:'power2.out', onComplete: onComplete||(() => {}) });
}

/* ────────────────────────────────────────────
   DETERMINISTIC NAME HASH
───────────────────────────────────────────── */
function hashNames(a, b) {
  const key = [a.toLowerCase().trim(), b.toLowerCase().trim()].sort().join('\x00');
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) | 0;
  return Math.abs(h) % 100;
}

/* ────────────────────────────────────────────
   SCREEN 1 — MATCHMAKER
───────────────────────────────────────────── */
function setupMatchmaker() {
  document.getElementById('btn-test').addEventListener('click', () => {
    const n1 = document.getElementById('name1').value.trim();
    const n2 = document.getElementById('name2').value.trim();
    if (!n1 || !n2) return;
    runTest(n1, n2);
  });
  document.getElementById('btn-retry').addEventListener('click', () => {
    document.getElementById('meter-fill').style.width = '0%';
    document.getElementById('meter-heart').style.left = '-8px';
    document.getElementById('pct-display').textContent = '0%';
    const ah = document.getElementById('ascii-heart');
    if (ah) { ah.style.display = 'none'; gsap.killTweensOf(document.getElementById('ascii-art')); }
    gsap.to('#btn-retry', { opacity:0, y:8, duration:0.2 });
    transitionTo('screen-matchmaker');
  });
}

function runTest(name1, name2) {
  const n = [name1.toLowerCase(), name2.toLowerCase()];
  const isEzekiel = n.some(x => x === 'eze' || x === 'ezekiel' || x === 'ezekiel miranda' || x === 'ezekiel joseph miranda');
  const isZhao    = n.includes('zhao xiaoyu');
  const isSherry  = n.includes('sherry') || n.includes('sherry xiaoyu');

  const isGay = n.includes('gay');

  let pct;
  if (isEzekiel && isGay) {
    pct = 0;
  } else if ((isSherry || isZhao) && isEzekiel) {
    pct = 100;
  } else if (n.includes('adam') && n.includes('eve')) {
    pct = 67;
    if (!STATE.firstTestDone) { STATE.firstTestDone = true; unlockInputs(); }
  } else if (!STATE.firstTestDone) {
    pct = 67;
    STATE.firstTestDone = true;
    unlockInputs();
  } else {
    pct = hashNames(name1, name2);
  }

  document.getElementById('rn1').textContent = name1;
  document.getElementById('rn2').textContent = name2;
  transitionTo('screen-result', () => animateMeter(pct));
}

function unlockInputs() {
  const i1 = document.getElementById('name1'), i2 = document.getElementById('name2');
  i1.readOnly = false; i2.readOnly = false;
  i1.value = ''; i2.value = '';
  i1.placeholder = 'First name'; i2.placeholder = 'Second name';
  gsap.to('#try-own-hint', { opacity:1, y:0, duration:0.5, ease:'power2.out' });
}

/* ────────────────────────────────────────────
   SCREEN 2 — RESULT
───────────────────────────────────────────── */
function animateMeter(targetPct) {
  const fill = document.getElementById('meter-fill');
  const heart = document.getElementById('meter-heart');
  const display = document.getElementById('pct-display');
  const counter = { val: 0 };

  // Show retry button after a short fixed delay — don't wait for the slow meter crawl
  if (targetPct !== 100) {
    gsap.delayedCall(1.2, () => gsap.to('#btn-retry', { opacity:1, y:0, duration:0.1, ease:'power2.out' }));
  }

  gsap.to(counter, {
    val: targetPct, duration: 3.8, ease: 'power4.out',
    onUpdate: () => {
      const v = Math.round(counter.val);
      display.textContent = v + '%';
      fill.style.width = v + '%';
      heart.style.left = `calc(${v}% - 8px)`;
    },
    onComplete: () => showResult(targetPct)
  });
}

function showResult(pct) {
  if (pct === 100) {
    gsap.delayedCall(0.1, () => transitionTo('screen-heart', () => startHeartVariant(0)));
  }
}

/* ────────────────────────────────────────────
   CANVAS
───────────────────────────────────────────── */
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');

function sizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

function onResize() {
  sizeCanvas();
  STATE.particles     = null;
  STATE.heartPoints   = null;
  STATE.fillParticles = null;
  if (document.getElementById('screen-heart').classList.contains('active')) {
    startHeartVariant(STATE.currentVariant);
  }
}

/* ────────────────────────────────────────────
   LOVE HEART POINT GENERATOR
───────────────────────────────────────────── */
function generateHeartPoints(count) {
  const W = canvas.width, H = canvas.height;
  const scale = Math.min(W, H) * 0.031;
  const cx = W / 2, cy = H / 2 - scale * 1.5;
  const tSamples = 2000;
  const raw = [];
  for (let i = 0; i < tSamples; i++) {
    const t = (i / tSamples) * Math.PI * 2;
    raw.push({
      x: 16 * Math.pow(Math.sin(t), 3),
      y: -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)),
      t
    });
  }
  const arcs = [0];
  for (let i = 1; i < raw.length; i++) {
    const dx = raw[i].x - raw[i-1].x, dy = raw[i].y - raw[i-1].y;
    arcs.push(arcs[i-1] + Math.sqrt(dx*dx + dy*dy));
  }
  const step = arcs[arcs.length-1] / count;
  const pts = [];
  let ri = 0;
  for (let n = 0; n < count; n++) {
    const target = n * step;
    while (ri < arcs.length-1 && arcs[ri] < target) ri++;
    const c = 1 - Math.min(1, Math.sqrt(raw[ri].x**2 + raw[ri].y**2) / 20.2);
    pts.push({ x: raw[ri].x*scale+cx, y: raw[ri].y*scale+cy, centrality:c, t:raw[ri].t });
  }
  return pts;
}

/* ────────────────────────────────────────────
   ANATOMICAL HEART POINT GENERATOR
───────────────────────────────────────────── */
function generateAnatomicalPoints(count) {
  // Normalized path tracing the anatomical heart outline (clockwise from top notch)
  const path = [
    [ 0.00, -0.30], [ 0.14, -0.52], [ 0.38, -0.44], [ 0.50, -0.14],
    [ 0.46,  0.12], [ 0.38,  0.36], [ 0.18,  0.52], [ 0.00,  0.60],
    [-0.18,  0.52], [-0.38,  0.34], [-0.46,  0.08], [-0.50, -0.18],
    [-0.38, -0.46], [-0.16, -0.54], [ 0.00, -0.30],
  ];
  const W = canvas.width, H = canvas.height;
  const sc = Math.min(W, H) * 0.36;
  const cx = W / 2, cy = H / 2 + sc * 0.04;

  const arcs = [0];
  for (let i = 1; i < path.length; i++) {
    const dx = (path[i][0]-path[i-1][0])*sc, dy = (path[i][1]-path[i-1][1])*sc;
    arcs.push(arcs[i-1] + Math.sqrt(dx*dx + dy*dy));
  }
  const total = arcs[arcs.length-1];
  const step = total / count;
  const pts = [];
  let si = 0;
  for (let n = 0; n < count; n++) {
    const tgt = n * step;
    while (si < arcs.length-2 && arcs[si+1] < tgt) si++;
    const frac = (tgt - arcs[si]) / Math.max(0.0001, arcs[si+1] - arcs[si]);
    const x = lerp(path[si][0], path[si+1][0], frac) * sc + cx;
    const y = lerp(path[si][1], path[si+1][1], frac) * sc + cy;
    pts.push({ x, y });
  }
  return pts;
}

/* ────────────────────────────────────────────
   PARTICLE ARRAY
───────────────────────────────────────────── */
function buildParticles(count) {
  const heartPts = generateHeartPoints(count);
  STATE.heartPoints = heartPts;
  const anatomPts = generateAnatomicalPoints(count);
  return heartPts.map((p, i) => ({
    targetX: p.x,  targetY: p.y,
    anatomX: anatomPts[i].x, anatomY: anatomPts[i].y,
    lineX: 0, lineY: 0,    // filled in startClassicFloat
    startX: 0, startY: 0,
    scatterX: p.x + (Math.random()-0.5)*canvas.width*1.6,
    scatterY: p.y + (Math.random()-0.5)*canvas.height*1.6,
    centrality: p.centrality,
    fontSize: 10 + p.centrality * 16,
    alpha: 0.38 + p.centrality * 0.62,
    color: `hsl(${340+p.centrality*20},100%,${68+p.centrality*22}%)`,
    phase: Math.random() * Math.PI * 2,
    delay: Math.random() * 1.3,
    progress: 0, settled: false,
    t: p.t,
  }));
}

/* ────────────────────────────────────────────
   VARIANT CONTROLLER
───────────────────────────────────────────── */
function startHeartVariant(idx) {
  const prevVariant = STATE.currentVariant;
  STATE.currentVariant = idx;
  if (STATE.variantTimer) { clearTimeout(STATE.variantTimer); STATE.variantTimer = null; }
  if (!STATE.particles) STATE.particles = buildParticles(62);

  const spinWrap = document.getElementById('spin-wrap');

  if (idx === 1) {
    // Simultaneous cross-fade: canvas and spin-wrap swap with no gap.
    // For Classic→BeatHeart: skip cancelAnimationFrame so the explosion keeps
    // drawing on canvas while it fades out (guard in Classic loop stops it naturally).
    if (prevVariant !== 0) {
      if (STATE.animFrameId) { cancelAnimationFrame(STATE.animFrameId); STATE.animFrameId = null; }
    }
    canvas.style.display   = 'block';
    spinWrap.style.display = 'flex';
    gsap.to(canvas,   { opacity: 0, duration: 1.0, ease: 'power2.in' });
    gsap.fromTo(spinWrap, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out' });
    gsap.delayedCall(1.2, () => { canvas.style.display = 'none'; });
  } else {
    if (STATE.animFrameId) { cancelAnimationFrame(STATE.animFrameId); STATE.animFrameId = null; }
    canvas.style.display   = 'block';
    spinWrap.style.display = 'none';
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' });
  }

  document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===idx));
  document.getElementById('v-label').textContent = VARIANT_LABELS[idx];

  STATE.variantStart = performance.now();
  if      (idx === 0) startClassicFloat();
  else if (idx === 1) startSpinningHeart();
  else                startHeartFill();

  if (idx !== 2) {
    const ms = idx === 0 ? 11000 : 15000;
    STATE.variantTimer = setTimeout(() => startHeartVariant(idx + 1), ms);
  }
}

/* ────────────────────────────────────────────
   DRAGGABLE SHERRY LABEL
───────────────────────────────────────────── */
function setupDraggableSherry() {
  const el = document.getElementById('sherry-label');
  if (!el) return;

  let dragging = false, ox = 0, oy = 0, hintHidden = false;

  function start(x, y) {
    dragging = true;
    if (!hintHidden) {
      hintHidden = true;
      const hint = document.getElementById('sherry-hint');
      if (hint) gsap.to(hint, { opacity: 0, duration: 0.35, onComplete: () => { hint.style.display = 'none'; } });
    }
    const rect = el.getBoundingClientRect();
    // Switch from bottom/transform positioning to explicit left/top
    el.style.bottom    = 'auto';
    el.style.transform = 'none';
    el.style.left      = rect.left + 'px';
    el.style.top       = rect.top  + 'px';
    ox = x - rect.left;
    oy = y - rect.top;
    el.style.cursor = 'grabbing';
  }
  function move(x, y) {
    if (!dragging) return;
    el.style.left = (x - ox) + 'px';
    el.style.top  = (y - oy) + 'px';
  }
  function end() { dragging = false; el.style.cursor = 'grab'; }

  el.style.cursor = 'grab';
  el.addEventListener('mousedown', e => { e.preventDefault(); start(e.clientX, e.clientY); });
  document.addEventListener('mousemove', e => move(e.clientX, e.clientY));
  document.addEventListener('mouseup', end);
  el.addEventListener('touchstart', e => {
    e.preventDefault();
    start(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true }); // body is overflow:hidden — no scroll to prevent
  document.addEventListener('touchend', end);
}

function setupDotNav() {
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => startHeartVariant(parseInt(dot.dataset.v)));
  });
}

/* ────────────────────────────────────────────
   VARIANT 0 — CLASSIC FLOAT
   Phase 1 (0 – CF_P1)     : spring float-in, "I love you" particles
   Phase 2 (CF_P1 – CF_EXP): carousel orbit with quadratic acceleration
   Phase 3 (CF_EXP – end)  : explosion outward → transition to Beating Heart
───────────────────────────────────────────── */
const CF_P1       = 2.8;   // seconds until carousel begins (slow drift-in)
const CF_SPIN_DUR = 9.0;   // seconds of accel phase (longer = slower start)
const CF_RATE_MAX = 0.16;  // rotations/sec at peak (40% lower)
const CF_EXP      = 9.8;   // explosion begins (longer carousel phase)
const CF_TOTAL    = 11.0;  // total duration

function startClassicFloat() {
  const N = STATE.particles.length;
  const idxAtEnd = CF_RATE_MAX * CF_SPIN_DUR / 2 * N;
  const hcx = canvas.width / 2;
  const hcy = canvas.height / 2 - Math.min(canvas.width, canvas.height) * 0.031 * 1.5;

  // Spawn from screen edges so every particle travels a clean path — no teleport
  STATE.particles.forEach(p => {
    p.settled = false;
    p.cfDelay = Math.random() * 0.45;
    const side = Math.floor(Math.random() * 4);
    switch (side) {
      case 0: p.cfStartX = -60;               p.cfStartY = Math.random()*canvas.height; break;
      case 1: p.cfStartX = canvas.width + 60; p.cfStartY = Math.random()*canvas.height; break;
      case 2: p.cfStartX = Math.random()*canvas.width; p.cfStartY = -60;                break;
      default:p.cfStartX = Math.random()*canvas.width; p.cfStartY = canvas.height + 60; break;
    }
    p.x = p.cfStartX; p.y = p.cfStartY;
  });

  function loop(ts) {
    if (STATE.currentVariant !== 0) return;
    const elapsed = (ts - STATE.variantStart) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Live carousel index (continues into explosion phase for position reference)
    let spinIdx = 0;
    if (elapsed >= CF_P1) {
      const se = elapsed - CF_P1;
      spinIdx = se <= CF_SPIN_DUR
        ? CF_RATE_MAX * se * se / (2 * CF_SPIN_DUR) * N
        : idxAtEnd + CF_RATE_MAX * (se - CF_SPIN_DUR) * N;
    }

    // Constant state set once per frame — avoids 62× save/restore overhead
    ctx.shadowColor  = '#ff2d78';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    STATE.particles.forEach((p, i) => {
      const breathe = Math.sin(elapsed * 1.6 + p.phase) * 0.07;
      let px, py, fs, alpha = p.alpha;

      if (elapsed < CF_P1) {
        // Phase 1: direct easeOutCubic lerp from screen edge → target (no teleport)
        const localE = elapsed - p.cfDelay;
        if (localE < 0) return;
        const localT = Math.min(1, localE / Math.max(0.15, CF_P1 - p.cfDelay));
        const e = easeOutCubic(localT);
        px = lerp(p.cfStartX, p.targetX, e);
        py = lerp(p.cfStartY, p.targetY, e);
        p.x = px; p.y = py;
        if (localT >= 1) p.settled = true;
        fs = p.fontSize * (1 + breathe * localT * 0.5);

      } else {
        // Resolve carousel position (shared by phases 2 and 3)
        const raw = (i + spinIdx) % N;
        const i0  = Math.floor(raw) % N;
        const i1  = (i0 + 1) % N;
        const fr  = raw - Math.floor(raw);
        const s0  = STATE.heartPoints[i0], s1 = STATE.heartPoints[i1];
        const carX = lerp(s0.x, s1.x, fr);
        const carY = lerp(s0.y, s1.y, fr);

        if (elapsed < CF_EXP) {
          // Phase 2: carousel orbit
          px = carX; py = carY;
          fs = p.fontSize * (1 + breathe * 0.4);
        } else {
          // Phase 3: explosion — blast outward from heart centre
          const te = easeInOutCubic((elapsed - CF_EXP) / (CF_TOTAL - CF_EXP));
          const dx = carX - hcx, dy = carY - hcy;
          const d  = Math.hypot(dx, dy) || 1;
          const blastR = te * te * Math.min(canvas.width, canvas.height) * 0.9;
          px    = carX + dx / d * blastR;
          py    = carY + dy / d * blastR;
          fs    = p.fontSize * (1 + te * 1.8);
          alpha = p.alpha * (1 - te);
        }
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle   = p.color;
      ctx.font        = `${fs}px 'Dancing Script', cursive`;
      ctx.shadowBlur  = 10 + breathe * 18;
      ctx.fillText('I love you', px, py);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;

    STATE.animFrameId = requestAnimationFrame(loop);
  }
  STATE.animFrameId = requestAnimationFrame(loop);
}

/* ────────────────────────────────────────────
   VARIANT 1 — BEATING HEART (z-buffer rasteriser + ECG monitor)
   Drag cursor/finger close → faster spin + beat + elevated BPM
───────────────────────────────────────────── */
function startSpinningHeart() {
  const pre = document.getElementById('spin-pre');
  if (!pre) return;

  // ASCII rasteriser
  const W = 100, H = 40;
  const CHARS = ' .,-~:;=!*#$@@';
  const zb = new Float32Array(W * H);
  let t = 0, beatPhase = 0, lastTs = performance.now();

  // ECG monitor elements
  const ecgCanvas = document.getElementById('ecg-canvas');
  const ecgCtx    = ecgCanvas ? ecgCanvas.getContext('2d') : null;
  const bpmEl     = document.getElementById('bpm-val');
  const statusEl  = document.getElementById('bpm-status');
  const ECG_W = 220, ECG_H = 44;
  if (ecgCanvas) { ecgCanvas.width = ECG_W; ecgCanvas.height = ECG_H; }

  // Scrolling ECG buffer
  const ecgBuf = new Float32Array(ECG_W).fill(0);
  let ecgHead = 0, ecgPhase = 0, pixAcc = 0;
  const PIX_PER_SEC = ECG_W / 4; // 4-second display window

  // Burst state
  let burstCooldown = false;
  const BURST_SYMBOLS = ['💕', '🩷', '❤️', '💖', '💗', '✦', '✸', '✺'];

  function triggerBurst() {
    if (burstCooldown) return;
    burstCooldown = true;

    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;

    // Shake the ASCII heart
    gsap.to(pre, { x: 9, duration: 0.04, yoyo: true, repeat: 10, ease: 'none',
      onComplete: () => gsap.set(pre, { x: 0 }) });

    // Brightness flash on the whole spin-wrap
    const sw = document.getElementById('spin-wrap');
    gsap.fromTo(sw,
      { filter: 'brightness(5) saturate(2)' },
      { filter: 'brightness(1) saturate(1)', duration: 0.55, ease: 'power3.out' });

    // Burst particles
    const count = 18;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.style.cssText = `position:fixed;pointer-events:none;z-index:200;`
        + `font-size:${13 + Math.random() * 15}px;left:${cx}px;top:${cy}px;`
        + `transform:translate(-50%,-50%);display:block;`;
      el.textContent = BURST_SYMBOLS[Math.floor(Math.random() * BURST_SYMBOLS.length)];
      document.body.appendChild(el);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.38;
      const dist  = 80 + Math.random() * 200;
      gsap.fromTo(el,
        { x: 0, y: 0, opacity: 1, scale: 1 + Math.random() * 0.5 },
        { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
          opacity: 0, scale: 0.1,
          duration: 0.5 + Math.random() * 0.4, ease: 'power2.out',
          onComplete: () => el.remove() });
    }

    // Re-arm after 2.2 s (only if still in this variant)
    setTimeout(() => { if (STATE.currentVariant === 1) burstCooldown = false; }, 2200);
  }

  function ecgVal(ph) {
    const p = ((ph % 1) + 1) % 1;
    if (p < 0.10) return 0;
    if (p < 0.18) return 0.14 * Math.sin((p - 0.10) / 0.08 * Math.PI);   // P
    if (p < 0.28) return 0;
    if (p < 0.30) return -(p - 0.28) / 0.02 * 0.18;                       // Q
    if (p < 0.33) return -0.18 + (p - 0.30) / 0.03 * 1.18;               // R up
    if (p < 0.37) return 1.00 - (p - 0.33) / 0.04 * 1.28;               // R down
    if (p < 0.40) return -0.28 + (p - 0.37) / 0.03 * 0.28;              // S recovery
    if (p < 0.55) return 0;
    if (p < 0.70) return 0.26 * Math.sin((p - 0.55) / 0.15 * Math.PI);   // T
    return 0;
  }

  function drawECG() {
    if (!ecgCtx) return;
    ecgCtx.clearRect(0, 0, ECG_W, ECG_H);
    // Grid
    ecgCtx.strokeStyle = 'rgba(255,40,60,0.07)';
    ecgCtx.lineWidth = 1;
    for (let x = 0; x <= ECG_W; x += 28) { ecgCtx.beginPath(); ecgCtx.moveTo(x,0); ecgCtx.lineTo(x,ECG_H); ecgCtx.stroke(); }
    for (let y = 0; y <= ECG_H; y += ECG_H/3) { ecgCtx.beginPath(); ecgCtx.moveTo(0,y); ecgCtx.lineTo(ECG_W,y); ecgCtx.stroke(); }
    // Trace
    ecgCtx.beginPath();
    ecgCtx.strokeStyle = '#ff3355';
    ecgCtx.lineWidth = 1.5;
    ecgCtx.shadowColor = '#ff0033';
    ecgCtx.shadowBlur = 5;
    for (let i = 0; i < ECG_W; i++) {
      const bi = (ecgHead - ECG_W + i + ECG_W * 4) % ECG_W;
      const y  = ECG_H * 0.5 - ecgBuf[bi] * ECG_H * 0.43;
      if (i === 0) ecgCtx.moveTo(0, y); else ecgCtx.lineTo(i, y);
    }
    ecgCtx.stroke();
    // Fade leading edge so trace looks like it's being drawn
    const g = ecgCtx.createLinearGradient(0, 0, ECG_W * 0.15, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ecgCtx.fillStyle = g; ecgCtx.fillRect(0, 0, ECG_W * 0.15, ECG_H);
  }

  function frame(ts) {
    if (STATE.currentVariant !== 1) return;

    const dt = Math.min(ts - lastTs, 50);
    lastTs = ts;

    // Cursor proximity (0 = far, 1 = at centre)
    const hw = window.innerWidth / 2, hh = window.innerHeight / 2;
    const maxDist = Math.min(hw, hh) * 0.85;
    const cursorDist = CURSOR.x > -999 ? Math.hypot(CURSOR.x - hw, CURSOR.y - hh) : maxDist;
    const proximity = Math.max(0, 1 - cursorDist / maxDist);

    // Max speed 40% lower than before (was 6×, now 3.6×)
    const speedMult = 1 + proximity * 2.6;
    t         += 0.001 * dt * speedMult;
    beatPhase += 0.006 * dt * speedMult;
    const beatPulse = proximity * 0.16 * Math.max(0, Math.sin(beatPhase));

    // BPM: 62 resting → 200 max
    const bpm = Math.round(62 + proximity * 138);
    if (bpmEl) bpmEl.textContent = bpm;
    if (statusEl) {
      if      (bpm < 90)  { statusEl.textContent = 'NORMAL';   statusEl.style.color = '#00e87a'; }
      else if (bpm < 140) { statusEl.textContent = 'ELEVATED'; statusEl.style.color = '#ffaa00'; }
      else                { statusEl.textContent = 'CRITICAL'; statusEl.style.color = '#ff3355'; }
    }
    if (bpm >= 192) triggerBurst();

    // Advance ECG buffer
    ecgPhase += (bpm / 60) * dt / 1000;
    pixAcc   += PIX_PER_SEC * dt / 1000;
    while (pixAcc >= 1) {
      ecgBuf[ecgHead] = ecgVal(ecgPhase);
      ecgHead = (ecgHead + 1) % ECG_W;
      pixAcc--;
    }
    drawECG();

    // ASCII rasteriser
    zb.fill(0);
    let maxz = 0;
    const c = Math.cos(t), s = Math.sin(t);
    for (let yi = 0; yi <= 100; yi++) {
      const y = -0.5 + yi * 0.01;
      const r = 0.4 + 0.05 * Math.pow(0.5 + 0.5 * Math.sin(t * 6 + y * 2), 8) + beatPulse;
      for (let xi = 0; xi <= 100; xi++) {
        const x = -0.5 + xi * 0.01;
        let z = -x*x - Math.pow(1.2*y - Math.abs(x)*2/3, 2) + r*r;
        if (z < 0) continue;
        z = Math.sqrt(z) / (2 - y);
        for (let tz = -z; tz <= z; tz += z / 6) {
          const nx = x*c - tz*s, nz = x*s + tz*c;
          const pv = 1 + nz / 2;
          const vx = Math.round((nx*pv + 0.5) * 80 + 10);
          const vy = Math.round((-y*pv + 0.5) * 39 + 2);
          if (vx < 0 || vx >= W || vy < 0 || vy >= H) continue;
          const idx = vx + vy * W;
          if (zb[idx] <= nz) { zb[idx] = nz; if (maxz < nz) maxz = nz; }
        }
      }
    }
    const rows = [];
    for (let row = 0; row < H; row++) {
      let line = '';
      for (let col = 0; col < W; col++) {
        const ci = maxz > 0 ? Math.round(zb[row*W+col] / maxz * 13) : 0;
        line += CHARS[ci] || ' ';
      }
      rows.push(line);
    }
    pre.textContent = rows.join('\n');
    STATE.animFrameId = requestAnimationFrame(frame);
  }
  STATE.animFrameId = requestAnimationFrame(frame);
}

/* ────────────────────────────────────────────
   VARIANT 2 — HEARTS FILL (spring-mass physics)
   ♥ chars fill the heart; cursor/swipe repels
   them; spring pulls back when force is gone.
───────────────────────────────────────────── */
const FILL_SPRING   = 0.008;
const FILL_FRICTION = 0.92;
const FILL_REPEL_R  = 180;
const FILL_REPEL_F  = 2.75;

function buildFilledHeartParticles(count) {
  const W = canvas.width, H = canvas.height;
  const sc = Math.min(W, H) * 0.78;
  const cx = W / 2, cy = H / 2;
  const r  = 0.44;
  const pts = [];
  let attempts = 0;
  while (pts.length < count && attempts < count * 60) {
    attempts++;
    const hx = (Math.random() - 0.5);
    const hy = (Math.random() - 0.5);
    if (-hx*hx - Math.pow(1.2*hy - Math.abs(hx)*2/3, 2) + r*r >= 0) {
      const ox = hx * sc + cx;
      const oy = -hy * sc + cy;
      pts.push({
        ox, oy, x: ox, y: oy, vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
        size:  9 + Math.random() * 9,
        color: `hsl(${330 + Math.random()*30},${88+Math.random()*12}%,${60+Math.random()*22}%)`,
        alpha: 0.5 + Math.random() * 0.5,
      });
    }
  }
  return pts;
}

function startHeartFill() {
  if (!STATE.fillParticles) STATE.fillParticles = buildFilledHeartParticles(1062);

  function loop() {
    if (STATE.currentVariant !== 2) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur   = 0;

    STATE.fillParticles.forEach(p => {
      const ax = FILL_SPRING * (p.ox - p.x);
      const ay = FILL_SPRING * (p.oy - p.y);
      let rfx = 0, rfy = 0;
      // Find closest point on cursor's swept segment this frame
      const scx = CURSOR.px > -999 ? CURSOR.px : CURSOR.x;
      const scy = CURSOR.py > -999 ? CURSOR.py : CURSOR.y;
      const segDx = CURSOR.x - scx, segDy = CURSOR.y - scy;
      const segLen2 = segDx*segDx + segDy*segDy;
      let cx, cy;
      if (segLen2 < 1) {
        cx = CURSOR.x; cy = CURSOR.y;
      } else {
        const t = Math.max(0, Math.min(1, ((p.x - scx)*segDx + (p.y - scy)*segDy) / segLen2));
        cx = scx + t*segDx; cy = scy + t*segDy;
      }
      const dx = p.x - cx, dy = p.y - cy;
      const d2 = dx*dx + dy*dy;
      if (d2 < FILL_REPEL_R * FILL_REPEL_R && d2 > 0.01) {
        const d = Math.sqrt(d2);
        // Scale force up for fast swipes (cap at 4×)
        const speedBoost = Math.min(4, 1 + Math.sqrt(segLen2) / 60);
        const f = FILL_REPEL_F * speedBoost * (1 - d / FILL_REPEL_R);
        rfx = dx / d * f;
        rfy = dy / d * f;
      }
      p.vx = (p.vx + ax + rfx) * FILL_FRICTION;
      p.vy = (p.vy + ay + rfy) * FILL_FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.font        = `${p.size}px sans-serif`;
      ctx.fillText('♥', p.x, p.y);
    });

    ctx.globalAlpha  = 1;
    ctx.shadowBlur   = 0;

    STATE.animFrameId = requestAnimationFrame(loop);
  }
  STATE.animFrameId = requestAnimationFrame(loop);
}

/* ────────────────────────────────────────────
   DRAW HELPER
───────────────────────────────────────────── */
function drawText(x, y, size, color, alpha, blur) {
  ctx.save();
  ctx.globalAlpha  = alpha;
  ctx.fillStyle    = color;
  ctx.font         = `${size}px 'Dancing Script', cursive`;
  ctx.shadowColor  = '#d4003a';
  ctx.shadowBlur   = blur;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('I love you', x, y);
  ctx.restore();
}

/* ────────────────────────────────────────────
   MATH HELPERS
───────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
