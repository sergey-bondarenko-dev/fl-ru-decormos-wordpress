const HERO_SELECTOR = '.wp-block-decormos-hero[data-consider-header-offset="true"]';

function getHeaderHeight( selector ) {
	let headerElement = null;

	try {
		headerElement = document.querySelector( selector );
	} catch ( error ) {
		return 0;
	}

	if ( ! headerElement ) {
		return 0;
	}

	return Math.max( 0, Math.round( headerElement.getBoundingClientRect().height ) );
}

function applyHeroHeaderOffset( heroElement ) {
	const selector = heroElement.dataset.headerSelector || '.header';
	const headerHeight = getHeaderHeight( selector );

	heroElement.style.setProperty( '--heroHeightOffset', `${ headerHeight }px` );
}

function initHeroHeaderOffset( heroElement ) {
	applyHeroHeaderOffset( heroElement );

	const selector = heroElement.dataset.headerSelector || '.header';
	let headerElement = null;

	try {
		headerElement = document.querySelector( selector );
	} catch ( error ) {
		return;
	}

	if ( ! headerElement ) {
		return;
	}

	if ( typeof ResizeObserver === 'function' ) {
		const resizeObserver = new ResizeObserver( () => {
			applyHeroHeaderOffset( heroElement );
		} );
		resizeObserver.observe( headerElement );
	}

	window.addEventListener( 'resize', () => {
		applyHeroHeaderOffset( heroElement );
	} );
}

function start() {
	const heroElements = document.querySelectorAll( HERO_SELECTOR );
	heroElements.forEach( initHeroHeaderOffset );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', start );
} else {
	start();
}
