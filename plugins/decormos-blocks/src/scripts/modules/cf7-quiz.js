const QUIZ_SELECTOR = '[data-cf7-quiz]';
const STEP_SELECTOR = '[data-cf7-quiz-step]';
const AREA_SELECTOR = '[data-cf7-quiz-area]';
const AREA_TITLE_SELECTOR = '.cf7-quiz__area-title';
const CUSTOM_RADIO_SELECTOR = '[data-cf7-quiz-custom-radio]';
const CUSTOM_VALUE_SELECTOR = '[data-cf7-quiz-custom-value]';
const MAX_CHECKED_SELECTOR = '[data-cf7-quiz-max-checked]';
const FIELD_SELECTOR = 'input, textarea, select';
const SUBMIT_SELECTOR = 'button[type="submit"], input[type="submit"]';
const FIELD_INVALID_CLASS = 'is-invalid';
const STEP_ERROR_CLASS = 'cf7-quiz__error';
const REQUIRED_STEP_MESSAGE = 'Заполните обязательные поля на этом шаге.';

const getSelectedValues = (form, fieldName) => {
  return Array.from(
    form.querySelectorAll(`input[name="${fieldName}[]"]:checked, input[name="${fieldName}"]:checked`),
  ).map((input) => input.value);
};

const getAreaValues = (block) => {
  const values = [block.dataset.cf7QuizArea];
  const title = block.querySelector(AREA_TITLE_SELECTOR)?.textContent?.trim();

  if (title) {
    values.push(title);
  }

  return values.filter(Boolean);
};

const clearField = (field) => {
  if (field.type === 'checkbox' || field.type === 'radio') {
    field.checked = false;
    return;
  }

  field.value = '';
};

const setBlockFieldsDisabled = (block, isDisabled) => {
  block.querySelectorAll(FIELD_SELECTOR).forEach((field) => {
    field.disabled = isDisabled;
  });
};

const isHidden = (element) => Boolean(element.closest('[hidden]'));

const isValidationField = (field) => {
  return (
    !field.disabled &&
    field.type !== 'button' &&
    field.type !== 'submit' &&
    field.type !== 'hidden' &&
    !field.matches(CUSTOM_VALUE_SELECTOR) &&
    !isHidden(field)
  );
};

const getFieldTarget = (field) => {
  return (
    field.closest('.wpcf7-form-control-wrap') ||
    field.closest('.wpcf7-form-control') ||
    field.closest(AREA_SELECTOR) ||
    field
  );
};

const setFieldInvalid = (field, isInvalid) => {
  getFieldTarget(field).classList.toggle(FIELD_INVALID_CLASS, isInvalid);
};

const getStepError = (step) => {
  let error = step.querySelector(`.${STEP_ERROR_CLASS}`);

  if (!error) {
    error = document.createElement('p');
    error.className = STEP_ERROR_CLASS;
    error.hidden = true;
    step.append(error);
  }

  return error;
};

const setStepError = (step, message = '') => {
  const error = getStepError(step);

  error.textContent = message;
  error.hidden = !message;
};

const clearStepValidation = (step) => {
  step.querySelectorAll(`.${FIELD_INVALID_CLASS}`).forEach((element) => {
    element.classList.remove(FIELD_INVALID_CLASS);
  });
  setStepError(step);
};

const validateStep = (step) => {
  const fields = Array.from(step.querySelectorAll(FIELD_SELECTOR)).filter(isValidationField);
  const validatedGroups = new Set();
  let isValid = true;

  clearStepValidation(step);

  fields.forEach((field) => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      if (!field.name || validatedGroups.has(field.name)) {
        return;
      }

      validatedGroups.add(field.name);

      const group = fields.filter((groupField) => {
        return groupField.name === field.name && groupField.type === field.type;
      });
      const isGroupValid = group.some((groupField) => groupField.checked);

      group.forEach((groupField) => setFieldInvalid(groupField, !isGroupValid));
      isValid = isValid && isGroupValid;
      return;
    }

    const isFieldValid = field.value.trim() !== '';

    setFieldInvalid(field, !isFieldValid);
    isValid = isValid && isFieldValid;
  });

  if (!isValid) {
    setStepError(step, REQUIRED_STEP_MESSAGE);
  }

  return isValid;
};

const updateAreaBlocks = (form) => {
  const selectedSurfaces = getSelectedValues(form, 'surface');

  form.querySelectorAll(AREA_SELECTOR).forEach((block) => {
    const isActive = getAreaValues(block).some((value) => selectedSurfaces.includes(value));

    block.hidden = !isActive;
    block.classList.toggle('is-active', isActive);
    setBlockFieldsDisabled(block, !isActive);

    if (!isActive) {
      block.querySelectorAll(FIELD_SELECTOR).forEach(clearField);
      block.querySelectorAll(CUSTOM_RADIO_SELECTOR).forEach((container) => {
        clearCustomRadioGroup(form, container);
      });
    }
  });
};

const updateMaxCheckedGroup = (container) => {
  const maxChecked = Number(container.dataset.cf7QuizMaxChecked);

  if (!Number.isInteger(maxChecked) || maxChecked < 1) {
    return;
  }

  const fields = Array.from(container.querySelectorAll('input[type="checkbox"]'));
  const checkedFields = fields.filter((field) => field.checked);
  const isLimitReached = checkedFields.length >= maxChecked;

  fields.forEach((field) => {
    field.disabled = !field.checked && isLimitReached;
  });
};

