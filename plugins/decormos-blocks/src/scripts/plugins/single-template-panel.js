import { PluginDocumentSettingPanel } from '@wordpress/editor'
import { useSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import { __ } from '@wordpress/i18n'

const TEMPLATE_SLUG_CANDIDATES = [
	'single-post-article',
	'single-post-article.html',
	'decormos-theme//single-post-article',
]

function normalizeTemplateSlug( template ) {
	return String( template || '' ).trim().toLowerCase()
}

function isSingleTemplate( template ) {
	const normalizedTemplate = normalizeTemplateSlug( template )

	if ( ! normalizedTemplate ) {
		return false
	}

	if ( TEMPLATE_SLUG_CANDIDATES.includes( normalizedTemplate ) ) {
		return true
	}

	return normalizedTemplate.endsWith( '/single' ) || normalizedTemplate.endsWith( '/single.html' )
		|| normalizedTemplate.endsWith( '/single-post-article' )
		|| normalizedTemplate.endsWith( '/single-post-article.html' )
}

function DecormosSingleTemplatePanel() {
	const { postType, template } = useSelect( ( select ) => ( {
		postType: select( 'core/editor' ).getCurrentPostType(),
		template: select( 'core/editor' ).getEditedPostAttribute( 'template' ),
	} ), [] )

	if ( postType !== 'post' || ! isSingleTemplate( template ) ) {
		return null
	}

	return (
		<PluginDocumentSettingPanel
			name="single-template-panel"
			title={ __( 'Decormos: отдельная запись', 'decormos-blocks' ) }
		>
			<p>{ __( 'Панель видна только для записей с выбранным шаблоном отдельной записи.', 'decormos-blocks' ) }</p>
			<p>
				<strong>{ __( 'Текущий шаблон:', 'decormos-blocks' ) }</strong>{ ' ' }
				<code>{ template }</code>
			</p>
		</PluginDocumentSettingPanel>
	)
}

registerPlugin( 'decormos-single-template-panel', {
	render: DecormosSingleTemplatePanel,
} )
