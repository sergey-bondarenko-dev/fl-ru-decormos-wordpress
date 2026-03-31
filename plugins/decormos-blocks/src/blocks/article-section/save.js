import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';
import FancyboxImage from '../../ui/FancyboxImage';

const IMAGE_SIZES =
	'(max-width: 781px) 100vw, (max-width: 1280px) 50vw, 412px';

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

export default function save( { attributes } ) {
	const { galleryId, imagePlacement, imageColumns, imageMinHeight, images } =
		attributes;
	const lightboxGroup = galleryId || 'article-section';

	return (
		<div
			{ ...useBlockProps.save( {
				className: getBlockClassName( imagePlacement, imageColumns ),
				style: {
					'--article-block-images-min-height':
						imageMinHeight || undefined,
				},
			} ) }
		>
			<div className="article-block__content">
				<div className="article-block__content-text">
					<InnerBlocks.Content />
				</div>
				<div className="article-block__content-images">
					{ images.map( ( image, index ) =>
						image?.url ? (
							<FancyboxImage
								key={ `${ image.id || 'image' }-${ index }` }
								image={ image }
								fancybox={ lightboxGroup }
								linkClassName="article-block__image-link"
								imageClassName="article-block__image"
								sizes={ IMAGE_SIZES }
							/>
						) : null
					) }
				</div>
			</div>
		</div>
	);
}
