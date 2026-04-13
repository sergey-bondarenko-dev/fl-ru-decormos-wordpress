import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	PanelBody,
} from '@wordpress/components';
import MediaGalleryControl from '../../ui/MediaGalleryControl';
import './editor.scss';

const UNIT_CONTROL_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'rem', label: 'rem' },
	{ value: 'vh', label: 'vh' },
	{ value: '%', label: '%' },
];

const ALLOWED_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/list',
	'core/buttons',
	'core/button',
	'core/spacer',
	'core/group',
	'core/columns',
	'core/column',
];

const TEMPLATE = [ [ 'core/heading', { placeholder: 'Заголовок превью' } ] ];

function getPreferredImageSize( media ) {
	const sizes = media?.sizes;
	const preferredSizes = [ 'large', 'medium_large', 'medium', 'full' ];

	if ( ! sizes ) {
		return media;
	}

	for ( const sizeName of preferredSizes ) {
		if ( sizes[ sizeName ]?.url || sizes[ sizeName ]?.source_url ) {
			return sizes[ sizeName ];
		}
	}

	return media;
}

function getOriginalImageUrl( media ) {
	if ( media?.sizes?.full?.url ) {
		return media.sizes.full.url;
	}

	if ( media?.sizes?.full?.source_url ) {
		return media.sizes.full.source_url;
	}

	if ( media?.source_url ) {
		return media.source_url;
	}

	if ( media?.originalUrl ) {
		return media.originalUrl;
	}

	return media?.url || '';
}

function getImageValue( media ) {
	const preferredSize = getPreferredImageSize( media );

	return {
		id: media?.id || 0,
		url: preferredSize?.url || preferredSize?.source_url || media?.url || media?.source_url || '',
		originalUrl: getOriginalImageUrl( media ),
		alt: media?.alt || '',
		width: preferredSize?.width || media?.width || 0,
		height: preferredSize?.height || media?.height || 0,
	};
}

function mapMediaItems( mediaItems ) {
	return ( mediaItems || [] ).map( getImageValue );
}

function normalizeImages( images = [] ) {
	return images.filter( ( image ) => image?.url ).map( getImageValue );
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { images = [], lightboxId, minHeight = '360px' } = attributes;
	const normalizedImages = normalizeImages( images );
	const previewImage = normalizedImages[ 0 ];
	const duplicateClientIds = useSelect(
		( select ) => {
			if ( ! lightboxId ) {
				return [];
			}

			const editorStore = select( 'core/block-editor' );
			const allClientIds = editorStore.getClientIdsWithDescendants();

			return allClientIds.filter( ( id ) => {
				const block = editorStore.getBlock( id );

				return (
					block?.name === 'decormos/preview-gallery' &&
					block?.attributes?.lightboxId === lightboxId
				);
			} );
		},
		[ lightboxId ]
	);
	const duplicatesKey = duplicateClientIds.join( '|' );

	useEffect( () => {
		if ( lightboxId ) {
			return;
		}

		setAttributes( {
			lightboxId: `preview-gallery-${ Math.random().toString( 36 ).slice( 2, 10 ) }`,
		} );
	}, [ lightboxId, setAttributes ] );

	useEffect( () => {
		if ( ! lightboxId || duplicateClientIds.length < 2 ) {
			return;
		}

		if ( duplicateClientIds[ 0 ] === clientId ) {
			return;
		}

		setAttributes( {
			lightboxId: `preview-gallery-${ Math.random().toString( 36 ).slice( 2, 10 ) }`,
		} );
	}, [
		clientId,
		duplicatesKey,
		duplicateClientIds,
		lightboxId,
		setAttributes,
	] );

	const blockProps = useBlockProps( {
		className: 'preview-gallery-block',
		style: {
			'--preview-gallery-min-height': minHeight || '360px',
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Изображения', 'decormos-blocks' ) } initialOpen>
					<MediaGalleryControl
						label={ __( 'Галерея', 'decormos-blocks' ) }
						items={ images }
						buttonLabel={ __( 'Выбрать изображения', 'decormos-blocks' ) }
						emptyText={ __( 'Изображения пока не добавлены.', 'decormos-blocks' ) }
						onChange={ ( mediaItems ) =>
							setAttributes( { images: mapMediaItems( mediaItems ) } )
						}
					/>
					<UnitControl
						label={ __( 'Минимальная высота блока', 'decormos-blocks' ) }
						value={ minHeight }
						onChange={ ( value ) => setAttributes( { minHeight: value || '360px' } ) }
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'Например: 360px, 60vh.', 'decormos-blocks' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="preview-gallery">
					{ previewImage?.url ? (
						<img
							className="preview-gallery__image"
							src={ previewImage.url }
							alt={ previewImage.alt || '' }
							width={ previewImage.width || undefined }
							height={ previewImage.height || undefined }
						/>
					) : null }
					<div className="preview-gallery__content">
						{ previewImage ? null : (
							<div className="preview-gallery__placeholder">
								{ __( 'Добавь изображения в галерею, чтобы показать превью.', 'decormos-blocks' ) }
							</div>
						) }
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
