import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'decormos-slot-fill',
			} ) }
		>
			<div className="decormos-slot-fill__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
