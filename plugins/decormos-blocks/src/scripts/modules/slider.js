import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

const initSliderBySelector = (selector, configFactory) => {
  document.querySelectorAll(selector).forEach((slider) => {
    const nextEl = slider.querySelector(".swiper-button-next");
    const prevEl = slider.querySelector(".swiper-button-prev");
    const config = configFactory(nextEl, prevEl);
    new Swiper(slider, config);
  });
};

export const initSlider = () => {
  initSliderBySelector(".js-slider-sertificates", (nextEl, prevEl) => ({
    modules: [Navigation],
    slidesPerView: 6,
    spaceBetween: 10,
    roundLengths: true,
    loop: true,
    navigation: {
      nextEl,
      prevEl,
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 30 },
      480: { slidesPerView: 3 },
      640: { slidesPerView: 4 },
      767: { slidesPerView: 5 },
      1023: { slidesPerView: 6 },
    },
  }));

  initSliderBySelector(".js-slider-article-images", (nextEl, prevEl) => ({
    modules: [Navigation],
    slidesPerView: "auto",
    spaceBetween: 12,
    centeredSlides: true,
    roundLengths: true,
    loop: true,
    navigation: {
      nextEl,
      prevEl,
    },
    breakpoints: {
      480: { centeredSlides: false },
    },
  }));
};
