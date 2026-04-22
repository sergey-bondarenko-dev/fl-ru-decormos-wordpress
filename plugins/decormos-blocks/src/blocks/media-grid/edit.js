import { __ } from '@wordpress/i18n';
import {
	ButtonBlockAppender,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import './editor.scss';

const TEMPLATE = [ [ 'core/image' ] ];

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps( {
		className: 'media-grid-block',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'media-grid' },
		{
			template: [ [ 'core/image' ] ],
		}
	);

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps }>
			</div>
		</div>
	);
}
