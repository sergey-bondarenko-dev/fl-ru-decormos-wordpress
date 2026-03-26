import "swiper/css";
import "../styles/frontend.scss";

import { initCoatingButtons } from "./modules/coatingButtons";
import { initForms } from "./modules/form";
import { initHeaderDropdownHover } from "./modules/header-dropdown-hover";
import { initHeaderScroll } from "./modules/header-scroll";
import { initMenu } from "./modules/menu";
import { initModals } from "./modules/modals";
import { initPortfolioMore } from './modules/portfolio-more';
import { initTabs } from "./modules/tabs";
import Collapse from "bootstrap/js/src/collapse";
import Offcanvas from "bootstrap/js/src/offcanvas";

window.offcanvas = Offcanvas;
window.collapse = Collapse;

const start = async () => {
  initForms();
  initMenu();
  initHeaderDropdownHover();
  initTabs();
  initHeaderScroll();
  initModals();
  initCoatingButtons();
  initPortfolioMore();

  const asyncInitializers = [];

  if (document.querySelector("[data-fancybox]")) {
    asyncInitializers.push(
      import("./modules/fancybox").then(({ initFancybox }) => {
        initFancybox();
      }),
    );
  }

  if (document.querySelector(".js-slider-sertificates, .js-slider-article-images")) {
    asyncInitializers.push(
      import("./modules/slider").then(({ initSlider }) => {
        initSlider();
      }),
    );
  }

  

  await Promise.all(asyncInitializers);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
