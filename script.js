(function(){
  const pre=document.getElementById('preloader'), bar=document.getElementById('loaderBar'), pct=document.getElementById('pct'), textPct=document.getElementById('loaderBarText'), state=document.getElementById('loaderState');
  let n=0;
  const states=[['BOOT SEQUENCE',0],['LOADING UI',25],['MOUNTING COMMUNITY',55],['CHECKING GUILDS',78],['SYSTEM READY',100]];
  const tick=()=>{ n=Math.min(100,n+(n<70?2:1)); if(bar)bar.style.width=n+'%'; if(pct)pct.textContent=n+'%'; if(textPct)textPct.textContent=n+'%'; let s=states[0][0]; for(const item of states){if(n>=item[1])s=item[0]} if(state)state.textContent=s; if(n<100){setTimeout(tick,32)}else{setTimeout(()=>pre&&pre.classList.add('done'),420)}};
  if(pre){window.addEventListener('load',()=>setTimeout(tick,180));setTimeout(()=>{if(n<100){n=100;if(bar)bar.style.width='100%';if(pct)pct.textContent='100%';if(textPct)textPct.textContent='100%';if(state)state.textContent='SYSTEM READY';setTimeout(()=>pre.classList.add('done'),450)}},5000)}
  const menu=document.querySelector('.menu'), nav=document.querySelector('.nav-links');
  if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open')}));}
  const els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e));}else{els.forEach(e=>e.classList.add('visible'))}
  const d=document.getElementById('d'),h=document.getElementById('h'),m=document.getElementById('m'),s=document.getElementById('sec');
  const target=new Date('2026-10-03T21:00:00+08:00').getTime();
  function countdown(){const diff=Math.max(0,target-Date.now());const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),mins=Math.floor(diff%3600000/60000),secs=Math.floor(diff%60000/1000);if(d)d.textContent=String(days).padStart(2,'0');if(h)h.textContent=String(hours).padStart(2,'0');if(m)m.textContent=String(mins).padStart(2,'0');if(s)s.textContent=String(secs).padStart(2,'0')}countdown();setInterval(countdown,1000);

  // Interactive cyberpunk terminal
  const terminalOutput=document.getElementById('terminalOutput');
  const terminalInput=document.getElementById('terminalInput');
  const terminalRun=document.getElementById('terminalRun');
  const terminalQuick=document.querySelectorAll('[data-command]');
  const commands={
    help:{type:'info',text:['AVAILABLE COMMANDS','  help          show this command list','  about         jump to the HerStacks overview','  guild         open the HerStacks guild','  herops        open the HerOps cybersecurity guild','  achievements  show achievements and certifications','  contact       show contact details','  live          show the upcoming live event','  status        show system/community status','  home          return to the top of the site','  clear         clear terminal output']},
    about:{type:'success',text:['HERSTACKS // ABOUT','A community-first technology space for building, connecting, learning and exploring.','Navigating to the About section...'],target:'#about'},
    guild:{type:'success',text:['HERSTACKS GUILD','Official guild: https://krackeddevs.com/guilds/krackeddev-herstacks','Opening the HerStacks guild page...'],url:'https://krackeddevs.com/guilds/krackeddev-herstacks'},
    herops:{type:'success',text:['HEROPS // CYBERSECURITY','Cybersecurity-focused guild for learning, labs and controlled challenges.','Official guild: https://krackeddevs.com/guilds/krackeddev-herops','Opening the HerOps guild page...'],url:'https://krackeddevs.com/guilds/krackeddev-herops',target:'#herops'},
    achievements:{type:'success',text:['ACHIEVEMENTS + CERTS','Bachelor of Computer Science (Hons.) — UiTM Shah Alam','CS50 Web Programming with Python & JavaScript — Harvard University / edX (ongoing)','Python Development — MIMO (2025)','Web Application Development — APU / MDEC (2023)','PHP Programming — APU / MDEC (2023)','Low-Code Development Using OutSystems — APU / MDEC (2023)','Basic PHP & CodeIgniter — JomLaunch Youth (2023)','Responsive Web Design — freeCodeCamp (2022)','Basic Conversational Mandarin — 2016','Navigating to achievements...'],target:'#credentials'},
    contact:{type:'success',text:['CONTACT // HERSTACKS','Email: slytheronyx97@gmail.com','For guild/community matters, use the official KrackedDev guild pages above.','Opening contact information...'],target:'#footer',email:'slytheronyx97@gmail.com'},
    live:{type:'info',text:['LIVE EVENT','03 OCTOBER 2026 // 9:00 PM MYT','WhatsApp group: currently being built.','Navigating to live event...'],target:'#live'},
    status:{type:'success',text:['SYSTEM STATUS','HERSTACKS ........ ONLINE','HEROPS ........... ONLINE','COMMUNITY ......... ACTIVE','WHATSAPP GROUP .... BUILDING','NEXT EVENT ........ 03.10.2026 21:00 MYT']},
    home:{type:'info',text:['HOME','Returning to top...'],target:'#top'},
    clear:{type:'clear',text:[]}
  };
  function terminalWrite(lines,type){if(!terminalOutput)return; lines.forEach(line=>{const el=document.createElement('div');el.className='terminal-line '+(type||'info');el.textContent=line;terminalOutput.appendChild(el)});terminalOutput.scrollTop=terminalOutput.scrollHeight}
  function terminalCommand(raw){
    const cmd=String(raw||'').trim().toLowerCase();
    if(!cmd)return;
    const prompt=document.createElement('div');prompt.className='terminal-line command';prompt.innerHTML='<span class="cmd-prompt">guest@herstacks:~$</span> '+cmd;terminalOutput.appendChild(prompt);
    const item=commands[cmd];
    if(!item){terminalWrite(['COMMAND NOT FOUND: '+cmd,'Type "help" for available commands.'],'error');return;}
    if(item.type==='clear'){terminalOutput.innerHTML='';return;}
    terminalWrite(item.text,item.type);
    if(item.target){setTimeout(()=>document.querySelector(item.target)?.scrollIntoView({behavior:'smooth',block:'start'}),120)}
    if(item.url){setTimeout(()=>window.open(item.url,'_blank','noopener'),250)}
    if(item.email){setTimeout(()=>{const emailLine=document.createElement('div');emailLine.className='terminal-line success';emailLine.innerHTML='<a href="mailto:'+item.email+'">mailto:'+item.email+'</a>';terminalOutput.appendChild(emailLine);terminalOutput.scrollTop=terminalOutput.scrollHeight},150)}
  }
  if(terminalOutput){
    terminalWrite(['HERSTACKS TERMINAL v1.0','Secure community console initialized.','Type "help" to list commands.'],'success');
    if(terminalInput){terminalInput.addEventListener('keydown',e=>{if(e.key==='Enter'){terminalCommand(terminalInput.value);terminalInput.value='';}});}
    if(terminalRun)terminalRun.addEventListener('click',()=>{terminalCommand(terminalInput?.value);if(terminalInput){terminalInput.value='';terminalInput.focus();}});
    terminalQuick.forEach(btn=>btn.addEventListener('click',()=>terminalCommand(btn.dataset.command)));
  }

})();
