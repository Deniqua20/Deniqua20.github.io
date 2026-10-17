/* Interior room interactions: spotlight, hero circuitry, decrypting eyebrow, card tilt, progress, keep exploring. */
(() => {
  const body = document.body;
  if (!body.classList.contains("room-page")) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefix = /\/(projects|stories)\//.test(location.pathname) ? "../" : "";
  const hero = document.querySelector(".room-intro, .cyber-corner-intro, .interior-hero");

  // Scroll / reading progress.
  const progress = document.createElement("div");
  progress.className = "room-progress";
  progress.setAttribute("aria-hidden", "true");
  body.append(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty("--progress", max > 0 ? Math.min(1, scrollY / max) : 0);
  };
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  updateProgress();

  // Pointer spotlight and hero parallax.
  if (finePointer && !reduce) {
    const spot = document.createElement("div");
    spot.className = "room-spot";
    spot.setAttribute("aria-hidden", "true");
    body.prepend(spot);
    addEventListener("pointermove", event => {
      spot.style.setProperty("--mx", event.clientX + "px");
      spot.style.setProperty("--my", event.clientY + "px");
      if (hero) {
        hero.style.setProperty("--px", (event.clientX / innerWidth - 0.5).toFixed(3));
        hero.style.setProperty("--py", (event.clientY / innerHeight - 0.5).toFixed(3));
      }
    }, { passive: true });
  }

  // Decrypting eyebrow: scrambles into the real label once, like a terminal resolving.
  const eyebrow = hero && hero.querySelector(".room-eyebrow, .eyebrow");
  if (eyebrow && !reduce) {
    const text = eyebrow.textContent;
    const glyphs = "01<>/#$%&*+=?ABCDEFX";
    let frame = 0;
    eyebrow.setAttribute("aria-label", text);
    eyebrow.classList.add("is-typing");
    const total = text.length * 2 + 8;
    const tick = () => {
      frame++;
      const settled = Math.floor(frame / 2);
      eyebrow.textContent = [...text].map((char, i) => i < settled || char === " " ? char : glyphs[(i * 7 + frame) % glyphs.length]).join("");
      if (frame < total) requestAnimationFrame(tick);
      else { eyebrow.textContent = text; setTimeout(() => eyebrow.classList.remove("is-typing"), 1600); }
    };
    requestAnimationFrame(tick);
  }

  // Hero scan sweep and living red circuit network (echoes the cyborg's circuitry on the homepage).
  if (hero && !reduce) {
    const scan = document.createElement("div");
    scan.className = "room-scan";
    scan.setAttribute("aria-hidden", "true");
    hero.prepend(scan);

    const canvas = document.createElement("canvas");
    canvas.className = "room-net";
    canvas.setAttribute("aria-hidden", "true");
    hero.prepend(canvas);
    const ctx = canvas.getContext("2d");
    let nodes = [], width = 0, height = 0, pointer = null, running = true;
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(46, width / 32));
      nodes = Array.from({ length: count }, () => ({
        x: width * (0.45 + Math.random() * 0.55), y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 1 + Math.random() * 1.8
      }));
    };
    hero.addEventListener("pointermove", event => {
      const box = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    });
    hero.addEventListener("pointerleave", () => { pointer = null; });
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < width * 0.4 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        if (pointer) {
          const dx = pointer.x - n.x, dy = pointer.y - n.y, d = Math.hypot(dx, dy);
          if (d < 160) { n.x += dx * 0.006; n.y += dy * 0.006; }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(255,60,80,${(1 - d / 120) * 0.35})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(255,90,105,.9)";
        ctx.shadowColor = "#ff2b45"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize);
    // Pause drawing when the hero is off screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        const was = running; running = entry.isIntersecting;
        if (running && !was) requestAnimationFrame(draw);
      }).observe(hero);
    }
    requestAnimationFrame(draw);
  }

  // Card tilt with a sheen that follows the pointer.
  if (finePointer && !reduce) {
    document.querySelectorAll(".world-project, .world-contact-form, .featured-case .case-evidence-preview").forEach(card => {
      const strength = card.matches(".world-contact-form") ? 2 : 6;
      card.addEventListener("pointermove", event => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width, y = (event.clientY - box.top) / box.height;
        card.style.setProperty("--rx", ((x - 0.5) * strength).toFixed(2) + "deg");
        card.style.setProperty("--ry", ((0.5 - y) * strength).toFixed(2) + "deg");
        card.style.setProperty("--cx", x * 100 + "%");
        card.style.setProperty("--cy", y * 100 + "%");
      });
      card.addEventListener("pointerleave", () => { card.style.removeProperty("--rx"); card.style.removeProperty("--ry"); });
    });
  }

  // Keep exploring: homepage destination tiles for the other rooms.
  const rooms = [
    ["labs.html", "studio-projects", "Projects", "What I’m building, testing, and discovering.", "Explore my projects"],
    ["resources.html", "studio-resources", "Resources", "Useful tools and resources for the journey.", "Explore resources"],
    ["careers.html", "studio-careers", "Paths in Tech", "Discover the work. Explore your possibilities.", "Find your direction"],
    ["blog.html", "studio-stories", "Dee’s Corner", "Real experiences, personal growth, and life in tech.", "Read my stories"]
  ];
  const current = location.pathname.split("/").pop() || "index.html";
  const footer = document.querySelector(".world-footer");
  const main = document.querySelector("main");
  if (footer && main && !document.querySelector(".room-next")) {
    const section = document.createElement("nav");
    section.className = "room-next";
    section.setAttribute("aria-label", "Keep exploring");
    section.innerHTML = `<p>Keep exploring</p><div class="studio-destinations">${rooms
      .filter(([href]) => href !== current)
      .slice(0, 3)
      .map(([href, cls, title, text, action]) => `<a class="studio-destination ${cls}" href="${prefix}${href}"><span class="studio-destination-copy"><h2>${title}</h2><p>${text}</p><span class="studio-destination-action">${action}</span></span></a>`)
      .join("")}</div>`;
    main.append(section);
  }
})();
