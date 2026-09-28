(function(){
  const pre=document.getElementById('preloader');
  const pct=document.getElementById('pct');
  const big=document.getElementById('loaderBarText');
  const state=document.getElementById('loaderState');
  const bar=document.getElementById('loaderBar');
  let progress=0;
  const start=performance.now();
  const duration=1900;
  function tick(now){
    const t=Math.min(1,(now-start)/duration);
    progress=Math.floor(t*100);
    if(pct) pct.textContent=progress+'%';
    if(big) big.textContent=progress+'%';
    if(state && progress>=100) state.textContent='COMPLETE';
    if(bar) bar.style.width=progress+'%';
    if(t<1){requestAnimationFrame(tick)}else{setTimeout(()=>pre&&pre.classList.add('hide'),350)}
  }
  requestAnimationFrame(tick);

  const target=new Date('2026-10-03T21:00:00+08:00').getTime();
  function countdown(){
    const x=Math.max(0,target-Date.now());
    const s=Math.floor(x/1000);
    const vals={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),sec:s%60};
    Object.entries(vals).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.textContent=String(v).padStart(2,'0')});
  }
  countdown();setInterval(countdown,1000);

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  const menu=document.querySelector('.menu'),links=document.querySelector('.nav-links');
  if(menu&&links)menu.addEventListener('click',()=>{links.style.display=links.style.display==='flex'?'none':'flex';links.style.flexDirection='column';links.style.position='absolute';links.style.top='64px';links.style.left='0';links.style.right='0';links.style.padding='18px';links.style.background='#080808';links.style.borderBottom='1px solid #303030'});
})();
