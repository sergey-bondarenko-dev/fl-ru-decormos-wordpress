import { InspectorControls, useBlockProps } from '@wordpress/block-editor'
import {
	Notice,
	PanelBody,
	Placeholder,
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './editor.scss'

const DEFAULT_WIDTH = 640
const DEFAULT_HEIGHT = 360

const normalizeDimension = ( value, fallback ) => {
	const numericValue = Number( value )

	if ( Number.isNaN( numericValue ) || numericValue <= 0 ) {
		return fallback
	}

	return Math.round( numericValue )
}

const extractAttribute = ( iframeCode, attributeName ) => {
	const pattern = new RegExp( `${ attributeName }=["']([^"']+)["']`, 'i' )
	const match = iframeCode.match( pattern )

	return match?.[ 1 ] || ''
}

const isAllowedIframeSrc = ( value ) => {
	if ( ! value ) {
		return false
	}

	try {
		const url = new URL( value )
		const hostname = url.hostname.toLowerCase()
		const pathname = url.pathname.toLowerCase()
		const allowedHosts = [ 'vkvideo.ru', 'www.vkvideo.ru', 'vk.com', 'www.vk.com' ]
		const allowedPaths = [ '/video_ext.php', '/clip_ext.php' ]

		return (
			url.protocol === 'https:' &&
			allowedHosts.includes( hostname ) &&
			allowedPaths.includes( pathname )
		)
	} catch ( error ) {
		return false
	}
}

const parseIframeCode = ( value ) => {
	const iframeCode = value.trim()
	const src = extractAttribute( iframeCode, 'src' ).replaceAll( '&amp;', '&' )
	const width = normalizeDimension(
		extractAttribute( iframeCode, 'width' ),
		DEFAULT_WIDTH
	)
	const height = normalizeDimension(
		extractAttribute( iframeCode, 'height' ),
		DEFAULT_HEIGHT
	)
	const title = extractAttribute( iframeCode, 'title' )
	const allow = extractAttribute( iframeCode, 'allow' )
	const allowFullScreen =
		/\sallowfullscreen(?:=["'][^"']*["'])?/i.test( iframeCode )

	return {
		iframeCode,
		src,
		width,
		height,
		title: title || __( 'Встроенное видео', 'decormos-blocks' ),
		allow:
			allow ||
			'autoplay; encrypted-media; fullscreen; picture-in-picture',
		allowFullScreen,
	}
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		iframeCode,
		src,
		width,
		height,
		title,
		allow,
		allowFullScreen,
	} = attributes
	const isValidSrc = isAllowedIframeSrc( src )
	const aspectRatio = `${ normalizeDimension(
		width,
		DEFAULT_WIDTH
	) } / ${ normalizeDimension( height, DEFAULT_HEIGHT ) }`
	const blockProps = useBlockProps( {
		className: 'decormos-iframe-embed',
	} )

	const updateIframeCode = ( value ) => {
		setAttributes( parseIframeCode( value ) )
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Настройки iframe', 'decormos-blocks' ) }
					initialOpen
				>
					<TextareaControl
						label={ __( 'Код iframe', 'decormos-blocks' ) }
						value={ iframeCode }
						onChange={ updateIframeCode }
						rows={ 6 }
						help={ __(
							'Вставьте код для встраивания. Блок сохранит только iframe из разрешенного источника.',
							'decormos-blocks'
						) }
					/>
					<TextControl
						label={ __( 'Title для iframe', 'decormos-blocks' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					<TextControl
						label={ __( 'Allow', 'decormos-blocks' ) }
						value={ allow }
						onChange={ ( value ) => setAttributes( { allow: value } ) }
					/>
					<ToggleControl
						label={ __( 'Разрешить fullscreen', 'decormos-blocks' ) }
						checked={ Boolean( allowFullScreen ) }
						onChange={ ( value ) =>
							setAttributes( { allowFullScreen: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ src && isValidSrc ? (
					<div
						className="decormos-iframe-embed__frame"
						style={ {
							'--decormos-iframe-embed-aspect-ratio': aspectRatio,
						} }
					>
						<iframe
							src={ src }
							title={ title || __( 'Встроенное видео', 'decormos-blocks' ) }
							allow={ allow }
							allowFullScreen={ Boolean( allowFullScreen ) }
						/>
					</div>
				) : (
					<Placeholder
						label={ __( 'Iframe Embed', 'decormos-blocks' ) }
						instructions={ __(
							'Вставьте iframe-код в настройках блока справа.',
							'decormos-blocks'
						) }
					>
						{ src && ! isValidSrc ? (
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'Этот iframe не входит в список разрешенных источников.',
									'decormos-blocks'
								) }
							</Notice>
						) : null }
					</Placeholder>
				) }
			</div>
		</>
	)
}
