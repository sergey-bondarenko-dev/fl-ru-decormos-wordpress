function getCurrentPathWithSearch() {
	return `${ window.location.pathname }${ window.location.search }`;
}

function getThanksUrl() {
	return new URL( '/thanks', window.location.origin );
}

function getSafeBackUrl() {
	const params = new URLSearchParams( window.location.search );
	const backUrl = params.get( 'back' );

	if ( ! backUrl || ! backUrl.startsWith( '/' ) ) {
		return null;
	}

	return backUrl;
}

function isThanksPage() {
	return window.location.pathname.replace( /\/+$/, '' ) === '/thanks';
}

function redirectToThanksPage() {
	const thanksUrl = getThanksUrl();

	thanksUrl.searchParams.set( 'back', getCurrentPathWithSearch() );
	window.location.href = thanksUrl.toString();
}

function initCf7SuccessRedirect() {
	document.addEventListener( 'wpcf7mailsent', redirectToThanksPage );
}

function initThanksBackRedirect() {
	if ( ! isThanksPage() ) {
		return;
	}

	const backUrl = getSafeBackUrl();

	if ( ! backUrl ) {
		return;
	}

	window.setTimeout( () => {
		window.location.href = backUrl;
	}, 5000 );
}

export function initCf7ThanksRedirect() {
	initCf7SuccessRedirect();
	initThanksBackRedirect();
}
