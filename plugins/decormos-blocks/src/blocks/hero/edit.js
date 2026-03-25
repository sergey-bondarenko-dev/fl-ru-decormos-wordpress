import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

function getVideoClassName( showVideoOnMobileOnly ) {
	return showVideoOnMobileOnly
		? 'hero__video-bg hero__video-bg--mobile-only'
		: 'hero__video-bg';
}

function getBackgroundImageClassName( backgroundImageId ) {
	return backgroundImageId
		? `hero__bg wp-image-${ backgroundImageId }`
		: 'hero__bg';
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageAlt,
		backgroundImageWidth,
		backgroundImageHeight,
		videoId,
		videoUrl,
		title,
		subtitle,
		description,
		showVideoOnMobileOnly,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'hero',
	} );

	const onSelectBackgroundImage = ( media ) => {
		setAttributes( {
			backgroundImageId: media?.id ?? 0,
			backgroundImageUrl: media?.url ?? '',
			backgroundImageAlt: media?.alt ?? '',
			backgroundImageWidth: media?.width ?? 0,
			backgroundImageHeight: media?.height ?? 0,
		} );
	};

	const onRemoveBackgroundImage = () => {
		setAttributes( {
			backgroundImageId: 0,
			backgroundImageUrl: '',
			backgroundImageAlt: '',
			backgroundImageWidth: 0,
			backgroundImageHeight: 0,
		} );
	};

	const onSelectVideo = ( media ) => {
		setAttributes( {
			videoId: media?.id ?? 0,
			videoUrl: media?.url ?? '',
		} );
	};

	const onRemoveVideo = () => {
		setAttributes( {
			videoId: 0,
			videoUrl: '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Медиа', 'decormos-blocks' ) } initialOpen>
					<BaseControl
						label={ __( 'Фоновое изображение', 'decormos-blocks' ) }
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectBackgroundImage }
								allowedTypes={ [ 'image' ] }
								value={ backgroundImageId }
								render={ ( { open } ) => (
									<div className="decormos-hero-editor__media-actions">
										<Button variant="secondary" onClick={ open }>
											{ backgroundImageId
												? __( 'Заменить изображение', 'decormos-blocks' )
												: __( 'Выбрать изображение', 'decormos-blocks' ) }
										</Button>
										{ backgroundImageId ? (
											<Button
												variant="tertiary"
												onClick={ onRemoveBackgroundImage }
											>
												{ __( 'Удалить изображение', 'decormos-blocks' ) }
											</Button>
										) : null }
									</div>
								) }
							/>
						</MediaUploadCheck>
					</BaseControl>
					<BaseControl label={ __( 'Фоновое видео', 'decormos-blocks' ) }>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectVideo }
								allowedTypes={ [ 'video' ] }
								value={ videoId }
								render={ ( { open } ) => (
									<div className="decormos-hero-editor__media-actions">
										<Button variant="secondary" onClick={ open }>
											{ videoId
												? __( 'Заменить видео', 'decormos-blocks' )
												: __( 'Выбрать видео', 'decormos-blocks' ) }
										</Button>
										{ videoId ? (
											<Button variant="tertiary" onClick={ onRemoveVideo }>
												{ __( 'Удалить видео', 'decormos-blocks' ) }
											</Button>
										) : null }
									</div>
								) }
							/>
						</MediaUploadCheck>
					</BaseControl>
					<ToggleControl
						label={ __( 'Показывать видео только на мобильных', 'decormos-blocks' ) }
						checked={ showVideoOnMobileOnly }
						onChange={ ( value ) =>
							setAttributes( { showVideoOnMobileOnly: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<section { ...blockProps }>
				{ videoUrl ? (
					<video
						className={ getVideoClassName( showVideoOnMobileOnly ) }
						playsInline
						autoPlay
						muted
						loop
						preload="auto"
						src={ videoUrl }
					/>
				) : null }
				{ backgroundImageUrl ? (
					<img
						className={ getBackgroundImageClassName( backgroundImageId ) }
						src={ backgroundImageUrl }
						alt={ backgroundImageAlt || '' }
						width={ backgroundImageWidth || undefined }
						height={ backgroundImageHeight || undefined }
						fetchPriority="high"
						loading="eager"
						sizes="100vw"
					/>
				) : (
					<div className="hero__bg hero__bg--placeholder">
						{ __( 'Выберите фоновое изображение', 'decormos-blocks' ) }
					</div>
				) }
				<div className="hero__inner container">
					<div className="hero__title-wrapper">
						<RichText
							tagName="h1"
							className="hero__title"
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Заголовок hero-блока', 'decormos-blocks' ) }
							allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
						/>
						<RichText
							tagName="h2"
							className="hero__subtitle"
							value={ subtitle }
							onChange={ ( value ) => setAttributes( { subtitle: value } ) }
							placeholder={ __( 'Подзаголовок hero-блока', 'decormos-blocks' ) }
							allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
						/>
					</div>
					<RichText
						tagName="div"
						className="hero__description"
						value={ description }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						placeholder={ __(
							'Опишите предложение, преимущества или добавьте произвольный список',
							'decormos-blocks'
						) }
					/>
					<div className="hero__form block-form">
						<InnerBlocks />
					</div>
				</div>
			</section>
		</>
	);
}
