"use strict";
/* Living eyes and investigation scan on the homepage portrait. Layers sit on the registered artwork; the image itself is untouched. */
(() => {
  const hero = document.querySelector(".studio-hero");
  const scene = hero && hero.querySelector(".hq-scene");
  const screens = scene && scene.querySelector(".hq-screens");
  if (!scene || !screens) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const src = hero.querySelector(".studio-art").getAttribute("src");
  const ns = "http://www.w3.org/2000/svg";
  // Eye openings, iris centres and travel limits in artwork pixels (1536 x 1024).
  const eyes = [
    { id: "l", lid: "M709 261Q725 245 742 263Q727 275 709 261Z", cx: 726, cy: 263, r: 20 },
    { id: "r", lid: "M792 264Q812 245 832 258Q814 274 792 264Z", cx: 815, cy: 260, r: 22 }
  ];
  const svg = document.createElementNS(ns, "svg");
  svg.classList.add("hq-eyes");
  svg.setAttribute("viewBox", "0 0 1536 1024");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<defs>
      <radialGradient id="hq-feather"><stop offset=".62" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
      <filter id="hq-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3"/></filter>
      ${eyes.map(e => `<clipPath id="hq-lid-${e.id}"><path d="${e.lid}"/></clipPath><mask id="hq-iris-${e.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" fill="url(#hq-feather)"/></mask>`).join("")}
    </defs>
    ${eyes.map(e => `<g clip-path="url(#hq-lid-${e.id})"><g class="hq-iris" data-eye="${e.id}"><image href="${src}" width="1536" height="1024" mask="url(#hq-iris-${e.id})"/></g></g>`).join("")}
    <circle class="hq-cyber-glow" cx="815" cy="260" r="7" filter="url(#hq-glow)"/>
    <g class="hq-investigate">
      <path class="hq-bracket" d="M672 196h22M672 196v22M866 196h-22M866 196v22M672 352h22M672 352v-22M866 352h-22M866 352v-22"/>
      <line class="hq-facescan" x1="672" x2="866" y1="196" y2="196"/>
      ${eyes.map(e => `<g class="hq-reticle" transform="translate(${e.cx} ${e.cy})"><circle r="15"/><path d="M-21 0h8M13 0h8M0 -21v8M0 13v8"/></g>`).join("")}
      <g class="hq-readout" transform="translate(872 206)">
        <text y="0">FACIAL SCAN // ACTIVE</text>
        <text y="13" class="hq-match">MATCH 00.0%</text>
        <text y="26">SUBJECT: DEE</text>
        <text y="39" class="hq-clear">CLEARANCE: LEVEL 05</text>
      </g>
    </g>`;
  screens.after(svg);
  const sync = () => { for (const key of ["left", "top", "width", "height"]) svg.style[key] = screens.style[key]; };
  sync();
  new MutationObserver(sync).observe(screens, { attributes: true, attributeFilter: ["style"] });

  const irises = [...svg.querySelectorAll(".hq-iris")];
  const match = svg.querySelector(".hq-match");
  // Travel in artwork pixels: wide side to side, small up and down, as real eyes move inside the lids.
  const limit = { x: 4.2, y: 1.6 };
  let target = { x: 0, y: 0 }, current = { x: 0, y: 0 }, pointer = null, nextSaccade = 0, scanning = false, frame;
  const glances = [[0, 0], [0, 0], [-1, 0.1], [1, 0.1], [-0.7, 0.6], [0.8, -0.5], [0.35, 0.9], [-1, -0.3]];

  hero.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    const box = svg.getBoundingClientRect();
    const ex = box.left + box.width * (770 / 1536), ey = box.top + box.height * (262 / 1024);
    const dx = event.clientX - ex, dy = event.clientY - ey, d = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, d / 260);
    pointer = { x: (dx / d) * reach, y: (dy / d) * reach };
  });
  hero.addEventListener("pointerleave", () => { pointer = null; });

  function paused() { return motion.matches || document.hidden || document.querySelector(".hq-paused"); }
  function tick(now) {
    frame = requestAnimationFrame(tick);
    if (paused()) return;
    if (pointer && !scanning) target = pointer;
    else if (now > nextSaccade) {
      const pick = scanning ? [Math.sin(now / 160), 0.15] : glances[Math.floor(Math.random() * glances.length)];
      target = { x: pick[0], y: pick[1] };
      nextSaccade = now + (scanning ? 120 : 700 + Math.random() * 2200);
    }
    // Saccades are quick, then the eye holds still.
    current.x += (target.x - current.x) * 0.32;
    current.y += (target.y - current.y) * 0.32;
    const tx = (current.x * limit.x).toFixed(2), ty = (current.y * limit.y).toFixed(2);
    irises.forEach(iris => iris.setAttribute("transform", `translate(${tx} ${ty})`));
  }

  // Every so often the room runs an identity check, like an investigation scene.
  function investigate() {
    if (paused() || scanning) return;
    scanning = true;
    svg.classList.add("is-scanning");
    const start = performance.now();
    const count = now => {
      const t = Math.min(1, (now - start) / 1800);
      match.textContent = `MATCH ${(t * 99.2).toFixed(1).padStart(4, "0")}%`;
      if (t < 1) requestAnimationFrame(count);
      else { svg.classList.add("is-matched"); scanning = false; target = { x: 0, y: 0 }; }
    };
    requestAnimationFrame(count);
    setTimeout(() => svg.classList.remove("is-scanning", "is-matched"), 4200);
  }
  function start() {
    cancelAnimationFrame(frame);
    if (motion.matches) { irises.forEach(iris => iris.removeAttribute("transform")); return; }
    frame = requestAnimationFrame(tick);
  }
  start();
  setTimeout(investigate, 2600);
  setInterval(investigate, 14000);
  const changed = () => start();
  if (motion.addEventListener) motion.addEventListener("change", changed); else motion.addListener(changed);
})();
