"use strict";
/* Click tracking: counts what visitors open and tap as GoatCounter events (no cookies, no personal data). */
(() => {
  const send = (name, title) => {
    const gc = window.goatcounter;
    if (gc && typeof gc.count === "function") gc.count({ path: name, title: title || name, event: true });
  };
  const label = el => {
    let text = el.getAttribute("aria-label");
    if (!text) { const copy = el.cloneNode(true); copy.querySelectorAll("small").forEach(x => x.remove()); text = copy.textContent; }
    return (text || "").replace(/\s+/g, " ").trim().slice(0, 80);
  };
  document.addEventListener("click", event => {
    const t = event.target;
    const summary = t.closest("summary");
    if (summary) {
      const box = summary.parentElement;
      if (box.open) return; // only count opening, not closing
      if (box.matches(".grail-part")) send("holy-grail: " + label(summary.querySelector("span:not(.grail-part-n)") || summary));
      else if (box.matches(".lib-group")) send("library: " + label(summary.querySelector("h3") || summary));
      else if (box.matches(".path-folder")) send("paths-folder: " + label(summary.querySelector("h3") || summary));
      else if (box.matches(".team-quiz")) send("quiz: started");
      return;
    }
    const pathCard = t.closest(".path-card");
    if (pathCard) return send("paths: " + label(pathCard));
    const quizResult = t.closest(".quiz-a");
    if (quizResult && quizResult.closest(".quiz-q:last-of-type")) send("quiz: finished");
    const link = t.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (/walkthrough\.html/.test(href)) return send("walkthrough: " + href.split("/").pop().replace(".html", ""));
    if (/^https?:\/\//.test(href) && !href.includes(location.host)) {
      let host = href;
      try { const u = new URL(href); host = u.host.replace(/^www\./, "") + (u.pathname.length > 1 ? u.pathname : ""); } catch {}
      send("out: " + host.slice(0, 90), label(link));
    }
  });
  document.addEventListener("submit", event => {
    if (event.target.id === "contact-form") send("contact: sent");
    if (event.target.id === "suggest-form") send("suggestion: sent");
  });
})();
