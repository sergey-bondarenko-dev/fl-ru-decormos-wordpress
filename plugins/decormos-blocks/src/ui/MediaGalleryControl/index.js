import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

function moveItem( items, fromIndex, toIndex ) {
	const nextItems = [ ...items ];
	const [ movedItem ] = nextItems.splice( fromIndex, 1 );

	nextItems.splice( toIndex, 0, movedItem );

	return nextItems;
}

export default function MediaGalleryControl( {
	label,
	items,
	onChange,
	buttonLabel = __( 'Выбрать изображения', 'decormos-blocks' ),
	emptyText = __( 'Изображения пока не выбраны.', 'decormos-blocks' ),
	getItemTitle,
} ) {
	const mediaIds = items.map( ( item ) => item.id ).filter( Boolean );

	const removeItem = ( itemIndex ) => {
		onChange( items.filter( ( _, index ) => index !== itemIndex ) );
	};

	const moveUp = ( itemIndex ) => {
		if ( itemIndex === 0 ) {
			return;
		}

		onChange( moveItem( items, itemIndex, itemIndex - 1 ) );
	};

	const moveDown = ( itemIndex ) => {
		if ( itemIndex >= items.length - 1 ) {
			return;
		}

		onChange( moveItem( items, itemIndex, itemIndex + 1 ) );
	};

	return (
		<div className="decormos-media-gallery-control">
			<p className="decormos-media-gallery-control__label">{ label }</p>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ onChange }
					allowedTypes={ [ 'image' ] }
					multiple
					gallery
					value={ mediaIds }
					render={ ( { open } ) => (
						<Button variant="secondary" onClick={ open }>
							{ buttonLabel }
						</Button>
					) }
				/>
			</MediaUploadCheck>
			{ items.length ? (
				<div className="decormos-media-gallery-control__items">
					{ items.map( ( item, index ) => {
						const itemTitle = getItemTitle
							? getItemTitle( item, index )
							: `${ label } ${ index + 1 }`;

						return (
							<div
								className="decormos-media-gallery-control__item"
								key={ `${ item.id || 'image' }-${ index }` }
							>
								{ item.url ? (
									<img
										className="decormos-media-gallery-control__preview"
										src={ item.url }
										alt=""
									/>
								) : null }
								<div className="decormos-media-gallery-control__meta">
									<p className="decormos-media-gallery-control__item-title">
										{ itemTitle }
									</p>
									<div className="decormos-media-gallery-control__actions">
										<Button
											variant="tertiary"
											label={ __( 'Переместить вверх', 'decormos-blocks' ) }
											showTooltip
											onClick={ () => moveUp( index ) }
											disabled={ index === 0 }
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M5 12.5L10 7.5L15 12.5"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</Button>
										<Button
											variant="tertiary"
											label={ __( 'Переместить вниз', 'decormos-blocks' ) }
											showTooltip
											onClick={ () => moveDown( index ) }
											disabled={ index === items.length - 1 }
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M5 7.5L10 12.5L15 7.5"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</Button>
										<Button
											variant="tertiary"
											isDestructive
											label={ __( 'Удалить', 'decormos-blocks' ) }
											showTooltip
											onClick={ () => removeItem( index ) }
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M6.5 6.5L13.5 13.5"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
												/>
												<path
													d="M13.5 6.5L6.5 13.5"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
												/>
											</svg>
										</Button>
									</div>
								</div>
							</div>
						);
					} ) }
				</div>
			) : (
				<p className="decormos-media-gallery-control__empty">{ emptyText }</p>
			) }
		</div>
	);
}
