import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Notice, PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

const TEMPLATE = [ [ 'core/paragraph', { placeholder: 'Контент для слота' } ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { name = '' } = attributes;
	const blockProps = useBlockProps( {
		className: 'decormos-slot-fill',
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'decormos-slot-fill__content',
		},
		{
			template: TEMPLATE,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slot Fill', 'decormos-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'Имя слота', 'decormos-blocks' ) }
						value={ name }
						onChange={ ( value ) => setAttributes( { name: value } ) }
						help={ __(
							'Должно совпадать с именем блока Slot в шаблоне.',
							'decormos-blocks'
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="decormos-slot-fill__label">
					{ name
						? `Slot Fill: ${ name }`
						: __( 'Slot Fill без имени', 'decormos-blocks' ) }
				</div>
				{ name ? null : (
					<Notice status="warning" isDismissible={ false }>
						{ __( 'Укажи имя слота, иначе этот контент не будет использован.', 'decormos-blocks' ) }
					</Notice>
				) }
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
