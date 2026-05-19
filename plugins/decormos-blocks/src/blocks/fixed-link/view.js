const SCROLL_THRESHOLD = 80;
const bottomPaddingByBody = new WeakMap();

const getFixedLinkBottomSpace = ( links ) =>
	links.reduce( ( maxSpace, link ) => {
		const rect = link.getBoundingClientRect();
		const bottomOffset = Math.max( window.innerHeight - rect.bottom, 0 );

		return Math.max( maxSpace, Math.ceil( rect.height + bottomOffset ) );
	}, 0 );

const updateBodyBottomPadding = ( body, links ) => {
	if ( ! bottomPaddingByBody.has( body ) ) {
		bottomPaddingByBody.set(
			body,
			window.getComputedStyle( body ).paddingBottom || '0px'
		);
	}

	body.style.paddingBottom = `calc(${ bottomPaddingByBody.get(
		body
	) } + ${ getFixedLinkBottomSpace( links ) }px)`;
};

const initFixedLink = () => {
	const links = [ ...document.querySelectorAll( '.fixed-link' ) ];

	if ( ! links.length ) {
		return;
	}

	const body = document.body;
	let isPointerOverLink = false;
	let ticking = false;

	const updateScrollingClass = () => {
		const shouldCollapse =
			! isPointerOverLink && window.scrollY > SCROLL_THRESHOLD;

		links.forEach( ( link ) => {
			link.classList.toggle( 'scrolling', shouldCollapse );
		} );
	};

	const requestUpdate = () => {
		if ( ticking ) {
			return;
		}

		ticking = true;
		window.requestAnimationFrame( () => {
			updateBodyBottomPadding( body, links );
			updateScrollingClass();
			ticking = false;
		} );
	};

	const observer = window.ResizeObserver
		? new window.ResizeObserver( requestUpdate )
		: null;

	links.forEach( ( link ) => {
		observer?.observe( link );

		link.addEventListener( 'pointerenter', () => {
			isPointerOverLink = true;
			updateScrollingClass();
		} );

		link.addEventListener( 'pointerleave', () => {
			isPointerOverLink = false;
			updateScrollingClass();
		} );
	} );

	window.addEventListener( 'resize', requestUpdate );
	window.addEventListener( 'scroll', updateScrollingClass, {
		passive: true,
	} );

	requestUpdate();
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initFixedLink );
} else {
	initFixedLink();
}
