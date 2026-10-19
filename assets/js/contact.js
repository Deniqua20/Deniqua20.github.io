"use strict";
/* Contact page: reason chips fill the subject; the suggestion box sends via a form service or an email draft. */
(() => {
  const subject = document.getElementById("contact-subject");
  document.querySelectorAll("[data-subject]").forEach(chip => chip.addEventListener("click", () => {
    document.querySelectorAll("[data-subject]").forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    subject.value = chip.dataset.subject;
    document.getElementById("contact-form").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    document.getElementById("contact-message").focus({ preventScroll: true });
  }));

  const form = document.getElementById("suggest-form");
  if (!form) return;
  const submit = form.querySelector('[type="submit"]');
  const status = document.getElementById("suggest-status");
  submit.disabled = false;
  if (form.dataset.endpoint) form.querySelector(".suggest-note").textContent = "Your suggestion comes straight to me. Name and email are optional.";
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (form.dataset.endpoint) {
      submit.disabled = true; status.textContent = "Sending your suggestion…";
      try {
        const response = await fetch(form.dataset.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!response.ok) throw Error("delivery");
        status.textContent = "Thank you! Your suggestion was sent.";
        form.reset();
      } catch { status.textContent = "Your suggestion could not be sent. Please try again in a moment."; }
      finally { submit.disabled = false; }
      return;
    }
    const who = [data.get("name"), data.get("email")].filter(Boolean).join(" · ") || "Anonymous";
    const body = `Suggestion type: ${data.get("type")}\nFrom: ${who}\n\n${data.get("suggestion")}`;
    status.textContent = "Your email app should open with your suggestion. Review it and press Send there.";
    const draft = document.createElement("a");
    draft.href = `mailto:deniquamarie@gmail.com?subject=${encodeURIComponent("Suggestion box: " + data.get("type"))}&body=${encodeURIComponent(body)}`;
    draft.hidden = true; document.body.append(draft); draft.click(); draft.remove();
  });
})();
