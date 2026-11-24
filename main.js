(function(){

/* ══════════════════════════════════════
   HONEYCOMB DIVIDER GENERATOR
══════════════════════════════════════ */
const hcCfg = {
  hcd1:{fill:'rgba(240,168,32,.15)',stroke:'rgba(240,168,32,.3)'},
  hcd2:{fill:'rgba(245,240,224,.18)',stroke:'rgba(245,240,224,.35)'},
  hcd3:{fill:'rgba(184,64,32,.15)',stroke:'rgba(184,64,32,.28)'},
  hcd4:{fill:'rgba(240,168,32,.14)',stroke:'rgba(240,168,32,.28)'},
  hcd5:{fill:'rgba(224,208,144,.2)',stroke:'rgba(224,208,144,.35)'},
  hcd6:{fill:'rgba(26,74,31,.12)',stroke:'rgba(26,74,31,.22)'},
  hcd7:{fill:'rgba(26,74,31,.1)',stroke:'rgba(26,74,31,.2)'},
};

document.querySelectorAll('.hcd').forEach(div=>{
  const cfg = hcCfg[div.id]||{fill:'rgba(255,255,255,.12)',stroke:'rgba(255,255,255,.2)'};
  const W=1440, H=div.offsetHeight||140, r=28;
  const cw=r*Math.sqrt(3), rh=r*1.5;
  const rows=Math.ceil(H/rh)+1;
  const cols=Math.ceil(W/cw)+3;
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio','xMidYMid slice');
  svg.classList.add('hc-svg');
  let idx=0;
  for(let row=0;row<rows;row++){
    const ox=(row%2===1)?cw/2:0;
    for(let col=-1;col<cols;col++){
      const cx=col*cw+ox, cy=row*rh+r;
      const pts=[];
      for(let a=0;a<6;a++){
        const ang=Math.PI/3*a - Math.PI/6;
        pts.push(`${(cx+r*Math.cos(ang)).toFixed(1)},${(cy+r*Math.sin(ang)).toFixed(1)}`);
      }
      const poly=document.createElementNS(ns,'polygon');
      poly.setAttribute('points',pts.join(' '));
      poly.setAttribute('fill',cfg.fill);
      poly.setAttribute('stroke',cfg.stroke);
      poly.setAttribute('stroke-width','1');
      poly.classList.add('hx');
      poly.style.transitionDelay=(idx*0.018).toFixed(3)+'s';
      svg.appendChild(poly);
      idx++;
    }
  }
  div.appendChild(svg);
});

/* Animate honeycombs when scrolled into view */
const hcObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('vis');hcObs.unobserve(e.target);}
  });
},{threshold:.1});
document.querySelectorAll('.hcd').forEach(d=>hcObs.observe(d));

/* ══════════════════════════════════════
   BEE
══════════════════════════════════════ */
const beeEl=document.getElementById('bee-wrap');
let beeX=window.innerWidth*.86, beeY=window.innerHeight*.79;
let hoverT=0, scrollDy=0, lastSY=0, beeAlive=true;

function setPos(x,y,rot,flip){
  beeEl.style.transform=`translate(${x-44}px,${y-29}px) rotate(${rot}deg)${flip?' scaleX(-1)':''}`;
}

(function loop(){
  if(!beeAlive) return;
  hoverT+=.02;
  scrollDy*=.92;
  const tx=window.innerWidth*.86+Math.sin(hoverT*.55)*18;
  const ty=window.innerHeight*.79+Math.sin(hoverT)*13+scrollDy;
  beeX+=(tx-beeX)*.055; beeY+=(ty-beeY)*.055;
  setPos(beeX,beeY,Math.sin(hoverT*.4)*7+scrollDy*.12,false);
  requestAnimationFrame(loop);
})();

window.addEventListener('scroll',()=>{
  const sy=window.scrollY, d=sy-lastSY; lastSY=sy;
  scrollDy=Math.max(-55,Math.min(55,scrollDy+d*.12));
},{passive:true});

