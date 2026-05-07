import { InspectorControls, BlockControls } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { PanelBody, ToggleControl, ToolbarButton } from '@wordpress/components'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const SUPPORTED_BLOCKS = [
	'core/group',
	'core/columns',
	'core/column',
	'core/cover',
	'decormos/section',
]

function supportsContentOnlyTemplateLock( name ) {
	return SUPPORTED_BLOCKS.includes( name )
}

function addTemplateLockAttribute( settings, name ) {
	if ( ! supportsContentOnlyTemplateLock( name ) ) {
		return settings
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			templateLock: settings.attributes?.templateLock ?? {
				type: 'string',
			},
		},
	}
}

const withContentOnlyTemplateLockControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes, isSelected } = props

		if ( ! supportsContentOnlyTemplateLock( name ) ) {
			return <BlockEdit { ...props } />
		}

		const isContentOnly = attributes.templateLock === 'contentOnly'

		const setContentOnly = ( nextValue ) => {
			setAttributes( {
				templateLock: nextValue ? 'contentOnly' : undefined,
			} )
		}

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ isSelected ? (
					<Fragment>
						<BlockControls>
							<ToolbarButton
								icon={ isContentOnly ? 'lock' : 'unlock' }
								label={
									isContentOnly
										? __(
												'Отключить режим редактирования только контента',
												'decormos-blocks'
										  )
										: __(
												'Включить режим редактирования только контента',
												'decormos-blocks'
										  )
								}
								isPressed={ isContentOnly }
								onClick={ () => setContentOnly( ! isContentOnly ) }
							/>
						</BlockControls>
						<InspectorControls>
							<PanelBody
								title={ __( 'Редактирование контента', 'decormos-blocks' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __(
										'Разрешить редактировать только контент',
										'decormos-blocks'
									) }
									checked={ isContentOnly }
									onChange={ setContentOnly }
									help={ __(
										'Внутри контейнера останутся доступны только контентные блоки и атрибуты.',
										'decormos-blocks'
									) }
								/>
							</PanelBody>
						</InspectorControls>
					</Fragment>
				) : null }
			</Fragment>
		)
	},
	'withContentOnlyTemplateLockControls'
)

addFilter(
	'blocks.registerBlockType',
	'decormos-blocks/content-only-template-lock-attribute',
	addTemplateLockAttribute
)

addFilter(
	'editor.BlockEdit',
	'decormos-blocks/content-only-template-lock-controls',
	withContentOnlyTemplateLockControls
)
