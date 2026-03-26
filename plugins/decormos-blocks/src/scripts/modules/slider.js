import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

const initSwiperElement = (slider, configFactory) => {
  const nextEl = slider.querySelector(".swiper-button-next");
  const prevEl = slider.querySelector(".swiper-button-prev");
  const config = configFactory(nextEl, prevEl);
  return new Swiper(slider, config);
};

const initSliderBySelector = (selector, configFactory) => {
  document.querySelectorAll(selector).forEach((slider) => {
    initSwiperElement(slider, configFactory);
  });
};

const getNavigationConfig = (navigation, nextEl, prevEl) => {
  if (!navigation) {
    return false;
  }

  return {
    nextEl,
    prevEl,
  };
};

const parseSliderOptions = (sliderBlock) => {
  const rawOptions = sliderBlock.getAttribute("data-swiper-options");

  if (!rawOptions) {
    return null;
  }

  try {
    return JSON.parse(rawOptions);
  } catch (error) {
    return null;
  }
};

export const initGallerySliderBlock = (blocks) => {
  blocks.forEach((block) => {
    const slider = block.querySelector(".swiper");

    if (!slider) {
      return;
    }

    const sliderOptions = parseSliderOptions(block);

    if (!sliderOptions) {
      return;
    }

    initSwiperElement(slider, (nextEl, prevEl) => ({
      modules: [Navigation],
      ...sliderOptions,
      navigation: getNavigationConfig(
        sliderOptions.navigation,
        nextEl,
        prevEl,
      ),
    }));
  });
};

export const initSlider = () => {
  initSliderBySelector(".js-slider-sertificates", (nextEl, prevEl) => ({
    modules: [Navigation],
    slidesPerView: 6,
    spaceBetween: 10,
    roundLengths: true,
    loop: true,
    navigation: getNavigationConfig(true, nextEl, prevEl),
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
    navigation: getNavigationConfig(true, nextEl, prevEl),
    breakpoints: {
      480: { centeredSlides: false },
    },
  }));
};
