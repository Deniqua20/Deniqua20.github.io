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

/* Which team are you? Tally answers, show the top team, highlight its row. */
document.querySelectorAll("[data-team-quiz]").forEach(quiz => {
  const steps = [...quiz.querySelectorAll(".quiz-q")];
  let picks = [];
  const show = i => steps.forEach((s, n) => { s.hidden = n !== i; });
  quiz.addEventListener("click", event => {
    const answer = event.target.closest(".quiz-a");
    if (answer) {
      picks.push(answer.dataset.team);
      const next = picks.length;
      if (next < steps.length) { show(next); steps[next].querySelector(".quiz-a")?.focus(); return; }
      show(-1);
      const count = {};
      picks.forEach(t => { count[t] = (count[t] || 0) + 1; });
      const team = picks.find(t => count[t] === Math.max(...Object.values(count)));
      const result = quiz.querySelector(`[data-result="${team}"]`);
      result.hidden = false;
      result.querySelector("a")?.focus();
      document.querySelectorAll(".team-row").forEach(row => row.classList.toggle("is-match", row.id === `team-${team}`));
      document.dispatchEvent(new CustomEvent("dee:achievement", { detail: "teamplayer" }));
    }
    if (event.target.closest(".quiz-retry")) {
      picks = [];
      quiz.querySelectorAll(".quiz-result").forEach(r => { r.hidden = true; });
      show(0);
      steps[0].querySelector(".quiz-a")?.focus();
    }
  });
});
