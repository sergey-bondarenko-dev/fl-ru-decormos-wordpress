import { useBlockProps } from '@wordpress/block-editor';
import FancyboxImage from '../../ui/FancyboxImage';
import WpImage from '../../ui/WpImage';
import {
	buildSwiperOptions,
	normalizeItems,
	normalizeImageMode,
	normalizeSliderHeight,
} from './utils';

function renderSlideImage( item, options, lightboxGroup ) {
	if ( ! options.useLightbox ) {
		return <WpImage image={ item } className="gallery-slider__image" />;
	}

	return (
		<FancyboxImage
			image={ {
				...item,
				originalUrl: item.fullUrl || item.url,
			} }
			linkClassName="gallery-slider__lightbox-link"
			imageClassName="gallery-slider__image"
			fancybox={ lightboxGroup }
			ariaLabel="Открыть изображение"
		/>
	);
}

function renderSlides( items, options, lightboxGroup ) {
	return items.map( ( item, index ) =>
		item.url ? (
			<div
				className="swiper-slide gallery-slider__slide"
				key={ `${ item.id || 'item' }-${ index }` }
			>
				{ renderSlideImage( item, options, lightboxGroup ) }
			</div>
		) : null
	);
}

export default function save( { attributes } ) {
	const items = normalizeItems( attributes.items );
	const options = buildSwiperOptions( attributes.options, attributes.breakpoints );
	const lightboxGroup = attributes.lightboxId || 'gallery-slider';
	const swiperOptions = JSON.stringify( options );
	const sliderHeight = normalizeSliderHeight( attributes.sliderHeight );
	const imageMode = normalizeImageMode( attributes.imageMode );

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'gallery-slider-block',
				'data-gallery-slider': true,
				'data-image-mode': imageMode,
				'data-swiper-options': swiperOptions,
				style: {
					'--gallery-slider-height': sliderHeight,
				},
			} ) }
		>
			<div className="gallery-slider swiper">
				<div className="swiper-wrapper">
					{ renderSlides( items, options, lightboxGroup ) }
				</div>
				{ options.navigation ? (
					<div className="gallery-slider__navigation">
						<button
							type="button"
							className="swiper-button-prev gallery-slider__button gallery-slider__button--prev"
							aria-label="Предыдущий слайд"
						/>
						<button
							type="button"
							className="swiper-button-next gallery-slider__button gallery-slider__button--next"
							aria-label="Следующий слайд"
						/>
					</div>
				) : null }
			</div>
		</div>
	);
}
