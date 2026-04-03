function decodeHtml( value ) {
	const parser = document.createElement( 'textarea' );
	parser.innerHTML = value || '';
	return parser.value;
}

function buildProjectCard( project, ctaText ) {
	const article = document.createElement( 'article' );
	article.className = 'projects-grid__item';

	const link = document.createElement( 'a' );
	link.className = 'decormos-project-card';
	link.href = project?.link || '#';

	const media = document.createElement( 'div' );
	media.className = 'decormos-project-card__media';

	const imageUrl =
		project?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url || '';

	if ( imageUrl ) {
		const image = document.createElement( 'img' );
		image.src = imageUrl;
		image.alt = '';
		image.loading = 'lazy';
		media.appendChild( image );
	}

	const overlay = document.createElement( 'div' );
	overlay.className = 'decormos-project-card__overlay';

	const title = document.createElement( 'p' );
	title.className = 'decormos-project-card__title';
	title.textContent = decodeHtml( project?.title?.rendered || '' ) || 'Без названия';

	const cta = document.createElement( 'p' );
	cta.className = 'decormos-project-card__cta';
	cta.textContent = ctaText || 'Примеры работ';

	overlay.appendChild( title );
	overlay.appendChild( cta );

	link.appendChild( media );
	link.appendChild( overlay );
	article.appendChild( link );

	return article;
}

function buildApiUrl( button ) {
	const postsPerPage = Number( button.dataset.postsPerPage ) || 12;
	const offset = Number( button.dataset.offset ) || 0;
	const termId = Number( button.dataset.termId ) || 0;
	const order = button.dataset.order || 'desc';
	const orderBy = button.dataset.orderBy || 'date';

	const url = new URL( '/wp-json/wp/v2/project', window.location.origin );
	url.searchParams.set( 'per_page', String( postsPerPage ) );
	url.searchParams.set( 'offset', String( offset ) );
	url.searchParams.set( 'order', order );
	url.searchParams.set( 'orderby', orderBy );
	url.searchParams.set( '_embed', '1' );

	if ( termId > 0 ) {
		url.searchParams.set( 'project_category', String( termId ) );
	}

	return url.toString();
}

async function onLoadMoreClick( button, list ) {
	if ( button.dataset.loading === 'true' ) {
		return;
	}

	button.dataset.loading = 'true';
	button.disabled = true;

	try {
		const response = await fetch( buildApiUrl( button ) );

		if ( ! response.ok ) {
			throw new Error( `HTTP ${ response.status }` );
		}

		const projects = await response.json();

		if ( ! Array.isArray( projects ) || ! projects.length ) {
			button.remove();
			return;
		}

		const ctaText = button.dataset.ctaText || 'Примеры работ';
		const fragment = document.createDocumentFragment();

		for ( const project of projects ) {
			fragment.appendChild( buildProjectCard( project, ctaText ) );
		}

		list.appendChild( fragment );

		const nextOffset = ( Number( button.dataset.offset ) || 0 ) + projects.length;
		button.dataset.offset = String( nextOffset );

		const totalPosts = Number( button.dataset.totalPosts ) || 0;
		if ( totalPosts > 0 && nextOffset >= totalPosts ) {
			button.remove();
			return;
		}
	} catch ( error ) {
		// Keep button visible on errors so user can retry.
	} finally {
		if ( button.isConnected ) {
			button.disabled = false;
		}
		button.dataset.loading = 'false';
	}
}

function initProjectsGrid() {
	const blocks = document.querySelectorAll( '.wp-block-decormos-projects-grid[data-projects-grid]' );

	for ( const block of blocks ) {
		const list = block.querySelector( '[data-projects-grid-list]' );
		const button = block.querySelector( '[data-projects-grid-more]' );

		if ( ! list || ! button ) {
			continue;
		}

		button.addEventListener( 'click', () => onLoadMoreClick( button, list ) );
	}
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initProjectsGrid );
} else {
	initProjectsGrid();
}
