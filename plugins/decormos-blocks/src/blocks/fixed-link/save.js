/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { svg, label, href } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'fixed-link fixed-scroll-compensate',
		href,
		target: '_blank',
		rel: 'noopener noreferrer',
	} );

	return (
		<a { ...blockProps }>
			<span>
				{ 'Напишите ' }
				<span className="collapse">{ 'нам в:' }</span>
			</span>
			<span className="icon" aria-label={ label } title={ label }>
				<img src={ svg } alt="" width={ 44 } height={ 44 } />
			</span>
		</a>
	);
}
