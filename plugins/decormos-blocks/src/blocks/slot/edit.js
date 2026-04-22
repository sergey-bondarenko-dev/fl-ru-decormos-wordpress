import { __, sprintf } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

const TEMPLATE = [ [ 'core/paragraph', { placeholder: 'Fallback контент слота' } ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { name = '' } = attributes;
	const blockProps = useBlockProps( {
		className: 'decormos-slot',
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'decormos-slot__fallback',
		},
		{
			template: TEMPLATE,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slot', 'decormos-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'Имя слота', 'decormos-blocks' ) }
						value={ name }
						onChange={ ( value ) => setAttributes( { name: value } ) }
						help={ __(
							'Используй одинаковое имя в slot и slot-fill. Например: hero_content',
							'decormos-blocks'
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="decormos-slot__label">
					{ name
						? sprintf(
							/* translators: %s: slot name */
							__( 'Slot: %s', 'decormos-blocks' ),
							name
						)
						: __( 'Slot без имени', 'decormos-blocks' ) }
				</div>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
