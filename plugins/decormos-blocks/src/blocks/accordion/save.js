import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { buildAccordionStyles } from './utils';

export default function save( { attributes } ) {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'accordion',
				id: attributes.id || undefined,
				style: buildAccordionStyles( attributes ),
			} ) }
		>
			<InnerBlocks.Content />
		</div>
	);
}
