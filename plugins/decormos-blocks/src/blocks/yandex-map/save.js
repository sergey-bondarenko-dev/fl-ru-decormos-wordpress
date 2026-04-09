import { useBlockProps } from '@wordpress/block-editor';

const DEFAULT_RATIO_WIDTH = 16;
const DEFAULT_RATIO_HEIGHT = 9;

const normalizeRatioNumber = ( value, fallback ) => {
	const numericValue = Number( value );

	if ( Number.isNaN( numericValue ) || numericValue <= 0 ) {
		return fallback;
	}

	return Math.round( numericValue * 100 ) / 100;
};

export default function save( { attributes } ) {
	const { mapUrl, ratioWidth, ratioHeight, title, lazyLoad } = attributes;

	if ( ! mapUrl ) {
		return null;
	}

	const normalizedRatioWidth = normalizeRatioNumber( ratioWidth, DEFAULT_RATIO_WIDTH );
	const normalizedRatioHeight = normalizeRatioNumber( ratioHeight, DEFAULT_RATIO_HEIGHT );
	const normalizedAspectRatio = `${ normalizedRatioWidth } / ${ normalizedRatioHeight }`;

	const blockProps = useBlockProps.save( {
		className: 'decormos-yandex-map',
	} );

	return (
		<div { ...blockProps }>
			<div
				className="decormos-yandex-map__frame"
				style={ {
					'--decormos-yandex-map-aspect-ratio': normalizedAspectRatio,
				} }
			>
				<iframe
					src={ mapUrl }
					title={ title || 'Карта' }
					loading={ lazyLoad ? 'lazy' : 'eager' }
					referrerPolicy="no-referrer-when-downgrade"
					allowFullScreen
				/>
			</div>
		</div>
	);
}
