export const initTabs = () => {
  document.querySelectorAll(".tab-nav").forEach((tabNav) => {
    tabNav.addEventListener("click", (event) => {
      const target = event.target?.closest("div");
      if (!target || !tabNav.contains(target)) {
        return;
      }
      if (target.classList.contains("tab-nav__item--active")) {
        return;
      }

      event.preventDefault();
      const items = Array.from(tabNav.children).filter(
        (child) => child instanceof HTMLElement,
      );
      const index = items.indexOf(target);
      if (index === -1) {
        return;
      }

      items.forEach((item) => item.classList.remove("tab-nav__item--active"));
      target.classList.add("tab-nav__item--active");

      const blockTab = tabNav.closest(".block-tab");
      const contentItems = blockTab?.querySelectorAll(
        ".tab-content .tab-content__item",
      );
      if (!contentItems?.length) {
        return;
      }

      contentItems.forEach((item) => {
        item.style.display = "none";
      });

      const activeItem = contentItems[index];
      if (activeItem) {
        activeItem.style.display = "";
        activeItem.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 1000,
          easing: "ease",
        });
      }
    });
  });
};
