"use strict";
// Shared interactions for the rooms of Dee's Cyber Corner.
(() => {
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  let entering = false;
  document.querySelectorAll("a.portal-trigger").forEach(link => {
    link.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduceMotion()) return;
      if (entering) { event.preventDefault(); return; }
      event.preventDefault(); entering = true;
      const overlay = document.createElement("div"); overlay.className = "level-transition";
      const label = document.createElement("p"); label.className = "level-kicker";label.textContent = "ACCESS GRANTED";
      const title = document.createElement("p");title.className = "level-title"; title.textContent = "NEW LEVEL UNLOCKED";
      const indicator = document.createElement("progress");indicator.max = 100;indicator.value = 0;indicator.setAttribute("aria-label", "Opening the next page");
      const status = document.createElement("div");status.setAttribute("role", "status");status.append(label, title, indicator);
      const skip = document.createElement("button");skip.type = "button";skip.textContent = "Continue now";
      overlay.append(status, skip);document.body.append(overlay);
      let frame; const started = performance.now();
      const go = () => { cancelAnimationFrame(frame); window.location.assign(link.href); };
      skip.addEventListener("click",go);skip.focus({preventScroll:true});
      function tick(now) { indicator.value = Math.min(100, (now - started) / 8.5);if(now-started >= 900) go();else frame=requestAnimationFrame(tick); }
      frame=requestAnimationFrame(tick);
    });
  });
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
      try{const response=await fetch(endpoint,{method:"POST",body:data,headers:{Accept:"application/json"}});if(!response.ok)throw Error("delivery");status.textContent="Your message has been submitted. Thank you for reaching out.";form.reset();}catch{status.textContent="Your message could not be sent. Please try again or use Email Dee.";}finally{submit.disabled=false;}return;
    }
    const subject=String(data.get("subject")).replace(/[\r\n]/g," ");
    const body=`Name: ${data.get("name")}\nReply email: ${data.get("email")}\n\n${data.get("message")}`;
    status.textContent="Your email app should open with your draft. Review the message and press Send there. If it does not open, use Email Dee or copy your message.";
    const draft=document.createElement("a");draft.href=`mailto:deniquamarie@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;draft.hidden=true;document.body.append(draft);draft.click();draft.remove();
  });
})();

const careerPanelButtons = [...document.querySelectorAll('[data-career-panel]')];
careerPanelButtons.forEach(button=>button.addEventListener('click',()=>{
  careerPanelButtons.forEach(item=>{const chosen=item===button;item.setAttribute('aria-pressed',String(chosen));document.getElementById(item.dataset.careerPanel).hidden=!chosen;});
  const panel=document.getElementById(button.dataset.careerPanel);panel.querySelector('h2').focus({preventScroll:true});
  if(matchMedia('(max-width: 850px)').matches)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panel.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:230,easing:'ease-out'});
}));
