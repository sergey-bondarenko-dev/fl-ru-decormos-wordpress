import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const IMAGE_BLOCK_NAME = 'core/image'

function addFancyboxAttribute( settings, name ) {
	if ( name !== IMAGE_BLOCK_NAME ) {
		return settings
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			openInFancybox: {
				type: 'boolean',
				default: false,
			},
		},
	}
}

const withImageFancyboxControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( props.name !== IMAGE_BLOCK_NAME ) {
			return <BlockEdit { ...props } />
		}

		const { attributes, setAttributes, isSelected } = props
		const isEnabled = Boolean( attributes.openInFancybox )

		const onToggle = ( nextValue ) => {
			const nextAttributes = {
				openInFancybox: nextValue,
			}

			if (
				nextValue &&
				( ! attributes.linkDestination || attributes.linkDestination === 'none' )
			) {
				nextAttributes.linkDestination = 'media'
			}

			setAttributes( nextAttributes )
		}

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ isSelected ? (
					<InspectorControls>
						<PanelBody
							title={ __( 'Лайтбокс', 'decormos-blocks' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Открывать в Fancybox', 'decormos-blocks' ) }
								checked={ isEnabled }
								onChange={ onToggle }
								help={
									isEnabled
										? __(
												'Изображение будет открываться в Fancybox.',
												'decormos-blocks'
										  )
										: __(
												'При включении ссылка изображения будет вести на медиафайл.',
												'decormos-blocks'
										  )
								}
							/>
						</PanelBody>
					</InspectorControls>
				) : null }
			</Fragment>
		)
	},
	'withImageFancyboxControls'
)

addFilter(
	'blocks.registerBlockType',
	'decormos-blocks/core-image-fancybox-attribute',
	addFancyboxAttribute
)

addFilter(
	'editor.BlockEdit',
	'decormos-blocks/core-image-fancybox-controls',
	withImageFancyboxControls
)
