import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'media-grid-block',
			} ) }
		>
			<div className="media-grid">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}