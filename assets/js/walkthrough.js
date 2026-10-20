"use strict";
/* Lab walkthroughs: copy buttons on code blocks. */
document.querySelectorAll(".lab-copy").forEach(button => {
  button.addEventListener("click", async () => {
    const code = button.closest(".lab-code").querySelector("code").textContent;
    try { await navigator.clipboard.writeText(code); button.textContent = "Copied ✓"; }
    catch { button.textContent = "Select and copy"; }
    setTimeout(() => { button.textContent = "Copy"; }, 2000);
  });
});
