"use strict";
/* Resource Library filters and the Holy Grail focus timer. Content stays readable without JavaScript. */
(() => {
  // Library bookshelf: tap a spine to pull the book out; "only what I've used" dims the rest.
  const lib = document.getElementById("library");
  if (lib) {
    document.documentElement.classList.add("shelf-js");
    const show = (spine) => {
      const shelf = spine.closest(".shelf"), pull = shelf.querySelector(".shelf-pull");
      const open = spine.getAttribute("aria-expanded") === "true";
      shelf.querySelectorAll(".spine").forEach(s => s.setAttribute("aria-expanded", "false"));
      if (open) { pull.hidden = true; return; }
      spine.setAttribute("aria-expanded", "true");
      const d = spine.dataset, used = d.used === "true", fav = d.fav === "true";
      const tag = fav ? "★ Favorite · ✓ I used this" : used ? "✓ I used this" : "+ Recommended";
      pull.className = "shelf-pull" + (fav ? " is-fav" : "");
      pull.innerHTML = "";
      const cover = document.createElement("span"); cover.className = "pull-cover " + [...spine.classList].find(c => c.startsWith("spine-")); cover.setAttribute("aria-hidden", "true");
      const copy = document.createElement("div"); copy.className = "pull-copy";
      const k = document.createElement("p"); k.className = "lib-badge" + (used ? " is-used" : ""); k.textContent = tag; k.style.display = "inline-block";
      const h = document.createElement("h4"); h.textContent = d.name;
      const p = document.createElement("p"); p.textContent = d.note;
      copy.append(k, h, p);
      const a = document.createElement("a"); a.className = "pull-visit"; a.href = d.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Visit ↗"; a.setAttribute("aria-label", `Visit ${d.name} (opens in a new tab)`);
      pull.append(cover, copy, a);
      pull.hidden = false;
    };
    lib.querySelectorAll(".spine").forEach(spine => spine.addEventListener("click", () => show(spine)));
    const toggle = document.getElementById("lib-used");
    toggle.addEventListener("click", () => {
      const on = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", String(on));
      lib.classList.toggle("only-used", on);
    });
  }

  // Holy Grail: a simple Pomodoro timer.
  const startBtn = document.getElementById("focus-start");
  if (startBtn) {
    const box = startBtn.closest(".focus");
    const time = document.getElementById("focus-time");
    const bar = box.querySelector(".focus-bar");
    const done = document.getElementById("focus-done");
    const modes = [...box.querySelectorAll("[data-focus]")];
    const C = 2 * Math.PI * 52;
    let total = 1500, left = 1500, timer = null, endAt = 0;
    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const draw = () => {
      time.textContent = fmt(left);
      bar.style.strokeDashoffset = String(C * (1 - left / total));
    };
    const stop = () => { clearInterval(timer); timer = null; startBtn.textContent = left < total && left > 0 ? "Resume" : "Start"; };
    const tick = () => {
      left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      draw();
      if (left === 0) {
        stop(); startBtn.textContent = "Start";
        done.textContent = total === 1500 ? "Focus session complete. Take a short break." : "Break’s over. Ready for another round?";
        document.title = "✓ " + document.title.replace(/^(\d\d:\d\d · |✓ )/, "");
      } else {
        document.title = fmt(left) + " · " + document.title.replace(/^(\d\d:\d\d · |✓ )/, "");
      }
    };
    startBtn.addEventListener("click", () => {
      if (timer) { stop(); return; }
      if (left === 0) left = total;
      done.textContent = "";
      endAt = Date.now() + left * 1000;
      timer = setInterval(tick, 1000);
      startBtn.textContent = "Pause";
      window.dispatchEvent(new CustomEvent("dee-focus-start"));
    });
    document.getElementById("focus-reset").addEventListener("click", () => {
      stop(); left = total; done.textContent = ""; draw(); startBtn.textContent = "Start";
      document.title = document.title.replace(/^(\d\d:\d\d · |✓ )/, "");
    });
    modes.forEach(btn => btn.addEventListener("click", () => {
      stop(); total = left = Number(btn.dataset.focus);
      modes.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      box.classList.toggle("is-break", total !== 1500);
      done.textContent = ""; draw(); startBtn.textContent = "Start";
    }));
    bar.style.strokeDasharray = String(C);
    draw();
  }
})();
