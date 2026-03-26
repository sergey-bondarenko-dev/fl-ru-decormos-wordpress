import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import TechMarkup from './template';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { type } = attributes;
	const blockProps = useBlockProps( {
		className: 'tech',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки блока', 'decormos-blocks' ) } initialOpen>
					<SelectControl
						label={ __( 'Показывать', 'decormos-blocks' ) }
						value={ type }
						options={ [
							{
								label: __( 'Пол и стены', 'decormos-blocks' ),
								value: 'both',
							},
							{
								label: __( 'Только пол', 'decormos-blocks' ),
								value: 'floor',
							},
							{
								label: __( 'Только стены', 'decormos-blocks' ),
								value: 'wall',
							},
						] }
						onChange={ ( value ) => setAttributes( { type: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<TechMarkup type={ type } />
			</div>
		</>
	);
}
