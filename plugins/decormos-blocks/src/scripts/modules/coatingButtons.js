export const initCoatingButtons = () => {
  
  const rootElement = document.getElementById('coatingButtons');
  if (!rootElement) {
    return;
  }

  const buttons = rootElement.querySelectorAll('button[data-for]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = getTarget(button);
      if (!target) {
        return;
      }

      buttons.forEach((button) => {
        const target = getTarget(button);
        if (!target) {
          return;
        }

        target.classList.remove("is-active");
        button.classList.remove("is-active");
      });

      target.classList.add("is-active");
      button.classList.add("is-active");
    });
  });

  const getTarget = (button) => {
      const dataFor = button.dataset.for;
      if (!dataFor) {
        return null;
      }

      return document.querySelector(dataFor);
  }

}
