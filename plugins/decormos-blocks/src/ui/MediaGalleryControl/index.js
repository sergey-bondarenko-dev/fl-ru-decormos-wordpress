import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function MediaGalleryControl( {
	label,
	items,
	onChange,
	buttonLabel = __( 'Выбрать изображения', 'decormos-blocks' ),
	emptyText = __( 'Изображения пока не выбраны.', 'decormos-blocks' ),
} ) {
	const mediaIds = items.map( ( item ) => item.id ).filter( Boolean );
	const hasItems = items.length > 0;
	const currentButtonLabel = hasItems
		? __( 'Открыть галерею', 'decormos-blocks' )
		: buttonLabel;

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
							{ currentButtonLabel }
						</Button>
					) }
				/>
			</MediaUploadCheck>
			{ hasItems ? (
				<Button variant="tertiary" isDestructive onClick={ () => onChange( [] ) }>
					{ __( 'Очистить галерею', 'decormos-blocks' ) }
				</Button>
			) : null }
			{ hasItems ? (
				<p className="decormos-media-gallery-control__count">
					{ `Выбрано изображений: ${ items.length }` }
				</p>
			) : (
				<p className="decormos-media-gallery-control__empty">{ emptyText }</p>
			) }
		</div>
	);
}
