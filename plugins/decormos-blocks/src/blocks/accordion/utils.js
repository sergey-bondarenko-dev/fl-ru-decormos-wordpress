export function buildAccordionStyles( attributes ) {
	return {
		'--bs-accordion-color': attributes.textColor || undefined,
		'--bs-accordion-bg': attributes.backgroundColor || undefined,
		'--bs-accordion-border-color': attributes.borderColor || undefined,
		'--bs-accordion-border-width': attributes.borderWidth || undefined,
		'--bs-accordion-border-radius': attributes.borderRadius || undefined,
		'--bs-accordion-inner-border-radius':
			attributes.borderRadius || undefined,
		'--bs-accordion-btn-padding-x': attributes.buttonPaddingX || undefined,
		'--bs-accordion-btn-padding-y': attributes.buttonPaddingY || undefined,
		'--bs-accordion-btn-color': attributes.buttonColor || undefined,
		'--bs-accordion-btn-bg':
			attributes.buttonBackgroundColor || undefined,
		'--bs-accordion-body-padding-x': attributes.bodyPaddingX || undefined,
		'--bs-accordion-body-padding-y': attributes.bodyPaddingY || undefined,
		'--bs-accordion-active-color': attributes.activeColor || undefined,
		'--bs-accordion-active-bg':
			attributes.activeBackgroundColor || undefined,
	};
}
