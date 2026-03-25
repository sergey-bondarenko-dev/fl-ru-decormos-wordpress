import { useBlockProps } from '@wordpress/block-editor';

const IMAGE_DIMENSIONS = {
	width: 698,
	height: 452,
};

const ICON_DIMENSIONS = {
	width: 165,
	height: 100,
};

const ICON_PLACEHOLDER_SRC =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 165 100'></svg>";

function getImageTargetId( item, index ) {
	return `usage-area-image-${ item.image?.id || index + 1 }`;
}

function getWpImageClass( id ) {
	return id ? ` wp-image-${ id }` : '';
}

export default function save( { attributes } ) {
	const { items } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'usage-areas',
				'data-usage-areas': '',
			} ) }
		>
			<div className="usage-areas__content container" data-usage-areas-content>
				<div
					className="usage-areas__images usage-areas__images--active"
					data-usage-areas-images
				>
					{ items.map( ( item, index ) =>
						item.image?.url ? (
							<img
								key={ getImageTargetId( item, index ) }
								className={ `usage-areas__image${ index === 0 ? ' is-active' : '' }${ getWpImageClass( item.image.id ) }` }
								id={ getImageTargetId( item, index ) }
								data-usage-areas-image
								src={ item.image.url }
								alt={ item.image.alt || '' }
								width={ item.image.width || IMAGE_DIMENSIONS.width }
								height={ item.image.height || IMAGE_DIMENSIONS.height }
							/>
						) : null
					) }
				</div>
				<div className="usage-areas__nav" data-usage-areas-nav>
					<div className="usage-areas__nav-list" data-usage-areas-triggers>
						{ items.map( ( item, index ) => (
							<button
								type="button"
								className={ `usage-areas__button${ index === 0 ? ' is-active' : '' }` }
								data-for={ `#${ getImageTargetId( item, index ) }` }
								data-usage-areas-trigger
								key={ getImageTargetId( item, index ) }
								aria-pressed={ index === 0 ? 'true' : 'false' }
							>
								<img
									className={ `usage-areas__button-icon${ getWpImageClass( item.icon.id ) }` }
									src={ item.icon?.url || ICON_PLACEHOLDER_SRC }
									alt={ item.icon?.alt || '' }
									width={ ICON_DIMENSIONS.width }
									height={ ICON_DIMENSIONS.height }
								/>
								<span className="usage-areas__button-label">
									{ item.caption }
								</span>
							</button>
						) ) }
					</div>
				</div>
			</div>
		</div>
	);
}
