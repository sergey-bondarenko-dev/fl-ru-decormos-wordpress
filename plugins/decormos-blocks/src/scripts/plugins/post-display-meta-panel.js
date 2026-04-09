import { PluginDocumentSettingPanel } from '@wordpress/editor'
import { useDispatch, useSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import { __ } from '@wordpress/i18n'
import { TextareaControl, TextControl } from '@wordpress/components'

function DecormosPostDisplayMetaPanel() {
	const { editPost } = useDispatch( 'core/editor' )

	const { postType, meta } = useSelect(
		( select ) => ( {
			postType: select( 'core/editor' ).getCurrentPostType(),
			meta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		} ),
		[]
	)

	if ( postType !== 'post' ) {
		return null
	}

	const updateMetaValue = ( key, value ) => {
		editPost( {
			meta: {
				...meta,
				[ key ]: value,
			},
		} )
	}

	return (
		<PluginDocumentSettingPanel
			name="decormos-post-display-meta-panel"
			title={ __( 'Decormos: поля записи', 'decormos-blocks' ) }
		>
			<TextControl
				label={ __( 'Подзаголовок', 'decormos-blocks' ) }
				value={ meta.decormos_post_subtitle || '' }
				onChange={ ( value ) => updateMetaValue( 'decormos_post_subtitle', value ) }
			/>
			<TextareaControl
				label={ __( 'Описание', 'decormos-blocks' ) }
				value={ meta.decormos_post_description || '' }
				onChange={ ( value ) =>
					updateMetaValue( 'decormos_post_description', value )
				}
			/>
		</PluginDocumentSettingPanel>
	)
}

registerPlugin( 'decormos-post-display-meta-panel', {
	render: DecormosPostDisplayMetaPanel,
} )
