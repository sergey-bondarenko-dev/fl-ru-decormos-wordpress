function setActiveItem( block, targetSelector ) {
	if ( ! targetSelector ) {
		return;
	}

	const images = block.querySelectorAll( '[data-usage-areas-image]' );
	const triggers = block.querySelectorAll( '[data-usage-areas-trigger]' );

	if ( ! images.length || ! triggers.length ) {
		return;
	}

	images.forEach( ( image ) => {
		image.classList.toggle( 'is-active', `#${ image.id }` === targetSelector );
	} );

	triggers.forEach( ( trigger ) => {
		const isActive = trigger.dataset.for === targetSelector;
		trigger.classList.toggle( 'is-active', isActive );
		trigger.setAttribute( 'aria-pressed', isActive ? 'true' : 'false' );
	} );
}

function initUsageAreas( block ) {
	const triggersWrapper = block.querySelector( '[data-usage-areas-triggers]' );

	if ( ! triggersWrapper ) {
		return;
	}

	triggersWrapper.addEventListener( 'click', ( event ) => {
		const trigger = event.target.closest( '[data-usage-areas-trigger]' );

		if ( ! trigger || ! triggersWrapper.contains( trigger ) ) {
			return;
		}

		setActiveItem( block, trigger.dataset.for );
	} );
}

document
	.querySelectorAll( '[data-usage-areas]' )
	.forEach( initUsageAreas );
