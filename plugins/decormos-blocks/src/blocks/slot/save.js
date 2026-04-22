import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'decormos-slot',
			} ) }
		>
			<div className="decormos-slot__fallback">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
