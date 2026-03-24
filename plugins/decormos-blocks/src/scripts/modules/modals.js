export const initModals = () => {
  let now = new Date();
  const hourse = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  now = hourse * 3600 + minutes * 60 + seconds;
  const minHours = 11 * 3600;
  const maxHours = 21 * 3600;
  if (now > minHours && now < maxHours) {
    now = maxHours - now;
  } else {
    now = 0;
  }
  function showModal(time) {
    setTimeout(function () {
      document.getElementById("modal-time")?.classList.add("modal--active");
    }, time);
  }
  showModal(now * 1000);

  document.querySelectorAll(".js-modal-close").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".modal")?.classList.remove("modal--active");
    });
  });
};
