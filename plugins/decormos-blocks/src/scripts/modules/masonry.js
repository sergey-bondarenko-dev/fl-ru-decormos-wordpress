import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

const MASONRY_OPTIONS = {
  itemSelector: ".grid-item",
  columnWidth: ".grid-sizer",
  percentPosition: true,
  transitionDuration: "0.4s",
};

const refreshFancybox = () => {
  if (typeof window.refreshFancybox === "function") {
    window.refreshFancybox();
  }
};

const preloadImages = (imageUrls, callback) => {
  if (!imageUrls.length) {
    callback([]);
    return;
  }

  let loaded = 0;
  const images = [];

  imageUrls.forEach((url) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded += 1;
      if (loaded === imageUrls.length) {
        callback(images);
      }
    };
    img.src = url;
    images.push(img);
  });
};

const initGridMasonry = () => {
  const grid = document.querySelector(".grid");
  if (!grid) {
    return;
  }

  const masonry = new Masonry(grid, MASONRY_OPTIONS);
  const showMoreBtn = document.getElementById("show_more");
  if (!showMoreBtn) {
    return;
  }

  let isAdditionalShown = false;
  const additionalItemsRaw = grid.getAttribute("data-additional-items");
  let additionalItems = [];

  if (additionalItemsRaw) {
    try {
      additionalItems = JSON.parse(additionalItemsRaw);
    } catch {
      additionalItems = [];
    }
  }

  if (!additionalItems.length) {
    showMoreBtn.classList.add("display_none");
    return;
  }

  showMoreBtn.addEventListener("click", () => {
    if (isAdditionalShown) {
      const additionalItemsNodes = grid.querySelectorAll(".additional-item");
      additionalItemsNodes.forEach((item) => {
        const element = item;
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "all 0.5s ease";
      });

      setTimeout(() => {
        if (additionalItemsNodes.length) {
          masonry.remove(additionalItemsNodes);
          masonry.layout();
          additionalItemsNodes.forEach((item) => item.remove());
        }

        refreshFancybox();
        isAdditionalShown = false;
      }, 500);

      return;
    }

    const urlsToLoad = [];
    const fragment = document.createDocumentFragment();

    additionalItems.forEach((itemData) => {
      urlsToLoad.push(itemData.thumbSrc);

      const item = document.createElement("div");
      item.className = "grid-item additional-item";

      const link = document.createElement("a");
      link.href = itemData.fullSrc;
      link.className = itemData.linkClass || "list-works__link";
      link.setAttribute("data-fancybox", "gallery");
      link.setAttribute("aria-label", "Open project image");

      const img = document.createElement("img");
      img.src = itemData.thumbSrc;
      img.alt = "";
      if (itemData.thumbWidth) {
        img.width = itemData.thumbWidth;
      }
      if (itemData.thumbHeight) {
        img.height = itemData.thumbHeight;
      }

      link.appendChild(img);
      item.appendChild(link);
      fragment.appendChild(item);
    });

    preloadImages(urlsToLoad, () => {
      grid.appendChild(fragment);

      const newItems = grid.querySelectorAll(".additional-item");
      newItems.forEach((item) => {
        const element = item;
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "all 0.5s ease";
      });

      requestAnimationFrame(() => {
        newItems.forEach((item) => {
          const element = item;
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        });
      });

      imagesLoaded(newItems, () => {
        masonry.appended(Array.from(newItems));
        masonry.layout();
      });

      refreshFancybox();
      showMoreBtn.classList.add("display_none");
      isAdditionalShown = true;
    });
  });
};

export const initMasonry = () => {
  const grid = document.querySelector(".grid");
  if (!grid) {
    return;
  }

  imagesLoaded(grid, initGridMasonry);
};