/* ══ Bee click ══ */
const beeAchs=[
  ['🐝','Bienenflüsterer! Du hast mich gefunden!'],
  ['🍯','Honigsucher! NBL gewann den Clima Click Award!'],
  ['🌸','Schwarmführer! BMS erhielt den LuPoleo Award!'],
  ['🏆','Du hast alle Geheimnisse entdeckt! 🎉'],
];
let beeAchIdx=0, beeClicks=0;
const popup=document.getElementById('bee-popup');
const bpText=document.getElementById('bp-text');
let ptimer=null;

beeEl.addEventListener('click',()=>{
  beeClicks++;
  beeEl.classList.remove('spin'); void beeEl.offsetWidth; beeEl.classList.add('spin');
  setTimeout(()=>beeEl.classList.remove('spin'),600);
  if(beeClicks===5){triggerEasterEgg();return;}
  const a=beeAchs[Math.min(beeAchIdx,beeAchs.length-1)];
  document.querySelector('.bp-icon').textContent=a[0];
  bpText.textContent=a[1];
  const br=beeEl.getBoundingClientRect();
  popup.style.left=Math.max(10,Math.min(window.innerWidth-300,br.left-220))+'px';
  popup.style.top=Math.max(10,br.top-95)+'px';
  popup.style.transform='';
  popup.className='bee-popup show';
  clearTimeout(ptimer);
  ptimer=setTimeout(()=>{popup.classList.add('hide');setTimeout(()=>popup.className='bee-popup',400);},3200);
  if(beeAchIdx<beeAchs.length-1) beeAchIdx++;
});

/* ══ Easter Egg ══ */
function triggerEasterEgg(){
  for(let i=0;i<40;i++) setTimeout(spawnBee,i*65);
  document.querySelector('.bp-icon').textContent='🎉';
  bpText.textContent='Easter Egg gefunden! Du hast einen Bienenschwarm ausgelöst! 🐝🐝🐝';
  const br=beeEl.getBoundingClientRect();
  popup.style.left=Math.max(10,Math.min(window.innerWidth-300,br.left-120))+'px';
  popup.style.top=Math.max(10,br.top-105)+'px';
  popup.style.transform='';
  popup.className='bee-popup show';
  clearTimeout(ptimer);
  ptimer=setTimeout(()=>{
    popup.classList.add('hide');
    setTimeout(()=>popup.className='bee-popup',400);
    beeAlive=false;
    beeEl.style.transition='transform 1.1s cubic-bezier(.4,0,.6,1),opacity .9s ease';
    beeEl.style.transform=`translate(${window.innerWidth+200}px,${beeY-220}px) rotate(25deg) scale(.2)`;
    beeEl.style.opacity='0';
    setTimeout(()=>beeEl.style.display='none',1200);
  },4200);
  confetti();
}
function spawnBee(){
  const b=document.createElement('div');
  const sy=5+Math.random()*82, wy=(Math.random()-.5)*200, wy2=(Math.random()-.5)*120;
  const dur=1300+Math.random()*1400;
  b.style.cssText=`position:fixed;z-index:999;pointer-events:none;font-size:${14+Math.random()*22}px;left:-40px;top:${sy}%;--wy:${wy}px;--wy2:${wy2}px;animation:bswarm ${dur}ms linear forwards;`;
  b.textContent='🐝'; document.body.appendChild(b);
  setTimeout(()=>b.remove(),dur+400);
}

/* ══ Achievements ══ */
let acCount=0;
const acCounterEl=document.getElementById('ac-counter');
const acHintEl=document.getElementById('ac-hint');

function burstDots(cx,cy,color){
  const cols=['#F0A820','#C44A14','#5a8040','#e0d090','#D96910','#b8d490',color];
  for(let i=0;i<16;i++){
    const p=document.createElement('div'); p.className='ac-dot';
    const ang=Math.PI*2/16*i+(Math.random()-.5)*.4;
    const dist=45+Math.random()*65, sz=4+Math.random()*9;
    p.style.cssText=`left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};--tx:${(Math.cos(ang)*dist).toFixed(1)}px;--ty:${(Math.sin(ang)*dist-25).toFixed(1)}px;--d:${(.45+Math.random()*.35).toFixed(2)}s;`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),900);
  }
}

