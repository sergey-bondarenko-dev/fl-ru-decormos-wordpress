const initProjectCategoriesFilter = () => {
	const selects = document.querySelectorAll(
		'.wp-block-decormos-project-categories-filter [data-project-categories-select]'
	);

	for ( const select of selects ) {
		select.addEventListener( 'change', () => {
			const nextUrl = select.value;

			if ( ! nextUrl ) {
				return;
			}

			window.location.href = nextUrl;
		} );
	}
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initProjectCategoriesFilter );
} else {
	initProjectCategoriesFilter();
}
