"use strict";
/* Paths in Tech: after a tile is chosen, bring the matching panel into view if it is off screen. */
document.querySelectorAll(".path-tile").forEach(tile => tile.addEventListener("click", () => {
  const panel = document.getElementById(tile.getAttribute("aria-controls"));
  if (!panel) return;
  const box = panel.getBoundingClientRect();
  if (box.top < 80 || box.top > innerHeight * 0.6) {
    panel.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
}));
