import Dropdown from "bootstrap/js/src/dropdown";

export const initHeaderDropdownHover = () => {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!canHover.matches) return;

  const root = document.querySelector(".header-nav");
  if (!root) return;

  const closeDelayMs = 100;
  const items = root.querySelectorAll(".menu__item--dropdown");
  items.forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    if (!toggle) return;

    const dropdown = Dropdown.getOrCreateInstance(toggle, {
      autoClose: "outside",
    });

    let closeTimer = null;
    const clearCloseTimer = () => {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    item.addEventListener("mouseenter", () => {
      clearCloseTimer();
      dropdown.show();
      toggle.blur();
    });

    item.addEventListener("mouseleave", () => {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => {
        dropdown.hide();
      }, closeDelayMs);
    });
  });
};
