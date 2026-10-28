document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu-links');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const form = document.getElementById('contactForm');
  const purposeBtns = document.querySelectorAll('.purpose-btn');
  const formPurpose = document.getElementById('formPurpose');
  const formSubject = document.getElementById('formSubject');
  const generalSection = document.getElementById('generalSection');
  const giveawaySection = document.getElementById('giveawaySection');
  const statusMessage = document.getElementById('statusMessage');
  const deliveryMethod = document.getElementById('deliveryMethod');
  const shippingAddressFields = document.getElementById('shippingAddressFields');

  let currentPurpose = 'general';
  let currentStep = 1;

  function showStatus(message) {
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden');
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.classList.add('hidden');

    document.querySelectorAll('.invalid').forEach(field => {
      field.classList.remove('invalid');
    });
  }

  function fieldValue(id) {
    const field = document.getElementById(id);
    if (!field) return '—';

    const value = field.value.trim();
    return value || '—';
  }

  function setReviewValue(id, value) {
    const reviewField = document.getElementById(id);
    if (reviewField) {
      reviewField.textContent = value || '—';
    }
  }

  function updateReviewSummary() {
    const first = fieldValue('first');
    const last = fieldValue('last');
    const delivery = fieldValue('deliveryMethod');

    setReviewValue('reviewName', `${first} ${last}`.trim());
    setReviewValue('reviewEmail', fieldValue('email'));
    setReviewValue('reviewEvent', fieldValue('giveawayEvent'));
    setReviewValue('reviewStreamer', fieldValue('streamer'));
    setReviewValue('reviewPlatform', fieldValue('platform'));
    setReviewValue('reviewHandle', fieldValue('winnerHandle'));
    setReviewValue('reviewDateWon', fieldValue('dateWon'));
    setReviewValue('reviewItemWon', fieldValue('itemWon'));
    setReviewValue('reviewPrizeType', fieldValue('prizeType'));
    setReviewValue('reviewDeliveryMethod', delivery);
    setReviewValue('reviewNotes', fieldValue('giveawayNotes'));

    if (delivery === 'Ship to address') {
      const shippingLines = [
        fieldValue('shippingName'),
        fieldValue('address1'),
        fieldValue('address2') !== '—' ? fieldValue('address2') : '',
        `${fieldValue('city')}, ${fieldValue('state')} ${fieldValue('zip')}`,
        fieldValue('country')
      ].filter(line => line && line !== '—');

      setReviewValue('reviewShipping', shippingLines.join(' | '));
    } else {
      setReviewValue('reviewShipping', delivery);
    }
  }

  function setRequiredStates() {
    document.querySelectorAll('[data-required="true"], [data-shipping-required="true"]').forEach(field => {
      field.required = false;
    });

    if (currentPurpose === 'general') {
      generalSection.querySelectorAll('[data-required="true"]').forEach(field => {
        field.required = true;
      });
    }

    if (currentPurpose === 'giveaway') {
      const activeStep = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);

      if (activeStep) {
        activeStep.querySelectorAll('[data-required="true"]').forEach(field => {
          field.required = true;
        });

        if (currentStep === 2 && deliveryMethod.value === 'Ship to address') {
          activeStep.querySelectorAll('[data-shipping-required="true"]').forEach(field => {
            field.required = true;
          });
        }
      }
    }
  }

  function updateShippingVisibility() {
    if (deliveryMethod.value === 'Ship to address') {
      shippingAddressFields.classList.remove('hidden');
    } else {
      shippingAddressFields.classList.add('hidden');
    }

    setRequiredStates();
  }

  function updateStep(step) {
    currentStep = step;

    document.querySelectorAll('.wizard-step').forEach(stepEl => {
      stepEl.classList.toggle('hidden', Number(stepEl.dataset.step) !== step);
    });

    document.querySelectorAll('.step-pill').forEach(pill => {
      pill.classList.toggle('active', Number(pill.dataset.stepPill) === step);
    });

    if (step === 3) {
      updateReviewSummary();
    }

    clearStatus();
    setRequiredStates();
  }

  function updatePurpose(purpose) {
    currentPurpose = purpose;

    purposeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.purpose === purpose);
    });

    if (purpose === 'giveaway') {
      generalSection.classList.add('hidden');
      giveawaySection.classList.remove('hidden');

      formPurpose.value = 'Giveaway Claim';
      formSubject.value = 'New Giveaway Claim from FaithForgeGaming.com';

      updateStep(1);
    } else {
      generalSection.classList.remove('hidden');
      giveawaySection.classList.add('hidden');

      formPurpose.value = 'General Contact';
      formSubject.value = 'New message from FaithForgeGaming.com';

      clearStatus();
      setRequiredStates();
    }
  }

  function getVisibleRequiredFields(container) {
    return Array.from(container.querySelectorAll('input, select, textarea')).filter(field => {
      if (!field.required) return false;
      if (field.closest('.hidden')) return false;
      return true;
    });
  }

  function validateFields(fields) {
    clearStatus();

    for (const field of fields) {
      const isCheckbox = field.type === 'checkbox';
      const isValid = isCheckbox ? field.checked : field.checkValidity();

      if (!isValid) {
        field.classList.add('invalid');
        field.focus();
        showStatus('Please fill out the highlighted field before continuing.');
        return false;
      }
    }

    return true;
  }

  function validateYourInfo() {
    const fields = [
      document.getElementById('first'),
      document.getElementById('last'),
      document.getElementById('email')
    ];

    return validateFields(fields);
  }

  function validateCurrentStep() {
    if (!validateYourInfo()) return false;

    const activeStep = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    const fields = getVisibleRequiredFields(activeStep);

    return validateFields(fields);
  }

  function validateAllGiveawaySteps() {
    if (!validateYourInfo()) return false;

    const requiredIds = [
      'giveawayEvent',
      'streamer',
      'platform',
      'winnerHandle',
      'dateWon',
      'itemWon',
      'prizeType',
      'deliveryMethod',
      'winnerConfirm'
    ];

    if (deliveryMethod.value === 'Ship to address') {
      requiredIds.push('shippingName', 'address1', 'city', 'state', 'zip', 'country');
    }

    for (const id of requiredIds) {
      const field = document.getElementById(id);
      if (!field) continue;

      const isCheckbox = field.type === 'checkbox';
      const isValid = isCheckbox ? field.checked : field.value.trim() !== '' && field.checkValidity();

      if (!isValid) {
        const step = field.closest('.wizard-step');
        if (step) {
          updateStep(Number(step.dataset.step));
        }

        field.classList.add('invalid');
        field.focus();
        showStatus('Please complete all required giveaway fields before submitting.');
        return false;
      }
    }

    return true;
  }

  purposeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updatePurpose(btn.dataset.purpose);
    });
  });

  document.querySelectorAll('[data-next-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!validateCurrentStep()) return;
      updateStep(Number(btn.dataset.nextStep));
    });
  });

  document.querySelectorAll('[data-prev-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateStep(Number(btn.dataset.prevStep));
    });
  });

  deliveryMethod.addEventListener('change', updateShippingVisibility);

  form.addEventListener('submit', (e) => {
    clearStatus();

    const first = document.getElementById('first').value.trim();
    const last = document.getElementById('last').value.trim();

    if (currentPurpose === 'giveaway') {
      if (!validateAllGiveawaySteps()) {
        e.preventDefault();
        return;
      }

      const event = document.getElementById('giveawayEvent').value.trim();
      const streamer = document.getElementById('streamer').value.trim();
      const itemWon = document.getElementById('itemWon').value.trim();

      formSubject.value = `Giveaway Claim - ${event} - ${first} ${last} - ${streamer} - ${itemWon}`;
    } else {
      setRequiredStates();

      const generalFields = getVisibleRequiredFields(generalSection);

      if (!validateYourInfo() || !validateFields(generalFields)) {
        e.preventDefault();
        return;
      }

      const subject = document.getElementById('subject').value.trim();

      formSubject.value = `Contact Message - ${first} ${last} - ${subject}`;
    }
  });

  updatePurpose('general');
  updateShippingVisibility();
});
