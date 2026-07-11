/* ============================================================
   Celina & Diana — 1 aninho ❄  |  interações
   ============================================================ */
const cover   = document.getElementById('cover');
const invite  = document.getElementById('invite');
const music   = document.getElementById('music');
const musicBtn= document.getElementById('musicBtn');
const openBtn = document.getElementById('openInvite');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Música com fade-in suave ---------- */
let fadeTimer = null;
function fadeTo(target, ms = 1400){
  clearInterval(fadeTimer);
  const start = music.volume, steps = 30, dt = ms / steps;
  let i = 0;
  fadeTimer = setInterval(() => {
    i++;
    music.volume = Math.max(0, Math.min(1, start + (target - start) * (i / steps)));
    if (i >= steps) clearInterval(fadeTimer);
  }, dt);
}
async function startMusic(){
  try{
    music.volume = 0;
    await music.play();
    fadeTo(0.42);
    musicBtn.classList.add('playing');
  }catch(e){ /* autoplay bloqueado: usuário liga no botão */ }
}
function stopMusic(){
  fadeTo(0, 500);
  setTimeout(() => music.pause(), 520);
  musicBtn.classList.remove('playing');
}
musicBtn.addEventListener('click', () => {
  if (music.paused) startMusic(); else stopMusic();
});

/* ---------- Abrir convite ---------- */
openBtn.addEventListener('click', async () => {
  await startMusic();
  cover.classList.remove('active');
  cover.style.display = 'none';
  invite.classList.add('visible');
  document.body.classList.add('opened');
  window.scrollTo({ top: 0, behavior: 'instant' });
  observeReveals();
});

/* ---------- Reveal on scroll ---------- */
function observeReveals(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---------- Contagem regressiva ---------- */
const eventDate = new Date('2026-09-05T12:00:00-03:00');
const $days = document.getElementById('days');
const $hours = document.getElementById('hours');
const $minutes = document.getElementById('minutes');
const $seconds = document.getElementById('seconds');
const $msg = document.getElementById('countMsg');
const fmt = n => String(n).padStart(2, '0');
function tick(){
  let diff = eventDate - new Date();
  if (diff <= 0){
    $days.textContent = $hours.textContent = $minutes.textContent = $seconds.textContent = '00';
    if ($msg) $msg.hidden = false;
    return;
  }
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000);  diff %= 3600000;
  const m = Math.floor(diff / 60000);    diff %= 60000;
  const s = Math.floor(diff / 1000);
  $days.textContent = fmt(d); $hours.textContent = fmt(h);
  $minutes.textContent = fmt(m); $seconds.textContent = fmt(s);
}
tick(); setInterval(tick, 1000);

/* ---------- Neve (canvas, com profundidade) ---------- */
const snowCanvas = document.getElementById('snow');
const sctx = snowCanvas.getContext('2d');
let flakes = [];
function resizeSnow(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  snowCanvas.width = innerWidth * dpr;
  snowCanvas.height = innerHeight * dpr;
  snowCanvas.style.width = innerWidth + 'px';
  snowCanvas.style.height = innerHeight + 'px';
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(120, Math.floor(innerWidth / 6));
  flakes = Array.from({ length: count }, () => {
    const depth = Math.random();
    return {
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: 0.8 + depth * 3.2,
      v: 0.25 + depth * 1.1,
      w: Math.random() * Math.PI * 2,
      sway: 0.15 + depth * 0.35,
      a: 0.35 + depth * 0.55
    };
  });
}
function drawSnow(){
  sctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const f of flakes){
    f.y += f.v; f.w += 0.01; f.x += Math.sin(f.w) * f.sway;
    if (f.y > innerHeight + 6){ f.y = -6; f.x = Math.random() * innerWidth; }
    sctx.globalAlpha = f.a;
    sctx.fillStyle = '#eaf6ff';
    sctx.beginPath(); sctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); sctx.fill();
  }
  sctx.globalAlpha = 1;
  requestAnimationFrame(drawSnow);
}

/* ---------- Brilhos dourados (sparkle) ---------- */
const spCanvas = document.getElementById('sparkle');
const spctx = spCanvas.getContext('2d');
let sparks = [];
function resizeSparkle(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  spCanvas.width = innerWidth * dpr;
  spCanvas.height = innerHeight * dpr;
  spCanvas.style.width = innerWidth + 'px';
  spCanvas.style.height = innerHeight + 'px';
  spctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function spawnSpark(){
  if (sparks.length < 40){
    sparks.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      life: 0,
      max: 60 + Math.random() * 60,
      r: 0.6 + Math.random() * 1.8,
      gold: Math.random() > 0.4
    });
  }
}
function drawSparkle(){
  spctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = sparks.length - 1; i >= 0; i--){
    const s = sparks[i]; s.life++;
    const t = s.life / s.max;
    const alpha = Math.sin(t * Math.PI);
    if (t >= 1){ sparks.splice(i, 1); continue; }
    spctx.globalAlpha = alpha;
    spctx.fillStyle = s.gold ? '#f6e4a8' : '#dff2ff';
    spctx.shadowBlur = 8;
    spctx.shadowColor = s.gold ? '#d9b25a' : '#bfe6ff';
    spctx.beginPath(); spctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); spctx.fill();
  }
  spctx.globalAlpha = 1; spctx.shadowBlur = 0;
  requestAnimationFrame(drawSparkle);
}

/* ---------- Boot ---------- */
addEventListener('resize', () => { resizeSnow(); resizeSparkle(); });
resizeSnow(); resizeSparkle();
if (!reduceMotion){
  drawSnow();
  drawSparkle();
  setInterval(spawnSpark, 260);
}
