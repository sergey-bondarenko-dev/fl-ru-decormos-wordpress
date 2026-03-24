import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const fancyboxOptions = {
  animationEffect: "zoom-in-out",
  slideClass: "modal-close",
  autoFocus: false,
};

const bindFancybox = () => {
  Fancybox.destroy();
  Fancybox.bind("[data-fancybox]", fancyboxOptions);
};

export const initFancybox = () => {
  window.refreshFancybox = bindFancybox;
  bindFancybox();
};
