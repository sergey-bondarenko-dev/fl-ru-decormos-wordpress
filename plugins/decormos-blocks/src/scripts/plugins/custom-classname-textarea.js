import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { InspectorControls } from '@wordpress/block-editor'
import { getBlockType, hasBlockSupport } from '@wordpress/blocks'
import { PanelBody, TextareaControl } from '@wordpress/components'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const withCustomClassnameTextarea = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes, isSelected } = props
		const blockType = getBlockType( name )

		if (
			! blockType ||
			! hasBlockSupport( blockType, 'customClassName', true )
		) {
			return <BlockEdit { ...props } />
		}

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ isSelected ? (
					<InspectorControls>
						<PanelBody
							title={ __( 'Дополнительные CSS классы', 'decormos-blocks' ) }
							initialOpen={ true }
						>
							<TextareaControl
								label={ __( 'Классы', 'decormos-blocks' ) }
								help={ __(
									'Можно указывать классы через пробел или с новой строки.',
									'decormos-blocks'
								) }
								rows={ 4 }
								value={ attributes.className || '' }
								onChange={ ( className ) => setAttributes( { className } ) }
							/>
						</PanelBody>
					</InspectorControls>
				) : null }
			</Fragment>
		)
	},
	'withCustomClassnameTextarea'
)

addFilter(
	'editor.BlockEdit',
	'decormos-blocks/custom-classname-textarea',
	withCustomClassnameTextarea
)