function shatterLock(cx,cy){
  const shards=['🔒','✨','⭐','💥','🌟','✦'];
  for(let i=0;i<8;i++){
    const s=document.createElement('div'); s.className='ac-shard';
    const ang=Math.PI*2/8*i, dist=38+Math.random()*55;
    s.style.cssText=`left:${cx-10}px;top:${cy-10}px;--tx:${(Math.cos(ang)*dist).toFixed(1)}px;--ty:${(Math.sin(ang)*dist-30).toFixed(1)}px;--r:${((Math.random()-.5)*500).toFixed(0)}deg;--d:${(.38+Math.random()*.3).toFixed(2)}s;`;
    s.textContent=shards[i<2?0:1+Math.floor(Math.random()*(shards.length-1))];
    document.body.appendChild(s); setTimeout(()=>s.remove(),900);
  }
}

document.querySelectorAll('#ac-grid .ac').forEach(card=>{
  card.addEventListener('click',()=>{
    if(card.classList.contains('unlocked')) return;
    const r=card.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const bg=card.style.background||'#f5c842';
    shatterLock(cx,cy);
    burstDots(cx,cy,bg);
    card.classList.add('popping');
    setTimeout(()=>card.classList.remove('popping'),750);
    setTimeout(()=>{
      card.classList.add('unlocked'); acCount++;
      acCounterEl.textContent=`${acCount} / 6 freigeschaltet`;
      if(acCount===6){
        acHintEl.textContent='🎉 Alle Achievements freigeschaltet!';
        acHintEl.style.animation='none'; acHintEl.style.opacity='1';
        setTimeout(confetti,200);
      }
    },80);
  });
});

function confetti(){
  const col=['#F0A820','#C44A14','#5a8040','#e0d090','#D96910','#b8d490'];
  for(let i=0;i<60;i++){
    const p=document.createElement('div'); p.className='cp';
    const s=6+Math.random()*8;
    p.style.cssText=`left:${Math.random()*100}vw;top:-20px;width:${s}px;height:${s*1.6}px;background:${col[Math.floor(Math.random()*col.length)]};animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*.5}s;`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),4000);
  }
}

/* ══ Count-up ══ */
function countUp(id,target,dur){
  const el=document.getElementById(id); if(!el) return;
  const t0=performance.now();
  (function s(now){const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,4);el.textContent=Math.round(e*target);p<1?requestAnimationFrame(s):(el.textContent=target);})(performance.now());
}
function countUp60k(id,target,dur){
  const el=document.getElementById(id); if(!el) return;
  const fmt=v=>v>=1000?Math.floor(v/1000)+'.'+String(v%1000).padStart(3,'0'):String(v);
  const t0=performance.now();
  (function s(now){const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,4);el.textContent=fmt(Math.round(e*target));p<1?requestAnimationFrame(s):(el.textContent=fmt(target));})(performance.now());
}
document.getElementById('num60wrap')?.addEventListener('click',()=>{
  const el=document.getElementById('num60wrap');
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
});

/* ══ Schätzspiel ══ */
let schaetzDone=false;

function shootStars(cx,cy,count){
  const icons=['⭐','🌟','✨','🏆','🎯','🌸','🍯'];
  for(let i=0;i<count;i++){
    const s=document.createElement('div'); s.className='sz-star';
    const ang=Math.PI*2/count*i+(Math.random()-.5)*.5;
    const dist=90+Math.random()*160, sz=18+Math.random()*20;
    s.style.cssText=`left:${cx}px;top:${cy}px;--ex:${(Math.cos(ang)*dist).toFixed(1)}px;--ey:${(Math.sin(ang)*dist).toFixed(1)}px;--r:${((Math.random()-.5)*900).toFixed(0)}deg;--sz:${sz}px;--d:${(.55+Math.random()*.65).toFixed(2)}s;animation-delay:${(Math.random()*.12).toFixed(2)}s;`;
    s.textContent=icons[Math.floor(Math.random()*icons.length)];
    document.body.appendChild(s); setTimeout(()=>s.remove(),1800);
  }
}

