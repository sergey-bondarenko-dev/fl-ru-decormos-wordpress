export const initHeaderScroll = () => {
  const header =
    document.querySelector(".wp-site-blocks > header.wp-block-template-part") ||
    document.querySelector(".site-header") ||
    document.querySelector(".wp-block-decormos-header.header") ||
    document.querySelector(".header--home");
  if (!header) {
    return;
  }

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const updateOpacity = () => {
    const navHeight = header.offsetHeight;
    if (window.scrollY > navHeight) {
      header.classList.add("header--opacity");
    } else {
      header.classList.remove("header--opacity");
    }
  };

  window.addEventListener("scroll", () => {
    header.classList.remove("header--active");
    updateOpacity();
  });

  if (isTouch) {
    header.addEventListener("pointerdown", () => {
      header.classList.add("header--active");
    });
  }

  header.addEventListener("focusin", () => {
    header.classList.add("header--active");
  });

  updateOpacity();
};
