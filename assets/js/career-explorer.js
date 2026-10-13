"use strict";
const INTEREST_NAMES = { people: "helping and understanding people", investigate: "investigating and researching", organize: "organizing information and processes", build: "making and fixing things", create: "creating and improving experiences", explain: "explaining and sharing knowledge" };

function scoreCareerInterests(tracks, questions, answers) {
  const totals = Object.fromEntries(Object.keys(INTEREST_NAMES).map(key => [key, 0]));
  const evidence = Object.fromEntries(Object.keys(INTEREST_NAMES).map(key => [key, 0]));
  const selected = [];
  let answered = 0;
  questions.forEach(question => {
    const indices = answers[question.id];
    if (!Array.isArray(indices) || indices.length < 1 || indices.length > 2 || new Set(indices).size !== indices.length || indices.some(index => !Number.isInteger(index) || !question.choices[index])) return;
    answered++;
    const supported = new Set(indices.flatMap(index => Object.keys(question.choices[index].weights)));
    supported.forEach(key => { evidence[key]++; });
    indices.forEach(index => {
      const choice = question.choices[index];
      selected.push(choice);
      Object.entries(choice.weights).forEach(([key, value]) => { totals[key] += value / indices.length; });
    });
  });
  const interests = Object.entries(totals).map(([id, value]) => ({ id, value: answered ? value / (answered * 2) : 0 })).sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
  const base = { answered, interests, matches: [], status: "uncertain" };
  if (answered < 4) return base;
  if (interests[0].value - interests.at(-1).value < .1) return { ...base, status: "broad" };
  const eligible = tracks.filter(track => Object.entries(track.profile).sort((a,b)=>b[1]-a[1]).slice(0,2).every(([key])=>evidence[key]>=2));
  if (!eligible.length) return { ...base, status: "broad" };
  const ranked = eligible.map(track => {
    const weight = Object.values(track.profile).reduce((sum, value) => sum + value, 0);
    const value = Object.entries(track.profile).reduce((sum, [key, w]) => sum + totals[key] / (answered * 2) * w, 0) / weight;
    const reasons = [...new Set(selected.map(choice => choice.text))].map(text => {
      const choice = selected.find(item => item.text === text);
      const relevance = Object.entries(choice.weights).reduce((sum, [key, w]) => sum + w * (track.profile[key] || 0), 0);
      return { text, relevance };
    }).sort((a, b) => b.relevance - a.relevance).slice(0, 2).map(item => item.text);
    return { id: track.id, value, reasons };
  }).sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
  const cutoff = ranked[Math.min(2, ranked.length - 1)].value;
  return { ...base, status: "matched", matches: ranked.filter(item => item.value >= cutoff - 1e-9) };
}
if (typeof module !== "undefined" && module.exports) module.exports = { scoreCareerInterests, INTEREST_NAMES };

