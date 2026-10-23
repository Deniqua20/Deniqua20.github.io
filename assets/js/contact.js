"use strict";
/* Contact page: the suggestion box sends via a form service or an email draft. */
(() => {

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
        const fields = Object.fromEntries(data);
        fields._subject = "Suggestion box: " + data.get("type");
        fields._template = "table";
        const response = await fetch(form.dataset.endpoint, { method: "POST", body: JSON.stringify(fields), headers: { "Content-Type": "application/json", Accept: "application/json" } });
        const reply = await response.json().catch(() => ({}));
        if (!response.ok || String(reply.success) === "false") throw Error("delivery");
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
    draft.href = `mailto:deescybercorner@gmail.com?subject=${encodeURIComponent("Suggestion box: " + data.get("type"))}&body=${encodeURIComponent(body)}`;
    draft.hidden = true; document.body.append(draft); draft.click(); draft.remove();
  });
})();
