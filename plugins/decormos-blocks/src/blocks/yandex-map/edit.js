import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Placeholder, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const DEFAULT_RATIO_WIDTH = 16;
const DEFAULT_RATIO_HEIGHT = 9;

const parseMapUrlInput = ( value ) => {
	if ( ! value ) {
		return '';
	}

	const normalizedValue = value.trim();

	if ( ! normalizedValue.includes( '<' ) ) {
		return normalizedValue.replaceAll( '&amp;', '&' );
	}

	const srcMatches = [ ...normalizedValue.matchAll( /src=["']([^"']+)["']/gi ) ];

	if ( ! srcMatches.length ) {
		return '';
	}

	const preferredMatch = srcMatches.find( ( match ) =>
		match[ 1 ]?.includes( 'map-widget/v1' )
	);
	const fallbackMatch = preferredMatch || srcMatches[ 0 ];

	return ( fallbackMatch?.[ 1 ] || '' ).replaceAll( '&amp;', '&' );
};

const normalizeRatioNumber = ( value, fallback ) => {
	const numericValue = Number( value );

	if ( Number.isNaN( numericValue ) || numericValue <= 0 ) {
		return fallback;
	}

	return Math.round( numericValue * 100 ) / 100;
};

export default function Edit( { attributes, setAttributes } ) {
	const { mapUrl, ratioWidth, ratioHeight, title, lazyLoad } = attributes;

	const blockProps = useBlockProps( {
		className: 'decormos-yandex-map',
	} );

	const normalizedRatioWidth = normalizeRatioNumber( ratioWidth, DEFAULT_RATIO_WIDTH );
	const normalizedRatioHeight = normalizeRatioNumber( ratioHeight, DEFAULT_RATIO_HEIGHT );
	const normalizedAspectRatio = `${ normalizedRatioWidth } / ${ normalizedRatioHeight }`;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки карты', 'decormos-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'Ссылка карты (iframe src)', 'decormos-blocks' ) }
						value={ mapUrl }
						onChange={ ( value ) =>
							setAttributes( {
								mapUrl: parseMapUrlInput( value ),
							} )
						}
						help={ __(
							'Можно вставить src или весь код iframe/script: блок сам извлечет URL карты.',
							'decormos-blocks'
						) }
					/>
					<TextControl
						label={ __( 'Ширина соотношения', 'decormos-blocks' ) }
						type="number"
						min={ 1 }
						step="0.01"
						value={ String( normalizedRatioWidth ) }
						onChange={ ( value ) =>
							setAttributes( {
								ratioWidth: normalizeRatioNumber( value, DEFAULT_RATIO_WIDTH ),
							} )
						}
						help={ __( 'Например: 16', 'decormos-blocks' ) }
					/>
					<TextControl
						label={ __( 'Высота соотношения', 'decormos-blocks' ) }
						type="number"
						min={ 1 }
						step="0.01"
						value={ String( normalizedRatioHeight ) }
						onChange={ ( value ) =>
							setAttributes( {
								ratioHeight: normalizeRatioNumber( value, DEFAULT_RATIO_HEIGHT ),
							} )
						}
						help={ __( 'Например: 9', 'decormos-blocks' ) }
					/>
					<TextControl
						label={ __( 'Title для iframe', 'decormos-blocks' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					<ToggleControl
						label={ __( 'Ленивая загрузка (loading=lazy)', 'decormos-blocks' ) }
						checked={ lazyLoad }
						onChange={ ( value ) => setAttributes( { lazyLoad: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ mapUrl ? (
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
				) : (
					<Placeholder
						label={ __( 'Yandex Map', 'decormos-blocks' ) }
						instructions={ __(
							'Добавьте ссылку карты в настройках блока справа.',
							'decormos-blocks'
						) }
					/>
				) }
			</div>
		</>
	);
}
