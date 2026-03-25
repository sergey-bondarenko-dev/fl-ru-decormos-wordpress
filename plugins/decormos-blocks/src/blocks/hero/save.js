import {
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

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

export default function save( { attributes } ) {
	const {
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageAlt,
		backgroundImageWidth,
		backgroundImageHeight,
		videoUrl,
		title,
		subtitle,
		description,
		showVideoOnMobileOnly,
	} = attributes;

	return (
		<section
			{ ...useBlockProps.save( {
				className: 'hero',
			} ) }
		>
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
					data-id={ backgroundImageId || undefined }
					width={ backgroundImageWidth || undefined }
					height={ backgroundImageHeight || undefined }
					fetchPriority="high"
					loading="eager"
					sizes="100vw"
				/>
			) : null }
			<div className="hero__inner container">
				<div className="hero__title-wrapper">
					<RichText.Content
						tagName="h1"
						className="hero__title"
						value={ title }
					/>
					<RichText.Content
						tagName="h2"
						className="hero__subtitle"
						value={ subtitle }
					/>
				</div>
				<RichText.Content
					tagName="div"
					className="hero__description"
					value={ description }
				/>
				<div className="hero__inner-blocks">
					<InnerBlocks.Content />
				</div>
			</div>
		</section>
	);
}
