import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const initRelatedProjectsSlider = () => {
	const blocks = document.querySelectorAll( '[data-related-projects-slider]' );

	for ( const block of blocks ) {
		const sliderElement = block.querySelector( '[data-related-projects-swiper]' );
		const nextEl = block.querySelector( '[data-related-slider-next]' );
		const prevEl = block.querySelector( '[data-related-slider-prev]' );

		if ( ! sliderElement || ! nextEl || ! prevEl ) {
			continue;
		}

		new Swiper( sliderElement, {
			modules: [ Navigation ],
			slidesPerView: 1,
			spaceBetween: 8,
			navigation: {
				nextEl,
				prevEl,
			},
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 12,
				},
				1200: {
					slidesPerView: 3,
					spaceBetween: 16,
				},
			},
		} );
	}
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initRelatedProjectsSlider );
} else {
	initRelatedProjectsSlider();
}