if (typeof document !== "undefined" && document.querySelector("#career-form")) {
  const form = document.querySelector("#career-form");
  const opening = document.querySelector("#direction-opening");
  const results = document.querySelector("#quiz-results");
  const library = document.querySelector("#career-library");
  const title = document.querySelector("#quiz-step-title");
  const area = document.querySelector("#quiz-questions");
  const error = document.querySelector("#quiz-error");
  const status = document.querySelector("#selection-status");
  let step = 0, answers = {};
  const add = (parent, tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    parent.append(node); return node;
  };
  const settle = node => { if (!matchMedia("(prefers-reduced-motion: reduce)").matches) node.animate([{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"translateY(0)"}],{duration:320,easing:"ease-out"}); };
  function updateSelection() {
    const count = (answers[CAREER_QUESTIONS[step].id] || []).length;
    status.textContent = count ? `${count === 1 ? "One choice" : "Two choices"} selected. You can change your mind.` : "There are no right answers.";
  }
  function render() {
    opening.hidden = true; results.hidden = true; library.hidden = true; form.hidden = false;
    error.textContent = "";
    const question = CAREER_QUESTIONS[step];
    document.querySelector("#quiz-progress-label").textContent = `Question ${step + 1} of ${CAREER_QUESTIONS.length}`;
    title.textContent = question.prompt;
    area.replaceChildren();
    const group = add(area, "div", undefined, "direction-choices");
    group.setAttribute("role", "group"); group.setAttribute("aria-labelledby", "quiz-step-title");
    question.choices.forEach((choice, index) => {
      const button = add(group, "button", choice.text, "direction-choice");
      button.type = "button";
      button.setAttribute("aria-pressed", String((answers[question.id] || []).includes(index)));
      button.addEventListener("click", () => {
        const picked = [...(answers[question.id] || [])];
        if (picked.includes(index)) picked.splice(picked.indexOf(index), 1);
        else if (picked.length < 2) picked.push(index);
        else { error.textContent = "Choose up to two. Deselect one to try another."; return; }
        answers[question.id] = picked;
        button.setAttribute("aria-pressed", String(picked.includes(index)));
        error.textContent = ""; updateSelection();
      });
    });
    document.querySelector("#quiz-back").disabled = step === 0;
    document.querySelector("#quiz-next").textContent = step === CAREER_QUESTIONS.length - 1 ? "Reveal my direction" : "Keep going";
    updateSelection(); title.focus(); settle(form);
  }
  function reveal() {
    form.hidden = true; results.hidden = false; library.hidden = false;
    const result = scoreCareerInterests(CAREER_TRACKS, CAREER_QUESTIONS, answers);
    const intro = document.querySelector("#results-intro");
    const list = document.querySelector("#results-list"); list.replaceChildren();
    if (result.status === "uncertain") intro.textContent = "You are still exploring, and that is a good place to start. There were not enough answered questions to suggest a direction. Revisit at least four questions, or explore the possibilities below and notice what draws you in.";
    else if (result.status === "broad") intro.textContent = "Your curiosity spans several kinds of work. There is no clear leading pattern in these choices, so we will not assign you a career. Explore the possibilities below and try one small activity before choosing a direction.";
    else {
      const lead = result.interests.filter(i => i.value >= result.interests[1].value - 1e-9).slice(0, 3).map(i=>INTEREST_NAMES[i.id]);
      intro.textContent = `Your choices leaned toward ${lead.join(" and ")}. Here are some ways those interests can show up in tech. The suggestions are equally worth considering when their underlying scores tie.`;
      result.matches.forEach(match => {
        const track = CAREER_TRACKS.find(t=>t.id===match.id);
        const article = add(list, "article", undefined, "direction-result");
        add(article,"p",track.group,"direction-overline"); add(article,"h3",track.title);
        add(article,"p",track.description);
        const why = add(article,"div",undefined,"direction-why"); add(why,"h4","I noticed you chose…");
        match.reasons.forEach(reason=>add(why,"p",reason));
        add(article,"h4","Jobs to look into"); add(article,"p",track.startingRoles.join(", "));
        add(article,"h4","Where this could grow"); add(article,"p",track.developingRoles.join(", "));
        add(article,"h4","A small way to find out"); add(article,"p",track.project);
        const links=add(article,"div",undefined,"career-actions");
        const practice=add(links,"a",track.practiceLabel);practice.href=track.practiceLink;
        const career=add(links,"a","Explore the work and role requirements");career.href=track.careerLink;
      });
    }
    document.querySelector("#results-heading").focus(); settle(results);
  }
  function advance() { if (step < CAREER_QUESTIONS.length-1) { step++;render(); } else reveal(); }
  document.querySelector("#quiz-start").addEventListener("click",render);
  document.querySelector("#quiz-back").addEventListener("click",()=>{if(step>0){step--;render();}});
  document.querySelector("#quiz-unsure").addEventListener("click",()=>{answers[CAREER_QUESTIONS[step].id]=[];advance();});
  form.addEventListener("submit",event=>{event.preventDefault();if(!(answers[CAREER_QUESTIONS[step].id]||[]).length){error.textContent="Choose what draws you in, or select I’m not sure yet.";return;}advance();});
  document.querySelector("#quiz-edit").addEventListener("click",()=>{step=0;render();});
  document.querySelector("#quiz-reset").addEventListener("click",()=>{step=0;answers={};render();});
}
