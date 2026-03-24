export const initForms = () => {
  const baseHref = new URL("/", window.location.origin).toString();

  const phoneInputs = document.querySelectorAll("input[name='phone']");
  if (phoneInputs.length) {
    import("inputmask").then(({ default: Inputmask }) => {
      phoneInputs.forEach((input) => {
        Inputmask({
          mask: "+7 (999) 999-99-99",
          clearIncomplete: true,
          showMaskOnHover: true,
          greedy: false,
          keepStatic: true,
        }).mask(input);
      });
    });
  }

  document.querySelectorAll(".form").forEach((form) => {
    const urlInput = form.querySelector("input[name='url']");
    if (urlInput) {
      urlInput.value = window.location.href;
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });

  document.querySelectorAll(".js-submit").forEach((button) => {
    button.addEventListener("click", async () => {
      const form = button.closest(".form");
      if (!form) {
        return;
      }

      const phoneInput = form.querySelector(".js-input-phone");
      const phoneVal = phoneInput?.value.length ?? 0;
      if (phoneVal < 10) {
        phoneInput?.classList.add("form__input--error");
      } else {
        phoneInput?.classList.remove("form__input--error");
      }

      const urlInput = form.querySelector("input[name='url']");
      if (urlInput) {
        urlInput.value = window.location.href;
      }

      if (phoneVal >= 10) {
        const formData = new FormData(form);
        const params = new URLSearchParams();
        formData.forEach((value, key) => {
          if (typeof value === "string") {
            params.append(key, value);
          }
        });
        const response = await fetch(new URL("sendFormModal.php", baseHref), {
          method: "POST",
          body: params,
        });
        const text = await response.text();
        if (text === "true") {
          const thanksUrl = new URL("thanks", baseHref);
          thanksUrl.searchParams.set("back", `${window.location.pathname}${window.location.search}`);
          window.location.href = thanksUrl.toString();
          if (phoneInput) {
            phoneInput.value = "";
          }
        }
      }
    });
  });
};