const getCustomRadioTarget = (form, container) => {
  const fieldName = container.dataset.cf7QuizCustomRadio;

  if (!fieldName) {
    return null;
  }

  return form.querySelector(`input[name="${fieldName}"]`);
};

const getCustomRadioValue = (container) => {
  const checkedField = container.querySelector('input[type="radio"]:checked');

  if (!checkedField) {
    return '';
  }

  if (checkedField.value !== 'custom') {
    return checkedField.value;
  }

  const customValue = container.querySelector(CUSTOM_VALUE_SELECTOR)?.value.trim();

  return customValue ? `${customValue} м²` : '';
};

const syncCustomRadioGroup = (form, container) => {
  const target = getCustomRadioTarget(form, container);

  if (!target) {
    return;
  }

  target.value = getCustomRadioValue(container);
  target.dispatchEvent(new Event('change', { bubbles: true }));
};

const clearCustomRadioGroup = (form, container) => {
  container.querySelectorAll('input[type="radio"]').forEach((field) => {
    field.checked = false;
  });

  const customValue = container.querySelector(CUSTOM_VALUE_SELECTOR);

  if (customValue) {
    customValue.value = '';
  }

  syncCustomRadioGroup(form, container);
};

const initCustomRadioGroups = (form) => {
  form.querySelectorAll(CUSTOM_RADIO_SELECTOR).forEach((container) => {
    const customValue = container.querySelector(CUSTOM_VALUE_SELECTOR);
    const customRadio = customValue?.closest('label')?.querySelector('input[type="radio"]');

    container.querySelectorAll('input[type="radio"]').forEach((field) => {
      field.addEventListener('change', () => {
        if (field.value !== 'custom' && customValue) {
          customValue.value = '';
        }

        syncCustomRadioGroup(form, container);
      });
    });

    if (customValue) {
      customValue.addEventListener('input', () => {
        if (customRadio) {
          customRadio.checked = true;
        }

        syncCustomRadioGroup(form, container);
      });

      customValue.addEventListener('focus', () => {
        if (customRadio) {
          customRadio.checked = true;
        }

        syncCustomRadioGroup(form, container);
      });
    }

    syncCustomRadioGroup(form, container);
  });
};

const initMaxCheckedGroups = (form) => {
  form.querySelectorAll(MAX_CHECKED_SELECTOR).forEach((container) => {
    updateMaxCheckedGroup(container);

    container.querySelectorAll('input[type="checkbox"]').forEach((field) => {
      field.addEventListener('change', () => updateMaxCheckedGroup(container));
    });
  });
};

const showStep = (form, steps, index) => {
  steps.forEach((step, stepIndex) => {
    const isActive = stepIndex === index;

    step.hidden = !isActive;
    step.classList.toggle('is-active', isActive);
  });

  form.dataset.cf7QuizCurrentStep = String(index);

  if (index === 1) {
    updateAreaBlocks(form);
  }
};

const getCurrentStep = (form) => Number(form.dataset.cf7QuizCurrentStep || 0);

const preventInvalidSubmit = (event, form, steps) => {
  const currentStep = getCurrentStep(form);

  if (!validateStep(steps[currentStep])) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};

const initQuiz = (form) => {
  const steps = Array.from(form.querySelectorAll(STEP_SELECTOR));

  if (!steps.length) {
    return;
  }

  showStep(form, steps, 0);
  initCustomRadioGroups(form);
  initMaxCheckedGroups(form);

  form.querySelectorAll('[data-cf7-quiz-next]').forEach((button) => {
    button.addEventListener('click', () => {
      const currentStep = getCurrentStep(form);

      if (!validateStep(steps[currentStep])) {
        return;
      }

      if (currentStep < steps.length - 1) {
        showStep(form, steps, currentStep + 1);
      }
    });
  });

  form.querySelectorAll('[data-cf7-quiz-prev]').forEach((button) => {
    button.addEventListener('click', () => {
      const currentStep = getCurrentStep(form);

      if (currentStep > 0) {
        showStep(form, steps, currentStep - 1);
      }
    });
  });

  form.querySelectorAll('input[name="surface[]"], input[name="surface"]').forEach((input) => {
    input.addEventListener('change', updateAreaBlocks.bind(null, form));
  });

  form.querySelectorAll(FIELD_SELECTOR).forEach((field) => {
    field.addEventListener('input', () => {
      const step = field.closest(STEP_SELECTOR);

      if (step) {
        clearStepValidation(step);
      }
    });
    field.addEventListener('change', () => {
      const step = field.closest(STEP_SELECTOR);

      if (step) {
        clearStepValidation(step);
      }
    });
  });

  form.querySelectorAll(SUBMIT_SELECTOR).forEach((button) => {
    button.addEventListener(
      'click',
      (event) => {
        preventInvalidSubmit(event, form, steps);
      },
      true,
    );
  });

  form.addEventListener(
    'submit',
    (event) => {
      preventInvalidSubmit(event, form, steps);
    },
    true,
  );
};

export const initCf7Quiz = () => {
  document.querySelectorAll(QUIZ_SELECTOR).forEach((quiz) => {
    const form = quiz.closest('form');

    if (form) {
      initQuiz(form);
    }
  });
};
