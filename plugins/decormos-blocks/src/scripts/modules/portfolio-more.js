function getPortfolioBlocks( scope = document ) {
	if ( scope instanceof Element && scope.matches( '[data-portfolio-block]' ) ) {
		return [ scope ];
	}

	return Array.from( scope.querySelectorAll( '[data-portfolio-block]' ) );
}

function initPortfolioMoreInstance( block ) {
	if ( block.__portfolioMoreInitialized ) {
		return;
	}

	const button = block.querySelector( '[data-portfolio-more-button]' );
	const template = block.querySelector( '[data-portfolio-template]' );
	const portfolioRootElement = block.querySelector( '[data-portfolio-grid]' );

	if ( ! button || ! portfolioRootElement ) {
		return;
	}

	block.__portfolioMoreInitialized = true;

	if ( ! template ) {
		button.setAttribute( 'hidden', '' );
		return;
	}

	const templateItems = template.content.querySelectorAll( '.portfolio__item' );

	if ( templateItems.length === 0 ) {
		button.setAttribute( 'hidden', '' );
		return;
	}

	button.addEventListener( 'click', () => {
		const fragment = template.content.cloneNode( true );
		const newItems = Array.from( fragment.querySelectorAll( '.portfolio__item' ) );

		if ( newItems.length === 0 ) {
			button.setAttribute( 'hidden', '' );
			return;
		}

		portfolioRootElement.appendChild( fragment );
		button.setAttribute( 'hidden', '' );
	} );
}

export function initPortfolioMore( scope = document ) {
	getPortfolioBlocks( scope ).forEach( initPortfolioMoreInstance );
}
