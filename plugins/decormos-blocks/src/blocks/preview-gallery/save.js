import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function getImageValue( image ) {
	return {
		id: image?.id || 0,
		url: image?.url || '',
		originalUrl: image?.originalUrl || image?.url || '',
		alt: image?.alt || '',
		width: image?.width || 0,
		height: image?.height || 0,
	};
}

function normalizeImages( images = [] ) {
	return images.filter( ( image ) => image?.url ).map( getImageValue );
}

export default function save( { attributes } ) {
	const images = normalizeImages( attributes.images );
	const previewImage = images[ 0 ];
	const lightboxGroup = attributes.lightboxId || 'preview-gallery';
	const minHeight = attributes.minHeight || '360px';

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'preview-gallery-block',
				style: {
					'--preview-gallery-min-height': minHeight,
				},
			} ) }
		>
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
				{ previewImage?.originalUrl ? (
					<a
						href={ previewImage.originalUrl }
						data-fancybox={ lightboxGroup }
						className="preview-gallery__trigger"
						aria-label="Открыть галерею"
					/>
				) : null }
				<div className="preview-gallery__content">
					<InnerBlocks.Content />
				</div>
				{ images.length > 1 ? (
					<div className="preview-gallery__lightbox-links" aria-hidden="true">
						{ images.slice( 1 ).map( ( image, index ) =>
							image?.originalUrl ? (
								<a
									key={ `${ image.id || 'image' }-${ index + 1 }` }
									href={ image.originalUrl }
									data-fancybox={ lightboxGroup }
									tabIndex="-1"
									aria-hidden="true"
								/>
							) : null
						) }
					</div>
				) : null }
			</div>
		</div>
	);
}
