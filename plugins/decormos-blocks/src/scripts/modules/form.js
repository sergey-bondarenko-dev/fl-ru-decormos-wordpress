export const initForms = () => {
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

  document.querySelectorAll("form").forEach((form) => {
    const urlInput = form.querySelector("input[name='url']");
    if (urlInput) {
      urlInput.value = window.location.href;
    }
  });
};
