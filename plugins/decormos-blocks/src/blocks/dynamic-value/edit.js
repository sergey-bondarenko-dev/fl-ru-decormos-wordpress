import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Placeholder, Spinner } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import DynamicSourceControl from '../../ui/DynamicSourceControl';
import './editor.scss';

function PreviewPlaceholder( { text } ) {
	return (
		<Placeholder className="decormos-dynamic-value-preview-placeholder">
			<Spinner />
			<p>{ text }</p>
		</Placeholder>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		sourceType = 'wp_function',
		sourceConfig = {},
		fallback,
	} = attributes;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Настройки динамического значения', 'decormos-blocks' ) }
					initialOpen={ true }
				>
					<DynamicSourceControl
						sourceType={ sourceType }
						sourceConfig={ sourceConfig }
						fallback={ fallback }
						onSourceTypeChange={ ( value ) =>
							setAttributes( { sourceType: value } )
						}
						onSourceConfigChange={ ( value ) =>
							setAttributes( { sourceConfig: value } )
						}
						onFallbackChange={ ( value ) =>
							setAttributes( { fallback: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender
				block="decormos/dynamic-value"
				attributes={ attributes }
				LoadingResponsePlaceholder={ () => (
					<PreviewPlaceholder
						text={ __( 'Загружаем предпросмотр…', 'decormos-blocks' ) }
					/>
				) }
				EmptyResponsePlaceholder={ () => (
					<PreviewPlaceholder
						text={ __( 'Предпросмотр недоступен', 'decormos-blocks' ) }
					/>
				) }
			/>
		</div>
	);
}