function nearMissSparks(cx,cy){
  const cols=['#f5c842','#e08020','#5a8040'];
  for(let i=0;i<22;i++){
    const p=document.createElement('div'); p.className='sz-near-dot';
    const ang=Math.PI*2/22*i, dist=55+Math.random()*80, sz=5+Math.random()*8;
    p.style.cssText=`left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};--tx:${(Math.cos(ang)*dist).toFixed(1)}px;--ty:${(Math.sin(ang)*dist).toFixed(1)}px;--d:${(.45+Math.random()*.4).toFixed(2)}s;`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),1200);
  }
}

function showSchaetz(){
  const m=document.getElementById('schaetz-modal'); if(!m) return;
  m.style.display='flex';
  document.querySelectorAll('.schaetz-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const val=parseInt(btn.dataset.val),target=60000,diff=Math.abs(val-target);
      const mr=m.getBoundingClientRect(), cx=mr.left+mr.width/2, cy=mr.top+mr.height/2;
      document.getElementById('schaetz-opts').style.display='none';
      const res=document.getElementById('schaetz-result');

      if(diff===0){
        const flash=document.createElement('div'); flash.className='sz-flash';
        document.body.appendChild(flash); setTimeout(()=>flash.remove(),900);
        shootStars(cx,cy,24);
        setTimeout(confetti,300);
        res.innerHTML=`<span class="sz-perfect-txt">🎯 PERFEKT!</span><div style="font-size:17px;font-weight:800;color:var(--g)">Du kennst Mellifera in- und auswendig!<br>Das ist unglaublich! 🏆</div><button class="schaetz-reveal-btn" id="schaetz-close" style="margin-top:18px">Aufdecken ✨</button>`;
      } else if(diff<10000){
        nearMissSparks(cx,cy);
        setTimeout(()=>shootStars(cx,cy,10),200);
        res.innerHTML=`<div style="font-size:52px;margin-bottom:10px;animation:perfectBounce .6s cubic-bezier(.34,1.8,.64,1)">🌟</div><div style="font-weight:800;color:var(--g)">Sehr nah dran! Du hast ein gutes Gespür für unsere Reichweite!</div><button class="schaetz-reveal-btn" id="schaetz-close">Aufdecken ✨</button>`;
      } else if(val<target){
        res.innerHTML=`<div style="font-size:52px;margin-bottom:10px">😮</div><div style="font-weight:800;color:var(--g)">Unterschätzt! Es waren sogar ${target.toLocaleString('de-DE')}+ Menschen!</div><button class="schaetz-reveal-btn" id="schaetz-close">Aufdecken ✨</button>`;
      } else {
        res.innerHTML=`<div style="font-size:52px;margin-bottom:10px">😄</div><div style="font-weight:800;color:var(--g)">Zu optimistisch – aber wir nehmen das Lob!<br>Es waren ${target.toLocaleString('de-DE')}+.</div><button class="schaetz-reveal-btn" id="schaetz-close">Aufdecken ✨</button>`;
      }

      document.getElementById('schaetz-close').addEventListener('click',()=>{
        m.style.opacity='0';m.style.transition='opacity .3s';
        setTimeout(()=>{
          m.style.display='none';m.style.opacity='';m.style.transition='';schaetzDone=true;
          const w60=document.getElementById('num60wrap');
          if(w60){w60.style.transition='filter .9s ease,opacity .9s ease';w60.style.filter='';w60.style.opacity='';}
          countUp60k('cnt60k',60000,1800);
        },320);
      },{once:true});
    },{once:true});
  });
}

/* ══ IntersectionObserver: section animations ══ */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('.fl,.fr,.ft,.fb,.fz').forEach(el=>el.classList.add('go'));
    const id=e.target.id;
    if(id==='s3') countUp('cnt30',30,1800);
    if(id==='s7'){
      countUp('cnt100',100,1700);
      if(!schaetzDone){
        const w60=document.getElementById('num60wrap');
        if(w60){w60.style.filter='blur(22px)';w60.style.opacity='.08';w60.style.transition='none';}
        setTimeout(showSchaetz,900);
      } else {
        countUp60k('cnt60k',60000,2200);
      }
    }
    obs.unobserve(e.target);
  });
},{threshold:.18});
document.querySelectorAll('.sec').forEach(s=>obs.observe(s));

