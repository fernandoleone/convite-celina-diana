
const cover = document.getElementById('cover');
const invite = document.getElementById('invite');
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
const openBtn = document.getElementById('openInvite');

async function startMusic(){
  try{
    music.volume = .34;
    await music.play();
    musicBtn.classList.add('playing');
    musicBtn.textContent = '❚❚';
  }catch(e){}
}
openBtn.addEventListener('click', async () => {
  await startMusic();
  cover.style.display = 'none';
  invite.classList.add('visible');
  document.body.classList.add('opened');
  window.scrollTo({top:0,behavior:'instant'});
  observeReveals();
});
musicBtn.addEventListener('click', async () => {
  if(music.paused){ await startMusic(); }
  else { music.pause(); musicBtn.classList.remove('playing'); musicBtn.textContent='♫'; }
});

function observeReveals(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

const eventDate = new Date('2026-09-05T12:00:00-03:00');
function tick(){
  let diff = Math.max(0,eventDate-new Date());
  const d = Math.floor(diff/86400000); diff%=86400000;
  const h = Math.floor(diff/3600000); diff%=3600000;
  const m = Math.floor(diff/60000); diff%=60000;
  const s = Math.floor(diff/1000);
  const fmt=n=>String(n).padStart(2,'0');
  days.textContent=fmt(d); hours.textContent=fmt(h); minutes.textContent=fmt(m); seconds.textContent=fmt(s);
}
tick(); setInterval(tick,1000);

// Snow canvas
const canvas=document.getElementById('snow'),ctx=canvas.getContext('2d');
let flakes=[];
function resize(){
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;
  canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  flakes=Array.from({length:Math.min(90,Math.floor(innerWidth/7))},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    r:1+Math.random()*3,v:.35+Math.random()*.9,w:Math.random()*Math.PI*2
  }));
}
function snow(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.fillStyle='rgba(255,255,255,.86)';
  flakes.forEach(f=>{
    f.y+=f.v;f.w+=.01;f.x+=Math.sin(f.w)*.18;
    if(f.y>innerHeight+5){f.y=-5;f.x=Math.random()*innerWidth}
    ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill();
  });
  requestAnimationFrame(snow);
}
addEventListener('resize',resize);resize();snow();
