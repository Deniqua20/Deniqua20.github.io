"use strict";
/* Paths in Tech: after a path is chosen, bring the matching panel into view if it is off screen. */
const smooth = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
document.querySelectorAll(".path-card").forEach(card => card.addEventListener("click", () => {
  const panel = document.getElementById(card.getAttribute("aria-controls"));
  if (!panel) return;
  const box = panel.getBoundingClientRect();
  if (box.top < 80 || box.top > innerHeight * 0.6) panel.scrollIntoView({ behavior: smooth(), block: "start" });
}));

/* "See the paths" links open the folder they point to. */
document.addEventListener("click", event => {
  const link = event.target.closest('.team-jump[href^="#team-"]');
  const folder = link && document.querySelector(link.getAttribute("href"));
  if (!folder) return;
  event.preventDefault();
  folder.open = true;
  folder.scrollIntoView({ behavior: smooth(), block: "start" });
  folder.querySelector("summary")?.focus({ preventScroll: true });
});

/* Which team are you? Tally answers, show the top team, open its folder. */
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
      document.querySelectorAll(".path-folder").forEach(f => f.classList.toggle("is-match", f.id === `team-${team}`));
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