/* initial anim for first section (already visible) */
setTimeout(()=>document.querySelectorAll('#s1 .fl,#s1 .fr,#s1 .ft,#s1 .fb,#s1 .fz').forEach(el=>el.classList.add('go')),160);

/* ══ 2027 Scratch Cards ══ */
document.querySelectorAll('.hc-cell-27').forEach(cell=>{
  const canvas=cell.querySelector('.sc-canvas');
  if(!canvas) return;
  const W=cell.offsetWidth, H=cell.offsetHeight;
  canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d');
  const grd=ctx.createLinearGradient(0,0,W,H);
  grd.addColorStop(0,'#fbe050'); grd.addColorStop(.55,'#f5c842'); grd.addColorStop(1,'#cc8a10');
  ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(170,100,5,.18)'; ctx.lineWidth=1.5;
  for(let x=-H;x<W+H;x+=14){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+H,H);ctx.stroke();}
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font='28px serif'; ctx.fillStyle='rgba(26,74,31,.5)';
  ctx.fillText('🪣',W/2,H/2-16);
  ctx.font='900 12px Nunito,sans-serif'; ctx.fillStyle='rgba(26,74,31,.4)';
  ctx.fillText('KRATZEN!',W/2,H/2+14);

  let down=false, done=false, chk=null;
  function xyOf(e){
    const r=canvas.getBoundingClientRect();
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    return{x:(cx-r.left)*(W/r.width),y:(cy-r.top)*(H/r.height)};
  }
  function scratch(x,y){
    ctx.globalCompositeOperation='destination-out';
    ctx.beginPath(); ctx.arc(x,y,38,0,Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation='source-over';
  }
  function maybeReveal(){
    if(done) return;
    clearTimeout(chk);
    chk=setTimeout(()=>{
      const d=ctx.getImageData(0,0,W,H).data;
      let n=0; for(let i=3;i<d.length;i+=16) if(d[i]<128) n++;
      if(n/(W*H/4)>.5){
        done=true;
        canvas.style.transition='opacity .6s ease';
        canvas.style.opacity='0';
        canvas.style.pointerEvents='none';
        cell.classList.add('scraped');
        const r=cell.getBoundingClientRect();
        burstDots(r.left+r.width/2,r.top+r.height/2,'#F0A820');
      }
    },60);
  }
  canvas.addEventListener('mousedown',e=>{down=true;const p=xyOf(e);scratch(p.x,p.y);});
  canvas.addEventListener('mousemove',e=>{if(!down)return;const p=xyOf(e);scratch(p.x,p.y);maybeReveal();});
  canvas.addEventListener('mouseup',()=>{down=false;maybeReveal();});
  canvas.addEventListener('mouseleave',()=>down=false);
  canvas.addEventListener('touchstart',e=>{down=true;e.preventDefault();const p=xyOf(e);scratch(p.x,p.y);},{passive:false});
  canvas.addEventListener('touchmove',e=>{if(!down)return;e.preventDefault();const p=xyOf(e);scratch(p.x,p.y);maybeReveal();},{passive:false});
  canvas.addEventListener('touchend',()=>{down=false;maybeReveal();});
});

