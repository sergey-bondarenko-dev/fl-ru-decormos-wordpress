import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { tagName = 'div' } = attributes;
	const TagName = tagName;
	const blockProps = useBlockProps.save( {
		className: 'decormos-common-block',
	} );

	return (
		<TagName { ...blockProps }>
			<InnerBlocks.Content />
		</TagName>
	);
}
