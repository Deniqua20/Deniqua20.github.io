"use strict";

function scoreCareerInterests(tracks, answers) {
  const ranked = tracks.map((track) => {
    const ratings = track.tasks.map((_, index) => answers[`${track.id}:${index}`]);
    const rated = ratings.filter((value) => Number.isInteger(value) && value >= 0 && value <= 4);
    const sum = rated.reduce((total, value) => total + value, 0);
    return { id: track.id, mean: rated.length ? sum / rated.length : 0, count: rated.length,
      reasons: track.tasks.filter((_, index) => ratings[index] >= 3 && ratings[index] <= 4) };
  }).filter((item) => item.count >= 2 && item.mean >= 2)
    .sort((a, b) => b.mean - a.mean || b.count - a.count || a.id.localeCompare(b.id));
  if (!ranked.length) return [];
  const cutoff = ranked[Math.min(2, ranked.length - 1)].mean;
  return ranked.filter((item) => item.mean >= cutoff);
}
if (typeof module !== "undefined" && module.exports) module.exports = { scoreCareerInterests };

if (typeof document !== "undefined") {
  const form = document.querySelector("#career-form");
  if (form) {
    let step = 0;
    let answers = {};
    const tracks = CAREER_TRACKS;
    const intro = document.querySelector("#quiz-intro");
    const results = document.querySelector("#quiz-results");
    const title = document.querySelector("#quiz-step-title");
    const questions = document.querySelector("#quiz-questions");
    const error = document.querySelector("#quiz-error");
    const labels = ["Not for me", "A little interested", "Somewhat interested", "Interested", "Very interested", "Not sure yet"];
    const add = (parent, tag, text, className) => {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      parent.append(node);
      return node;
    };
    function render(focus = true) {
      intro.hidden = true;
      results.hidden = true;
      form.hidden = false;
      error.textContent = "";
      const track = tracks[step];
      document.querySelector("#quiz-progress-label").textContent = `Area ${step + 1} of ${tracks.length} · ${track.group}`;
      document.querySelector("#quiz-progress").max = tracks.length;
      document.querySelector("#quiz-progress").value = step;
      title.textContent = track.title;
      questions.replaceChildren();
      track.tasks.forEach((task, index) => {
        const key = `${track.id}:${index}`;
        const fieldset = add(questions, "fieldset");
        add(fieldset, "legend", task);
        const options = add(fieldset, "div", undefined, "career-ratings");
        labels.forEach((label, value) => {
          const choice = add(options, "label", undefined, "career-rating");
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = `task-${index}`;
          radio.value = String(value === 5 ? -1 : value);
          radio.checked = answers[key] === Number(radio.value);
          radio.addEventListener("change", () => { answers[key] = Number(radio.value); error.textContent = ""; });
          choice.append(radio);
          add(choice, "span", label);
        });
      });
      document.querySelector("#quiz-back").disabled = step === 0;
      document.querySelector("#quiz-next").textContent = step === tracks.length - 1 ? "See my matches" : "Continue";
      if (focus) title.focus();
    }
    function displayResults() {
      form.hidden = true;
      results.hidden = false;
      const matches = scoreCareerInterests(tracks, answers);
      const list = document.querySelector("#results-list");
      list.replaceChildren();
      const summary = document.querySelector("#results-intro");
      if (!matches.length) {
        summary.textContent = "There is no clear interest match yet. An area needs at least two rated tasks and an average of Somewhat interested or higher. Browse the career areas, try a small project, and revisit the questions when you know more.";
      } else {
        const sameScore = matches.every((item) => item.mean === matches[0].mean);
        summary.textContent = sameScore && matches.length > 1
          ? "These areas share your strongest interest score. You do not need to choose just one. Compare their work and try a small project to see what you enjoy."
          : "These areas received your strongest interest ratings. Explore the jobs and try a project before deciding where you want to grow.";
        matches.forEach((match) => {
          const track = tracks.find((item) => item.id === match.id);
          const article = add(list, "article", undefined, "career-result");
          add(article, "p", track.group, "eyebrow");
          add(article, "h4", track.title);
          add(article, "p", track.description);
          add(article, "h5", "Why this appeared");
          if (match.reasons.length) {
            add(article, "p", "You expressed interest in these tasks:");
            const reasons = add(article, "ul");
            match.reasons.forEach((reason) => add(reasons, "li", reason));
          } else {
            add(article, "p", "This was among your higher rated areas, although your interest was modest. Treat it as a possibility to test rather than a strong recommendation.");
          }
          add(article, "p", `Average interest: ${match.mean.toFixed(1)} out of 4 across ${match.count} rated tasks.`, "career-note");
          add(article, "h5", "Job titles to research");
          add(article, "p", track.startingRoles.join(", "));
          add(article, "h5", "With further experience");
          add(article, "p", track.developingRoles.join(", "));
          add(article, "h5", "A small next step");
          add(article, "p", track.project);
          const links = add(article, "div", undefined, "career-actions");
          const path = add(links, "a", "Explore this career area");
          path.href = `#path-${track.id}`;
          const career = add(links, "a", "Career guidance and role information");
          career.href = track.careerLink;
        });
      }
      document.querySelector("#results-heading").focus();
    }
    document.querySelector("#quiz-start").addEventListener("click", () => render());
    document.querySelector("#quiz-back").addEventListener("click", () => { if (step > 0) { step--; render(); } });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const track = tracks[step];
      const missing = track.tasks.findIndex((_, index) => answers[`${track.id}:${index}`] === undefined);
      if (missing !== -1) {
        error.textContent = "Please rate each task or choose Not sure yet before continuing.";
        questions.querySelectorAll("fieldset")[missing].querySelector("input").focus();
        return;
      }
      if (step < tracks.length - 1) { step++; render(); } else displayResults();
    });
    document.querySelector("#quiz-edit").addEventListener("click", () => { step = 0; render(); });
    document.querySelector("#quiz-reset").addEventListener("click", () => { answers = {}; step = 0; render(); });
  }
}
