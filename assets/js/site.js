"use strict";
const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
if (toggle && navigation) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("is-open", expanded);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      toggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      toggle.focus();
    }
  });
}

const labFilters = document.querySelectorAll("[data-lab-filter]");
const labCards = document.querySelectorAll("[data-lab-category]");
if (labFilters.length && labCards.length) {
  labFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.labFilter;
      labFilters.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      let count = 0;
      labCards.forEach((card) => {
        const visible =
          category === "all" || card.dataset.labCategory === category;
        card.hidden = !visible;
        if (visible) count++;
      });
      const status = document.querySelector("#lab-filter-result");
      status.textContent = `${count} ${count === 1 ? "project" : "projects"} shown for ${button.textContent.trim()}.`;
    });
  });
}
