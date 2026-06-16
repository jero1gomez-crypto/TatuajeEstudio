// ── CURSOR ──
const cur = document.getElementById('cur');
const curTrail = document.getElementById('cur-trail');
let mx=0,my=0;

document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  setTimeout(()=>{
    curTrail.style.left=mx+'px'; curTrail.style.top=my+'px';
  },80);
});

document.querySelectorAll('a,button,[data-cta]').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('on-cta'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('on-cta'));
});

// ── LOADER ──
(function(){
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  const txt    = document.getElementById('loader-txt');
  let pct=0;
  const msgs=['CARGANDO...','PREPARANDO TINTA...','AFILANDO AGUJAS...','LISTO...'];
  let mi=0;
  const iv = setInterval(()=>{
    pct += Math.random()*22+10;
    if(pct>=100){ pct=100; clearInterval(iv); }
    fill.style.width = Math.min(pct,100)+'%';
    const ni = Math.floor((pct/100)*msgs.length);
    if(ni!==mi && ni<msgs.length){ mi=ni; txt.textContent=msgs[mi]; }
    if(pct>=100){
      setTimeout(()=>{
        loader.classList.add('out');
        setTimeout(()=>loader.style.display='none',700);
        triggerHero();
        startCounters();
      },300);
    }
  },100);
})();

// ── HERO GLITCH INTRO ──
function triggerHero(){
  const h1 = document.getElementById('heroH1');
  if(h1){
    h1.style.animation='none';
    setTimeout(()=>{ h1.style.animation=''; }, 50);
  }
}

// ── SCROLL BAR ──
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll',()=>{
  const p = window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  scrollBar.style.width=p+'%';
},{passive:true});

// ── NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
},{passive:true});

// Mobile toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click',()=>{
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── REVEAL ON SCROLL ──
const revIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); revIO.unobserve(e.target); }
  });
},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>revIO.observe(el));

// ── STAT COUNTERS ──
function startCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseInt(el.dataset.count);
    const suffix=el.dataset.suffix||'';
    const dur=1800;
    const start=performance.now();
    (function step(now){
      const p=Math.min((now-start)/dur,1);
      const ease=p<.5?2*p*p:-1+(4-2*p)*p;
      el.textContent=Math.floor(ease*target)+suffix;
      if(p<1) requestAnimationFrame(step);
    })(performance.now());
  });
}

// ── TESTIMONIAL DRAG SCROLL ──
(function(){
  const track = document.getElementById('testiTrack');
  if(!track) return;
  let startX=0,scrollLeft=0,isDragging=false,velX=0,lastX=0,animId;
  track.addEventListener('mousedown',e=>{
    isDragging=true; startX=e.pageX; lastX=e.pageX;
    scrollLeft=track.scrollLeft;
    track.classList.add('dragging');
    cancelAnimationFrame(animId);
  });
  document.addEventListener('mouseup',()=>{
    if(!isDragging) return;
    isDragging=false;
    track.classList.remove('dragging');
    (function momentum(){
      velX*=0.92;
      track.scrollLeft+=velX;
      if(Math.abs(velX)>0.5) animId=requestAnimationFrame(momentum);
    })();
  });
  document.addEventListener('mousemove',e=>{
    if(!isDragging) return;
    e.preventDefault();
    const dx=e.pageX-startX;
    velX=lastX-e.pageX; lastX=e.pageX;
    track.scrollLeft=scrollLeft-dx;
  },{passive:false});
  track.addEventListener('touchstart',e=>{ startX=e.touches[0].pageX; scrollLeft=track.scrollLeft; lastX=startX; },{passive:true});
  track.addEventListener('touchmove',e=>{
    const dx=e.touches[0].pageX-startX;
    velX=lastX-e.touches[0].pageX; lastX=e.touches[0].pageX;
    track.scrollLeft=scrollLeft-dx;
  },{passive:true});
  track.addEventListener('touchend',()=>{
    (function momentum(){ velX*=0.92; track.scrollLeft+=velX; if(Math.abs(velX)>0.5) animId=requestAnimationFrame(momentum); })();
  });
})();

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id==='#') return;
    const target=document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-70,behavior:'smooth'});
  });
});

// ── FORM ──
function handleForm(e){
  e.preventDefault();
  const btn=document.getElementById('formBtn');
  btn.textContent='✓ SOLICITUD ENVIADA — TE CONTACTAMOS EN 24H';
  btn.classList.add('sent');
  btn.disabled=true;
}