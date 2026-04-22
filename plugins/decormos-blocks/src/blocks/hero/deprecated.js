import { InnerBlocks } from '@wordpress/block-editor';

const deprecated = [
	{
		save: () => <InnerBlocks.Content />,
	},
];

export default deprecated;
