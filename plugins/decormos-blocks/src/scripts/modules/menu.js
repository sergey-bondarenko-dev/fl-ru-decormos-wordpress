export const initMenu = () => {
  function mediaSize_767() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      const header = document.querySelector(".header");
      const menu = header?.querySelector(".menu");
      const mobileInfo = document.querySelector(".menu-mobile__info");
      if (menu && mobileInfo) {
        menu.classList.remove("header__nav");
        mobileInfo.parentElement?.insertBefore(menu, mobileInfo);
      }
    } else {
      const mobileInner = document.querySelector(".menu-mobile__inner");
      const menu = mobileInner?.querySelector(".menu");
      const logo = document.querySelector(".header__logo");
      if (menu && logo?.parentElement) {
        menu.classList.add("header__nav");
        logo.parentElement.insertBefore(menu, logo.nextSibling);
      }

      document.querySelector(".menu-mobile")?.classList.remove("menu-mobile--active");
      document.body.classList.remove("body-fixed");
    }
  }

  mediaSize_767();
  window.addEventListener("resize", mediaSize_767);

  document.querySelector(".js-mobile-button")?.addEventListener("click", () => {
    document.querySelector(".menu-mobile")?.classList.add("menu-mobile--active");
    document.body.classList.add("body-fixed");
  });

  document.querySelector(".menu-mobile__close")?.addEventListener("click", () => {
    document.querySelector(".menu-mobile")?.classList.remove("menu-mobile--active");
    document.body.classList.remove("body-fixed");
  });

  document.querySelectorAll(".menu-mobile a").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector(".menu-mobile")?.classList.remove("menu-mobile--active");
      document.body.classList.remove("body-fixed");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchorLink = target.closest('a[href^="#"]');
    if (!(anchorLink instanceof HTMLAnchorElement)) {
      return;
    }

    const href = (anchorLink.getAttribute("href") || "").trim();
    if (href === "" || href === "#") {
      return;
    }

    const offcanvasElement = anchorLink.closest(".offcanvas-md.show");
    if (!(offcanvasElement instanceof HTMLElement)) {
      return;
    }

    const OffcanvasClass = window.offcanvas;
    if (OffcanvasClass?.getOrCreateInstance) {
      OffcanvasClass.getOrCreateInstance(offcanvasElement).hide();
    }
  });
};
