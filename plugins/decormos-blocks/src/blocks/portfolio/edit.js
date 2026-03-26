import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import FancyboxImage from '../../ui/FancyboxImage';
import MediaGalleryControl from '../../ui/MediaGalleryControl';
import './editor.scss';

const IMAGE_SIZES = [ 'large', 'medium_large', 'medium', 'full' ];
const PORTFOLIO_IMAGE_SIZES =
	'(max-width: 767px) 50vw, (max-width: 1200px) 33vw, (max-width: 1920px) 25vw, 457px';

function getPreferredImageSize( media ) {
	const sizes = media?.sizes;

	if ( ! sizes ) {
		return media;
	}

	for ( const sizeName of IMAGE_SIZES ) {
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
		width: preferredSize?.width || media.width || 0,
		height: preferredSize?.height || media.height || 0,
		originalUrl: getOriginalImageUrl( media ),
	};
}

function mapMediaItems( mediaItems ) {
	return ( mediaItems || [] ).map( getImageValue );
}

export default function Edit( { attributes, setAttributes } ) {
	const { items, moreItems, moreButtonText } = attributes;
	const [ showAllItems, setShowAllItems ] = useState( false );
	const blockProps = useBlockProps( {
		className: 'portfolio-block',
	} );
	const visibleItems = showAllItems ? [ ...items, ...moreItems ] : items;
	const hasVisibleItems = visibleItems.some( ( item ) => item?.url );

	const updateCollection = ( key, nextItems ) => {
		setAttributes( { [ key ]: nextItems } );
	};

	useEffect( () => {
		if ( ! moreItems.length ) {
			setShowAllItems( false );
		}
	}, [ moreItems.length ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Основные изображения', 'decormos-blocks' ) } initialOpen>
					<MediaGalleryControl
						label={ __( 'Основная галерея', 'decormos-blocks' ) }
						items={ items }
						buttonLabel={ __( 'Выбрать изображения', 'decormos-blocks' ) }
						emptyText={ __( 'Изображения пока не добавлены.', 'decormos-blocks' ) }
						onChange={ ( mediaItems ) =>
							updateCollection( 'items', mapMediaItems( mediaItems ) )
						}
						getItemTitle={ ( item, index ) =>
							`Изображение ${ index + 1 }`
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Дополнительные изображения', 'decormos-blocks' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Текст кнопки', 'decormos-blocks' ) }
						value={ moreButtonText }
						onChange={ ( value ) =>
							setAttributes( { moreButtonText: value } )
						}
					/>
					<MediaGalleryControl
						label={ __( 'Дополнительная галерея', 'decormos-blocks' ) }
						items={ moreItems }
						buttonLabel={ __( 'Выбрать изображения', 'decormos-blocks' ) }
						emptyText={ __(
							'Дополнительные изображения пока не добавлены.',
							'decormos-blocks'
						) }
						onChange={ ( mediaItems ) =>
							updateCollection( 'moreItems', mapMediaItems( mediaItems ) )
						}
						getItemTitle={ ( item, index ) =>
							`Дополнительное изображение ${ index + 1 }`
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } data-portfolio-block>
				<div className="portfolio portfolio--editor-preview" data-portfolio-grid>
					{ hasVisibleItems ? (
						<>
							{ visibleItems.map( ( item, index ) =>
								item.url ? (
									<div
										className="portfolio__item"
										key={ `${ item.id || 'item' }-${ index }` }
									>
										<FancyboxImage
											image={ item }
											sizes={ PORTFOLIO_IMAGE_SIZES }
										/>
									</div>
								) : null
							) }
						</>
					) : (
						<div className="portfolio__placeholder">
							<div className="portfolio__placeholder-icon" aria-hidden="true">
								<svg viewBox="0 0 24 24" focusable="false">
									<path d="M4 5h16v14H4V5zm1.5 1.5v11h13V6.5h-13zm2.2 8.8 2.7-3.3 2.1 2.5 3.2-4 2.6 4.8H7.7zm1.8-6.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
								</svg>
							</div>
							<div className="portfolio__placeholder-title">
								{ __( 'Галерея портфолио пуста', 'decormos-blocks' ) }
							</div>
							<div className="portfolio__placeholder-text">
								{ __(
									'Добавь изображения в боковой панели, чтобы увидеть превью блока.',
									'decormos-blocks'
								) }
							</div>
						</div>
					) }
				</div>
				{ moreItems.length && ! showAllItems ? (
					<>
						<button
							type="button"
							className="portfolio__more-button"
							onClick={ () => setShowAllItems( true ) }
						>
							{ moreButtonText }
						</button>
					</>
				) : null }
			</div>
		</>
	);
}
