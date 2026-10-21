"use strict";
/* Resource Library filters and the Holy Grail focus timer. Content stays readable without JavaScript. */
(() => {
  // Library: category chips, search, and "only what I've used".
  const search = document.getElementById("lib-search");
  if (search) {
    const chips = [...document.querySelectorAll("[data-lib-cat]")];
    const usedToggle = document.getElementById("lib-used");
    const groups = [...document.querySelectorAll("[data-lib-group]")];
    const count = document.getElementById("lib-count");
    const empty = document.getElementById("lib-empty");
    let category = "all", onlyUsed = false;
    const apply = () => {
      const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      groups.forEach(group => {
        const inCategory = category === "all" || group.dataset.libGroup === category;
        let groupShown = 0;
        group.querySelectorAll(".lib-card").forEach(card => {
          const text = card.textContent.toLowerCase();
          const visible = inCategory && (!onlyUsed || card.dataset.used === "true") && terms.every(t => text.includes(t));
          card.hidden = !visible;
          if (visible) groupShown++;
        });
        group.hidden = groupShown === 0;
        shown += groupShown;
      });
      empty.hidden = shown !== 0;
      const filtered = category !== "all" || onlyUsed || terms.length;
      count.textContent = filtered ? `Showing ${shown} ${shown === 1 ? "resource" : "resources"}.` : "";
    };
    chips.forEach(chip => chip.addEventListener("click", () => {
      category = chip.dataset.libCat;
      chips.forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
      apply();
    }));
    usedToggle.addEventListener("click", () => {
      onlyUsed = !onlyUsed;
      usedToggle.setAttribute("aria-pressed", String(onlyUsed));
      apply();
    });
    search.addEventListener("input", apply);
    apply();
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
/* Open a Holy Grail section when linked to it directly (e.g. resources.html#portfolio). */
(() => {
  const open = () => { const t = location.hash && document.querySelector(`details${location.hash}`); if (t) { t.open = true; t.scrollIntoView({ block: "start" }); } };
  open(); addEventListener("hashchange", open);
})();
