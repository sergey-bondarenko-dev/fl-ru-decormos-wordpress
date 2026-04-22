import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import './editor.scss';

const TAG_OPTIONS = [
	{ label: 'div', value: 'div' },
	{ label: 'section', value: 'section' },
	{ label: 'article', value: 'article' },
	{ label: 'aside', value: 'aside' },
	{ label: 'main', value: 'main' },
	{ label: 'header', value: 'header' },
	{ label: 'footer', value: 'footer' },
	{ label: 'nav', value: 'nav' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { tagName = 'div' } = attributes;
	const TagName = tagName;

	const blockProps = useBlockProps( {
		className: 'decormos-common-block',
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Контейнер', 'decormos-blocks' ) }
					initialOpen
				>
					<SelectControl
						label={ __( 'HTML тег', 'decormos-blocks' ) }
						value={ tagName }
						options={ TAG_OPTIONS }
						onChange={ ( value ) => setAttributes( { tagName: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
