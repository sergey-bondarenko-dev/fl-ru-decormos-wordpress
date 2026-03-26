import { useBlockProps } from '@wordpress/block-editor';
import { buildSwiperOptions, normalizeItems } from './utils';

function renderSlides( items ) {
	return items.map( ( item, index ) =>
		item.url ? (
			<div
				className="swiper-slide gallery-slider__slide"
				key={ `${ item.id || 'item' }-${ index }` }
			>
				<img
					className="gallery-slider__image"
					src={ item.url }
					alt={ item.alt || '' }
					width={ item.width || undefined }
					height={ item.height || undefined }
				/>
			</div>
		) : null
	);
}

export default function save( { attributes } ) {
	const items = normalizeItems( attributes.items );
	const options = buildSwiperOptions( attributes.options, attributes.breakpoints );
	const swiperOptions = JSON.stringify( options );

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'gallery-slider-block',
				'data-gallery-slider': true,
				'data-swiper-options': swiperOptions,
			} ) }
		>
			<div className="gallery-slider swiper">
				<div className="swiper-wrapper">{ renderSlides( items ) }</div>
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
