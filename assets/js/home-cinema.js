"use strict";
(() => {
  const button=document.querySelector('.studio-explore');
  const hero=document.querySelector('.studio-hero');
  if(!button || !hero || !window.gsap)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const art=hero.querySelector('.studio-art'),copy=hero.querySelector('.studio-copy');
  const dark=document.createElement('div'),light=document.createElement('div');
  dark.className='cinema-dark';light.className='cinema-light';
  dark.setAttribute('aria-hidden','true');light.setAttribute('aria-hidden','true');
  hero.append(dark,light);document.body.classList.add('cinema-ready');
  let playing=false,transition,overlay,watchdog,entrance;
  const previous=[];
  function reset(){
    clearTimeout(watchdog);transition?.kill();entrance?.kill();overlay?.remove();overlay=null;
    previous.splice(0).forEach(([element,inert])=>{element.inert=inert;});
    playing=false;document.body.classList.remove('cinema-playing');
    gsap.set([art,copy,light,dark,document.querySelector(".studio-destinations")],{clearProps:'all'});dark.style.opacity='0';
  }
  function navigate(){reset();location.assign(button.href);}
  if(!motion.matches && performance.getEntriesByType('navigation')[0]?.type!=='back_forward'){
    entrance=gsap.timeline().fromTo(dark,{opacity:1},{opacity:0,duration:.5})
      .to(light,{opacity:.65,duration:.7,ease:'sine.out'},.5)
      .fromTo(copy,{opacity:0,y:12},{opacity:1,y:0,duration:.8,ease:'power2.out'},1)
      .fromTo('.studio-destinations',{opacity:0},{opacity:1,duration:.6},1.2);
  }else dark.style.opacity='0';
  hero.addEventListener('pointermove',event=>{
    if(playing || motion.matches || event.pointerType!=='mouse')return;
    const rect=hero.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
    gsap.to(art,{x:x*9,y:y*6,rotationY:x*.5,duration:1.2,ease:'power2.out',overwrite:'auto'});
    gsap.to(light,{x:x*-8,y:y*-5,duration:1.3,overwrite:'auto'});
  });
  hero.addEventListener('pointerleave',()=>{if(!playing)gsap.to([art,light],{x:0,y:0,rotationY:0,duration:1,overwrite:'auto'});});
  button.addEventListener('click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || motion.matches)return;
    event.preventDefault();if(playing)return;playing=true;entrance?.kill();
    // A native destination remains available if any visual enhancement fails.
    watchdog=setTimeout(navigate,4500);
    try{
      gsap.set(dark,{opacity:0});gsap.set(copy,{opacity:1,y:0});
      overlay=document.createElement('div');overlay.className='cinema-door';
      overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','cinema-title');
      overlay.innerHTML='<iframe class="cinema-preview" title="About Me arrival preview" tabindex="-1" aria-hidden="true" inert></iframe><div class="cinema-panel cinema-panel-left" aria-hidden="true"></div><div class="cinema-panel cinema-panel-right" aria-hidden="true"></div><div class="cinema-message"><p class="cinema-access">ACCESS GRANTED</p><p class="cinema-title" id="cinema-title">NEW LEVEL UNLOCKED</p><p class="cinema-level">LEVEL 01 — ABOUT ME</p><div class="cinema-progress" aria-hidden="true"><span></span></div></div><button class="cinema-skip" type="button">Enter About Me now</button>';
      overlay.querySelector('iframe').src=button.href;
      [...document.body.children].forEach(element=>{previous.push([element,element.inert]);element.inert=true;});
      document.body.append(overlay);document.body.classList.add('cinema-playing');
      const skip=overlay.querySelector('button');skip.addEventListener('click',navigate);skip.focus({preventScroll:true});
      overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();reset();button.focus();}if(e.key==='Tab'){e.preventDefault();skip.focus();}});
      const find=selector=>overlay.querySelectorAll(selector);
      transition=gsap.timeline({onComplete:navigate});
      transition.call(()=>{overlay.dataset.phase='activation';},[],0)
        .to(light,{opacity:1,duration:.5},0)
        .call(()=>{overlay.dataset.phase='camera';},[],.5)
        .to(art,{scale:1.16,z:65,rotationY:-1,duration:.7,ease:'power2.inOut'},.5)
        .to(copy,{opacity:.25,z:35,duration:.7},.5)
        .set(find('.cinema-panel'),{opacity:1},1.15)
        .set(find('.cinema-preview'),{opacity:1},1.2)
        .call(()=>{overlay.dataset.phase='doorway';},[],1.2)
        .to(find('.cinema-panel-left'),{xPercent:-103,rotationY:5,duration:.6,ease:'power2.inOut'},1.2)
        .to(find('.cinema-panel-right'),{xPercent:103,rotationY:-5,duration:.6,ease:'power2.inOut'},1.2)
        .call(()=>{overlay.dataset.phase='access';},[],1.8)
        .to(find('.cinema-message'),{opacity:1,duration:.15},1.8)
        .to(find('.cinema-progress span'),{scaleX:1,duration:1.2,ease:'none'},1.8)
        .call(()=>{overlay.dataset.phase='level';},[],2.3)
        .to(find('.cinema-level'),{opacity:1,duration:.2},2.3)
        .fromTo(find('.cinema-preview'),{scale:.97},{scale:1,duration:.7,ease:'power2.out'},2.3)
        .to(find('.cinema-message'),{opacity:0,duration:.2},2.8);
    }catch{navigate();}
  });
  window.addEventListener('pagehide',reset);
  window.addEventListener('pageshow',event=>{if(event.persisted)reset();});
  const changed=()=>{if(motion.matches){if(playing)navigate();else reset();}};
  if(motion.addEventListener)motion.addEventListener('change',changed);else motion.addListener(changed);
})();
