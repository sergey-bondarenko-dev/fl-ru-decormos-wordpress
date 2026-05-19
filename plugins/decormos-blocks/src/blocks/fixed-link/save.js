/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

const DEFAULT_LINK = {
	svg: '',
	label: 'Телеграм',
	href: 'https://t.me/bombamvam',
};

function normalizeLinks( attributes ) {
	if ( attributes.links?.length ) {
		return attributes.links;
	}

	return [
		{
			svg: attributes.svg || DEFAULT_LINK.svg,
			label: attributes.label || DEFAULT_LINK.label,
			href: attributes.href || DEFAULT_LINK.href,
		},
	];
}

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} root0            Save props.
 * @param {Object} root0.attributes Block attributes.
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const links = normalizeLinks( attributes );

	const blockProps = useBlockProps.save( {
		className: 'fixed-link fixed-scroll-compensate',
	} );

	return (
		<div { ...blockProps }>
			<span>
				{ 'Напишите ' }
				<span className="collapse">{ 'нам в:' }</span>
			</span>
			<span className="fixed-link__icons">
				{ links.map( ( item, index ) => (
					<a
						className="fixed-link__icon icon"
						href={ item.href || '#' }
						target="_blank"
						rel="noopener noreferrer"
						aria-label={ item.label || undefined }
						title={ item.label || undefined }
						key={ index }
					>
						{ item.svg ? (
							<img
								src={ item.svg }
								alt=""
								width={ 44 }
								height={ 44 }
							/>
						) : null }
					</a>
				) ) }
			</span>
		</div>
	);
}
