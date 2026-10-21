"use strict";
/* Game layer: rooms are levels. Visiting unlocks them, actions earn achievements, progress stays in this browser only. */
(() => {
  const LEVELS = [
    { n: 1, file: "about.html", name: "The Origin Story", short: "About Me" },
    { n: 2, file: "labs.html", name: "The Operations Room", short: "Projects" },
    { n: 3, file: "careers.html", name: "The Career Observatory", short: "Paths in Tech" },
    { n: 4, file: "resources.html", name: "The Resource Library", short: "Resources" },
    { n: 5, file: "blog.html", name: "Dee’s Corner", short: "Blog" },
    { n: 6, file: "contact.html", name: "The Conversation Room", short: "Contact" }
  ];
  const ACHIEVEMENTS = {
    "identity": ["Identity Verified", "Watched the facial scan lock on at headquarters."],
    "investigator": ["Investigator", "Opened a full case study."],
    "analyst": ["Analyst", "Filtered the project workspace."],
    "pathfinder": ["Pathfinder", "Explored three career paths."],
    "reader": ["Story Reader", "Read a story to the end."],
    "teamplayer": ["Team Player", "Found your team in the Paths in Tech quiz."],
    "explorer": ["Explorer", "Unlocked every level of Dee’s Cyber Corner."]
  };
  const KEY = "dee-cyber-progress";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inProjects = location.pathname.includes("/projects/");
  const inStories = location.pathname.includes("/stories/");
  const prefix = inProjects || inStories ? "../" : "";
  const file = location.pathname.split("/").pop() || "index.html";
  const level = inProjects ? LEVELS[1] : inStories ? LEVELS[4] : LEVELS.find(l => l.file === file || (file === "learn.html" && l.n === 3));

  let sawArrival = false;
  let state = { levels: [], achievements: [] };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const xp = () => state.levels.length * 100 + state.achievements.length * 50;
  const maxXp = LEVELS.length * 100 + Object.keys(ACHIEVEMENTS).length * 50;
  const pad = n => String(n).padStart(2, "0");

  // HUD in the header: current rank and XP, opens the mission map.
  const header = document.querySelector(".world-header");
  const hud = document.createElement("button");
  hud.type = "button";
  hud.className = "game-hud";
  hud.setAttribute("aria-haspopup", "dialog");
  const renderHud = () => {
    const pct = Math.round((xp() / maxXp) * 100);
    hud.innerHTML = `<span class="game-hud-lvl">LVL ${pad(state.levels.length)}</span><span class="game-hud-bar" aria-hidden="true"><span style="width:${pct}%"></span></span><span class="game-hud-xp">${xp()} XP</span>`;
    hud.setAttribute("aria-label", `Mission map. ${state.levels.length} of ${LEVELS.length} levels unlocked, ${xp()} experience points.`);
  };
  if (header) { const nav = header.querySelector("nav"); if (nav) nav.after(hud); else header.append(hud); }
  renderHud();

  // Toasts queue so unlocks and achievements never stack on top of each other.
  const queue = [];
  let showing = false;
  const live = document.createElement("div");
  live.className = "visually-hidden"; live.setAttribute("role", "status");
  document.body.append(live);
  function toast(kind, kicker, title, reward) {
    queue.push({ kind, kicker, title, reward });
    if (!showing) next();
  }
  function next() {
    const item = queue.shift();
    if (!item) { showing = false; return; }
    if (document.querySelector(".level-transition, .cinema-door")) { queue.unshift(item); setTimeout(next, 400); return; }
    showing = true;
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    if (item.kind === "level") {
      // Chapter title card: thin lines draw out from the centre, the room name resolves between them.
      el.className = "game-card";
      el.innerHTML = `<img class="gc-butterfly" src="${prefix}assets/images/lab-butterfly.webp" alt="" width="44" height="44"><span class="gc-line"></span><p class="gc-kicker">${item.kicker}</p><p class="gc-title">${item.title}</p><p class="gc-reward">+${item.reward} XP</p><span class="gc-line"></span>`;
    } else {
      el.className = "game-badge";
      el.innerHTML = `<img src="${prefix}assets/images/lab-butterfly.webp" alt="" width="34" height="34"><span class="gb-copy"><span class="gb-kicker">${item.kicker}</span><span class="gb-title">${item.title}</span></span><span class="gb-xp">+${item.reward} XP</span>`;
    }
    document.body.append(el);
    live.textContent = `${item.kicker}: ${item.title}. ${item.reward} experience points.`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-in")));
    const hold = item.kind === "level" ? 3400 : 3200;
    setTimeout(() => { el.classList.remove("is-in"); el.classList.add("is-out"); }, hold);
    setTimeout(() => { el.remove(); next(); }, hold + 700);
  }

  function award(id) {
    if (!ACHIEVEMENTS[id] || state.achievements.includes(id)) return;
    state.achievements.push(id); save(); renderHud();
    toast("achievement", "Achievement unlocked", ACHIEVEMENTS[id][0], 50);
  }
  function unlock(lv) {
    if (state.levels.includes(lv.n)) return;
    state.levels.push(lv.n); save(); renderHud();
    toast(sawArrival ? "achievement" : "level", `Level ${pad(lv.n)} unlocked`, lv.name, 100);
    if (state.levels.length === LEVELS.length) award("explorer");
  }

  // Name the level on the existing ACCESS GRANTED arrival screen.
  if (level) {
    const name = () => {
      const scene = document.querySelector(".level-transition .level-scene");
      if (scene) sawArrival = true;
      if (scene && !scene.querySelector(".level-name")) {
        const p = document.createElement("p"); p.className = "level-name";
        p.textContent = `LEVEL ${pad(level.n)} — ${level.name.toUpperCase()}`;
        scene.querySelector(".level-title")?.after(p);
      }
    };
    name();
    new MutationObserver(name).observe(document.body, { childList: true });
    setTimeout(() => unlock(level), 700);
  }

  // Level chip above each room's headline.
  const hero = document.querySelector(".room-intro, .cyber-corner-intro, .interior-hero, .contact-story, .about-story, .showcase-story");
  if (level && hero) {
    const chip = document.createElement("p");
    chip.className = "game-chip";
    const label = inProjects ? "Mission file" : level.short;
    const eyebrowText = (hero.querySelector(".room-eyebrow, .eyebrow, .about-label, .showcase-kicker")?.textContent || "").toLowerCase();
    // Skip the label when the page's own eyebrow already says it (e.g. "About me").
    chip.innerHTML = `<span>LEVEL ${pad(level.n)}</span>${eyebrowText.includes(label.toLowerCase()) ? "" : label}`;
    const back = hero.querySelector(":scope > .room-back, :scope > .hq-return, :scope > .text-link");
    (back || hero.firstElementChild)?.[back ? "after" : "before"](chip);
  }

  // Homepage tiles become level select cards.
  document.querySelectorAll(".studio-destination").forEach(tile => {
    const href = (tile.getAttribute("href") || "").split("/").pop();
    const lv = LEVELS.find(l => l.file === href);
    const copy = tile.querySelector(".studio-destination-copy");
    if (!lv || !copy || copy.querySelector(".game-tile-badge")) return;
    const open = state.levels.includes(lv.n);
    const badge = document.createElement("span");
    badge.className = "game-tile-badge" + (open ? " is-open" : "");
    badge.textContent = `LVL ${pad(lv.n)} · ${open ? "✓ CLEARED" : "▶ START"}`;
    copy.prepend(badge);
  });

  // Project cards read as missions.
  document.querySelectorAll(".world-project").forEach((card, i) => {
    const tag = document.createElement("span");
    tag.className = "game-mission"; tag.setAttribute("aria-hidden", "true");
    tag.textContent = `MISSION ${pad(i + 1)}`;
    card.prepend(tag);
  });

  // Achievements wired to real actions.
  if (inProjects) setTimeout(() => award("investigator"), 1500);
  document.addEventListener("dee:achievement", event => award(event.detail));
  document.addEventListener("click", event => {
    if (event.target.closest("[data-lab-filter]:not([data-lab-filter='all'])")) award("analyst");
  });
  const seenPaths = new Set();
  document.addEventListener("click", event => {
    const pick = event.target.closest(".field-guide nav button, .field-guide nav a");
    if (pick) { seenPaths.add(pick.textContent.trim()); if (seenPaths.size >= 3) award("pathfinder"); }
  });
  if (document.querySelector(".journal-article")) {
    addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max > 0.9) award("reader");
    }, { passive: true });
  }
  const eyes = document.querySelector(".hq-eyes");
  if (eyes) new MutationObserver(() => { if (eyes.classList.contains("is-matched")) award("identity"); }).observe(eyes, { attributes: true, attributeFilter: ["class"] });

  // Mission map dialog.
  const dialog = document.createElement("dialog");
  dialog.className = "game-map";
  dialog.setAttribute("aria-labelledby", "game-map-title");
  const renderMap = () => {
    dialog.innerHTML = `<div class="game-map-head"><p class="game-toast-kicker">MISSION MAP</p><h2 id="game-map-title">Dee’s Cyber Corner</h2>
      <p class="game-map-stats">${state.levels.length}/${LEVELS.length} levels · ${state.achievements.length}/${Object.keys(ACHIEVEMENTS).length} achievements · ${xp()} XP</p></div>
      <ol class="game-levels">${LEVELS.map(l => {
        const open = state.levels.includes(l.n);
        return `<li class="${open ? "is-open" : ""}"><a href="${prefix}${l.file}"><span class="game-level-n">${pad(l.n)}</span><span><strong>${l.name}</strong><small>${l.short}</small></span><span class="game-level-state">${open ? "✓ Cleared" : "Locked · enter to unlock"}</span></a></li>`;
      }).join("")}</ol>
      <h3>Achievements</h3><ul class="game-achievements">${Object.entries(ACHIEVEMENTS).map(([id, [t, d]]) => `<li class="${state.achievements.includes(id) ? "is-open" : ""}"><strong>${state.achievements.includes(id) ? "★" : "☆"} ${t}</strong><small>${d}</small></li>`).join("")}</ul>
      <p class="game-map-note">Progress is saved only in this browser.</p>
      <div class="game-map-actions"><button type="button" class="game-reset">Reset progress</button><button type="button" class="game-close">Close</button></div>`;
    dialog.querySelector(".game-close").addEventListener("click", () => dialog.close());
    dialog.querySelector(".game-reset").addEventListener("click", () => { state = { levels: [], achievements: [] }; save(); renderHud(); renderMap(); });
  };
  document.body.append(dialog);
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  hud.addEventListener("click", () => { renderMap(); if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", ""); });
})();
