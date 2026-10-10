const projectImage = document.querySelector("#project-image");
if (projectImage) {
  document.querySelectorAll("[data-project-image]").forEach((button) =>
    button.addEventListener("click", () => {
      projectImage.src = button.dataset.projectImage;
      projectImage.alt = button.dataset.alt;
      document.querySelector("#project-image-link").href =
        button.dataset.projectImage;
      document.querySelector("#project-caption").textContent =
        button.dataset.caption;
      document
        .querySelectorAll("[data-project-image]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
    }),
  );
}
document.querySelectorAll("[data-project-panel]").forEach((button) =>
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".project-control-panel")
      .forEach(
        (panel) => (panel.hidden = panel.id !== button.dataset.projectPanel),
      );
    document
      .querySelectorAll("[data-project-panel]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
  }),
);
