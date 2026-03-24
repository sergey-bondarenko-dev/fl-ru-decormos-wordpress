const initHeaderBlock = (root) => {
	if (!(root instanceof HTMLElement)) {
		return;
	}

	const panel = root.querySelector('[data-header-panel]');
	const toggle = root.querySelector('[data-header-toggle]');
	const close = root.querySelector('[data-header-close]');
	const submenuToggles = root.querySelectorAll('[data-header-submenu-toggle]');

	const setMenuState = (isOpen) => {
		if (!(panel instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) {
			return;
		}

		panel.hidden = !isOpen;
		panel.classList.toggle('is-open', isOpen);
		toggle.setAttribute('aria-expanded', String(isOpen));
		document.body.classList.toggle('has-decormos-mobile-menu', isOpen);
	};

	if (toggle instanceof HTMLButtonElement) {
		toggle.addEventListener('click', () => {
			const isOpen = toggle.getAttribute('aria-expanded') === 'true';
			setMenuState(!isOpen);
		});
	}

	if (close instanceof HTMLButtonElement) {
		close.addEventListener('click', () => setMenuState(false));
	}

	submenuToggles.forEach((button) => {
		if (!(button instanceof HTMLButtonElement)) {
			return;
		}

		button.addEventListener('click', () => {
			if (!window.matchMedia('(max-width: 1024px)').matches) {
				return;
			}

			const item = button.closest('.menu__item');

			if (!(item instanceof HTMLElement)) {
				return;
			}

			const isOpen = item.classList.toggle('is-open');
			button.setAttribute('aria-expanded', String(isOpen));
		});
	});

	root.querySelectorAll('.menu-mobile a').forEach((link) => {
		link.addEventListener('click', () => setMenuState(false));
	});
};

document.querySelectorAll('.wp-block-decormos-header').forEach(initHeaderBlock);
