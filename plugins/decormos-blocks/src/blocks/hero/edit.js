import { __ } from '@wordpress/i18n';
import { getBlockDefaultClassName } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import useMediaData from '../../hooks/useMediaData';
import MediaPickerControl from '../../ui/MediaPickerControl';
import { createBem } from '../../utils/bem';
import getWpImageClass from '../../utils/getWpImageClass';
import './editor.scss';

const BLOCK_NAME = 'decormos/hero';
const blockClassName = getBlockDefaultClassName( BLOCK_NAME );
const bem = createBem( blockClassName );

function getBackgroundImageClassName( backgroundImageId ) {
	const imageClassName = bem( 'bg' );
	const wpImageClassName = getWpImageClass( backgroundImageId );

	return wpImageClassName
		? `${ imageClassName } ${ wpImageClassName }`
		: imageClassName;
}

function getVideoClassName( showVideoOnMobileOnly ) {
	return bem( 'video-bg', {
		'mobile-only': showVideoOnMobileOnly,
	} );
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		backgroundImageId,
		usePostImage,
		backgroundVideoId,
		showVideoOnMobileOnly,
		usePostVideoSettings,
		considerHeaderOffset,
		headerSelector,
		heroBackgroundOpacity,
	} = attributes;

	const backgroundImage = useMediaData( backgroundImageId );
	const backgroundVideo = useMediaData( backgroundVideoId );

	const blockProps = useBlockProps({
		className: 'alignfull',
		style: {
			'--heroBackgroundOpacity': heroBackgroundOpacity,
		},
	});

	const onSelectBackgroundImage = ( media = {} ) => {
		setAttributes( {
			backgroundImageId: media?.id ?? 0,
		} );
	};

	const onRemoveBackgroundImage = () => {
		setAttributes( {
			backgroundImageId: 0,
		} );
	};

	const onSelectVideo = ( media = {} ) => {
		setAttributes( {
			backgroundVideoId: media?.id ?? 0,
		} );
	};

	const onRemoveVideo = () => {
		setAttributes( {
			backgroundVideoId: 0,
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Медиа', 'decormos-blocks' ) } initialOpen>
					<ToggleControl
						label={ __( 'Использовать изображение записи', 'decormos-blocks' ) }
						checked={ usePostImage }
						onChange={ ( value ) => setAttributes( { usePostImage: value } ) }
					/>
					<BaseControl label={ __( 'Фоновое изображение', 'decormos-blocks' ) } >
						<MediaPickerControl
							value={ backgroundImageId }
							onSelect={ onSelectBackgroundImage }
							onRemove={ onRemoveBackgroundImage }
							allowedTypes={ [ 'image' ] }
							disabled={ usePostImage }
							selectLabel={ __( 'Выбрать изображение', 'decormos-blocks' ) }
							replaceLabel={ __( 'Заменить изображение', 'decormos-blocks' ) }
							removeLabel={ __( 'Удалить изображение', 'decormos-blocks' ) }
							className={ bem( 'media-actions' ) }
						/>
					</BaseControl>
					<ToggleControl
						label={ __(
							'Использовать параметры видео от записи',
							'decormos-blocks'
						) }
						checked={ usePostVideoSettings }
						onChange={ ( value ) =>
							setAttributes( { usePostVideoSettings: value } )
						}
					/>
					<BaseControl label={ __( 'Фоновое видео', 'decormos-blocks' ) }>
						<MediaPickerControl
							value={ backgroundVideoId }
							onSelect={ onSelectVideo }
							onRemove={ onRemoveVideo }
							allowedTypes={ [ 'video' ] }
							disabled={ usePostVideoSettings }
							selectLabel={ __( 'Выбрать видео', 'decormos-blocks' ) }
							replaceLabel={ __( 'Заменить видео', 'decormos-blocks' ) }
							removeLabel={ __( 'Удалить видео', 'decormos-blocks' ) }
							className={ bem( 'media-actions' ) }
						/>
					</BaseControl>
					<ToggleControl
						label={ __( 'Показывать видео только на мобильных', 'decormos-blocks' ) }
						checked={ showVideoOnMobileOnly }
						onChange={ ( value ) =>
							setAttributes( { showVideoOnMobileOnly: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Учитывать шапку', 'decormos-blocks' ) }
						checked={ considerHeaderOffset }
						onChange={ ( value ) =>
							setAttributes( { considerHeaderOffset: value } )
						}
					/>
					{ considerHeaderOffset ? (
						<TextControl
							label={ __( 'Селектор шапки', 'decormos-blocks' ) }
							value={ headerSelector || '' }
							onChange={ ( value ) =>
								setAttributes( { headerSelector: value || '.header' } )
							}
							help={ __(
								'Например: .header, #masthead, .site-header',
								'decormos-blocks'
							) }
						/>
					) : null }
					<RangeControl
						label={ __( 'Прозрачность затемнения фона', 'decormos-blocks' ) }
						value={ heroBackgroundOpacity }
						onChange={ ( value ) =>
							setAttributes( {
								heroBackgroundOpacity:
									typeof value === 'number' ? value : 0.3,
							} )
						}
						min={ 0 }
						max={ 1 }
						step={ 0.05 }
					/>
				</PanelBody>
			</InspectorControls>
			<section { ...blockProps }>
				{ backgroundVideo.url && (
					<video
						className={ getVideoClassName( showVideoOnMobileOnly ) }
						playsInline
						autoPlay
						muted
						loop
						preload="auto"
						src={ backgroundVideo.url }
					/>
				) }
				{ backgroundImage.url ? (
					<img
						className={ getBackgroundImageClassName( backgroundImageId ) }
						src={ backgroundImage.url }
						alt={ backgroundImage.alt || '' }
						width={ backgroundImage.width || undefined }
						height={ backgroundImage.height || undefined }
						fetchPriority="high"
						loading="eager"
						sizes="100vw"
					/>
				) : (
					<div
						className={ `${ bem( 'bg', { placeholder: true } ) } empty-media-placeholder` }
					/>
				) }
				<div className={ bem( 'inner' ) }>
					<InnerBlocks />
				</div>
			</section>
		</>
	);
}
