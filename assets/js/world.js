"use strict";
// Shared interactions for the rooms of Dee's Cyber Corner.
(() => {
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scriptURL = document.currentScript?.src || document.querySelector('script[src*="/world.js"]')?.src || new URL("assets/js/world.js", document.baseURI).href;
  const butterflyURL = new URL("../images/lab-butterfly.webp", scriptURL).href;
  let activeTransition = null;
  const navigationType = performance.getEntriesByType("navigation")[0]?.type;
  if (!reduceMotion() && navigationType !== "back_forward") {
    document.body.classList.add("motion-ready");
    document.documentElement.classList.add("world-smooth");
  }
  // Never cancel native navigation. Effects run only after the destination loads.
  const arrivalKey = "dee-room-arrival";
  document.querySelectorAll("a.portal-trigger").forEach(link => {
    link.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduceMotion() || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
      try { sessionStorage.setItem(arrivalKey, JSON.stringify({path:destination.pathname + destination.search,time:Date.now()})); } catch {}
    });
  });
  let arrival;
  try { arrival=JSON.parse(sessionStorage.getItem(arrivalKey));sessionStorage.removeItem(arrivalKey); } catch {}
  if (arrival && arrival.path === location.pathname + location.search && Date.now()-arrival.time < 8000 && navigationType !== "back_forward" && !reduceMotion()) {
    const initialInert = [...document.body.children].map(element=>({element,wasInert:element.inert}));
    try {
      const overlay = document.createElement("div");
      overlay.className = "level-transition";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "level-title");
      overlay.dataset.phase = "scanning";
      const scan = document.createElement("div");scan.className = "level-scan";scan.setAttribute("aria-hidden", "true");
      const butterfly = document.createElement("img");butterfly.className = "level-butterfly";butterfly.src = butterflyURL;butterfly.alt = "";butterfly.width = 70;butterfly.height = 70;
      const label = document.createElement("p");label.className = "level-kicker";label.textContent = "ACCESS GRANTED";
      const title = document.createElement("p");title.className = "level-title";title.id = "level-title";title.textContent = "NEW LEVEL UNLOCKED";
      const indicator = document.createElement("progress");indicator.className = "level-progress";indicator.max = 100;indicator.value = 0;indicator.setAttribute("aria-label", "Opening the next page");
      const scene = document.createElement("div");scene.className = "level-scene";scene.append(butterfly,label,title,indicator);
      const skip = document.createElement("button");skip.type = "button";skip.className = "level-continue";skip.textContent = "Continue now";
      overlay.append(scan,scene,skip);
      const background = [...document.body.children].map(element => ({element, wasInert:element.inert}));
      background.forEach(({element})=>{element.inert=true;});
      document.body.classList.add("is-transitioning");document.body.append(overlay);
      let frame, navigationTimer;
      const started = performance.now();
      const restore = (focus = false) => {
        cancelAnimationFrame(frame);clearTimeout(navigationTimer);background.forEach(({element,wasInert})=>{element.inert=wasInert;});
        document.body.classList.remove("is-transitioning");overlay.remove();activeTransition=null;
        if(focus){const heading=document.querySelector("main h1");if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}}
      };
      const go = () => restore(true);
      activeTransition={restore,go};
      skip.addEventListener("click",go);
      overlay.addEventListener("keydown",event=>{
        if(event.key==="Escape"){event.preventDefault();restore(true);}
        if(event.key==="Tab"){event.preventDefault();skip.focus();}
      });
      skip.focus({preventScroll:true});
      function tick(now) {
        const elapsed=now-started;
        overlay.dataset.phase=elapsed<650?"scanning":elapsed<850?"access":elapsed<1550?"unlocked":"complete";
        indicator.value=Math.max(0,Math.min(100,(elapsed-1050)/5));
        if(elapsed>=1650)go();else frame=requestAnimationFrame(tick);
      }
      navigationTimer=setTimeout(go,1800);
      frame=requestAnimationFrame(tick);
    } catch {
      activeTransition?.restore();
      initialInert.forEach(({element,wasInert})=>{element.inert=wasInert;});
      document.body.classList.remove("is-transitioning");
      document.querySelectorAll(".level-transition").forEach(element=>element.remove());
    }
  }
  window.addEventListener("pagehide",()=>activeTransition?.restore());
  window.addEventListener("pageshow",event=>{if(event.persisted){activeTransition?.restore();document.body.classList.remove("motion-ready");document.documentElement.classList.remove("world-smooth");}});
  const motionPreference=matchMedia("(prefers-reduced-motion: reduce)");
  const motionChanged=event=>{if(event.matches){document.body.classList.remove("motion-ready");document.documentElement.classList.remove("world-smooth");activeTransition?.go();}};
  if(typeof motionPreference.addEventListener==="function")motionPreference.addEventListener("change",motionChanged);
  else if(typeof motionPreference.addListener==="function")motionPreference.addListener(motionChanged);
  if (!reduceMotion() && "IntersectionObserver" in window) {
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove("reveal-pending");observer.unobserve(entry.target);}});},{threshold:.08});
    document.querySelectorAll(".story-chapters article,.world-project,.library-entry,.case-study-body > div > h2,.showcase-discoveries").forEach(element=>{
      if(element.getBoundingClientRect().top>innerHeight){observer.observe(element);element.classList.add("reveal-pending");}
    });
    window.addEventListener("pageshow",event=>{if(event.persisted){observer.disconnect();document.querySelectorAll(".reveal-pending").forEach(element=>element.classList.remove("reveal-pending"));}});
  }
  const search = document.querySelector("#resource-search");
  if (search) {
    let category = "all";
    const entries = [...document.querySelectorAll(".library-entry")];
    const buttons = [...document.querySelectorAll("[data-resource-filter]")];
    function filter() {
      const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean); let count=0;
      entries.forEach(entry=>{const text=entry.textContent.toLocaleLowerCase();const shown=(category==="all" || entry.dataset.resourceCategory===category) && terms.every(term=>text.includes(term));entry.hidden=!shown;if(shown)count++;});
      document.querySelector("#resource-count").textContent=`${count} ${count===1?"resource":"resources"} available${search.value.trim()?" for your search":""}.`;
      document.querySelector("#resource-empty").hidden=count!==0;
    }
    search.addEventListener("input",filter);
    buttons.forEach(button=>button.addEventListener("click",()=>{category=button.dataset.resourceFilter;buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));filter();}));filter();
  }
  const form = document.querySelector("#contact-form");
  if(form) {
    form.querySelector('[type="submit"]').disabled=false;
    if(form.dataset.endpoint){form.querySelector('[type="submit"]').textContent='Send message';form.querySelector('.form-delivery-note').textContent='Leave your message and a reply address so I can get back to you.';}
  }
  if(form) form.addEventListener("submit",async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form), status=document.querySelector("#contact-status"), submit=form.querySelector('[type="submit"]');
    const endpoint=form.dataset.endpoint;
    if(endpoint){
      submit.disabled=true;status.textContent="Sending your message…";
      try{const response=await fetch(endpoint,{method:"POST",body:data,headers:{Accept:"application/json"}});if(!response.ok)throw Error("delivery");status.textContent="Your message has been submitted. Thank you for reaching out.";form.reset();}catch{status.textContent="Your message could not be sent. Please try again or email deescybercorner@gmail.com.";}finally{submit.disabled=false;}return;
    }
    const subject=String(data.get("subject")).replace(/[\r\n]/g," ");
    const body=`Name: ${data.get("name")}\nReply email: ${data.get("email")}\n\n${data.get("message")}`;
    status.textContent="Your email app should open with your draft. Review the message and press Send there. If it does not open, email deescybercorner@gmail.com.";
    const draft=document.createElement("a");draft.href=`mailto:deescybercorner@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;draft.hidden=true;document.body.append(draft);draft.click();draft.remove();
  });
})();

const careerPanelButtons = [...document.querySelectorAll('[data-career-panel]')];
careerPanelButtons.forEach(button=>button.addEventListener('click',()=>{
  careerPanelButtons.forEach(item=>{const chosen=item===button;item.setAttribute('aria-pressed',String(chosen));document.getElementById(item.dataset.careerPanel).hidden=!chosen;});
  const panel=document.getElementById(button.dataset.careerPanel);panel.querySelector('h2').focus({preventScroll:true});
  if(matchMedia('(max-width: 850px)').matches)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches && typeof panel.animate==='function')panel.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:230,easing:'ease-out'});
}));
