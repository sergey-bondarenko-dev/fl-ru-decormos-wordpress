import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import clsx from 'clsx';
import MediaGalleryControl from '../../ui/MediaGalleryControl';
import WpImage from '../../ui/WpImage';
import './editor.scss';

const IMAGE_PLACEMENT_OPTIONS = [
	{ label: __( 'Сверху', 'decormos-blocks' ), value: 'top' },
	{ label: __( 'Слева', 'decormos-blocks' ), value: 'left' },
	{ label: __( 'Справа', 'decormos-blocks' ), value: 'right' },
	{ label: __( 'Снизу', 'decormos-blocks' ), value: 'bottom' },
];

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/quote',
	'core/table',
	'core/buttons',
	'core/button',
	'core/separator',
	'core/spacer',
	'core/group',
	'core/columns',
	'core/column',
];

const TEMPLATE = [ [ 'core/paragraph', { placeholder: 'Текст части статьи' } ] ];

const IMAGE_SIZES =
	'(max-width: 781px) 100vw, (max-width: 1280px) 50vw, 412px';

const UNIT_CONTROL_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'rem', label: 'rem' },
	{ value: '%', label: '%' },
	{ value: 'vh', label: 'vh' },
];

function getPreferredImageSize( media ) {
	const sizes = media?.sizes;
	const preferredSizes = [ 'large', 'medium_large', 'medium', 'full' ];

	if ( ! sizes ) {
		return media;
	}

	for ( const sizeName of preferredSizes ) {
		if ( sizes[ sizeName ]?.url ) {
			return sizes[ sizeName ];
		}
	}

	return media;
}

function getOriginalImageUrl( media ) {
	if ( media?.sizes?.full?.url ) {
		return media.sizes.full.url;
	}

	return media?.url || '';
}

function getImageValue( media ) {
	const preferredSize = getPreferredImageSize( media );

	return {
		id: media.id || 0,
		url: preferredSize?.url || media.url || '',
		alt: media.alt || '',
		width: preferredSize?.width || media.width || 0,
		height: preferredSize?.height || media.height || 0,
		originalUrl: getOriginalImageUrl( media ),
	};
}

function mapMediaItems( mediaItems ) {
	return ( mediaItems || [] ).map( getImageValue );
}

function getBlockClassName( imagePlacement, imageColumns ) {
	return clsx( 'article-block', {
		'article-block--image-top': imagePlacement === 'top',
		'article-block--image-left': imagePlacement === 'left',
		'article-block--image-right': imagePlacement === 'right',
		'article-block--image-bottom': imagePlacement === 'bottom',
		[`article-block--image-columns-${ imageColumns }`]:
			imagePlacement === 'top' || imagePlacement === 'bottom',
	} );
}

export default function Edit( { attributes, clientId, setAttributes } ) {
	const { galleryId, imagePlacement, imageColumns, imageMinHeight, images } =
		attributes;
	const hasInitializedGalleryId = useRef( false );
	const usesImageColumns =
		imagePlacement === 'top' || imagePlacement === 'bottom';

	useEffect( () => {
		if ( ! hasInitializedGalleryId.current && ! galleryId ) {
			hasInitializedGalleryId.current = true;
			setAttributes( {
				galleryId: `article-section-${ clientId.split( '-' )[ 0 ] }`,
			} );
			return;
		}

		hasInitializedGalleryId.current = true;
	}, [ clientId, galleryId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: getBlockClassName( imagePlacement, imageColumns ),
		style: {
			'--article-block-images-min-height': imageMinHeight || undefined,
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Изображения', 'decormos-blocks' ) } initialOpen>
					<SelectControl
						label={ __( 'Положение изображений', 'decormos-blocks' ) }
						value={ imagePlacement }
						options={ IMAGE_PLACEMENT_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { imagePlacement: value } )
						}
					/>
					{ usesImageColumns ? (
						<RangeControl
							label={ __( 'Количество столбцов', 'decormos-blocks' ) }
							value={ imageColumns }
							onChange={ ( value ) =>
								setAttributes( { imageColumns: value || 3 } )
							}
							min={ 1 }
							max={ 5 }
						/>
					) : null }
					<UnitControl
						label={ __(
							'Минимальная высота блока с изображениями',
							'decormos-blocks'
						) }
						value={ imageMinHeight }
						onChange={ ( value ) =>
							setAttributes( { imageMinHeight: value || '' } )
						}
						units={ UNIT_CONTROL_UNITS }
						help={ __(
							'Например: 260px, 20rem, 40vh.',
							'decormos-blocks'
						) }
					/>
					<MediaGalleryControl
						label={ __( 'Галерея', 'decormos-blocks' ) }
						items={ images }
						buttonLabel={ __( 'Выбрать изображения', 'decormos-blocks' ) }
						emptyText={ __(
							'Изображения пока не добавлены.',
							'decormos-blocks'
						) }
						onChange={ ( mediaItems ) =>
							setAttributes( { images: mapMediaItems( mediaItems ) } )
						}
						getItemTitle={ ( item, index ) =>
							`Изображение ${ index + 1 }`
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="article-block__content">
					<div className="article-block__content-text">
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
						/>
					</div>

					<div className="article-block__content-images">
						{ images.length ? (
							images.map( ( image, index ) =>
								image?.url ? (
									<div
										className="article-block__editor-image"
										key={ `${ image.id || 'image' }-${ index }` }
									>
										<WpImage image={ image } sizes={ IMAGE_SIZES } />
									</div>
								) : null
							)
						) : (
							<div className="article-block__editor-placeholder">
								<div className="article-block__editor-placeholder-title">
									{ __( 'Галерея пока пуста', 'decormos-blocks' ) }
								</div>
								<div className="article-block__editor-placeholder-text">
									{ __(
										'Добавь изображения в боковой панели, чтобы увидеть их здесь.',
										'decormos-blocks'
									) }
								</div>
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