/* ══ S11 Honey Waben ══ */
(function(){
  const cells=document.querySelectorAll('.hcell');
  const counter=document.getElementById('dk-counter');
  const cta=document.getElementById('dk-cta');
  const xmasReveal=document.getElementById('xmas-reveal');
  const total=cells.length;
  let found=0;

  function honeyBurst(cx,cy){
    const cols=['#F0A820','#D4941A','#D96910','#5a8040','#f5f0e0'];
    for(let i=0;i<18;i++){
      const p=document.createElement('div'); p.className='ac-dot';
      const ang=Math.PI*2/18*i+(Math.random()-.5)*.4;
      const dist=35+Math.random()*55, sz=5+Math.random()*8;
      p.style.cssText=`left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};--tx:${(Math.cos(ang)*dist).toFixed(1)}px;--ty:${(Math.sin(ang)*dist-20).toFixed(1)}px;--d:${(.4+Math.random()*.4).toFixed(2)}s;`;
      document.body.appendChild(p); setTimeout(()=>p.remove(),900);
    }
  }

  function addSnowflakes(){
    const flakes=['❄','❅','❆'];
    for(let i=0;i<35;i++){
      setTimeout(()=>{
        const s=document.createElement('div'); s.className='snowflake';
        const sz=10+Math.random()*18, dur=4+Math.random()*5;
        s.style.cssText=`left:${Math.random()*100}vw;--sz:${sz}px;--dur:${dur}s;--delay:0s;--dx:${((Math.random()-.5)*120).toFixed(0)}px;--rot:${((Math.random()-.5)*540).toFixed(0)}deg;`;
        s.textContent=flakes[Math.floor(Math.random()*flakes.length)];
        document.body.appendChild(s);
        setTimeout(()=>s.remove(),(dur+1)*1000);
      },i*220);
    }
  }

  cells.forEach(cell=>{
    cell.addEventListener('click',()=>{
      if(cell.classList.contains('found')) return;
      const r=cell.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      honeyBurst(cx,cy);
      cell.classList.add('found');
      found++;
      if(found<total){
        counter.textContent=`🍯 ${found} / ${total} Worte gefunden – weiter so!`;
      } else {
        counter.textContent='✨ Alle Worte gefunden!';
        setTimeout(()=>{
          cta.classList.add('show');
          setTimeout(()=>{
            xmasReveal.classList.add('show');
            addSnowflakes();
          },800);
        },400);
      }
    });
  });
})();

/* ══ S8 Sticky Initiative Panels ══ */
(function(){
  const section=document.getElementById('s8');
  if(!section) return;
  const panels=Array.from(section.querySelectorAll('.s8-panel'));
  const counter=document.getElementById('s8-counter');
  const dots=Array.from(section.querySelectorAll('.s8-dot'));
  const abbrEl=document.getElementById('s8-abbr-display');
  const nameEl=document.getElementById('s8-name-display');
  const n=panels.length;
  const meta=panels.map(p=>({abbr:p.dataset.abbr,name:p.dataset.name}));

  function isMobile(){return window.innerWidth<=768}

  function enableMobile(){
    panels.forEach(p=>{p.style.transform='';p.classList.add('active');});
  }

  if(isMobile()){enableMobile();return;}

  function easeOut(t){return 1-Math.pow(1-t,2.4)}

  let lastIdx=-1;

  function syncLeft(idx){
    if(idx===lastIdx) return;
    lastIdx=idx;
    if(counter) counter.textContent=`0${idx+1} / 0${n}`;
    if(abbrEl) abbrEl.textContent=meta[idx].abbr;
    if(nameEl) nameEl.textContent=meta[idx].name;
    dots.forEach((d,i)=>d.classList.toggle('active',i<=idx));
  }

  function update(){
    const rect=section.getBoundingClientRect();
    const scrollable=section.offsetHeight-window.innerHeight;
    if(scrollable<=0) return;
    const progress=Math.max(0,Math.min(1,-rect.top/scrollable));
    let topActive=0;
    panels.forEach((panel,i)=>{
      const pp=Math.max(0,Math.min(1,(progress-i/n)*n));
      panel.style.transform=`translateX(${((1-easeOut(pp))*100).toFixed(2)}%)`;
      if(pp>=0.6){panel.classList.add('active');topActive=i;}
    });
    syncLeft(topActive);
  }

  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',()=>{
    if(isMobile()) enableMobile(); else update();
  });
  update();
})();

/* ══ S1 Circle Photo Reveal ══ */
(function(){
  const circle=document.getElementById('s1-circle');
  if(!circle) return;
  circle.addEventListener('click',()=>{
    if(circle.classList.contains('photo-revealed')) return;
    circle.classList.add('photo-revealed');
  });
})();

/* ══ Pollen ══ */
const pc=document.getElementById('pollen');
for(let i=0;i<24;i++){
  const p=document.createElement('div'); p.className='pln';
  p.style.left=(Math.random()*100)+'%';
  p.style.width=p.style.height=(4+Math.random()*5)+'px';
  p.style.animationDuration=(4+Math.random()*5)+'s';
  p.style.animationDelay=(Math.random()*7)+'s';
  pc.appendChild(p);
}

})();
