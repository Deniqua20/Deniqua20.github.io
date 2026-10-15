"use strict";
(() => {
  const hero=document.querySelector('.studio-hero');
  if(!hero)return; // Standalone blog keeps its ordinary Return link.
  const image=hero.querySelector('.studio-art');
  const scene=document.createElement('div');scene.className='hq-scene';
  image.before(scene);scene.append(image);
  const ns='http://www.w3.org/2000/svg';
  const screens=document.createElementNS(ns,'svg');screens.classList.add('hq-screens');screens.setAttribute('viewBox','0 0 1536 1024');screens.setAttribute('role','group');screens.setAttribute('aria-label','Simulated headquarters computer screens');
  screens.innerHTML=`<defs><clipPath id="hq-map-clip"><path clip-rule="evenodd" d="M1076 330 L1397 303 L1408 506 L1085 513Z M1105 480H1240V530H1105Z"/></clipPath></defs>
    <g clip-path="url(#hq-map-clip)" aria-hidden="true">
      <path class="hq-network-line" d="M1120 385L1220 365L1340 408L1265 453L1150 433L1220 365M1265 453L1220 365"/>
      <g class="hq-network-node"><circle cx="1120" cy="385" r="2"/><circle cx="1220" cy="365" r="2"/><circle cx="1340" cy="408" r="2"/><circle cx="1265" cy="453" r="2"/></g>
      <path d="M1087 463L1400 447L1404 506L1089 512Z" fill="#090e18" opacity=".9"/>
      <svg x="1095" y="466" width="295" height="39" viewBox="0 0 295 39" overflow="hidden"><g class="hq-log-stream">
        <text y="9">AUTH 192.0.2.18  /  SESSION VERIFIED</text><text y="22" class="alert">ALERT 198.51.100.24  /  REVIEW QUEUED</text><text y="35">HOST 203.0.113.8  /  ENDPOINT CONNECTED</text><text y="48">AUTH 192.0.2.18  /  SESSION VERIFIED</text><text y="61" class="alert">ALERT 198.51.100.24  /  REVIEW QUEUED</text><text y="74">HOST 203.0.113.8  /  ENDPOINT CONNECTED</text>
      </g></svg><text class="hq-sim" x="1093" y="460">SIMULATED NETWORK / SECURITY EVENTS</text>
    </g>
    <foreignObject x="0" y="0" width="112" height="209" transform="matrix(1,-.15,.04,1,1423,296)">
      <a xmlns="http://www.w3.org/1999/xhtml" class="hq-computer" href="blog.html" aria-label="Open Cyber Corner on the archive computer"><small>SIMULATED ARCHIVES</small><strong>CYBER<br/>CORNER</strong><span class="hq-archive-stream"><span>JOURNAL / 001</span><span>PERSONAL ARCHIVES</span><span>ACCESS AVAILABLE</span></span><small>OPEN JOURNAL</small></a>
    </foreignObject>`;
  scene.append(screens);
  function registerScreens(){
    // Derive the rendered image content rectangle, including object-fit cropping.
    const width=image.offsetWidth,height=image.offsetHeight,style=getComputedStyle(image);
    const scale=style.objectFit==='cover'?Math.max(width/1536,height/1024):Math.min(width/1536,height/1024);
    const renderedWidth=1536*scale,renderedHeight=1024*scale;
    const position=style.objectPosition.split(' ').map(value=>parseFloat(value)/100);
    const x=image.offsetLeft+(width-renderedWidth)*(Number.isFinite(position[0])?position[0]:.5);
    const y=image.offsetTop+(height-renderedHeight)*(Number.isFinite(position[1])?position[1]:.5);
    Object.assign(screens.style,{left:x+'px',top:y+'px',width:renderedWidth+'px',height:renderedHeight+'px'});
    const target=scene.querySelector('.hq-computer'),box=target.getBoundingClientRect(),bounds=hero.getBoundingClientRect();
    const visible=Math.min(box.right,bounds.right)-Math.max(box.left,bounds.left)>24 && Math.min(box.bottom,bounds.bottom)-Math.max(box.top,bounds.top)>24;
    target.tabIndex=visible?0:-1;if(visible)target.removeAttribute('aria-hidden');else target.setAttribute('aria-hidden','true');
  }
  registerScreens();image.addEventListener('load',registerScreens);if('ResizeObserver' in window)new ResizeObserver(registerScreens).observe(hero);else window.addEventListener('resize',registerScreens);
  const pause=document.createElement('button');pause.className='hq-pause';pause.type='button';pause.textContent='Pause monitor activity';pause.setAttribute('aria-pressed','false');hero.append(pause);
  let userPaused=false;
  pause.addEventListener('click',()=>{userPaused=!userPaused;pause.setAttribute('aria-pressed',String(userPaused));pause.textContent=userPaused?'Resume monitor activity':'Pause monitor activity';updateActivity();});
  function updateActivity(){hero.classList.toggle('hq-paused',userPaused || document.hidden);}
  document.addEventListener('visibilitychange',updateActivity);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const homeURL=location.href,homeTitle=document.title;
  let running=false,shell=null,consoleLayer=null,timeline=null,timer,blogDocument=null,load=null,token=0;
  let inertState=[];
  function blog(){
    if(!load)load=fetch(new URL('blog.html',homeURL)).then(response=>{if(!response.ok)throw Error('Blog unavailable');return response.text();}).then(html=>{blogDocument=new DOMParser().parseFromString(html,'text/html');return blogDocument;}).catch(error=>{load=null;throw error;});
    return load;
  }
  function restore(){inertState.forEach(([element,inert])=>{element.inert=inert;});inertState=[];}
  function clear(){clearTimeout(timer);timeline?.kill();timeline=null;consoleLayer?.remove();consoleLayer=null;}
  function nativeBlog(){clear();location.assign(new URL('blog.html',homeURL).href);}
  function cancel(){token++;clear();shell?.remove();shell=null;restore();running=false;document.body.classList.remove('hq-computer-playing');if(window.gsap)gsap.set([scene,hero.querySelector('.studio-copy'),scene.querySelector('.hq-computer')],{clearProps:'transform,opacity,filter'});}
  function displayBlog(push=true){
    clear();shell=document.createElement('section');shell.className='hq-blog-shell';shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-labelledby','corner-title');
    const content=blogDocument.querySelector('main').cloneNode(true);content.id='cyber-corner-content';shell.append(content);document.body.append(shell);
    shell.querySelector('.hq-return').addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();history.back();});
    shell.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();history.back();}
      if(event.key==='Tab'){const links=[...shell.querySelectorAll('a,button')];const first=links[0],last=links.at(-1);if(event.shiftKey && (document.activeElement===first || !shell.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}}
    });
    if(push)history.pushState({hqCorner:true},'',new URL('blog.html',homeURL));
    document.title='Cyber Corner | Dee’s Cyber Corner';shell.querySelector('.hq-return').focus({preventScroll:true});
    if(window.gsap && !motion.matches)gsap.fromTo(shell,{opacity:0},{opacity:1,duration:.25});
  }
  async function activate(event){
    if(event.defaultPrevented || event.button!==0 || event.metaKey||event.ctrlKey||event.shiftKey||event.altKey || motion.matches || !window.gsap)return;
    if(document.body.classList.contains('cinema-playing')){event.preventDefault();return;}
    event.preventDefault();if(running)return;running=true;const generation=++token;
    document.body.classList.add('hq-computer-playing');window.dispatchEvent(new Event('hq-computer-activate'));
    const fetched=blog();fetched.catch(()=>{});timer=setTimeout(nativeBlog,6000);
    try{
      inertState=[...document.body.children].map(element=>[element,element.inert]);inertState.forEach(([element])=>{element.inert=true;});
      consoleLayer=document.createElement('div');consoleLayer.className='hq-console';consoleLayer.setAttribute('role','dialog');consoleLayer.setAttribute('aria-modal','true');consoleLayer.setAttribute('aria-labelledby','hq-terminal-title');
      consoleLayer.innerHTML='<div class="hq-terminal"><h2 id="hq-terminal-title">DEE’S CYBER CORNER</h2><p class="hq-boot">INITIALIZING SYSTEM...</p><p class="hq-boot">LOADING DIGITAL ARCHIVES...</p><p class="hq-boot">VERIFYING ACCESS...</p><div class="hq-meter" aria-hidden="true"><span></span></div><p class="hq-granted">ACCESS GRANTED</p><p class="hq-unlocked">CYBER CORNER UNLOCKED</p><img class="hq-butterfly" src="assets/images/lab-butterfly.webp" width="38" height="38" alt="" /></div><button class="hq-enter" type="button">Read Cyber Corner now</button>';
      document.body.append(consoleLayer);
      consoleLayer.querySelector('button').addEventListener('click',nativeBlog);consoleLayer.querySelector('button').focus();
      consoleLayer.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();cancel();pause.focus();}if(e.key==='Tab'){e.preventDefault();consoleLayer.querySelector('button').focus();}});
      const computer=scene.querySelector('.hq-computer').getBoundingClientRect();
      const origin=computer.left<innerWidth && computer.right>0?{x:computer.left+computer.width/2,y:computer.top+computer.height/2}:{x:innerWidth*.75,y:innerHeight*.65};
      const terminal=consoleLayer.querySelector('.hq-terminal'),boots=consoleLayer.querySelectorAll('.hq-boot');
      gsap.set(terminal,{x:origin.x-innerWidth/2,y:origin.y-innerHeight/2,scale:.12,opacity:0});
      gsap.set([boots,consoleLayer.querySelector('.hq-granted'),consoleLayer.querySelector('.hq-unlocked'),consoleLayer.querySelector('.hq-butterfly')],{opacity:0});
      timeline=gsap.timeline({onComplete:async()=>{try{await fetched;if(generation===token)displayBlog();}catch{if(generation===token)nativeBlog();}}});
      timeline.to(scene.querySelector('.hq-computer'),{filter:'brightness(1.5)',duration:.25},0)
        .to(terminal,{opacity:1,scale:1,x:0,y:0,duration:.9,ease:'power2.inOut'},.2)
        .to(boots,{opacity:1,stagger:.4,duration:.2},.65)
        .to(consoleLayer.querySelector('.hq-meter span'),{scaleX:1,duration:1.6,ease:'power1.inOut'},.65)
        .to(consoleLayer.querySelector('.hq-granted'),{opacity:1,duration:.25},2.3)
        .to(consoleLayer.querySelector('.hq-unlocked'),{opacity:1,duration:.25},2.55)
        .fromTo(consoleLayer.querySelector('.hq-butterfly'),{opacity:0,rotation:-5,scale:.9},{opacity:1,rotation:3,scale:1,duration:.5},2.6)
        .to(scene,{scale:1.35,transformOrigin:'95% 40%',duration:.9,ease:'power2.inOut'},2.8)
        .to(terminal,{scale:1.1,opacity:0,duration:.5},3.3);
    }catch{nativeBlog();}
  }
  scene.querySelector('.hq-computer').addEventListener('click',activate);
  document.querySelector('.studio-stories')?.addEventListener('click',activate);
  window.addEventListener('popstate',async event=>{
    if(event.state?.hqCorner){try{await blog();if(!running){running=true;document.body.classList.add('hq-computer-playing');inertState=[...document.body.children].map(element=>[element,element.inert]);inertState.forEach(([element])=>{element.inert=true;});}displayBlog(false);}catch{nativeBlog();}return;}
    if(!running)return;
    shell?.remove();shell=null;clear();document.title=homeTitle;
    const finish=()=>{cancel();document.querySelector('.studio-stories')?.focus({preventScroll:true});};
    if(window.gsap&&!motion.matches){timeline=gsap.timeline({onComplete:finish}).fromTo(scene,{scale:1.35},{scale:1,duration:.75,ease:'power2.inOut'});timer=setTimeout(finish,1100);}else finish();
  });
  window.addEventListener('pagehide',cancel);
  window.addEventListener('pageshow',async event=>{if(event.persisted && history.state?.hqCorner){try{await blog();running=true;document.body.classList.add('hq-computer-playing');inertState=[...document.body.children].map(element=>[element,element.inert]);inertState.forEach(([element])=>{element.inert=true;});displayBlog(false);}catch{nativeBlog();}}});
  const changed=()=>{if(motion.matches && running && !shell)nativeBlog();};
  if(motion.addEventListener)motion.addEventListener('change',changed);else motion.addListener(changed);
})();
